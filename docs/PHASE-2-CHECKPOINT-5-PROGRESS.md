# Phase 2 Checkpoint 5 — Savings + Customer Attribution Progress

## Scope

Checkpoint 5 is implementing the provider- and rule-independent foundation for savings and customer attribution. It deliberately stops before any customer-facing `verified savings` calculation/evidence rule.

## Implemented

- Existing `retail_amount_minor`, `paid_amount_minor`, and `currency_code` remain the canonical captured transaction values.
- `candidate_savings_minor` is generated from exact integer minor-unit subtraction with a zero floor; it is not labeled verified.
- Reference-value kind/source plus evidence reference/metadata preserve provenance.
- `shelterpawtners_relationship` classifies `first_known` vs `returning` using prior non-demo confirmed Guardian + Partner redemptions only.
- Partner customer attestation is independently captured as `new_to_business`, `existing_customer`, or `unknown`; platform relationship history never implies business-newness.
- Redemption corrections are append-only delta events and existing reversal history remains append-audited.
- Partner redemption UI can optionally capture reference/list value, amount actually paid, currency, reference type/source, evidence reference, and Partner customer attestation while explicitly warning that captured values are candidate context rather than verified savings.

## Validation

Baseline CP5 evidence before the Partner attribution UI completion:

- CI passed.
- Hosted QA lightweight IN_PROGRESS gate passed.
- Persona QA #56 passed end to end, including local Supabase start/reset/seed, all pgTAP database tests, and Guardian/persona/access/redemption Playwright tests.
- The earlier pgTAP plan-count defect was corrected from 12 to 14 without removing or weakening assertions.

Current UI completion slice:

- `6071c6f43ac2746304c9405c3ed0093de382a043` — optional Partner attribution capture UI.
- `44cd3b61dc2e2ca11c122bdfe62b67a0581fd7c1` — Playwright verifies UI capture persists reference/paid values, candidate savings, provenance, and Partner customer attestation.
- `7ecaf0359ab8d2cba0c68cb39a45bce9acd487c5` — formatting correction after deterministic CI identified Prettier drift.
- CI on `7ecaf0359ab8d2cba0c68cb39a45bce9acd487c5` has passed lint, unit tests, and production build.
- Fresh Persona QA is required on the final slice before Checkpoint 5 can move to acceptance.

## Deliberate boundary

No effective/adjusted customer-facing savings total is introduced in this checkpoint before the verified-savings evidence/calculation rule is approved. Original captured transaction values remain immutable and correction deltas remain auditable. Deciding how corrections, refunds, reversals, bundles, free items, and evidence confidence roll into a customer-facing lifetime or verified total is part of the explicit Checkpoint 5 RED rule gate, not a routine engineering assumption.

## Remaining before acceptance

1. Obtain green Persona QA on the final Partner attribution UI/test slice.
2. Confirm CI remains green on the same final SHA.
3. Update `docs/AI-HANDOFF.md` to `READY_FOR_ACCEPTANCE` only after deterministic evidence is green.
4. Run the full Hosted QA acceptance boundary on the exact READY SHA.
5. Stop before enabling customer-facing `verified savings` until the owner approves the calculation/evidence standard.

Vercel direct API management is not required for repository QA. The ChatGPT Vercel connector currently returns no teams, which remains an external OAuth/account-scope blocker.
