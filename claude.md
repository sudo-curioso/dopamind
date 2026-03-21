# CLAUDE.md — ClarifyMind Project Intelligence

> This file is the single source of truth for Claude Code working on ClarifyMind.
> Read this file completely at the start of every session before writing a single line of code.

---

## 1. What Is This Project

**ClarifyMind** is a gamified ADHD productivity SaaS app with modern and sleek UI design for adults.
Core mechanic: complete a task with a focus timer → grow a virtual tree → build a virtual isometric forest.
Inspired by Forest app, Habitica, and CBT-based ADHD research.

**Owner:** Sahil (Pune, India)
**Skill level:** Learning to code, needs step-by-step guidance
**Style preference:** Direct, no fluff, brutally honest, implementation-ready

---

## 2. Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Database | Supabase (PostgreSQL, Frankfurt EU) |
| Auth | Supabase Auth (email/password) |
| AI | Groq API — model: `llama-3.1-8b-instant` |
| Forest renderer | PixiJS 7.4.2 (WebGL, loaded client-side via dynamic import) |
| Animation | Framer Motion |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Runtime | Node.js, npm |
| Editor | VS Code, Windows |

**Dev command:**
```bash
cd C:\Users\SAHIL\clarifymind\apps\web && npm run dev
```
**Local URL:** http://localhost:3000

---

## 3. Project File Structure

```
C:\Users\SAHIL\clarifymind\apps\web\
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── survey/
│   │   │       ├── 1/page.tsx        ← 5 questions
│   │   │       └── 2/page.tsx        ← 5 questions
│   │   ├── (dashboard)/
│   │   │   ├── tasks/page.tsx        ← MAIN feature, 6 sub-tabs
│   │   │   ├── planner/page.tsx      ← AI Daily Planner (PRO)
│   │   │   ├── bodydouble/page.tsx   ← Body Doubling rooms (PRO)
│   │   │   └── myworld/page.tsx      ← Virtual forest (PRO)
│   │   ├── (marketing)/
│   │   │   ├── page.tsx              ← Landing page
│   │   │   ├── pricing/page.tsx
│   │   │   ├── upgrade/page.tsx
│   │   │   └── blog/
│   │   │       ├── page.tsx
│   │   │       └── [id]/page.tsx
│   │   ├── api/
│   │   │   ├── ai/route.ts           ← Groq: task breakdown only
│   │   │   ├── planner/route.ts      ← Groq: day planning schedule
│   │   │   ├── streak/route.ts       ← Update daily streak
│   │   │   └── tree/route.ts         ← Save tree to forest_trees
│   │   ├── layout.tsx                ← Wraps everything in TimerProvider
│   │   └── globals.css
│   ├── components/
│   │   ├── layouts/
│   │   │   └── navbar.tsx            ← Fixed top nav, streak icon, flying tree animation
│   │   └── ui/
│   │       ├── growing-tree.tsx      ← SVG animated growing tree (Framer Motion)
│   │       └── pixi-forest.tsx       ← PixiJS 7 isometric forest engine
│   ├── context/
│   │   └── timer-context.tsx         ← Global timer state, flying trees, streak
│   └── lib/
│       └── supabase/
│           ├── client.ts             ← Browser client
│           └── server.ts             ← Server-side client
├── CLAUDE.md                         ← This file
├── .env.local                        ← Never commit this
└── package.json
```

---

## 4. Environment Variables (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENV=development
```

---

## 5. Database Schema (Supabase)

```sql
-- Core user record
users (
  id uuid PRIMARY KEY,
  plan text DEFAULT 'free',         -- 'free' | 'pro'
  trial_ends_at timestamptz,        -- set to created_at + 14 days on signup
  created_at timestamptz,
  consent_version text              -- stores survey answers as JSON
)

-- Tasks
tasks (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  title text,
  bucket text,                      -- 'today' | 'week' | 'later' | 'trash'
  status text,                      -- 'pending' | 'in_progress' | 'done'
  priority int,                     -- 1=Urgent, 2=Medium, 3=Low
  steps jsonb,                      -- [{text: string, done: boolean}]
  created_at timestamptz,
  completed_at timestamptz
)

-- Virtual forest trees
forest_trees (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  task_id uuid REFERENCES tasks,
  tree_type text,                   -- 'sprout'|'baby'|'half'|'flowering'|'large'|'full'|'dead'
  status text,                      -- 'alive' | 'dead'
  timer_duration int,               -- minutes
  grown_at timestamptz,
  died_at timestamptz
)

