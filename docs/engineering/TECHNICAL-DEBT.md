# Technical debt

Known, deliberately-deferred engineering debt. Not live status (see `docs/AI-CONTROLLER.md` for that) and not a blocker list -- an agent picking up unrelated work does not need to read this file first. Add an entry here when you find real debt that has no other home, rather than leaving it to live only in a dated status narrative that will eventually be archived. Remove an entry once it's fixed or superseded, with a one-line note of what changed.

## Frontend bundle is a single large chunk

Confirmed 2026-09-14 (re-verified during the AI-first documentation migration; originally noted 2026-09-12): `npm run build` produces one `dist/assets/index-*.js` chunk of roughly 680-690 KB (gzip ~190 KB), and Vite's own build output warns about it. The whole application, including admin and dashboard code, ships to a first-time visitor reading the FAQ.

Fix direction: route-level code splitting (dynamic `import()` per route in `src/main.tsx`, or Vite's `rolldownOptions.output.codeSplitting`). Out of scope for the AI-first documentation/operations migration; track as its own product/engineering issue.

## `legalRoutesReadyForPublication` is dead scaffolding

Confirmed 2026-09-14 (re-verified; originally noted 2026-09-12): `src/lib/legal-routes.ts` exports `legalRoutesReadyForPublication = false`, built to gate legal-page publication. It is now read only by its own test (`src/lib/legal-routes.test.ts`) -- nothing in `src/main.tsx` or elsewhere reads it. `/privacy` is already live in production as a static `public/privacy.html` page with a Vercel rewrite, published outside this mechanism entirely. `/terms` and `/data-deletion` currently render placeholder content directly, also not gated by this flag.

This means the flag no longer reflects or controls reality for any of the three legal routes. Whoever next touches legal-page publication should decide whether to (a) wire the flag back up as a real gate for `/terms`/`/data-deletion`, or (b) remove it as dead code. Either way, do not assume it currently prevents anything from publishing.

## Local Persona QA recipe (useful, not written down elsewhere)

The seeded demo accounts in `supabase/seed.sql` are valid Persona QA credentials. To run the real persona suite offline instead of waiting on CI: `supabase start`, `supabase db reset`, then point `PLAYWRIGHT_SUPABASE_URL` at `http://127.0.0.1:54321` before running the persona Playwright specs. This needs no hosted credentials and is materially faster than waiting on hosted CI for persona-path iteration.

## Release-readiness checklist (reference, not a gate)

From the 2026-09-12 strategic-execution pass, still a reasonable shape for "ready for human validation": `main` green across CI with every authorized track merged; at most one open long-lived branch; every public route reachable, contrast-clean, free of mobile overflow, with its own page title and >=44px touch targets (guarded by `e2e/site-hygiene.spec.ts`); the database verified end to end including RLS. Use `.github/skills/release-readiness-review/SKILL.md` for the current, maintained version of this kind of review -- this entry is kept only because the two source documents it came from were retired in the same migration batch that created this file.
