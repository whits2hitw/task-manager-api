import { Request, Response, NextFunction } from "express";

export function isAdmin(request: Request, response: Response, next: NextFunction) {
  const { role } = request.user;

  if (role !== 'admin') {
    return response.status(403).json({ message: "Access denied: Admin only." });
  }

  return next();
}