# AI Handoff

STATUS: EXTERNAL_LAUNCH_GATE_WITH_ACTIVE_UX_POLISH
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Password-recovery acceptance + launch UX polish + support intake UI
NEXT_CHECKPOINT: Google OAuth, Facebook auth, integrated acceptance, legal owner review, cutover prep
OWNER_DECISION_REQUIRED: YES_FOR_PROVIDER_CONSOLES_AND_FINAL_CUTOVER_ONLY
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: fae7a4cf7a24117868558f7cc4b65987e6e40928
ACCEPTANCE_RUNTIME: VERCEL_PRODUCTION

## Completed engineering

LL-1 through LL-6 remain accepted. Do not reopen them without regression evidence.

- Issue #49 / PR #50 — multi-photo Pet Passport + Guardian activity timeline — complete and merged.
- Issue #51 / PR #52 — Guardian Deal Moments — complete and merged to `main` at `fae7a4cf7a24117868558f7cc4b65987e6e40928`.
- PR #57 — MVP Support OS foundation and guardrails — all six required final-head gates green and merged to `main` at `4e7d0397503192e22e1175eacb732e9e5051d709` on 2026-09-10.
- Support migration `20260911002000_mvp_support_os_foundation.sql` was applied successfully to shared dev Supabase on 2026-09-10 after the green merge. Live policy inspection confirmed reporter insert/read boundaries, reporter-visible append-only message access, and platform-admin management policies.

## Auth/email progress now complete

Owner completed the following hosted launch prerequisites on 2026-09-10:

1. Resend free-tier setup complete.
2. `auth.shelterpawtners.com` verified with transactional-email-only DNS records.
3. Microsoft 365 inbound/human mail DNS intentionally left unchanged.
4. Supabase custom SMTP enabled with `ShelterPawtners <noreply@auth.shelterpawtners.com>`.
5. Supabase Site URL changed from localhost to `https://lost-paws-one.vercel.app`.
6. Production Vercel redirect wildcard removed and replaced by exact pre-cutover paths for Guardian, Shelter, PetBiz, RAVE and reset-password routes. Localhost wildcard remains for development only.
7. Hosted Auth visually verified: new signup enabled, Confirm Email enabled, Email provider enabled.
8. Real Guardian signup delivered the external confirmation email successfully through Supabase/Resend.
9. Confirmation link worked and returned the Guardian to the expected Pet Basics/onboarding flow.

Do not reopen Resend/domain/SMTP/Guardian-confirmation work unless a later regression appears.

## Remaining external launch gate

1. Verify hosted confirmation/recovery templates against repository references if needed.
2. Execute real password-recovery acceptance: delivery, `/reset-password`, update, new-password sign-in, invalid/expired-link behavior.
3. Verify Microsoft 365 human mailbox send/receive still behaves normally after transactional-email DNS additions.
4. Configure and live-test Google OAuth when provider-console credentials/access are available.
5. Configure and live-test supported Facebook Login when Meta console access is available.
6. Verify OAuth/email flows do not create duplicate app profiles/organizations and preserve persona continuity.
7. Re-run integrated desktop/mobile/browser acceptance on the final configured release.
8. Present draft Terms/Privacy for owner review; do not publish as final without approval.
9. Prepare but do not perform the final `shelterpawtners.com` web-domain DNS/custom-domain cutover without separate authorization.

## Active post-MVP launch UX work

Issue #53 — Launch UX polish: Guardian dashboard, Pet Passport identity, Marketplace density — is open and authorized.

Owner acceptance feedback:

- pet signup should not model a fictional pet email; communications should resolve through responsible Guardian/Shelter contact;
- Guardian dashboard is too text-heavy/long and should maximize useful above-the-fold profile/passport/action information;
- Guardian profile photo and pet photos/thumbnails should be prominent;
- Guardian area should use a horizontal navigation separating human Guardian Profile from Pet Passport Profiles;
- ordinary Guardian dashboard should not spend primary real estate on role-management controls;
- Marketplace cards/hero are too large and information-sparse; add denser scan-friendly presentation and grid/list views while preserving truthful eligibility/source behavior;
- owner selected a hybrid consumer-app-leaning design and explicitly rejected Figma as a prerequisite;
- add an avatar/user menu and guided profile-completion/help affordances without notification overload.

