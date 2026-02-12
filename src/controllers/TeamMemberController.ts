import { Request, Response, NextFunction } from 'express';
import { TeamService } from '../services/TeamService';
import { z } from 'zod';

export class TeamMemberController {
  async store(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const bodySchema = z.object({
        userId: z.string().uuid(),
      });

      const { id: teamId } = paramsSchema.parse(request.params);
      const { userId } = bodySchema.parse(request.body);

      const teamService = new TeamService();
      const member = await teamService.addMember(teamId, userId);

      return response.status(201).json(member);
    } catch (error) {
      next(error);
    }
  }

  async destroy(request: Request, response: Response, next: NextFunction) {
    try {
      const schema = z.object({
        id: z.string().uuid(),
        userId: z.string().uuid(),
      });

      const { id: teamId, userId } = schema.parse({
        ...request.params,
        ...request.body
      });

      const teamService = new TeamService();
      await teamService.removeMember(teamId, userId);

      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(), 
      });

      const { id: teamId } = paramsSchema.parse(request.params);

      const teamService = new TeamService();
      const members = await teamService.listMembers(teamId);

      return response.json(members);
    } catch (error) {
      next(error);
    }
  }
}