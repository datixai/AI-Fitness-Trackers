// src/middleware/auth.js - JWT Authentication Middleware (Security-Fixed)
// Fix: No fallback secret - crashes clearly if JWT_SECRET missing
// Fix: Token blacklist check on every authenticated request
// Fix: verifyAdmin no longer duplicates token logic (reuses verifyToken)

import jwt from 'jsonwebtoken';
import { queryAsync } from '../config/database.js';

const getSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return process.env.JWT_SECRET;
};

// Check if a token's JTI has been blacklisted (logout)
const isTokenBlacklisted = async (jti) => {
  if (!jti) return false;
  try {
    const result = await queryAsync(
      'SELECT id FROM token_blacklist WHERE jti = $1 AND expires_at > NOW()',
      [jti]
    );
    return result.rows.length > 0;
  } catch {
    return false;
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided. Please login.' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, getSecret());

    // Check token blacklist (logout revocation)
    if (await isTokenBlacklisted(decoded.jti)) {
      return res.status(401).json({ success: false, message: 'Token has been revoked. Please login again.' });
    }

    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    return res.status(500).json({ success: false, message: 'Authentication error.' });
  }
};

export const verifyAdmin = async (req, res, next) => {
  // First run the standard token check
  await verifyToken(req, res, async () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    next();
  });
};

// Add a token to the blacklist (used on logout)
export const blacklistToken = async (jti, userId, expiresAt) => {
  try {
    await queryAsync(
      'INSERT INTO token_blacklist (jti, user_id, expires_at) VALUES ($1, $2, $3) ON CONFLICT (jti) DO NOTHING',
      [jti, userId, new Date(expiresAt * 1000)]
    );
    // Clean up expired tokens periodically (1% of requests)
    if (Math.random() < 0.01) {
      queryAsync('DELETE FROM token_blacklist WHERE expires_at < NOW()').catch(() => {});
    }
  } catch (err) {
    console.error('Error blacklisting token:', err.message);
  }
};
