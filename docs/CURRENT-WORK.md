# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

Lost Lands MVP LL-1 through LL-6 are **accepted** and must not be reopened without regression evidence.

**Current state: one reconciled MVP release candidate on `main`, with final GitHub Pages public and authenticated Guardian acceptance green, one remaining Support OS delivery-runtime gap, and external provider acceptance gates.**

Issue #87 reconciliation completed on `main` at `53978542abae1e40b253e79cc82dcc2354b08406`. Historical branches were classified by functionality/tree state rather than ancestry; no accepted product feature required a wholesale historical merge. See `docs/MVP-RECONCILIATION.md`.

Current accepted frontend/source baseline: `53978542abae1e40b253e79cc82dcc2354b08406` (PR #91, following Issue #87 matrix PRs #88 and #90).

Current deployed frontend baseline: `5bf64450a598fa19126fc9069632dea2d3cf4601` (PR #78), READY on Vercel production. PR #81 is not hosted yet because Vercel Hobby reported `Deployment rate limited — retry in 24 hours.`

Production web-domain cutover remains explicitly owner-gated.

## Accepted launch-readiness engineering

The authoritative detailed history remains in `docs/AI-HANDOFF.md` and the relevant GitHub issues/PRs.

Recent accepted work includes:

- Pet Passport multi-photo/activity improvements and Guardian Deal Moments.
- denser Marketplace presentation.
- LostPaws campaign landing and RAVE Shelter vendor acquisition surface.
- Support OS foundation/runbooks, Help & feedback intake/status, duplicate/digest plumbing, privacy-safe triage/classification/owner-digest views and release context.
- Guardian pet-contact correction, compact account/avatar menu and private Guardian profile avatar persistence.
- PR #78: photo-first Guardian Passport + compact Passport cards; all six required gates passed; merged at `5bf64450a598fa19126fc9069632dea2d3cf4601`.
- PR #79: private provider-neutral support delivery contract plus cross-day aging/escalation regression; all six required gates passed; merged at `1443d7138d923033bb4e9c20ab8971a49647eefb`.
- PR #81 / Issue #80: launch navigation cleanup + homepage LostPaws/RAVE Shelter feature; authenticated Dashboard/Account/Help/Sign out controls moved into the global header, LostPaws and RAVE Shelter added to primary navigation, and the home page now features the September 2026 LostPaws activation with the broader end-of-2026 RAVE Shelter roadmap. All required PR gates passed; merged at `fbb5a02e081d4bd634034a9fadd8bb17c3744e4a`.
- PRs #88, #90, and #91: final GitHub Pages public and authenticated Guardian acceptance matrices, including mobile navigation behavior; all required gates and the post-merge live matrices passed.
- launch legal-review checklist; draft Terms/Privacy remain unapproved and must not be published as final.

Issue #53 remains **closed/completed**. PR #78 was a separate owner-directed follow-up and does not reopen that issue.

Issue #80 is **closed/completed in source**. Do not reopen it without regression evidence; only hosted deployment/acceptance remains pending because of the Vercel free-tier rate limit.

Do not reopen accepted slices without regression evidence.

## Auth/email status

Completed hosted prerequisites:

- Resend free-tier setup is complete.
- `auth.shelterpawtners.com` transactional-email-only DNS is verified.
- Microsoft 365 inbound/human-mail DNS remains intentionally unchanged.
- Supabase custom SMTP is enabled with `ShelterPawtners <noreply@auth.shelterpawtners.com>`.
- Supabase Site URL targets the hosted application.
- real Guardian signup/confirmation through Supabase + Resend was accepted.

Do not redo Resend/domain/SMTP/Guardian-confirmation work without regression evidence.

## Active Issue #56 — Support OS

Supabase remains the operational support source of truth. Raw support content/PII must never auto-mirror to GitHub.

Completed through PR #79:

1. authenticated Help & feedback intake/status under RLS;
2. privacy-safe duplicate, triage, classification, owner-digest and delivery-candidate views;
3. bounded human-escalation policy with no autonomous closure/fix behavior;
4. deployed release/version captured in `support_tickets.app_release`;
5. immediate vs daily-digest delivery boundaries;
6. persistent 24h / 48h / 7d aging and escalation regression coverage.

Shared-dev verification after PR #79:

- migration `support_delivery_contract_aging` applied successfully;
- `private.support_delivery_candidates` exists;
- neither `anon` nor `authenticated` can SELECT it;
- no raw reporter/text/AI payload columns are exposed;
- current live delivery-candidate count is 0;
- fresh security advisor shows no new Support OS-specific finding.

Remaining #56 work:

1. Implement the actual repository-backed, least-privilege scheduler/delivery worker when a supported scheduler runtime is available.
2. Consume only the privacy-minimized accepted delivery contract; do not transport raw ticket content/PII.
3. Do not enable `pg_cron`/`pg_net` ad hoc or create a shared-dev-only scheduler outside repository review/tests.
4. Optional screenshot/storage support remains later and requires explicit privacy/storage controls.

## Hosted/Vercel state

- `main` remains the Vercel Production Branch.
- PR #81 accepted frontend/source SHA is `fbb5a02e081d4bd634034a9fadd8bb17c3744e4a` and all required PR checks passed before merge.
- Vercel did not deploy PR #81 because the Hobby/free-tier deployment rate limit was reached. GitHub/Vercel status reports `Deployment rate limited — retry in 24 hours.`
- Do **not** purchase or upgrade Vercel to bypass the limit. Retry only after the free-tier build window reopens.
- Until then, PR #78 production deployment `dpl_FZDtqShf29yDPz5nWQ1d8YGRuR5b` remains READY at frontend SHA `5bf64450a598fa19126fc9069632dea2d3cf4601`.
- `lost-paws-one.vercel.app/lostpaws` and `/rave-vendors` remain available from that prior READY frontend but do not yet contain PR #81's new global-nav/homepage changes.
- final `shelterpawtners.com` custom-domain/DNS cutover remains owner-gated.

## Remaining external launch gate

1. After the free-tier Vercel build window reopens, deploy/verify accepted PR #81 SHA `fbb5a02e...` and confirm `lost-paws-one.vercel.app` points to it.
2. Execute real password-recovery acceptance: delivery, `/reset-password`, password update, new-password sign-in, invalid/expired/reused-link behavior.
3. Verify Microsoft 365 human mailbox send/receive remains normal after transactional-email DNS additions.
4. Configure/live-test Google OAuth when provider-console access/tooling is available.
5. Configure/live-test supported Facebook Login when Meta console access/tooling is available.
6. Verify OAuth/email flows do not create duplicate profiles/organizations and preserve persona continuity.
7. Re-run integrated desktop/tablet/mobile/browser acceptance on the final configured release, including PR #81 global navigation and the new homepage launch feature.
8. Present draft Terms/Privacy and owner checklist for owner/legal review; do not publish as final without approval.
9. Prepare but do not perform final production web-domain/custom-domain cutover without separate authorization.

Current connected Supabase tooling still does not expose hosted Google/Meta provider configuration. Meta phone/provider interaction must not block independent repository, database, QA or launch-readiness work.

## Current next sequence

1. Treat PR #81 source as accepted/closed and retry its production deployment only after the Vercel free-tier rate-limit window clears; do not upgrade the plan and do not rewrite accepted code just to force a build.
2. Continue Issue #56's actual scheduler/delivery worker only through a repository-backed, least-privilege mechanism when a supported runtime is available.
3. Once PR #81 is hosted, run integrated desktop/tablet/mobile/browser acceptance with special attention to navigation density, signed-in Account/Help/Sign out behavior, LostPaws/RAVE links, and the homepage launch feature.
4. Re-check password-recovery/Google/Meta provider tooling each run and act immediately if an authorized prerequisite becomes actionable.
5. Keep legal publication and final production-domain cutover owner-gated.
6. If deployment/scheduler/provider work remains externally blocked, continue useful non-destructive launch verification/documentation rather than improvising privileged production mechanisms.

## Guardrails still in force

Never:

- purchase/upgrade paid services without owner approval;
- make destructive production-data changes;
- alter Microsoft 365 mail DNS;
- decide OD-003 or OD-004;
- weaken tests or RLS;
- publish unapproved final Terms/Privacy;
- expose secrets;
- perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate authorization.
