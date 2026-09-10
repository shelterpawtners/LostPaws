# AI Handoff

STATUS: EXTERNAL_LAUNCH_GATE_WITH_ACTIVE_UX_POLISH
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Password-recovery acceptance + launch UX polish
NEXT_CHECKPOINT: Google OAuth, Facebook auth, integrated acceptance, legal owner review, cutover prep
OWNER_DECISION_REQUIRED: YES_FOR_PROVIDER_CONSOLES_AND_FINAL_CUTOVER_ONLY
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: fae7a4cf7a24117868558f7cc4b65987e6e40928
ACCEPTANCE_RUNTIME: VERCEL_PRODUCTION

## Completed engineering

LL-1 through LL-6 remain accepted. Do not reopen them without regression evidence.

- Issue #49 / PR #50 — multi-photo Pet Passport + Guardian activity timeline — complete and merged.
- Issue #51 / PR #52 — Guardian Deal Moments — complete and merged to `main` at `fae7a4cf7a24117868558f7cc4b65987e6e40928`.

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
- Marketplace cards/hero are too large and information-sparse; add denser scan-friendly presentation and grid/list views while preserving truthful eligibility/source behavior.

Repository audit completed for the Marketplace. `OfferMarketplace.tsx` already contains the required behavioral primitives (published-offer RPC, search, classification filters, source/claim distinction, detail routes and accessibility status behavior). Treat this as a presentation/information-architecture refactor first, not a database/RPC rewrite. Issue #53 contains the implementation plan.

Issue #54 records the RAVE Shelter Lost Lands hub + lightweight stories/announcements roadmap. Do not introduce a paid/full CMS as an MVP prerequisite.

## Connected tooling recheck

- GitHub: connected and authoritative.
- Plugin search this run found no newly actionable Supabase Auth, Resend, Google OAuth, Meta/Facebook, Vercel or DNS provider plugin.
- Therefore provider-console writes remain owner/manual unless a future run surfaces an actionable connected tool.

Re-check provider/tool availability every run and act immediately when an authorized prerequisite becomes actionable.

## Protected restrictions

Never purchase/upgrade paid services, make destructive production-data changes, alter Microsoft 365 mail DNS, decide OD-003 or OD-004, weaken tests/RLS, publish unapproved final Terms/Privacy, expose secrets, or perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate owner authorization.

## Next safe action

Continue Issue #53 with implementation-level audit of Guardian/Pet components and the pet-email field, then implement the highest-impact low-risk presentation slice when the required files/tests are identified. In parallel, keep password-recovery/Google/Meta acceptance documentation current and do not reopen completed LL slices absent regression evidence.
