# Revenue and donation streams register

Status: **PROPOSED (2026-11-25)**. Not tax or legal advice. Every row needs advisor review before it is turned on.

## Three surfaces, three business models (OD-006)

| Surface                                                                                   | Seller of record                         | Money flow                                                                                                           | Impact framing                                                     |
| ----------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **ShelterPawtners Marketplace** (pet)                                                     | Third-party pet businesses               | Today the customer pays the vendor off-platform. Later, optional on-site checkout (`DONATION-ECONOMICS.md` Stage 2). | Business commitments to verified shelters                          |
| **RAVE Shelter Marketplace** (human/festival; LostPaws = Lost Lands/Excision activations) | Third-party festival and event vendors   | Same as the pet marketplace                                                                                          | Hero Vendor commitment of 5% or more of eligible sales to shelters |
| **Store / Swag**                                                                          | **ShelterPawtners itself** (first-party) | ShelterPawtners collects the revenue and owns inventory, sales tax, fulfillment and returns                          | "Proceeds support…" claims only after OD-005 and advisor review    |

The two marketplaces share one offer engine and the existing `channel` model. They differ in routes, navigation, branding, vendor eligibility, onboarding copy, impact rules and metrics. Store is a separate business with different legal, tax and disclosure needs. Keep the names distinct everywhere.

## Register

The money paths are:

- **Through ShelterPawtners revenue:** Store margin, the platform fee, vendor subscriptions or placement, sponsorship, affiliate commissions and the platform tip.
- **Never through ShelterPawtners revenue:** charitable dollars (vendor pledges and customer add-ons). They go to the receipting intermediary. ShelterPawtners never holds them.

| #   | Stream                                                          | Payer → recipient                                | Tax / legal notes                                                                                                                                                         | Verification                                                    | Earliest phase                         | Status                                             |
| --- | --------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------- |
| R1  | Store / Swag margin                                             | Customer → ShelterPawtners                       | Ordinary sales income; sales tax nexus                                                                                                                                    | Our own checkout                                                | Now (Store MVP merged)                 | Live MVP; economics not modeled                    |
| R2  | Platform fee / commission on on-site marketplace orders         | Deducted from the order (`application_fee`)      | Our revenue; marketplace-facilitator sales tax in most states                                                                                                             | Stripe                                                          | After OD-008 (Phase 3+)                | Proposed                                           |
| R3  | Vendor subscription or featured placement                       | Vendor → ShelterPawtners                         | Advertising/service income. **Founding partners who register before 2027 keep a free core account** (owner direction), so this applies only to add-ons and later vendors. | Billing                                                         | After vendor traction                  | Proposed                                           |
| R4  | Event sponsorship / partnerships                                | Sponsor → ShelterPawtners                        | Sponsorship vs advertising characterization; never imply a Lost Lands/Excision affiliation without a real agreement                                                       | Contract                                                        | Now, off-platform                      | Proposed                                           |
| R5  | Affiliate commission on click-outs                              | Vendor or network → ShelterPawtners              | FTC affiliate disclosure required                                                                                                                                         | Network reports                                                 | Early, low effort                      | Proposed                                           |
| R6  | Optional platform tip at checkout                               | Customer → ShelterPawtners                       | Our revenue; labeled clearly as **not a donation**                                                                                                                        | Stripe                                                          | With on-site checkout                  | Proposed                                           |
| D1  | Vendor-pledged donation (% of eligible sale, or flat per order) | Vendor → shelter via intermediary                | The vendor's gift; ShelterPawtners may be a commercial co-venturer                                                                                                        | Stage 1: attestation and evidence review. Stage 2: payment data | Now as intent; settlement after OD-004 | Schema exists (`partner_contribution_commitments`) |
| D2  | Customer add-on donation / round-up                             | Customer → shelter via a receipting intermediary | Deductible only by itemizers, with the intermediary's receipt                                                                                                             | Intermediary receipt                                            | With on-site checkout                  | Proposed                                           |
| D3  | Grants                                                          | Foundation → entity                              | Usually needs a 501(c)(3) or fiscal sponsor                                                                                                                               | Grant agreement                                                 | After OD-005                           | Idea                                               |
| D4  | Store proceeds pledge                                           | ShelterPawtners → shelter                        | ShelterPawtners' own gift; deductible only if ShelterPawtners is a taxable business that itemizes it correctly                                                            | Our books                                                       | After OD-005                           | Idea                                               |

## Explicitly rejected

- Holding donated funds in ShelterPawtners accounts. This would create custody and money-transmission exposure.
- Earning interest or float on donations.
- Selling Guardian or vendor data.
- Charging Pet Guardians (owner direction: Guardians remain free).

## Tracking

Each stream moves through **Idea → Proposed → Advisor-reviewed → Owner-approved → Live**. Record a status change here and, when it is material, as an OD/D entry. Forecast assumptions for each stream live in `DONATION-ECONOMICS.md` §5.
