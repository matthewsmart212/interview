# Interview Coach AI

A mobile-first AI interview-prep app (Next.js App Router) with local-first data,
Supabase auth/sync, OpenAI coaching brain, and Inworld TTS.

## Getting started

```bash
cp .env.example .env.local   # then fill keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Backend / auth / AI setup: see **[docs/SETUP.md](docs/SETUP.md)**.

## Stack

- **Auth:** Supabase (email magic link + Google)
- **Data:** localStorage first, sync to Supabase when signed in
- **AI:** OpenAI `gpt-4.1-mini` (CV, JD, questions, feedback)
- **TTS:** Inworld AI
- **CV upload:** PDF + DOCX via `/api/cv/parse`

## Screens / routes

| Route                          | Screen                                            |
| ------------------------------ | ------------------------------------------------- |
| `/`                            | Welcome                                           |
| `/login`                       | Magic link + Google sign-in                       |
| `/onboarding`                  | Fresh-user onboarding (+ seed/skip for dev)       |
| `/home`                        | Home dashboard                                    |
| `/cv`                          | CV hub                                            |
| `/cv/upload`                   | PDF/DOCX upload + AI score                        |
| `/mock`                        | Mock interview setup (~8–10 min / 5 questions)    |
| `/interview`                   | Live mock loop                                    |
| `/interview/feedback`          | Overall AI feedback                               |
| `/questions`                   | Interview questions                               |
| `/progress`                    | Progress stats                                    |
| `/profile`                     | Profile, sync, logout                             |

## Structure

- `app/` – routes + API
- `lib/db/` – local data layer
- `lib/supabase/` – clients + sync
- `lib/ai/` – OpenAI + Inworld helpers
- `lib/config/product.js` – mock length, model defaults
- `supabase/migrations/` – SQL schema
