import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';

export enum ActivityType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  CREATE_CUSTOMER = 'create_customer',
  UPDATE_CUSTOMER = 'update_customer',
  DELETE_CUSTOMER = 'delete_customer',
  CREATE_TICKET = 'create_ticket',
  UPDATE_TICKET = 'update_ticket',
  ASSIGN_TICKET = 'assign_ticket',
  MOVE_TICKET_STAGE = 'move_ticket_stage',
  ADD_NOTE = 'add_note',
  IMPORT_CUSTOMERS = 'import_customers',
  EXPORT_DATA = 'export_data',
}

@Entity('user_activities')
@Index(['userId', 'createdAt'])
@Index(['activityType'])
export class UserActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ActivityType,
    name: 'activity_type',
  })
  activityType: ActivityType;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress?: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}