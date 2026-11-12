import express from 'express';
import CrawlerSource from '../models/CrawlerSource.js';
import CrawlingLog from '../models/CrawlingLog.js';
import CrawlerJob from '../models/CrawlerJob.js';
import { executeCrawl } from '../crawler/core/crawlerEngine.js';
import { triggerSourceNow, getSchedulerMetrics, scheduleAllSources } from '../scheduler/crawlerScheduler.js';
import { validateTargetUrl } from '../crawler/core/security.js';

const router = express.Router();

// Get all crawler sources
router.get('/sources', async (req, res) => {
  try {
    const { category, enabled } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (enabled !== undefined) filter.enabled = enabled === 'true';

    const sources = await CrawlerSource.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, sources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create new crawler source with SSRF validation
router.post('/sources', async (req, res) => {
  try {
    const { name, url, category, subCategory, crawlerType, adapterKey, rssFeedUrl, scheduleIntervalMinutes, district, mandal, village } = req.body;

    // Validate target URL against SSRF
    await validateTargetUrl(url);
    if (rssFeedUrl) {
      await validateTargetUrl(rssFeedUrl);
    }

    const source = new CrawlerSource({
      name,
      url,
      category,
      subCategory: subCategory || 'general',
      crawlerType: crawlerType || 'static_html',
      adapterKey,
      rssFeedUrl,
      scheduleIntervalMinutes: scheduleIntervalMinutes || (category === 'news' ? 45 : 120),
      district: district || 'Guntur',
      mandal: mandal || 'Tenali',
      village: village || 'Angalakuduru'
    });

    await source.save();
    await scheduleAllSources();

    res.status(201).json({ success: true, source });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update crawler source
router.put('/sources/:id', async (req, res) => {
  try {
    const source = await CrawlerSource.findById(req.params.id);
    if (!source) return res.status(404).json({ success: false, message: 'Source not found' });

    if (req.body.url && req.body.url !== source.url) {
      await validateTargetUrl(req.body.url);
    }

    Object.assign(source, req.body);
    await source.save();
    await scheduleAllSources();

    res.json({ success: true, source });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete crawler source
router.delete('/sources/:id', async (req, res) => {
  try {
    const source = await CrawlerSource.findByIdAndDelete(req.params.id);
    if (!source) return res.status(404).json({ success: false, message: 'Source not found' });
    await scheduleAllSources();
    res.json({ success: true, message: 'Crawler source deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Manual trigger crawl for a source
router.post('/trigger/:id', async (req, res) => {
  try {
    const sourceId = req.params.id;
    const result = await triggerSourceNow(sourceId);
    res.json({ success: true, message: 'Crawl triggered successfully', result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get crawler execution logs
router.get('/logs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const { level, sourceId } = req.query;

    const query = {};
    if (level && level !== 'all') query.level = level;
    if (sourceId) query.sourceId = sourceId;

    const total = await CrawlingLog.countDocuments(query);
    const logs = await CrawlingLog.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, total, page, limit, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get BullMQ Scheduler metrics and status
router.get('/scheduler-status', async (req, res) => {
  try {
    const metrics = await getSchedulerMetrics();
    res.json({ success: true, metrics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Force re-sync scheduler repeat jobs
router.post('/scheduler/sync', async (req, res) => {
  try {
    await scheduleAllSources();
    const metrics = await getSchedulerMetrics();
    res.json({ success: true, message: 'Schedulers synced successfully', metrics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
