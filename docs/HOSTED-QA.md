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
| `VITE_ADMIN_QA_MODE_ENABLED`    | `true` for this QA preview only; unset or `false` elsewhere |

Do not add `service_role`, secret, database-password, or personal-access-token values to Vercel. Production-scoped variables remain untouched.

## Admin QA Mode

The QA preview supports an admin-only, test-persona mode. Configure the development project's Edge Function secret `QA_MODE_ENABLED=true`; this is a separate server-side guard from the public Vite UI flag. The `admin-qa-session` and `admin-create-test-user` functions use a server-only credential, validate the caller's active `platform_admin` database role, accept only `@example.invalid` targets, and write immutable private audit events. They remain disabled in production.

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

The focused hosted suite verifies Guardian registration entry/login, pet save, dashboard persistence through reload, logout and session protection, login persistence, public marketplace access, and seeded Partner offer-management access. It also covers the practical Partner → Guardian golden path by creating a unique Partner offer in hosted QA, claiming it as a seeded Guardian, and confirming redemption as the seeded Partner while preserving the Issue #11 profile save/reload regression check:

```bash
PLAYWRIGHT_BASE_URL=https://preview.example.vercel.app \
PLAYWRIGHT_HOSTED_QA=true \
PLAYWRIGHT_SUPABASE_URL=https://jukmlmryykcnjtpblbja.supabase.co \
PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY=<publishable-key> \
npm run test:e2e:hosted
```

GitHub's **Hosted QA** workflow runs automatically on:

- pushes to `qa/guardian-registration-personas`,
- pull requests targeting `build/festival-mvp`,
- and manual `workflow_dispatch`.

The workflow requires `docs/AI-HANDOFF.md` to declare `SAFE_TO_CONTINUE: YES` and `OWNER_DECISION_REQUIRED: NO` before acceptance execution. Configure repository variables `QA_BASE_URL`, `QA_SUPABASE_URL`, and `QA_SUPABASE_PUBLISHABLE_KEY`, plus these GitHub Actions **secrets** (never repository variables or source code):

| Secret                                                   | Purpose                                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `QA_PLATFORM_ADMIN_EMAIL` / `QA_PLATFORM_ADMIN_PASSWORD` | Authorized platform-admin login used to exercise the server-side QA functions. |
| `QA_NON_ADMIN_EMAIL` / `QA_NON_ADMIN_PASSWORD`           | Ordinary account used to prove `/admin-qa` rejects non-admins.                 |
| `QA_GUARDIAN_EMAIL` / `QA_GUARDIAN_PASSWORD`             | Deterministic Guardian used by the existing hosted smoke.                      |
| `QA_PARTNER_EMAIL` / `QA_PARTNER_PASSWORD`               | Deterministic Partner used by the existing hosted smoke.                       |

The workflow fails before browser execution if the handoff authorization, target, shared-dev project, public key, or any required QA secret is missing. Its Admin QA suite also fails visibly if the QA UI flag, server-side QA secret, seeded personas, session exchange, or original persisted admin session is unavailable. Select `full_browser_audit` to run the practical hosted portion of the Issue #5 audit. Persona QA remains the targeted deterministic lower-level gate for local disposable Supabase reset, pgTAP, and direct database setup.

## Normal acceptance flow

1. Implement on the active QA branch and run lightweight CI.
2. Use Persona QA for deterministic local migration/RLS/regression checks when needed.
3. Use Hosted QA against Vercel + shared `shelterpawtners-dev` as the normal acceptance surface.
4. Keep acceptance and next-step authorization in `docs/AI-HANDOFF.md`.
5. Keep production deployment as a separate explicit gate.

## Promotion rule

Preview success is evidence for review, not permission to promote. Production hosting, DNS, Supabase, credentials, and deployment remain separately gated and untouched.
