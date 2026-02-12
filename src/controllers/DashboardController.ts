
import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/TaskService';
import { z } from 'zod';

export class DashboardController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const querySchema = z.object({
        team_id: z.string().uuid().optional(),
      });

      const { team_id } = querySchema.parse(request.query);
      const taskService = new TaskService();

      const stats = await taskService.getStats(team_id);

      return response.json(stats);
    } catch (error) {
      next(error);
    }
  }
}
