// src/routes/payments.js - Stripe Payment Integration (Security-Fixed)
// Fix: Stripe webhook raw body handled correctly (registered before JSON parser in server.js)
// Fix: Payment confirm verifies client ownership of the paymentIntent
// Fix: Export stripeWebhookHandler for server.js to mount before json middleware

import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { queryAsync } from '../config/database.js';
import Stripe from 'stripe';
import { sendPaymentReceipt } from '../utils/email.js';

const router = express.Router();

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// ============================================
// CREATE PAYMENT INTENT
// ============================================

router.post('/create-intent', verifyToken, async (req, res, next) => {
  try {
    const stripe = getStripe();
    const { amount, planId, planName, currency = 'EUR' } = req.body;

    if (!amount || !planName) {
      return res.status(400).json({ success: false, message: 'Amount and plan name required' });
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    // If planId provided, verify it belongs to this client
    if (planId) {
      const planCheck = await queryAsync(
        'SELECT id FROM plans WHERE id = $1 AND client_id = $2',
        [planId, req.user.id]
      );
      if (planCheck.rows.length === 0) {
        return res.status(403).json({ success: false, message: 'Plan not found or access denied' });
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100),
      currency: currency.toLowerCase(),
      payment_method_types: ['card', 'ideal', 'sepa_debit', 'giropay'],
      metadata: {
        client_id: String(req.user.id),
        plan_id: planId ? String(planId) : 'one_time',
        plan_name: planName,
      },
    });

    const result = await queryAsync(
      `INSERT INTO payments (client_id, plan_id, amount, currency, stripe_payment_intent_id, description)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, status`,
      [req.user.id, planId || null, parseFloat(amount), currency, paymentIntent.id, planName]
    );

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: result.rows[0].id,
      paymentIntent: { id: paymentIntent.id, status: paymentIntent.status },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// CONFIRM PAYMENT
// ============================================

router.post('/confirm', verifyToken, async (req, res, next) => {
  try {
    const stripe = getStripe();
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) return res.status(400).json({ success: false, message: 'paymentIntentId required' });

    // SECURITY FIX: verify this payment belongs to the requesting user
    const paymentRecord = await queryAsync(
      'SELECT id, client_id, plan_id, amount, currency, description FROM payments WHERE stripe_payment_intent_id = $1',
      [paymentIntentId]
    );

    if (paymentRecord.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (paymentRecord.rows[0].client_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      await queryAsync(
        `UPDATE payments SET status = 'completed', updated_at = NOW() WHERE stripe_payment_intent_id = $1`,
        [paymentIntentId]
      );

      const payment = paymentRecord.rows[0];

      if (payment.plan_id) {
        await queryAsync(
          'UPDATE plans SET payment_status = $1, updated_at = NOW() WHERE id = $2 AND client_id = $3',
          ['paid', payment.plan_id, req.user.id]
        );
      }

      const userResult = await queryAsync('SELECT email, first_name FROM users WHERE id = $1', [req.user.id]);
      if (userResult.rows.length > 0) {
        const u = userResult.rows[0];
        sendPaymentReceipt(u.email, u.first_name, payment.amount, payment.currency, payment.description)
          .catch(err => console.error('Receipt email error:', err.message));
      }

      return res.json({ success: true, message: 'Payment confirmed', payment: { status: 'completed', amount: payment.amount, currency: payment.currency } });
    }

    res.status(400).json({ success: false, message: `Payment status: ${paymentIntent.status}. Not yet confirmed.` });
  } catch (error) {
    next(error);
  }
});

// ============================================
// PAYMENT HISTORY
// ============================================

router.get('/history', verifyToken, async (req, res, next) => {
  try {
    const result = await queryAsync(
      'SELECT id, amount, currency, status, description, created_at FROM payments WHERE client_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json({ success: true, payments: result.rows });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ADMIN: All Payments & Revenue
// ============================================

router.get('/admin/all', verifyAdmin, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT p.id, p.amount, p.currency, p.status, p.description, p.created_at,
              u.email, u.first_name, u.last_name
       FROM payments p LEFT JOIN users u ON p.client_id = u.id
       ORDER BY p.created_at DESC LIMIT 200`
    );
    res.json({ success: true, payments: result.rows });
  } catch (error) {
    next(error);
  }
});

router.get('/admin/revenue', verifyAdmin, async (req, res, next) => {
  try {
    const result = await queryAsync(
      `SELECT
         COUNT(*) AS total_transactions,
         COALESCE(SUM(CASE WHEN status='completed' THEN amount END), 0) AS total_revenue,
         COUNT(CASE WHEN status='completed' THEN 1 END) AS completed,
         COUNT(CASE WHEN status='pending' THEN 1 END) AS pending,
         COUNT(CASE WHEN status='failed' THEN 1 END) AS failed,
         COUNT(CASE WHEN status='refunded' THEN 1 END) AS refunded
       FROM payments`
    );
    res.json({ success: true, revenue: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;

// ============================================
// STRIPE WEBHOOK HANDLER
// Must be exported and mounted in server.js BEFORE express.json() middleware
// because Stripe signature verification requires the raw request body
// ============================================

export const stripeWebhookHandler = async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(400).json({ success: false, message: 'Stripe not configured' });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET not set - webhook skipped');
    return res.status(400).json({ success: false, message: 'Webhook secret not configured' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        await queryAsync(
          `UPDATE payments SET status='completed', updated_at=NOW() WHERE stripe_payment_intent_id=$1`,
          [pi.id]
        );
        console.log('✅ Webhook: payment succeeded', pi.id);
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        await queryAsync(
          `UPDATE payments SET status='failed', updated_at=NOW() WHERE stripe_payment_intent_id=$1`,
          [pi.id]
        );
        console.log('❌ Webhook: payment failed', pi.id);
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        await queryAsync(
          `UPDATE payments SET status='refunded', updated_at=NOW() WHERE stripe_payment_intent_id=$1`,
          [charge.payment_intent]
        );
        break;
      }
      default:
        // Ignored event type
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err.message);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
};
