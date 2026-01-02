import { Router } from 'express';
import multer from 'multer';
import { CustomerController } from '../controllers/CustomerController';
import { authenticateToken, requireVerifiedUser } from '../middleware/auth';
import { logActivity } from '../middleware/activity';
import { ActivityType } from '../models/UserActivity';

const router = Router();
const customerController = new CustomerController();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

// All routes require authentication
router.use(authenticateToken);
router.use(requireVerifiedUser);

// Customer CRUD routes
router.post('/', logActivity(ActivityType.CREATE_CUSTOMER), customerController.createCustomer);
router.get('/', customerController.listCustomers);
router.get('/search', customerController.searchCustomers);
router.get('/stats', customerController.getCustomerStats);
router.get('/sample-csv', customerController.getSampleCSV);
router.get('/:id', customerController.getCustomer);
router.put('/:id', logActivity(ActivityType.UPDATE_CUSTOMER), customerController.updateCustomer);
router.delete('/:id', logActivity(ActivityType.DELETE_CUSTOMER), customerController.deleteCustomer);

// Import route
router.post('/import', upload.single('file'), logActivity(ActivityType.IMPORT_CUSTOMERS), customerController.importCustomers);

export default router;