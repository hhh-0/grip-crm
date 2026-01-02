import { AppDataSource } from '../config/database';
import { UserActivity, ActivityType } from '../models/UserActivity';

export class ActivityService {
  private activityRepository = AppDataSource.getRepository(UserActivity);

  async logActivity(
    userId: string,
    activityType: ActivityType,
    description?: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<UserActivity> {
    const activity = this.activityRepository.create({
      userId,
      activityType,
      description,
      metadata,
      ipAddress,
      userAgent,
    });

    return this.activityRepository.save(activity);
  }

  async getUserActivities(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ activities: UserActivity[]; total: number }> {
    const [activities, total] = await this.activityRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
      relations: ['user'],
    });

    return { activities, total };
  }

  async getRecentActivities(
    limit: number = 20
  ): Promise<UserActivity[]> {
    return this.activityRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['user'],
    });
  }

  async getActivitiesByType(
    activityType: ActivityType,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ activities: UserActivity[]; total: number }> {
    const [activities, total] = await this.activityRepository.findAndCount({
      where: { activityType },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
      relations: ['user'],
    });

    return { activities, total };
  }

  async cleanupOldActivities(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.activityRepository
      .createQueryBuilder()
      .delete()
      .where('created_at < :cutoffDate', { cutoffDate })
      .execute();

    return result.affected || 0;
  }
}