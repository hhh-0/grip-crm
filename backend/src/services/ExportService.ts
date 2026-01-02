import { AppDataSource } from '../config/database';
import { Customer } from '../models/Customer';
import { Ticket } from '../models/Ticket';
import { Note } from '../models/Note';
import { User } from '../models/User';

export interface ExportOptions {
  includeNotes?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  format?: 'csv' | 'json';
}

export class ExportService {
  private customerRepository = AppDataSource.getRepository(Customer);
  private ticketRepository = AppDataSource.getRepository(Ticket);
  private noteRepository = AppDataSource.getRepository(Note);
  private userRepository = AppDataSource.getRepository(User);

  async exportCustomers(options: ExportOptions = {}): Promise<string> {
    const { includeNotes = false, dateRange, format = 'csv' } = options;

    const queryBuilder = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.tickets', 'tickets');

    if (includeNotes) {
      queryBuilder.leftJoinAndSelect('customer.customerNotes', 'customerNotes');
    }

    if (dateRange) {
      queryBuilder.andWhere('customer.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    const customers = await queryBuilder.getMany();

    if (format === 'json') {
      return JSON.stringify(customers, null, 2);
    }

    return this.convertCustomersToCSV(customers, includeNotes);
  }

  async exportTickets(options: ExportOptions = {}): Promise<string> {
    const { includeNotes = false, dateRange, format = 'csv' } = options;

    const queryBuilder = this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.customer', 'customer')
      .leftJoinAndSelect('ticket.assignedUser', 'assignedUser');

    if (includeNotes) {
      queryBuilder.leftJoinAndSelect('ticket.notes', 'notes')
        .leftJoinAndSelect('notes.user', 'noteUser');
    }

    if (dateRange) {
      queryBuilder.andWhere('ticket.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    const tickets = await queryBuilder.getMany();

    if (format === 'json') {
      return JSON.stringify(tickets, null, 2);
    }

    return this.convertTicketsToCSV(tickets, includeNotes);
  }

  async exportAllData(options: ExportOptions = {}): Promise<{
    customers: string;
    tickets: string;
    users: string;
  }> {
    const [customers, tickets, users] = await Promise.all([
      this.exportCustomers(options),
      this.exportTickets(options),
      this.exportUsers(options),
    ]);

    return { customers, tickets, users };
  }

  async exportUsers(options: ExportOptions = {}): Promise<string> {
    const { format = 'csv' } = options;

    const users = await this.userRepository.find({
      select: ['id', 'email', 'name', 'isVerified', 'createdAt', 'updatedAt'],
    });

    if (format === 'json') {
      return JSON.stringify(users, null, 2);
    }

    return this.convertUsersToCSV(users);
  }

  private convertCustomersToCSV(customers: Customer[], includeNotes: boolean): string {
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Company',
      'Notes',
      'Created At',
      'Updated At',
      'Ticket Count',
    ];

    if (includeNotes) {
      headers.push('Customer Notes');
    }

    const rows = customers.map(customer => {
      const row = [
        customer.id,
        this.escapeCsvValue(customer.name),
        customer.email || '',
        customer.phone || '',
        this.escapeCsvValue(customer.company || ''),
        this.escapeCsvValue(customer.notes || ''),
        customer.createdAt.toISOString(),
        customer.updatedAt.toISOString(),
        customer.tickets?.length || 0,
      ];

      if (includeNotes && customer.customerNotes) {
        const notes = customer.customerNotes
          .map(note => `${note.createdAt.toISOString()}: ${note.content}`)
          .join(' | ');
        row.push(this.escapeCsvValue(notes));
      }

      return row;
    });

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private convertTicketsToCSV(tickets: Ticket[], includeNotes: boolean): string {
    const headers = [
      'ID',
      'Title',
      'Description',
      'Customer Name',
      'Customer Email',
      'Assigned User',
      'Stage',
      'Priority',
      'Due Date',
      'Completed At',
      'Created At',
      'Updated At',
    ];

    if (includeNotes) {
      headers.push('Notes');
    }

    const rows = tickets.map(ticket => {
      const row = [
        ticket.id,
        this.escapeCsvValue(ticket.title),
        this.escapeCsvValue(ticket.description),
        this.escapeCsvValue(ticket.customer?.name || ''),
        ticket.customer?.email || '',
        this.escapeCsvValue(ticket.assignedUser?.name || ''),
        ticket.stage,
        ticket.priority,
        ticket.dueDate?.toISOString() || '',
        ticket.completedAt?.toISOString() || '',
        ticket.createdAt.toISOString(),
        ticket.updatedAt.toISOString(),
      ];

      if (includeNotes && ticket.notes) {
        const notes = ticket.notes
          .map(note => `${note.createdAt.toISOString()} (${note.user?.name}): ${note.content}`)
          .join(' | ');
        row.push(this.escapeCsvValue(notes));
      }

      return row;
    });

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private convertUsersToCSV(users: User[]): string {
    const headers = [
      'ID',
      'Email',
      'Name',
      'Is Verified',
      'Created At',
      'Updated At',
    ];

    const rows = users.map(user => [
      user.id,
      user.email,
      this.escapeCsvValue(user.name),
      user.isVerified,
      user.createdAt.toISOString(),
      user.updatedAt.toISOString(),
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private escapeCsvValue(value: string): string {
    if (!value) return '';
    
    // If the value contains comma, newline, or quote, wrap it in quotes
    if (value.includes(',') || value.includes('\n') || value.includes('"')) {
      // Escape existing quotes by doubling them
      const escaped = value.replace(/"/g, '""');
      return `"${escaped}"`;
    }
    
    return value;
  }

  async getExportStats(): Promise<{
    totalCustomers: number;
    totalTickets: number;
    totalUsers: number;
    estimatedExportSize: string;
  }> {
    const [totalCustomers, totalTickets, totalUsers] = await Promise.all([
      this.customerRepository.count(),
      this.ticketRepository.count(),
      this.userRepository.count(),
    ]);

    // Rough estimate: 500 bytes per customer, 1KB per ticket, 200 bytes per user
    const estimatedBytes = (totalCustomers * 500) + (totalTickets * 1000) + (totalUsers * 200);
    const estimatedExportSize = this.formatBytes(estimatedBytes);

    return {
      totalCustomers,
      totalTickets,
      totalUsers,
      estimatedExportSize,
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}