import { Queue, Worker } from 'bullmq';
import { getRedisConnection } from '../config/redis.js';
import CrawlerSource from '../models/CrawlerSource.js';
import { executeCrawl } from '../crawler/core/crawlerEngine.js';

let crawlerQueue = null;
let crawlerWorker = null;

const QUEUE_NAME = 'village-crawler-queue';

/**
 * Initializes the BullMQ Queue and Worker connected to Redis
 */
export async function initializeScheduler() {
  const connection = getRedisConnection();

  crawlerQueue = new Queue(QUEUE_NAME, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      },
      removeOnComplete: 100,
      removeOnFail: 500
    }
  });

  crawlerWorker = new Worker(
    QUEUE_NAME,
    async (job) => {
      console.log(`[BullMQ Worker] Processing job ${job.id}: ${job.name} (SourceId: ${job.data.sourceId})`);
      const { sourceId, triggerType } = job.data;
      return await executeCrawl(sourceId, triggerType || 'scheduled', job.id);
    },
    {
      connection,
      concurrency: 3
    }
  );

  crawlerWorker.on('completed', (job) => {
    console.log(`[BullMQ Worker] Job ${job.id} completed successfully.`);
  });

  crawlerWorker.on('failed', (job, err) => {
    console.error(`[BullMQ Worker] Job ${job?.id} failed with error: ${err.message}`);
  });

  // Setup repeating schedules for enabled sources
  await scheduleAllSources();

  console.log('[Scheduler] BullMQ scheduler and worker initialized successfully.');
}

/**
 * Configures repeatable jobs for each enabled source according to interval requirements:
 * - Jobs: Every 2 hours (120 mins)
 * - Recruitments: Every 2 hours (120 mins)
 * - Announcements: Every 2 hours (120 mins)
 * - News: Every 45 mins (30-60 mins)
 */
export async function scheduleAllSources() {
  if (!crawlerQueue) return;

  try {
    const repeatableJobs = await crawlerQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      await crawlerQueue.removeRepeatableByKey(job.key);
    }

    const sources = await CrawlerSource.find({ enabled: true });
    for (const source of sources) {
      let intervalMs = (source.scheduleIntervalMinutes || 120) * 60 * 1000;
      
      // Enforce prompt intervals
      if (source.category === 'news' && !source.scheduleIntervalMinutes) {
        intervalMs = 45 * 60 * 1000; // 45 mins
      }

      await crawlerQueue.add(
        `crawl-scheduled-${source.name}`,
        { sourceId: source._id, triggerType: 'scheduled' },
        {
          repeat: {
            every: intervalMs
          },
          jobId: `repeat-${source._id}`
        }
      );
      console.log(`[Scheduler] Registered repeatable crawl for "${source.name}" every ${intervalMs / 60000} mins`);
    }
  } catch (err) {
    console.error(`[Scheduler] Error scheduling sources: ${err.message}`);
  }
}

/**
 * Triggers an instant crawl for a specific source
 */
export async function triggerSourceNow(sourceId) {
  if (!crawlerQueue) {
    // If Redis queue not active, run directly
    return await executeCrawl(sourceId, 'manual');
  }

  const source = await CrawlerSource.findById(sourceId);
  if (!source) throw new Error('Source not found');

  const job = await crawlerQueue.add(
    `manual-crawl-${source.name}`,
    { sourceId: source._id, triggerType: 'manual' },
    { priority: 1 } // High priority for manual triggers
  );

  return {
    enqueued: true,
    jobId: job.id,
    sourceName: source.name
  };
}

/**
 * Returns current scheduler queue health and metrics
 */
export async function getSchedulerMetrics() {
  if (!crawlerQueue) {
    return { status: 'offline', waiting: 0, active: 0, completed: 0, failed: 0 };
  }

  const [waiting, active, completed, failed, repeatable] = await Promise.all([
    crawlerQueue.getWaitingCount(),
    crawlerQueue.getActiveCount(),
    crawlerQueue.getCompletedCount(),
    crawlerQueue.getFailedCount(),
    crawlerQueue.getRepeatableJobs()
  ]);

  return {
    status: 'active',
    waiting,
    active,
    completed,
    failed,
    repeatableCount: repeatable.length,
    repeatableJobs: repeatable.map((r) => ({
      key: r.key,
      name: r.name,
      id: r.id,
      every: r.every ? `${r.every / 60000} min` : r.cron,
      next: r.next ? new Date(r.next) : null
    }))
  };
}
