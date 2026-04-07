// src/routes/analytics.js - Analytics & Progress Tracking

import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { queryAsync } from '../config/database.js';

const router = express.Router();

// ============================================
// CLIENT: Personal Analytics
// ============================================

// Get weight progress
router.get('/weight-progress', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT log_date, weight_kg
       FROM daily_logs 
       WHERE client_id = $1 
       ORDER BY log_date ASC`,
      [req.user.id]
    );

    const stats = {
      data: result.rows,
      latest: result.rows[result.rows.length - 1] || null,
      initial: result.rows[0] || null,
      totalChange: result.rows.length > 0 
        ? (result.rows[result.rows.length - 1].weight_kg - result.rows[0].weight_kg).toFixed(2)
        : 0
    };

    res.json({ success: true, ...stats });
  } catch (error) {
    next(error);
  }
});

// Get body fat progress
router.get('/bodyfat-progress', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT measurement_date, body_fat_percentage
       FROM body_fat_tracking 
       WHERE client_id = $1 
       ORDER BY measurement_date ASC`,
      [req.user.id]
    );

    const stats = {
      data: result.rows,
      latest: result.rows[result.rows.length - 1] || null,
      initial: result.rows[0] || null,
      totalChange: result.rows.length > 0 
        ? (result.rows[result.rows.length - 1].body_fat_percentage - result.rows[0].body_fat_percentage).toFixed(2)
        : 0
    };

    res.json({ success: true, ...stats });
  } catch (error) {
    next(error);
  }
});

// Get mood/energy/stress trends
router.get('/wellness-trends', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT log_date, mood, stress, energy, sleep_quality, hunger
       FROM daily_logs 
       WHERE client_id = $1 
       ORDER BY log_date ASC`,
      [req.user.id]
    );

    res.json({ success: true, trends: result.rows });
  } catch (error) {
    next(error);
  }
});

// Get measurement progress (circumferences)
router.get('/measurements-progress', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT measurement_date, petto_cm, vita_cm, coscia_sinistra_cm, coscia_destra_cm, total_cm
       FROM measurements 
       WHERE client_id = $1 
       ORDER BY measurement_date ASC`,
      [req.user.id]
    );

    res.json({ success: true, measurements: result.rows });
  } catch (error) {
    next(error);
  }
});

// Get workout frequency
router.get('/workout-frequency', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT DATE(log_date) as date, COUNT(*) as count
       FROM workout_logs 
       WHERE client_id = $1 
       GROUP BY DATE(log_date)
       ORDER BY date ASC`,
      [req.user.id]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// Get overall stats
router.get('/dashboard-stats', verifyToken, async (req, res, next) => {
  try {
    // Get counts
    const logsCount = await queryAsync(
      'SELECT COUNT(*) as count FROM daily_logs WHERE client_id = $1',
      [req.user.id]
    );

    const workoutsCount = await queryAsync(
      'SELECT COUNT(*) as count FROM workout_logs WHERE client_id = $1',
      [req.user.id]
    );

    const photosCount = await queryAsync(
      'SELECT COUNT(*) as count FROM progress_photos WHERE client_id = $1',
      [req.user.id]
    );

    // Get latest weight
    const latestWeight = await queryAsync(
      'SELECT weight_kg FROM daily_logs WHERE client_id = $1 ORDER BY log_date DESC LIMIT 1',
      [req.user.id]
    );

    // Get plan status
    const planStatus = await queryAsync(
      'SELECT status FROM plans WHERE client_id = $1 ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );

    res.json({
      success: true,
      stats: {
        totalLogs: parseInt(logsCount.rows[0].count),
        totalWorkouts: parseInt(workoutsCount.rows[0].count),
        progressPhotos: parseInt(photosCount.rows[0].count),
        latestWeight: latestWeight.rows[0]?.weight_kg || null,
        planStatus: planStatus.rows[0]?.status || 'inactive'
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ADMIN: Client Analytics
// ============================================

// Get specific client stats (admin)
router.get('/admin/client/:clientId', verifyAdmin, async (req, res, next) => {
  try {
    const { clientId } = req.params;

    // Get client info
    const clientResult = await queryAsync(
      'SELECT id, email, first_name, last_name, initial_weight_kg FROM users WHERE id = $1 AND role = $2',
      [clientId, 'client']
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const client = clientResult.rows[0];

    // Get stats
    const logsCount = await queryAsync(
      'SELECT COUNT(*) as count FROM daily_logs WHERE client_id = $1',
      [clientId]
    );

    const latestWeight = await queryAsync(
      'SELECT weight_kg, log_date FROM daily_logs WHERE client_id = $1 ORDER BY log_date DESC LIMIT 1',
      [clientId]
    );

    const workoutsCount = await queryAsync(
      'SELECT COUNT(*) as count FROM workouts WHERE client_id = $1',
      [clientId]
    );

    const planStatus = await queryAsync(
      'SELECT status, end_date FROM plans WHERE client_id = $1 ORDER BY created_at DESC LIMIT 1',
      [clientId]
    );

    const totalRevenue = await queryAsync(
      'SELECT SUM(amount) as total FROM payments WHERE client_id = $1 AND status = $2',
      [clientId, 'completed']
    );

    res.json({
      success: true,
      client,
      stats: {
        totalLogs: parseInt(logsCount.rows[0].count),
        initialWeight: client.initial_weight_kg,
        latestWeight: latestWeight.rows[0]?.weight_kg || null,
        lastLogDate: latestWeight.rows[0]?.log_date || null,
        totalWorkouts: parseInt(workoutsCount.rows[0].count),
        planStatus: planStatus.rows[0]?.status || 'inactive',
        planEndDate: planStatus.rows[0]?.end_date || null,
        totalRevenue: parseFloat(totalRevenue.rows[0].total) || 0
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all clients stats (admin dashboard)
router.get('/admin/all-clients', verifyAdmin, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.created_at,
              (SELECT COUNT(*) FROM daily_logs WHERE client_id = u.id) as log_count,
              (SELECT COUNT(*) FROM workouts WHERE client_id = u.id) as workout_count,
              (SELECT weight_kg FROM daily_logs WHERE client_id = u.id ORDER BY log_date DESC LIMIT 1) as latest_weight,
              (SELECT status FROM plans WHERE client_id = u.id ORDER BY created_at DESC LIMIT 1) as plan_status
       FROM users u WHERE u.role = 'client' ORDER BY u.created_at DESC`,
      []
    );

    res.json({ success: true, clients: result.rows });
  } catch (error) {
    next(error);
  }
});

export default router;
