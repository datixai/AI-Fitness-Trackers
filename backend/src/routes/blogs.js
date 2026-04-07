// src/routes/blogs.js - Blog Management & Publishing

import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { queryAsync } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

const router = express.Router();

// ============================================
// PUBLIC: Read Blogs
// ============================================

// Get all published blogs
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await queryAsync(
      `SELECT id, title, slug, excerpt, featured_image_url, view_count, published_at, created_at
       FROM blogs 
       WHERE status = 'published' 
       ORDER BY published_at DESC 
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), offset]
    );

    const countResult = await queryAsync(
      'SELECT COUNT(*) as count FROM blogs WHERE status = $1',
      ['published']
    );

    res.json({
      success: true,
      blogs: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get blog by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    const result = await queryAsync(
      `SELECT * FROM blogs WHERE slug = $1 AND status = 'published'`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const blog = result.rows[0];

    // Increment view count
    await queryAsync(
      'UPDATE blogs SET view_count = view_count + 1 WHERE id = $1',
      [blog.id]
    );

    res.json({ success: true, blog });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ADMIN: Create & Edit Blogs
// ============================================

// Create blog
router.post('/admin/create', verifyAdmin, async (req, res, next) => {
  try {
    const {
      title,
      content,
      excerpt,
      featured_image_url,
      status = 'draft'
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content required'
      });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const result = await queryAsync(
      `INSERT INTO blogs 
       (admin_id, title, slug, content, excerpt, featured_image_url, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        req.user.id,
        title,
        slug,
        content,
        excerpt || content.substring(0, 200),
        featured_image_url,
        status,
        status === 'published' ? new Date() : null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Blog created',
      blog: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Update blog
router.put('/admin/:blogId', verifyAdmin, async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const {
      title,
      content,
      excerpt,
      featured_image_url,
      status
    } = req.body;

    const slug = title ? slugify(title, { lower: true, strict: true }) : undefined;

    const result = await queryAsync(
      `UPDATE blogs SET 
       title = COALESCE($1, title),
       slug = COALESCE($2, slug),
       content = COALESCE($3, content),
       excerpt = COALESCE($4, excerpt),
       featured_image_url = COALESCE($5, featured_image_url),
       status = COALESCE($6, status),
       published_at = CASE WHEN $6 = 'published' AND published_at IS NULL THEN NOW() ELSE published_at END,
       updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [title, slug, content, excerpt, featured_image_url, status, blogId]
    );

    res.json({
      success: true,
      message: 'Blog updated',
      blog: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Delete blog
router.delete('/admin/:blogId', verifyAdmin, async (req, res, next) => {
  try {
    const { blogId } = req.params;

    await queryAsync('DELETE FROM blogs WHERE id = $1', [blogId]);

    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    next(error);
  }
});

// Get all blogs (admin - includes drafts)
router.get('/admin/all', verifyAdmin, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT id, title, slug, status, view_count, published_at, created_at
       FROM blogs 
       ORDER BY created_at DESC`,
      []
    );

    res.json({ success: true, blogs: result.rows });
  } catch (error) {
    next(error);
  }
});

// ============================================
// COMMENTS (Future enhancement)
// ============================================

// Get blog comments
router.get('/:blogId/comments', async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const result = await queryAsync(
      `SELECT bc.*, u.first_name, u.last_name
       FROM blog_comments bc
       LEFT JOIN users u ON bc.client_id = u.id
       WHERE bc.blog_id = $1 AND bc.is_approved = true
       ORDER BY bc.created_at DESC`,
      [blogId]
    );

    res.json({ success: true, comments: result.rows });
  } catch (error) {
    next(error);
  }
});

export default router;
