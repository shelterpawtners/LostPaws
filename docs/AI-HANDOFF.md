# AI Handoff

STATUS: EXTERNAL_LAUNCH_GATE_WITH_ACTIVE_UX_AND_LOSTPAWS_CAMPAIGN_WORK
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Password-recovery acceptance + launch UX polish + support intake UI + bounded LostPaws/RAVE campaign slice
NEXT_CHECKPOINT: Google OAuth, Facebook auth, integrated acceptance, legal owner review, cutover prep
OWNER_DECISION_REQUIRED: YES_FOR_PROVIDER_CONSOLES_AND_FINAL_CUTOVER_ONLY
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: fae7a4cf7a24117868558f7cc4b65987e6e40928
ACCEPTANCE_RUNTIME: VERCEL_PRODUCTION

## Completed engineering

LL-1 through LL-6 remain accepted. Do not reopen them without regression evidence.

- Issue #49 / PR #50 — multi-photo Pet Passport + Guardian activity timeline — complete and merged.
- Issue #51 / PR #52 — Guardian Deal Moments — complete and merged to `main` at `fae7a4cf7a24117868558f7cc4b65987e6e40928`.
- PR #57 — MVP Support OS foundation and guardrails — all six required gates green and merged to `main` at `4e7d0397503192e22e1175eacb732e9e5051d709`.
- Support migration `20260911002000_mvp_support_os_foundation.sql` is live in shared dev with reporter ownership/read boundaries, append-only reporter messages, and privileged internal triage policies.

## Auth/email progress complete

Owner completed the following hosted prerequisites on 2026-09-10:

1. Resend free-tier setup complete.
2. `auth.shelterpawtners.com` verified with transactional-email-only DNS records.
3. Microsoft 365 inbound/human mail DNS intentionally left unchanged.
4. Supabase custom SMTP enabled with `ShelterPawtners <noreply@auth.shelterpawtners.com>`.
5. Supabase Site URL changed to `https://lost-paws-one.vercel.app`.
6. Production Vercel redirect wildcard replaced by exact pre-cutover routes; localhost wildcard remains only for development.
7. Hosted Auth visually verified: signup, Confirm Email and Email provider enabled.
8. Real Guardian signup delivered external confirmation email through Supabase/Resend.
9. Confirmation link returned the Guardian to expected Pet Basics/onboarding.

Do not reopen Resend/domain/SMTP/Guardian-confirmation work unless regression evidence appears.

## Remaining external launch gate

1. Execute real password-recovery acceptance: delivery, `/reset-password`, update, new-password sign-in, invalid/expired-link behavior.
2. Verify Microsoft 365 human mailbox send/receive still behaves normally after transactional-email DNS additions.
3. Configure/live-test Google OAuth when provider-console credentials/access are available.
4. Configure/live-test supported Facebook Login when Meta console access is available.
5. Verify OAuth/email flows do not create duplicate profiles/organizations and preserve persona continuity.
6. Re-run integrated desktop/mobile/browser acceptance on the final configured release.
7. Present draft Terms/Privacy for owner review; do not publish as final without approval.
8. Prepare but do not perform final `shelterpawtners.com` web-domain DNS/custom-domain cutover without separate authorization.

## Issue #53 — active launch UX polish

Owner direction remains hybrid consumer/dashboard leaning consumer-app, no Figma prerequisite.

Priority order:
1. Remove misleading Guardian pet `Contact email` / `Instagram profile` fields; `save_guardian_onboarding_pet` persists neither and communications belong to the responsible Guardian/Shelter contact.
2. Compact Guardian shell + avatar/account menu.
3. Add authenticated `Help & feedback` entry and then bounded support-ticket submission/status UI against live Support OS tables.
4. Photo-forward Guardian dashboard / Pet Passport density.
5. Marketplace density/grid-list presentation refactor while preserving RPC/search/filter/source/claim behavior and truthful eligibility.

The old `ux/guardian-marketplace-launch-polish` branch remains one documentation commit ahead and several main commits behind. Do not force-reset or rewrite history. A fresh `ux/marketplace-density-slice` branch was created from current `main` on 2026-09-10 for low-conflict Marketplace work; it currently contains no code changes and may be used or discarded through normal PR flow.

