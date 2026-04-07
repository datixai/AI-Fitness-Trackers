// src/middleware/formRateLimit.js - Form Submission Rate Limiting (10 minutes)

import { queryAsync } from '../config/database.js';

const COOLDOWN_MINUTES = parseInt(process.env.FORM_SUBMISSION_COOLDOWN_MINUTES || '10');

/**
 * Check if client can submit a form
 * Only allows one submission per form type every 10 minutes
 */
export const checkFormCooldown = async (req, res, next) => {
  try {
    const clientId = req.user.id;
    const formType = req.body.formType || req.query.formType || req.params.formType;

    if (!clientId || !formType) {
      return next(); // Allow if no form type specified
    }

    // Check last submission
    const result = await queryAsync(
      `SELECT submitted_at FROM form_submissions 
       WHERE client_id = $1 AND form_type = $2 
       ORDER BY submitted_at DESC LIMIT 1`,
      [clientId, formType]
    );

    if (result.rows.length > 0) {
      const lastSubmission = new Date(result.rows[0].submitted_at);
      const currentTime = new Date();
      const minutesSinceLastSubmission = (currentTime - lastSubmission) / (1000 * 60);

      if (minutesSinceLastSubmission < COOLDOWN_MINUTES) {
        const minutesRemaining = Math.ceil(COOLDOWN_MINUTES - minutesSinceLastSubmission);
        
        return res.status(429).json({
          success: false,
          message: `Please wait ${minutesRemaining} minute(s) before submitting again`,
          remainingSeconds: Math.ceil((COOLDOWN_MINUTES * 60) - (minutesSinceLastSubmission * 60)),
          canSubmitAt: new Date(lastSubmission.getTime() + COOLDOWN_MINUTES * 60 * 1000).toISOString()
        });
      }
    }

    // Mark submission as logged (will be called in the form submission handler)
    next();
  } catch (error) {
    console.error('Form rate limit check error:', error);
    // Don't block on error, just log it
    next();
  }
};

/**
 * Record form submission in database
 */
export const logFormSubmission = async (clientId, formType, ipAddress) => {
  try {
    await queryAsync(
      `INSERT INTO form_submissions (client_id, form_type, ip_address, submitted_at)
       VALUES ($1, $2, $3, NOW())`,
      [clientId, formType, ipAddress]
    );
  } catch (error) {
    console.error('Error logging form submission:', error);
  }
};

/**
 * Get remaining cooldown time for a form
 */
export const getFormCooldownStatus = async (clientId, formType) => {
  try {
    const result = await queryAsync(
      `SELECT submitted_at FROM form_submissions 
       WHERE client_id = $1 AND form_type = $2 
       ORDER BY submitted_at DESC LIMIT 1`,
      [clientId, formType]
    );

    if (result.rows.length === 0) {
      return {
        canSubmit: true,
        minutesRemaining: 0,
        canSubmitAt: new Date().toISOString()
      };
    }

    const lastSubmission = new Date(result.rows[0].submitted_at);
    const currentTime = new Date();
    const minutesSinceLastSubmission = (currentTime - lastSubmission) / (1000 * 60);
    const minutesRemaining = Math.max(0, COOLDOWN_MINUTES - minutesSinceLastSubmission);

    return {
      canSubmit: minutesRemaining === 0,
      minutesRemaining: Math.ceil(minutesRemaining),
      secondsRemaining: Math.ceil(minutesRemaining * 60),
      canSubmitAt: new Date(lastSubmission.getTime() + COOLDOWN_MINUTES * 60 * 1000).toISOString(),
      lastSubmitted: lastSubmission.toISOString()
    };
  } catch (error) {
    console.error('Error getting form cooldown status:', error);
    return {
      canSubmit: true,
      minutesRemaining: 0,
      canSubmitAt: new Date().toISOString()
    };
  }
};

// Helper to get client IP address
export const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    'unknown'
  );
};
