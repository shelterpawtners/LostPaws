# Revenue and donation streams register

Status: **Direction approved 2026-11-25 (Issue #325); each row still PROPOSED.** Not tax or legal advice. Every row needs advisor review before it is turned on. This public register lists categories and gates only. Prices, margins, supplier quotes, sponsor terms and forecasts live in the private business workspace (`README.md`).

## Three surfaces, three business models (OD-006)

| Surface                                                                                   | Seller of record                         | Money flow                                                                                                                                                  | Impact framing                                                     |
| ----------------------------------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **ShelterPawtners Marketplace** (pet)                                                     | Third-party pet businesses               | Today the customer pays the vendor off-platform. Later, optional on-site checkout (`DONATION-ECONOMICS.md` Stage 2).                                        | Business commitments to verified shelters                          |
| **RAVE Shelter Marketplace** (human/festival; LostPaws = Lost Lands/Excision activations) | Third-party festival and event vendors   | Same as the pet marketplace                                                                                                                                 | Hero Vendor commitment of 5% or more of eligible sales to shelters |
| **Store / Swag**                                                                          | **ShelterPawtners itself** (first-party) | Today: **requestability MVP, no paid checkout.** If commerce ships, ShelterPawtners collects revenue and owns inventory, sales tax, fulfillment and returns | "Proceeds support…" claims only after OD-005 and advisor review    |

The two marketplaces share one offer engine and the existing `channel` model. They differ in routes, navigation, branding, vendor eligibility, onboarding copy, impact rules and metrics. Store is a separate business with different legal, tax and disclosure needs. Keep the names distinct everywhere.

Owner direction (#325): no separate domains or databases now. One vendor account may serve both marketplaces only with channel-specific eligibility and permissions (an owner decision under OD-006). Guardians and founding partners' core accounts stay free.

## Register

The money paths are:

- **Through ShelterPawtners revenue:** Store margin, the platform fee, vendor subscriptions or placement, sponsorship, affiliate commissions and the platform tip.
- **Never through ShelterPawtners revenue:** charitable dollars (vendor pledges and customer add-ons). They go to the receipting intermediary. ShelterPawtners never holds them.

| #   | Stream                                                          | Payer → recipient                                | Tax / legal notes                                                                                                                                                         | Verification                                                    | Earliest phase                         | Status                                             |
| --- | --------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------- |
| R1  | Store / Swag margin                                             | Customer → ShelterPawtners                       | Ordinary sales income; sales tax nexus                                                                                                                                    | Our own checkout (not built)                                    | After a Store commerce decision        | Requestability MVP only; no paid checkout          |
| R2  | Platform fee / commission on on-site marketplace orders         | Deducted from the order (`application_fee`)      | Our revenue; marketplace-facilitator sales tax in most states                                                                                                             | Stripe                                                          | After OD-008 (Phase 3+)                | Proposed                                           |
| R3  | Vendor subscription or featured placement                       | Vendor → ShelterPawtners                         | Advertising/service income. **Founding partners who register before 2027 keep a free core account** (owner direction), so this applies only to add-ons and later vendors. | Billing                                                         | After vendor traction                  | Proposed                                           |
| R4  | Event sponsorship / partnerships                                | Sponsor → ShelterPawtners                        | Sponsorship vs advertising characterization; never imply a Lost Lands/Excision affiliation without a real agreement                                                       | Contract                                                        | Now, off-platform                      | Proposed                                           |
| R5  | Affiliate commission on click-outs                              | Vendor or network → ShelterPawtners              | FTC affiliate disclosure required                                                                                                                                         | Network reports                                                 | Early, low effort                      | Proposed                                           |
| R6  | Optional platform tip at checkout                               | Customer → ShelterPawtners                       | Our revenue; labeled clearly as **not a donation**                                                                                                                        | Stripe                                                          | With on-site checkout                  | Proposed                                           |
| D1  | Vendor-pledged donation (% of eligible sale, or flat per order) | Vendor → shelter via intermediary                | The vendor's gift; ShelterPawtners may be a commercial co-venturer                                                                                                        | Stage 1: attestation and evidence review. Stage 2: payment data | Now as intent; settlement after OD-004 | Schema exists (`partner_contribution_commitments`) |
| D2  | Customer add-on donation / round-up                             | Customer → shelter via a receipting intermediary | May qualify for eligible itemizers and, from 2026, eligible non-itemizers (capped); never guaranteed; substantiation rules apply                                          | Intermediary receipt                                            | With on-site checkout                  | Proposed                                           |
| D3  | Grants                                                          | Foundation → entity                              | Usually needs a 501(c)(3) or fiscal sponsor                                                                                                                               | Grant agreement                                                 | After OD-005                           | Idea                                               |
| D4  | Store proceeds pledge                                           | ShelterPawtners → shelter                        | ShelterPawtners' own gift; tax treatment depends on entity and facts (CPA)                                                                                                | Our books                                                       | After OD-005                           | Idea                                               |

## Opportunity register (feasibility, parallel to product work)

Owner direction (#325): pursue early-revenue feasibility in parallel, privately. None of these is a commitment. No inventory, paid preorders, outreach or public claims until the legal, economics and shelter-acceptance gates pass.

| #   | Opportunity                                      | Stream | First gate                                                              |
| --- | ------------------------------------------------ | ------ | ----------------------------------------------------------------------- |
| O1  | QR + NFC pet tags (first physical SKU candidate) | R1     | Landed cost and supplier; tag-to-Passport activation is unproven        |
| O2  | Treats                                           | R1     | Demand, supplier, landed cost, feed/labeling compliance (checklist #13) |
| O3  | Starter kits, including sponsor-funded supplies  | R1/R4  | Sponsor agreement; delivery verification                                |
| O4  | Optional content or creative services            | R3     | Scope and pricing                                                       |
| O5  | Subscriptions (vendor add-ons, consumer)         | R3     | Founding-free promise preserved                                         |
| O6  | Wholesale to shelters or vendors                 | R1     | Margin and terms                                                        |
| O7  | Grants (eligibility tracked separately)          | D3     | OD-005                                                                  |

## Explicitly rejected

- Holding donated funds in ShelterPawtners accounts. This would create custody and money-transmission exposure.
- Earning interest or float on donations.
- Selling Guardian or vendor data.
- Charging Pet Guardians (owner direction: Guardians remain free).

## Tracking

Each stream moves through **Idea → Proposed → Advisor-reviewed → Owner-approved → Live**. Record a status change here and, when it is material, as an OD/D entry. Forecast assumptions for each stream live in `DONATION-ECONOMICS.md` §5.
