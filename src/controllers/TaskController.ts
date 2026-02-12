import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/TaskService';
import { TasksHistoryService } from '../services/TaskHistoryService';
import { z } from 'zod';

export class TaskController {
  async store(request: Request, response: Response, next: NextFunction) {
    try {
      const taskSchema = z.object({
        title: z.string().max(200),
        description: z.string().optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        team_id: z.string().uuid(),
        assigned_to: z.string().uuid().optional(),
      });

      const data = taskSchema.parse(request.body);

      const taskService = new TaskService();
      const historyService = new TasksHistoryService();

      const task = await taskService.create(data);

      await historyService.execute({
        task_id: task.id,
        changed_by: request.user.id,
        old_status: 'pending',
        new_status: 'pending'
      });

      return response.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({ id: z.string().uuid() });
      const bodySchema = z.object({
        title: z.string().max(200).optional(),
        description: z.string().optional(),
        status: z.enum(['pending', 'in_progress', 'completed']).optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        assigned_to: z.string().uuid().optional(),
      });

      const { id } = paramsSchema.parse(request.params);
      const data = bodySchema.parse(request.body);

      const taskService = new TaskService();
      const historyService = new TasksHistoryService();

      const { updatedTask, oldStatus } = await taskService.update(id, data);

      await historyService.execute({
        task_id: updatedTask.id,
        changed_by: request.user.id,
        old_status: oldStatus,
        new_status: updatedTask.status,
      });

      return response.json(updatedTask);
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const querySchema = z.object({
        status: z.enum(['pending', 'in_progress', 'completed']).optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        team_id: z.string().uuid().optional(),
      });

      const filters = querySchema.parse(request.query);
      const taskService = new TaskService();

      const tasks = await taskService.list(filters);

      return response.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async destroy(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(request.params);
      const taskService = new TaskService();

      await taskService.delete(id);

      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}