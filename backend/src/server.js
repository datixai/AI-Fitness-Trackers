// src/server.js - Express Application Entry Point (Security-Fixed)
// Fix: Stripe webhook registered BEFORE express.json() (raw body required for sig verification)
// Fix: Global rate limiter on /api/auth routes
// Fix: JSON body limit reduced from 50mb to 1mb (DoS prevention)
// Fix: Env vars validated at startup via validateEnv()
// Fix: express.raw() webhook route exempt from JSON parser

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';

dotenv.config();

// Validate required environment variables before anything else
import { validateEnv } from './config/validateEnv.js';
validateEnv();

// Import routes
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/client.js';
import workoutRoutes from './routes/workout.js';
import dailyLogRoutes from './routes/dailyLog.js';
import measurementRoutes from './routes/measurements.js';
import planRoutes from './routes/plans.js';
import blogRoutes from './routes/blogs.js';
import foodRoutes from './routes/food.js';
import supplementRoutes from './routes/supplements.js';
import analyticsRoutes from './routes/analytics.js';
import paymentRoutes, { stripeWebhookHandler } from './routes/payments.js';
import adminRoutes from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

const app = express();
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

// ============================================
// STRIPE WEBHOOK — must come BEFORE express.json()
// Stripe requires the raw request body for signature verification
// ============================================

app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhookHandler
);

// ============================================
// SECURITY MIDDLEWARE
// ============================================

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers — 1mb limit (was 50mb, DoS vector)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Logging
app.use(morgan(ENV === 'development' ? 'dev' : 'combined'));
app.use(requestLogger);

// Static file serving (dev only — use cloud storage in production)
app.use('/uploads', express.static('uploads'));

// ============================================
// RATE LIMITING
// ============================================

// Strict limit on auth endpoints (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), environment: ENV, uptime: process.uptime() });
});

app.get('/', (req, res) => {
  res.json({ message: 'AM CULTURISMO - Fitness Tracker API', version: '1.0.1' });
});

// ============================================
// API ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);       // Public
app.use('/api/food', foodRoutes);        // Public

app.use('/api/client', clientRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/daily-log', dailyLogRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/supplements', supplementRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// ============================================
// ERROR HANDLING
// ============================================

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found', path: req.originalUrl });
});

app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║     🏋️  AM CULTURISMO - Fitness Tracker API      ║
╚═══════════════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}
📍 Environment: ${ENV}
🔒 Rate limiting: enabled
📊 Body limit: 1mb
  `);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

export default app;
