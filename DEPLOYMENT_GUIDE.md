# AM CULTURISMO - Setup & Deployment Guide

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- Git
- npm or yarn

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb am_culturismo

# Connect and run schema
psql am_culturismo < AM/backend/database/schema.sql

# Verify connection
psql am_culturismo -c "SELECT NOW();"
```

### 2. Backend Setup

```bash
cd AM/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env with your settings:
# - DATABASE_URL=postgresql://username:password@localhost:5432/am_culturismo
# - JWT_SECRET=your_super_secret_key_at_least_32_chars
# - STRIPE_PUBLIC_KEY=pk_test_xxx
# - STRIPE_SECRET_KEY=sk_test_xxx
# - EMAIL_USER=your@email.com
# - EMAIL_PASSWORD=app_password

# Start development server
npm run dev
# Server runs on http://localhost:3001
```

### 3. Frontend Setup

```bash
cd AM/frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env:
# VITE_API_URL=http://localhost:3001/api
# VITE_STRIPE_PUBLIC_KEY=pk_test_xxx

# Start development server
npm run dev
# App runs on http://localhost:5173
```

### 4. Access the Platform

- **Home**: http://localhost:5173
- **Client Login**: http://localhost:5173/login
- **Admin Login**: http://localhost:5173/admin
- **API**: http://localhost:3001/api

---

## 📧 Email Configuration (Nodemailer)

### Option 1: Gmail

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # Generate at https://myaccount.google.com/apppasswords
EMAIL_FROM=noreply@amculturismo.com
```

### Option 2: SendGrid

```env
SENDGRID_API_KEY=SG.xxxxxxx
EMAIL_FROM=noreply@amculturismo.com
```

### Option 3: Custom SMTP

```env
SMTP_HOST=smtp.yourserver.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASSWORD=your_password
EMAIL_FROM=noreply@amculturismo.com
```

---

## 💳 Stripe Setup (EU Payments)

### 1. Create Stripe Account

1. Go to https://stripe.com
2. Create business account
3. Verify identity and add banking details
4. Enable Test Mode

### 2. Get API Keys

1. Dashboard → Developers → API Keys
2. Copy **Publishable Key** (pk_test_)
3. Copy **Secret Key** (sk_test_)

### 3. Configure Webhook

1. Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy Webhook Secret (whsec_)

### 4. Update Environment

```env
STRIPE_PUBLIC_KEY=pk_test_xxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxx
```

### 5. EU Payment Methods

Stripe automatically supports:
- ✅ Credit/Debit Cards (Visa, Mastercard, etc.)
- ✅ iDEAL (Netherlands)
- ✅ SEPA Bank Transfers
- ✅ Giropay (Germany)
- ✅ Bancontact (Belgium)

---

## 🌍 Deployment Guide

### Option 1: Frontend on Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd AM/frontend

# Deploy
vercel deploy

# Or connect GitHub repo in https://vercel.com/dashboard
```

**Environment Variables in Vercel:**
1. Project Settings → Environment Variables
2. Add:
   - `VITE_API_URL=https://your-backend.com/api`
   - `VITE_STRIPE_PUBLIC_KEY=pk_live_xxx`

### Option 2: Backend on Railway (Recommended - Free Tier)

```bash
# Install Railway CLI
npm i -g railway

# Login
railway login

# Navigate to backend
cd AM/backend

# Deploy
railway up
```

**Railway Setup:**
1. Create new project
2. Add PostgreSQL plugin (auto)
3. Set environment variables:
   - `DATABASE_URL=` (auto-generated)
   - `JWT_SECRET=` (generate secure key)
   - `STRIPE_SECRET_KEY=sk_live_xxx`
   - `EMAIL_USER=` and `EMAIL_PASSWORD=`

### Option 3: Backend on Render.com

1. Push code to GitHub
2. Go to https://render.com
3. Create New → Web Service
4. Connect GitHub repo
5. Configure:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables (same as Railway)
7. Add PostgreSQL database

### Option 4: Backend on Heroku (Limited Free Tier)

```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set STRIPE_SECRET_KEY=sk_xxx

# Deploy
git push heroku main
```

---

## 🗄️ Database Seeding

### Load Foods Database

