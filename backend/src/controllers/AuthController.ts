import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { ActivityService } from '../services/ActivityService';
import { UserData, LoginData, ApiResponse } from '../types';
import { validateEntity } from '../utils/validation';
import { User } from '../models/User';
import { ActivityType } from '../models/UserActivity';

export class AuthController {
  private authService = new AuthService();
  private activityService = new ActivityService();

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('🔍 Registration request received:', req.body);
      const userData: UserData = req.body;

      // Basic validation for registration data
      if (!userData.email || !userData.name || !userData.password) {
        console.log('❌ Validation failed: Missing required fields');
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: ['Email, name, and password are required'],
        });
        return;
      }

      if (userData.password.length < 6) {
        console.log('❌ Validation failed: Password too short');
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: ['Password must be at least 6 characters long'],
        });
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        console.log('❌ Validation failed: Invalid email format');
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: ['Invalid email address'],
        });
        return;
      }

      if (userData.name.trim().length < 2) {
        console.log('❌ Validation failed: Name too short');
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: ['Name must be at least 2 characters long'],
        });
        return;
      }

      console.log('✅ Validation passed, calling AuthService...');
      const result = await this.authService.register(userData);
      console.log('✅ Registration successful for:', userData.email);

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            isVerified: result.user.isVerified,
          },
          token: result.token,
        },
        message: 'User registered successfully. Please check your email for verification.',
      });
    } catch (error: any) {
      console.error('❌ Registration error:', error.message);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: LoginData = req.body;

      if (!loginData.email || !loginData.password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
        return;
      }

      const result = await this.authService.login(loginData);

      // Log successful login activity
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      await this.activityService.logActivity(
        result.user.id,
        ActivityType.LOGIN,
        'User logged in successfully',
        { email: result.user.email },
        ipAddress,
        userAgent
      );

      res.json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            isVerified: result.user.isVerified,
          },
          token: result.token,
        },
        message: 'Login successful',
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message,
      });
    }
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.params;

      if (!token) {
        res.status(400).json({
          success: false,
          error: 'Verification token is required',
        });
        return;
      }

      const user = await this.authService.verifyEmail(token);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isVerified: user.isVerified,
          },
        },
        message: 'Email verified successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          error: 'Email is required',
        });
        return;
      }

      await this.authService.requestPasswordReset(email);

      res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Failed to process password reset request',
      });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!token || !password) {
        res.status(400).json({
          success: false,
          error: 'Token and new password are required',
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters long',
        });
        return;
      }

      const user = await this.authService.resetPassword(token, password);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isVerified: user.isVerified,
          },
        },
        message: 'Password reset successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };
}