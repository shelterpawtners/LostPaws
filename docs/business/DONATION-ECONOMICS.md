# Donation economics, verification, and forecast

Status: **PROPOSED (2026-11-25)**. Not tax or legal advice. The federal framing below must be confirmed by a CPA (IRS Publication 526 / 1771) before any public use. Payments and money movement are RED and gated by OD-002 (Phase 3), OD-004 (provider) and OD-008 (checkout model).

## 1. Federal tax framing (to confirm with a CPA)

The relevant status is **501(c)(3)**, not "503(c)".

1. **A discount is never a charitable deduction**, for the customer or the vendor. This is already a repository invariant.
2. **"X% of your purchase goes to shelters" is not deductible by the customer.** The customer got goods or services for the price paid. Whoever legally makes the gift owns the charitable gift: when the vendor pledges, the vendor is the donor of record and may deduct it or treat it as a marketing expense, per their own CPA.
3. **A separate, optional customer donation** (an add-on or round-up paid to a 501(c)(3) or a receipting intermediary) **can** be deductible for the customer, but only if they itemize, and only with a written acknowledgment from the charity or intermediary. This is the **only honest "tax-deductible" offer** the platform can make. Wording: "Optional tax-deductible donation, receipted by [intermediary]." Never put "deductible" next to a discount or a vendor pledge.
4. **ShelterPawtners' entity status (OD-005) controls what we can say and do.**
   - If it is a for-profit (LLC), advertising that a share of sales benefits charity can make it a **commercial co-venturer** under state charitable-solicitation laws. Some states require registration, a written contract with the charity, specific disclosures and a final accounting.
   - It should not hold charitable funds.
   - Becoming a 501(c)(3), or working under a fiscal sponsor, changes this and adds IRS filing and unrelated-business-income rules.
5. **Pledged is not paid.** A commitment is not a deductible event. The transfer is what counts, in the year it happens. The existing schema already separates intent from settled.

## 2. Formula definitions (integer minor units; append-only history)

For one order line:

```
list_minor              = vendor's pre-discount price
discount_minor          = list_minor × vendor_discount_bps / 10000          (customer value, not a donation)
charged_minor           = list_minor − discount_minor                       (pre-tax, pre-shipping)
eligible_minor          = charged_minor − refunded_minor                    (OD-007: confirm the basis)
vendor_pledge_minor     = eligible_minor × pledge_bps / 10000   OR   flat_per_order_minor
platform_fee_minor      = charged_minor × take_bps / 10000                  (R2, only with on-site checkout)
processing_minor        = provider fee (who absorbs it: OD-008)
customer_addon_minor    = optional, separate line, separate receipt          (D2)
vendor_net_minor        = charged_minor − platform_fee_minor − processing_minor − vendor_pledge_minor
```

The Hero Vendor threshold is `pledge_bps ≥ 500` of `eligible_minor`. The questions in `OWNER-DECISIONS-NEXT-SPRINT.md` #2 still decide what `eligible` means: gross vs after discount, refunds, tax, shipping, processor fees, and attributed-only sales. This document proposes the defaults: **after discount, excluding tax and shipping, net of refunds, attributed sales only.**

**Illustrative example only. The rates are placeholders; verify current provider fees.**

- List price $40.00; discount 10% ($4.00); customer is charged $36.00.
- Vendor pledge at 5% of $36.00 is $1.80, sent to the intermediary and then to the shelter.
- Platform fee at 5% is $1.80, kept by ShelterPawtners.
- Card processing at about 2.9% + $0.30 is about $1.34. Who absorbs it is an OD-008 decision.
- Vendor net is about $31.06.
- An optional customer add-on of $2.00 would be a separate receipted donation.

## 3. Verification: cheapest first

