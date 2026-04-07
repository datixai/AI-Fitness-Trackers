# AM CULTURISMO — Complete Setup, Run, Test & Deploy Guide

---

## What Was Fixed (Security Audit Summary)

| # | Issue | Severity | File |
|---|-------|----------|------|
| 1 | MySQL `INDEX` syntax inside `CREATE TABLE` — crashes PostgreSQL | Critical | schema.sql |
| 2 | `LONGTEXT` MySQL type — invalid in PostgreSQL | Critical | schema.sql |
| 3 | JWT fallback secret `\|\| 'your_secret_key'` | Critical | auth.js, middleware/auth.js |
| 4 | Stripe webhook raw body destroyed by global JSON parser | Critical | server.js |
| 5 | No token blacklisting — logout was client-side only | Critical | auth.js |
| 6 | Payment confirm didn't verify ownership (any user could confirm another's payment) | Critical | payments.js |
| 7 | Missing `UNIQUE` constraints needed for `ON CONFLICT` clauses | Critical | schema.sql |
| 8 | `bcrypt.hash(pw, "10")` — string instead of number | High | auth.js |
| 9 | `express-rate-limit` installed but never applied | High | server.js |
| 10 | 50MB JSON body limit — trivial DoS vector | High | server.js |
| 11 | `queryAsync` opened a DB client connection per query | High | database.js |
| 12 | `LIMIT ${parseInt(limit)}` — SQL injection via string interpolation | High | admin.js, food.js |
| 13 | Cycle data inserts had no transaction — partial state on failure | High | admin.js |
| 14 | Plan expiry email fired on every `GET /plans/current` (email spam) | High | plans.js |
| 15 | Password reset token stored as plaintext | Medium | auth.js |
| 16 | Timing attack on login (failed before bcrypt if user not found) | Medium | auth.js |
| 17 | Frontend logout didn't call server-side revoke endpoint | Medium | AuthContext.jsx |

---

## Prerequisites

Install these before starting:

- **Node.js 18+** → https://nodejs.org
- **PostgreSQL 14+** → https://www.postgresql.org/download
- **Git** → https://git-scm.com
- **VS Code** (recommended) with extensions: ESLint, Prettier, PostgreSQL

---

## Step 1 — Clone and Enter the Project

```bash
# If starting from the zip:
unzip AM_CULTURISMO_complete.zip
cd AM

# OR if from GitHub (after you push):
git clone https://github.com/YOUR_USERNAME/am-culturismo.git
cd am-culturismo
```

---

## Step 2 — Set Up the Database

### Create the PostgreSQL database

```bash
# Open psql
psql -U postgres

# Inside psql:
CREATE DATABASE am_culturismo;
CREATE USER am_user WITH ENCRYPTED PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE am_culturismo TO am_user;
\q
```

### Run the schema

```bash
psql -U am_user -d am_culturismo -f backend/database/schema.sql
```

You should see many `CREATE TABLE`, `CREATE INDEX`, `CREATE TRIGGER` lines — no errors.

### Verify

```bash
psql -U am_user -d am_culturismo -c "\dt"
# Should list 20+ tables including token_blacklist
```

---

## Step 3 — Configure Backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in:

```env
# Generate a secure secret (run this in terminal):
# node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRET=paste_generated_secret_here

DB_HOST=localhost
DB_PORT=5432
DB_NAME=am_culturismo
DB_USER=am_user
DB_PASSWORD=your_strong_password

# For email - use Gmail App Password (not your regular password)
# Google Account → Security → 2-Step Verification → App passwords
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_16_char_app_password

# For Stripe - use test keys from dashboard.stripe.com
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
# For webhook: stripe listen --forward-to localhost:3001/api/payments/webhook
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Step 4 — Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## Step 5 — Run Locally

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# ✅ Server running on http://localhost:3001
# ✅ Database connected at ...
```

**Terminal 2 — Frontend:**
```bash
cd frontend
cp .env.example .env
# .env already has: VITE_API_URL=http://localhost:3001/api
npm run dev
# ✅ Local: http://localhost:5173
```

Open http://localhost:5173 in your browser.

---

## Step 6 — Run Tests

```bash
cd backend
npm test
```

