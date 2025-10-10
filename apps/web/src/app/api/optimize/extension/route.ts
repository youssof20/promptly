import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { databaseService } from '@/lib/database-service';

interface ExtensionOptimizeRequest {
  prompt: string;
  tier?: 'free' | 'pro';
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'chrome-extension://*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
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
          headers: {
            'Access-Control-Allow-Origin': 'chrome-extension://*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    const token = authHeader.substring(7);
    let userId: string;
    let tier: string;

    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is expired
      if (decoded.exp < Date.now()) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }

      userId = decoded.userId;
      tier = decoded.tier.toLowerCase();
    } catch (decodeError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body: ExtensionOptimizeRequest = await request.json();
    
    // Validate request
    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
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
        { status: 429 }
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
        'Access-Control-Allow-Origin': 'chrome-extension://*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
        headers: {
          'Access-Control-Allow-Origin': 'chrome-extension://*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
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
