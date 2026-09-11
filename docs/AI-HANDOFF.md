# AI Handoff

STATUS: EXTERNAL_LAUNCH_GATE_WITH_ACTIVE_SUPPORT_OS_DELIVERY_RUNTIME_GAP
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Support OS delivery runtime + password-recovery/provider acceptance
NEXT_CHECKPOINT: Google OAuth, Facebook auth, integrated browser/mobile acceptance, owner legal review, cutover prep
OWNER_DECISION_REQUIRED: YES_FOR_OWNER_ONLY_PROVIDER_ACTIONS_LEGAL_AND_FINAL_CUTOVER
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: 1443d7138d923033bb4e9c20ab8971a49647eefb
ACCEPTANCE_RUNTIME: REPOSITORY_GATES_GREEN; SHARED_DEV_MIGRATION_APPLIED; VERCEL_PRODUCTION_READY_AT_FRONTEND_SHA_5BF64450

## Accepted product boundary

LL-1 through LL-6 are accepted. Do not reopen them without regression evidence.

Issue #53 remains closed/completed. PR #78 was an explicit owner-directed Guardian Passport follow-up, not a reopening of Issue #53.

Current accepted post-MVP launch-readiness engineering includes:

- PR #50 — multi-photo Pet Passport + Guardian activity timeline.
- PR #52 — Guardian Deal Moments.
- PR #59 — Marketplace density/grid-list.
- PR #60 — LostPaws campaign landing; owner artwork remains locked at `public/brand/lostpaws-hero-16x9.png`.
- PR #62 — RAVE Shelter vendor acquisition surface.
- PRs #57, #63, #64 — Support OS foundation and runbooks.
- PR #66 — Guardian Help & feedback intake/status UI.
- PR #67 — duplicate/daily-digest foundation.
- PR #68 — privacy-safe support triage queue.
- PR #69 — misleading Guardian pet contact fields removed.
- PR #70 — compact Guardian account/avatar menu with Help & feedback reuse.
- PR #72 — private Guardian profile-avatar upload/persistence.
- PR #74 — support fingerprint `search_path` hardening.
- PR #75 — privacy-safe deterministic classification + owner digest.
- PR #77 — deployed release context captured in `support_tickets.app_release`; merged at `54628c2b5ab831d203ffc8413920b4431e78b979`.
- PR #78 — photo-first Guardian Passport and compact Passport cards; all six required gates passed; squash-merged at `5bf64450a598fa19126fc9069632dea2d3cf4601`.
- PR #79 — privacy-safe provider-neutral support delivery contract plus cross-day aging/escalation regression; all six required gates passed; squash-merged at `1443d7138d923033bb4e9c20ab8971a49647eefb`.
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

Supabase remains the operational support source of truth. Raw support content/PII must never auto-mirror to GitHub.

Accepted Support OS capabilities now include:

- RLS-backed support tickets/messages/events;
- authenticated categorized Help & feedback intake/status UI;
- primary account-menu Help & feedback entry;
- safe context capture including deployed `app_release`;
- privacy-safe duplicate, daily-digest, triage, classification and owner-digest views;
- deterministic duplicate evidence only, never resolution authority;
- privacy/P0/P1 human escalation;
- private provider-neutral `support_delivery_candidates` contract;
- explicit immediate vs daily-digest due boundaries;
- cross-day 24h / 48h / 7d aging bands and escalation regression;
- no auto-close, auto-fix, destructive action authorization or browser access to private support views.

PR #79 shared-dev state is verified on `shelterpawtners-dev`:

- migration `support_delivery_contract_aging` applied successfully;
- `private.support_delivery_candidates` exists;
- `anon` SELECT = false;
- `authenticated` SELECT = false;
- forbidden raw/identity columns (`reporter_id`, `subject`, `description`, `body`, `ai_triage`) = 0;
- current live delivery-candidate count = 0.

Fresh Supabase security-advisor review after PR #79 shows no new Support OS-specific finding. Existing broader findings remain, including intentionally locked private RLS/no-policy notices, existing SECURITY DEFINER warnings, and leaked-password protection disabled.

Remaining #56 focus:

1. Implement the actual least-privilege scheduler/delivery worker that consumes only the accepted minimized delivery contract when a supported runtime is available.
2. Do not enable `pg_cron`/`pg_net` ad hoc or create a shared-dev-only scheduler outside repository review/tests.
3. Optional screenshot/storage support remains later and requires explicit privacy/storage controls.

## Hosted/Vercel state

- `main` is the Vercel Production Branch.
- PR #78 frontend merge SHA `5bf64450a598fa19126fc9069632dea2d3cf4601` has READY production deployment `dpl_FZDtqShf29yDPz5nWQ1d8YGRuR5b`.
- `https://lost-paws-one.vercel.app/lostpaws` returns HTTP 200.
- `https://lost-paws-one.vercel.app/rave-vendors` returns HTTP 200.
- Vercel reports no runtime errors in the last 24 hours.
- PR #79 changes only Supabase migration/test files; canceled/ignored preview builds for those commits are not application runtime failures.
- Final `shelterpawtners.com` custom-domain/DNS cutover remains separately owner-gated.

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

- GitHub: connected and authoritative for repository operations/CI. Direct repository work remains preferred over burning Copilot credits.
- Supabase: connected for database/migration/Edge Function operations; current exposed tooling still does not provide hosted Google/Meta provider-console configuration.
- Vercel: connected; current frontend production deployment is READY and runtime error check is clean.
- Fresh plugin search did not surface a usable Meta/Facebook, Google OAuth, Resend or DNS/domain-management provider plugin.
- Browser/provider-console interaction remains an external/interactive lane when an executable browser-capable Work surface is available. Do not repeatedly retry the owner's Meta phone gate.

## Legal review readiness

Prepared but owner/legal-gated:

- `docs/legal/DRAFT-TERMS-OF-SERVICE.md`
- `docs/legal/DRAFT-PRIVACY-NOTICE.md`
- `docs/legal/OWNER-LEGAL-REVIEW-CHECKLIST.md`

Do not decide legal entity/contact identity, minimum age, governing law, arbitration/class-action approach, retention/deletion policy, jurisdictional privacy obligations, OD-003 or OD-004 through automation.

## Protected restrictions

Never purchase/upgrade paid services, make destructive production-data changes, alter Microsoft 365 mail DNS, decide OD-003 or OD-004, weaken tests/RLS, publish unapproved final Terms/Privacy, expose secrets, or perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate owner authorization.

## Next safe action

1. Continue Issue #56 with an actual repository-backed least-privilege scheduler/delivery worker only when a supported scheduler runtime is available; consume only `private.support_delivery_candidates` and do not transport raw ticket content/PII.
2. Use the READY production candidate for integrated desktop/mobile/browser acceptance when an executable browser-capable surface is available.
3. Re-check password-recovery/Google/Meta provider tooling each run and act immediately if an authorized prerequisite becomes actionable.
4. Keep legal publication and final production-domain cutover owner-gated.
5. If the scheduler/provider lanes remain blocked, continue only useful non-destructive launch verification/documentation rather than inventing privileged production mechanisms.
