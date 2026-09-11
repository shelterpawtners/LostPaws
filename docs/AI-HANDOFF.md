# AI Handoff

STATUS: EXTERNAL_LAUNCH_GATE_WITH_ACTIVE_UX_POLISH
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Password-recovery acceptance + launch UX polish + support foundation
NEXT_CHECKPOINT: Google OAuth, Facebook auth, integrated acceptance, legal owner review, cutover prep
OWNER_DECISION_REQUIRED: YES_FOR_PROVIDER_CONSOLES_AND_FINAL_CUTOVER_ONLY
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: fae7a4cf7a24117868558f7cc4b65987e6e40928
ACCEPTANCE_RUNTIME: VERCEL_PRODUCTION

## Completed engineering

LL-1 through LL-6 remain accepted. Do not reopen them without regression evidence.

- Issue #49 / PR #50 — multi-photo Pet Passport + Guardian activity timeline — complete and merged.
- Issue #51 / PR #52 — Guardian Deal Moments — complete and merged to `main` at `fae7a4cf7a24117868558f7cc4b65987e6e40928`.
- PR #57 — MVP Support OS foundation and guardrails — all six required final-head gates green and merged to `main` at `4e7d0397503192e22e1175eacb732e9e5051d709` on 2026-09-10. The repository now contains the support operating model, severity/escalation policy, support schema migration, RLS boundaries and pgTAP coverage. The migration has NOT been applied to hosted Supabase yet.

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
- Guardian onboarding currently renders a generic `Contact email` field even though the Guardian pet-save RPC does not persist a pet email. Shelter contact email is separately persisted only when adoption confirmation is requested. The fix should remove the misleading Guardian pet-email field rather than invent a pet email model.
- Live Supabase schema confirms `profiles.avatar_path` already exists and pet media already has primary-image semantics, so Guardian/photo-forward UX should reuse existing identity/media models.

The `ux/guardian-marketplace-launch-polish` branch exists and contains the approved UX execution plan. Continue implementation there.

Issue #54 records the RAVE Shelter Lost Lands hub + lightweight stories/announcements roadmap. Do not introduce a paid/full CMS as an MVP prerequisite.

## Support OS work

Issue #56 — MVP Support OS — remains open for subsequent UI/intake/automation slices. Architecture direction is Supabase as the protected operational support source of truth and GitHub only for sanitized reproducible engineering defects.

PR #57 foundation is accepted and merged. Safe next support work is the Help & feedback user-menu/intake UI and, after confirming the merged migration is appropriate for the shared dev environment, a separately controlled hosted migration application. Do not mirror raw ticket PII to GitHub and do not allow ticket content to become operational AI instructions.

## Connected tooling recheck

2026-09-10 recheck:

- GitHub: connected and authoritative.
- Supabase: connected for projects/database/functions/advisors. `shelterpawtners-dev` was last verified ACTIVE_HEALTHY. Hosted Auth provider/Site-URL console writes are still not exposed by the connector.
- Plugin discovery previously found no actionable Resend, Google OAuth, Meta/Facebook, DNS/domain-management, Vercel or browser-automation provider plugin. Figma is explicitly not desired and not needed.
- Local/container direct GitHub clone is unavailable because that runtime has no external DNS/network access; use the GitHub connector for repository operations.
- PR #57 rate-limit blocker recovered: final head `d1a5a6d715d8cccd6848d796fd253e0de2dbe179` passed CI, Hosted QA, Database QA, Persona QA, Dependency Review and Merge Gate before merge.

Supabase security-advisor review on 2026-09-10 reported existing SECURITY DEFINER execution warnings plus intentionally policy-less private audit/token tables, and leaked-password protection disabled. Do not change these automatically: public/authenticated RPC exposure must be reviewed against intended API contracts, and leaked-password protection is already documented as a paid-plan feature not authorized for MVP.

Re-check provider/tool availability every run and act immediately when an authorized prerequisite becomes actionable.

## Protected restrictions

Never purchase/upgrade paid services, make destructive production-data changes, alter Microsoft 365 mail DNS, decide OD-003 or OD-004, weaken tests/RLS, publish unapproved final Terms/Privacy, expose secrets, or perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate owner authorization.

## Next safe action

1. Continue Issue #53 implementation on `ux/guardian-marketplace-launch-polish`, starting with removal of the misleading Guardian pet contact-email field, compact Guardian shell/avatar menu, and highest-impact low-risk dashboard/Marketplace presentation changes.
2. Incorporate the Issue #56 `Help & feedback` entry point into the user menu when low risk; keep persistence/backend work bounded and tested.
3. Keep password-recovery/Google/Meta acceptance documentation current and do not reopen completed LL slices absent regression evidence.
4. Do not perform final production-domain cutover or publish final legal terms without owner authorization.