-- Gamification streaks
user_streaks (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  current_streak int DEFAULT 0,
  longest_streak int DEFAULT 0,
  last_active_date date,
  total_trees_grown int DEFAULT 0,
  total_trees_lost int DEFAULT 0,
  forest_acres float DEFAULT 0
)

-- Leaderboard
leaderboard (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  display_name text,
  current_streak int,
  forest_size float,
  total_trees int,
  rank int,
  updated_at timestamptz
)

-- Daily reflection
daily_reflections (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  energy_level int,                 -- 1-5
  mood_level int,                   -- 1-5
  notes text,
  plan_date date
)

-- Focus sessions
focus_sessions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  task_id uuid,
  duration_s int,
  completed boolean
)
```

---

## 6. Timer → Tree Type Mapping

| Duration | Tree Type | Visual |
|---|---|---|
| 5 min | sprout | Single cone, small |
| 15 min | baby | 2-layer round |
| 25 min | half | 3-layer round |
| 30 min | flowering | Pink blossom |
| 45 min | large | Tall pine, 6 layers |
| 60 min | full | Grand lush, 6 blobs + flowers |
| abandoned | dead | Grey bare trunk |

---

## 7. Trial + Access Logic

**Standard pattern — use in every PRO page:**

```typescript
const { data: userData } = await sb.from('users')
  .select('plan, trial_ends_at, created_at')
  .eq('id', user.id).single()

const trialEnd = userData?.trial_ends_at
  ? new Date(userData.trial_ends_at)
  : new Date(new Date(userData?.created_at || user.created_at).getTime() + 14 * 864e5)

const hasAccess = userData?.plan === 'pro' || trialEnd > new Date()
const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 864e5))
```

**Rules:**
- All 3 PRO features free for 14 days from `created_at`
- After trial: show upgrade paywall on PRO pages
- `plan === 'pro'` = unlimited access
- Never gate access without checking both conditions

---

## 8. PRO Features

| Feature | Route | Status |
|---|---|---|
| AI Daily Planner | `/planner` | ✅ Built + working |
| Body Doubling | `/bodydouble` | ✅ Built, needs testing |
| My World (Forest) | `/myworld` | ✅ Built + working |

All show PRO badge in navbar. All have 14-day trial paywall.

---

## 9. Key Components

### `timer-context.tsx`
Global state. Provides:
- `activeTimers` — all running/completed timers
- `flyingTrees` — animation state (tree flies to streak icon on completion)
- `globalStreak` — shown in navbar
- Functions: `startTimer`, `pauseTimer`, `resetTimer`, `killTimer`, `clearTimer`, `triggerFlyingTree`, `setGlobalStreak`

**Always use `useTimer()` for timer state. Never manage timer state locally.**

### `pixi-forest.tsx`
- PixiJS 7.4.2 WebGL renderer
- Client-side only: loaded via `dynamic(() => import(...), { ssr: false })`
- Renders: sky gradient, sun, clouds, isometric grass tiles, soil walls, trees, ambient fx
- Trees sorted back-to-front (painter's algorithm)
- Whole world floats as one unit (sin wave)
- Tree types: sprout, baby, half, flowering, large (pine), full (lush), dead

### `growing-tree.tsx`
- SVG animated tree (NOT PixiJS)
- Used in task cards, progress tab, add tab
- Props: `progress` (0-1), `size`, `isDead`, `isWilting`, `durationMinutes`

### `navbar.tsx`
- Fixed top, blur backdrop
- Links: Tasks | ✦ AI Planner PRO | ◉ Body Double PRO | 🌳 My World PRO
- Running timer green pill
- Streak counter (🌳 X 🔥) → clicks to `/myworld`
- Flying tree animation: tree flies from task card to streak icon on completion
- Trial days badge
- Sign out

---

## 10. API Routes

### `/api/ai` — Task breakdown only
```typescript
// Input
{ prompt: string }  // or { taskTitle: string } — legacy

// Output
{ content: [{ type: 'text', text: string }] }
// text = JSON array of steps: ["step 1", "step 2", ...]
```

### `/api/planner` — Day planning
```typescript
// Input
{ prompt: string }  // full ADHD coach prompt

