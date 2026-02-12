import { prisma } from '../config/prisma';
import { Status } from '@prisma/client';

interface CreateHistoryDTO {
  task_id: string;
  changed_by: string;
  old_status: Status;
  new_status: Status;
}

export class TasksHistoryService {
  async execute({ task_id, changed_by, old_status, new_status }: CreateHistoryDTO) {
    return await prisma.tasksHistory.create({
      data: {
        task_id,
        changed_by,
        old_status,
        new_status,
      }
    });
  }

  async listByTask(taskId: string) {
    return await prisma.tasksHistory.findMany({
      where: {
        task_id: taskId
      },
      include: {
        user: { 
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        changed_at: 'desc' 
      }
    });
  }
}