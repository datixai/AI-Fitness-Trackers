// src/routes/admin.js - Admin Routes (with Admin Management + Site Settings)

import express from 'express';
import bcryptjs from 'bcryptjs';
import { verifyAdmin } from '../middleware/auth.js';
import { queryAsync, getClient } from '../config/database.js';

const router = express.Router();
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

// ─── DASHBOARD ───
router.get('/dashboard', verifyAdmin, async (req, res, next) => {
  try {
    const [clientsCount, activePlans, revenue, recentActivity] = await Promise.all([
      queryAsync("SELECT COUNT(*) AS count FROM users WHERE role = 'client'"),
      queryAsync("SELECT COUNT(*) AS count FROM plans WHERE status='active' AND end_date >= NOW()"),
      queryAsync("SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE status='completed'"),
      queryAsync(`SELECT u.id, u.email, u.first_name, u.last_name, MAX(dl.log_date) AS last_activity
                  FROM users u LEFT JOIN daily_logs dl ON u.id = dl.client_id
                  WHERE u.role='client' GROUP BY u.id ORDER BY last_activity DESC NULLS LAST LIMIT 10`),
    ]);
    res.json({
      success: true,
      dashboard: {
        totalClients: parseInt(clientsCount.rows[0].count),
        activePlans: parseInt(activePlans.rows[0].count),
        totalRevenue: parseFloat(revenue.rows[0].total),
        recentActivity: recentActivity.rows,
      },
    });
  } catch (error) { next(error); }
});

// ─── CLIENT MANAGEMENT ───
router.get('/clients', verifyAdmin, async (req, res, next) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : '';
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const offset = Math.max(parseInt(req.query.offset || '0', 10), 0);
    let query = `SELECT id, email, first_name, last_name, is_active, is_verified, created_at FROM users WHERE role = $1`;
    const params = ['client'];
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (LOWER(first_name) LIKE LOWER($${params.length}) OR LOWER(last_name) LIKE LOWER($${params.length}) OR LOWER(email) LIKE LOWER($${params.length}))`;
    }
    params.push(limit); query += ` ORDER BY created_at DESC LIMIT $${params.length}`;
    params.push(offset); query += ` OFFSET $${params.length}`;
    const result = await queryAsync(query, params);
    res.json({ success: true, clients: result.rows });
  } catch (error) { next(error); }
});

router.get('/clients/:clientId', verifyAdmin, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT id, email, first_name, last_name, birth_date, height_cm, gender, phone, city,
              training_history, injury_history, dietary_preferences, is_active, is_verified, created_at
       FROM users WHERE id = $1 AND role = 'client'`,
      [req.params.clientId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, client: result.rows[0] });
  } catch (error) { next(error); }
});

router.put('/clients/:clientId', verifyAdmin, async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { first_name, last_name, height_cm, gender, phone, address, city,
            postal_code, training_history, injury_history, dietary_preferences, is_active } = req.body;
    const result = await queryAsync(
      `UPDATE users SET first_name=$1, last_name=$2, height_cm=$3, gender=$4, phone=$5,
       address=$6, city=$7, postal_code=$8, training_history=$9, injury_history=$10,
       dietary_preferences=$11, is_active=$12, updated_at=NOW()
       WHERE id=$13 AND role='client' RETURNING id, email, first_name, last_name, is_active`,
      [first_name, last_name, height_cm, gender, phone, address, city, postal_code,
       training_history, injury_history, dietary_preferences, is_active, clientId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, message: 'Client updated', client: result.rows[0] });
  } catch (error) { next(error); }
});

// ─── ADMIN USER MANAGEMENT ───
router.get('/admins', verifyAdmin, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT id, email, first_name, last_name, created_at FROM users WHERE role = 'admin' ORDER BY created_at ASC`
    );
    res.json({ success: true, admins: result.rows });
  } catch (error) { next(error); }
});

router.post('/admins/create', verifyAdmin, async (req, res, next) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }
    const existing = await queryAsync('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const hash = await bcryptjs.hash(password, BCRYPT_ROUNDS);
    const result = await queryAsync(
      `INSERT INTO users (email, password, first_name, last_name, role, is_active, is_verified)
       VALUES ($1, $2, $3, $4, 'admin', TRUE, TRUE) RETURNING id, email, first_name, last_name`,
      [email.toLowerCase(), hash, first_name.trim(), last_name.trim()]
    );
    res.status(201).json({ success: true, message: 'Admin created', admin: result.rows[0] });
  } catch (error) { next(error); }
});

router.delete('/admins/:adminId', verifyAdmin, async (req, res, next) => {
  try {
    const { adminId } = req.params;
    // Prevent self-deletion
    if (parseInt(adminId, 10) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot remove yourself' });
    }
    await queryAsync("DELETE FROM users WHERE id = $1 AND role = 'admin'", [adminId]);
    res.json({ success: true, message: 'Admin removed' });
  } catch (error) { next(error); }
});

// ─── SITE SETTINGS ───
router.get('/settings', verifyAdmin, async (req, res, next) => {
  try {
    const result = await queryAsync('SELECT key, value FROM site_settings');
    const settings = {};
    result.rows.forEach(r => { settings[r.key] = r.value; });
    res.json({ success: true, settings });
  } catch (error) { next(error); }
});

router.put('/settings', verifyAdmin, async (req, res, next) => {
  try {
    const { whatsapp_number, email, location_name } = req.body;
    const entries = { whatsapp_number, email, location_name };
    for (const [key, value] of Object.entries(entries)) {
      if (value !== undefined) {
        await queryAsync(
          `INSERT INTO site_settings (key, value) VALUES ($1, $2)
           ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
          [key, value]
        );
      }
    }
    res.json({ success: true, message: 'Settings saved' });
  } catch (error) { next(error); }
});

