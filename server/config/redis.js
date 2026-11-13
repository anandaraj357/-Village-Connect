import Redis from 'ioredis';
import net from 'net';

let redisClient = null;

/**
 * Fast non-blocking check to test if Redis port is listening
 */
export const isRedisReachable = (host = '127.0.0.1', port = 6379, timeoutMs = 1000) => {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port, timeout: timeoutMs });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
  });
};

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
      // Suppress noisy ECONNREFUSED logs when Redis is intentionally offline
      if (err.code !== 'ECONNREFUSED') {
        console.error(`[Redis] Error: ${err.message}`);
      }
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
