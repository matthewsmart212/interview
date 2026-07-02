# Interview Coach AI

A mobile-first front-end for an AI interview-prep app that offers mock interviews,
CV generation/optimisation, and instant AI feedback. Built with **Next.js (App Router)**.
This is **front-end only** — there is no backend logic yet (all data is mocked).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The UI is designed mobile-first;
on wider screens it is centered inside a phone frame.

## Screens / routes

| Route                          | Screen                                            |
| ------------------------------ | ------------------------------------------------- |
| `/`                            | Welcome / onboarding                              |
| `/setup`                       | "Let's get you ready" interview setup form        |
| `/home`                        | Home dashboard                                    |
| `/cv`                          | Improve My CV (match score + suggestions)         |
| `/interview`                   | AI mock interview loop (question → answer × 5)    |
| `/interview/analyzing`         | Animated analysis of all answers (auto-advances)  |
| `/interview/feedback`          | Overall AI feedback (score, per-question breakdown) |
| `/interview/feedback/detailed` | Per-question feedback (Q1–Q5 selector + Feedback / Transcript / Better Answer tabs) |
| `/questions`                   | Interview questions (filterable + bookmark)       |
| `/progress`                    | Progress stats, score-over-time chart, top skills |
| `/profile`                     | Profile & settings                                |

## Image assets

The AI coach avatar and interview background are loaded from `public/`:

- **Avatars** – `public/avatars/*.png` (see `public/avatars/README.md` for the exact
  filenames and which pose is used on each screen). Rendered via the `Avatar`
  component (`components/Avatar.js`).
- **Background** – `public/backgrounds/room.png`, shown behind the avatar on the
  interview screens (see `public/backgrounds/README.md`).

Every avatar/background gracefully falls back to a placeholder (labelled box or a
solid colour) if the file is missing, so the UI always renders. Add the PNGs at the
documented paths and they appear automatically — no code changes required.

Standard UI icons (chevrons, checks, mic, bookmark, nav, etc.) are implemented as
inline SVGs in `components/Icons.js`.

## Structure

- `app/` – routes (one folder per screen) with co-located CSS modules
- `app/globals.css` – design tokens (colours, radius, shadows) and shared UI classes
- `components/` – reusable UI (`Phone`, `TopBar`, `BottomNav`, `CircularProgress`, `Waveform`, `Placeholder`, `Icons`)
