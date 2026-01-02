import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Ticket } from './Ticket';
import { Note } from './Note';

@Entity('customers')
@Index(['email'], { unique: true, where: 'email IS NOT NULL' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Column({ nullable: true })
  @IsOptional()
  phone?: string;

  @Column({ nullable: true })
  @IsOptional()
  company?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Ticket, ticket => ticket.customer)
  tickets: Ticket[];

  @OneToMany(() => Note, note => note.customer)
  customerNotes: Note[];
}