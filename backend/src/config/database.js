// src/config/database.js - PostgreSQL Connection (Fixed)
// Fix: queryAsync now uses pool.query() for simple queries (no unnecessary client checkout)
// Fix: getClient() still available for multi-step transactions

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'am_culturismo',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: parseInt(process.env.DB_POOL_MAX || '20', 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle DB client:', err.message);
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected at', res.rows[0].now);
  }
});

// Simple queries: use pool directly (no dedicated client checkout)
export const queryAsync = (text, params) => pool.query(text, params);

// Transactions: get a dedicated client
export const getClient = () => pool.connect();

export default pool;
