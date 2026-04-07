// src/routes/supplements.js - Supplements & Posture Videos

import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { queryAsync } from '../config/database.js';
import { validateYoutubeURL } from '../utils/validators.js';

const router = express.Router();

// ============================================
// SUPPLEMENTS DATABASE
// ============================================

// Get all supplements
router.get('/list', async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT * FROM supplements ORDER BY supplement_name ASC`,
      []
    );

    res.json({ success: true, supplements: result.rows });
  } catch (error) {
    next(error);
  }
});

// Search supplements
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const result = await queryAsync(
      `SELECT * FROM supplements 
       WHERE LOWER(supplement_name) LIKE LOWER($1) 
       ORDER BY supplement_name`,
      [`%${q}%`]
    );

    res.json({ success: true, supplements: result.rows });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ADMIN: Manage Supplements
// ============================================

// Create supplement
router.post('/admin/create', verifyAdmin, async (req, res, next) => {
  try {
    const {
      supplement_name,
      category,
      description,
      dosage,
      notes
    } = req.body;

    if (!supplement_name) {
      return res.status(400).json({
        success: false,
        message: 'Supplement name required'
      });
    }

    const result = await queryAsync(
      `INSERT INTO supplements (supplement_name, category, description, dosage, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [supplement_name, category, description, dosage, notes]
    );

    res.status(201).json({
      success: true,
      message: 'Supplement created',
      supplement: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Update supplement
router.put('/admin/:supplementId', verifyAdmin, async (req, res, next) => {
  try {
    const { supplementId } = req.params;
    const { supplement_name, category, description, dosage, notes } = req.body;

    const result = await queryAsync(
      `UPDATE supplements SET 
       supplement_name = COALESCE($1, supplement_name),
       category = COALESCE($2, category),
       description = COALESCE($3, description),
       dosage = COALESCE($4, dosage),
       notes = COALESCE($5, notes)
       WHERE id = $6
       RETURNING *`,
      [supplement_name, category, description, dosage, notes, supplementId]
    );

    res.json({
      success: true,
      message: 'Supplement updated',
      supplement: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// POSTURE CORRECTION VIDEOS
// ============================================

// Get all posture videos (public)
router.get('/videos/all', async (req, res, next) => {
  try {
    const { category } = req.query;

    let query = 'SELECT * FROM posture_videos WHERE is_published = true';
    const params = [];

    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }

    query += ' ORDER BY exercise_name ASC';

    const result = await queryAsync(query, params);

    res.json({ success: true, videos: result.rows });
  } catch (error) {
    next(error);
  }
});

// Search videos
router.get('/videos/search', async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const result = await queryAsync(
      `SELECT * FROM posture_videos 
       WHERE is_published = true AND LOWER(exercise_name) LIKE LOWER($1) 
       ORDER BY exercise_name`,
      [`%${q}%`]
    );

    res.json({ success: true, videos: result.rows });
  } catch (error) {
    next(error);
  }
});

// Get video by ID
router.get('/videos/:videoId', async (req, res, next) => {
  try {
    const { videoId } = req.params;

    const result = await queryAsync(
      `SELECT * FROM posture_videos WHERE id = $1 AND is_published = true`,
      [videoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // Increment view count
    await queryAsync(
      'UPDATE posture_videos SET view_count = view_count + 1 WHERE id = $1',
      [videoId]
    );

    res.json({ success: true, video: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ADMIN: Manage Posture Videos
// ============================================

// Create video
router.post('/admin/videos', verifyAdmin, async (req, res, next) => {
  try {
    const {
      exercise_name,
      description,
      youtube_url,
      thumbnail_url,
      category,
      difficulty_level,
      duration_seconds
    } = req.body;

    if (!exercise_name || !youtube_url) {
      return res.status(400).json({
        success: false,
        message: 'Exercise name and YouTube URL required'
      });
    }

    if (!validateYoutubeURL(youtube_url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL'
      });
    }

    const result = await queryAsync(
      `INSERT INTO posture_videos 
       (admin_id, exercise_name, description, youtube_url, thumbnail_url, category, difficulty_level, duration_seconds, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)
       RETURNING *`,
      [req.user.id, exercise_name, description, youtube_url, thumbnail_url, category, difficulty_level, duration_seconds]
    );

    res.status(201).json({
      success: true,
      message: 'Video created (draft)',
      video: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Update video
router.put('/admin/videos/:videoId', verifyAdmin, async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const {
      exercise_name,
      description,
      youtube_url,
      thumbnail_url,
      category,
      difficulty_level,
      duration_seconds,
      is_published
    } = req.body;

    const result = await queryAsync(
      `UPDATE posture_videos SET 
       exercise_name = COALESCE($1, exercise_name),
       description = COALESCE($2, description),
       youtube_url = COALESCE($3, youtube_url),
       thumbnail_url = COALESCE($4, thumbnail_url),
       category = COALESCE($5, category),
       difficulty_level = COALESCE($6, difficulty_level),
       duration_seconds = COALESCE($7, duration_seconds),
       is_published = COALESCE($8, is_published)
       WHERE id = $9
       RETURNING *`,
      [exercise_name, description, youtube_url, thumbnail_url, category, difficulty_level, duration_seconds, is_published, videoId]
    );

    res.json({
      success: true,
      message: 'Video updated',
      video: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Delete video
router.delete('/admin/videos/:videoId', verifyAdmin, async (req, res, next) => {
  try {
    const { videoId } = req.params;

    await queryAsync('DELETE FROM posture_videos WHERE id = $1', [videoId]);

    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    next(error);
  }
});

// Publish/unpublish video
router.patch('/admin/videos/:videoId/publish', verifyAdmin, async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { is_published } = req.body;

    const result = await queryAsync(
      'UPDATE posture_videos SET is_published = $1 WHERE id = $2 RETURNING *',
      [is_published, videoId]
    );

    res.json({
      success: true,
      message: is_published ? 'Video published' : 'Video unpublished',
      video: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

export default router;