// Output
{ content: [{ type: 'text', text: string }] }
// text = DayPlan JSON: { greeting, energy_assessment, focus_window, daily_intention, warning, schedule[] }
```

### `/api/streak` — POST only
Updates `user_streaks` for current user. No body needed.

### `/api/tree` — POST only
```typescript
// Input
{
  task_id: string,
  timer_duration: number,  // minutes
  status: 'alive' | 'dead'
}
```

---

## 11. Design System

### Colors
```
Primary green:    #16A34A  (buttons, active states)
Dark green:       #15803D  (gradient end, hover)
Purple:           #7C3AED  (PRO badges, AI features)
Blue:             #2563EB  (AI planner accent)
Background:       #FFFFFF  (page)
Card background:  #F8FAFC
Card border:      #F1F5F9
Text primary:     #1E293B
Text secondary:   #64748B
Text muted:       #94A3B8
Danger:           #EF4444
Warning:          #F59E0B
```

### Spacing & Shape
```
Card radius:      rounded-2xl  (16px)
Button radius:    rounded-xl   (12px)
Pill radius:      rounded-full
Card padding:     p-4 (16px)
Section gap:      space-y-4 or gap-3
Page padding:     px-4 py-6
Max width:        max-w-2xl mx-auto
```

### Typography
```
Headings:   text-2xl font-bold tracking-tight
Body:       text-sm
Muted:      text-xs text-slate-400
Label:      text-xs font-semibold uppercase tracking-wider
```

### Component Patterns
```typescript
// Standard card
<div className="rounded-2xl p-4" style={{ background:'#F8FAFC', border:'1px solid #F1F5F9' }}>

// Primary button
<button className="px-4 py-2.5 rounded-xl text-sm font-bold text-white"
  style={{ background:'linear-gradient(135deg,#16A34A,#15803D)' }}>

// PRO badge
<span className="text-white font-bold rounded-md px-2 py-0.5"
  style={{ fontSize:'8px', background:'linear-gradient(135deg,#7C3AED,#2563EB)' }}>
  PRO
</span>

// Tab bar (shared pattern across all pages)
<div className="flex gap-1 p-1 rounded-2xl" style={{ background:'#F1F5F9' }}>
  <button style={{ background: active ? '#fff' : 'transparent', color: active ? '#7C3AED' : '#94A3B8' }}>
