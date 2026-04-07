// src/routes/food.js - Food Database & Nutrition

import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { queryAsync } from '../config/database.js';

const router = express.Router();

// ============================================
// FOOD DATABASE (Public - no auth required)
// ============================================

// Search foods by name
router.get('/search', async (req, res, next) => {
  try {
    const { q, category, limit = 20 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    let query = 'SELECT * FROM foods WHERE LOWER(food_name) LIKE LOWER($1)';
    let params = [`%${q}%`];

    if (category) {
      query += ' AND category = $2';
      params.push(category);
    }

    params.push(Math.min(parseInt(limit, 10) || 50, 200)); query += ` ORDER BY food_name ASC LIMIT $${params.length}`;

    const result = await queryAsync(query, params);

    res.json({
      success: true,
      foods: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    next(error);
  }
});

// Get food by ID
router.get('/:foodId', async (req, res, next) => {
  try {
    const { foodId } = req.params;

    const result = await queryAsync(
      'SELECT * FROM foods WHERE id = $1',
      [foodId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }

    res.json({ success: true, food: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get all categories
router.get('/categories/list', async (req, res, next) => {
  try {
    const result = await queryAsync(
      'SELECT DISTINCT category FROM foods WHERE category IS NOT NULL ORDER BY category',
      []
    );

    const categories = result.rows.map(r => r.category);

    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
});

// Get foods by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 50 } = req.query;

    const result = await queryAsync(
      'SELECT * FROM foods WHERE category = $1 ORDER BY food_name ASC LIMIT $2',
      [category, parseInt(limit)]
    );

    res.json({ success: true, foods: result.rows });
  } catch (error) {
    next(error);
  }
});

// ============================================
// MEAL PLANNING (Authenticated)
// ============================================

// Create meal plan for client
router.post('/meal-plan', verifyToken, async (req, res, next) => {
  try {
    const {
      week_number,
      day_of_week,
      meal_type,
      meal_name,
      total_calories,
      total_carbs_gr,
      total_protein_gr,
      total_fat_gr,
      notes
    } = req.body;

    const result = await queryAsync(
      `INSERT INTO meal_plans 
       (client_id, admin_id, week_number, day_of_week, meal_type, meal_name, total_calories, total_carbs_gr, total_protein_gr, total_fat_gr, notes)
       VALUES ($1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [req.user.id, week_number, day_of_week, meal_type, meal_name, total_calories, total_carbs_gr, total_protein_gr, total_fat_gr, notes]
    );

    res.status(201).json({
      success: true,
      message: 'Meal plan created',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Get meal plans
router.get('/meal-plan', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT * FROM meal_plans 
       WHERE client_id = $1 
       ORDER BY week_number, day_of_week`,
      [req.user.id]
    );

    res.json({ success: true, mealPlans: result.rows });
  } catch (error) {
    next(error);
  }
});

// ============================================
// FOOD LOGGING (Authenticated)
// ============================================

// Log food consumption
router.post('/log', verifyToken, async (req, res, next) => {
  try {
    const {
      log_date,
      meal_type,
      food_id,
      serving_size,
      calories_kcal,
      carbs_gr,
      protein_gr,
      fat_gr,
      notes
    } = req.body;

    const result = await queryAsync(
      `INSERT INTO food_logs 
       (client_id, log_date, meal_type, food_id, serving_size, calories_kcal, carbs_gr, protein_gr, fat_gr, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [req.user.id, log_date, meal_type, food_id, serving_size, calories_kcal, carbs_gr, protein_gr, fat_gr, notes]
    );

    res.json({
      success: true,
      message: 'Food logged',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Get food logs
router.get('/logs', verifyToken, async (req, res, next) => {
  try {
    const { date } = req.query;

    let query = 'SELECT * FROM food_logs WHERE client_id = $1';
    const params = [req.user.id];

    if (date) {
      query += ' AND log_date = $2';
      params.push(date);
    }

    query += ' ORDER BY log_date DESC, meal_type';

    const result = await queryAsync(query, params);

    // Group by meal type
    const logs = {};
    result.rows.forEach(log => {
      if (!logs[log.meal_type]) {
        logs[log.meal_type] = [];
      }
      logs[log.meal_type].push(log);
    });

    res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
});

// Get daily nutrition summary
router.get('/daily-summary', verifyToken, async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date required' });
    }

    const result = await queryAsync(
      `SELECT 
        SUM(calories_kcal) as total_calories,
        SUM(carbs_gr) as total_carbs,
        SUM(protein_gr) as total_protein,
        SUM(fat_gr) as total_fat
       FROM food_logs 
       WHERE client_id = $1 AND log_date = $2`,
      [req.user.id, date]
    );

    const summary = result.rows[0] || {
      total_calories: 0,
      total_carbs: 0,
      total_protein: 0,
      total_fat: 0
    };

    res.json({ success: true, summary });
  } catch (error) {
    next(error);
  }
});

// Delete food log entry
router.delete('/logs/:logId', verifyToken, async (req, res, next) => {
  try {
    const { logId } = req.params;

    // Verify ownership
    const logCheck = await queryAsync(
      'SELECT client_id FROM food_logs WHERE id = $1',
      [logId]
    );

    if (logCheck.rows.length === 0 || logCheck.rows[0].client_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await queryAsync('DELETE FROM food_logs WHERE id = $1', [logId]);

    res.json({ success: true, message: 'Log entry deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
