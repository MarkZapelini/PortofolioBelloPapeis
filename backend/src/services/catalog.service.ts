import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/http.js";

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

const productSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  sku: z.string().min(3),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().nonnegative(),
  brand: z.string().optional(),
  unit: z.string().min(1),
  weight: z.coerce.number().nonnegative().default(0),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  categoryId: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

export const catalogService = {
  async listCategories() {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
  },

  async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findFirst({
      where: { slug, isActive: true },
      include: {
        products: {
          where: { isActive: true },
          include: { images: true },
        },
      },
    });
    if (!category) throw new AppError("Categoria não encontrada.", 404);
    return category;
  },

  async createCategory(payload: unknown) {
    const data = categorySchema.parse(payload);
    return prisma.category.create({ data });
  },

  async updateCategory(id: string, payload: unknown) {
    const data = categorySchema.partial().parse(payload);
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  async deleteCategory(id: string) {
    await prisma.category.delete({ where: { id } });
    return { message: "Categoria removida com sucesso." };
  },

  async listProducts(query: Record<string, unknown>) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 9);
    const skip = (page - 1) * limit;
    const q = String(query.q ?? "");
    const category = query.category ? String(query.category) : undefined;
    const featured = query.featured === "true";
    const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

    const where = {
      isActive: true,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { sku: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(category
        ? {
            category: {
              slug: category,
            },
          }
        : {}),
      ...(featured ? { isFeatured: true } : {}),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: minPrice } : {}),
              ...(maxPrice ? { lte: maxPrice } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        include: {
          images: true,
          category: true,
          reviews: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getProduct(idOrSlug: string) {
    const product = await prisma.product.findFirst({
      where: {
        isActive: true,
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
    if (!product) throw new AppError("Produto não encontrado.", 404);
    return product;
  },

  async createProduct(payload: unknown) {
    const data = productSchema.parse(payload);
    return prisma.product.create({
      data: {
        ...data,
        images: data.imageUrl
          ? {
              create: {
                url: data.imageUrl,
                alt: data.name,
                isPrimary: true,
              },
            }
          : undefined,
      },
      include: { images: true, category: true },
    });
  },

  async updateProduct(id: string, payload: unknown) {
    const data = productSchema.partial().parse(payload);
    return prisma.product.update({
      where: { id },
      data: {
        ...data,
        images: data.imageUrl
          ? {
              deleteMany: {},
              create: {
                url: data.imageUrl,
                alt: data.name ?? "Imagem do produto",
                isPrimary: true,
              },
            }
          : undefined,
      },
      include: { images: true, category: true },
    });
  },

  async deleteProduct(id: string) {
    await prisma.product.delete({ where: { id } });
    return { message: "Produto removido com sucesso." };
  },
};
