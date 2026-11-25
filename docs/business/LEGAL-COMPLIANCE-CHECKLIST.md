# Business-admin and compliance due-diligence checklist

Status: **Direction approved 2026-11-25 (Issue #325); items open.** This is not legal advice. It complements `docs/legal/OWNER-LEGAL-REVIEW-CHECKLIST.md`, which covers publishing the Terms and Privacy pages.

- **Advisor** means a licensed attorney, CPA or broker must review the item.
- Each item has a sanitized public line here. Contracts, quotes, pricing and advisor correspondence live in the private business workspace (see `README.md`).
- AI tools, including the Claude `legal` plugin, produce drafts only. **They never count as sign-off.**

| #   | Item                                                                                                                                                                                                         | Blocks                       | Advisor        | Status        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- | -------------- | ------------- |
| 1   | Entity decision: LLC, 501(c)(3), LLC with a fiscal sponsor, or two entities                                                                                                                                  | OD-005; everything financial | Attorney + CPA | Open          |
| 2   | Michigan formation, EIN, business bank account, registered agent                                                                                                                                             | Payments, contracts          | Attorney       | Open (OD-005) |
| 3   | Charitable-solicitation and commercial co-venturer analysis for each state where shelter-benefit claims are made (activity, contracts, recipients, fund flows; not entity type alone)                        | D1/D2 public claims          | Attorney       | Open          |
| 4   | Donation-intermediary agreement and recipient-eligibility policy (501(c)(3), municipal, fiscal-sponsored rescues)                                                                                            | OD-004                       | Attorney       | Open          |
| 5   | Vendor/partner agreement covering marketplace terms, pledge obligations, settlement and reconciliation, refunds and chargebacks, fulfillment responsibility, the Hero program, and the free founding account | Stage 1–2                    | Attorney       | Open          |
| 6   | Sales tax: Store nexus now; marketplace-facilitator obligations if integrated commerce ships                                                                                                                 | Store sales, R2              | CPA            | Open          |
| 7   | Payments compliance: provider platform terms, KYC, PCI scope, prohibited flows, no custody of charitable funds, platform dispute liability                                                                   | OD-008                       | Attorney       | Open          |
| 8   | Advertising and disclosures: FTC affiliate and sponsorship disclosures, "illustrative" labels, no deductibility wording next to discounts or pledges                                                         | Public copy                  | Attorney       | Open          |
| 9   | IP and affiliation: RAVE Shelter and LostPaws marks; no implied Lost Lands/Excision endorsement; image and content licensing                                                                                 | Marketing                    | Attorney       | Open          |
| 10  | Insurance: general liability, product liability for own goods, cyber, event coverage                                                                                                                         | Events, Store                | Broker         | Open          |
| 11  | Accounting controls: chart of accounts that separates Store revenue, platform revenue and pass-through charitable funds; 1099-K/1099 handling; reconciliation sign-off                                       | Any revenue                  | CPA            | Open          |
| 12  | Privacy, consent and retention: Guardian and vendor data in payments, intermediaries and matching; consent records; export and deletion                                                                      | Stage 2, data features       | Attorney       | Open          |
| 13  | Own-goods product compliance: labeling; pet-food or treat feed registration and licensing where required; recall plan; supplier documentation                                                                | Treats, tags, kits           | Attorney       | Open          |
| 14  | Refunds and chargebacks: consumer refund policy, chargeback handling, effect on pledges after disbursement                                                                                                   | Store, Stage 2               | Attorney + CPA | Open          |

## Tools

- **Claude:** the `legal` plugin (`compliance-check`, `legal-risk-assessment`, `review-contract`, `vendor-check`) and `product-management:write-spec`, for drafts.
- **ChatGPT:** decision framing and sourced research.
- **Claude Cowork:** keeps the private checklist detail and the forecast current, once a private workspace exists.
- **Humans:** paid attorney and CPA sessions once items 1, 3, 5, 6 and 13 are drafted.
