import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/http.js";

const addressSchema = z.object({
  label: z.string().min(2),
  zipCode: z.string().min(8),
  street: z.string().min(2),
  number: z.string().min(1),
  complement: z.string().optional(),
  district: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  isDefault: z.boolean().optional(),
});

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(4),
});

export const accountService = {
  async listAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  },

  async createAddress(userId: string, payload: unknown) {
    const data = addressSchema.parse(payload);
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    return prisma.address.create({
      data: { ...data, userId },
    });
  },

  async updateAddress(userId: string, addressId: string, payload: unknown) {
    const data = addressSchema.partial().parse(payload);
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    return prisma.address.updateMany({
      where: { id: addressId, userId },
      data,
    });
  },

  async deleteAddress(userId: string, addressId: string) {
    await prisma.address.deleteMany({
      where: { id: addressId, userId },
    });
    return { message: "Endereço removido com sucesso." };
  },

  async listFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: true, category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async toggleFavorite(userId: string, productId: string) {
    const existing = await prisma.favorite.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return { message: "Produto removido dos favoritos." };
    }

    await prisma.favorite.create({
      data: { userId, productId },
    });
    return { message: "Produto adicionado aos favoritos." };
  },

  async removeFavorite(userId: string, productId: string) {
    await prisma.favorite.deleteMany({
      where: { userId, productId },
    });
    return { message: "Favorito removido com sucesso." };
  },

  async listReviews(productId: string) {
    return prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async createReview(userId: string, payload: unknown) {
    const data = reviewSchema.parse(payload);
    return prisma.review.create({
      data: { ...data, userId },
    });
  },

  async updateReview(userId: string, reviewId: string, payload: unknown) {
    const data = reviewSchema.partial().omit({ productId: true }).parse(payload);
    const review = await prisma.review.findFirst({
      where: { id: reviewId, userId },
    });
    if (!review) throw new AppError("Avaliação não encontrada.", 404);

    return prisma.review.update({
      where: { id: reviewId },
      data,
    });
  },

  async deleteReview(userId: string, reviewId: string) {
    await prisma.review.deleteMany({
      where: { id: reviewId, userId },
    });
    return { message: "Avaliação removida com sucesso." };
  },
};
