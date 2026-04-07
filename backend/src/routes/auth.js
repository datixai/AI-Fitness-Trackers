// src/routes/auth.js - Authentication Routes (Security-Fixed)
// Fix: bcrypt rounds uses parseInt()
// Fix: JWT_SECRET validated at startup not at runtime
// Fix: Logout properly blacklists the token server-side
// Fix: JWT tokens now include jti (unique ID) for blacklisting
// Fix: Password reset token stored as hash, not plaintext

import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { queryAsync } from '../config/database.js';
import { verifyToken, blacklistToken } from '../middleware/auth.js';
import { ValidationError, UnauthorizedError, ConflictError } from '../middleware/errorHandler.js';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../utils/email.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

const router = express.Router();

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

const signToken = (payload) => {
  const jti = crypto.randomUUID();
  return jwt.sign(
    { ...payload, jti },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

// ============================================
// REGISTER
// ============================================

router.post('/register', async (req, res, next) => {
  try {
    const {
      email, password, password_confirm, first_name, last_name,
      birth_date, height_cm, initial_weight_kg, gender,
      phone, address, city, postal_code
    } = req.body;

    if (!email || !password || !first_name || !last_name) {
      throw new ValidationError('Email, password, first name, and last name are required');
    }
    if (!validateEmail(email)) throw new ValidationError('Invalid email format');
    if (!validatePassword(password)) throw new ValidationError('Password must be at least 8 characters');
    if (password !== password_confirm) throw new ValidationError('Passwords do not match');

    const existing = await queryAsync('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) throw new ConflictError('Email already registered');

    const hashedPassword = await bcryptjs.hash(password, BCRYPT_ROUNDS);

    const result = await queryAsync(
      `INSERT INTO users
        (email, password, first_name, last_name, role, birth_date,
         height_cm, initial_weight_kg, gender, phone, address, city, postal_code)
       VALUES ($1,$2,$3,$4,'client',$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id, email, first_name, last_name, role, created_at`,
      [
        email.toLowerCase(), hashedPassword, first_name.trim(), last_name.trim(),
        birth_date || null, height_cm ? parseFloat(height_cm) : null,
        initial_weight_kg ? parseFloat(initial_weight_kg) : null,
        gender || null, phone || null, address || null, city || null, postal_code || null
      ]
    );

    const user = result.rows[0];
    const token = signToken({ id: user.id, email: user.email, role: user.role });

    sendWelcomeEmail(user.email, user.first_name).catch(err =>
      console.error('Welcome email error:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role },
      token
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// LOGIN
// ============================================

router.post('/login', async (req, res, next) => {
  try {
    const { email, password, role = 'client' } = req.body;

    if (!email || !password) throw new ValidationError('Email and password are required');

    const result = await queryAsync(
      'SELECT id, email, password, first_name, last_name, role, is_active, is_verified FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    // Constant-time: always compare even if user not found (prevents timing attacks)
    const dummyHash = '$2a$12$invalidhashfordummycomparison000000000000000000000000';
    const user = result.rows[0];
    const hashToCompare = user ? user.password : dummyHash;
    const isValid = await bcryptjs.compare(password, hashToCompare);

    if (!user || !isValid) throw new UnauthorizedError('Invalid email or password');
    if (!user.is_active) throw new UnauthorizedError('Account has been deactivated');
    if (role && user.role !== role) throw new UnauthorizedError(`This account is not a ${role} account`);

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      message: 'Login successful',
      user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role },
      token
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// LOGOUT (Server-side token revocation)
// ============================================

router.post('/logout', verifyToken, async (req, res) => {
  try {
    const { jti, exp, id } = req.user;
    if (jti && exp) {
      await blacklistToken(jti, id, exp);
    }
  } catch (err) {
    console.error('Logout blacklist error:', err.message);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ============================================
// FORGOT PASSWORD
// ============================================

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw new ValidationError('Email is required');

    const result = await queryAsync('SELECT id, email, first_name FROM users WHERE email = $1', [email.toLowerCase()]);

    // Always respond the same way (don't reveal if email exists)
    const genericResponse = { success: true, message: 'If an account exists with this email, a reset link has been sent.' };

    if (result.rows.length === 0) return res.json(genericResponse);

    const user = result.rows[0];

    // Use a cryptographically secure random token (not JWT - prevents secret leakage)
    const rawToken = crypto.randomBytes(48).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await queryAsync(
      'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
      [tokenHash, expiresAt, user.id]
    );

    await sendPasswordResetEmail(user.email, user.first_name, rawToken);

    res.json(genericResponse);
  } catch (error) {
    next(error);
  }
});

// ============================================
// RESET PASSWORD
// ============================================

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password, password_confirm } = req.body;
    if (!token || !password || !password_confirm) throw new ValidationError('Token and new password are required');
    if (password !== password_confirm) throw new ValidationError('Passwords do not match');
    if (!validatePassword(password)) throw new ValidationError('Password must be at least 8 characters');

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const result = await queryAsync(
      'SELECT id FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
      [tokenHash]
    );

    if (result.rows.length === 0) throw new UnauthorizedError('Invalid or expired reset token');

    const hashedPassword = await bcryptjs.hash(password, BCRYPT_ROUNDS);

    await queryAsync(
      'UPDATE users SET password = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2',
      [hashedPassword, result.rows[0].id]
    );

    res.json({ success: true, message: 'Password reset successfully. You can now login.' });
  } catch (error) {
    next(error);
  }
});

// ============================================
// VERIFY TOKEN
// ============================================

router.get('/verify', verifyToken, async (req, res) => {
  try {
    const result = await queryAsync(
      'SELECT id, email, first_name, last_name, role, profile_picture_url FROM users WHERE id = $1 AND is_active = TRUE',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: result.rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Token verification failed' });
  }
});

export default router;
