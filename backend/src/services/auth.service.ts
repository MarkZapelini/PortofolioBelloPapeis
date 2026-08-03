import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/http.js";

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const resetRequestSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6),
});

function signToken(userId: string, role: Role) {
  return jwt.sign({ role }, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export const authService = {
  async register(payload: unknown) {
    const data = registerSchema.parse(payload);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError("E-mail já cadastrado.", 409);

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        passwordHash,
        cart: { create: {} },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return {
      user,
      token: signToken(user.id, user.role),
    };
  },

  async login(payload: unknown) {
    const data = loginSchema.parse(payload);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new AppError("Credenciais inválidas.", 401);

    const matches = await bcrypt.compare(data.password, user.passwordHash);
    if (!matches) throw new AppError("Credenciais inválidas.", 401);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: signToken(user.id, user.role),
    };
  },

  async forgotPassword(payload: unknown) {
    const genericMessage = "Se o e-mail existir, as instruções de recuperação serão enviadas.";
    const data = resetRequestSchema.parse(payload);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return { message: genericMessage };
    }

    const token = randomBytes(32).toString("hex");
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashResetToken(token),
        resetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 30),
      },
    });

    if (env.NODE_ENV !== "production") {
      console.warn(`Token de reset gerado para ${user.email}: ${token}`);
    }

    return { message: genericMessage };
  },

  async resetPassword(payload: unknown) {
    const data = resetPasswordSchema.parse(payload);
    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashResetToken(data.token),
        resetTokenExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) throw new AppError("Token inválido ou expirado.", 400);

    const passwordHash = await bcrypt.hash(data.password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    return { message: "Senha atualizada com sucesso." };
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        companyName: true,
        role: true,
      },
    });

    if (!user) throw new AppError("Usuário não encontrado.", 404);
    return user;
  },
};
