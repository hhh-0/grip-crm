import { Router } from 'express';
import authRoutes from './auth';
import customerRoutes from './customers';
import ticketRoutes from './tickets';
import exportRoutes from './export';

const router = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/tickets', ticketRoutes);
router.use('/export', exportRoutes);

export default router;