import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { isAdmin } from '../middlewares/isAdmin';
import { TasksHistoryController } from '../controllers/TaskHistoryController';

const taskRoutes = Router();
const taskController = new TaskController();
const historyController = new TasksHistoryController();

taskRoutes.use(isAuthenticated);

taskRoutes.get('/:taskId/history', isAdmin, historyController.index);
taskRoutes.get('/', isAuthenticated, taskController.index);
taskRoutes.post('/', isAdmin, taskController.store);
taskRoutes.put('/:id', isAdmin, taskController.update);
taskRoutes.delete('/:id', isAdmin, taskController.destroy); 

export { taskRoutes };