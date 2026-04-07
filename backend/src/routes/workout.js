// src/routes/workout.js - Workout Plans & Exercise Management

import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { queryAsync } from '../config/database.js';
import { checkFormCooldown, logFormSubmission, getClientIp } from '../middleware/formRateLimit.js';

const router = express.Router();

// ============================================
// WORKOUT PLANS (Admin creates, Client views)
// ============================================

// Get client's current workout plan
router.get('/plan', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT w.*, 
              (SELECT COUNT(*) FROM workout_exercises WHERE workout_id = w.id) as exercise_count
       FROM workouts w
       WHERE w.client_id = $1 
       ORDER BY w.week_number DESC LIMIT 1`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows.length > 0 ? result.rows[0] : null
    });
  } catch (error) {
    next(error);
  }
});

// Get all workouts for a client (paginated)
router.get('/plans', verifyToken, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const result = await queryAsync(
      `SELECT w.*, 
              (SELECT COUNT(*) FROM workout_exercises WHERE workout_id = w.id) as exercise_count
       FROM workouts w
       WHERE w.client_id = $1 
       ORDER BY w.week_number DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    const countResult = await queryAsync(
      'SELECT COUNT(*) as total FROM workouts WHERE client_id = $1',
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get exercises for a specific workout
router.get('/plan/:workoutId/exercises', verifyToken, async (req, res, next) => {
  try {
    const { workoutId } = req.params;

    // Verify ownership
    const workoutCheck = await queryAsync(
      'SELECT client_id FROM workouts WHERE id = $1',
      [workoutId]
    );

    if (workoutCheck.rows.length === 0 || workoutCheck.rows[0].client_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const result = await queryAsync(
      `SELECT * FROM workout_exercises 
       WHERE workout_id = $1 
       ORDER BY day_of_week, id`,
      [workoutId]
    );

    res.json({ success: true, exercises: result.rows });
  } catch (error) {
    next(error);
  }
});

// ============================================
// WORKOUT LOGS (Client logs workouts - 10 min cooldown)
// ============================================

// Submit workout log
router.post('/log', verifyToken, checkFormCooldown, async (req, res, next) => {
  try {
    const { log_date, mood, motivation, energy } = req.body;

    const result = await queryAsync(
      `INSERT INTO workout_logs (client_id, log_date, mood, motivation, energy)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (client_id, log_date) DO UPDATE SET
       mood = $3, motivation = $4, energy = $5, updated_at = NOW()
       RETURNING *`,
      [req.user.id, log_date, mood, motivation, energy]
    );

    // Log form submission
    await logFormSubmission(req.user.id, 'workout_log', getClientIp(req));

    res.json({ success: true, message: 'Workout logged', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get workout logs
router.get('/logs', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT * FROM workout_logs 
       WHERE client_id = $1 
       ORDER BY log_date DESC LIMIT 100`,
      [req.user.id]
    );

    res.json({ success: true, logs: result.rows });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ADMIN: Create/Edit Workout Plans
// ============================================

// Create workout plan for client
router.post('/admin/create', verifyAdmin, async (req, res, next) => {
  try {
    const { client_id, week_number, phase, start_date, end_date, notes } = req.body;

    if (!client_id) {
      return res.status(400).json({ success: false, message: 'client_id required' });
    }

    const result = await queryAsync(
      `INSERT INTO workouts (client_id, admin_id, week_number, phase, start_date, end_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [client_id, req.user.id, week_number, phase, start_date, end_date, notes]
    );

    res.status(201).json({
      success: true,
      message: 'Workout plan created',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Add exercise to workout
router.post('/admin/exercise', verifyAdmin, async (req, res, next) => {
  try {
    const {
      workout_id,
      day_of_week,
      exercise_name,
      description,
      sets,
      reps,
      weight_kg,
      rest_seconds,
      intensity_technique,
      video_url
    } = req.body;

    const result = await queryAsync(
      `INSERT INTO workout_exercises 
       (workout_id, day_of_week, exercise_name, description, sets, reps, weight_kg, rest_seconds, intensity_technique, video_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [workout_id, day_of_week, exercise_name, description, sets, reps, weight_kg, rest_seconds, intensity_technique, video_url]
    );

    res.status(201).json({
      success: true,
      message: 'Exercise added',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Update exercise
router.put('/admin/exercise/:exerciseId', verifyAdmin, async (req, res, next) => {
  try {
    const { exerciseId } = req.params;
    const {
      day_of_week,
      exercise_name,
      description,
      sets,
      reps,
      weight_kg,
      rest_seconds,
      intensity_technique,
      video_url
    } = req.body;

    const result = await queryAsync(
      `UPDATE workout_exercises SET 
       day_of_week = $1, exercise_name = $2, description = $3, sets = $4, reps = $5,
       weight_kg = $6, rest_seconds = $7, intensity_technique = $8, video_url = $9
       WHERE id = $10
       RETURNING *`,
      [day_of_week, exercise_name, description, sets, reps, weight_kg, rest_seconds, intensity_technique, video_url, exerciseId]
    );

    res.json({
      success: true,
      message: 'Exercise updated',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Delete exercise
router.delete('/admin/exercise/:exerciseId', verifyAdmin, async (req, res, next) => {
  try {
    const { exerciseId } = req.params;

    await queryAsync('DELETE FROM workout_exercises WHERE id = $1', [exerciseId]);

    res.json({ success: true, message: 'Exercise deleted' });
  } catch (error) {
    next(error);
  }
});

// Get all exercises for a client (admin view)
router.get('/admin/client/:clientId/history', verifyAdmin, async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const result = await queryAsync(
      `SELECT w.id, w.week_number, w.phase, w.start_date, w.end_date,
              COUNT(we.id) as exercise_count
       FROM workouts w
       LEFT JOIN workout_exercises we ON w.id = we.workout_id
       WHERE w.client_id = $1
       GROUP BY w.id
       ORDER BY w.week_number DESC`,
      [clientId]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

export default router;
