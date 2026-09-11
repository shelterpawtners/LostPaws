# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

Lost Lands MVP LL-1 through LL-6 are **accepted** and must not be reopened without regression evidence.

**Current state: launch readiness with active Support OS follow-up plus external provider acceptance gates.**

Production web-domain cutover and Phase 3 remain explicitly owner-gated.

Current accepted application baseline: `54628c2b5ab831d203ffc8413920b4431e78b979`.

## Accepted launch-readiness engineering

The authoritative detailed history remains in `docs/AI-HANDOFF.md` and the relevant GitHub issues/PRs. Current accepted post-MVP work includes:

- Pet Passport multi-photo/activity improvements.
- Guardian Deal Moments.
- denser Marketplace presentation.
- LostPaws campaign landing.
- RAVE Shelter vendor acquisition surface.
- Support OS foundation, runbooks, Help & feedback intake/status, duplicate/digest plumbing, privacy-safe triage queue, fingerprint hardening and private classification/owner digest.
- Guardian pet-contact correction.
- compact Guardian account/avatar menu with Help & feedback reuse.
- private Guardian profile avatar upload/persistence.
- Support OS release-context capture via PR #77: Help & feedback submissions now populate the existing `support_tickets.app_release` field from the deployed build commit identifier.
- launch legal-review checklist; draft Terms/Privacy remain unapproved and must not be published as final.
- current frontend-core dependency update from PR #21; all repository gates passed before merge.

Issue #53 is **closed/completed** in GitHub. Do not reopen or extend it without regression evidence or a new explicit follow-up issue.

Do not reopen any other accepted slice without evidence of a regression.

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

Completed through PR #77:

1. authenticated Help & feedback intake/status under RLS;
2. privacy-safe duplicate, aging, triage, classification and owner-digest views;
3. bounded human-escalation policy with no autonomous closure/fix behavior;
4. release/version context now captured in the existing `app_release` field for new support reports.

Current safe follow-up:

1. Add repository-backed, least-privilege scheduling/delivery for the already-private classification/digest outputs.
2. Add regression for cross-day aging persistence and escalation behavior.
3. Keep privacy/P0/P1 cases human-gated; never auto-close or auto-fix them.
4. Optional screenshot/storage support remains later and requires explicit privacy/storage controls.

Live shared-dev preflight on 2026-09-11 found neither `pg_cron` nor `pg_net` currently enabled and no existing support-digest Edge Function to reuse. Do not assume scheduled delivery exists. Any scheduler introduction must be repository-backed, generated through the normal migration workflow, tested and least-privilege rather than an ad-hoc shared-dev-only change.

## Hosted/Vercel state

- `main` remains the Vercel Production Branch.
- PR #77 passed all six required repository gates and squash-merged at `54628c2b5ab831d203ffc8413920b4431e78b979`.
- Vercel production deployment `dpl_79DAvPwJRAsycmdxBJVWzLLAK8Fd` is READY for that exact merge SHA.
- `lost-paws-one.vercel.app` now points to the current accepted production deployment.
- hosted checks on the current production alias return HTTP 200 for `/lostpaws` and `/rave-vendors`.
- Vercel reports no runtime errors in the last 24 hours.
- the prior production-freshness gap is therefore resolved; later docs-only `main` commits may still be intentionally skipped by the Ignored Build Step.
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

1. Continue Issue #56 only with repository-backed, privacy-safe scheduling/delivery and cross-day aging/escalation regression. Do not improvise shared-dev-only scheduler DDL.
2. Use the current READY production candidate for integrated desktop/mobile/browser acceptance when an executable browser-capable surface is available.
3. Re-check password-recovery/Google/Meta provider tooling each run and act immediately if an authorized prerequisite becomes actionable.
4. Keep legal publication, Phase 3 and final production-domain cutover owner-gated.
5. If additional Guardian photo-forward UX is desired after completed Issue #53, create a new explicit follow-up issue rather than silently reopening #53.

## Guardrails still in force

Never:

- purchase/upgrade paid services without owner approval;
- make destructive production-data changes;
- alter Microsoft 365 mail DNS;
- decide OD-003 or OD-004;
- weaken tests or RLS;
- publish unapproved final Terms/Privacy;
- expose secrets;
- perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate authorization;
- begin separately owner-gated Phase 3 work merely because launch-readiness engineering is otherwise complete.
