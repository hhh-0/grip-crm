import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from './User';
import { Customer } from './Customer';
import { Ticket } from './Ticket';

@Entity('notes')
@Index(['createdAt'])
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  content: string;

  @Column({ name: 'ticket_id', nullable: true })
  @IsOptional()
  ticketId?: string;

  @Column({ name: 'customer_id', nullable: true })
  @IsOptional()
  customerId?: string;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, user => user.notes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Customer, customer => customer.customerNotes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @ManyToOne(() => Ticket, ticket => ticket.notes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ticket_id' })
  ticket?: Ticket;
}