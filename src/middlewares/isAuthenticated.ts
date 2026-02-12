import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { authConfig } from "../config/auth";

export function isAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ message: "Token is missing." });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub, role } = decoded as { sub: string, role: string };
    
    request.user = {
      id: sub,
      role: role
    };

    return next();
  } catch {
    return response.status(401).json({ message: "Invalid Token." });
  }
}