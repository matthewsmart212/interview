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
| `/interview`                   | AI mock interview – question                      |
| `/interview/your-turn`         | Your turn – listening/recording                   |
| `/interview/analyzing`         | Analyzing answer (auto-advances to feedback)      |
| `/interview/feedback`          | AI feedback summary                               |
| `/interview/feedback/detailed` | Detailed feedback (Feedback / Transcript / Better Answer tabs) |
| `/questions`                   | Interview questions (filterable + bookmark)       |
| `/progress`                    | Progress stats, score-over-time chart, top skills |
| `/profile`                     | Profile & settings                                |

## Placeholder assets

Brand assets that were not provided are rendered with a `Placeholder` component
(`components/Placeholder.js`) showing a labelled box. Replace these with real images:

- **Avatar** – the AI coach avatar (welcome screen + interview screens)
- **Backgrounds** – the blurred interview background behind the avatar
- **Profile picture** – on the profile screen

Standard UI icons (chevrons, checks, mic, bookmark, nav, etc.) are implemented as
inline SVGs in `components/Icons.js`.

## Structure

- `app/` – routes (one folder per screen) with co-located CSS modules
- `app/globals.css` – design tokens (colours, radius, shadows) and shared UI classes
- `components/` – reusable UI (`Phone`, `TopBar`, `BottomNav`, `CircularProgress`, `Waveform`, `Placeholder`, `Icons`)
