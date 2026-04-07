// src/utils/email.js - Email Sending Utilities

import nodemailer from 'nodemailer';

// Configure email transporter (Gmail example, but works with any SMTP)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Alternative SMTP configuration
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD
//   }
// });

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@amculturismo.com';
const APP_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Send welcome email to new client
 */
export const sendWelcomeEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: FROM_EMAIL,
      to: email,
      subject: '🏋️ Welcome to AM CULTURISMO - Your Fitness Journey Starts Now!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #8B4513; color: white; padding: 20px; text-align: center;">
            <h1>Welcome to AM CULTURISMO</h1>
            <p style="font-size: 16px;">Your Personal Fitness Coaching Platform</p>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hi ${firstName},</p>
            
            <p>🎉 Welcome to AM CULTURISMO! We're excited to have you join our fitness community.</p>
            
            <p><strong>Your account has been successfully created.</strong> You can now:</p>
            <ul style="line-height: 1.8;">
              <li>📊 Track your daily progress (weight, mood, energy, stress)</li>
              <li>🏋️ View your personalized workout plans</li>
              <li>🍎 Log your meals and nutrition</li>
              <li>📈 Monitor body measurements</li>
              <li>💬 Connect with your trainer</li>
            </ul>
            
            <p><strong>Next Steps:</strong></p>
            <ol style="line-height: 1.8;">
              <li>Complete your initial assessment form</li>
              <li>Set up your profile with a photo</li>
              <li>Review your first workout plan</li>
              <li>Start tracking your daily metrics</li>
            </ol>
            
            <p style="margin-top: 30px;">
              <a href="${APP_URL}/dashboard" style="background-color: #8B4513; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Go to Dashboard
              </a>
            </p>
            
            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              If you have any questions, please contact your trainer or reply to this email.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd;">
            <p>© 2025 AM CULTURISMO. All rights reserved.</p>
            <p>This is an automated message. Please do not reply directly to this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to', email);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, firstName, resetToken) => {
  try {
    const resetLink = `${APP_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: FROM_EMAIL,
      to: email,
      subject: '🔑 Reset Your AM CULTURISMO Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #8B4513; color: white; padding: 20px; text-align: center;">
            <h1>Password Reset Request</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hi ${firstName},</p>
            
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            
            <p style="margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #8B4513; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </p>
            
            <p style="color: #666; font-size: 14px;">
              Or paste this link in your browser: <br/>
              <code style="background-color: #f0f0f0; padding: 10px; display: block; word-break: break-all;">
                ${resetLink}
              </code>
            </p>
            
            <p style="color: #d32f2f; margin-top: 30px;">
              ⏰ This link expires in <strong>1 hour</strong>. If you don't reset your password within this timeframe, you'll need to request a new reset link.
            </p>
            
            <p style="margin-top: 30px; color: #666;">
              If you didn't request this, please ignore this email or contact support.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd;">
            <p>© 2025 AM CULTURISMO. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to', email);
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Send plan expiry warning email
 */
export const sendPlanExpiryWarning = async (email, firstName, daysRemaining) => {
  try {
    const mailOptions = {
      from: FROM_EMAIL,
      to: email,
      subject: `⏰ Your Training Plan Expires in ${daysRemaining} Day(s)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #ff9800; color: white; padding: 20px; text-align: center;">
            <h1>Plan Expiry Notice</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hi ${firstName},</p>
            
            <p>Your current training plan expires in <strong>${daysRemaining} day(s)</strong>.</p>
            
            <p>To continue your fitness journey without interruption, please renew your plan now.</p>
            
            <p style="margin: 30px 0;">
              <a href="${APP_URL}/plans/renew" style="background-color: #ff9800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Renew Your Plan
              </a>
            </p>
            
            <p style="color: #666;">
              Questions? Contact your trainer for more information about plan options.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd;">
            <p>© 2025 AM CULTURISMO. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Plan expiry warning sent to', email);
  } catch (error) {
    console.error('❌ Error sending plan expiry warning:', error);
    throw error;
  }
};

/**
 * Send plan expiry notification (on actual expiry date)
 */
export const sendPlanExpiredEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: FROM_EMAIL,
      to: email,
      subject: '📋 Your Training Plan Has Expired',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #d32f2f; color: white; padding: 20px; text-align: center;">
            <h1>Plan Expired</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hi ${firstName},</p>
            
            <p>Your training plan has now expired. You can still access your past data and analytics, but you won't be able to receive new workout assignments until you renew your plan.</p>
            
            <p style="margin: 30px 0;">
              <a href="${APP_URL}/plans/renew" style="background-color: #d32f2f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Renew Now
              </a>
            </p>
            
            <p style="color: #666;">
              Ready to continue your fitness journey? Contact your trainer to discuss new plans and pricing.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd;">
            <p>© 2025 AM CULTURISMO. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Plan expiry notification sent to', email);
  } catch (error) {
    console.error('❌ Error sending plan expiry notification:', error);
    throw error;
  }
};

/**
 * Send payment receipt
 */
export const sendPaymentReceipt = async (email, firstName, amount, currency, planName) => {
  try {
    const mailOptions = {
      from: FROM_EMAIL,
      to: email,
      subject: '💳 Payment Receipt - AM CULTURISMO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4caf50; color: white; padding: 20px; text-align: center;">
            <h1>Payment Successful</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hi ${firstName},</p>
            
            <p>Thank you for your payment! Your training plan has been activated.</p>
            
            <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
              <tr style="background-color: #e0e0e0;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Plan</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${planName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Amount</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${amount} ${currency}</td>
              </tr>
              <tr style="background-color: #e0e0e0;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleDateString()}</td>
              </tr>
            </table>
            
            <p style="margin: 30px 0;">
              <a href="${APP_URL}/dashboard" style="background-color: #4caf50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Go to Dashboard
              </a>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd;">
            <p>© 2025 AM CULTURISMO. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Payment receipt sent to', email);
  } catch (error) {
    console.error('❌ Error sending payment receipt:', error);
    throw error;
  }
};
