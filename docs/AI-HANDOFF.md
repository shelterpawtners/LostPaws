# AI Handoff

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Issue #87 final MVP reconciliation and GitHub Pages public-release matrix
NEXT_CHECKPOINT: Merge the focused Issue #87 acceptance-matrix PR after required gates, then run live Pages matrix and pursue only external/provider acceptance
OWNER_DECISION_REQUIRED: YES_FOR_OWNER_ONLY_PROVIDER_ACTIONS_LEGAL_AND_FINAL_CUTOVER
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: a55a1de8575adbc3f28d40de8f4d11261444b358
ACCEPTANCE_RUNTIME: MAIN_ONLY_RELEASE_CANDIDATE; REPOSITORY_GATES_GREEN_FOR_ACCEPTED_PRS; SHARED_DEV_SUPPORT_MIGRATION_APPLIED; VERCEL_PRODUCTION_TEMPORARILY_BEHIND_MAIN_DUE_FREE_TIER_RATE_LIMIT

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
- PR #81 / Issue #80 — global launch navigation cleanup and home launch feature; authenticated Dashboard/Account/Help/Sign out controls moved into the global header, LostPaws and RAVE Shelter added to primary navigation, and the home page now features the September 2026 LostPaws activation plus the broader end-of-2026 RAVE Shelter roadmap. All required PR gates passed; squash-merged at `fbb5a02e081d4bd634034a9fadd8bb17c3744e4a`.
- PR #82 — GitHub Pages staging from `main`, followed by the accepted live-artifact, Chromium, brand-path, and verifier quoting fixes through current `main` SHA `a55a1de8575adbc3f28d40de8f4d11261444b358`.
- PR #65 — launch legal-review checklist. Draft Terms/Privacy remain unapproved and must not be published as final.

## Issue #87 final reconciliation

`main` at `a55a1de8575adbc3f28d40de8f4d11261444b358` is the only MVP release candidate. Historical branches were audited by functionality/tree state, not commit ancestry. No accepted MVP product implementation is stranded on an old branch; none may be wholesale-merged. The detailed per-branch classification is in `docs/MVP-RECONCILIATION.md`.

The only selective port is a new one-file GitHub Pages public-release matrix from a fresh `main` branch. It checks desktop/tablet/mobile critical public routes, overflow, browser errors, 5xx responses, Marketplace rendering, and the RAVE vendor campaign. It deliberately does not expose private support data or simulate provider state.

Do not reopen Issue #80 without regression evidence. The source implementation is accepted; only deployment/hosted acceptance remains blocked by the free-tier Vercel rate limit described below.

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
- PR #81 accepted frontend merge SHA is `fbb5a02e081d4bd634034a9fadd8bb17c3744e4a`.
- All repository and hosted PR checks for PR #81 passed before merge.
- Vercel rejected the post-merge production deployment because the Hobby/free-tier build rate limit was reached. GitHub/Vercel status on the merge reports: `Deployment rate limited — retry in 24 hours.`
- Never purchase/upgrade Vercel to bypass this limit. Retry only when the free-tier deployment window is available again.
- Until that retry succeeds, the current READY production frontend remains PR #78 deployment `dpl_FZDtqShf29yDPz5nWQ1d8YGRuR5b` at SHA `5bf64450a598fa19126fc9069632dea2d3cf4601`.
- `https://lost-paws-one.vercel.app/lostpaws` and `/rave-vendors` remain available from that prior READY frontend, but they do not yet include PR #81's new global-nav/homepage changes.
- Final `shelterpawtners.com` custom-domain/DNS cutover remains separately owner-gated.

## Remaining external launch gate

1. When the free-tier Vercel build window reopens, deploy/verify accepted PR #81 SHA `fbb5a02e...` and confirm `lost-paws-one.vercel.app` points to it.
2. Execute real password-recovery acceptance: delivery, `/reset-password`, update, new-password sign-in, invalid/expired/reused-link behavior.
3. Verify Microsoft 365 human mailbox send/receive still behaves normally after transactional-email DNS additions.
4. Configure/live-test Google OAuth when provider-console credentials/tooling are available.
5. Configure/live-test supported Facebook Login when Meta console access/tooling is available.
6. Verify OAuth/email flows do not create duplicate profiles/organizations and preserve persona continuity.
7. Re-run integrated desktop/mobile/browser acceptance on the final configured release, including PR #81 global navigation and home feature at desktop/tablet/mobile widths.
8. Present draft Terms/Privacy plus owner checklist for owner/legal review; do not publish as final without approval.
9. Prepare but do not perform final `shelterpawtners.com` web-domain DNS/custom-domain cutover without separate authorization.

## Connected tooling recheck — 2026-09-11

- GitHub: connected and authoritative for repository operations/CI. Direct repository work remains preferred over burning Copilot credits.
- Supabase: connected for database/migration/Edge Function operations; current exposed tooling still does not provide hosted Google/Meta provider-console configuration.
- Vercel: connected. PR #81 post-merge deployment is currently blocked specifically by the Hobby/free-tier deployment rate limit; no upgrade is authorized.
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

1. Treat PR #81 source as accepted and closed. Retry its production deployment only after the free-tier Vercel rate-limit window clears; do not purchase an upgrade and do not rewrite accepted code merely to force a build.
2. Continue Issue #56 with an actual repository-backed least-privilege scheduler/delivery worker only when a supported scheduler runtime is available; consume only `private.support_delivery_candidates` and do not transport raw ticket content/PII.
3. Once PR #81 is hosted, run integrated desktop/tablet/mobile/browser acceptance with special attention to global nav density, signed-in Account/Help/Sign out behavior, LostPaws/RAVE links, and the new homepage launch feature.
4. Re-check password-recovery/Google/Meta provider tooling each run and act immediately if an authorized prerequisite becomes actionable.
5. Keep legal publication and final production-domain cutover owner-gated.
6. If deployment/scheduler/provider lanes remain externally blocked, continue useful non-destructive launch verification/documentation rather than inventing privileged production mechanisms.