// ─── INITIAL ASSESSMENT ───
router.post('/assessments/:clientId', verifyAdmin, async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { current_sport, past_sport, training_frequency, time_available_weekly,
            training_experience, daily_water_intake, food_preferences,
            medical_clearance, liability_waiver_signed, photo_release_authorized } = req.body;
    const result = await queryAsync(
      `INSERT INTO initial_assessments
         (client_id, assessment_date, current_sport, past_sport, training_frequency, time_available_weekly,
          training_experience, daily_water_intake, food_preferences, medical_clearance,
          liability_waiver_signed, photo_release_authorized)
       VALUES ($1,NOW(),$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (client_id) DO UPDATE SET
         current_sport=$2, past_sport=$3, training_frequency=$4, time_available_weekly=$5,
         training_experience=$6, daily_water_intake=$7, food_preferences=$8,
         medical_clearance=$9, liability_waiver_signed=$10, photo_release_authorized=$11, updated_at=NOW()
       RETURNING *`,
      [clientId, current_sport, past_sport, training_frequency, time_available_weekly,
       training_experience, daily_water_intake, food_preferences, medical_clearance,
       liability_waiver_signed, photo_release_authorized]
    );
    res.json({ success: true, assessment: result.rows[0] });
  } catch (error) { next(error); }
});

router.get('/assessments/:clientId', verifyAdmin, async (req, res, next) => {
  try {
    const result = await queryAsync('SELECT * FROM initial_assessments WHERE client_id = $1', [req.params.clientId]);
    res.json({ success: true, assessment: result.rows[0] || null });
  } catch (error) { next(error); }
});

// ─── SUPPLEMENTS ───
router.post('/supplements/:clientId', verifyAdmin, async (req, res, next) => {
  try {
    const { supplement_id, phase, start_date, end_date, current_dosage, days_per_week, timing, notes } = req.body;
    const result = await queryAsync(
      `INSERT INTO supplement_protocols (client_id, admin_id, supplement_id, phase, start_date, end_date, current_dosage, days_per_week, timing, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [req.params.clientId, req.user.id, supplement_id, phase, start_date, end_date, current_dosage, days_per_week, timing, notes]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { next(error); }
});

router.get('/supplements/:clientId', verifyAdmin, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT sp.*, s.supplement_name, s.category FROM supplement_protocols sp
       LEFT JOIN supplements s ON sp.supplement_id = s.id WHERE sp.client_id = $1 ORDER BY sp.phase, sp.start_date DESC`,
      [req.params.clientId]
    );
    res.json({ success: true, protocols: result.rows });
  } catch (error) { next(error); }
});

// ─── CYCLE DATA ───
router.post('/cycle/:clientId', verifyAdmin, async (req, res, next) => {
  const client = await getClient();
  try {
    const cycleData = req.body;
    if (!Array.isArray(cycleData)) return res.status(400).json({ success: false, message: 'Array required' });
    await client.query('BEGIN');
    await client.query('DELETE FROM female_cycle_data WHERE client_id = $1', [req.params.clientId]);
    const results = [];
    for (const day of cycleData) {
      const r = await client.query(
        `INSERT INTO female_cycle_data (client_id, cycle_day, phase, notes, dominant_hormone, insulin_sensitivity, fuel_at_rest, fuel_during_exercise, fat_storage, metabolic_rate, hunger_levels, blood_glucose, water_retention, muscle_growth)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
        [req.params.clientId, day.cycle_day, day.phase, day.notes, day.dominant_hormone, day.insulin_sensitivity, day.fuel_at_rest, day.fuel_during_exercise, day.fat_storage, day.metabolic_rate, day.hunger_levels, day.blood_glucose, day.water_retention, day.muscle_growth]
      );
      results.push(r.rows[0]);
    }
    await client.query('COMMIT');
    res.json({ success: true, data: results });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally { client.release(); }
});

router.get('/cycle/:clientId', verifyAdmin, async (req, res, next) => {
  try {
    const result = await queryAsync('SELECT * FROM female_cycle_data WHERE client_id = $1 ORDER BY cycle_day', [req.params.clientId]);
    res.json({ success: true, cycleData: result.rows });
  } catch (error) { next(error); }
});

// ─── AUDIT LOG ───
router.get('/audit-log', verifyAdmin, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '100', 10), 500);
    const result = await queryAsync(
      `SELECT al.*, u.email AS admin_email, c.email AS client_email
       FROM audit_logs al LEFT JOIN users u ON al.admin_id = u.id LEFT JOIN users c ON al.client_id = c.id
       ORDER BY al.created_at DESC LIMIT $1`,
      [limit]
    );
    res.json({ success: true, logs: result.rows });
  } catch (error) { next(error); }
});

export default router;
