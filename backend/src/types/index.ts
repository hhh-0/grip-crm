import { TicketStage, TicketPriority } from '../models/Ticket';

// Customer related types
export interface CustomerData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export interface CustomerFilters {
  search?: string;
  company?: string;
  hasTickets?: boolean;
  limit?: number;
  offset?: number;
}

// Ticket related types
export interface TicketData {
  title: string;
  description: string;
  customerId: string;
  assignedUserId?: string;
  stage?: TicketStage;
  priority?: TicketPriority;
  dueDate?: Date;
}

export interface TicketFilters {
  stage?: TicketStage;
  priority?: TicketPriority;
  customerId?: string;
  assignedUserId?: string;
  overdue?: boolean;
  limit?: number;
  offset?: number;
}

// User related types
export interface UserData {
  email: string;
  name: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Import related types
export interface ParsedData {
  headers: string[];
  rows: any[][];
}

export interface FieldMapping {
  name?: number;
  email?: number;
  phone?: number;
  company?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  validRows: any[];
  invalidRows: any[];
}

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
  customers: any[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Authentication types
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}