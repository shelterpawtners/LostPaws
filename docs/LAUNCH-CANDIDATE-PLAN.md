# ShelterPawtners Launch Candidate Plan

Status: pre-domain-cutover launch-content readiness.

## Goal

Make the first public ShelterPawtners release feel real, trustworthy, and useful before routing `shelterpawtners.com` to the Vercel application. This checkpoint does not begin Phase 3.

## Launch blockers identified

1. Shared-dev QA/demo organizations are correctly marked `is_demo=true`, but offers created by those demo organizations are not consistently inheriting `is_demo=true`.
2. `public_active_offers()` currently excludes only internal/reference classifications and does not exclude demo offers or demo organizations, so QA offers can appear publicly.
3. The live shared-dev Marketplace is currently populated by QA-generated offers from Demo PetBiz A rather than launch content.
4. Public signup logic exists for Guardian, Shelter, PetBiz, and RAVE Vendor, but production auth email delivery needs a production-suitable custom SMTP/provider before traffic is directed to the domain.
5. The Marketplace needs verified real-world public adoption benefit/resource listings before cutover.

## Workstream A — Demo/QA isolation

- Make offers created by a demo organization inherit `is_demo=true`.
- Exclude `is_demo=true` organizations/offers from anonymous/public Marketplace and public directory surfaces.
- Keep demo identities/data available to Platform Admin through Admin QA.
- Backfill current QA offers associated with demo organizations to `is_demo=true` rather than deleting them.
- Add regression coverage proving future Hosted QA runs cannot repopulate public Marketplace results.
- Audit other public RPCs/directories for the same demo exclusion rule.

## Workstream B — Public adoption-benefit resource catalog

Use existing offer classifications instead of inventing a new partnership state:

- `public_program` — verified publicly available program/resource not affiliated with ShelterPawtners.
- `community` — useful community/shelter resource without a ShelterPawtners commercial relationship.
- `partner_published` — only after the business actually creates/publishes its offer through ShelterPawtners.
- `exclusive`, `verified_adoption`, `sponsored`, `affiliate` — require the corresponding evidence/approval before use.

Every public-program listing must include:

- organization/program name;
- concise benefit summary;
- eligibility and geography;
- direct destination URL;
- source URL supporting the claim;
- verification date;
- expiration/date window when known;
- disclosure stating it is a publicly listed third-party program and not a ShelterPawtners partnership unless explicitly marked otherwise.

Initial research targets include PetSmart Adoption Kit, Adopt a Pet Shelter Plus, Trupanion Shelter & Rescue Support/Adoption Day Offers, PetPartners 30-Day Coverage, 24Petwatch Shelter Adoption Program, Banfield adopter first-exam benefit, BISSELL Pet Foundation Empty the Shelters, Petfinder/Purina Feeding Partners, Hill's Food Shelter & Love, GoodPup shelter programs, MetLife shelter/rescue programs, Petco/Petco Love adoption resources, and other verified national/regional adopter benefit programs.

## Workstream C — Marketplace launch merchandising

- Add a visible distinction between Public Adoption Benefits and ShelterPawtners/Impact Partner offers.
- Do not imply affiliation, endorsement, exclusivity, verified savings, or donations for public-program listings.
- Prioritize currently active programs and suppress expired entries.
- Show geographic/participation limitations prominently.
- Add `Last verified` treatment where appropriate.
- Seed enough credible listings that the Marketplace looks useful at launch even before direct PetBiz recruitment scales.

## Workstream D — Signup and persistence launch readiness

Re-run launch-candidate smoke coverage for:

- Guardian account creation, login, pet save/reopen/reload;
- Shelter account creation and organization onboarding save;
- PetBiz account creation, organization/profile save, offer draft/publish/reopen;
- RAVE Vendor account creation and current organization/profile save;
- password reset/confirmation links against the production-suitable email provider;
- existing RLS/persona isolation gates.

Before public domain traffic:

- configure a production-suitable Supabase Auth custom SMTP/email provider;
- set final site URL and allowed redirect URLs for `shelterpawtners.com` and `www.shelterpawtners.com`;
- verify confirmation/reset emails end-to-end;
- preserve Microsoft 365 MX/SPF/DKIM/DMARC mail records during web DNS cutover.

## Workstream E — Human launch-content review

- Review Marketplace on phone/tablet/desktop with only non-demo public content visible.
- Review public organization directory for accidental QA/demo identities.
- Check every public-program link and claim immediately before cutover.
- Confirm no test names, `example.invalid` identities, Playwright/Hosted QA records, or synthetic savings/impact appear publicly.

## Cutover gate

Do not route `shelterpawtners.com` to Vercel until all of the following are true:

1. demo/QA data is deterministically hidden from public surfaces while preserved for Admin QA;
2. initial verified public adoption-benefit catalog is seeded;
3. public-vs-partner disclosure is clear;
4. signup/login/persistence smoke checks pass for all current public personas;
5. production-suitable auth email delivery is configured and tested;
6. Marketplace/public-directory human review is clean;
7. Vercel custom-domain configuration is ready;
8. DNS plan changes only web records and preserves Microsoft 365 email records.

Phase 3 remains a separate owner-authorized checkpoint after launch baseline is established.
