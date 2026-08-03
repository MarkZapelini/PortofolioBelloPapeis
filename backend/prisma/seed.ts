import "dotenv/config";
import { PrismaClient, Role, CouponType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const prisma = new PrismaClient();

function getSeedPassword(envKey: string) {
  const configuredPassword = process.env[envKey];
  if (configuredPassword && configuredPassword.length >= 8) {
    return {
      password: configuredPassword,
      generated: false,
    };
  }

  return {
    password: randomBytes(12).toString("base64url"),
    generated: true,
  };
}

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@maycopapeis.com.br";
  const customerEmail = process.env.SEED_CUSTOMER_EMAIL ?? "cliente@empresa.com.br";
  const adminPassword = getSeedPassword("SEED_ADMIN_PASSWORD");
  const customerPassword = getSeedPassword("SEED_CUSTOMER_PASSWORD");
  const passwordHash = await bcrypt.hash(adminPassword.password, 10);

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "papel-interfolha" },
      update: {},
      create: {
        name: "Papel Interfolha",
        slug: "papel-interfolha",
        description: "Papel interfolhado para banheiros e áreas corporativas.",
        imageUrl:
          "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=folded%20paper%20towels%20packaging%20for%20professional%20B2B%20ecommerce%2C%20realistic%20studio%20photo&image_size=portrait_4_3",
      },
    }),
    prisma.category.upsert({
      where: { slug: "papel-toalha" },
      update: {},
      create: {
        name: "Papel Toalha",
        slug: "papel-toalha",
        description: "Bobinas e toalhas para restaurantes e limpeza.",
        imageUrl:
          "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=paper%20towel%20rolls%20for%20wholesale%20catalog%2C%20realistic%20ecommerce%20photo&image_size=portrait_4_3",
      },
    }),
  ]);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Administrador",
      email: adminEmail,
      phone: "(11) 4000-9000",
      companyName: "Mayco Papéis",
      passwordHash,
      role: Role.ADMIN,
      cart: { create: {} },
    },
  });

  await prisma.user.upsert({
    where: { email: customerEmail },
    update: {},
    create: {
      name: "Cliente Exemplo",
      email: customerEmail,
      phone: "(11) 98888-7777",
      companyName: "Empresa Exemplo",
      passwordHash: await bcrypt.hash(customerPassword.password, 10),
      cart: { create: {} },
      addresses: {
        create: {
          label: "Matriz",
          zipCode: "01000-000",
          street: "Rua Central",
          number: "100",
          district: "Centro",
          city: "São Paulo",
          state: "SP",
          isDefault: true,
        },
      },
    },
  });

  if (process.env.NODE_ENV !== "production") {
    if (adminPassword.generated) {
      console.log(`Senha do admin gerada para ${adminEmail}: ${adminPassword.password}`);
    }

    if (customerPassword.generated) {
      console.log(`Senha do cliente gerada para ${customerEmail}: ${customerPassword.password}`);
    }
  }

  await prisma.coupon.upsert({
    where: { code: "BEMVINDO8" },
    update: {},
    create: {
      code: "BEMVINDO8",
      type: CouponType.PERCENTAGE,
      value: 8,
      minOrderValue: 200,
    },
  });

  await prisma.product.upsert({
    where: { slug: "interfolha-premium-2-dobras-5000" },
    update: {},
    create: {
      name: "Interfolha Premium 2 Dobras 5.000 folhas",
      slug: "interfolha-premium-2-dobras-5000",
      description: "Alta absorção para empresas com grande circulação.",
      sku: "INT-5000-PREM",
      price: 129.9,
      compareAtPrice: 149.9,
      stock: 180,
      unit: "fardo",
      weight: 6.5,
      isFeatured: true,
      categoryId: categories[0].id,
      images: {
        create: [
          {
            url: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=stack%20of%20premium%20folded%20paper%20towels%20interfolha%20packaging%20for%20B2B%20ecommerce%2C%20realistic%20product%20shot&image_size=square_hd",
            alt: "Papel interfolha premium",
            isPrimary: true,
          },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "papel-toalha-bobina-200m" },
    update: {},
    create: {
      name: "Papel Toalha Bobina 200m",
      slug: "papel-toalha-bobina-200m",
      description: "Bobina resistente para operação diária.",
      sku: "TOA-200-BOB",
      price: 89.9,
      stock: 75,
      unit: "caixa",
      weight: 4.2,
      isFeatured: true,
      categoryId: categories[1].id,
      images: {
        create: [
          {
            url: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=industrial%20paper%20towel%20roll%20product%20photo%20for%20ecommerce%2C%20realistic%20white%20background&image_size=square_hd",
            alt: "Bobina de papel toalha",
            isPrimary: true,
          },
        ],
      },
    },
  });

  console.log(`Seed concluído. Admin: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
