import fs from 'fs/promises';
import path from 'path';
import { ExportService } from './ExportService';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Customer } from '../models/Customer';
import { Ticket } from '../models/Ticket';
import { Note } from '../models/Note';
import { UserActivity } from '../models/UserActivity';

export interface BackupMetadata {
  id: string;
  userId?: string;
  createdAt: Date;
  type: 'daily' | 'manual' | 'account_deletion';
  size: number;
  files: string[];
}

export class BackupService {
  private exportService = new ExportService();
  private backupDir = process.env.BACKUP_DIR || 'backups';
  private userRepository = AppDataSource.getRepository(User);
  private customerRepository = AppDataSource.getRepository(Customer);
  private ticketRepository = AppDataSource.getRepository(Ticket);
  private noteRepository = AppDataSource.getRepository(Note);
  private activityRepository = AppDataSource.getRepository(UserActivity);

  async createDailyBackup(): Promise<BackupMetadata> {
    const backupId = `daily_${new Date().toISOString().split('T')[0]}_${Date.now()}`;
    return this.createBackup(backupId, 'daily');
  }

  async createManualBackup(userId?: string): Promise<BackupMetadata> {
    const backupId = `manual_${Date.now()}`;
    return this.createBackup(backupId, 'manual', userId);
  }

  async createAccountDeletionBackup(userId: string): Promise<BackupMetadata> {
    const backupId = `account_deletion_${userId}_${Date.now()}`;
    return this.createBackup(backupId, 'account_deletion', userId);
  }

  private async createBackup(
    backupId: string,
    type: 'daily' | 'manual' | 'account_deletion',
    userId?: string
  ): Promise<BackupMetadata> {
    try {
      // Ensure backup directory exists
      await this.ensureBackupDirectory();

      const backupPath = path.join(this.backupDir, backupId);
      await fs.mkdir(backupPath, { recursive: true });

      const files: string[] = [];
      let totalSize = 0;

      // Export all data
      const exportData = await this.exportService.exportAllData({
        includeNotes: true,
        format: 'json',
      });

      // Save customers data
      const customersFile = path.join(backupPath, 'customers.json');
      await fs.writeFile(customersFile, exportData.customers);
      files.push('customers.json');
      totalSize += Buffer.byteLength(exportData.customers, 'utf8');

      // Save tickets data
      const ticketsFile = path.join(backupPath, 'tickets.json');
      await fs.writeFile(ticketsFile, exportData.tickets);
      files.push('tickets.json');
      totalSize += Buffer.byteLength(exportData.tickets, 'utf8');

      // Save users data
      const usersFile = path.join(backupPath, 'users.json');
      await fs.writeFile(usersFile, exportData.users);
      files.push('users.json');
      totalSize += Buffer.byteLength(exportData.users, 'utf8');

      // Save backup metadata
      const metadata: BackupMetadata = {
        id: backupId,
        userId,
        createdAt: new Date(),
        type,
        size: totalSize,
        files,
      };

      const metadataFile = path.join(backupPath, 'metadata.json');
      await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2));
      files.push('metadata.json');

      console.log(`✅ Backup created: ${backupId} (${this.formatBytes(totalSize)})`);
      return metadata;
    } catch (error) {
      console.error(`❌ Failed to create backup ${backupId}:`, error);
      throw new Error(`Backup creation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async listBackups(): Promise<BackupMetadata[]> {
    try {
      await this.ensureBackupDirectory();
      const backupDirs = await fs.readdir(this.backupDir);
      const backups: BackupMetadata[] = [];

      for (const dir of backupDirs) {
        try {
          const metadataPath = path.join(this.backupDir, dir, 'metadata.json');
          const metadataContent = await fs.readFile(metadataPath, 'utf8');
          const metadata = JSON.parse(metadataContent) as BackupMetadata;
          backups.push(metadata);
        } catch (error) {
          console.warn(`⚠️ Could not read backup metadata for ${dir}:`, error instanceof Error ? error.message : String(error));
        }
      }

      return backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('❌ Failed to list backups:', error);
      return [];
    }
  }

  async deleteOldBackups(retentionDays: number = 30): Promise<number> {
    try {
      const backups = await this.listBackups();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      let deletedCount = 0;

      for (const backup of backups) {
        if (new Date(backup.createdAt) < cutoffDate) {
          try {
            const backupPath = path.join(this.backupDir, backup.id);
            await fs.rm(backupPath, { recursive: true, force: true });
            deletedCount++;
            console.log(`🗑️ Deleted old backup: ${backup.id}`);
          } catch (error) {
            console.error(`❌ Failed to delete backup ${backup.id}:`, error);
          }
        }
      }

      return deletedCount;
    } catch (error) {
      console.error('❌ Failed to cleanup old backups:', error);
      return 0;
    }
  }

  async deleteUserAccount(userId: string): Promise<{ backup: BackupMetadata; deletedRecords: number }> {
    try {
      // Create backup before deletion
      const backup = await this.createAccountDeletionBackup(userId);

      // Start transaction for deletion
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      let deletedRecords = 0;

      try {
        // Delete user activities
        const activitiesResult = await queryRunner.manager.delete(UserActivity, { userId });
        deletedRecords += activitiesResult.affected || 0;

        // Delete notes created by user
        const notesResult = await queryRunner.manager.delete(Note, { userId });
        deletedRecords += notesResult.affected || 0;

        // Unassign tickets from user (don't delete tickets)
        const ticketsResult = await queryRunner.manager.update(
          Ticket,
          { assignedUserId: userId },
          { assignedUserId: undefined }
        );
        deletedRecords += ticketsResult.affected || 0;

        // Delete the user
        const userResult = await queryRunner.manager.delete(User, { id: userId });
        deletedRecords += userResult.affected || 0;

        await queryRunner.commitTransaction();

        console.log(`✅ User account ${userId} deleted. ${deletedRecords} records affected.`);
        return { backup, deletedRecords };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      console.error(`❌ Failed to delete user account ${userId}:`, error);
      throw new Error(`Account deletion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getBackupStats(): Promise<{
    totalBackups: number;
    totalSize: string;
    oldestBackup?: Date;
    newestBackup?: Date;
  }> {
    const backups = await this.listBackups();
    const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);

    return {
      totalBackups: backups.length,
      totalSize: this.formatBytes(totalSize),
      oldestBackup: backups.length > 0 ? new Date(backups[backups.length - 1].createdAt) : undefined,
      newestBackup: backups.length > 0 ? new Date(backups[0].createdAt) : undefined,
    };
  }

  private async ensureBackupDirectory(): Promise<void> {
    try {
      await fs.access(this.backupDir);
    } catch {
      await fs.mkdir(this.backupDir, { recursive: true });
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Scheduled backup method (to be called by cron job or scheduler)
  async runScheduledBackup(): Promise<void> {
    try {
      console.log('🔄 Starting scheduled daily backup...');
      
      const backup = await this.createDailyBackup();
      console.log(`✅ Daily backup completed: ${backup.id}`);

      // Clean up old backups
      const deletedCount = await this.deleteOldBackups(30);
      if (deletedCount > 0) {
        console.log(`🗑️ Cleaned up ${deletedCount} old backups`);
      }
    } catch (error) {
      console.error('❌ Scheduled backup failed:', error);
    }
  }
}