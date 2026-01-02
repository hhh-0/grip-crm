import { AppDataSource } from '../config/database';
import { Ticket, TicketStage, TicketPriority } from '../models/Ticket';
import { Customer } from '../models/Customer';
import { User } from '../models/User';
import { Note } from '../models/Note';
import { TicketData, TicketFilters, PaginatedResponse } from '../types';
import { ActivityService } from './ActivityService';
import { NotificationService } from './NotificationService';
import { ActivityType } from '../models/UserActivity';
import { MoreThanOrEqual, LessThan, LessThanOrEqual, Not } from 'typeorm';

export class TicketService {
  private ticketRepository = AppDataSource.getRepository(Ticket);
  private customerRepository = AppDataSource.getRepository(Customer);
  private userRepository = AppDataSource.getRepository(User);
  private noteRepository = AppDataSource.getRepository(Note);
  private activityService = new ActivityService();
  private notificationService = new NotificationService();

  async createTicket(ticketData: TicketData, userId?: string): Promise<Ticket> {
    // Verify customer exists
    const customer = await this.customerRepository.findOne({
      where: { id: ticketData.customerId }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Verify assigned user exists if provided
    if (ticketData.assignedUserId) {
      const assignedUser = await this.userRepository.findOne({
        where: { id: ticketData.assignedUserId }
      });

      if (!assignedUser) {
        throw new Error('Assigned user not found');
      }
    }

    // Create ticket with default stage
    const ticket = this.ticketRepository.create({
      ...ticketData,
      stage: TicketStage.NEW, // Always start with NEW stage
    });

    const savedTicket = await this.ticketRepository.save(ticket);

    // Log activity if userId provided
    if (userId) {
      await this.activityService.logActivity(
        userId,
        ActivityType.CREATE_TICKET,
        `Created ticket: ${savedTicket.title}`,
        { ticketId: savedTicket.id, customerId: savedTicket.customerId }
      );
    }

    return this.getTicket(savedTicket.id);
  }

  async updateTicket(id: string, ticketData: Partial<TicketData>, userId?: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['customer', 'assignedUser'],
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Verify customer exists if updating
    if (ticketData.customerId && ticketData.customerId !== ticket.customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: ticketData.customerId }
      });

      if (!customer) {
        throw new Error('Customer not found');
      }
    }

    // Verify assigned user exists if updating
    if (ticketData.assignedUserId && ticketData.assignedUserId !== ticket.assignedUserId) {
      const assignedUser = await this.userRepository.findOne({
        where: { id: ticketData.assignedUserId }
      });

      if (!assignedUser) {
        throw new Error('Assigned user not found');
      }
    }

    Object.assign(ticket, ticketData);
    const updatedTicket = await this.ticketRepository.save(ticket);

    // Log activity if userId provided
    if (userId) {
      await this.activityService.logActivity(
        userId,
        ActivityType.UPDATE_TICKET,
        `Updated ticket: ${updatedTicket.title}`,
        { ticketId: updatedTicket.id }
      );
    }

