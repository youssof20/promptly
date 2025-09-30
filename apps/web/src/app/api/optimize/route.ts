import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { aiService } from '@/lib/ai-service';
import { databaseService } from '@/lib/database-service';

interface OptimizeRequest {
  prompt: string;
  tier: 'free' | 'pro';
}

interface OptimizeResponse {
  optimizedPrompt: string;
  tokensUsed: number;
  model: string;
  tier: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: OptimizeRequest = await request.json();
    
    // Validate request
    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      );
    }

    if (!body.tier || !['free', 'pro'].includes(body.tier)) {
      return NextResponse.json(
        { error: 'Invalid tier provided' },
        { status: 400 }
      );
    }

    // Check prompt length
    if (body.prompt.length > 10000) {
      return NextResponse.json(
        { error: 'Prompt too long. Maximum 10,000 characters.' },
        { status: 400 }
      );
    }

    // Check quota before optimization
    const quotaCheck = await databaseService.checkQuota((session.user as any).id);
    if (!quotaCheck.canOptimize) {
      return NextResponse.json(
        { 
          error: 'Quota exceeded',
          quotaInfo: {
            remaining: quotaCheck.remainingQuota,
            limit: quotaCheck.quotaLimit,
            tier: quotaCheck.tier
          }
        },
        { status: 429 }
      );
    }

    // Optimize the prompt using AI service
    const result = await aiService.optimizePrompt(body);

    // Log the optimization for analytics and quota tracking
    await databaseService.logOptimization({
      userId: (session.user as any).id,
      originalPrompt: body.prompt,
      optimizedPrompt: result.optimizedPrompt,
      tokensUsed: result.tokensUsed,
      model: result.model,
      tier: body.tier,
    });

    // Add quota info to response
    const updatedQuota = await databaseService.checkQuota((session.user as any).id);
    
    return NextResponse.json({
      ...result,
      quotaInfo: {
        remaining: updatedQuota.remainingQuota,
        limit: updatedQuota.quotaLimit,
        tier: updatedQuota.tier
      }
    });
  } catch (error) {
    console.error('Optimization API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    service: 'promptly-optimization-api',
    version: '1.0.0'
  });
}
