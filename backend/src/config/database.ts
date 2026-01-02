import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Customer } from '../models/Customer';
import { Ticket } from '../models/Ticket';
import { Note } from '../models/Note';
import { UserActivity } from '../models/UserActivity';

// Parse DATABASE_URL if available (Railway provides this)
const getDatabaseConfig = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    // Parse PostgreSQL connection string
    // Format: postgresql://user:password@host:port/database
    const url = new URL(databaseUrl);
    return {
      type: 'postgres' as const,
      host: url.hostname,
      port: parseInt(url.port || '5432'),
      username: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading slash
    };
  }
  
  // Fallback to individual environment variables
  return {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'grip_user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'grip_crm',
  };
};

const dbConfig = getDatabaseConfig();

export const AppDataSource = new DataSource({
  ...dbConfig,
  synchronize: true, // Always synchronize to ensure tables exist
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Customer, Ticket, Note, UserActivity],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
    
    // Ensure tables are created
    console.log('🔄 Synchronizing database schema...');
    await AppDataSource.synchronize();
    console.log('✅ Database schema synchronized');
    
    // Auto-verify all existing users
    const userRepository = AppDataSource.getRepository('User');
    await userRepository.update({ isVerified: false }, { isVerified: true });
    console.log('✅ All users auto-verified');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};