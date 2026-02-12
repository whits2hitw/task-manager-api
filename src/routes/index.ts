import { Router } from "express";
import { userRoutes } from "./userRoutes";
import { sessionRoutes } from "./sessionRoutes";
import { teamRoutes } from "./teamRoutes";
import { taskRoutes } from "./taskRoutes";
import { dashboardRoutes } from "./dashboardRoutes";

const routes = Router()

routes.use('/sessions', sessionRoutes)

routes.use('/users', userRoutes);

routes.use('/teams', teamRoutes)

routes.use('/tasks', taskRoutes)

routes.use('/dashboard/stats', dashboardRoutes)

export { routes }