```bash
cd AM/backend

# Create seed script (from Lista Alimenti)
npm run seed

# Or manually insert from Excel data
```

### Seed Sample Data

```sql
-- Insert test admin
INSERT INTO users (email, password, first_name, last_name, role)
VALUES ('admin@test.com', '[bcrypt_hash]', 'Admin', 'Coach', 'admin');

-- Insert test client
INSERT INTO users (email, password, first_name, last_name, role)
VALUES ('client@test.com', '[bcrypt_hash]', 'John', 'Doe', 'client');
```

---

## 🔒 Security Checklist

### Before Production

- [ ] Change `JWT_SECRET` to a strong 32+ character random string
- [ ] Update `STRIPE_PUBLIC_KEY` to live key (pk_live_)
- [ ] Update `STRIPE_SECRET_KEY` to live key (sk_live_)
- [ ] Configure `FRONTEND_URL` to your domain
- [ ] Set up HTTPS/SSL certificate
- [ ] Enable CORS properly for your domain only
- [ ] Set up email service with authenticated account
- [ ] Configure database backups
- [ ] Review and enable rate limiting
- [ ] Enable HTTPS redirects
- [ ] Test password reset flow
- [ ] Test payment webhook

### Environment Variables Check

```bash
# In backend .env, verify all required variables are set:
✓ DATABASE_URL
✓ JWT_SECRET
✓ STRIPE_PUBLIC_KEY
✓ STRIPE_SECRET_KEY
✓ EMAIL_USER
✓ EMAIL_PASSWORD
✓ CORS_ORIGIN (your frontend domain)
✓ NODE_ENV=production
```

---

## 📊 Database Backup

### PostgreSQL Backup

```bash
# Backup
pg_dump am_culturismo > backup_$(date +%Y%m%d).sql

# Restore
psql am_culturismo < backup_20250407.sql
```

### Automated Backups

**Railway**: Automatic daily backups (check dashboard)

**Heroku**: Add backup addon
```bash
heroku addons:create heroku-postgresql:standard-0 --as DATABASE
heroku pg:backups:schedule DATABASE
```

---

## 🧪 Testing

### Local API Testing

```bash
# Get token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@test.com","password":"password123"}'

# Test protected endpoint
curl http://localhost:3001/api/client/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Stripe Payments

Use Stripe test card: `4242 4242 4242 4242`

---

## 🐛 Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: 
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Test connection: `psql -U postgres`

### Stripe API Error

```
Error: Cannot find module 'stripe'
```

**Solution**: `npm install stripe --save`

### Email Not Sending

```
Error: SMTP connection failed
```

**Solution**:
- Verify EMAIL_USER and EMAIL_PASSWORD
- Check firewall/network settings
- Use Gmail app password (not account password)
- Enable "Less secure app access" if needed

### CORS Error

**Solution**: Update `CORS_ORIGIN` in .env to match frontend URL

---

## 📞 Support & Monitoring

### Logs

```bash
# Backend (local)
npm run dev  # Shows all logs

# Railway
railway logs

# Render
View logs in dashboard

# Heroku
heroku logs --tail
```

### Monitoring

- Monitor API uptime
- Track payment failures
- Monitor email delivery
- Check database size
- Review error logs daily

---

## 🎯 Next Steps

1. **Load Foods Data**: Seed 8000+ foods from Lista Alimenti sheet
2. **Create Sample Workouts**: Add template programs
3. **Write Blog Posts**: Create 3-5 starter articles
4. **Upload Posture Videos**: Add exercise form videos
5. **Test Payment Flow**: Complete end-to-end Stripe test
6. **Email Verification**: Test all notification emails
7. **Analytics**: Verify charts display correctly

---

## 📚 Documentation Links

- [Express.js Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Stripe API](https://stripe.com/docs/api)
- [Vercel Deployment](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)

---

## 💡 Pro Tips

1. **Use environment variables** for all secrets
2. **Test locally first** before deploying
3. **Keep database backups** daily
4. **Monitor logs** regularly
5. **Update dependencies** monthly
6. **Test payments** before going live
7. **Verify emails** are sending correctly
8. **Check HTTPS** is working
9. **Test on mobile** before launch
10. **Have a rollback plan** ready

---

**Version**: 1.0.0  
**Last Updated**: April 2025  
**Status**: Production Ready
