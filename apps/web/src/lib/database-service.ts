import { prisma } from '@promptly/database';

export interface QuotaInfo {
  quotaLimit: number;
  remainingQuota: number;
  canOptimize: boolean;
  tier: string;
  quotaPeriod: string;
}

export interface OptimizationLog {
  userId: string;
  originalPrompt: string;
  optimizedPrompt: string;
  tokensUsed: number;
  model: string;
  tier: string;
}

export class DatabaseService {
  private getQuotaLimit(tier: string): number {
    switch (tier.toLowerCase()) {
      case 'pro':
        return 1000;
      case 'enterprise':
        return 10000;
      default:
        return 50; // Free tier
    }
  }

  private getCurrentQuotaPeriod(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  async checkQuota(userId: string): Promise<QuotaInfo> {
    try {
      // Get user info
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionTier: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const tier = user.subscriptionTier;
      const quotaLimit = this.getQuotaLimit(tier);
      const quotaPeriod = this.getCurrentQuotaPeriod();

      // Get current month's usage
      const quotaLog = await prisma.quotaLog.findUnique({
        where: {
          userId_quotaPeriod: {
            userId,
            quotaPeriod
          }
        }
      });

      const promptsUsed = quotaLog?.promptsUsed || 0;
      const remainingQuota = Math.max(0, quotaLimit - promptsUsed);

      return {
        quotaLimit,
        remainingQuota,
        canOptimize: remainingQuota > 0,
        tier,
        quotaPeriod
      };
    } catch (error) {
      console.error('Error checking quota:', error);
      // Return safe defaults
      return {
        quotaLimit: 50,
        remainingQuota: 0,
        canOptimize: false,
        tier: 'FREE',
        quotaPeriod: this.getCurrentQuotaPeriod()
      };
    }
  }

  async logOptimization(logData: OptimizationLog): Promise<void> {
    try {
      const quotaPeriod = this.getCurrentQuotaPeriod();

      // Upsert quota log for current period
      await prisma.quotaLog.upsert({
        where: {
          userId_quotaPeriod: {
            userId: logData.userId,
            quotaPeriod
          }
        },
        update: {
          promptsUsed: {
            increment: 1
          }
        },
        create: {
          userId: logData.userId,
          date: new Date(),
          promptsUsed: 1,
          quotaPeriod
        }
      });

      // Log the optimization details
      await prisma.prompt.create({
        data: {
          userId: logData.userId,
          originalPrompt: logData.originalPrompt,
          optimizedPrompt: logData.optimizedPrompt,
          tokensIn: Math.floor(logData.originalPrompt.length / 4), // Rough estimate
          tokensOut: logData.tokensUsed,
          modelUsed: logData.model,
          tier: logData.tier.toUpperCase() as any
        }
      });
    } catch (error) {
      console.error('Error logging optimization:', error);
      // Don't throw - this shouldn't break the optimization flow
    }
  }

  async getOptimizationHistory(userId: string, limit: number = 10): Promise<any[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionTier: true }
      });

      if (!user) {
        return [];
      }

      const tier = user.subscriptionTier;
      const historyLimit = tier === 'PRO' || tier === 'ENTERPRISE' ? limit : Math.min(limit, 5);

      return await prisma.prompt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: historyLimit,
        select: {
          id: true,
          originalPrompt: true,
          optimizedPrompt: true,
          modelUsed: true,
          createdAt: true,
          tokensUsed: true
        }
      });
    } catch (error) {
      console.error('Error getting optimization history:', error);
      return [];
    }
  }

  async getUserStats(userId: string): Promise<{
    totalOptimizations: number;
    thisMonthOptimizations: number;
    averageTokensSaved: number;
    favoriteModel: string;
  }> {
    try {
      const quotaPeriod = this.getCurrentQuotaPeriod();

      // Get total optimizations
      const totalOptimizations = await prisma.prompt.count({
        where: { userId }
      });

      // Get this month's optimizations
      const thisMonthOptimizations = await prisma.quotaLog.findUnique({
        where: {
          userId_quotaPeriod: {
            userId,
            quotaPeriod
          }
        },
        select: { promptsUsed: true }
      });

      // Get average tokens saved (rough calculation)
      const recentPrompts = await prisma.prompt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: { tokensIn: true, tokensOut: true }
      });

      const averageTokensSaved = recentPrompts.length > 0 
        ? Math.round(recentPrompts.reduce((sum, p) => sum + (p.tokensOut - p.tokensIn), 0) / recentPrompts.length)
        : 0;

      // Get most used model
      const modelUsage = await prisma.prompt.groupBy({
        by: ['modelUsed'],
        where: { userId },
        _count: { modelUsed: true },
        orderBy: { _count: { modelUsed: 'desc' } },
        take: 1
      });

      return {
        totalOptimizations,
        thisMonthOptimizations: thisMonthOptimizations?.promptsUsed || 0,
        averageTokensSaved,
        favoriteModel: modelUsage[0]?.modelUsed || 'unknown'
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalOptimizations: 0,
        thisMonthOptimizations: 0,
        averageTokensSaved: 0,
        favoriteModel: 'unknown'
      };
    }
  }
}

export const databaseService = new DatabaseService();