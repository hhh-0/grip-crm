import { Response } from 'express';
import { ExportService } from '../services/ExportService';
import { BackupService } from '../services/BackupService';
import { ActivityService } from '../services/ActivityService';
import { AuthenticatedRequest } from '../middleware/auth';
import { ActivityType } from '../models/UserActivity';

export class ExportController {
  private exportService = new ExportService();
  private backupService = new BackupService();
  private activityService = new ActivityService();

  exportCustomers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const includeNotes = req.query.includeNotes === 'true';
      const format = (req.query.format as 'csv' | 'json') || 'csv';
      
      let dateRange;
      if (req.query.startDate && req.query.endDate) {
        dateRange = {
          start: new Date(req.query.startDate as string),
          end: new Date(req.query.endDate as string),
        };
      }

      const exportData = await this.exportService.exportCustomers({
        includeNotes,
        dateRange,
        format,
      });

      // Log activity
      if (req.user) {
        await this.activityService.logActivity(
          req.user.userId,
          ActivityType.EXPORT_DATA,
          'Exported customers data',
          { format, includeNotes, dateRange }
        );
      }

      const filename = `customers_export_${new Date().toISOString().split('T')[0]}.${format}`;
      const contentType = format === 'json' ? 'application/json' : 'text/csv';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(exportData);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  exportTickets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const includeNotes = req.query.includeNotes === 'true';
      const format = (req.query.format as 'csv' | 'json') || 'csv';
      
      let dateRange;
      if (req.query.startDate && req.query.endDate) {
        dateRange = {
          start: new Date(req.query.startDate as string),
          end: new Date(req.query.endDate as string),
        };
      }

      const exportData = await this.exportService.exportTickets({
        includeNotes,
        dateRange,
        format,
      });

      // Log activity
      if (req.user) {
        await this.activityService.logActivity(
          req.user.userId,
          ActivityType.EXPORT_DATA,
          'Exported tickets data',
          { format, includeNotes, dateRange }
        );
      }

      const filename = `tickets_export_${new Date().toISOString().split('T')[0]}.${format}`;
      const contentType = format === 'json' ? 'application/json' : 'text/csv';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(exportData);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  exportAllData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const includeNotes = req.query.includeNotes === 'true';
      const format = (req.query.format as 'csv' | 'json') || 'json';
      
      let dateRange;
      if (req.query.startDate && req.query.endDate) {
        dateRange = {
          start: new Date(req.query.startDate as string),
          end: new Date(req.query.endDate as string),
        };
      }

      const exportData = await this.exportService.exportAllData({
        includeNotes,
        dateRange,
        format,
      });

      // Log activity
      if (req.user) {
        await this.activityService.logActivity(
          req.user.userId,
          ActivityType.EXPORT_DATA,
          'Exported all data',
          { format, includeNotes, dateRange }
        );
      }

      if (format === 'json') {
        const filename = `full_export_${new Date().toISOString().split('T')[0]}.json`;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.json({
          exportDate: new Date().toISOString(),
          data: exportData,
        });
      } else {
        // For CSV, create a ZIP file with multiple CSV files
        res.status(400).json({
          success: false,
          error: 'CSV format not supported for full export. Use JSON format or export individual data types.',
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  getExportStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const stats = await this.exportService.getExportStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  createBackup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const backup = await this.backupService.createManualBackup(req.user?.userId);

      res.json({
        success: true,
        data: backup,
        message: 'Backup created successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  listBackups = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const backups = await this.backupService.listBackups();

      res.json({
        success: true,
        data: backups,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  getBackupStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const stats = await this.backupService.getBackupStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  deleteAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { password } = req.body;
      if (!password) {
        res.status(400).json({
          success: false,
          error: 'Password confirmation required',
        });
        return;
      }

      // TODO: Verify password before deletion
      
      const result = await this.backupService.deleteUserAccount(req.user.userId);

      res.json({
        success: true,
        data: {
          backup: result.backup,
          deletedRecords: result.deletedRecords,
        },
        message: 'Account deleted successfully. Backup has been created.',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
}