Repository/runtime audit findings:

- `OfferMarketplace.tsx` already contains the required behavioral primitives; treat Marketplace work as presentation/information-architecture refactor first, not schema/RPC rewrite.
- Guardian onboarding currently renders generic `Contact email` and `Instagram profile` inputs even though `save_guardian_onboarding_pet` persists neither. Shelter contact email is separately persisted only when adoption confirmation is requested. The Guardian UX fix should remove these misleading pet contact/social fields rather than invent a pet email model.
- Live Supabase schema confirms `profiles.avatar_path` already exists and pet media already has primary-image semantics, so Guardian/photo-forward UX should reuse existing identity/media models.

The `ux/guardian-marketplace-launch-polish` branch exists and contains the approved UX execution plan. It diverged from current `main` after Support OS merged. A manual merge-commit attempt through the connector was safety-blocked, so no force-rewrite was attempted. Continue small low-conflict edits there and reconcile through normal PR flow.

Issue #54 records the RAVE Shelter Lost Lands hub + lightweight stories/announcements roadmap. Do not introduce a paid/full CMS as an MVP prerequisite.

## Support OS work

Issue #56 — MVP Support OS — remains open for subsequent UI/intake/automation slices.

Foundation is now live in shared dev:

- `support_tickets`, `support_ticket_messages`, `support_ticket_events`;
- safe reporter ticket creation constraints;
- own-ticket/report-visible read boundaries;
- reporter append-only messages;
- privileged internal event/admin triage;
- raw support content/PII must never automatically mirror to GitHub.

Next support slice is authenticated avatar/user-menu `Help & feedback` intake plus bounded ticket submission/status UX, coordinated with Issue #53 shell work.

## Connected tooling recheck

2026-09-10 latest recheck:

- GitHub: connected and authoritative.
- Supabase: connected; `shelterpawtners-dev` is `ACTIVE_HEALTHY`. Hosted Auth provider/Site-URL console writes remain unavailable through the connector.
- Vercel is now connected. Project `lost-paws` is linked to `shelterpawtners/LostPaws` on the Hobby plan. Accepted production deployment `fae7a4cf...` remains READY. Runtime-error inspection for the last 24 hours returned no production runtime errors.
- Newer docs/Support OS deployments are currently CANCELED under the existing Vercel build-rate-limit behavior; there is still no runtime evidence of an application regression. Paid upgrade remains forbidden.
- Plugin discovery still found no actionable Resend, Google OAuth, Meta/Facebook, or DNS/domain-management provider connector. Figma is available but explicitly not desired or needed.

Supabase security-advisor review after the Support OS migration shows no new Support OS-specific policy warning. Existing warnings remain: intentionally policy-less private audit/token tables, existing SECURITY DEFINER execution advisories requiring function-by-function contract review, and leaked-password protection disabled because the paid feature is not authorized for MVP. Do not blanket-change these automatically.

## Protected restrictions

Never purchase/upgrade paid services, make destructive production-data changes, alter Microsoft 365 mail DNS, decide OD-003 or OD-004, weaken tests/RLS, publish unapproved final Terms/Privacy, expose secrets, or perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate owner authorization.

## Next safe action

1. Continue Issue #53 on `ux/guardian-marketplace-launch-polish`, starting with removal of misleading Guardian contact/social pet fields, compact Guardian shell/avatar menu, and highest-impact low-risk dashboard/Marketplace presentation changes.
2. Add `Help & feedback` to the authenticated user-menu shell and then implement bounded support-ticket submission/status UI against the now-live shared-dev support tables.
3. Reconcile the divergent UX branch through normal PR review/merge; do not force-reset or rewrite history.
4. Keep password-recovery/Google/Meta acceptance documentation current and do not reopen completed LL slices absent regression evidence.
5. Do not perform final production-domain cutover or publish final legal terms without owner authorization.
