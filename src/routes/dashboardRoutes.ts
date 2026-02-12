import { Router } from "express";
import { DashboardController } from '../controllers/DashboardController';
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const dashboardRoutes = Router()
const dashboardController = new DashboardController();

dashboardRoutes.get('/',  isAuthenticated, isAdmin, dashboardController.index);

export { dashboardRoutes }