# AI Handoff

STATUS: EXTERNAL_LAUNCH_GATE_WITH_ACTIVE_SUPPORT_OS_FOLLOWUP
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Support OS bounded delivery + password-recovery/provider acceptance
NEXT_CHECKPOINT: Google OAuth, Facebook auth, integrated browser/mobile acceptance, owner legal review, cutover prep
OWNER_DECISION_REQUIRED: YES_FOR_OWNER_ONLY_PROVIDER_ACTIONS_LEGAL_AND_FINAL_CUTOVER
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: 54628c2b5ab831d203ffc8413920b4431e78b979
ACCEPTANCE_RUNTIME: REPOSITORY_GATES_GREEN; CURRENT_VERCEL_PRODUCTION_READY_AT_ACCEPTED_CODE_SHA

## Accepted product boundary

LL-1 through LL-6 are accepted. Do not reopen them without regression evidence.

Issue #53 is closed/completed. Do not silently extend it. Additional Guardian UX work requires regression evidence or a new explicit follow-up issue.

Current launch-readiness engineering accepted after the core MVP includes:

- PR #50 — multi-photo Pet Passport + Guardian activity timeline.
- PR #52 — Guardian Deal Moments.
- PR #59 — Marketplace density/grid-list.
- PR #60 — LostPaws campaign landing; owner artwork remains locked at `public/brand/lostpaws-hero-16x9.png`.
- PR #62 — RAVE Shelter vendor acquisition surface.
- PRs #57, #63, #64 — Support OS foundation and operating/runbook controls.
- PR #66 — Guardian Help & feedback intake/status UI.
- PR #67 — duplicate/daily-digest foundation.
- PR #68 — privacy-safe support triage queue.
- PR #69 — misleading Guardian pet contact fields removed.
- PR #70 — compact Guardian account/avatar menu with Help & feedback reuse.
- PR #72 — private Guardian profile-avatar upload/persistence using canonical `profiles.avatar_path` and owner-scoped private Storage.
- PR #74 — support fingerprint `search_path` hardening.
- PR #75 — privacy-safe deterministic classification + owner digest.
- PR #77 — Support OS release context; new Help & feedback submissions populate existing `support_tickets.app_release` with the deployed build commit identifier. All six required gates passed; squash-merged at `54628c2b5ab831d203ffc8413920b4431e78b979`.
- PR #65 — launch legal-review checklist. Draft Terms/Privacy remain unapproved and must not be published as final.

## Auth/email prerequisites already complete

Owner completed and accepted:

1. Resend free-tier setup.
2. `auth.shelterpawtners.com` transactional-email-only DNS verification.
3. Microsoft 365 inbound/human-mail DNS intentionally unchanged.
4. Supabase custom SMTP with `ShelterPawtners <noreply@auth.shelterpawtners.com>`.
5. Hosted Supabase Site URL configuration.
6. Real Guardian signup/confirmation through Supabase + Resend returning to expected onboarding.

Do not reopen Resend/domain/SMTP/Guardian-confirmation work without regression evidence.

## Active Issue #56 — Support OS

Operational source of truth remains Supabase. Raw support content/PII must never auto-mirror to GitHub.

Accepted Support OS capabilities:

- `support_tickets`, `support_ticket_messages`, `support_ticket_events` under RLS;
- authenticated categorized Help & feedback intake/status UI;
- primary account-menu Help & feedback entry;
- safe context capture only;
- privacy-safe duplicate-candidate, daily-digest, triage, classification and owner-digest views;
- deterministic grouping evidence only, never resolution authority;
- privacy/P0/P1 human escalation;
- no auto-close, auto-fix or destructive action authorization;
- browser roles cannot read private triage/digest views;
- `app_release` now captures the deployed build commit identifier on new support submissions.

Remaining #56 focus:

1. Repository-backed, least-privilege scheduling/delivery for already-private classification/digest outputs.
2. Cross-day aging persistence and escalation regression coverage.
3. Optional screenshot/storage support only later after explicit privacy/storage controls.

Shared-dev preflight on 2026-09-11 found neither `pg_cron` nor `pg_net` enabled and no support-digest Edge Function to reuse. Do not create an ad-hoc shared-dev-only scheduler. The next scheduler implementation must be generated through the normal repository migration workflow, reviewed, tested and least-privilege.

## Hosted/Vercel state

Production freshness is resolved.

- `main` is the Vercel Production Branch.
- PR #77 exact accepted merge SHA: `54628c2b5ab831d203ffc8413920b4431e78b979`.
- Vercel production deployment: `dpl_79DAvPwJRAsycmdxBJVWzLLAK8Fd`.
- Deployment is READY at that exact SHA.
- Existing alias `https://lost-paws-one.vercel.app` points to the current accepted production candidate.
- `/lostpaws` returns HTTP 200.
- `/rave-vendors` returns HTTP 200.
- Vercel reports no runtime errors in the last 24 hours.
- Docs-only commits may be intentionally skipped by the configured Ignored Build Step; that is expected when no deployed artifact changes.

