# Donation economics, verification, and commerce requirements

Status: **Direction approved 2026-11-25 (Issue #325); details PROPOSED.** This is not tax or legal advice.

- A CPA must confirm the tax framing below, and an attorney must confirm the solicitation framing, before any public use.
- Payments and money movement are RED. They are gated by OD-002 (Phase 3), OD-004 (provider), OD-005 (entity), OD-007 (donation basis) and OD-008 (commerce model).
- This public file holds engineering-facing requirements only. Pricing, fee rates, worked dollar examples, forecasts and negotiations belong in the private business workspace (see `README.md`).

## 1. Federal tax framing (to confirm with a CPA)

The relevant status is **501(c)(3)**.

1. **A discount is not a charitable gift**, for the customer or the vendor.
2. **A normal purchase is not a customer donation, even when the vendor pledges a share of it to shelters.**
   - Who the donor of record is depends on the legal flow of funds. When a vendor funds the pledge, the gift is the vendor's.
   - How the vendor treats it (a charitable contribution or a business expense) depends on its entity type and facts, so that is a question for its CPA. There is no universal "the business itemizes" rule.
   - The same dollars are never deducted twice.
3. **A separate, voluntary customer gift may qualify** when it goes to an eligible organization, for example through a receipting intermediary.
   - From tax year 2026, eligible taxpayers who do not itemize may deduct up to **$1,000 ($2,000 married filing jointly)** in qualifying cash gifts to certain eligible organizations ([IRS Topic 506](https://www.irs.gov/taxtopics/tc506)).
   - Taxpayers who itemize have separate limits.
   - Whether a gift qualifies depends on the recipient type, substantiation and the taxpayer's circumstances. The platform makes no blanket guarantee.
   - IRS rules also allow other possibilities, such as direct qualifying donations and the amount of a quid-pro-quo payment that exceeds fair value.
4. **Recordkeeping follows the IRS rules that apply** ([substantiation and disclosure](https://www.irs.gov/charities-non-profits/charitable-organizations/charitable-organizations-substantiation-and-disclosure-requirements)):
   - a bank record or written communication for any cash gift;
   - a contemporaneous written acknowledgment, generally for a single gift of $250 or more;
   - a quid-pro-quo disclosure for a payment over $75 that is partly a gift.

   The intermediary's receipts must meet these rules. The CPA confirms this.

5. **No public deductibility language without advisor approval.** Never place "deductible" next to a discount or a vendor pledge.
6. **The entity decision (OD-005) is necessary but not sufficient** for state commercial co-venturer and charitable-solicitation analysis. The activity, jurisdictions, contracts, recipients and fund flows all matter ([Michigan charities guidance](https://www.michigan.gov/consumerprotection/charities)). ShelterPawtners does not hold charitable funds.
7. **Pledged is not paid.** A commitment is not a gift event; the transfer is.

## 2. Status model: purchase, pledge, settlement, delivery

Each status is separate, needs its own evidence, and does not imply the next.

| Status        | Meaning                                                                | Evidence                                                    |
| ------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| Offer claimed | A Guardian claimed or redeemed a non-payment offer                     | Existing claim/redemption token records                     |
| Purchase      | A charge succeeded (Stage 2 only)                                      | Provider charge ID. This proves the charge, not fulfillment |
| Fulfilled     | The vendor delivered the goods or service                              | Vendor confirmation; dispute window                         |
| Pledged       | The vendor committed an amount                                         | `partner_contribution_commitments`                          |
| Settled       | The vendor's funds reached the intermediary                            | Intermediary or provider record; reconciliation             |
| Disbursed     | The intermediary paid the recipient                                    | Intermediary payout record (can lag by weeks)               |
| Delivered     | The recipient confirmed what was funded (in-kind or program)           | Shelter confirmation                                        |
| Adjusted      | A refund, chargeback, partial transfer or post-disbursement correction | New appended rows; existing rows are never edited           |

Public impact copy may cite only **Settled** or later, and must label which status it uses. The OD-003 verified-savings gate is separate and still applies to savings claims.

## 3. Hero basis formula (proposed for OD-007; integer minor units, append-only)

```
eligible_minor      = sum(attributed line charged_minor)        -- after discount
                      excluding tax, shipping, platform/processing fees
                      minus refunds and chargebacks on those lines
vendor_pledge_minor = floor(eligible_minor * pledge_bps / 10000)
                      or flat_per_order_minor * qualifying_orders
Hero Vendor         = pledge_bps >= 500 on approved, eligible, attributed transactions
```

The owner and advisor decide the following before approving OD-007:

- **Rounding.** Proposal: round down per period, with the remainder visible in reconciliation and never rounded up in public copy.
- Per-order or per-period **caps and minimums**.
- How **partial refunds** reduce the pledge proportionally.
- The **reconciliation cadence**, and who resolves exceptions.
- **Post-disbursement adjustments.** Do not assume a refund made after the intermediary paid out can be reversed. Record it as a vendor credit against a future period, or as a written-off variance, according to the vendor agreement.

The open questions in `docs/product/OWNER-DECISIONS-NEXT-SPRINT.md` #2 and #5 remain the decision record.

## 4. Verification: cheapest first

| Stage | Who                         | Mechanism                                                                                                                                                                                                         | Strength          |
| ----- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| **0** | All                         | Pledges shown as _intent_ only. No public dollar totals.                                                                                                                                                          | n/a               |
| **1** | In-person and event vendors | Vendor POS attribution (a unique promo code or tracked link), plus periodic vendor attestation, with settlement evidence reviewed through the existing `submit_partner_contribution_evidence` → admin review flow | Partial           |
| **2** | Online vendors who opt in   | Integrated commerce, only after legal and owner gates. The payment record verifies the **charge**. It does not verify fulfillment, a paid-out donation or delivery.                                               | Strong for charge |

- **The existing claim/redemption token workflow stays** for non-payment offers. It is not retired.
- Promo-code attribution is not verified savings (OD-003), and neither replaces the other.

## 5. Commerce requirements (Stage 2 and Store; OD-008)

**Owner direction.** Customers buy on our site. The donation share goes to a charity intermediary. The vendor is paid and fulfills the order. Business partners do routine setup from their own profile.

**What vendors set up themselves:** listings, prices, discounts, pledge settings, fulfillment method and order notifications.

**What still needs verification or approval:**

- recipient eligibility;
- identity/KYC;
- fraud review and suspension;
- disputes;
- settlement exceptions.

**The provider choice is conditional.** Stripe Connect (Express) is a **candidate, not the approved architecture** ([Connect](https://stripe.com/docs/connect), [Tax with Connect](https://docs.stripe.com/tax/connect)). Before choosing any provider, confirm these with the provider and with counsel:

- the seller or merchant of record;
- destination charges vs separate charges and transfers;
- sales-tax liability, registrations, filing and remittance (a tax calculation product alone does not guarantee compliance);
- platform liability for negative balances and disputes;
- whether the intermediary supports the transfers, and its receipts and fees;
- custody, and which payment flows the provider prohibits.

**Engineering requirements for any design:**

- idempotent webhooks and status transitions;
- reconciliation, with an exceptions queue;
- handling for refunds, chargebacks and partial transfers;
- append-only history;
- no stored card data;
- mapping to the existing `donation_transactions` and `partner_contribution_*` tables before proposing new ones.

**First-party Store:**

- The current Store is a **requestability MVP, not live paid checkout**.
- Any Store commerce pilot stays separate from marketplace Connect.
- Before building it, compare a simple checkout with manual stock and fulfillment against a hosted store platform on SKU volume, total cost and actual needs.

**Gates:** no provider or payment implementation until OD-002, OD-004, OD-005, OD-007 and OD-008 are resolved, legal review is done and a dedicated design doc is approved.

## 6. Forecast (private deliverable)

The 24-month, three-scenario forecast (Conservative, Base, Traction) is a later approved deliverable. It lives in the **private** business workspace, not in this repository. The forecast must:

- separate sales revenue, gross margin, contribution after fulfillment, acquisition and pledges, fixed expenses, founder compensation, cash, inventory and working capital, reserves and taxes;
- show sponsorship concentration and renewal risk;
- separate paid from pledged amounts, and confirmed in-kind deliveries from planned ones;
- never count pass-through funds as revenue, or product margin as gross sales;
- never present supplier quotes or forecasts as actuals;
- model stage dependencies, conversion and retention.

Convert dollars to impact only with unit costs the shelters supply. Any number in public copy follows `docs/product/PASSPORT-SAVINGS-IMPACT-MODEL.md` (cite the assumption, label it as illustrative) and needs advisor approval.
