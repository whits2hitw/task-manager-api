import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { z } from 'zod';

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Se o erro for uma instância da classe AppError
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  }

  // Se o erro for de validação do Zod
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      errors: error.issues.map((issue) => ({
        path: issue.path[0],
        message: issue.message,
      })),
    });
  }

  console.error(error);
  return res.status(500).json({
    message: "Internal server error",
  });
}