Do not purchase/upgrade Vercel and do not perform final `shelterpawtners.com` custom-domain/DNS cutover without separate authorization.

## Remaining external launch gate

1. Execute real password-recovery acceptance: delivery, `/reset-password`, update, new-password sign-in, invalid/expired/reused-link behavior.
2. Verify Microsoft 365 human mailbox send/receive still behaves normally after transactional-email DNS additions.
3. Configure/live-test Google OAuth when provider-console credentials/tooling are available.
4. Configure/live-test supported Facebook Login when Meta console access/tooling is available.
5. Verify OAuth/email flows do not create duplicate profiles/organizations and preserve persona continuity.
6. Re-run integrated desktop/mobile/browser acceptance on the final configured release.
7. Present draft Terms/Privacy plus owner checklist for owner/legal review; do not publish as final without approval.
8. Prepare but do not perform final `shelterpawtners.com` web-domain DNS/custom-domain cutover without separate authorization.

## Connected tooling recheck — 2026-09-11

- GitHub: connected and authoritative for repository operations/CI. Do not burn GitHub Copilot credits; direct repository work is preferred.
- Supabase: connected for database/migration/Edge Function operations, but the current exposed tool surface still does not provide hosted Google/Meta provider-console configuration.
- Vercel: connected and current accepted production deployment is READY.
- Fresh plugin search did not surface a usable Meta/Facebook, Google OAuth, Resend or DNS/domain-management provider plugin.
- Browser/provider-console interaction remains an external/interactive lane when an executable browser-capable Work surface is available. Do not repeatedly retry the owner's Meta phone gate.

## Legal review readiness

Prepared but owner/legal-gated:

- `docs/legal/DRAFT-TERMS-OF-SERVICE.md`
- `docs/legal/DRAFT-PRIVACY-NOTICE.md`
- `docs/legal/OWNER-LEGAL-REVIEW-CHECKLIST.md`

Do not decide legal entity/contact identity, minimum age, governing law, arbitration/class-action approach, retention/deletion policy, jurisdictional privacy obligations, OD-003 or OD-004 through automation.

## Vercel deployment hygiene — 2026-09-11

- Confirmed there is one Vercel project: `lost-paws`; the apparent proliferation was historical Git preview deployments, not multiple applications.
- Deleted the 15 owner-approved obsolete/canceled previews from prior completed branches. This removed only deployment records and preview URLs; no Git branch, source code, production data, or current production deployment was removed.
- Preserved the active Production deployment and rollback capability. The currently accepted production SHA is `54628c2b5ab831d203ffc8413920b4431e78b979`.
- Fresh `feat/support-release-context` previews visible after cleanup are active current work and were intentionally not included in that deletion authorization.

## Current focused branch — photo-forward Guardian Passport

- This is an explicit owner-directed follow-up, not a reopening of accepted Issue #53.
- Branch: `ux/guardian-passport-photo-forward` (implementation in progress; not yet proposed for merge).
- Scope: make the existing RLS-protected Passport photo gallery the visual lead, improve the private Passport summary, and make Guardian pet cards read as compact Passport cards.
- No schema, storage-policy, RLS, organization-contact, or authentication changes are planned; existing signed image URLs and `PetMediaGallery` are reused.
- `npm run check` passed after declaring the already-imported `@axe-core/playwright` dev dependency that had been missing from `package.json`/lockfile.
- Focused Playwright regression loads successfully now, but local execution remains blocked because this fresh runner lacks the Chromium binary. `npx playwright install chromium` began but did not complete in the runner; do not classify that as an application failure or repeatedly retry it in this environment. Re-run in CI or a runner with Playwright browsers available.

## Protected restrictions

Never purchase/upgrade paid services, make destructive production-data changes, alter Microsoft 365 mail DNS, decide OD-003 or OD-004, weaken tests/RLS, publish unapproved final Terms/Privacy, expose secrets, or perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate owner authorization.

## Next safe action

1. Continue Issue #56 only when the scheduler/delivery slice can be created through the normal repository-backed migration workflow; add cross-day aging/escalation regression with it.
2. Use the current READY production candidate for integrated desktop/mobile/browser acceptance when an executable browser-capable surface is available.
3. Re-check password-recovery/Google/Meta provider tooling each run and act immediately if an authorized prerequisite becomes actionable.
4. Keep legal publication, Phase 3 and final production-domain cutover owner-gated.
5. If #56 scheduling remains blocked by tooling, continue only useful non-destructive launch verification/documentation rather than improvising privileged production changes.
