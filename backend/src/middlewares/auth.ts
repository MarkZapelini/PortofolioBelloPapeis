import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../config/env.js";
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

export function ensureAuthenticated(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError("Token não informado.", 401));
  }

  const [, token] = authHeader.split(" ");
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.user = {
      id: payload.sub,
      role: payload.role,
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
