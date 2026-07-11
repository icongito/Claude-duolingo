# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

CodeQuest — a Duolingo-style gamified learning platform for developers (Next.js 15 App Router, React 19, TypeScript, Tailwind v4, Supabase + Drizzle ORM). Package manager is **pnpm**.

## Commands

```bash
pnpm dev                 # dev server on :3000
pnpm build               # production build (typecheck + lint included)
pnpm lint                # eslint (use --max-warnings=0; CI treats warnings as failures)
pnpm typecheck           # tsc --noEmit
pnpm test                # Vitest unit tests (src/**/*.test.ts)
npx vitest run src/lib/gamification/xp.test.ts   # single test file
pnpm test:e2e            # Playwright smoke tests (e2e/); starts dev server itself
pnpm db:generate         # drizzle-kit: generate migration from schema
pnpm db:migrate          # apply migrations (needs DATABASE_URL)
```

`pnpm build` requires `DATABASE_URL` to be set (any syntactically valid Postgres URL works for building; nothing connects at build time). In the remote/CI sandbox, Playwright must use the preinstalled browser: `executablePath: '/opt/pw-browsers/chromium'` — never run `playwright install`.

## Architecture

**Demo-mode-first data flow.** The entire app renders without any backend. Pages read from a typed demo-data layer in `src/lib/data/` (`demo-user.ts`, `demo-social.ts`, `demo-misc.ts`, `demo-admin.ts`, `map.ts`, `lessons.ts`). The Drizzle schema in `src/lib/db/schema/` (46 tables, mirrored shapes) is the eventual persistent backend; when wiring real data, keep the demo layer's exported types as the contract. All demo data must be **deterministic** (no `Math.random`) so server and client render identically.

**Route groups.**
- `src/app/page.tsx` + `src/components/marketing/` — public landing page.
- `src/app/(auth)/` — sign-in/up/forgot-password; server actions in `src/lib/auth/actions.ts` degrade gracefully when Supabase env vars are unset (they return an explanatory error instead of throwing).
- `src/app/(app)/` — the authenticated product (dashboard, learn map, lesson player, achievements, leaderboard, community, marketplace, notifications, settings, admin) wrapped by the sidebar/topbar shell in `src/app/(app)/layout.tsx`.
- Route protection lives in `src/middleware.ts` → `src/lib/supabase/middleware.ts`, which passes everything through when Supabase isn't configured (local preview).

**Gamification core** (`src/lib/gamification/`): `worlds.ts` defines the 25 worlds (the single source for world slugs/order/lesson counts), `achievements.ts` generates the 251-achievement catalog (tiered milestone generators + hand-written flavor achievements; every criterion is machine-checkable `{metric, operator, value}`), `xp.ts` holds the level curve. Unit tests in the same folders assert catalog invariants (unique slugs, ≥250 entries, reward scaling by tier) — run them after touching these files.

**Learning map → lesson pipeline.** `src/lib/data/map.ts` deterministically lays out each world's nodes (kind cadence: quiz every 5th, treasure every 6th, project third-from-last, boss last, one secret branch mid-world). Node IDs (`{worldSlug}-{index}`) are the join key: `/learn/[world]` renders them via `components/learn/world-map.tsx`, and `/lesson/[nodeId]` resolves content through `src/lib/data/lessons.ts` (`getLessonSession` falls back to a world-appropriate sample so every node is playable). The lesson player (`components/lesson/lesson-player.tsx`) dispatches on a discriminated union of step types — to add a lesson type, extend `LessonStep` in `lessons.ts`, add a `step-*.tsx` component, and register it in the player's `StepRenderer`.

**Design system.** Dark-mode-first tokens live in `src/app/globals.css` (`:root` is dark; `.light` is the opt-in override). Palette: bg `#0D0D0D`, card `#1F1F1F`, primary orange `#FF7A1A`, gold `#FFC857`. Fonts via CSS vars: `font-pixel` (Pixelify Sans) is reserved for headlines/level badges, `font-display` (Space Grotesk) for card titles, Sora for body. UI primitives in `src/components/ui/` are hand-written shadcn-style components tied to these tokens — extend those rather than adding a component library. Utility classes `glow-border`, `glow-border-strong`, `glass`, `text-gradient-orange` and the keyframes (`animate-node-pulse`, etc.) are defined in globals.css.

**Mascot.** The canonical mascot ("Little Guy") is a wide terracotta pixel creature with two square eyes, side arm nubs, and four legs. The in-app component is `src/components/mascot/little-guy.tsx` — a transparent-background 64x48 canvas engine with a parametric `guyCells()` rig and nine named animations (`<LittleGuy animation="lesson" size={220} />`); it freezes on a still frame under `prefers-reduced-motion`. `public/little-guy.html` is the standalone light/dark showcase of the same engine. Any mascot rendering must keep the four-leg silhouette and hard pixel edges (`image-rendering: pixelated`).

**AI Mentor.** `src/app/api/mentor/route.ts` calls the Claude API when `ANTHROPIC_API_KEY` is set and returns canned demo replies otherwise; the floating chat UI is `src/components/mentor/mentor-launcher.tsx`, mounted globally in the `(app)` layout.

**PWA / Play Store.** The app is an installable PWA: `src/app/manifest.ts`, hand-written `public/sw.js` (bump `CACHE_VERSION` when changing it), branded `public/offline.html`, icons generated by `node scripts/generate-icons.mjs`. Play Store packaging is TWA-based: `twa-manifest.json` + `public/.well-known/assetlinks.json`; the full launch runbook is `docs/LAUNCH.md`. Never commit `android.keystore`.

## Conventions

- Icons are `lucide-react` names stored as strings in data files and resolved through a local `WorldIcon`/`IconFor` helper — verify a name exists in the installed lucide version before adding it (several PascalCase brand icons like `Github`/`Twitter` do not).
- Respect `prefers-reduced-motion`: globals.css collapses animations globally; bespoke canvas/JS animations must implement their own fallback (see `public/little-guy.html`).
- Zod schemas for forms live next to their server actions (`src/lib/auth/schemas.ts` pattern); validate in the action, not just the client.
- `.env.example` documents all required env vars; never commit `.env.local` (gitignored, with `!.env.example` exception).
