import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { databaseService } from '@/lib/database-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': 'chrome-extension://eemkbcoembomnhfnhbcppgihnaikbmbn',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email;
    const userName = session.user.name || userEmail?.split('@')[0] || 'User';
    const subscriptionTier = (session.user as any).subscriptionTier || 'FREE';

    // Get user's current quota status
    const quotaInfo = await databaseService.checkQuota(userId);

    // Generate a secure token for the extension
    const extensionToken = Buffer.from(JSON.stringify({
      userId,
      name: userName,
      email: userEmail,
      tier: subscriptionTier,
      quotaUsed: quotaInfo.quotaLimit - quotaInfo.remainingQuota,
      quotaLimit: quotaInfo.quotaLimit,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    })).toString('base64');

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
      headers: {
        'Access-Control-Allow-Origin': 'chrome-extension://eemkbcoembomnhfnhbcppgihnaikbmbn',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Extension auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'chrome-extension://eemkbcoembomnhfnhbcppgihnaikbmbn',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'chrome-extension://eemkbcoembomnhfnhbcppgihnaikbmbn',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': 'chrome-extension://eemkbcoembomnhfnhbcppgihnaikbmbn',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is expired
      if (decoded.exp < Date.now()) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
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
        headers: {
          'Access-Control-Allow-Origin': 'chrome-extension://eemkbcoembomnhfnhbcppgihnaikbmbn',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    } catch (decodeError) {
      return NextResponse.json({ error: 'Invalid token' }, { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': 'chrome-extension://eemkbcoembomnhfnhbcppgihnaikbmbn',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
  } catch (error) {
    console.error('Extension token validation error:', error);
    return NextResponse.json({ error: 'Token validation failed' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'chrome-extension://eemkbcoembomnhfnhbcppgihnaikbmbn',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}
