import { Request, Response, NextFunction } from 'express';
import { z } from "zod"
import { UserService } from '../services/UserService';
import { createUserSchema } from '../schemas/user.schemas';


export class UserController {

  async create(request: Request, response: Response, next: NextFunction) {

    try {
      const data = createUserSchema.parse(request.body);

      const userService = new UserService();
      const user = await userService.execute(data);

      return response.status(201).json(user);
    } catch (error) {
      next(error)
    }
  }

  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const userService = new UserService();
      const users = await userService.listAll();
      return response.json(users);
    } catch (error) {
      next(error);
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid({message: "Invalid ID."}),
      });

      const { id } = paramsSchema.parse(request.params);

      const userService = new UserService();
      const user = await userService.findById(id);

      return response.json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
  try {
    const paramsSchema = z.object({
      id: z.string().uuid({ message: "Invalid ID." }),
    });

    const { id } = paramsSchema.parse(request.params);

    const userService = new UserService();
    await userService.delete(id);

    return response.status(200).json({ message: "User successfully removed." });
  } catch (error) {
    next(error);
  }
}

async update(request: Request, response: Response, next: NextFunction) {
  try {
    const paramsSchema = z.object({
      id: z.string().uuid({ message: "Invalid ID." }),
    });

    const bodySchema = z.object({
      name: z.string().trim().min(3).optional(),
      email: z.string().trim().lowercase().email().optional(),
      role: z.enum(["admin", "member"]).optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const userService = new UserService();
    const updatedUser = await userService.update(id, data);

    return response.json(updatedUser);
  } catch (error) {
    next(error);
  }
}
}