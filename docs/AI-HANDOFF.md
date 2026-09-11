# AI Handoff

STATUS: EXTERNAL_LAUNCH_GATE_WITH_VERIFIED_GITHUB_PAGES_RELEASE_CANDIDATE
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Final source reconciliation + integrated GitHub Pages acceptance complete
NEXT_CHECKPOINT: External auth/provider acceptance, Support OS privileged delivery runtime, owner legal review, final cutover prep
OWNER_DECISION_REQUIRED: YES_FOR_OWNER_ONLY_PROVIDER_ACTIONS_LEGAL_AND_FINAL_CUTOVER
SAFE_TO_CONTINUE: YES
ACCEPTED_PRODUCT_SHA: 53978542abae1e40b253e79cc82dcc2354b08406
REPOSITORY_HEAD_AFTER_DOC_RECONCILIATION: d4b62447f5fc56d89d7cfa2f759ad6d0f2f91756
ACCEPTANCE_RUNTIME: GITHUB_PAGES_FINAL_PUBLIC_AND_AUTHENTICATED_MATRIX_GREEN

## Release-candidate boundary

LL-1 through LL-6 are accepted. Do not reopen them without regression evidence.

`main` is the only release-candidate source of truth. Historical branches were audited against `main` by tree/functionality rather than blindly merged. No known accepted MVP product delta remains stranded solely on an old branch.

Issue #53 remains closed/completed.

Issue #80 remains closed/completed in source.

Issue #87 final reconciliation result:

- `main` product SHA `53978542abae1e40b253e79cc82dcc2354b08406` contains the final mobile Guardian acceptance fix.
- GitHub Pages MVP Acceptance run #12 passed on that exact SHA.
- Public release matrix is green on mobile/tablet/desktop across critical routes and Marketplace/RAVE surfaces.
- Authenticated Guardian live smoke is green on mobile and desktop: sign-in, responsive nav, Account, Help & feedback open/close, protected Passport route, sign-out, and protected-route redirect.
- The acceptance flow is non-destructive and does not create or mutate application data.
- PR #92 duplicated the mobile navigation fix from the same pre-fix parent, became conflict-stale after the minimal change landed on `main`, and was closed unmerged rather than force-merging duplicate/superseded QA code.

Do not merge historical branches wholesale merely to make ancestry look clean.

## Accepted launch-readiness engineering

Key accepted work includes:

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
- PR #77 — deployed release context captured in `support_tickets.app_release`.
- PR #78 — photo-first Guardian Passport and compact Passport cards.
- PR #79 — privacy-safe provider-neutral support delivery contract plus cross-day aging/escalation regression.
- PR #81 / Issue #80 — global launch navigation cleanup and home launch feature.
- PR #88 — final GitHub Pages public MVP acceptance matrix.
- PR #90 — authenticated Guardian live smoke.
- `main` commit `53978542...` — mobile responsive navigation correction for the live Guardian smoke.
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

Accepted Support OS capabilities include:

- RLS-backed support tickets/messages/events;
- authenticated categorized Help & feedback intake/status UI;
- primary account-menu Help & feedback entry;
- safe deployed `app_release` context;
- privacy-safe duplicate, daily-digest, triage, classification and owner-digest views;
- deterministic duplicate evidence only, never resolution authority;
- privacy/P0/P1 human escalation;
- private provider-neutral `support_delivery_candidates` contract;
- immediate vs daily-digest due boundaries;
- cross-day 24h / 48h / 7d aging bands and escalation regression;
- no auto-close, auto-fix, destructive action authorization or browser access to private support views.

Verified shared-dev state:

- `private.support_delivery_candidates` exists;
- `anon` SELECT = false;
- `authenticated` SELECT = false;
- raw/identity fields are not exposed;
- fresh security review introduced no new Support OS-specific finding.

Remaining #56 focus:

