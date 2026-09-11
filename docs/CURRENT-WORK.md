# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

Lost Lands MVP LL-1 through LL-6 are **accepted** and must not be reopened without regression evidence.

**Current state: launch readiness with active Guardian UX / Support OS follow-up plus external provider acceptance gates.**

Production web-domain cutover and Phase 3 remain explicitly owner-gated.

Current `main` SHA: `cfe94db48b5b80435adb9f78e413a208971d6f83`.

## Accepted launch-readiness engineering

The authoritative detailed history remains in `docs/AI-HANDOFF.md`. Current accepted post-MVP work includes:

- Pet Passport multi-photo/activity improvements.
- Guardian Deal Moments.
- denser Marketplace presentation.
- LostPaws campaign landing.
- RAVE Shelter vendor acquisition surface.
- Support OS foundation, runbooks, Help & feedback intake/status, duplicate/digest plumbing, privacy-safe triage queue, fingerprint hardening and private classification/owner digest.
- Guardian pet-contact correction.
- compact Guardian account/avatar menu with Help & feedback reuse.
- private Guardian profile avatar upload/persistence.
- launch legal-review checklist; draft Terms/Privacy remain unapproved and must not be published as final.
- current frontend-core dependency update from PR #21; all repository gates passed before merge.

Do not reopen accepted slices without evidence of a regression.

## Auth/email status

Completed hosted prerequisites:

- Resend free-tier setup is complete.
- `auth.shelterpawtners.com` transactional-email-only DNS is verified.
- Microsoft 365 inbound/human-mail DNS remains intentionally unchanged.
- Supabase custom SMTP is enabled with `ShelterPawtners <noreply@auth.shelterpawtners.com>`.
- Supabase Site URL targets the hosted QA application.
- real Guardian signup/confirmation through Supabase + Resend was accepted.

Do not redo Resend/domain/SMTP/Guardian-confirmation work without regression evidence.

## Active Issue #53 — Guardian launch UX

Next safe order:

1. Surface the existing private Guardian avatar in the account menu without duplicating profile/storage state.
2. Replace generic pet-card iconography with existing primary pet media where available while preserving private signed-media semantics.
3. Continue compact, photo-forward Guardian dashboard / Pet Passport density with mobile-first coverage.
4. Add bounded first-use/settings guidance only after the photo-forward shell remains green.

Do not introduce Figma as a prerequisite and do not make role management prominent on the ordinary Guardian surface.

## Active Issue #56 — Support OS

Supabase remains the operational source of truth. Raw support content/PII must never auto-mirror to GitHub.

Current safe follow-up:

1. Add bounded scheduling/delivery for the already-private classification/digest outputs.
2. Add regression for cross-day aging persistence and escalation behavior.
3. Keep privacy/P0/P1 cases human-gated; never auto-close or auto-fix them.
4. Optional screenshot/storage support remains later and requires explicit privacy/storage controls.

Live shared-dev preflight on 2026-09-11 found neither `pg_cron` nor `pg_net` currently enabled. Do not assume scheduled delivery exists. Any scheduler introduction must be repository-backed, tested and least-privilege rather than an ad-hoc production-only change.

## Hosted/Vercel state

- `main` remains the Vercel Production Branch.
- newest visible Vercel deployment is a READY PR #21 preview for commit `69d292b0ec6046029e6192d2aeefc996a91157c4`.
- current merged `main` is `cfe94db48b5b80435adb9f78e413a208971d6f83`.
- latest visible READY **production-target** deployment remains older (`8606424b7a655c68b9e25737eb063db7ad86af7e`).
- recent `main` production attempts were skipped/canceled by the configured Ignored Build Step; production freshness remains a launch-readiness item, not a reason to purchase an upgrade.
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

Current connected tooling does not expose hosted Google/Meta provider configuration. Meta phone/provider interaction must not block independent repository, database, QA or launch-readiness work.

## Current next sequence

1. Continue Issue #53 photo-forward Guardian UX using existing private avatar/pet media state.
2. Continue Issue #56 only with privacy-safe bounded scheduling/delivery and aging/escalation regression.
3. Reconcile Vercel production freshness and obtain a current READY hosted candidate without purchasing/upgrading or performing final domain cutover.
4. Re-check password-recovery/Google/Meta provider tooling each run and act immediately if an authorized prerequisite becomes actionable.
5. Keep legal publication, Phase 3 and final production-domain cutover owner-gated.

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
