import { NextRequest } from 'next/server';

interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerMonth: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  free: {
    requestsPerMinute: 5,
    requestsPerMonth: 50,
  },
  pro: {
    requestsPerMinute: 20,
    requestsPerMonth: 1000,
  },
  enterprise: {
    requestsPerMinute: 100,
    requestsPerMonth: 10000,
  },
};

// In-memory rate limiting (for Vercel serverless)
// In production, consider using Vercel KV or Redis
const rateLimitStore = new Map<string, {
  minuteCount: number;
  monthCount: number;
  lastMinuteReset: number;
  lastMonthReset: number;
}>();

export async function checkRateLimit(
  userId: string,
  tier: string,
  request: NextRequest
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const config = RATE_LIMITS[tier.toLowerCase()] || RATE_LIMITS.free;
  const now = Date.now();
  const minuteKey = `${userId}:minute:${Math.floor(now / 60000)}`;
  const monthKey = `${userId}:month:${new Date().getMonth()}-${new Date().getFullYear()}`;

  // Get or create rate limit data
  let userData = rateLimitStore.get(userId);
  if (!userData) {
    userData = {
      minuteCount: 0,
      monthCount: 0,
      lastMinuteReset: now,
      lastMonthReset: now,
    };
    rateLimitStore.set(userId, userData);
  }

  // Reset counters if needed
  const minuteResetTime = Math.floor(now / 60000) * 60000;
  const monthResetTime = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();

  if (userData.lastMinuteReset < minuteResetTime) {
    userData.minuteCount = 0;
    userData.lastMinuteReset = minuteResetTime;
  }

  if (userData.lastMonthReset < monthResetTime) {
    userData.monthCount = 0;
    userData.lastMonthReset = monthResetTime;
  }

  // Check limits
  const minuteLimit = config.requestsPerMinute;
  const monthLimit = config.requestsPerMonth;

  if (userData.minuteCount >= minuteLimit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: minuteResetTime + 60000, // Next minute
    };
  }

  if (userData.monthCount >= monthLimit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: monthResetTime + (30 * 24 * 60 * 60 * 1000), // Next month
    };
  }

  // Increment counters
  userData.minuteCount++;
  userData.monthCount++;

  // Calculate remaining requests
  const remaining = Math.min(
    minuteLimit - userData.minuteCount,
    monthLimit - userData.monthCount
  );

  return {
    allowed: true,
    remaining: Math.max(0, remaining),
    resetTime: minuteResetTime + 60000,
  };
}

export function getRateLimitHeaders(
  allowed: boolean,
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': '50', // Default limit
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
    'X-RateLimit-Policy': allowed ? 'ok' : 'quota-exceeded',
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  const cutoff = now - (24 * 60 * 60 * 1000); // 24 hours ago

  for (const [key, data] of rateLimitStore.entries()) {
    if (data.lastMinuteReset < cutoff) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 60 * 1000); // Run every hour
