import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@promptly/database';
import { aiService } from '@/lib/ai-service';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'promptly-api',
    version: '1.0.0',
    uptime: process.uptime(),
    checks: {
      database: { status: 'unknown', responseTime: 0 },
      aiProviders: { status: 'unknown', providers: [] },
      memory: { status: 'unknown', usage: 0 },
      environment: { status: 'unknown', variables: {} }
    }
  };

  try {
    // Check database connection
    const dbStart = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      health.checks.database = {
        status: 'healthy',
        responseTime: Date.now() - dbStart
      };
    } catch (error) {
      health.checks.database = {
        status: 'unhealthy',
        responseTime: Date.now() - dbStart,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Check AI providers
    try {
      const providers = aiService.getAvailableProviders();
      health.checks.aiProviders = {
        status: providers.length > 0 ? 'healthy' : 'warning',
        providers: providers.map(provider => ({
          name: provider,
          available: aiService.isProviderAvailable(provider)
        }))
      };
    } catch (error) {
      health.checks.aiProviders = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Check memory usage
    const memUsage = process.memoryUsage();
    const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    health.checks.memory = {
      status: memUsageMB < 500 ? 'healthy' : 'warning',
      usage: memUsageMB,
      limit: Math.round(memUsage.heapTotal / 1024 / 1024)
    };

    // Check critical environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'OPENAI_API_KEY',
      'DEEPSEEK_API_KEY',
      'STRIPE_SECRET_KEY'
    ];

    const envStatus = requiredEnvVars.every(envVar => process.env[envVar]) ? 'healthy' : 'warning';
    health.checks.environment = {
      status: envStatus,
      variables: requiredEnvVars.reduce((acc, envVar) => {
        acc[envVar] = process.env[envVar] ? 'set' : 'missing';
        return acc;
      }, {} as Record<string, string>)
    };

    // Overall health status
    const allChecksHealthy = Object.values(health.checks).every(check => 
      check.status === 'healthy' || check.status === 'warning'
    );

    health.status = allChecksHealthy ? 'healthy' : 'unhealthy';
    health.responseTime = Date.now() - startTime;

    const statusCode = allChecksHealthy ? 200 : 503;
    
    return NextResponse.json(health, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    health.status = 'unhealthy';
    health.responseTime = Date.now() - startTime;
    health.error = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(health, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}

// Simple ping endpoint
export async function HEAD() {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
