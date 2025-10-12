import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { databaseService } from '@/lib/database-service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const subscriptionTier = (session.user as any).subscriptionTier || 'FREE';

    // Get user stats
    const stats = await databaseService.getUserStats(userId);
    
    // Get optimization history (limited for free users)
    const historyLimit = subscriptionTier === 'PRO' || subscriptionTier === 'ENTERPRISE' ? 50 : 5;
    const history = await databaseService.getOptimizationHistory(userId, historyLimit);

    // Get current quota info
    const quotaInfo = await databaseService.checkQuota(userId);

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        subscriptionTier,
        quotaInfo: {
          used: quotaInfo.quotaLimit - quotaInfo.remainingQuota,
          limit: quotaInfo.quotaLimit,
          remaining: quotaInfo.remainingQuota,
          period: quotaInfo.quotaPeriod
        }
      },
      history,
      isPro: subscriptionTier === 'PRO' || subscriptionTier === 'ENTERPRISE'
    });
  } catch (error) {
    console.error('User stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}