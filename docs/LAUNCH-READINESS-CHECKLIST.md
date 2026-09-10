# Launch Readiness Checklist

This checklist gates the first public ShelterPawtners domain cutover.

## Data hygiene
- [ ] Demo organizations excluded from public directory results.
- [ ] Offers created by demo organizations inherit `is_demo=true`.
- [ ] Existing shared-dev QA offers backfilled as demo.
- [ ] Public Marketplace RPC excludes demo offers and demo organizations.
- [ ] Admin QA still sees and uses demo identities/records.
- [ ] Regression proves Hosted QA cannot repopulate public Marketplace.

## Public resource catalog
- [ ] Verify and publish first wave of active public adoption-benefit programs.
- [ ] Each listing has source URL, destination URL, eligibility, geography, dates, last-verified date, and non-partnership disclosure.
- [ ] Expired/uncertain programs are hidden or clearly not active.
- [ ] Public programs are visually distinct from ShelterPawtners partner offers.

## Signup/auth
- [ ] Guardian fresh signup -> confirm -> login -> pet save/reload works.
- [ ] Shelter fresh signup -> onboarding save -> dashboard works.
- [ ] PetBiz fresh signup -> organization/profile/offer persistence works.
- [ ] RAVE Vendor fresh signup -> organization/profile persistence works.
- [ ] Password reset works end-to-end.
- [ ] Production-suitable custom SMTP/auth email provider is configured.
- [ ] Final domain auth redirect URLs are configured.

## Human launch review
- [ ] No QA/demo/test/Playwright names appear publicly.
- [ ] Marketplace has credible real-world launch content.
- [ ] Public directory contains only intentional public records.
- [ ] All public-program links and claims rechecked immediately before cutover.
- [ ] Phone/tablet/desktop review passes.

## Domain cutover
- [ ] Vercel custom domains are configured.
- [ ] DNS web records are identified before changes.
- [ ] Microsoft 365 MX/SPF/DKIM/DMARC records are preserved unchanged.
- [ ] `shelterpawtners.com` and `www.shelterpawtners.com` route to the accepted production application.
- [ ] Post-cutover smoke: home, register, login, marketplace, password reset, and public resource links.

Phase 3 starts only after this checklist is complete and the owner separately authorizes Phase 3.
