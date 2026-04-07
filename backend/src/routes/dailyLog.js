// src/routes/dailyLog.js - Daily Log (Fixed)
// Fix: Input validation on all numeric fields before DB insert

import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { queryAsync } from '../config/database.js';
import { checkFormCooldown, logFormSubmission, getClientIp } from '../middleware/formRateLimit.js';
import { validateDate, validateScale1to10, validateWeight, validateHeartRate } from '../utils/validators.js';
import { ValidationError } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/submit', verifyToken, checkFormCooldown, async (req, res, next) => {
  try {
    const { log_date, weight_kg, resting_heart_rate, mood, stress, energy, sleep_quality, hunger } = req.body;

    if (!log_date || !validateDate(log_date)) throw new ValidationError('Invalid log_date (YYYY-MM-DD required)');
    if (weight_kg && !validateWeight(weight_kg)) throw new ValidationError('weight_kg out of valid range (30-250)');
    if (resting_heart_rate && !validateHeartRate(resting_heart_rate)) throw new ValidationError('Invalid heart rate');
    if (mood && !validateScale1to10(mood)) throw new ValidationError('mood must be 1-10');
    if (stress && !validateScale1to10(stress)) throw new ValidationError('stress must be 1-10');
    if (energy && !validateScale1to10(energy)) throw new ValidationError('energy must be 1-10');
    if (sleep_quality && !validateScale1to10(sleep_quality)) throw new ValidationError('sleep_quality must be 1-10');
    if (hunger && !validateScale1to10(hunger)) throw new ValidationError('hunger must be 1-10');

    // Prevent submitting future dates
    if (new Date(log_date) > new Date()) throw new ValidationError('Cannot log future dates');

    const result = await queryAsync(
      `INSERT INTO daily_logs (client_id, log_date, weight_kg, resting_heart_rate, mood, stress, energy, sleep_quality, hunger)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (client_id, log_date) DO UPDATE SET
         weight_kg=$3, resting_heart_rate=$4, mood=$5, stress=$6, energy=$7, sleep_quality=$8, hunger=$9, updated_at=NOW()
       RETURNING *`,
      [req.user.id, log_date, weight_kg || null, resting_heart_rate || null,
       mood || null, stress || null, energy || null, sleep_quality || null, hunger || null]
    );

    await logFormSubmission(req.user.id, 'daily_log', getClientIp(req));

    res.json({ success: true, message: 'Daily log recorded', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '100', 10), 365);
    const result = await queryAsync(
      'SELECT * FROM daily_logs WHERE client_id = $1 ORDER BY log_date DESC LIMIT $2',
      [req.user.id, limit]
    );
    res.json({ success: true, logs: result.rows });
  } catch (error) {
    next(error);
  }
});

router.get('/admin/client/:clientId', async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const result = await queryAsync(
      'SELECT * FROM daily_logs WHERE client_id = $1 ORDER BY log_date DESC LIMIT 365',
      [clientId]
    );
    res.json({ success: true, logs: result.rows });
  } catch (error) {
    next(error);
  }
});

export default router;
