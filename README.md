# CodeQuest

A Duolingo-style learning platform for developers — learn Claude Code, prompt
engineering, React, Git, and modern software engineering through gamified,
bite-sized lessons.

This repo is being built iteratively. See the status below for what's live
today and what's next.

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, React Query
- **Backend:** Supabase (Postgres + Auth), Drizzle ORM
- **Tooling:** ESLint, Prettier, Vitest, Playwright

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase + database credentials
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs without a
configured Supabase project (auth routes will simply be unauthenticated),
but the database layer requires `DATABASE_URL` to be set.

### Database

```bash
pnpm db:generate   # generate a migration from the Drizzle schema
pnpm db:migrate     # apply migrations
pnpm db:studio      # browse the database
```

The schema lives in `src/lib/db/schema/` — 46 tables covering users,
worlds/lessons/nodes, XP & currency ledger, achievements & badges, social
(friends/guilds/messages), projects/boss battles/challenges, marketplace &
subscriptions, and admin/analytics.

## Project status

- [x] Project scaffold (Next.js 15, TypeScript, Tailwind, tooling)
- [x] Design system (dark-mode CodeQuest theme, pixel-art mascot, UI primitives)
- [x] Database schema (Drizzle, 46 tables)
- [x] Gamification data (25 worlds, 251 achievements, XP/level curve)
- [x] Landing page
- [x] Auth pages & Supabase wiring (email/password, magic link, OAuth, reset)
- [x] App shell + dashboard (stats, streak, heatmap, weekly chart, daily challenge)
- [x] Learning map (worlds overview + winding node maps with secrets & bosses)
- [x] Lesson player (multiple choice, fill-blank, typing, matching, flashcards, sorting, Monaco code)
- [x] Achievements gallery, leaderboard, profile
- [x] Community (feed/friends/guilds), marketplace, notifications, settings
- [x] AI Mentor (floating chat, Claude-backed via `ANTHROPIC_API_KEY`, demo fallback)
- [x] Admin dashboard (KPIs, DAU chart, content/users/moderation)
- [x] Tests (Vitest unit suites + Playwright smoke specs)

The app runs in **demo mode** without any configuration: all app surfaces
render from a typed demo-data layer (`src/lib/data/`). Connecting a real
Supabase project (`.env.local`) enables live auth; the Drizzle schema and
migrations are ready for persisting real progress.

Run tests with `pnpm test` (unit) and `pnpm test:e2e` (Playwright).

## Design system

Dark-mode-first, orange/gold accent palette (`#0D0D0D` / `#FF7A1A` /
`#FFC857`), a chunky pixel display face (Pixelify Sans) reserved for
headlines and level badges, and Sora/Space Grotesk for body and UI text.
Tokens live in `src/app/globals.css`.
