import Redis from 'ioredis';

let redisClient: Redis | null = null;
let redisAvailable = false;

function createRedisClient(): void {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  try {
    const client = new Redis(redisUrl, {
      connectTimeout: 3000,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });

    client.on('connect', () => {
      redisAvailable = true;
      console.log('[Redis] Connected');
    });

    client.on('error', (err) => {
      if (redisAvailable) {
        console.warn('[Redis] Connection error — falling back to DB:', err.message);
      }
      redisAvailable = false;
    });

    client.on('close', () => {
      redisAvailable = false;
    });

    client.connect().catch(() => {
      console.warn('[Redis] Not available — running without cache');
      redisAvailable = false;
    });

    redisClient = client;
  } catch {
    console.warn('[Redis] Failed to initialize — running without cache');
  }
}

createRedisClient();

// ─── Resume Cache ─────────────────────────────────────────────────────────────

const RESUME_TTL = 300; // 5 minutes

export async function getCachedResume(resumeId: string): Promise<Record<string, unknown> | null> {
  if (!redisAvailable || !redisClient) return null;
  try {
    const raw = await redisClient.get(`chatcv:resume:${resumeId}`);
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function setCachedResume(resumeId: string, data: unknown): Promise<void> {
  if (!redisAvailable || !redisClient) return;
  try {
    await redisClient.setex(`chatcv:resume:${resumeId}`, RESUME_TTL, JSON.stringify(data));
  } catch {
    // silent — cache is best-effort
  }
}

export async function invalidateResumeCache(resumeId: string): Promise<void> {
  if (!redisAvailable || !redisClient) return;
  try {
    await redisClient.del(`chatcv:resume:${resumeId}`);
  } catch {
    // silent
  }
}

// ─── Token Counter ────────────────────────────────────────────────────────────

export async function incrementChatTokens(userId: string): Promise<number | null> {
  if (!redisAvailable || !redisClient) return null;
  try {
    return await redisClient.incr(`chatcv:tokens:${userId}`);
  } catch {
    return null;
  }
}

export async function getChatTokenCount(userId: string): Promise<number | null> {
  if (!redisAvailable || !redisClient) return null;
  try {
    const val = await redisClient.get(`chatcv:tokens:${userId}`);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return null;
  }
}

export async function syncTokensToRedis(userId: string, count: number): Promise<void> {
  if (!redisAvailable || !redisClient) return;
  try {
    await redisClient.set(`chatcv:tokens:${userId}`, count.toString());
  } catch {
    // silent
  }
}

export { redisClient };
