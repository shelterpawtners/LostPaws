# AI Handoff

STATUS: EXTERNAL_LAUNCH_GATE_WITH_VERIFIED_GITHUB_PAGES_RELEASE_CANDIDATE
CURRENT_PHASE: Lost Lands MVP launch readiness / production-launch prerequisites
CURRENT_CHECKPOINT: Unified LostPaws + RAVE Shelter mission merged and live acceptance green
NEXT_CHECKPOINT: External auth/provider acceptance, Support OS privileged delivery prerequisite, owner legal review, Vercel/main-domain cutover preparation
OWNER_DECISION_REQUIRED: YES_FOR_OWNER_ONLY_PROVIDER_ACTIONS_LEGAL_AND_FINAL_CUTOVER
SAFE_TO_CONTINUE: YES
ACCEPTED_PRODUCT_SHA: 1c620a126a6917d6cf89b96acd9320459830b825
ACCEPTANCE_RUNTIME: GITHUB_PAGES_FINAL_PUBLIC_AND_AUTHENTICATED_MATRIX_GREEN

## Release-candidate boundary

LL-1 through LL-6 are accepted. Do not reopen them without regression evidence.

`main` is the only release-candidate source of truth. Historical branches were audited by functionality rather than blindly merged. Do not merge historical branches wholesale merely to make ancestry look clean.

### Unified LostPaws + RAVE Shelter mission — accepted

Issue #100 / PR #102 merged to `main` as `9545f01e741991395d4fa8466d2be3644d337043`.

Accepted public flow:

- LostPaws is the music-community activation of RAVE Shelter, not a separate generic foundation page.
- `/rave` is the canonical RAVE Shelter mission experience.
- `/lostpaws` renders the same unified mission experience and remains the intended LostPaws QR destination.
- `/rave-shelter` canonicalizes to `/rave`.
- Home now presents one coherent LostPaws × RAVE Shelter story with a primary mission CTA and secondary RAVE Marketplace CTA.
- Raver / Guardian first-value path is `/marketplace?channel=rave`; optional Guardian signup remains `/register?type=guardian`.
- Vendor / PetBiz path is `/register?type=rave_vendor`.
- Shelter / rescue path is `/register?type=shelter`.
- The obsolete generic `publicFoundations.lostpaws`, static `public/lostpaws.html`, and Vercel static LostPaws rewrites are retired.
- Approved LostPaws hero and RAVE Shelter logo assets are retained.
- Guardian giving is described as a future capability; no unsupported donation percentage, tax deduction, or completed giving flow is claimed.
- Explicit independence/non-affiliation language remains.

PR #97 / Issue #96 was closed unmerged as superseded by the broader Issue #100 implementation. Do not revive or merge it wholesale.

### Post-merge Pages regression correction — accepted

The Issue #100 merge initially caused the GitHub Pages staging workflow to fail only because its live Chromium check still searched for retired homepage copy (`LostPaws is launching the RAVE Shelter mission`). Build, deployment, compiled assets, and the new application were healthy.

PR #103 corrected that stale assertion and merged to `main` as `1c620a126a6917d6cf89b96acd9320459830b825`.

Post-merge live proof on this SHA:

- GitHub Pages build: green.
- GitHub Pages deployment: green.
- Live compiled-asset verification: green.
- Live Chromium verification: green against the unified RAVE mission homepage.
- GitHub Pages MVP public release matrix: green on mobile/tablet/desktop, including `/rave`, `/lostpaws`, `/rave-shelter`, mission CTAs, Marketplace, responsive overflow checks, and critical public routes.
- Authenticated Guardian live smoke: green on mobile and desktop using safe QA credentials; sign-in, responsive navigation, Account, Help & feedback open/close, protected Passport navigation, sign-out, and protected-route redirect all passed without creating or mutating application data.

This is the current accepted release-candidate boundary.

## Accepted launch-readiness engineering

Key accepted work includes:

- PR #50 — multi-photo Pet Passport + Guardian activity timeline.
- PR #52 — Guardian Deal Moments.
- PR #59 — Marketplace density/grid-list.
- PR #60 — LostPaws campaign landing / owner hero artwork.
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
- PR #102 / Issue #100 — unified LostPaws + RAVE Shelter mission flow and focused browser regression.
- PR #103 — live Pages assertion aligned to the unified mission.
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

## Password recovery source readiness

The release candidate has a complete source-level recovery flow: public entry, base-aware Supabase recovery redirect, `/reset-password`, recovery-session gating, password update, sign-out, and return to sign-in.

- Redirect behavior is covered for both root hosting and GitHub Pages `/LostPaws/` hosting.
- A normal authenticated session cannot expose the recovery-update form; browser-scoped Supabase `PASSWORD_RECOVERY` state is required.
- Successful update signs out before returning to sign-in.
- Invalid, expired, reused, and missing-session cases use one non-enumerating safe message and offer a new recovery request.

This remains source/test readiness, not live mail acceptance. Remaining real acceptance must send a recovery email to the safe QA account, open the configured redirect, set a new password, sign in with it, test invalid/expired/reused-link behavior, and confirm Guardian persona/profile continuity.

