import { Response } from 'express';
import { TicketService } from '../services/TicketService';
import { ActivityService } from '../services/ActivityService';
import { TicketData, TicketFilters } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';
import { validateEntity } from '../utils/validation';
import { Ticket, TicketStage } from '../models/Ticket';
import { ActivityType } from '../models/UserActivity';

export class TicketController {
  private ticketService = new TicketService();
  private activityService = new ActivityService();

  createTicket = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const ticketData: TicketData = req.body;

      // Validate input
      const ticket = new Ticket();
      Object.assign(ticket, ticketData);
      const validationErrors = await validateEntity(ticket);

      if (validationErrors.length > 0) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validationErrors,
        });
        return;
      }

      const newTicket = await this.ticketService.createTicket(ticketData, req.user?.userId);

      res.status(201).json({
        success: true,
        data: newTicket,
        message: 'Ticket created successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  updateTicket = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const ticketData: Partial<TicketData> = req.body;

      const updatedTicket = await this.ticketService.updateTicket(id, ticketData, req.user?.userId);

      res.json({
        success: true,
        data: updatedTicket,
        message: 'Ticket updated successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  getTicket = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const ticket = await this.ticketService.getTicket(id);

      res.json({
        success: true,
        data: ticket,
      });
    } catch (error: any) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  };

  listTickets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const filters: TicketFilters = {
        stage: req.query.stage as TicketStage,
        priority: req.query.priority as any,
        customerId: req.query.customerId as string,
        assignedUserId: req.query.assignedUserId as string,
        overdue: req.query.overdue === 'true',
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      };

      const result = await this.ticketService.listTickets(filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  moveTicketStage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { stage } = req.body;

      if (!Object.values(TicketStage).includes(stage)) {
        res.status(400).json({
          success: false,
          error: 'Invalid stage value',
        });
        return;
      }

      const updatedTicket = await this.ticketService.moveTicketStage(id, stage, req.user?.userId);

      res.json({
        success: true,
        data: updatedTicket,
        message: `Ticket moved to ${stage} stage`,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  assignTicket = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { assignedUserId } = req.body;

      if (!assignedUserId) {
        res.status(400).json({
          success: false,
          error: 'Assigned user ID is required',
        });
        return;
      }

      const updatedTicket = await this.ticketService.assignTicket(id, assignedUserId, req.user?.userId);

      res.json({
        success: true,
        data: updatedTicket,
        message: 'Ticket assigned successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  addTicketNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { content } = req.body;

      if (!content || !content.trim()) {
        res.status(400).json({
          success: false,
          error: 'Note content is required',
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const note = await this.ticketService.addTicketNote(id, content.trim(), req.user.userId);

      res.status(201).json({
        success: true,
        data: note,
        message: 'Note added successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  getTicketsByStage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const stageCount = await this.ticketService.getTicketsByStage();

      res.json({
        success: true,
        data: stageCount,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  getOverdueTickets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const overdueTickets = await this.ticketService.getOverdueTickets();

      res.json({
        success: true,
        data: overdueTickets,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  getTicketStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const stats = await this.ticketService.getTicketStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
}