# Hosted shared-development QA

## Purpose and boundary

Vercel Preview deployments are the normal human-testing surface for short-lived LostPaws branches. They connect only to the existing `shelterpawtners-dev` Supabase project. They are not the ShelterPawtners public-domain cutover and must never receive a Supabase secret or service-role key.

`main` is the canonical application branch and Vercel Production Branch. Production remains separately reviewed from preview acceptance even though it now uses the same Vercel project.

## Vercel Preview configuration

The Git-connected Vercel project builds with `npm run build`, publishes `dist`, and uses `vercel.json` to return the SPA entry point for direct navigation and refreshes. This covers `/register`, `/dashboard`, `/pets/:petId`, `/marketplace`, `/partners/:id`, `/partner/offers`, and `/redeem/:code`.

Set these values in **Project settings -> Environment Variables**, selecting **Preview only** for each one:

| Variable                        | Preview value                                               |
| ------------------------------- | ----------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | The `shelterpawtners-dev` project URL                       |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | An enabled publishable client key for `shelterpawtners-dev` |
| `VITE_GOOGLE_AUTH_ENABLED`      | `false` until Google configuration is separately approved   |
| `VITE_ADMIN_QA_MODE_ENABLED`    | `true` for this QA preview only; unset or `false` elsewhere |

Do not add `service_role`, secret, database-password, or personal-access-token values to Vercel browser configuration.

## Admin QA Mode

The QA preview supports an admin-only test-persona mode. Configure the development project's Edge Function secret `QA_MODE_ENABLED=true`; this is a separate server-side guard from the public Vite UI flag. The `admin-qa-session` and `admin-create-test-user` functions use a server-only credential, validate the caller's active `platform_admin` database role, accept only `@example.invalid` targets, and write immutable private audit events. They remain disabled in production.

## Supabase Auth redirect allowlist

Keep the existing Site URL unchanged unless a separately approved auth/domain task requires change. Add the exact stable QA preview URL and the account-scoped Vercel preview wildcard to **Supabase Dashboard -> shelterpawtners-dev -> Authentication -> URL Configuration -> Redirect URLs**. Use the scoped Vercel form `https://*-<team-or-account-slug>.vercel.app/**`; do not add a broad `vercel.app` wildcard.

## Repeatable shared-dev data

`supabase/seed.sql` is the source of truth for deterministic QA personas and demo records. It uses reserved `example.invalid` addresses, stable UUIDs, demo flags, and conflict-safe inserts, so it can be reapplied without replacing the shared database:

```bash
supabase link --project-ref jukmlmryykcnjtpblbja
supabase db seed --linked
```

Run this only against `shelterpawtners-dev`. Do not use `db reset --linked`; reset is for an isolated local database.

The hosted smoke uses deterministic seeded personas for repeatable login and persistence coverage. It does not create a new Auth user on every run because shared-project signup rate limits would make CI nondeterministic. Smoke-created records remain demo/test data. Cleanup is a deliberate administrator operation, not a browser-test responsibility, because frontend tests must not receive privileged credentials.

## Hosted Playwright

The focused hosted suite verifies Guardian registration entry/login, pet save, dashboard persistence through reload, logout/session protection, login persistence, public marketplace access, and seeded Partner offer-management access. It also covers the practical Partner -> Guardian golden path by creating a unique Partner offer in hosted QA, claiming it as a seeded Guardian, and confirming redemption as the seeded Partner while preserving the Issue #11 profile save/reload regression check:

```bash
PLAYWRIGHT_BASE_URL=https://preview.example.vercel.app \
PLAYWRIGHT_HOSTED_QA=true \
PLAYWRIGHT_SUPABASE_URL=https://jukmlmryykcnjtpblbja.supabase.co \
PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY=<publishable-key> \
npm run test:e2e:hosted
```

GitHub's **Hosted QA** workflow runs on:

- pull requests targeting `main`;
- manual `workflow_dispatch`.

The heavy hosted browser suite is still cost-controlled. On a PR it runs only when:

- the change-impact classifier requires Hosted QA;
- the PR carries `<!-- ai-active-build-pr -->`;
- `docs/AI-HANDOFF.md` declares `STATUS: READY_FOR_ACCEPTANCE`;
- `SAFE_TO_CONTINUE: YES`;
- `OWNER_DECISION_REQUIRED: NO`.

Routine docs/tooling changes therefore do not start the full hosted browser suite.

The workflow resolves the relevant Vercel PR preview when frontend artifacts changed and falls back to `https://lost-paws-one.vercel.app` only when an existing deployment is intentionally valid. Configure repository variables `QA_BASE_URL`, `QA_SUPABASE_URL`, and `QA_SUPABASE_PUBLISHABLE_KEY`, plus these GitHub Actions **secrets** (never repository variables or source code):

| Secret                                                   | Purpose                                                                                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `QA_PLATFORM_ADMIN_EMAIL` / `QA_PLATFORM_ADMIN_PASSWORD` | Authorized platform-admin login used to exercise the server-side QA functions.                                                 |
| `QA_NON_ADMIN_EMAIL` / `QA_NON_ADMIN_PASSWORD`           | Ordinary account used to prove `/admin-qa` rejects non-admins.                                                                 |
| `QA_GUARDIAN_EMAIL` / `QA_GUARDIAN_PASSWORD`             | Hosted deterministic Guardian login if the configured suite requires explicit credentials.                                    |
| `QA_PARTNER_EMAIL` / `QA_PARTNER_PASSWORD`               | Hosted deterministic Partner login if the configured suite requires explicit credentials.                                     |

The workflow fails before browser execution if a required acceptance authorization, target URL, or required credential is missing. Select `full_browser_audit` on a manual run to execute the broader practical Issue #5 browser suite. Persona QA remains the targeted deterministic lower-level gate for local disposable Supabase reset, pgTAP, and direct database setup.

## Normal acceptance flow

1. Branch from current `main` and open a bounded PR to `main`.
2. Let lightweight CI and applicable Database QA run by change impact.
3. Mark meaningful product work `READY_FOR_ACCEPTANCE` only when implementation is ready for the heavier boundary.
4. Use Persona QA for persona-sensitive local regression evidence.
5. Use Hosted QA against the relevant Vercel preview + shared `shelterpawtners-dev` when browser/product impact requires it.
6. Record acceptance in `docs/AI-HANDOFF.md`.
7. Merge only with owner authority and required evidence.
8. Treat post-merge Vercel production verification as a separate release check.

## Marketplace/design hardening

During the Marketplace Sprint, Hosted QA should prove the actual Guardian/PetBiz golden paths, while responsive visual QA and accessibility review provide complementary evidence that functional browser automation alone cannot prove.

Do not run the full browser suite after every cosmetic iteration. Use lightweight previews/screenshots during implementation and the heavy hosted lane at the acceptance boundary.

## Promotion rule

Preview success is evidence for review, not permission to merge, change DNS, or broaden production access. ShelterPawtners domain cutover, production credentials, paid infrastructure, and material product/security changes remain separately owner-gated.
