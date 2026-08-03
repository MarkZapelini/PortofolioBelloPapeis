import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { calculateDiscount, calculateShipping } from "../utils/cart.js";
import { AppError } from "../utils/http.js";

const itemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
});

const couponSchema = z.object({
  code: z.string().min(3),
});

async function ensureCart(userId: string) {
  const existing = await prisma.cart.findUnique({
    where: { userId },
    include: {
      coupon: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (existing) return existing;

  return prisma.cart.create({
    data: { userId },
    include: {
      coupon: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

function mapCart(cart: Awaited<ReturnType<typeof ensureCart>>) {
  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const discount = calculateDiscount(subtotal, cart.coupon);
  const shippingCost = cart.items.length ? calculateShipping(cart.items) : 0;
  const total = subtotal - discount + shippingCost;

  return {
    ...cart,
    summary: {
      subtotal,
      discount,
      shippingCost,
      total,
    },
  };
}

export const cartService = {
  async getCart(userId: string) {
    const cart = await ensureCart(userId);
    return mapCart(cart);
  },

  async addItem(userId: string, payload: unknown) {
    const data = itemSchema.parse(payload);
    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product || !product.isActive) throw new AppError("Produto não disponível.", 404);

    const cart = await ensureCart(userId);
    const existing = cart.items.find((item) => item.productId === data.productId);
    const nextQuantity = (existing?.quantity ?? 0) + data.quantity;
    if (product.stock < nextQuantity) throw new AppError("Estoque insuficiente.", 400);

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: data.productId,
        },
      },
      update: {
        quantity: {
          increment: data.quantity,
        },
      },
      create: {
        cartId: cart.id,
        productId: data.productId,
        quantity: data.quantity,
      },
    });

    return this.getCart(userId);
  },

  async updateItem(userId: string, itemId: string, payload: unknown) {
    const data = z.object({ quantity: z.coerce.number().int().positive() }).parse(payload);
    const cart = await ensureCart(userId);
    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: { product: true },
    });
    if (!item) throw new AppError("Item do carrinho não encontrado.", 404);
    if (item.product.stock < data.quantity) throw new AppError("Estoque insuficiente.", 400);

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: data.quantity },
    });

    return this.getCart(userId);
  },

  async removeItem(userId: string, itemId: string) {
    const cart = await ensureCart(userId);
    await prisma.cartItem.deleteMany({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });
    return this.getCart(userId);
  },

  async applyCoupon(userId: string, payload: unknown) {
    const data = couponSchema.parse(payload);
    const cart = await ensureCart(userId);
    const coupon = await prisma.coupon.findUnique({ where: { code: data.code } });
    if (!coupon || !coupon.isActive) throw new AppError("Cupom inválido.", 404);

    await prisma.cart.update({
      where: { id: cart.id },
      data: { couponId: coupon.id },
    });

    return this.getCart(userId);
  },
};
