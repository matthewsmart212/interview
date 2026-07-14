# Interview Coach AI (Get the Job)

A mobile-first **mock interview prep** app. Core loop:

**Upload CV → add interview (+ JD) → do mock → get feedback → improve.**

Built with Next.js App Router, local-first data, Supabase auth/sync, OpenAI, and Inworld TTS.

## Getting started

```bash
cp .env.example .env.local   # then fill keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Backend setup: **[docs/SETUP.md](docs/SETUP.md)**.

## Product scope

| Keep | Gone |
|------|------|
| One permanent CV (upload/replace) | CV tailoring / versions / history |
| Multiple interviews with JDs | “Improve my CV” / match % badges |
| Mock flow + STAR feedback | Standalone CV hub in nav |
| Scores & history per interview | JD-only mock mode / tailored CV mode |
| Progress over time | |

## Stack

- **Auth:** Supabase (magic link + Google)
- **Data:** localStorage first, sync when signed in
- **AI:** OpenAI `gpt-4.1-mini`
- **TTS:** Inworld AI
- **CV:** single PDF/DOCX via `/api/cv/parse`

## Main routes

| Route | Screen |
|-------|--------|
| `/` | Welcome |
| `/onboarding` | Name → goal → CV → interview → JD → done |
| `/home` | Interviews + start mock |
| `/interviews` | Interview list / detail / JD |
| `/mock` | Generic practice **or** upcoming interview |
| `/interview` | Live mock loop |
| `/progress` / `/history` | Scores over time |
| `/profile` | Replace CV, sync, reset |
| `/login` | Auth |

## Structure

- `app/` – routes + API
- `lib/db/` – local data layer (single CV, interviews, mocks)
- `lib/supabase/` – clients + sync
- `lib/ai/` – OpenAI + Inworld
- `lib/config/product.js` – mock length / model
- `supabase/migrations/` – `001_init.sql` then `002_mock_prep_focus.sql`
