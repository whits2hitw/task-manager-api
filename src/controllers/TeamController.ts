import { Request, Response, NextFunction } from 'express';
import { TeamService } from '../services/TeamService';
import { z } from 'zod';

export class TeamController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const teamSchema = z.object({
        name: z.string().min(3, "The team name must have at least 3 characters."),
        description: z.string().max(255).optional(),
      });

      const { name, description } = teamSchema.parse(request.body);
      const teamService = new TeamService();
      const team = await teamService.create(name, description);

      return response.status(201).json(team);
    } catch (error) {
      next(error);
    }
  }

  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const teamService = new TeamService();
      const teams = await teamService.listAll();
      return response.json(teams);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid({ message: "Invalid team ID." }),
      });

      const bodySchema = z.object({
        name: z.string().min(3, "Very short name").optional(),
        description: z.string().max(255).optional(),
      });

      const { id } = paramsSchema.parse(request.params);
      const { name, description } = bodySchema.parse(request.body);

      const teamService = new TeamService();
      const team = await teamService.update(id, { name, description });

      return response.json(team);
    } catch (error) {
      next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid({ message: "Invalid team ID." }),
      });

      const { id } = paramsSchema.parse(request.params);

      const teamService = new TeamService();
      await teamService.delete(id);

      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}