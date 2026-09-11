# AI Handoff

STATUS: EXTERNAL_LAUNCH_GATE_WITH_ACTIVE_GUARDIAN_UX_WORK
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Guardian launch UX + password-recovery/provider acceptance
NEXT_CHECKPOINT: Google OAuth, Facebook auth, integrated browser/mobile acceptance, owner legal review, cutover prep
OWNER_DECISION_REQUIRED: YES_FOR_PROVIDER_CONSOLES_AND_FINAL_CUTOVER_ONLY
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: 6b4794c38e42e64ce020482cda3868d4d1df1f38
ACCEPTANCE_RUNTIME: REPOSITORY_GATES_GREEN; VERCEL_DAILY_FREE_TIER_LIMIT_FOR_NEW_DEPLOYS

## Completed engineering

LL-1 through LL-6 remain accepted. Do not reopen them without regression evidence.

Post-MVP launch-readiness slices integrated:

- Issue #49 / PR #50 — multi-photo Pet Passport + Guardian activity timeline.
- Issue #51 / PR #52 — Guardian Deal Moments.
- Issue #53 Marketplace density — PR #59.
- Issue #58 LostPaws campaign landing — PR #60; exact owner artwork remains locked at `public/brand/lostpaws-hero-16x9.png`.
- Issue #54 RAVE Shelter vendor acquisition — PR #62.
- Issue #56 Support OS foundation/runbooks — PRs #57, #63 and #64.
- Issue #56 Guardian Help & feedback intake/status UI — PR #66, merged at `3c3e570f72999a64451bc684d4567de7d539a34d`.
- Issue #56 duplicate/daily-digest foundation — PR #67, all six required gates green and squash-merged at `748fefec56fe49b4300b5a9e3f03e6beb4911a72`.
  - shared-dev migration `20260911062258_support_triage_digest_foundation` is applied;
  - reporter inserts can no longer self-assign `duplicate_group_key`;
  - `private.support_ticket_fingerprint(...)` provides deterministic grouping evidence only;
  - `private.support_duplicate_candidates` exposes aggregate duplicate candidates without reporter identity or raw ticket text;
  - `private.support_daily_digest` exposes aggregate counts/aging without reporter identity or raw ticket text;
  - `anon` and `authenticated` browser roles cannot read those private views;
  - direct shared-dev verification and pgTAP Database QA passed.
- Issue #56 privacy-safe advisory triage queue — PR #68, all six required gates green and squash-merged at `045a592449441b398e7732d4a206cd77ab2ffc7f`.
  - repository migration `20260911072000_support_triage_queue` is now applied to shared dev after an autonomous reconciliation found the accepted migration had been missed operationally;
  - `private.support_triage_queue` ranks unresolved work using only safe metadata, duplicate evidence, aging and required-human-review signals;
  - privacy/safety cases always recommend human escalation, and the queue performs no ticket mutation, auto-close or auto-fix;
  - `anon` and `authenticated` browser roles cannot read the queue, and pgTAP coverage verifies its privacy, duplicate and aging boundaries.
- Issue #53 private Guardian profile avatar — PR #72, all six required gates plus CodeQL green and squash-merged at `af32593c8abd2727b8c9b5c844a32e17425cd680`.
  - reuses canonical `profiles.avatar_path` rather than introducing a parallel identity/media model;
  - shared-dev migration `guardian_profile_avatar_storage` is applied;
  - private `profile-avatars` Storage bucket is limited to JPEG/PNG/WebP up to 5 MB;
  - owner-folder Storage policies gate read/insert/update/delete to the authenticated user;
  - Guardian private profile now uploads and previews the avatar through signed URLs;
  - pgTAP and Playwright cover Storage boundaries plus avatar upload/reload persistence.
- Issue #56 support fingerprint search-path hardening — PR #74, all six required gates plus CodeQL green and squash-merged at `6b4794c38e42e64ce020482cda3868d4d1df1f38`.
  - `private.support_ticket_fingerprint(text,text,text)` now pins `search_path = pg_catalog` without changing deterministic grouping behavior;
  - exact migration is applied to shared dev;
  - fresh Supabase security-advisor output no longer reports this helper for mutable search path;
  - pgTAP verifies both the pinned search path and unchanged normalization behavior.
- Launch legal-review checklist — PR #65. Draft Terms/Privacy remain unapproved and must not be published as final.

## Auth/email progress complete

Owner completed the following hosted prerequisites on 2026-09-10:

1. Resend free-tier setup complete.
2. `auth.shelterpawtners.com` verified with transactional-email-only DNS records.
3. Microsoft 365 inbound/human mail DNS intentionally left unchanged.
4. Supabase custom SMTP enabled with `ShelterPawtners <noreply@auth.shelterpawtners.com>`.
5. Supabase Site URL set to `https://lost-paws-one.vercel.app`.
6. Production Vercel redirect wildcard replaced by exact pre-cutover routes; localhost remains development-only.
7. Real Guardian signup delivered confirmation through Supabase/Resend and returned to expected Pet Basics/onboarding.

Do not reopen Resend/domain/SMTP/Guardian-confirmation work without regression evidence.

## Remaining external launch gate