## LostPaws / RAVE Shelter campaign work

Issue #58 is now the source for the bounded `/lostpaws` campaign landing page. Owner direction is locked in `docs/LOSTPAWS-RAVE-LANDING-DIRECTION.md` (main commit `828072c92f1ba4ac1bf1edc12f47a63aaeecb443`).

Locked direction:
- canonical QR destination: `https://shelterpawtners.com/lostpaws`;
- owner-supplied 16:9 LostPaws artwork is the exact top banner/hero and must not be generatively redrawn;
- `/lostpaws` must not use the normal ShelterPawtners global header/navigation;
- visual language may borrow premium bass/festival pacing and dark/neon editorial energy but must not copy Lost Lands assets/layout/code or imply official collaboration;
- avoid generic AI-generated festival imagery; prefer locked brand art, hand-built CSS/graphics, real vendor marks where rights permit, real pet/shelter photography and real product UI;
- RAVE Shelter — Rescue and Adoption Vendor Ecosystem — is the product/story priority immediately after the banner;
- primary raver path: current RAVE/community offers; secondary Guardian/Pet Passport path;
- visible vendor CTA: `Join RAVE Shelter for the festival`, initially routing to existing `rave_vendor` onboarding;
- footer must explicitly state independent/non-affiliated status with Lost Lands, Excision and affiliates.

Issue #54 now carries the separate RAVE Shelter vendor acquisition page plus lightweight stories/announcements roadmap. Do not add a paid/full CMS as an MVP prerequisite.

Binary asset constraint: GitHub text/content connector cannot safely ingest the owner-supplied PNG through the current text-file write path. Do not substitute an AI recreation. Continue route/layout/code around an explicit asset path only when exact binary ingestion is available through an authorized path.

## Support OS

Issue #56 remains open for UI/intake/automation slices. Foundation is live in shared dev:
- `support_tickets`, `support_ticket_messages`, `support_ticket_events`;
- reporter-owned ticket creation/read boundaries;
- reporter-visible append-only messages;
- privileged internal event/admin triage;
- raw support content/PII must never auto-mirror to GitHub.

## Connected tooling recheck — 2026-09-10

- GitHub: connected and authoritative.
- Vercel: connected; project `lost-paws` is linked to `shelterpawtners/LostPaws` on Hobby. Runtime-error check for the latest 24h returned **no runtime errors**.
- Vercel deployments after accepted release continue to show `CANCELED` under the existing capacity/build-rate-limit pattern; accepted production deployment at `fae7a4cf...` remains the last READY production candidate in the returned deployment set. Do not purchase/upgrade.
- Plugin directory re-check for Resend, Supabase, Vercel, Google OAuth, Meta/Facebook, DNS and browser automation returned no newly actionable provider plugin. Do not install unrelated plugins automatically.
- Supabase remains connected from prior runs; hosted Auth provider/Site-URL console writes are still not exposed through the current connector surface.
- Figma remains unnecessary by owner direction.

## Protected restrictions

Never purchase/upgrade paid services, make destructive production-data changes, alter Microsoft 365 mail DNS, decide OD-003 or OD-004, weaken tests/RLS, publish unapproved final Terms/Privacy, expose secrets, or perform final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate owner authorization.

## Next safe action

1. Continue Issue #53 through a low-conflict engineering slice from current `main`: misleading Guardian pet contact/social field removal or Marketplace density presentation work.
2. Coordinate the authenticated avatar/user-menu shell with Issue #56 `Help & feedback` intake so shell work is not duplicated.
3. Begin Issue #58 route/layout implementation as soon as exact approved LostPaws binary artwork can be placed in the repository through an authorized binary-capable path; do not recreate the image.
4. Continue Issue #54 vendor-page copy/IA and route planning independently of the binary asset blocker.
5. Re-check password-recovery/Google/Meta/provider tooling each run; act immediately if an authorized provider prerequisite becomes actionable.
6. Keep final production-domain cutover and final legal publication owner-gated.
