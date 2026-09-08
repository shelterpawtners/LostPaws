# Hosted shared-development QA

## Purpose and boundary

The Vercel Preview deployment is the normal human-testing surface for the current LostPaws branch. It connects only to the existing `shelterpawtners-dev` Supabase project. It is not production hosting, does not replace public DNS, and must never receive a Supabase secret or service-role key.

## Vercel Preview configuration

The Git-connected Vercel project builds with `npm run build`, publishes `dist`, and uses `vercel.json` to return the SPA entry point for direct navigation and refreshes. This covers `/register`, `/dashboard`, `/pets/:petId`, `/marketplace`, `/partners/:id`, `/partner/offers`, and `/redeem/:code`.

Set these values in **Project settings → Environment Variables**, selecting **Preview only** for each one:

| Variable                        | Preview value                                               |
| ------------------------------- | ----------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | The `shelterpawtners-dev` project URL                       |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | An enabled publishable client key for `shelterpawtners-dev` |
| `VITE_GOOGLE_AUTH_ENABLED`      | `false` until Google configuration is separately approved   |

Do not add `service_role`, secret, database-password, or personal-access-token values to Vercel. Production-scoped variables remain untouched.

## Supabase Auth redirect allowlist

Keep the existing Site URL unchanged. Add the exact stable QA preview URL and the account-scoped Vercel preview wildcard to **Supabase Dashboard → shelterpawtners-dev → Authentication → URL Configuration → Redirect URLs**. Supabase documents the Vercel form as `https://*-<team-or-account-slug>.vercel.app/**`. Do not add a broad `vercel.app` wildcard.

## Repeatable shared-dev data

`supabase/seed.sql` is the source of truth for deterministic QA personas and demo records. It uses reserved `example.invalid` addresses, stable UUIDs, demo flags, and conflict-safe inserts, so it can be reapplied without replacing the shared database:

```bash
supabase link --project-ref jukmlmryykcnjtpblbja
supabase db seed --linked
```

Run this only against `shelterpawtners-dev`. Do not use `db reset --linked`; a reset is for an isolated local database. The hosted smoke opens and validates the Guardian registration entry, then uses the deterministic seeded Guardian for repeatable login and pet-save coverage. It does not create a new Auth user on every run because shared-project signup rate limits would make CI nondeterministic. Smoke-created pets use the `Hosted QA Pet` prefix and are disposable demo data. Cleanup is a deliberate administrator operation, not part of the browser test, because frontend tests must not receive privileged credentials.

## Hosted Playwright

The focused smoke verifies Guardian registration entry/login, pet save, dashboard persistence through reload, logout and session protection, login persistence, public marketplace access, and seeded Partner offer-management access:

```bash
PLAYWRIGHT_BASE_URL=https://preview.example.vercel.app \
PLAYWRIGHT_HOSTED_QA=true \
PLAYWRIGHT_SUPABASE_URL=https://jukmlmryykcnjtpblbja.supabase.co \
PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY=<publishable-key> \
npm run test:e2e:hosted
```

GitHub's **Hosted QA** workflow provides the same run without local Docker. Configure repository variables `QA_BASE_URL`, `QA_SUPABASE_URL`, and `QA_SUPABASE_PUBLISHABLE_KEY`, then run the workflow. Select `full_browser_audit` to run the practical hosted portion of the Issue #5 audit. The local-only database reset, pgTAP, and direct database setup remain in the Persona QA workflow.

## Promotion rule

Preview success is evidence for review, not permission to promote. Production hosting, DNS, Supabase, credentials, and deployment remain separately gated and untouched.
