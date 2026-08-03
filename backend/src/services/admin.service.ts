import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export const adminService = {
  async dashboard() {
    const [orders, products, customers] = await Promise.all([
      prisma.order.findMany({
        include: { items: true },
      }),
      prisma.product.findMany(),
      prisma.user.findMany({
        where: { role: Role.CUSTOMER },
      }),
    ]);

    const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const productsSold = orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0);
    }, 0);

    return {
      totalSales,
      productsSold,
      lowStock: products.filter((product) => product.stock < 20).length,
      customers: customers.length,
      pendingOrders: orders.filter((order) => order.status === "PENDING").length,
      charts: {
        salesByMonth: [32, 44, 39, 57, 62, 68, 74, 72, 81, 77, 83, 91],
        stockCritical: products.filter((product) => product.stock < 20).map((product) => ({
          name: product.name,
          stock: product.stock,
        })),
      },
    };
  },

  async salesReport() {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.map((order) => ({
      code: order.code,
      total: Number(order.total),
      status: order.status,
      customer: order.user.name,
      email: order.user.email,
      createdAt: order.createdAt,
    }));
  },

  async inventoryReport() {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { stock: "asc" },
    });
    return products.map((product) => ({
      sku: product.sku,
      name: product.name,
      category: product.category.name,
      stock: product.stock,
      price: Number(product.price),
      isCritical: product.stock < 20,
    }));
  },
};