1. Implement the actual repository-backed, least-privilege scheduler/delivery worker only when a supported runtime plus approved owner-alert transport credential/destination and hosted secret-management path are available.
2. Consume only `private.support_delivery_candidates`; never transport raw ticket content/PII.
3. Do not enable `pg_cron`/`pg_net` ad hoc or create a shared-dev-only scheduler outside repository review/tests.
4. Optional screenshot/storage support remains later and requires explicit privacy/storage controls.

## Hosted runtime state

### GitHub Pages

GitHub Pages is the current verified release-candidate acceptance surface.

- Product SHA: `53978542abae1e40b253e79cc82dcc2354b08406`.
- GitHub Pages MVP Acceptance run #12: successful.
- Public mobile/tablet/desktop acceptance: green.
- Authenticated Guardian mobile/desktop acceptance: green.

### Vercel

- Project `lost-paws` remains connected on Hobby.
- Current READY production deployment remains PR #78 SHA `5bf64450a598fa19126fc9069632dea2d3cf4601`.
- Recent newer PR/branch deployments are canceled while deployment capacity remains constrained.
- Never purchase/upgrade Vercel to bypass the free-tier limit.
- Recheck production freshness when capacity becomes available; do not rewrite accepted code merely to force a deployment.

Final `shelterpawtners.com` custom-domain/DNS cutover remains separately owner-gated.

## Remaining external launch gate

1. Execute real password-recovery acceptance: delivery, `/reset-password`, update, new-password sign-in, invalid/expired/reused-link behavior.
2. Verify Microsoft 365 human mailbox send/receive still behaves normally after transactional-email DNS additions.
3. Configure/live-test Google OAuth when provider-console credentials/tooling are available.
4. Configure/live-test supported Facebook Login when Meta console access/tooling is available.
5. Verify OAuth/email flows do not create duplicate profiles/organizations and preserve persona continuity.
6. Recheck Vercel production freshness when free-tier deployment capacity is available.
7. Present draft Terms/Privacy plus owner checklist for owner/legal review; do not publish as final without approval.
8. Prepare but do not perform final `shelterpawtners.com` web-domain DNS/custom-domain cutover without separate authorization.

## Connected tooling recheck — 2026-09-11

- GitHub: connected and authoritative for repository operations/CI. Direct repository work remains preferred over burning Copilot credits.
- Supabase: connected for database/migration/Edge Function operations; exposed tooling still does not provide hosted Google/Meta provider-console configuration.
- Vercel: connected on Hobby; current production is older than the GitHub Pages release candidate and newer deployment attempts remain constrained/canceled.
- Browser/provider-console interaction remains an external/interactive lane when an executable browser-capable surface is available. Do not repeatedly retry the owner's Meta phone gate.

## Legal review readiness

Prepared but owner/legal-gated:

- `docs/legal/DRAFT-TERMS-OF-SERVICE.md`
- `docs/legal/DRAFT-PRIVACY-NOTICE.md`
- `docs/legal/OWNER-LEGAL-REVIEW-CHECKLIST.md`

Do not decide legal entity/contact identity, minimum age, governing law, arbitration/class-action approach, retention/deletion policy, jurisdictional privacy obligations, OD-003 or OD-004 through automation.

## Protected restrictions

Never purchase/upgrade paid services, make destructive production-data changes, alter Microsoft 365 mail DNS, decide OD-003 or OD-004, weaken tests/RLS, publish unapproved final Terms/Privacy, expose secrets, or perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate owner authorization.

## Next safe action

1. Treat `main` as the locked release-candidate source of truth and do not merge stale historical branches without regression evidence.
2. Continue Issue #56 only when its legitimate privileged runtime/transport/secret prerequisites are available; consume only the privacy-minimized delivery contract.
3. Re-check password-recovery/Google/Meta/Vercel tooling each run and act immediately if an authorized prerequisite becomes actionable.
4. Keep legal publication and final production-domain cutover owner-gated.
5. If all external lanes remain blocked, continue only useful non-destructive launch verification/documentation rather than inventing privileged production mechanisms.
