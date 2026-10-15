# Fisicora

AI software for physique coaches and nutrition professionals in Europe. Fisicora takes the admin out of the practice: it transcribes check-ins and consultations, writes the client summary, drafts meal and training plans with macros, and handles reminders and invoices.

Developed by Datix AI.

## What is in this repo (phase 1)

- Marketing website in English and Italian (`/en`, `/it`)
- Clickable app demo with sample data (`/en/app`, `/it/app`): client records, simulated AI session with transcript and summary, measurements, meal plan with phase based macros, training split and check-in diary
- Demo request form (saved locally to `data/demo-requests.jsonl` for now)

## Portal (phase 2, in progress)

- Login with signed cookie sessions (`/en/login`, `/it/login`), bcrypt passwords, login rate limit
- Client list and client records with measurements and weight chart (`/en/clients`)
- Each professional only sees their own clients
- Local SQLite database via Prisma. Move to Neon Postgres later by changing the provider in `prisma/schema.prisma` and `DATABASE_URL`

Setup after cloning:

```bash
cp .env.example .env
npm install
npx prisma db push
npm run db:seed      # creates local test accounts from .env (SEED_EMAIL, SEED_PASSWORD)
```

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Prisma 6 (SQLite locally), jose, bcryptjs
- Lucide icons

## Run locally

```bash
npm install
npm run dev -- -p 3010
```

Open http://localhost:3010/en or http://localhost:3010/it

## Project structure

```
src/
  app/[lang]/          website and app demo routes (en, it)
  app/api/demo/        demo request endpoint
  components/site/     website sections
  components/app/      app demo
  content/site.ts      all website text in English and Italian
  content/demo.ts      sample data for the app demo
BRIEF.md               project brief and roadmap
```

## Roadmap

- Real backend: authentication, database, client records
- Real AI transcription and plan generation
- Stripe billing with EU payment methods
- Client mobile app for check-ins
