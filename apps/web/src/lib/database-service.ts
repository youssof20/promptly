import { prisma } from '@promptly/database';
import { SubscriptionTier } from '@prisma/client';

interface LogOptimizationParams {
  userId: string;
  originalPrompt: string;
  optimizedPrompt: string;
  tokensUsed: number;
  model: string;
  tier: 'free' | 'pro';
}

interface QuotaCheck {
  canOptimize: boolean;
  remainingQuota: number;
  quotaLimit: number;
  tier: SubscriptionTier;
}

export class DatabaseService {
  async logOptimization(params: LogOptimizationParams): Promise<void> {
    const { userId, originalPrompt, optimizedPrompt, tokensUsed, model, tier } = params;
    
    try {
      // Convert tier to SubscriptionTier enum
      const subscriptionTier = tier === 'pro' ? SubscriptionTier.PRO : SubscriptionTier.FREE;
      
      // Create prompt record
      await prisma.prompt.create({
        data: {
          userId,
          originalPrompt,
          optimizedPrompt,
          tokensIn: Math.floor(originalPrompt.length / 4), // Rough token estimation
          tokensOut: tokensUsed,
          modelUsed: model,
          tier: subscriptionTier,
        },
      });

      // Update quota log for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.quotaLog.upsert({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
        update: {
          promptsUsed: {
            increment: 1,
          },
        },
        create: {
          userId,
          date: today,
          promptsUsed: 1,
        },
      });
    } catch (error) {
      console.error('Failed to log optimization:', error);
      // Don't throw error to avoid breaking the optimization flow
    }
  }

  async checkQuota(userId: string): Promise<QuotaCheck> {
    try {
      // Get user's subscription tier
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionTier: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const tier = user.subscriptionTier;
      
      // Define quota limits based on tier
      const quotaLimits = {
        [SubscriptionTier.FREE]: 50,
        [SubscriptionTier.PRO]: 1000,
      };

      const quotaLimit = quotaLimits[tier];

      // Get today's usage
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayUsage = await prisma.quotaLog.findUnique({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
        select: { promptsUsed: true },
      });

      const usedToday = todayUsage?.promptsUsed || 0;
      const remainingQuota = Math.max(0, quotaLimit - usedToday);

      return {
        canOptimize: remainingQuota > 0,
        remainingQuota,
        quotaLimit,
        tier,
      };
    } catch (error) {
      console.error('Failed to check quota:', error);
      // Return safe defaults
      return {
        canOptimize: false,
        remainingQuota: 0,
        quotaLimit: 0,
        tier: SubscriptionTier.FREE,
      };
    }
  }

  async getUserStats(userId: string) {
    try {
      // Get total prompts optimized
      const totalPrompts = await prisma.prompt.count({
        where: { userId },
      });

      // Get this month's usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const thisMonthPrompts = await prisma.prompt.count({
        where: {
          userId,
          createdAt: {
            gte: startOfMonth,
          },
        },
      });

      // Get recent prompts
      const recentPrompts = await prisma.prompt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          originalPrompt: true,
          optimizedPrompt: true,
          modelUsed: true,
          createdAt: true,
        },
      });

      return {
        totalPrompts,
        thisMonthPrompts,
        recentPrompts,
      };
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return {
        totalPrompts: 0,
        thisMonthPrompts: 0,
        recentPrompts: [],
      };
    }
  }

  async upgradeUserTier(userId: string, newTier: SubscriptionTier): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { subscriptionTier: newTier },
      });
    } catch (error) {
      console.error('Failed to upgrade user tier:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
