# Launch account readiness

Current public account types: Guardian, Shelter, PetBiz, and RAVE Vendor.

## Guardian
- Fresh registration route exists and is regression-tested.
- Login/session protection is regression-tested.
- Guardian can create a pet/Passport foundation record.
- Canonical pet + guardianship persistence is directly verified through the Guardian's authenticated RLS session.
- Multiple pets, reopen, reload, sign-out/sign-in, and fresh-browser reconstruction passed Issue #5.

## PetBiz
- Fresh registration reaches PetBiz onboarding.
- Organization matching/creation, profile draft/publication, multiple offers, offer versioning/publication/revisit, claim and redemption flows passed the accepted regression suite.
- Advanced future Marketplace/product rules remain outside this launch checkpoint.

## Shelter
- Fresh registration reaches Shelter onboarding.
- Current organization/onboarding save path exists and seeded Shelter identity/dashboard/RLS linkage passed Issue #5.
- Full future shelter adoption-operation, verification, transfer, and Passport-authoring workflows are not all implemented and must not be implied as launch-complete.

## RAVE Vendor
- Fresh registration reaches RAVE Vendor onboarding.
- Current organization/profile/dashboard state passed Issue #5 through the real seeded RLS identity.
- Later event/vendor-specific Phase 3 capabilities remain deferred.

## Not public account types today
- Platform Admin is internal/restricted.
- Veterinary/care Provider is an intended role but is not yet a complete public registration/workflow surface.

## Remaining public-launch auth blocker

The current Supabase hosted/default auth email delivery is not suitable for a public launch cadence. Before domain traffic:

1. configure custom production-suitable SMTP/auth email delivery;
2. configure final `shelterpawtners.com`/`www.shelterpawtners.com` site and redirect URLs;
3. verify confirmation and password-reset messages end-to-end;
4. repeat fresh signup/login/persistence smoke tests for all four current public personas.
