# AI Handoff

STATUS: EXTERNAL_LAUNCH_GATE_WITH_ACTIVE_UX_AND_SUPPORT_WORK
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Guardian launch UX + support intake UI + auth acceptance
NEXT_CHECKPOINT: Google OAuth, Facebook auth, integrated acceptance, legal owner review, cutover prep
OWNER_DECISION_REQUIRED: YES_FOR_PROVIDER_CONSOLES_AND_FINAL_CUTOVER_ONLY
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: 84a9786f5a25716b053614b3729a765a374f0baf
ACCEPTANCE_RUNTIME: REPOSITORY_GATES_GREEN_WITH_VERCEL_FREE_TIER_DEPLOY_LIMIT

## Completed engineering

LL-1 through LL-6 remain accepted. Do not reopen them without regression evidence.

- Issue #49 / PR #50 — multi-photo Pet Passport + Guardian activity timeline — complete and merged.
- Issue #51 / PR #52 — Guardian Deal Moments — complete and merged.
- PR #57 — MVP Support OS foundation and guardrails — all six required gates green and merged; support migration `20260911002000_mvp_support_os_foundation.sql` is live in shared dev.
- Issue #53 Marketplace density slice — PR #59 merged to `main` at `50f328f0d50f30b3bd78dc70064a094dea451da7` after all six required gates passed.
- Issue #58 LostPaws campaign landing page — PR #60 passed CI, Hosted QA, Database QA, Persona QA, Dependency Review and Merge Gate, then squash-merged to `main` at `d67d6b072ef258e64aa166edfdf16592d078ba75`.
  - Exact owner-supplied LostPaws banner is now stored at `public/brand/lostpaws-hero-16x9.png` and referenced locally by `/lostpaws`.
  - The prior binary-ingestion blocker is resolved. Do not recreate, compress, resize or generatively alter the locked artwork.
  - Hosted PR preview returned HTTP 200 and rendered the expected RAVE Shelter / raver / vendor / Pet Passport CTA structure before merge.
- Issue #54 RAVE Shelter vendor acquisition page — stacked PR #61 became non-mergeable after PR #60 was squash-merged, so it was closed without force/history rewrite. Clean PR #62 was rebuilt from current `main`, passed all six required repository gates, and squash-merged to `main` at `84a9786f5a25716b053614b3729a765a374f0baf`.
  - `/rave-vendors` is a standalone fast-conversion vendor page using existing RAVE brand assets, existing `rave_vendor` onboarding, truthful participation language and explicit non-affiliation wording.

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

Completed: Marketplace density/grid-list presentation via PR #59.

Active order:

1. Remove misleading Guardian pet `Contact email` / `Instagram profile` fields; `save_guardian_onboarding_pet` persists neither and communications belong to the responsible Guardian/Shelter contact.
2. Compact Guardian shell + avatar/account menu.
3. Add authenticated `Help & feedback` entry and then bounded support-ticket submission/status UI against live Support OS tables.
4. Photo-forward Guardian dashboard / Pet Passport density.

Issue #53 has now been assigned to GitHub Copilot cloud agent after the bounded pet-contact-field instructions were posted. Do not start an overlapping edit on the same files while that agent task is active. Review its resulting PR against the existing guardrails and merge only after the required gates are green.

## LostPaws / RAVE Shelter campaign work

Issue #58 repository implementation is integrated. The canonical planned public QR destination remains `https://shelterpawtners.com/lostpaws`; final custom-domain/DNS cutover remains owner-gated.

Locked direction remains:

- exact owner artwork; no generative redraw or alteration;
- no normal ShelterPawtners global header/navigation on `/lostpaws`;
- premium dark/festival-aware pacing without copying Lost Lands assets/layout/code or implying official collaboration;
- RAVE Shelter — Rescue and Adoption Vendor Ecosystem — immediately after the banner;
- clear raver, vendor and Guardian/Pet Passport paths;
- explicit Lost Lands/Excision non-affiliation wording.

Issue #54 vendor acquisition implementation is integrated via PR #62. Lightweight stories/announcements remains roadmap work and must not add a paid/full CMS MVP dependency.

## Support OS

Issue #56 remains open for UI/intake/automation slices. Foundation is live in shared dev:

- `support_tickets`, `support_ticket_messages`, `support_ticket_events`;
- reporter-owned ticket creation/read boundaries;
- reporter-visible append-only messages;
- privileged internal event/admin triage;
- raw support content/PII must never auto-mirror to GitHub.

Coordinate the authenticated avatar/user-menu work in Issue #53 with the `Help & feedback` entry for Issue #56 so the shell is built once.

## Connected tooling recheck — 2026-09-11

- GitHub: connected and authoritative; repository mutations, CI inspection and Copilot cloud-agent issue assignment are actionable.
- Vercel: connected. PR #60 obtained a READY hosted preview and `/lostpaws` returned HTTP 200. Subsequent PR #62 preview creation hit the Hobby/free-tier daily deployment limit (`api-deployments-free-per-day`, more than 100). Do not purchase/upgrade. Treat this as a transient external deployment blocker only; continue independent engineering and repository QA.
- Supabase remains connected from prior runs; hosted Auth provider-console writes are not currently exposed through the available connector surface.
- Google OAuth and Meta/Facebook live configuration still require authorized provider-console access/credentials.
- Figma remains unnecessary by owner direction.

## Protected restrictions

Never purchase/upgrade paid services, make destructive production-data changes, alter Microsoft 365 mail DNS, decide OD-003 or OD-004, weaken tests/RLS, publish unapproved final Terms/Privacy, expose secrets, or perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate owner authorization.

## Next safe action

1. Monitor the active Issue #53 Copilot task and review its focused Guardian pet-contact-field PR when created; fix only evidenced bounded defects and merge when required gates are green.
2. After that slice lands, continue the compact Guardian avatar/account-menu shell and coordinate `Help & feedback` with Issue #56 without duplicating UI infrastructure.
3. Continue Issue #56 support intake/status UI against the already-live Support OS tables, preserving RLS and no-PII-to-GitHub rules.
4. Re-check Vercel availability each run; when free-tier capacity resets, verify `/lostpaws` and `/rave-vendors` visually on desktop/mobile without purchasing an upgrade.
5. Re-check password-recovery/Google/Meta provider tooling each run and act immediately if an authorized prerequisite becomes actionable.
6. Keep final production-domain cutover and final legal publication owner-gated.
