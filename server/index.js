import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seedSources.js';
import { initializeScheduler } from './scheduler/crawlerScheduler.js';
import { closeBrowser } from './crawler/core/playwrightScraper.js';

import crawlerRoutes from './routes/crawlerRoutes.js';
import approvalRoutes from './routes/approvalRoutes.js';
import publicContentRoutes from './routes/publicContentRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'OUR VILLAGE - Automated Crawler & Information Aggregator',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/crawler', crawlerRoutes);
app.use('/api/approval', approvalRoutes);
app.use('/api/public', publicContentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);

// Serve static frontend build if present
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(`[Express Error] ${err.stack || err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Server Initialization
async function startServer() {
  try {
    await connectDB();
    await seedDatabase();

    // Initialize BullMQ Scheduler connected to Redis
    try {
      await initializeScheduler();
    } catch (schedErr) {
      console.warn(`[BullMQ Init Warning] ${schedErr.message}. Scheduler fallback active.`);
    }

    const server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🌾 OUR VILLAGE - Crawler & Information Aggregator API`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Endpoints: /api/crawler, /api/approval, /api/public`);
      console.log(`=======================================================`);
    });

    const shutdown = async () => {
      console.log('[System] Graceful shutdown initiated...');
      await closeBrowser();
      server.close(() => {
        console.log('[System] Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error(`[Fatal Server Start Error] ${err.message}`);
    process.exit(1);
  }
}

startServer();
