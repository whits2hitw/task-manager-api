import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';


interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  team_id: string;
  assigned_to?: string;
}

export class TaskService {
  async create({ title, description, priority, team_id, assigned_to }: CreateTaskDTO) {

    const teamExists = await prisma.team.findUnique({ where: { id: team_id } });
    if (!teamExists) throw new AppError("Team not found", 404);

    if (assigned_to) {
      const userExists = await prisma.user.findUnique({ where: { id: assigned_to } });
      if (!userExists) throw new AppError("Assigned user not found", 404);
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'medium',
        status: 'pending',
        team_id,
        assigned_to
      }
    });

    return task;
  }

  async update(id: string, data: {
    title?: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    assigned_to?: string;
  }) {

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw new AppError("Task not found", 404);


    const updatedTask = await prisma.task.update({
      where: { id },
      data
    });

    return { updatedTask, oldStatus: task.status };
  }

  async list(filters: { status?: any; priority?: any; team_id?: string }) {
    const tasks = await prisma.task.findMany({
      where: {
        status: filters.status,
        priority: filters.priority,
        team_id: filters.team_id,
      },
      include: {
        user: { select: { name: true } },
        team: { select: { name: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    return tasks;
  }

  async delete(id: string) {

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw new AppError("Task not found", 404);

    await prisma.tasksHistory.deleteMany({
      where: { task_id: id }
    });

    await prisma.task.delete({
      where: { id }
    });
  }
  async getStats(team_id?: string) {
    const where = team_id ? { team_id } : {};

    const [pending, in_progress, completed] = await Promise.all([
      prisma.task.count({ where: { ...where, status: 'pending' } }),
      prisma.task.count({ where: { ...where, status: 'in_progress' } }),
      prisma.task.count({ where: { ...where, status: 'completed' } }),
    ]);

    return {
      pending,
      in_progress,
      completed,
      total: pending + in_progress + completed
    };
  }
}