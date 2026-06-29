import { NextRequest } from 'next/server';

/**
 * Basic In-Memory Rate Limiter (Edge Compatible)
 * Note: In a true enterprise environment with distributed servers (e.g., Vercel Edge), 
 * an in-memory map will only rate limit per instance. 
 * For global rate limiting, use Upstash Redis (@upstash/ratelimit).
 */

type RateLimitRecord = {
  count: number;
  resetTime: number;
};

const rateLimitMap = new Map<string, RateLimitRecord>();

export async function checkRateLimit(
  req: NextRequest, 
  limit: number = 60, // Requests allowed
  windowMs: number = 60000 // Time window in milliseconds (1 minute)
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  
  // Get IP from headers (works on Vercel and local)
  const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
  
  const now = Date.now();
  let record = rateLimitMap.get(ip);

  if (!record || record.resetTime < now) {
    record = { count: 1, resetTime: now + windowMs };
    rateLimitMap.set(ip, record);
    return { success: true, limit, remaining: limit - 1, reset: record.resetTime };
  }

  if (record.count >= limit) {
    return { success: false, limit, remaining: 0, reset: record.resetTime };
  }

  record.count++;
  rateLimitMap.set(ip, record);

  return { success: true, limit, remaining: limit - record.count, reset: record.resetTime };
}
