import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

// Authentication routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/verify/:token', (req, res) => authController.verifyEmail(req, res));
router.post('/forgot-password', (req, res) => authController.requestPasswordReset(req, res));
router.post('/reset-password/:token', (req, res) => authController.resetPassword(req, res));

export default router;