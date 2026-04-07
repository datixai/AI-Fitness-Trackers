// src/routes/plans.js - Plans (Fixed)
// Fix: Expiry email no longer fires on every GET request (was spamming on each page load)

import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { queryAsync } from '../config/database.js';
import { sendPlanExpiryWarning, sendPlanExpiredEmail } from '../utils/email.js';

const router = express.Router();

router.get('/current', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      'SELECT * FROM plans WHERE client_id = $1 ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );

    if (result.rows.length === 0) return res.json({ success: true, plan: null });

    const plan = result.rows[0];
    const daysUntilExpiry = Math.ceil((new Date(plan.end_date) - new Date()) / (1000 * 60 * 60 * 24));

    res.json({
      success: true,
      plan: { ...plan, daysRemaining: Math.max(0, daysUntilExpiry) },
    });
    // NOTE: expiry emails should be sent by a scheduled cron job, NOT on every GET request
  } catch (error) {
    next(error);
  }
});

router.get('/history', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      'SELECT * FROM plans WHERE client_id = $1 ORDER BY start_date DESC LIMIT 20',
      [req.user.id]
    );
    res.json({ success: true, plans: result.rows });
  } catch (error) {
    next(error);
  }
});

// ADMIN
router.post('/admin/create', verifyAdmin, async (req, res, next) => {
  try {
    const { client_id, plan_name, duration_days, start_date, end_date, price, currency = 'EUR', notes } = req.body;
    if (!client_id || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'client_id, start_date, end_date required' });
    }

    const result = await queryAsync(
      `INSERT INTO plans (client_id, plan_name, duration_days, start_date, end_date, price, currency, notes, status, payment_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'active','pending') RETURNING *`,
      [client_id, plan_name, duration_days, start_date, end_date, price, currency, notes]
    );

    res.status(201).json({ success: true, message: 'Plan created', plan: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.put('/admin/:planId', verifyAdmin, async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { plan_name, duration_days, start_date, end_date, price, status, payment_status, notes } = req.body;

    const result = await queryAsync(
      `UPDATE plans SET plan_name=$1, duration_days=$2, start_date=$3, end_date=$4, price=$5,
       status=$6, payment_status=$7, notes=$8, updated_at=NOW() WHERE id=$9 RETURNING *`,
      [plan_name, duration_days, start_date, end_date, price, status, payment_status, notes, planId]
    );

    res.json({ success: true, message: 'Plan updated', plan: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.get('/admin/client/:clientId', verifyAdmin, async (req, res, next) => {
  try {
    const result = await queryAsync(
      'SELECT * FROM plans WHERE client_id = $1 ORDER BY created_at DESC',
      [req.params.clientId]
    );
    res.json({ success: true, plans: result.rows });
  } catch (error) {
    next(error);
  }
});

// Cron-triggered expiry check
router.post('/admin/check-expiry', verifyAdmin, async (req, res, next) => {
  try {
    const expiredResult = await queryAsync(
      "SELECT id, client_id FROM plans WHERE status = 'active' AND end_date < NOW()"
    );

    let count = 0;
    for (const plan of expiredResult.rows) {
      await queryAsync("UPDATE plans SET status='expired', updated_at=NOW() WHERE id=$1", [plan.id]);
      const clientResult = await queryAsync('SELECT email, first_name FROM users WHERE id = $1', [plan.client_id]);
      if (clientResult.rows.length > 0) {
        const { email, first_name } = clientResult.rows[0];
        sendPlanExpiredEmail(email, first_name).catch(err => console.error('Expiry email error:', err.message));
      }
      count++;
    }

    res.json({ success: true, message: `Processed ${count} expired plans`, processedCount: count });
  } catch (error) {
    next(error);
  }
});

export default router;
