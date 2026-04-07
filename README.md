# AM CULTURISMO - Fitness Tracker Platform

A professional, full-stack fitness coaching and client management platform built with modern technologies.

## 🎯 Project Overview

AM CULTURISMO is a comprehensive web-based fitness tracking system designed for personal trainers (admins) and their clients. It manages:

- **Client Profiles & Registration**
- **Workout Plans & History**
- **Daily Logging** (weight, heart rate, mood, energy, stress)
- **Body Measurements** (Pliche, Misure)
- **Nutrition Planning** (Integration with 8000+ food database)
- **Progress Analytics & Visualization**
- **Supplement Tracking**
- **Payment Management** (Stripe integration for EU)
- **Blog Management** (Admin can write, publish, edit articles)
- **Posture Correction Videos & Animations**

---

## 🏗️ Tech Stack

### Backend
- **Node.js + Express.js** - RESTful API server
- **PostgreSQL** - Primary database
- **JWT Authentication** - Secure login & sessions
- **Stripe API** - Payment processing (EU methods: Cards, iDEAL, SEPA, Giropay)
- **Multer** - File/Image uploads
- **bcryptjs** - Password hashing

### Frontend
- **React.js + Vite** - Fast, modern UI
- **TailwindCSS** - Professional styling
- **Recharts** - Data visualization & analytics
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Context API** - State management

### Hosting
- **Vercel** - Frontend deployment (free tier)
- **Render/Railway** - Backend deployment (free tier available)

---

## 📁 Project Structure

```
AM/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # PostgreSQL connection
│   │   │   ├── environment.js       # Environment variables
│   │   │   └── stripe.js            # Stripe API setup
│   │   ├── models/
│   │   │   ├── User.js              # Client & Admin models
│   │   │   ├── Workout.js
│   │   │   ├── DailyLog.js
│   │   │   ├── Measurement.js
│   │   │   ├── Plan.js
│   │   │   ├── Blog.js
│   │   │   ├── Food.js
│   │   │   ├── Supplement.js
│   │   │   ├── Payment.js
│   │   │   └── FormSubmission.js    # Time-limited form tracking
│   │   ├── routes/
│   │   │   ├── auth.js              # Login, register, forgot password
│   │   │   ├── client.js            # Client profile endpoints
│   │   │   ├── workout.js
│   │   │   ├── dailyLog.js
│   │   │   ├── measurements.js
│   │   │   ├── plans.js
│   │   │   ├── blogs.js
│   │   │   ├── food.js
│   │   │   ├── supplements.js
│   │   │   ├── analytics.js
│   │   │   ├── payments.js
│   │   │   └── admin.js             # Admin-only endpoints
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── roleCheck.js         # Role-based access control
│   │   │   ├── formRateLimit.js     # 10-min form submission limit
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── email.js             # Email notifications (plan expiry, password reset)
│   │   │   ├── imageUpload.js
│   │   │   └── validators.js
│   │   └── server.js                # Express app entry point
│   ├── database/
│   │   ├── schema.sql               # PostgreSQL schema
│   │   └── seeds.js                 # Optional seed data
│   ├── .env.example                 # Environment template
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ClientProfile.jsx
│   │   │   ├── WorkoutLog.jsx
│   │   │   ├── DailyLog.jsx
│   │   │   ├── Measurements.jsx
│   │   │   ├── Plans.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── BlogList.jsx
│   │   │   ├── BlogEditor.jsx
│   │   │   ├── PostureVideos.jsx
│   │   │   ├── MealPlanner.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── PaymentForm.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ClientDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useApi.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── logo.jpg
│   ├── .env.example
│   ├── vite.config.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── .gitignore
│
├── docs/
│   ├── API_DOCUMENTATION.md         # Complete API reference
│   ├── DATABASE_SCHEMA.md           # Database design explanation
│   └── DEPLOYMENT_GUIDE.md          # Step-by-step deployment
│
├── .gitignore                       # Root .gitignore
├── README.md                        # This file
└── SETUP_INSTRUCTIONS.md            # Quick start guide

```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### 1. Clone & Setup Backend

