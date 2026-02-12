import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const userRoutes = Router()
const userController = new UserController

userRoutes.post("/", userController.create);
userRoutes.get('/', isAuthenticated, isAdmin, userController.list);
userRoutes.get('/:id', isAuthenticated, isAdmin, userController.show);
userRoutes.delete('/:id', isAuthenticated, isAdmin, userController.delete);
userRoutes.put('/:id', isAuthenticated, isAdmin, userController.update);

export { userRoutes }