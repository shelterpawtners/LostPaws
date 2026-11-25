# Business, revenue, and compliance

Status: **Direction approved 2026-11-25 on Issue #325; documents PROPOSED.** Drafted by Claude Code from owner direction and the ChatGPT review. Nothing here is tax or legal advice. Nothing here authorizes payments, money movement, or public claims; those stay gated by OD-002, OD-003, OD-004, OD-005 and OD-006 through OD-009 in `docs/DECISIONS.md`.

This domain holds the business-side planning that sits beside product work, so it is tracked separately from engineering tasks:

| Document                        | Purpose                                                                                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `REVENUE-STREAMS.md`            | A register of every revenue and donation stream: who pays, the money flow, tax and legal notes, how it is verified, and its phase.                                 |
| `DONATION-ECONOMICS.md`         | Federal tax framing, the donation and discount formulas, verification stages, the on-site checkout model, and the forecast specification.                          |
| `LEGAL-COMPLIANCE-CHECKLIST.md` | Business-admin due diligence (entity, registrations, sales tax, payments, agreements, insurance, books), with an owner, a status and an advisor flag on each item. |

These docs build on existing documents rather than replacing them:

- `docs/product/BUSINESS-GIVING-AND-TAX-CONSIDERATIONS.md`: the business-facing tax draft. ShelterPawtners never takes custody of donated funds.
- `docs/product/DUAL-MARKETPLACE-RAVE-SHELTER-EXECUTION-PLAN.md`: the ShelterPawtners Marketplace and RAVE Shelter Marketplace, and the Hero Vendor program at 5% or more.
- `docs/product/OWNER-DECISIONS-NEXT-SPRINT.md`: the open questions on the Hero 5% basis, recipients, money movement and tax reporting.
- `docs/product/DONATION-TRACKING-SCHEMA-PROPOSAL.md` and `docs/data/FINANCIAL-LEDGER-AND-GIVING.md`: the existing giving schema (`partner_contribution_commitments`, evidence and review, `donation_intents`, `donation_transactions`).
- `docs/product/PASSPORT-SAVINGS-IMPACT-MODEL.md`: the Guardian savings scenarios.
- `docs/legal/OWNER-LEGAL-REVIEW-CHECKLIST.md`: review of the Terms and Privacy text.

## Public vs private

This repository is **public**. Only engineering-facing requirements and sanitized checklists belong here.

The following belong in an access-controlled private workspace:

- pricing and fee rates;
- supplier quotes and negotiations;
- forecasts and cash projections;
- contracts and advisor correspondence;
- confidential strategy;
- security material.

The owner chooses that location (a private GitHub repository or Microsoft 365 are the candidates). Creating or migrating it needs separate approval.

The owner should also assess what earlier public comments and history already disclosed. Deleting them does not remove copies.

Standing rule: AI tools may research, draft and organize. A CPA and a nonprofit or marketplace attorney must sign off on tax treatment, entity structure and any public donation or savings claim before it ships.
