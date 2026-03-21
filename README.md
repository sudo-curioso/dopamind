# ClarifyMind — ADHD Productivity SaaS

## Project Overview
Gamified ADHD productivity app. Complete tasks with a timer → grow a virtual tree → build a virtual forest.

## Stack
- Next.js 14 App Router
- Supabase (PostgreSQL, Frankfurt EU)
- Groq AI (llama-3.1-8b-instant)
- PixiJS 7.4.2 (isometric forest)
- Framer Motion
- Tailwind CSS
- TypeScript

## Dev Server
```bash
cd C:\Users\SAHIL\clarifymind\apps\web
npm run dev
```
Open http://localhost:3000

## Key Routes
- `/tasks` — Main task manager (Today/Add/Progress/Search/Focus/Reflect)
- `/planner` — AI Daily Planner (PRO)
- `/bodydouble` — Body Doubling rooms (PRO)
- `/myworld` — Virtual isometric forest (PRO)
- `/pricing` — Pricing page
- `/blog` — Blog

## Environment Variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Pricing
- Free forever
- Pro: $8.99/month
- Annual: $74.99/year (coming soon)

## Trial Logic
- All 3 PRO features free for 14 days after signup
- Checks `users.trial_ends_at` or falls back to `created_at + 14 days`
- After trial ends → upgrade popup

## PRO Features
1. AI Planner — energy/mood-based daily schedule
2. Body Double — silent presence focus rooms
3. My World — PixiJS isometric virtual forest