| Stage       | Who                                         | Mechanism                                                                                                                                                                                                                                                          | Verification strength | Cost                               |
| ----------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ---------------------------------- |
| **0 (now)** | All                                         | Pledges shown as _intent_ only. No public dollar totals.                                                                                                                                                                                                           | n/a                   | $0                                 |
| **1**       | In-person / event vendors (festival booths) | Tracked click-out links, a unique promo code per vendor entered in **the vendor's own POS**, and a monthly vendor attestation with settlement evidence through the existing `submit_partner_contribution_evidence` → admin review flow. Track the collection rate. | Partial               | Low; reuses existing schema and UI |
| **2**       | Online vendors who opt in                   | **On-site checkout.** The payment record _is_ the verification. No scanning, no codes.                                                                                                                                                                             | Strong, automatic     | Provider fees; Phase 3 build       |

The redemption-code-scanning concept is retired. It costs effort and stays inaccurate. Stage 1 promo codes use the vendor's existing POS and need no ShelterPawtners scanning.

## 4. On-site checkout model (Stage 2; OD-008)

Owner direction: customers buy on our site; the donation share goes to a charity intermediary; the vendor is paid and fulfills the order separately; **business partners configure everything from their own profile, with no ShelterPawtners admin per product.**

**Proposed stack** (already anticipated in `docs/product/roadmap/PHASE-4.md` and `PHASE-5.md`):

- **Stripe Connect (Express accounts).**
  - Vendors onboard and complete identity checks themselves from their profile.
  - Stripe holds the money-transmission licensing.
  - Orders use destination charges, with `application_fee` for R2.
  - The vendor's pledge is transferred to the intermediary at settlement.
- **Stripe Tax** for marketplace-facilitator sales tax collection and remittance.
- **A donation intermediary** (provider selection is OD-004; `giving_providers` already lists `every_org` and `fiscal_sponsor`). Candidates such as Every.org and PayPal Giving Fund report no fees charged to charities, issue donor receipts, vet 501(c)(3) status, and can grant to shelters that have not enrolled. Expect payouts to take roughly 15–90 days.
- **Vendor self-service profile settings:**
  - products and prices;
  - discount;
  - pledge (%, flat, or none);
  - recipient shelter from the verified list;
  - fulfillment method (ship, pickup, or service booking);
  - order-notification email or webhook.
- **Order lifecycle:** paid → vendor notified → vendor marks fulfilled. A refund reverses the platform fee and the pledge in proportion, as **new appended rows**; history is never edited.
- **Data:** never store card data. Map to the existing `donation_transactions` and `partner_contribution_*` tables before proposing anything new.

This is RED, Phase 3 work. It needs an approved OD-008, an OD-004 provider choice, a legal review (co-venturer, sales tax, terms and the vendor agreement) and a dedicated design doc before any code.

## 5. Forecast specification

Build the workbook at `docs/business/economics/forecast.xlsx`, or as a Google Sheet linked from here. Every assumption is an editable, labeled input with a source note. The outputs are **illustrative scenarios, never platform performance.**

**Drivers, per channel (pet / RAVE / Store):**

- active vendors and monthly vendor growth;
- orders per vendor per month;
- average order value;
- `vendor_discount_bps`;
- share of vendors at Hero level and the average `pledge_bps`;
- flat-per-order pledges;
- add-on uptake % and average add-on amount;
- `take_bps`;
- processing rate;
- Stage 1 collection rate (the share of pledges actually paid);
- refund rate;
- Store units, average price and COGS;
- fixed monthly costs (hosting, provider fees, advisors, insurance).

**Scenarios:**

- Conservative, Base and Traction;
- months 1–24, plus a year-3 run rate;
- a sensitivity table on collection rate and Hero share.

**Outputs:**

- revenue by stream (R1–R6);
- donations by source (D1, D2, D4), split into pledged vs projected-settled;
- donations per participating shelter;
- operating cost;
- net position and break-even month;
- the donation-to-revenue ratio;
- vendor net value.

Translate dollars into impact (vaccinations, adoption fees) **only with unit costs the shelters supply.**

Before any number appears in public copy, it must pass the content rules in `PASSPORT-SAVINGS-IMPACT-MODEL.md` (cite the assumption, label it as illustrative).
