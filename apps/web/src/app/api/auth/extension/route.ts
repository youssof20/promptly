import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { databaseService } from '@/lib/database-service';
import { signExtensionToken, verifyExtensionToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { 
        status: 401,
        headers: getCorsHeaders(),
      });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email;
    const userName = session.user.name || userEmail?.split('@')[0] || 'User';
    const subscriptionTier = (session.user as any).subscriptionTier || 'FREE';

    // Get user's current quota status
    const quotaInfo = await databaseService.checkQuota(userId);

    // Generate a secure JWT token for the extension
    const extensionToken = signExtensionToken({
      userId,
      email: userEmail || '',
      name: userName,
      tier: subscriptionTier,
      quotaUsed: quotaInfo.quotaLimit - quotaInfo.remainingQuota,
      quotaLimit: quotaInfo.quotaLimit,
    });

    return NextResponse.json({
      success: true,
      token: extensionToken,
      user: {
        id: userId,
        name: userName,
        email: userEmail,
        tier: subscriptionTier,
        quotaUsed: quotaInfo.quotaLimit - quotaInfo.remainingQuota,
        quotaLimit: quotaInfo.quotaLimit
      }
    }, {
      headers: getCorsHeaders(),
    });
  } catch (error) {
    console.error('Extension auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { 
      status: 500,
      headers: getCorsHeaders(),
    });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { 
        status: 401,
        headers: getCorsHeaders(),
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verifyExtensionToken(token);
      
      if (!decoded) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
      }

      // Get fresh quota info
      const quotaInfo = await databaseService.checkQuota(decoded.userId);

      return NextResponse.json({
        success: true,
        user: {
          id: decoded.userId,
          name: decoded.name || decoded.email?.split('@')[0] || 'User',
          email: decoded.email,
          tier: decoded.tier,
          quotaUsed: quotaInfo.quotaLimit - quotaInfo.remainingQuota,
          quotaLimit: quotaInfo.quotaLimit
        }
      }, {
        headers: getCorsHeaders(),
      });
    } catch (decodeError) {
      return NextResponse.json({ error: 'Invalid token' }, { 
        status: 401,
        headers: getCorsHeaders(),
      });
    }
  } catch (error) {
    console.error('Extension token validation error:', error);
    return NextResponse.json({ error: 'Token validation failed' }, { 
      status: 500,
      headers: getCorsHeaders(),
    });
  }
}

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', // Allow all extension origins
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}
