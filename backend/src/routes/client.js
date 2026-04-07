// src/routes/client.js - Client Profile & Data Routes
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { queryAsync } from '../config/database.js';

const router = express.Router();

// Get client profile
router.get('/profile', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT id, email, first_name, last_name, birth_date, height_cm, initial_weight_kg,
              gender, phone, address, city, postal_code, profile_picture_url, training_history,
              injury_history, dietary_preferences, training_preferences, sleep_hours,
              physical_activity_level, created_at 
       FROM users WHERE id = $1 AND role = 'client'`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.json({ success: true, profile: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Update client profile
router.put('/profile', verifyToken, async (req, res, next) => {
  try {
    const { first_name, last_name, phone, address, city, postal_code } = req.body;
    
    const result = await queryAsync(
      `UPDATE users SET first_name=$1, last_name=$2, phone=$3, address=$4, city=$5, postal_code=$6, updated_at=NOW()
       WHERE id=$7 RETURNING id, email, first_name, last_name, phone, address, city, postal_code`,
      [first_name, last_name, phone, address, city, postal_code, req.user.id]
    );

    res.json({ success: true, message: 'Profile updated', profile: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get client's latest weight
router.get('/latest-weight', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      'SELECT weight_kg, log_date FROM daily_logs WHERE client_id = $1 ORDER BY log_date DESC LIMIT 1',
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

export default router;
