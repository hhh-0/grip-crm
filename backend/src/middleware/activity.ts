import { Request, Response, NextFunction } from 'express';
import { ActivityService } from '../services/ActivityService';
import { ActivityType } from '../models/UserActivity';
import { AuthenticatedRequest } from './auth';

const activityService = new ActivityService();

export const logActivity = (activityType: ActivityType, description?: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');
        
        // Log activity asynchronously to avoid blocking the request
        setImmediate(async () => {
          try {
            await activityService.logActivity(
              req.user!.userId,
              activityType,
              description,
              {
                method: req.method,
                url: req.originalUrl,
                body: req.method !== 'GET' ? req.body : undefined,
              },
              ipAddress,
              userAgent
            );
          } catch (error) {
            console.error('Failed to log activity:', error);
          }
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};