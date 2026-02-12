import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { isAdmin } from '../middlewares/isAdmin';
import { TeamMemberController } from '../controllers/TeamMemberController';

const teamRoutes = Router();
const teamController = new TeamController();
const teamMemberController = new TeamMemberController()

teamRoutes.use(isAuthenticated);
teamRoutes.use(isAdmin);

teamRoutes.post('/', teamController.create);
teamRoutes.get('/', teamController.list);
teamRoutes.put('/:id', teamController.update);
teamRoutes.delete('/:id', teamController.delete);
teamRoutes.post('/:id/members', isAuthenticated, isAdmin, teamMemberController.store);
teamRoutes.get('/:id/members', isAuthenticated, teamMemberController.index);


export { teamRoutes };