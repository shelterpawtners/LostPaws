# Launch data hygiene findings

Observed against shared development before domain cutover.

## Current shared-dev state

- 19 auth users.
- 6 organizations total; 4 are explicitly demo organizations.
- 72 offers total.
- 0 offers currently marked `is_demo=true`.
- 86 pets total; 2 marked demo.
- All currently public active offers observed are associated with `Demo PetBiz A` and have QA-generated titles such as Hosted QA, Issue 5, Playwright, or isolation test offers.
- Two separate non-demo organizations currently use the public name `Shelter Pawtners`; these require review before any public-directory launch decision. Do not destructively deduplicate them without owner review.

## Root cause

`public_active_offers(uuid)` currently filters publication/date/classification state but does not exclude demo offers or demo organizations. Offer creation also does not consistently inherit `is_demo=true` from a demo organization, so repeated Hosted QA creates public-looking records.

## Required correction

- Backfill offers owned by demo organizations to `is_demo=true`.
- Make future offer creation inherit demo state from the owning organization.
- Require `is_demo=false` for the offer and owning organization in public active-offer queries.
- Apply the same public exclusion principle to public organization/directory surfaces.
- Preserve demo data for authenticated Admin QA rather than deleting it.
- Add deterministic regressions proving a demo organization's published offer never appears through anonymous public Marketplace APIs.