1. Execute real password-recovery acceptance: delivery, `/reset-password`, update, new-password sign-in, invalid/expired/reused-link behavior.
2. Verify Microsoft 365 human mailbox send/receive still behaves normally after transactional-email DNS additions.
3. Configure/live-test Google OAuth when provider-console credentials/access are available.
4. Configure/live-test supported Facebook Login when Meta console access is available.
5. Verify OAuth/email flows do not create duplicate profiles/organizations and preserve persona continuity.
6. Re-run integrated desktop/mobile/browser acceptance on the final configured release.
7. Present draft Terms/Privacy plus owner checklist for owner/legal review; do not publish as final without approval.
8. Prepare but do not perform final `shelterpawtners.com` web-domain DNS/custom-domain cutover without separate authorization.

## Issue #53 — active launch UX polish

Owner direction remains hybrid consumer/dashboard leaning consumer-app; no Figma prerequisite.

Completed:

- Marketplace density/grid-list via PR #59.
- Reusable Support intake/status component plus Guardian-profile Help & feedback entry via PR #66.
- Guardian pet-contact correction via PR #69, squash-merged at `8606424b7a655c68b9e25737eb063db7ad86af7e`; Guardian Pet Basics no longer renders pet-level contact email/social fields while the save RPC, authenticated account email and organization-contact inputs remain unchanged.
- Compact Guardian shell/account menu via PR #70, squash-merged at `8147d35fed4f8ac63ad71346152b1daaf7c85f0f`; the account control includes the primary Help & feedback entry by reusing the Support OS component.
- Private Guardian avatar upload/persistence via PR #72, squash-merged at `af32593c8abd2727b8c9b5c844a32e17425cd680`.

Active order:

1. Surface the now-real Guardian avatar in the account menu without duplicating profile/storage state.
2. Replace generic pet-card iconography with existing primary pet media where available and keep signed/private media semantics intact.
3. Continue compact, photo-forward Guardian dashboard / Pet Passport density with mobile-first coverage and no role-management prominence on the ordinary Guardian surface.
4. Add bounded first-use/settings guidance only after the photo-forward shell remains green.

GitHub Copilot cloud-agent execution is blocked by insufficient GitHub AI Credits. Do not repeatedly retry it. Use direct bounded repository work here; use Work only for high-leverage browser/visual/provider-console tasks.

## Support OS

Operational source of truth remains Supabase. Raw support content/PII must never auto-mirror to GitHub.

Completed:

- `support_tickets`, `support_ticket_messages`, `support_ticket_events` under RLS;
- Guardian categorized intake/status UI;
- primary Guardian account-menu Help & feedback entry;
- support operating model, severity, AI guardrails, human escalation, notification policy and domain/persona runbooks;
- sanitized engineering-handoff contract;
- reporter duplicate-group hardening;
- privacy-safe duplicate-candidate and daily-digest aggregate database plumbing;
- privacy-safe advisory triage queue for unresolved work; it retains human escalation for privacy/safety/account cases and never mutates or resolves tickets;
- deterministic fingerprint helper now uses a pinned `pg_catalog` search path, with shared-dev advisor evidence and pgTAP regression coverage.

Remaining Issue #56 focus:

1. bounded classification/digest automation consuming the private aggregate sources;
2. regression for classification/digest scheduling and aging behavior;
3. optional screenshot/storage support only later, after explicit privacy/storage controls.

AI must not auto-implement arbitrary suggestions, auto-close potential security/privacy issues, mutate destructive production data, or treat a fingerprint/duplicate signal as sufficient resolution evidence.

## Legal review readiness

- `docs/legal/DRAFT-TERMS-OF-SERVICE.md` — owner/legal review required.
- `docs/legal/DRAFT-PRIVACY-NOTICE.md` — owner/legal review required.
- `docs/legal/OWNER-LEGAL-REVIEW-CHECKLIST.md` — prepared.

Do not decide legal entity/contact identity, minimum age, governing law, arbitration/class-action approach, retention/deletion policy, jurisdictional privacy obligations, OD-003 or OD-004 through automation.

## Connected tooling recheck — 2026-09-11

- GitHub: connected and authoritative for repository operations/CI. GitHub AI coding credits remain unavailable.
- Supabase: connected and actionable for SQL/migrations. Shared dev is reconciled through the accepted Support OS triage queue, fingerprint hardening and Guardian avatar storage; hosted Auth provider-console writes are still not exposed by the current connector surface.
- Vercel: connected, but recent preview creation continues to hit the Hobby/free-tier daily deployment limit. Do not purchase/upgrade; treat as transient only.
- No currently available provider-console plugin exposes Google OAuth, Meta/Facebook, DNS or Resend console configuration in this automation runtime.
- Browser automation in an interactive ChatGPT Work session remains preferred for provider consoles, real password-recovery acceptance, visual QA and multi-step hosted acceptance.

## Protected restrictions

Never purchase/upgrade paid services, make destructive production-data changes, alter Microsoft 365 mail DNS, decide OD-003 or OD-004, weaken tests/RLS, publish unapproved final Terms/Privacy, expose secrets, or perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate owner authorization.

## Next safe action

1. Continue Issue #53 with account-menu real-avatar rendering and primary-pet-media thumbnails in a focused photo-forward follow-up, preserving private signed-media semantics and existing Passport/Deal Moments/RLS coverage.
2. Continue Issue #56 classification/digest automation only through privacy-minimized aggregate sources and explicit human escalation boundaries.
3. Re-check Vercel capacity each run; after capacity resets, perform integrated hosted desktop/mobile visual acceptance for `/lostpaws`, `/rave-vendors`, Guardian onboarding, Marketplace, Passport, shelter verification and Help & feedback without purchasing an upgrade.
4. Re-check password-recovery/Google/Meta provider tooling each run and act immediately if an authorized prerequisite becomes actionable.
5. Keep legal publication and final production-domain cutover owner-gated.