```bash
cd AM/backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm run migrate
npm start
```

### 2. Setup Frontend

```bash
cd AM/frontend
npm install
cp .env.example .env
# Edit .env with your API endpoint
npm run dev
```

### 3. Access the Platform

- **Client**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **API**: http://localhost:3001/api

---

## 🔐 Security Features

✅ **JWT Authentication** - Secure token-based login  
✅ **Password Hashing** - bcryptjs with salt rounds  
✅ **Role-Based Access Control** - Admin vs Client separation  
✅ **Form Rate Limiting** - 10-minute cooldown between submissions  
✅ **Email Verification** - Forgot password recovery  
✅ **HTTPS Ready** - SSL/TLS support  
✅ **.env Security** - Sensitive data not in git  

---

## 💳 Payment Integration

- **Stripe** for secure EU payment methods:
  - Credit/Debit Cards
  - iDEAL (Netherlands)
  - SEPA Bank Transfers
  - Giropay (Germany)

Clients can:
- View subscription plans
- Make payments
- Receive email confirmations
- Get automated expiry notifications

---

## 📱 Features by User Type

### Clients Can:
- Register with email/password
- Reset forgotten passwords
- View/edit their profile
- Submit daily logs (10-min rate limit per form)
- View personal analytics
- See assigned meal plans
- Browse posture correction videos
- Read blog articles
- Manage subscription

### Admins Can:
- **Full Data Management**
  - Create/edit client profiles
  - Assign workout plans
  - Manage supplement protocols
  - Track payments
  - Edit female cycle tracking data
  - Write/publish/edit blogs
  - Upload posture correction videos

- **Analytics Dashboard**
  - Client progress tracking
  - Revenue reporting
  - Retention metrics

---

## 🗄️ Database Highlights

- **8000+ Foods Database** - Pre-loaded from Lista Alimenti sheet
- **Meal Planning** - Track daily nutrition
- **Workout History** - Complete exercise logging
- **Body Measurements** - Pliche, circumferences
- **Time-based Form Submission** - Prevents spam (10-min cooldown)
- **Payment Tracking** - Subscription & one-time payments
- **Blog System** - Rich text, images, YouTube embeds

---

## 📊 Analytics Features

Clients & Admins can view:
- Weight trends (line charts)
- Body fat % progression
- Mood/Energy/Stress tracking (multi-line charts)
- Measurement progress
- Workout frequency
- Plan adherence

---

## 🎬 Content Management

**Admin can:**
- Write blog articles (with rich text editor)
- Embed YouTube videos
- Upload and manage images
- Schedule blog posts
- View analytics (views, comments)

**Clients can:**
- Read published blogs
- View posture correction videos/animations
- Learn proper form

---

## 🌐 SEO Optimization

- Meta tags on all pages
- Structured data (JSON-LD)
- Sitemap generation
- Blog URL slugs
- Open Graph for social sharing
- Robot.txt configuration

---

## 📧 Email Notifications

- Password reset links
- Plan expiry warnings (5 days before)
- Plan expiry notifications (on expiry date)
- Payment receipts
- Welcome email on registration

---

## 🧪 Testing & Deployment

### Local Testing
```bash
npm run dev:all  # Start both frontend & backend
```

### Production Build
```bash
npm run build:all
```

### Deploy to Vercel (Frontend)
```bash
vercel deploy
```

### Deploy Backend
- Render.com
- Railway.app
- Heroku (limited free tier)

---

## 📝 Environment Variables

See `.env.example` files in both backend and frontend directories.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for token generation
- `STRIPE_KEY` - Stripe publishable & secret keys
- `SENDGRID_API_KEY` - Email service (optional)
- `API_URL` - Backend API endpoint

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit for review

---

## 📄 License

Proprietary - AM CULTURISMO © 2025

---

## 📞 Support

For setup help, API questions, or bugs:
- Check `SETUP_INSTRUCTIONS.md`
- Review `API_DOCUMENTATION.md`
- Check database schema in `DATABASE_SCHEMA.md`

---

**Built with ❤️ for fitness coaches and their clients**
