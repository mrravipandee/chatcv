import { Request } from "express";

interface RateLimitEntry {
  timestamps: number[];
  lastReset: number;
}

// In-memory rate limit store (IP -> timestamps)
// In production, use Redis for distributed caching
const rateLimitStore = new Map<string, RateLimitEntry>();

const REQUESTS_LIMIT = 5;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in ms

/**
 * Get client IP address from request
 */
function getClientIp(req: Request): string {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    (req.headers["x-real-ip"] as string) ||
    req.socket.remoteAddress ||
    "unknown"
  );
}

/**
 * Check if client has exceeded rate limit for email subscription
 * Max 5 requests per 24 hours per device/IP
 */
export function checkRateLimit(req: Request): { allowed: boolean; remaining: number; resetTime: Date } {
  const clientIp = getClientIp(req);
  const now = Date.now();

  let entry = rateLimitStore.get(clientIp);

  // Initialize or reset if window expired
  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW) {
    entry = {
      timestamps: [],
      lastReset: now,
    };
    rateLimitStore.set(clientIp, entry);
  }

  // Remove old timestamps outside the window
  entry.timestamps = entry.timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  const requestCount = entry.timestamps.length;
  const allowed = requestCount < REQUESTS_LIMIT;

  if (allowed) {
    entry.timestamps.push(now);
  }

  const resetTime = new Date(entry.lastReset + RATE_LIMIT_WINDOW);
  const remaining = Math.max(0, REQUESTS_LIMIT - entry.timestamps.length);

  return {
    allowed,
    remaining,
    resetTime,
  };
}

/**
 * Get current rate limit status for a client
 */
export function getRateLimitStatus(req: Request) {
  const clientIp = getClientIp(req);
  const now = Date.now();

  let entry = rateLimitStore.get(clientIp);

  if (!entry) {
    return {
      remaining: REQUESTS_LIMIT,
      resetTime: new Date(now + RATE_LIMIT_WINDOW),
    };
  }

  // Remove old timestamps
  entry.timestamps = entry.timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  return {
    remaining: Math.max(0, REQUESTS_LIMIT - entry.timestamps.length),
    resetTime: new Date(entry.lastReset + RATE_LIMIT_WINDOW),
  };
}
