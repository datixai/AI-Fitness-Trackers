# AM CULTURISMO - Quick Start Setup

## 🎯 5-Minute Quick Start

### Step 1: Database

```bash
# Create database
createdb am_culturismo

# Run schema
psql am_culturismo < AM/backend/database/schema.sql
```

### Step 2: Backend

```bash
cd AM/backend
npm install
cp .env.example .env

# Edit .env (minimal):
# DATABASE_URL=postgresql://postgres:password@localhost:5432/am_culturismo
# JWT_SECRET=your_secret_key_minimum_32_characters_long
# EMAIL_USER=your@gmail.com
# EMAIL_PASSWORD=your_app_password

npm run dev
```

### Step 3: Frontend

```bash
cd AM/frontend
npm install
cp .env.example .env

# .env already has defaults, but update:
# VITE_API_URL=http://localhost:3001/api

npm run dev
```

### Step 4: Access

- **App**: http://localhost:5173
- **API**: http://localhost:3001

---

## 👥 Test Accounts

```
CLIENT LOGIN:
Email: demo@client.com
Password: password123

ADMIN LOGIN:
Email: admin@demo.com
Password: password123
```

**Note**: Create these accounts manually first via register page

---

## ⚙️ Configuration Checklist

### Email Setup (Pick One)

#### Gmail (Easiest)
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=app_password_from_https://myaccount.google.com/apppasswords
```

#### SendGrid
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

### Stripe Setup (Optional for Testing)

1. Go to https://stripe.com → Create Account
2. Navigate to Developers → API Keys
3. Copy keys and add to `.env`:

```env
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
```

4. Use test card: `4242 4242 4242 4242` (any future date, any CVC)

---

## 📁 Important Files

### Backend
- `AM/backend/.env.example` - Environment template
- `AM/backend/database/schema.sql` - Database structure
- `AM/backend/src/server.js` - Express entry point
- `AM/backend/src/routes/` - API endpoints

### Frontend  
- `AM/frontend/.env.example` - Environment template
- `AM/frontend/src/App.jsx` - React routing
- `AM/frontend/src/pages/` - Page components
- `AM/frontend/tailwind.config.js` - Styling config

---

## 🚀 Production Deployment

### Frontend → Vercel

```bash
# Option 1: CLI
npm i -g vercel
cd AM/frontend
vercel

# Option 2: GitHub (Recommended)
# 1. Push to GitHub
# 2. https://vercel.com → Import project
# 3. Add VITE_API_URL env variable
```

### Backend → Railway or Render

#### Railway (Simplest)
```bash
npm i -g railway
cd AM/backend
railway login
railway up
```

#### Render.com (Free)
1. Push code to GitHub
2. https://render.com → New Web Service
3. Connect repo
4. Add PostgreSQL database
5. Deploy

---

## 🔧 Common Issues & Solutions

### "Cannot connect to database"
```bash
# Check PostgreSQL is running
psql -U postgres

# Check DATABASE_URL format
postgresql://username:password@localhost:5432/am_culturismo
```

### "Email not sending"
- Verify EMAIL_USER and EMAIL_PASSWORD
- Use Gmail app password (not account password)
- Check firewall/ISP blocks SMTP

### "Stripe payment error"
- Verify API keys are correct
- Use test keys for development
- Test card: `4242 4242 4242 4242`

### "CORS errors"
- Check CORS_ORIGIN in backend .env
- Should match frontend URL

---

## 📚 What's Included

✅ **Backend** (Complete)
- Express server with JWT auth
- PostgreSQL database with 25+ tables
- 12 API route files (3500+ lines)
- Stripe integration
- Email notifications
- Form rate limiting

✅ **Frontend** (Foundation)
- React + Vite setup
- TailwindCSS styling
- 8 complete pages (Home, Login, Register, Dashboards)
- Authentication context
- Protected routes
- API client hooks

✅ **Database**
- Complete schema ready to use
- Seed data templates
- Views for common queries
- Indexes for performance

---

## 🎓 Learning Path

1. **Understand Structure** - Read README.md
2. **Setup Local** - Follow this guide
3. **Explore Backend** - Check `AM/backend/src/routes/`
4. **Explore Frontend** - Check `AM/frontend/src/pages/`
5. **Test APIs** - Use Postman or curl
6. **Deploy** - Follow DEPLOYMENT_GUIDE.md

---

## 📞 Quick Fixes

### Reset Everything

```bash
# Backend
cd AM/backend
rm -rf node_modules
npm install
rm .env
cp .env.example .env
# Edit .env with your settings
npm run dev

# Frontend  
cd AM/frontend
rm -rf node_modules
npm install
rm .env
cp .env.example .env
npm run dev
```

### Database Reset

```bash
# Drop and recreate
dropdb am_culturismo
createdb am_culturismo
psql am_culturismo < AM/backend/database/schema.sql
```

---

## ✅ Verification Checklist

- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can see login page
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Can see client dashboard
- [ ] Can login as admin
- [ ] Can see admin dashboard
- [ ] All navigation links work

---

## 🎉 You're Ready!

Your AM CULTURISMO fitness tracker platform is now fully set up and ready to use. Start with the client pages and gradually build out the admin features.

**Questions?** Check DEPLOYMENT_GUIDE.md for detailed information.

---

**Version**: 1.0.0  
**Status**: Ready to Use  
**Next**: Start building client and admin pages!
