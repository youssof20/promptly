import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { databaseService } from '@/lib/database-service';
import { verifyExtensionToken } from '@/lib/jwt';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

interface ExtensionOptimizeRequest {
  prompt: string;
  tier?: 'free' | 'pro';
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { 
          status: 401,
          headers: getCorsHeaders(),
        }
      );
    }

    const token = authHeader.substring(7);
    let userId: string;
    let tier: string;

    try {
      const decoded = verifyExtensionToken(token);
      
      if (!decoded) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { 
          status: 401,
          headers: getCorsHeaders(),
        });
      }

      userId = decoded.userId;
      tier = decoded.tier.toLowerCase();
    } catch (decodeError) {
      return NextResponse.json({ error: 'Invalid token' }, { 
        status: 401,
        headers: getCorsHeaders(),
      });
    }

    const body: ExtensionOptimizeRequest = await request.json();
    
    // Validate request
    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400, headers: getCorsHeaders() }
      );
    }

    // Check prompt length
    if (body.prompt.length > 10000) {
      return NextResponse.json(
        { error: 'Prompt too long. Maximum 10,000 characters.' },
        { status: 400, headers: getCorsHeaders() }
      );
    }

    // Check rate limiting first
    const rateLimitResult = await checkRateLimit(userId, tier, request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          quotaInfo: {
            remaining: rateLimitResult.remaining,
            limit: tier === 'pro' ? 1000 : 50,
            tier: tier
          }
        },
        { 
          status: 429, 
          headers: {
            ...getCorsHeaders(),
            ...getRateLimitHeaders(false, rateLimitResult.remaining, rateLimitResult.resetTime)
          }
        }
      );
    }

    // Check quota before optimization
    const quotaCheck = await databaseService.checkQuota(userId);
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
        { 
          status: 429, 
          headers: {
            ...getCorsHeaders(),
            ...getRateLimitHeaders(true, rateLimitResult.remaining, rateLimitResult.resetTime)
          }
        }
      );
    }

    // Use user's actual tier
    const userTier = tier === 'pro' ? 'pro' : 'free';

    // Optimize the prompt using AI service
    const result = await aiService.optimizePrompt({
      prompt: body.prompt,
      tier: userTier
    });

    // Log the optimization for analytics and quota tracking
    await databaseService.logOptimization({
      userId: userId,
      originalPrompt: body.prompt,
      optimizedPrompt: result.optimizedPrompt,
      tokensUsed: result.tokensUsed,
      model: result.model,
      tier: userTier,
    });

    // Add quota info to response
    const updatedQuota = await databaseService.checkQuota(userId);

    return NextResponse.json({
      success: true,
      optimized: result.optimizedPrompt,
      model: result.model,
      tokensUsed: result.tokensUsed,
      tier: userTier,
      quotaInfo: {
        remaining: updatedQuota.remainingQuota,
        limit: updatedQuota.quotaLimit,
        tier: updatedQuota.tier
      }
    }, {
      headers: {
        ...getCorsHeaders(),
        ...getRateLimitHeaders(true, rateLimitResult.remaining, rateLimitResult.resetTime)
      },
    });
  } catch (error) {
    console.error('Extension optimization API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Optimization failed. Please try again.' 
      },
      { 
        status: 500,
        headers: getCorsHeaders(),
      }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    service: 'promptly-extension-optimization-api',
    version: '1.0.0'
  });
}

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', // Allow all extension origins
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}
