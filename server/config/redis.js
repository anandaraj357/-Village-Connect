import Redis from 'ioredis';

let redisClient = null;

export const getRedisConnection = () => {
  if (!redisClient) {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null, // Required by BullMQ
      enableReadyCheck: false,
      retryStrategy(times) {
        const delay = Math.min(times * 200, 3000);
        return delay;
      }
    });

    redisClient.on('connect', () => {
      console.log('[Redis] Connected successfully to port 6379');
    });

    redisClient.on('error', (err) => {
      console.error(`[Redis] Error: ${err.message}`);
    });
  }

  return redisClient;
};

export const createRedisClient = () => {
  return new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  });
};
