import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';
import { authenticateToken, requireVerifiedUser } from '../middleware/auth';
import { logActivity } from '../middleware/activity';
import { ActivityType } from '../models/UserActivity';

const router = Router();
const ticketController = new TicketController();

// All routes require authentication
router.use(authenticateToken);
router.use(requireVerifiedUser);

// Ticket CRUD routes
router.post('/', logActivity(ActivityType.CREATE_TICKET), ticketController.createTicket);
router.get('/', ticketController.listTickets);
router.get('/stats', ticketController.getTicketStats);
router.get('/by-stage', ticketController.getTicketsByStage);
router.get('/overdue', ticketController.getOverdueTickets);
router.get('/:id', ticketController.getTicket);
router.put('/:id', logActivity(ActivityType.UPDATE_TICKET), ticketController.updateTicket);

// Ticket actions
router.patch('/:id/stage', logActivity(ActivityType.MOVE_TICKET_STAGE), ticketController.moveTicketStage);
router.patch('/:id/assign', logActivity(ActivityType.ASSIGN_TICKET), ticketController.assignTicket);
router.post('/:id/notes', logActivity(ActivityType.ADD_NOTE), ticketController.addTicketNote);

export default router;