# Launch Readiness Checklist

This checklist gates the first public ShelterPawtners domain cutover.

## Data hygiene

- [x] Demo organizations excluded from public directory results.
- [x] Offers created by demo organizations inherit `is_demo=true`.
- [x] Existing shared-dev QA offers backfilled as demo.
- [x] Public Marketplace RPC excludes demo offers and demo organizations.
- [x] Admin QA retains authenticated access to demo identities/records.
- [x] Regression coverage protects the public demo-isolation boundary.

Current shared-dev evidence: 72 QA/demo offers remain preserved, while the anonymous Marketplace returns only the 5 intentional public-program listings and no suspicious demo/QA/example.invalid strings.

## Public resource catalog

- [x] Verify and publish first wave of active public adoption-benefit programs.
- [x] Each launch listing has source URL, destination URL, eligibility, geography/applicability, dates where applicable, last-verified date, and non-partnership disclosure.
- [x] Expired/uncertain programs are excluded from the active Wave 1 catalog.
- [x] Public programs are visually and behaviorally distinct from ShelterPawtners partner offers.
- [x] Public/community resources cannot create ShelterPawtners claim/redemption tokens.
- [ ] Reverify time-sensitive programs immediately before the actual domain cutover.

## Signup/auth

- [x] Guardian fresh signup/onboarding/pet persistence has isolated Persona QA coverage.
- [x] Shelter fresh signup/onboarding has isolated Persona QA coverage.
- [x] PetBiz fresh signup/organization/profile persistence has isolated Persona QA coverage.
- [x] RAVE Vendor fresh signup/organization/profile persistence has isolated Persona QA coverage.
- [x] Email confirmation preserves the selected onboarding persona in its redirect contract.
- [x] Forgot-password preserves the application `/reset-password` callback contract.
- [x] Invalid/expired/manual unauthenticated reset URLs do not present an active password form.
- [ ] Full Persona/Hosted acceptance suite passes on the final pre-cutover code head.
- [ ] Production-suitable custom SMTP/auth email provider is configured.
- [ ] Final production Site URL and auth redirect allowlist are configured.
- [ ] Real external email confirmation and recovery delivery pass end-to-end.

See `docs/LAUNCH-AUTH-EMAIL-READINESS.md` for the proposed low-cost transactional-email design and owner-gated configuration steps.

## Public signup/legal readiness

- [ ] Owner-approved Terms of Service content exists.
- [ ] Owner-approved Privacy Notice content exists.
- [ ] Registration consent links to the actual Terms and Privacy Notice.

The current registration checkbox references Terms and a Privacy Notice without links or policy routes. Do not enable public signup at domain cutover until this is resolved.

## Human launch review

- [x] Database/RPC audit shows no QA/demo/test/Playwright names in current public Marketplace or directory outputs.
- [x] Marketplace has credible real-world launch content.
- [x] Public directory contains only intentional public records; it currently returns zero profiles rather than exposing source-only or demo organizations.
- [ ] Public-program links and time-sensitive claims rechecked immediately before cutover.
- [ ] Exact-code phone/tablet/desktop acceptance review passes.

## Hosting/domain readiness

- [x] Vercel project is linked and production branch remains `main`.
- [x] Current Vercel project audit shows only Vercel-owned domains; `shelterpawtners.com` has not been attached prematurely.
- [ ] Exact current launch frontend has a deployable preview or equivalent exact-code local acceptance evidence. Vercel is currently build-rate-limited, so use `LOCAL_HEAD` acceptance rather than paying to bypass the limit.
- [ ] Vercel custom domains are configured after owner authorization.
- [ ] DNS web records are identified before changes.
- [ ] Microsoft 365 MX/SPF/DKIM/DMARC records are preserved unchanged.
- [ ] `shelterpawtners.com` and `www.shelterpawtners.com` route to the accepted production application.
- [ ] Post-cutover smoke: home, register, login, marketplace, password reset, and public resource links.

## Owner gate

The remaining external production changes are intentionally not autonomous:

- approve/provide final Terms and Privacy Notice content;
- create/authorize the transactional-email provider and credentials;
- authorize the transactional sending-subdomain DNS records;
- authorize Vercel custom-domain attachment and production web DNS cutover;
- authorize Phase 3 separately after launch readiness is complete.

Phase 3 starts only after this launch gate is resolved and the owner separately authorizes Phase 3.