```

---

## 12. Coding Rules

### Always
- `'use client'` at top of every React component file
- Get user with `supabase.auth.getUser()` — never hardcode IDs
- Handle loading states and error states in every UI
- Use `useTimer()` from `@/context/timer-context` for timer state
- Import Supabase: `@/lib/supabase/client` (browser) or `@/lib/supabase/server` (server)
- Use Framer Motion for animations — only animate `transform` and `opacity`, always use forest app for UI and UX as insperation   
- Keep all AI prompts in the API routes, not in the frontend

### Never
- `transition-all` — always specify the property
- Hardcode user IDs or API keys in component code
- Use default Tailwind blue/indigo as primary color
- Store secrets outside `.env.local`
- `git commit .env.local`
- Create duplicate API routes or components without checking existing ones first
- Use `em dashes (—)` in UI copy

### Supabase Query Pattern
```typescript
const sb = createClient()
const { data: { user } } = await sb.auth.getUser()
if (!user) { router.push('/login'); return }
// then query...
```

---

## 13. WAT Framework (How to Operate)

This project follows the **WAT framework** — Workflows, Agents, Tools.

**As Claude Code, your role is:**

1. **Read before writing** — Check existing files before creating anything new. Never duplicate.
2. **One task at a time** — Complete each task fully before moving to the next.
3. **Fix → Verify → Move on** — When there's an error: read the full trace, fix it, confirm it works, then proceed.
4. **Ask before destructive actions** — Never overwrite working code without confirming.
5. **Validate assumptions** — If a DB column might not exist, check. If an import might be wrong, check.
6. **Be specific about errors** — State exactly which file, line, and what the error means.
7. **Self-improvement loop:**
   - Error found → Fix → Test → Document → Move on

**Sahil's preferences:**
- Step-by-step instructions, one file at a time
- Full file contents (Ctrl+A paste approach), not partial diffs
- Screenshots help — share them when something looks wrong
- Direct feedback, no motivational filler language

---

## 14. Frontend Design Rules

*(From frontend-design skill — apply every session)*

Before writing any frontend code:
1. Understand the purpose and user context
2. Commit to a clear aesthetic direction
3. Execute with precision and intentionality

**Anti-generic guardrails:**
- Never use default Tailwind blue/indigo as primary
- Shadows: use layered, color-tinted, low opacity — never flat `shadow-md`
- Animations: spring-style easing, only `transform` and `opacity`
- Every interactive element needs hover, focus-visible, active states
- Spacing must be intentional and consistent — not random Tailwind steps
- Surfaces need layering: base → elevated → floating

**ClarifyMind aesthetic:**
- Soft, organic, modern, sleek, nature-themed
- Green as the dominant brand color
- Cards feel like they float above the surface
- ADHD-friendly: clear visual hierarchy, low cognitive load
- Premium but not corporate — friendly and encouraging tone

---

## 15. What Is Built (Current State)

### ✅ Complete and Working
- Auth: signup, login, forgot password, email confirmation (disabled on free plan)
- Onboarding: 2-page survey (10 questions)
- Navbar: all links, PRO badges, timer pill, streak icon, flying tree animation
- Tasks page: 6 tabs (Today/Add/Progress/Search/Focus/Reflect)
  - Timer with presets (5/15/25/45/60m) + custom timer modal
  - Growing SVG tree per task
  - AI task breakdown (✦ AI button)
  - Step checklist with toggle
  - Cheer overlay on completion
  - Task vanish animation
  - Flying tree to navbar streak icon
- AI Planner: energy/mood input, Groq schedule generation, Active Mode with circular timer
- My World: PixiJS forest, Stats tab (D/W/M chart), Leaderboard tab
- Timer Context: global state, flying trees, streaks
- API routes: ai, planner, streak, tree
- Landing page, pricing, blog (6 articles)
- Supabase: all tables created, trial_ends_at column added

### ❌ Not Built Yet (Priority Order)
1. **Razorpay payment integration** — pricing shows "coming soon"
2. **Resend SMTP** — email confirmation disabled (Supabase free = 2/hr)
3. **Deploy to Vercel** — still local only
4. **Privacy Policy + Terms of Service** — required before real users
5. **Settings page** — profile, notifications, account deletion
6. **Medication reminders UI** — table exists, no UI
7. **Push notifications / reminders**
8. **PWA manifest** — for mobile install
9. **Body Double rooms** — built but needs real testing
10. **Leaderboard** — needs real users to be meaningful

### ⚠️ Known Issues
- Email confirmation OFF (Supabase rate limit hit during dev)
- `trial_ends_at` not auto-set on new signups — needs Supabase trigger
- Body double feature needs end-to-end testing
- PixiJS tree renders are close to Forest app but not pixel-perfect
- Navbar avatar hardcoded as "S" — should use user's actual initial

---

## 16. Quick Reference: Common Tasks

### Add a new PRO page
1. Create `src/app/(dashboard)/newfeature/page.tsx`
2. Add `'use client'` at top
3. Copy access check pattern from Section 7
4. Add link to navbar.tsx navLinks array
5. Add PRO badge to the link

### Add a new API route
1. Create `src/app/api/newroute/route.ts`
2. Import `createClient` from `@/lib/supabase/server`
3. Always verify user auth first
4. Return `NextResponse.json()`

### Add a Supabase query
```typescript
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) return

const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', user.id)
```

### Trigger flying tree animation
```typescript
const { triggerFlyingTree } = useTimer()
const cardRef = useRef<HTMLDivElement>(null)

// On task complete:
const rect = cardRef.current?.getBoundingClientRect()
if (rect) {
  triggerFlyingTree({
    id: `${taskId}-${Date.now()}`,
    startX: rect.left + rect.width / 2,
    startY: rect.top + rect.height / 2,
    treeType: 'full',
  })
}
```

---

## 17. Session Start Checklist

At the start of every session:
- [ ] Read this file completely
- [ ] Check which files are relevant to the task
- [ ] Confirm dev server is running (`npm run dev`)
- [ ] Do not create files that already exist
- [ ] Apply frontend-design skill for any UI work
- [ ] Ask Sahil to share a screenshot if something looks wrong

---

*Last updated: March 21, 2026*
*Project: ClarifyMind ADHD SaaS — github.com/sudo-curioso/clarifymind*
