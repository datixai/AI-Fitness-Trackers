// src/config/validateEnv.js - Startup environment validation
// Server will refuse to start if critical secrets are missing

const REQUIRED = [
  'JWT_SECRET',
  'DB_PASSWORD',
];

const RECOMMENDED = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'FRONTEND_URL',
  'CORS_ORIGIN',
];

export const validateEnv = () => {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error('❌ FATAL: Missing required environment variables:');
    missing.forEach((k) => console.error(`   - ${k}`));
    console.error('\nCopy .env.example to .env and fill in all values.');
    process.exit(1);
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error('❌ FATAL: JWT_SECRET must be at least 32 characters long.');
    process.exit(1);
  }

  const absent = RECOMMENDED.filter((key) => !process.env[key]);
  if (absent.length > 0) {
    console.warn('⚠️  Recommended env vars not set (some features may not work):');
    absent.forEach((k) => console.warn(`   - ${k}`));
  }
};
