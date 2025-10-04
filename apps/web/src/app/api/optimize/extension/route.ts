import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

interface ExtensionOptimizeRequest {
  prompt: string;
  tier?: 'free' | 'pro';
}

export async function POST(request: NextRequest) {
  try {
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

    // Use free tier by default for extension users
    const tier = body.tier || 'free';

    // Optimize the prompt using AI service
    const result = await aiService.optimizePrompt({
      prompt: body.prompt,
      tier: tier
    });

    return NextResponse.json({
      success: true,
      optimized: result.optimizedPrompt,
      model: result.model,
      tokensUsed: result.tokensUsed,
      tier: tier
    });
  } catch (error) {
    console.error('Extension optimization API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Optimization failed. Please try again.' 
      },
      { status: 500 }
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
