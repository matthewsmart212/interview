# Backend setup (Supabase + OpenAI + Inworld)

Keys live in `.env.local` (gitignored). Copy from `.env.example`.

## 1. Run the database migration

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/qxybmhzwnykahvtuvmkq/sql/new)
2. Paste and run `supabase/migrations/001_init.sql`
3. Confirm tables: `profiles`, `master_cvs`, `cv_history`, `interviews`, `tailored_cvs`, `mock_sessions`, `saved_questions`
4. Confirm storage bucket `cvs` exists (created by the migration)

## 2. Auth — magic link + Google

### Site URL
Supabase → **Authentication → URL Configuration**

- Site URL: your stable Vercel production URL (or `http://localhost:3000` for now)
- Redirect URLs (add all):
  - `http://localhost:3000/**`
  - `http://localhost:3000/auth/callback`
  - `https://*-matthew-smarts-projects-821a4e01.vercel.app/**`

### Email magic link
Supabase → **Authentication → Providers → Email**

- Enable Email
- Enable magic link / OTP email (no password required for this app)

### Google
1. Google Cloud Console → create OAuth client (Web)
2. Authorized redirect URI: `https://qxybmhzwnykahvtuvmkq.supabase.co/auth/v1/callback`
3. Supabase → **Authentication → Providers → Google** → paste Client ID + Secret

## 3. Environment variables

Already filled in `.env.local` for local cloud-agent use:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qxybmhzwnykahvtuvmkq.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser / SSR anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — never expose to client |
| `OPENAI_API_KEY` | CV parse, JD, questions, feedback (`gpt-4.1-mini`) |
| `INWORLD_API_KEY` | TTS Basic credential |
| `INWORLD_VOICE_ID` | Default `Sarah` |

**Security:** You pasted the service role + OpenAI keys in chat. Rotate them in Supabase/OpenAI after setup if this chat is shared.

## 4. Product defaults

See `lib/config/product.js`:

- Mock length: **5 questions ≈ 8–10 minutes**
- AI model: **gpt-4.1-mini** (speed/cost)
- Coach: unnamed (first-person voice)

## 5. API routes

| Route | Role |
|---|---|
| `POST /api/cv/parse` | PDF/DOCX extract + OpenAI score |
| `POST /api/ai/analyse-jd` | JD → structured signals |
| `POST /api/ai/generate-questions` | Mock question set |
| `POST /api/ai/feedback` | Post-mock feedback |
| `POST /api/tts` | Inworld TTS → MP3 |
| `GET /auth/callback` | OAuth / magic-link exchange |

## 6. Fresh users vs seed

- New installs hydrate **empty** local state
- Onboarding welcome has **Seed demo data & skip to dashboard** for Matthew
- Profile → Reset to demo / Clear all data

## 7. Local ↔ cloud

While signed in, Profile → **Sync with cloud** pushes/pulls via `lib/supabase/sync.ts`. Screens stay local-first.

## Still deferred

- Live mock interview still uses local/hardcoded questions until generate-questions + TTS are wired into `/interview`
- Payments / Stripe
- Google OAuth will fail until provider is configured in the dashboard
