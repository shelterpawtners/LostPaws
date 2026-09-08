# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: Harden first-known/returning attribution against concurrent confirmations, rerun Persona QA, then return to full Hosted QA acceptance
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES

This file is the shared baton between ChatGPT, Codex, Copilot, GitHub Actions, and human review.

## Rules

- GitHub Issues define task scope; code/commits contain implementation; this file records current state.
- Never store secrets/private customer data here.
- Phase 2 remainder is authorized under `docs/AUTONOMOUS-EXECUTION-POLICY.md`.
- Do not expose customer-facing `verified savings` until its evidence/calculation standard is explicitly approved.
- Phase 3, production/DNS, paid infrastructure, material RED decisions, auto-merge, and destructive production actions remain owner-gated.
- Follow `docs/AI-COST-AND-TESTING-GOVERNANCE.md`: GitHub Actions is the deterministic control plane; do not spend AI credits for polling or routine green validation.

## Current handoff

Updated by: ChatGPT architecture acceptance review
Branch: `qa/guardian-registration-personas`
Active PR: #2 (`<!-- ai-active-build-pr -->`)
Active Issue: #13
Current head before concurrency hardening: `de34405ee92363f8f54ee1c2a7df5311f01d1cdc`

### Checkpoint 5 implemented scope

- Reuse `retail_amount_minor`, `paid_amount_minor`, and `currency_code`; no duplicate money model.
- Non-customer-facing `candidate_savings_minor` uses exact integer minor-unit math with zero floor.
- Reference value kind/source and evidence metadata preserve provenance.
- `shelterpawtners_relationship` derives `first_known` / `returning` only from prior non-demo confirmed Guardian + Partner redemptions.
- Partner customer attestation is independent (`new_to_business` / `existing_customer` / `unknown`); ShelterPawtners history does not imply business-newness.
- Redemption confirmation accepts optional attribution without breaking existing callers.
- Corrections are append-only delta events; reversal audit history remains compatible.
- Partner redemption UI optionally captures reference/list value, amount actually paid, currency, reference type/source, evidence reference, and Partner customer attestation while explicitly stating the values are not verified savings.
- Targeted Playwright verifies the Partner UI values persist and produce exact candidate savings.

### Accepted deterministic evidence before final hardening

- Persona QA #56 passed the CP5 database foundation end to end.
- pgTAP plan mismatch was corrected from 12 to 14 without weakening assertions.
- Persona QA #59 attempt 2 on feature/test SHA `7ecaf0359ab8d2cba0c68cb39a45bce9acd487c5` PASSED local Supabase reset/seed, all pgTAP/RLS tests, and Guardian/persona/access/redemption Playwright including CP5 attribution persistence.
- Hosted QA credential duplication was removed by reusing the validated Guardian QA identity for non-admin denial coverage; authorization assertions remain unchanged.
- CI remained green through the hosted-QA and QA-user-factory fixes.

### Architecture finding — GREEN concurrency hardening

The current `confirm_redemption` classification is correct sequentially but can race when two different claims for the same Guardian + Partner are confirmed concurrently. Both transactions could observe no prior confirmed redemption and both persist `first_known`, corrupting customer-attribution analytics.

This is a GREEN data-integrity defect within CP5, not a product-owner decision. Harden before acceptance by:

1. serializing non-demo Guardian + Partner relationship classification with a transaction-scoped advisory lock;
2. adding a unique partial index that guarantees at most one persisted `first_known` confirmed non-demo redemption per Guardian + Partner;
3. extending pgTAP to guard both the serialized implementation and the one-first-known invariant;
4. rerunning Persona QA and Hosted QA acceptance.

Do not weaken existing attribution, RLS, replay, or append-only assertions.

### Deliberate RED boundary

No effective/adjusted customer-facing savings total or lifetime verified total is introduced. Original captured values stay immutable and corrections stay append-only. Deciding how corrections, refunds, reversals, bundles, free items, evidence strength, or Partner-entered values roll into customer-facing `verified savings` remains the explicit Checkpoint 5 financial/product rule gate.

### Vercel connector blocker

Direct ChatGPT Vercel API access still returns an empty team list after reconnect attempts. This remains an external OAuth/account-scope issue and does not block GitHub/Vercel Hosted QA, which independently observes exact-SHA deployment readiness.

### Human action required

None for this concurrency hardening. Continue autonomously, then return to the verified-savings owner gate after green acceptance.
