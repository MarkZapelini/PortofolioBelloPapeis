import { OrderStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { calculateDiscount, calculateShipping } from "../utils/cart.js";
import { AppError } from "../utils/http.js";

const createOrderSchema = z.object({
  addressId: z.string().min(1),
  paymentMethod: z.string().min(2),
  notes: z.string().optional(),
});

export const orderService = {
  async listOrders(userId: string, role: string) {
    return prisma.order.findMany({
      where: role === "ADMIN" ? undefined : { userId },
      orderBy: { createdAt: "desc" },
      include: {
        address: true,
        items: {
          include: {
            product: true,
          },
        },
        coupon: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async getOrder(userId: string, role: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        ...(role === "ADMIN" ? {} : { userId }),
      },
      include: {
        address: true,
        items: {
          include: { product: true },
        },
        coupon: true,
      },
    });
    if (!order) throw new AppError("Pedido não encontrado.", 404);
    return order;
  },

  async createOrder(userId: string, payload: unknown) {
    const data = createOrderSchema.parse(payload);
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        coupon: true,
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) throw new AppError("Carrinho vazio.", 400);

    const address = await prisma.address.findFirst({
      where: {
        id: data.addressId,
        userId,
      },
    });
    if (!address) throw new AppError("Endereço não encontrado.", 404);

    const subtotal = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const discount = calculateDiscount(subtotal, cart.coupon);
    const shippingCost = calculateShipping(cart.items);
    const total = subtotal - discount + shippingCost;

    const order = await prisma.$transaction(async (tx) => {
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new AppError(`Estoque insuficiente para ${item.product.name}.`, 400);
        }
      }

      const createdOrder = await tx.order.create({
        data: {
          code: `PED-${Date.now()}`,
          paymentMethod: data.paymentMethod,
          notes: data.notes,
          subtotal,
          discount,
          shippingCost,
          total,
          userId,
          addressId: data.addressId,
          couponId: cart.couponId ?? undefined,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
              totalPrice: Number(item.product.price) * item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      await Promise.all(
        cart.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          }),
        ),
      );

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.update({ where: { id: cart.id }, data: { couponId: null } });

      return createdOrder;
    });

    return order;
  },

  async updateStatus(orderId: string, payload: unknown) {
    const data = z.object({ status: z.nativeEnum(OrderStatus) }).parse(payload);
    return prisma.order.update({
      where: { id: orderId },
      data: { status: data.status },
    });
  },
};
