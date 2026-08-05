import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../utils/http.js";

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Dados inválidos.",
      issues: error.issues,
    });
  }

  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "O arquivo excede o limite de 5 MB."
        : "Falha ao processar o upload.";

    return res.status(400).json({ message });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "O registro informado já existe.",
      });
    }

    if (error.code === "P2003") {
      return res.status(409).json({
        message: "Não foi possível concluir a operação por causa de dependências relacionadas.",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Registro não encontrado.",
      });
    }
  }

  return res.status(500).json({
    message: "Erro interno do servidor.",
    detail: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
}
