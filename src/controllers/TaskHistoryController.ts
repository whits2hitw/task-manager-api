import { Request, Response, NextFunction } from 'express';
import { TasksHistoryService } from '../services/TaskHistoryService';
import { z } from 'zod';

export class TasksHistoryController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        taskId: z.string().uuid()
      });

      const { taskId } = paramsSchema.parse(request.params);
      const historyService = new TasksHistoryService();
      
      const history = await historyService.listByTask(taskId);

      

      return response.json(history);
    } catch (error) {
      next(error);
    }
  }
}