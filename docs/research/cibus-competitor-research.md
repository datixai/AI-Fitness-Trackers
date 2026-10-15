# Cibus competitor research

Researched 15 Oct 2026 from public sources only: cibushealth.com (features, Cibus AI, help centre, changelog, security page, DPA Annex B) and the Cibus YouTube channel (23 tutorials; captions of 6 key videos read). The Cibus app itself sits behind a login and was not accessed.

## 1. Company

- Cibus is a brand of TP53 S.r.l., Ferrara, Italy. Founder in the videos: Matteo.
- Claims 500+ professionals, mostly in Italy. Small YouTube channel (74 subscribers, 23 videos, all recent), so they are early and growing.
- Ships fast: a public changelog with weekly releases since June 2026.

## 2. AI models and providers (from their DPA, Annex B)

| Job | Provider | Notes |
|---|---|---|
| AI assistant, meal plan generation, document analysis | **Anthropic (Claude)** via API | Patient identifiers are masked before sending. API data is not used for training. |
| Voice transcription of visits | **Deepgram** | Receives audio and transcript. Works in studio (mic) or online (screen share with audio). |
| App hosting, compute, file storage | Vercel (Frankfurt), Vercel Blob | Next.js style stack |
| Database | Neon PostgreSQL (Frankfurt) | |
| PDF generation | Gotenberg on Railway (Amsterdam) | HTML to PDF engine |
| DOCX to PDF (optional) | Aspose Cloud | |
| Backups | Cloudflare R2 (Western Europe), run by GitHub Actions | 7 day retention |
| SMS (reminders, OTP) | Twilio | |
| Email | Resend | |
| Calendar sync | Google Calendar API | |
| Payments | Stripe (IE), GoCardless SEPA (FR), PayPal (LU) | |
| Analytics | Vercel Analytics | |

Not used in production (they say so explicitly): Supabase, Upstash.

**What "Cibus AI" really is:** not their own model. It is Claude, connected to a curated library of Italian nutrition sources (LARN, SINU guidelines, CREA food tables, clinical literature, plus veterinary sources), and given a per-professional "memory" of preferences and corrections. Technically this is retrieval (RAG) plus stored preferences plus tool calls that write into the patient record. The marketing presents it as a specialised model.

Security facts they publish: TLS, bcrypt passwords, AES-256-GCM for Italian health-system (Sistema TS) credentials, role based access (nutritionist, secretary, accountant, patient, admin) with multi-tenant isolation, audit log with IP and user agent, single-use expiring export links, no field-level encryption of health data, no ISO certification, no DPO.

## 3. Product map (the "admin side" a professional sees)

Left menu: Home, Calendar, Patients, Invoices, Foods and recipes, Equivalents, Templates.

Patient record tabs: Information (anamnesis), Measurements, Planning, Meals, Recommendations, Documents.

- **Anamnesis + AI transcription.** The professional designs their own anamnesis form (sections, fields, colours, separate first visit and follow-up versions). Pressing "Transcribe" records the visit; the AI fills the form from the conversation. Modes: in studio, or online (share the screen with audio so both voices are captured). Output options: quick, or with review. Transcripts are always recoverable.
- **AI visit report.** A PDF for the patient or other doctors. Template editor: title, signature, design, sections (default: summary, reason for visit, history, measurements, clinical observations, action plan), each section filled as prose or bullet points with a custom AI instruction.
- **Measurements.** Three ways in: from the transcript, by hand, or by uploading a PDF/photo (BIA report, hospital blood tests) to the AI chat, which extracts every value and can even create the patient. Detail and overview views, charts over time, BIA formulas (resistance, reactance), min/max goals, measurement report PDF with 8 templates.
- **Planning.** A manual calculator (BMR and daily needs formulas, target). Optional: if the AI prompt gives no numbers, the AI takes calories and macro split from here.
- **Meals (meal plan).** Built mainly with the AI chat, e.g. "create a 7 day plan, different each day, five meals". The AI already knows the anamnesis, BIA and blood tests. Classic view and drag-and-drop view, alternatives, main food, food groups, multi-week plans, editable recipes inside the plan.
- **Recommendations.** Advice text for the patient, with reusable templates.
- **PDF delivery.** Word-like PDF editor with undo/redo, cover page, weekly table, templates per patient, send by email or web app, history.
- **Foods and recipes.** Food database plus the professional's own foods and recipes, which the AI can create; recipe books.
- **Calendar.** Day/week/month, online booking with screening and waiting list, reminders by email and WhatsApp, Google Calendar sync, video visits, session packages, a public mini website per professional.
- **Billing.** Italian e-invoice to SDI and Sistema TS automatically, INPS contribution for dietitians, flexible invoicing.
- **Privacy documents.** Privacy notice and engagement letter signed by OTP.
- **Patient app.** Plan, measurements, appointments, chat, progressive content, questionnaires before visits, food diary, notifications.
- **Other modules.** Sports clubs and teams (skinfolds, team management), Cibus Vet (dogs, cats, horses, exotic), catering, AI import of patients from Word/PDF/Excel, data migration from other software, Academy, marketplace.

## 4. How we build the same in Fisicora

Same proven pattern, adjusted for coaches as well as nutritionists:

| Capability | Recommended for Fisicora |
|---|---|
| AI brain | Anthropic Claude API: Sonnet 5.5 (`claude-sonnet-5-5`) for plans, summaries and chat; Haiku 5.5 (`claude-haiku-5-5`) for cheap extraction and classification; Opus 5.5 (`claude-opus-5-5`) only for hard cases. Use tool calls so the AI writes structured data (meals, macros, measurements) straight into the record. |
| Transcription | Deepgram streaming (Italian and English). EU-hosted alternative worth testing: Speechmatics. |
| Knowledge library (RAG) | Postgres with pgvector. Sources: LARN, SINU, CREA food tables for Italy; ISSN position stands and peer-reviewed sports nutrition and hypertrophy research for coaches. Show citations in answers. |
| Memory | Per-professional preference profile (formatting, tone, food choices, phase rules) saved after each correction and injected into prompts. |
| PDF and image extraction | Claude PDF and vision input with a strict JSON schema for BIA, blood tests, InBody slips, progress photos metadata. |
| Privacy | Mask names, contacts and IDs before any AI call; consent before recording; audit log; EU hosting. |
| Stack | Next.js (already in this repo) on Vercel Frankfurt, Neon Postgres Frankfurt, Vercel Blob or Cloudflare R2, Gotenberg for PDFs, Resend email, Twilio SMS/WhatsApp, Google Calendar API, Stripe + GoCardless, an SDI e-invoicing provider for Italy. |

### Where Fisicora can be different

1. **Physique coaching first-class:** diet phases (cut, offseason, diet break, reverse, peak week), weekly check-ins with photos, training splits with progression. Cibus is nutrition-only and has no training module.
2. **AI weekly check-in review:** summarise each client's week and flag issues automatically, which suits online coaches with many clients.
3. **Multi-language from day one** (Italian, English, then Spanish and German) for coaches across Europe.
4. **Transparent AI:** say plainly that it is Claude plus a cited library, and show the sources in every answer.

### Suggested build order

1. Auth, multi-tenant database, client records, anamnesis form builder.
2. Deepgram transcription into the anamnesis + Claude summary.
3. Meal plan generator with tool calls, food database, PDF export.
4. Measurements with PDF/photo extraction, charts.
5. Training module and weekly check-ins (client app or PWA).
6. Calendar, reminders, billing.
