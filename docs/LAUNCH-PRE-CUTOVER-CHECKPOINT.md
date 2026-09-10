# Pre-Cutover Launch Candidate Checkpoint

Status: active.

Branch: `launch/pre-cutover-readiness`

This checkpoint converts the accepted MVP into the first credible public launch candidate before any ShelterPawtners domain cutover. It does not begin Phase 3.

## Required outcomes

1. Demo/test isolation
   - Demo organizations and all records created for them remain usable in Admin QA.
   - Demo organizations/offers never appear in anonymous Marketplace or public directory results.
   - Existing shared-dev QA offers are backfilled to demo state rather than deleted.
   - Future QA offer creation inherits demo state automatically.

2. Launch resource catalog
   - Research and verify current adoption-related benefits/resources.
   - Publish initial `public_program` / `community` listings with direct source and destination links.
   - Never imply partnership, endorsement, exclusivity, donations, or verified savings unless separately supported.

3. Signup and data persistence
   - Guardian, Shelter, PetBiz, and RAVE Vendor public registration/login/onboarding remain functional.
   - Guardian pet persistence and PetBiz profile/offer persistence remain regression-gated.
   - Production-suitable Supabase Auth email delivery and final-domain redirects are verified before public traffic.

4. Launch-content QA
   - No QA/test/example.invalid/Playwright records appear publicly.
   - Public Marketplace and directory are useful and credible on phone/tablet/desktop.
   - Resource links and time-sensitive claims are reverified immediately before cutover.

5. Domain gate
   - Vercel custom domains and DNS changes occur only after the above pass.
   - Microsoft 365 MX/SPF/DKIM/DMARC records remain unchanged.

## Immediate implementation order

A. Correct demo inheritance/exclusion and backfill existing QA offers.
B. Add regressions for public Marketplace/directory isolation.
C. Seed first verified public adoption-benefit/resource wave.
D. Harden public-vs-partner Marketplace disclosure/merchandising.
E. Configure/test production auth email and final-domain redirects.
F. Run launch-candidate human/browser review.
G. Owner-authorized DNS cutover.
