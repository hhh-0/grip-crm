import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Ticket } from './Ticket';
import { Note } from './Note';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ name: 'password_hash' })
  @MinLength(6)
  passwordHash: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'verification_token', nullable: true })
  verificationToken?: string;

  @Column({ name: 'reset_token', nullable: true })
  resetToken?: string;

  @Column({ name: 'reset_token_expires', nullable: true })
  resetTokenExpires?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Ticket, ticket => ticket.assignedUser)
  assignedTickets: Ticket[];

  @OneToMany(() => Note, note => note.user)
  notes: Note[];
}