import nodemailer from 'nodemailer';
import { User } from '../models/User';
import { Ticket } from '../models/Ticket';
import { Customer } from '../models/Customer';

export interface NotificationData {
  type: 'ticket_assigned' | 'ticket_overdue' | 'ticket_completed';
  recipient: User;
  ticket: Ticket;
  customer: Customer;
  assignedBy?: User;
}

export class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendTicketAssignmentNotification(data: NotificationData): Promise<void> {
    try {
      const { recipient, ticket, customer, assignedBy } = data;

      const subject = `Ticket Assigned: ${ticket.title}`;
      const html = this.generateTicketAssignmentEmail(ticket, customer, assignedBy);

      await this.sendEmail(recipient.email, subject, html);
      
      console.log(`✅ Assignment notification sent to ${recipient.email} for ticket ${ticket.id}`);
    } catch (error) {
      console.error('❌ Failed to send assignment notification:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  async sendTicketOverdueNotification(data: NotificationData): Promise<void> {
    try {
      const { recipient, ticket, customer } = data;

      const subject = `Overdue Ticket: ${ticket.title}`;
      const html = this.generateTicketOverdueEmail(ticket, customer);

      await this.sendEmail(recipient.email, subject, html);
      
      console.log(`✅ Overdue notification sent to ${recipient.email} for ticket ${ticket.id}`);
    } catch (error) {
      console.error('❌ Failed to send overdue notification:', error);
    }
  }

  async sendTicketCompletedNotification(data: NotificationData): Promise<void> {
    try {
      const { recipient, ticket, customer } = data;

      const subject = `Ticket Completed: ${ticket.title}`;
      const html = this.generateTicketCompletedEmail(ticket, customer);

      await this.sendEmail(recipient.email, subject, html);
      
      console.log(`✅ Completion notification sent to ${recipient.email} for ticket ${ticket.id}`);
    } catch (error) {
      console.error('❌ Failed to send completion notification:', error);
    }
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@grip-crm.com',
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  private generateTicketAssignmentEmail(ticket: Ticket, customer: Customer, assignedBy?: User): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Ticket Assignment</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #495057;">Ticket Details</h3>
          <p><strong>Title:</strong> ${ticket.title}</p>
          <p><strong>Customer:</strong> ${customer.name}</p>
          <p><strong>Priority:</strong> ${ticket.priority.toUpperCase()}</p>
          <p><strong>Stage:</strong> ${ticket.stage.replace('_', ' ').toUpperCase()}</p>
          ${ticket.dueDate ? `<p><strong>Due Date:</strong> ${ticket.dueDate.toLocaleDateString()}</p>` : ''}
          ${assignedBy ? `<p><strong>Assigned by:</strong> ${assignedBy.name}</p>` : ''}
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h4 style="margin-top: 0;">Description</h4>
          <p>${ticket.description}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px;">
          <p>This is an automated notification from Grip CRM. Please do not reply to this email.</p>
        </div>
      </div>
    `;
  }

  private generateTicketOverdueEmail(ticket: Ticket, customer: Customer): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">⚠️ Overdue Ticket Alert</h2>
        
        <div style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #f5c6cb;">
          <h3 style="margin-top: 0; color: #721c24;">Ticket Details</h3>
          <p><strong>Title:</strong> ${ticket.title}</p>
          <p><strong>Customer:</strong> ${customer.name}</p>
          <p><strong>Priority:</strong> ${ticket.priority.toUpperCase()}</p>
          <p><strong>Due Date:</strong> ${ticket.dueDate?.toLocaleDateString()}</p>
          <p><strong>Days Overdue:</strong> ${ticket.dueDate ? Math.ceil((Date.now() - ticket.dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 'N/A'}</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h4 style="margin-top: 0;">Description</h4>
          <p>${ticket.description}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px;">
          <p>This is an automated notification from Grip CRM. Please do not reply to this email.</p>
        </div>
      </div>
    `;
  }

  private generateTicketCompletedEmail(ticket: Ticket, customer: Customer): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">✅ Ticket Completed</h2>
        
        <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #c3e6cb;">
          <h3 style="margin-top: 0; color: #155724;">Ticket Details</h3>
          <p><strong>Title:</strong> ${ticket.title}</p>
          <p><strong>Customer:</strong> ${customer.name}</p>
          <p><strong>Completed At:</strong> ${ticket.completedAt?.toLocaleString()}</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h4 style="margin-top: 0;">Description</h4>
          <p>${ticket.description}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px;">
          <p>This is an automated notification from Grip CRM. Please do not reply to this email.</p>
        </div>
      </div>
    `;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}