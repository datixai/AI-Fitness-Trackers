// src/routes/measurements.js - Body Measurements & Body Fat Tracking

import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { queryAsync } from '../config/database.js';
import { checkFormCooldown, logFormSubmission, getClientIp } from '../middleware/formRateLimit.js';

const router = express.Router();

// ============================================
// MISURE (Circumference Measurements)
// ============================================

// Submit body measurements (Misure)
router.post('/misure', verifyToken, checkFormCooldown, async (req, res, next) => {
  try {
    const {
      measurement_date,
      week_number,
      petto_cm,
      braccio_sinistro_cm,
      braccio_destro_cm,
      vita_cm,
      coscia_sinistra_cm,
      coscia_destra_cm
    } = req.body;

    // Calculate total
    const total_cm = (petto_cm || 0) + (braccio_sinistro_cm || 0) + (braccio_destro_cm || 0) +
                     (vita_cm || 0) + (coscia_sinistra_cm || 0) + (coscia_destra_cm || 0);

    const result = await queryAsync(
      `INSERT INTO measurements 
       (client_id, measurement_date, week_number, petto_cm, braccio_sinistro_cm, braccio_destro_cm, 
        vita_cm, coscia_sinistra_cm, coscia_destra_cm, total_cm)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (client_id, measurement_date) DO UPDATE SET
       week_number = $3, petto_cm = $4, braccio_sinistro_cm = $5, braccio_destro_cm = $6,
       vita_cm = $7, coscia_sinistra_cm = $8, coscia_destra_cm = $9, total_cm = $10, updated_at = NOW()
       RETURNING *`,
      [req.user.id, measurement_date, week_number, petto_cm, braccio_sinistro_cm, braccio_destro_cm,
       vita_cm, coscia_sinistra_cm, coscia_destra_cm, total_cm]
    );

    // Log form submission
    await logFormSubmission(req.user.id, 'misure', getClientIp(req));

    res.json({ success: true, message: 'Measurements recorded', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get measurements history
router.get('/misure', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT * FROM measurements 
       WHERE client_id = $1 
       ORDER BY measurement_date DESC LIMIT 100`,
      [req.user.id]
    );

    res.json({ success: true, measurements: result.rows });
  } catch (error) {
    next(error);
  }
});

// Get measurement progress (for charts)
router.get('/misure/progress', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT measurement_date, petto_cm, vita_cm, coscia_sinistra_cm, coscia_destra_cm, total_cm
       FROM measurements 
       WHERE client_id = $1 
       ORDER BY measurement_date ASC`,
      [req.user.id]
    );

    res.json({ success: true, progress: result.rows });
  } catch (error) {
    next(error);
  }
});

// ============================================
// PLICHE (Body Fat Percentage Tracking)
// ============================================

// Submit body fat measurements (Pliche)
router.post('/pliche', verifyToken, checkFormCooldown, async (req, res, next) => {
  try {
    const {
      measurement_date,
      week_number,
      gender,
      age,
      petto_mm,
      addome_mm,
      coscia_mm,
      tricipite_mm,
      sottoscapola_mm,
      medio_ascellare_mm,
      anca_mm
    } = req.body;

    // Calculate body fat percentage using Jackson-Pollock formula (7-site)
    const sum = (petto_mm || 0) + (addome_mm || 0) + (coscia_mm || 0) + (tricipite_mm || 0) +
                (sottoscapola_mm || 0) + (medio_ascellare_mm || 0) + (anca_mm || 0);

    let bodyFatPercentage = 0;
    
    // Simplified calculation - in production, use proper Jackson-Pollock formula
    if (gender === 'Male') {
      bodyFatPercentage = (1.112 - (0.00043499 * sum) + (0.00000055 * (sum * sum)) - (0.0288 * age)) * 100;
    } else {
      bodyFatPercentage = (1.097 - (0.00046971 * sum) + (0.00000056 * (sum * sum)) - (0.012828 * age)) * 100;
    }

    const bodyDensity = 1.0705 - (0.0010713 * Math.log10(sum));

    const result = await queryAsync(
      `INSERT INTO body_fat_tracking 
       (client_id, measurement_date, week_number, gender, age, petto_mm, addome_mm, coscia_mm,
        tricipite_mm, sottoscapola_mm, medio_ascellare_mm, anca_mm, body_fat_percentage, body_density)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       ON CONFLICT (client_id, measurement_date) DO UPDATE SET
       week_number = $3, petto_mm = $6, addome_mm = $7, coscia_mm = $8,
       tricipite_mm = $9, sottoscapola_mm = $10, medio_ascellare_mm = $11, anca_mm = $12,
       body_fat_percentage = $13, body_density = $14, updated_at = NOW()
       RETURNING *`,
      [req.user.id, measurement_date, week_number, gender, age, petto_mm, addome_mm, coscia_mm,
       tricipite_mm, sottoscapola_mm, medio_ascellare_mm, anca_mm,
       Math.max(1, Math.min(60, bodyFatPercentage)), bodyDensity]
    );

    // Log form submission
    await logFormSubmission(req.user.id, 'body_fat', getClientIp(req));

    res.json({ success: true, message: 'Body fat recorded', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get body fat history
router.get('/pliche', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT * FROM body_fat_tracking 
       WHERE client_id = $1 
       ORDER BY measurement_date DESC LIMIT 100`,
      [req.user.id]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// Get body fat progress (for charts)
router.get('/pliche/progress', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT measurement_date, body_fat_percentage, body_density
       FROM body_fat_tracking 
       WHERE client_id = $1 
       ORDER BY measurement_date ASC`,
      [req.user.id]
    );

    res.json({ success: true, progress: result.rows });
  } catch (error) {
    next(error);
  }
});

// ============================================
// PROGRESS PHOTOS
// ============================================

// Submit progress photos
router.post('/photos', verifyToken, async (req, res, next) => {
  try {
    const {
      photo_date,
      week_number,
      front_photo_url,
      back_photo_url,
      right_side_photo_url,
      left_side_photo_url
    } = req.body;

    const result = await queryAsync(
      `INSERT INTO progress_photos 
       (client_id, photo_date, week_number, front_photo_url, back_photo_url, right_side_photo_url, left_side_photo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, photo_date, week_number, front_photo_url, back_photo_url, right_side_photo_url, left_side_photo_url]
    );

    res.json({ success: true, message: 'Photos uploaded', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get progress photos
router.get('/photos', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT * FROM progress_photos 
       WHERE client_id = $1 
       ORDER BY photo_date DESC`,
      [req.user.id]
    );

    res.json({ success: true, photos: result.rows });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ADMIN: View/Edit Client Measurements
// ============================================

// Get all client measurements (admin)
router.get('/admin/client/:clientId/misure', verifyAdmin, async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const result = await queryAsync(
      `SELECT * FROM measurements 
       WHERE client_id = $1 
       ORDER BY measurement_date DESC`,
      [clientId]
    );

    res.json({ success: true, measurements: result.rows });
  } catch (error) {
    next(error);
  }
});

// Get all client body fat (admin)
router.get('/admin/client/:clientId/pliche', verifyAdmin, async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const result = await queryAsync(
      `SELECT * FROM body_fat_tracking 
       WHERE client_id = $1 
       ORDER BY measurement_date DESC`,
      [clientId]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// Edit measurement (admin)
router.put('/admin/misure/:measurementId', verifyAdmin, async (req, res, next) => {
  try {
    const { measurementId } = req.params;
    const {
      petto_cm,
      braccio_sinistro_cm,
      braccio_destro_cm,
      vita_cm,
      coscia_sinistra_cm,
      coscia_destra_cm
    } = req.body;

    const total_cm = (petto_cm || 0) + (braccio_sinistro_cm || 0) + (braccio_destro_cm || 0) +
                     (vita_cm || 0) + (coscia_sinistra_cm || 0) + (coscia_destra_cm || 0);

    const result = await queryAsync(
      `UPDATE measurements SET 
       petto_cm = $1, braccio_sinistro_cm = $2, braccio_destro_cm = $3, vita_cm = $4,
       coscia_sinistra_cm = $5, coscia_destra_cm = $6, total_cm = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [petto_cm, braccio_sinistro_cm, braccio_destro_cm, vita_cm, coscia_sinistra_cm, coscia_destra_cm, total_cm, measurementId]
    );

    res.json({ success: true, message: 'Measurement updated', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
