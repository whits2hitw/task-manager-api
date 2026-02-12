import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../services/SessionService';
import { z } from 'zod';

export class SessionController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const loginSchema = z.object({
        email: z.string().email().trim().lowercase(),
        password: z.string().min(6)
      });

      const { email, password } = loginSchema.parse(request.body);

      const sessionService = new SessionService();
      const session = await sessionService.execute({ email, password });

      return response.json(session);
    } catch (error) {
      next(error);
    }
  }
}