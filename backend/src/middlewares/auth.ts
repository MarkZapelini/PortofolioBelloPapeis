import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/http.js";

type TokenPayload = {
  sub: string;
  role: Role;
};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
    }
  }
}

export async function ensureAuthenticated(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError("Token não informado.", 401));
  }

  const [, token] = authHeader.split(" ");
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return next(new AppError("Usuário não autorizado.", 401));
    }

    req.user = {
      id: user.id,
      role: user.role,
    };
    return next();
  } catch {
    return next(new AppError("Token inválido.", 401));
  }
}

export function ensureRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Acesso negado.", 403));
    }
    return next();
  };
}