    return this.getTicket(updatedTicket.id);
  }

  async getTicket(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['customer', 'assignedUser', 'notes', 'notes.user'],
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return ticket;
  }

  async listTickets(filters: TicketFilters = {}): Promise<PaginatedResponse<Ticket>> {
    const {
      stage,
      priority,
      customerId,
      assignedUserId,
      overdue,
      limit = 50,
      offset = 0,
    } = filters;

    const queryBuilder = this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.customer', 'customer')
      .leftJoinAndSelect('ticket.assignedUser', 'assignedUser');

    // Apply filters
    if (stage) {
      queryBuilder.andWhere('ticket.stage = :stage', { stage });
    }

    if (priority) {
      queryBuilder.andWhere('ticket.priority = :priority', { priority });
    }

    if (customerId) {
      queryBuilder.andWhere('ticket.customerId = :customerId', { customerId });
    }

    if (assignedUserId) {
      queryBuilder.andWhere('ticket.assignedUserId = :assignedUserId', { assignedUserId });
    }

    if (overdue) {
      queryBuilder.andWhere('ticket.dueDate < :now AND ticket.stage != :completed', {
        now: new Date(),
        completed: TicketStage.COMPLETED,
      });
    }

    // Apply pagination and ordering
    queryBuilder
      .orderBy('ticket.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    const [tickets, total] = await queryBuilder.getManyAndCount();

    return {
      data: tickets,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async moveTicketStage(id: string, newStage: TicketStage, userId?: string): Promise<Ticket> {
    const ticket = await this.getTicket(id);
    const oldStage = ticket.stage;

    ticket.stage = newStage;

    // Set completion timestamp if moving to completed
    if (newStage === TicketStage.COMPLETED && oldStage !== TicketStage.COMPLETED) {
      ticket.completedAt = new Date();
    }
    // Clear completion timestamp if moving away from completed
    else if (newStage !== TicketStage.COMPLETED && oldStage === TicketStage.COMPLETED) {
      ticket.completedAt = undefined;
    }

    const updatedTicket = await this.ticketRepository.save(ticket);

    // Log activity if userId provided
    if (userId) {
      await this.activityService.logActivity(
        userId,
        ActivityType.MOVE_TICKET_STAGE,
        `Moved ticket "${ticket.title}" from ${oldStage} to ${newStage}`,
        { 
          ticketId: ticket.id,
          oldStage,
          newStage,
          completedAt: updatedTicket.completedAt
        }
      );
    }

    return this.getTicket(updatedTicket.id);
  }

  async assignTicket(id: string, assignedUserId: string, userId?: string): Promise<Ticket> {
    const ticket = await this.getTicket(id);
    
    // Verify assigned user exists
    const assignedUser = await this.userRepository.findOne({
      where: { id: assignedUserId }
    });

    if (!assignedUser) {
      throw new Error('Assigned user not found');
    }

    const oldAssignedUserId = ticket.assignedUserId;
    ticket.assignedUserId = assignedUserId;
    const updatedTicket = await this.ticketRepository.save(ticket);

    // Log activity if userId provided
    if (userId) {
      await this.activityService.logActivity(
        userId,
        ActivityType.ASSIGN_TICKET,
        `Assigned ticket "${ticket.title}" to ${assignedUser.name}`,
        { 
          ticketId: ticket.id,
          oldAssignedUserId,
          newAssignedUserId: assignedUserId
        }
      );
    }

    // TODO: Send notification to assigned user
    await this.notificationService.sendTicketAssignmentNotification({
      type: 'ticket_assigned',
      recipient: assignedUser,
      ticket: updatedTicket,
      customer: updatedTicket.customer,
      assignedBy: userId ? (await this.userRepository.findOne({ where: { id: userId } })) || undefined : undefined,
    });

    return this.getTicket(updatedTicket.id);
  }

  async addTicketNote(id: string, content: string, userId: string): Promise<Note> {
    const ticket = await this.getTicket(id);

    const note = this.noteRepository.create({
      content,
      ticketId: id,
      userId,
    });

    const savedNote = await this.noteRepository.save(note);

    // Log activity
    await this.activityService.logActivity(
      userId,
      ActivityType.ADD_NOTE,
      `Added note to ticket: ${ticket.title}`,
      { ticketId: id, noteId: savedNote.id }
    );

    const result = await this.noteRepository.findOne({
      where: { id: savedNote.id },
      relations: ['user'],
    });
    
    if (!result) {
      throw new Error('Failed to retrieve saved note');
    }
    
    return result;
  }

  async getTicketsByStage(): Promise<Record<TicketStage, number>> {
    const result = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select('ticket.stage', 'stage')
      .addSelect('COUNT(*)', 'count')
      .groupBy('ticket.stage')
      .getRawMany();

    const stageCount: Record<TicketStage, number> = {
      [TicketStage.NEW]: 0,
      [TicketStage.IN_PROGRESS]: 0,
      [TicketStage.WAITING]: 0,
      [TicketStage.COMPLETED]: 0,
    };

    result.forEach(row => {
      stageCount[row.stage as TicketStage] = parseInt(row.count);
    });

    return stageCount;
  }

  async getOverdueTickets(): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: {
        dueDate: LessThan(new Date()),
        stage: Not(TicketStage.COMPLETED),
      },
      relations: ['customer', 'assignedUser'],
      order: { dueDate: 'ASC' },
    });
  }

  async getTicketStats(): Promise<{
    total: number;
    byStage: Record<TicketStage, number>;
    byPriority: Record<TicketPriority, number>;
    overdue: number;
    completedThisMonth: number;
  }> {
    const total = await this.ticketRepository.count();
    const byStage = await this.getTicketsByStage();

    // Get by priority
    const priorityResult = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select('ticket.priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .groupBy('ticket.priority')
      .getRawMany();

    const byPriority: Record<TicketPriority, number> = {
      [TicketPriority.LOW]: 0,
      [TicketPriority.MEDIUM]: 0,
      [TicketPriority.HIGH]: 0,
      [TicketPriority.URGENT]: 0,
    };

    priorityResult.forEach(row => {
      byPriority[row.priority as TicketPriority] = parseInt(row.count);
    });

    // Get overdue count
    const overdue = await this.ticketRepository.count({
      where: {
        dueDate: LessThan(new Date()),
        stage: Not(TicketStage.COMPLETED),
      },
    });

    // Get completed this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const completedThisMonth = await this.ticketRepository.count({
      where: {
        stage: TicketStage.COMPLETED,
        completedAt: MoreThanOrEqual(startOfMonth),
      },
    });

    return {
      total,
      byStage,
      byPriority,
      overdue,
      completedThisMonth,
    };
  }
}