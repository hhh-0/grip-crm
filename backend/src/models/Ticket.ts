import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Customer } from './Customer';
import { User } from './User';
import { Note } from './Note';

export enum TicketStage {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  WAITING = 'waiting',
  COMPLETED = 'completed',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('tickets')
@Index(['stage'])
@Index(['priority'])
@Index(['createdAt'])
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  description: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'assigned_user_id', nullable: true })
  @IsOptional()
  assignedUserId?: string;

  @Column({
    type: 'enum',
    enum: TicketStage,
    default: TicketStage.NEW,
  })
  @IsEnum(TicketStage)
  stage: TicketStage;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @Column({ name: 'due_date', nullable: true })
  @IsOptional()
  dueDate?: Date;

  @Column({ name: 'completed_at', nullable: true })
  @IsOptional()
  completedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Customer, customer => customer.tickets, {
    onDelete: 'RESTRICT', // Prevent deletion of customers with tickets
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => User, user => user.assignedTickets, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'assigned_user_id' })
  assignedUser?: User;

  @OneToMany(() => Note, note => note.ticket)
  notes: Note[];
}