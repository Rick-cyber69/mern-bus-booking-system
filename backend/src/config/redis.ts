import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

// Redis client with lazy connection and fallback store for dev resiliency
export const redisClient = new Redis({
  host: redisHost,
  port: redisPort,
  retryStrategy: (times) => {
    // Retry connection up to 3 times before entering offline mode
    if (times > 3) {
      console.warn('[Redis] Max retries reached. Running in-memory fallback mode.');
      return null;
    }
    return Math.min(times * 100, 3000);
  },
  lazyConnect: true,
});

redisClient.on('connect', () => {
  console.log(`[Redis] Connected successfully to ${redisHost}:${redisPort}`);
});

redisClient.on('error', (err) => {
  console.warn(`[Redis] Notice: ${err.message}`);
});

// Fallback in-memory map for seat hold locks if Redis is not running locally
const memoryStore = new Map<string, { value: string; expiresAt: number }>();

export const memoryRedis = {
  async setex(key: string, seconds: number, value: string): Promise<string> {
    const expiresAt = Date.now() + seconds * 1000;
    memoryStore.set(key, { value, expiresAt });
    return 'OK';
  },
  async get(key: string): Promise<string | null> {
    const item = memoryStore.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      memoryStore.delete(key);
      return null;
    }
    return item.value;
  },
  async del(key: string): Promise<number> {
    return memoryStore.delete(key) ? 1 : 0;
  },
  async keys(pattern: string): Promise<string[]> {
    const now = Date.now();
    const result: string[] = [];
    const prefix = pattern.replace('*', '');
    for (const [key, item] of memoryStore.entries()) {
      if (now > item.expiresAt) {
        memoryStore.delete(key);
      } else if (key.startsWith(prefix)) {
        result.push(key);
      }
    }
    return result;
  }
};