## Active Issue #56 — Support OS

Supabase remains the operational support source of truth. Raw support content/PII must never auto-mirror to GitHub.

Accepted Support OS capabilities include RLS-backed support records, authenticated intake/status UI, safe deployed release context, privacy-safe duplicate/digest/triage/classification views, human escalation, a private provider-neutral `support_delivery_candidates` contract, and cross-day aging/escalation regression.

Verified shared-dev boundaries:

- `private.support_delivery_candidates` exists.
- `anon` SELECT = false.
- `authenticated` SELECT = false.
- Raw/identity fields are not exposed.
- No new Support OS-specific security finding was introduced.

A dormant reviewed delivery runtime exists in source but is intentionally not deployed or scheduled. The exact external blocker remains:

1. an approved owner-alert webhook destination that supports idempotency;
2. managed `SUPPORT_DELIVERY_WEBHOOK_URL` and `SUPPORT_DELIVERY_INVOKE_SECRET` values;
3. reviewed hosted deployment using the dedicated server-to-server invocation secret.

Do not improvise `pg_cron`/`pg_net`, expose raw tickets, auto-close tickets, auto-fix, or implement suggestions autonomously.

## Hosted runtime state

### GitHub Pages

GitHub Pages is the current verified release-candidate acceptance surface.

- Current accepted `main`: `1c620a126a6917d6cf89b96acd9320459830b825`.
- Live build/deploy/Chromium verification: green.
- Public mobile/tablet/desktop release matrix: green.
- Authenticated Guardian mobile/desktop live smoke: green and non-destructive.

### Vercel

- Project `lost-paws` remains connected on Hobby.
- Vercel preview capacity intermittently recovered during the Issue #100 work, but free-tier deployment limits continued to cancel newer attempts.
- No verified READY production deployment for the current `main` was observed during this controller run.
- Last observed READY production remained older than the GitHub Pages release candidate.
- Never purchase/upgrade Vercel to bypass the free-tier limit and do not spam manual deployments.
- Recheck production freshness when the free-tier window is available.

Final `shelterpawtners.com` custom-domain/DNS cutover remains separately owner-gated.

## Connected tooling recheck — 2026-09-11

- GitHub: connected and authoritative for repository, PR, CI, and release verification.
- Supabase: connected; project `shelterpawtners-dev` is healthy. Current exposed tooling supports database/migration/Edge Function operations but not hosted Google/Meta provider-console configuration.
- Deployed Supabase Edge Functions observed: `admin-qa-session` and `admin-create-test-user`; no support-delivery Edge Function is deployed.
- Vercel: connected on Hobby; current production freshness remains behind GitHub Pages and newer attempts are constrained by free-tier deployment limits.
- No authorized provider-console/browser surface for Google or Meta configuration was available in this run. Do not repeatedly retry interactive provider gates without such a surface.

## Legal review readiness

Prepared but owner/legal-gated:

- `docs/legal/DRAFT-TERMS-OF-SERVICE.md`
- `docs/legal/DRAFT-PRIVACY-NOTICE.md`
- `docs/legal/OWNER-LEGAL-REVIEW-CHECKLIST.md`

Do not decide legal entity/contact identity, minimum age, governing law, arbitration/class-action approach, retention/deletion policy, jurisdictional privacy obligations, OD-003, or OD-004 through automation. Do not publish these drafts as final Terms/Privacy without owner review.

## Remaining external launch gate

1. Execute real password-recovery acceptance on the safe account: delivery, `/reset-password`, update, new-password sign-in, invalid/expired/reused-link behavior, and Guardian persona/profile continuity.
2. Verify Microsoft 365 human mailbox send/receive remains normal after transactional-email DNS additions; do not alter its DNS.
3. Configure/live-test Google OAuth when authorized provider-console credentials/tooling become available.
4. Configure/live-test supported Facebook Login when authorized Meta tooling becomes available.
5. Verify OAuth/email flows do not create duplicate profiles/organizations and preserve persona continuity.
6. Recheck Vercel production freshness when free-tier deployment capacity becomes available.
7. Present the existing draft Terms/Privacy and owner checklist for owner/legal review; do not publish final legal text without approval.
8. Prepare, but do not perform, the final `shelterpawtners.com` web-domain DNS/custom-domain cutover without separate authorization.

## Protected restrictions

Never purchase/upgrade paid services, make destructive production-data changes, alter Microsoft 365 mail DNS, decide OD-003 or OD-004, weaken tests/RLS, publish unapproved final Terms/Privacy, expose secrets, or perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate owner authorization.

## Next safe action

1. Treat `main` SHA `1c620a126a6917d6cf89b96acd9320459830b825` as the accepted release-candidate source of truth.
2. Do not reopen completed Lost Lands or Issue #100 slices without regression evidence.
3. Re-check password-recovery, Google, Meta, Support OS webhook/secrets, and Vercel prerequisites each run; act immediately only when the required authorized provider surface/prerequisite becomes available.
4. Keep legal publication and final production-domain cutover owner-gated.
5. If external lanes remain blocked, continue useful non-destructive launch verification/documentation rather than inventing privileged production mechanisms.