Expected output:
```
✓ rejects missing fields
✓ rejects weak password
✓ rejects mismatched passwords
✓ rejects invalid email
✓ rejects requests without token
✓ rejects invalid token
✓ returns ok (health check)
✓ blocks after 20 auth requests (rate limiting)
```

---

## Step 7 — Test Key Flows Manually

### Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","password_confirm":"password123","first_name":"Test","last_name":"User"}'
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
# Copy the token from response
```

### Test Auth Protected Route
```bash
curl http://localhost:3001/api/client/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Rate Limiting (should get 429 after 20 rapid requests)
```bash
for i in {1..25}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"x@x.com","password":"wrong"}'
done
```

### Test Stripe Webhook (requires Stripe CLI)
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3001/api/payments/webhook
# In another terminal: stripe trigger payment_intent.succeeded
```

---

## Step 8 — Push to GitHub

### First time setup

```bash
cd AM   # project root

git init
git add .
git commit -m "Initial commit: AM CULTURISMO platform"

# Create repo on GitHub (github.com → New repository → name: am-culturismo)
# Then:
git remote add origin https://github.com/YOUR_USERNAME/am-culturismo.git
git branch -M main
git push -u origin main
```

### Important: protect secrets

The `.gitignore` already excludes `.env` files. Double-check:
```bash
cat .gitignore | grep env
# Should show: .env
```

**Never commit `.env` files.** Only `.env.example` goes to GitHub.

---

## Step 9 — Deploy to Production

### Backend → Railway

1. Go to railway.app → New Project → Deploy from GitHub
2. Select your `am-culturismo` repo
3. Set Root Directory to `backend`
4. Add environment variables (from your `.env`, but with real production values)
5. Add a PostgreSQL plugin — Railway gives you a `DATABASE_URL` automatically
6. Run the schema: Railway console → `npm run db:setup` (or paste schema.sql in the DB GUI)

### Frontend → Vercel

1. Go to vercel.com → New Project → Import from GitHub
2. Select your repo
3. Set Root Directory to `frontend`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-railway-backend.up.railway.app/api`
5. Deploy

### Stripe Production Webhook

After backend is deployed:
1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://your-backend.railway.app/api/payments/webhook`
3. Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
4. Copy the webhook signing secret → add as `STRIPE_WEBHOOK_SECRET` in Railway env vars

---

## Step 10 — Create Admin User

After deploy, create the first admin manually in PostgreSQL:

```sql
-- In Railway DB console or psql:
INSERT INTO users (email, password, first_name, last_name, role, is_active, is_verified)
VALUES (
  'admin@amculturismo.com',
  '$2a$12$REPLACE_WITH_BCRYPT_HASH',  -- generate below
  'Admin',
  'Culturismo',
  'admin',
  TRUE,
  TRUE
);
```

Generate the bcrypt hash:
```bash
node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('YourStrongAdminPassword', 12).then(h => console.log(h));
"
```

Then login at `/admin-login` with those credentials.

---

## Folder Structure

```
AM/
├── backend/
│   ├── database/
│   │   └── schema.sql          ← Run this first
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js     ← DB connection pool
│   │   │   └── validateEnv.js  ← Startup env check
│   │   ├── middleware/
│   │   │   ├── auth.js         ← JWT + blacklist check
│   │   │   ├── errorHandler.js
│   │   │   └── formRateLimit.js
│   │   ├── routes/             ← All 12 API route files
│   │   ├── utils/
│   │   │   ├── email.js
│   │   │   └── validators.js
│   │   └── server.js           ← App entry point
│   ├── tests/
│   │   └── auth.test.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/useApi.js
│   │   ├── components/
│   │   └── pages/
│   ├── .env.example
│   └── package.json
└── SETUP_AND_DEPLOY.md         ← You are here
```

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `JWT_SECRET environment variable is not set` | Add `JWT_SECRET` to `.env` (min 32 chars) |
| `ERROR: syntax error at or near "INDEX"` | You ran the old schema. Use the fixed `schema.sql` |
| `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL is not running. Start it: `brew services start postgresql` |
| `Invalid signature` on webhook | Set `STRIPE_WEBHOOK_SECRET` from Stripe CLI output |
| `Cannot find module 'supertest'` | Run `npm install` in backend folder |
| Frontend shows CORS error | Set `CORS_ORIGIN` in backend `.env` to match your frontend URL |
| `Rate limit exceeded` during dev | Temporarily increase `max` in server.js rate limiter |
