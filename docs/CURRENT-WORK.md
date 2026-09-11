# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

Lost Lands MVP LL-1 through LL-6 are **accepted** and must not be reopened without regression evidence.

**Current state: launch readiness with one remaining Support OS delivery-runtime gap plus external provider acceptance gates.**

Current accepted repository baseline: `1443d7138d923033bb4e9c20ab8971a49647eefb` (PR #79).

Current deployed frontend baseline: `5bf64450a598fa19126fc9069632dea2d3cf4601` (PR #78), READY on Vercel production.

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
- launch legal-review checklist; draft Terms/Privacy remain unapproved and must not be published as final.

Issue #53 remains **closed/completed**. PR #78 was a separate owner-directed follow-up and does not reopen that issue.

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

Supabase remains the operational source of truth. Raw support content/PII must never auto-mirror to GitHub.

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
- PR #78 production deployment `dpl_FZDtqShf29yDPz5nWQ1d8YGRuR5b` is READY at frontend SHA `5bf64450a598fa19126fc9069632dea2d3cf4601`.
- `lost-paws-one.vercel.app/lostpaws` returns HTTP 200.
- `lost-paws-one.vercel.app/rave-vendors` returns HTTP 200.
- Vercel reports no runtime errors in the last 24 hours.
- PR #79 changes only Supabase migration/test files; ignored/canceled Vercel previews for those commits are not application failures.
- final `shelterpawtners.com` custom-domain/DNS cutover remains owner-gated.

## Remaining external launch gate

1. Execute real password-recovery acceptance: delivery, `/reset-password`, password update, new-password sign-in, invalid/expired/reused-link behavior.
2. Verify Microsoft 365 human mailbox send/receive remains normal after transactional-email DNS additions.
3. Configure/live-test Google OAuth when provider-console access/tooling is available.
4. Configure/live-test supported Facebook Login when Meta console access/tooling is available.
5. Verify OAuth/email flows do not create duplicate profiles/organizations and preserve persona continuity.
6. Re-run integrated desktop/mobile/browser acceptance on the final configured release.
7. Present draft Terms/Privacy and owner checklist for owner/legal review; do not publish as final without approval.
8. Prepare but do not perform final production web-domain/custom-domain cutover without separate authorization.

Current connected Supabase tooling still does not expose hosted Google/Meta provider configuration. A fresh plugin search on 2026-09-11 did not surface a usable Meta/Facebook, Google OAuth, Resend or DNS/domain-management provider plugin. Meta phone/provider interaction must not block independent repository, database, QA or launch-readiness work.

## Current next sequence

1. Implement Issue #56's actual scheduler/delivery worker only through a repository-backed, least-privilege mechanism when a supported runtime is available.
2. Use the current READY production candidate for integrated desktop/mobile/browser acceptance when an executable browser-capable surface is available.
3. Re-check password-recovery/Google/Meta provider tooling each run and act immediately if an authorized prerequisite becomes actionable.
4. Keep legal publication and final production-domain cutover owner-gated.
5. If scheduler/provider work remains externally blocked, continue useful non-destructive launch verification/documentation rather than improvising privileged production mechanisms.

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
