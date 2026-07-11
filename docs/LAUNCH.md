# Launching CodeQuest — Web + Google Play

CodeQuest ships to both targets from one codebase: the web app deploys to
Vercel, and the Play Store build wraps the same deployed site in a Trusted
Web Activity (TWA). Nothing is forked; the Android app **is** the web app.

## 0. Prerequisites

- A production domain (examples below use `codequest.dev`; replace with yours).
- A [Vercel](https://vercel.com) account (or any Node host) for the web app.
- A [Google Play Console](https://play.google.com/console) developer account
  ($25 one-time).
- Node 20+ and a JDK 17+ locally for Bubblewrap.

## 1. Deploy the web app

1. Import the repo into Vercel (framework preset: Next.js, package manager pnpm).
2. Set environment variables (all documented in `.env.example`):
   - `DATABASE_URL` — Supabase Postgres pooling URL (required to build).
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — enables real auth.
   - `NEXT_PUBLIC_SITE_URL` — `https://codequest.dev` (feeds metadata + auth redirects).
   - `ANTHROPIC_API_KEY` — enables the live AI Mentor (optional; demo replies otherwise).
3. Apply the database migration once: `pnpm db:migrate` against the production `DATABASE_URL`.
4. Point your domain at the Vercel project and confirm:
   - `https://codequest.dev/manifest.webmanifest` returns the manifest.
   - `https://codequest.dev/sw.js` returns the service worker.
   - Chrome DevTools → Application → Manifest shows "Installable".

The service worker precaches the offline page; airplane-mode navigation
should show the branded offline screen, not a browser error.

## 2. Package for Google Play (TWA via Bubblewrap)

The repo already contains `twa-manifest.json` (Bubblewrap config, package id
`dev.codequest.app`) and `public/.well-known/assetlinks.json` (digital asset
links). Steps:

```bash
npm i -g @bubblewrap/cli
bubblewrap build            # reads ./twa-manifest.json; creates keystore on first run
```

- First run generates `android.keystore` — **back it up and never commit it**
  (it's gitignored). Losing it means losing the ability to update the app.
- Output: `app-release-bundle.aab` (upload this) and an `.apk` for local testing.

Update `twa-manifest.json` host/URLs if your domain differs.

## 3. Digital Asset Links (removes the browser bar)

1. In Play Console → your app → Setup → App signing, copy the
   **SHA-256 certificate fingerprint** (use the *App signing key* one, since
   Play re-signs your bundle).
2. Replace `REPLACE_WITH_PLAY_APP_SIGNING_SHA256_FINGERPRINT` in
   `public/.well-known/assetlinks.json` and redeploy the web app.
3. Verify: `https://codequest.dev/.well-known/assetlinks.json` serves the
   file, then use Google's
   [Statement List Tester](https://developers.google.com/digital-asset-links/tools/generator).

Until this matches, the Android app shows a Chrome Custom Tab URL bar; once
it matches, it's indistinguishable from a native app.

## 4. Play Console submission

1. Create the app (`dev.codequest.app`, App category: Education).
2. Upload `app-release-bundle.aab` to an internal testing track first.
3. Store listing assets:
   - Icon: `public/icons/icon-512.png`.
   - Feature graphic (1024×500) and phone screenshots — capture from the
     deployed site at 1080×2340 (dashboard, learning map, lesson player,
     achievements make the best shots).
4. Complete Data safety (the app stores account email + learning progress;
   no data sold) and Content rating questionnaires.
5. Promote internal → production when review passes.

## 5. Simultaneous launch checklist

- [ ] Web deploy green on the production domain (manifest + sw + assetlinks all 200).
- [ ] Database migrated; Supabase auth providers (Google/GitHub/Discord) configured with production redirect URLs.
- [ ] `assetlinks.json` fingerprint matches Play App Signing.
- [ ] AAB uploaded and approved on the production track.
- [ ] Release notes written for both (web changelog + Play "What's new").
- [ ] Flip the Play release live — web is already live; the launch is simultaneous by construction.

## Versioning updates

Web updates ship on every deploy; TWA users get them instantly (it's the live
site). Only bump `appVersionCode`/`appVersionName` in `twa-manifest.json` and
re-run `bubblewrap build`/`bubblewrap update` when the Android wrapper itself
changes (icons, package id, shortcuts, Android-level permissions).
