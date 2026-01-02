import { Router } from 'express';
import { ExportController } from '../controllers/ExportController';
import { authenticateToken, requireVerifiedUser } from '../middleware/auth';
import { logActivity } from '../middleware/activity';
import { ActivityType } from '../models/UserActivity';

const router = Router();
const exportController = new ExportController();

// All routes require authentication
router.use(authenticateToken);
router.use(requireVerifiedUser);

// Export routes
router.get('/customers', logActivity(ActivityType.EXPORT_DATA), exportController.exportCustomers);
router.get('/tickets', logActivity(ActivityType.EXPORT_DATA), exportController.exportTickets);
router.get('/all', logActivity(ActivityType.EXPORT_DATA), exportController.exportAllData);
router.get('/stats', exportController.getExportStats);

// Backup routes
router.post('/backup', exportController.createBackup);
router.get('/backups', exportController.listBackups);
router.get('/backup-stats', exportController.getBackupStats);

// Account deletion
router.delete('/account', exportController.deleteAccount);

export default router;