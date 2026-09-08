# AI Handoff

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: Run full Hosted QA on the corrected acceptance head; if green, mark the CP5 pre-decision slice COMPLETE, keep verified-savings rules owner-gated, and continue only safely separable provider-agnostic Phase 2 Checkpoint 6 work
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES

This file is the shared baton between ChatGPT, Codex, Copilot, GitHub Actions, and human review.

## Rules

- GitHub Issues define task scope; code/commits contain implementation; this file records current state.
- Never store secrets/private customer data here.
- Phase 2 remainder is authorized under `docs/AUTONOMOUS-EXECUTION-POLICY.md`.
- Do not expose customer-facing `verified savings` until its evidence/calculation standard is explicitly approved.
- Phase 3, production/DNS, paid infrastructure, material RED decisions, auto-merge, destructive migrations, and destructive production actions remain owner-gated.
- Follow `docs/AI-COST-AND-TESTING-GOVERNANCE.md`: GitHub Actions is the deterministic control plane; do not spend AI credits for polling or routine green validation.

## Current handoff

Updated by: ChatGPT automation execution
Branch: `qa/guardian-registration-personas`
Active PR: #2 (`<!-- ai-active-build-pr -->`)
Active Issue: #13
Concurrency migration SHA: `882c958b804c4466b47bfe108364c45427186d1a`
Concurrency test fix SHA: `c2003df199d57d96660fd842e817a07314fd5879`
Hosted Admin QA selector fix SHA: `4614e3cef2f67378cb8cf827b364abda2a9b84e5`

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

### Concurrency/data-integrity hardening

Architecture review identified that two different claims for the same Guardian + Partner could be confirmed concurrently and both observe no prior redemption. CP5 prevents duplicate `first_known` attribution by:

- taking a transaction-scoped advisory lock keyed to Guardian + Partner before relationship classification;
- enforcing a unique partial index allowing at most one confirmed non-demo `first_known` redemption per Guardian + Partner;
- failing migration loudly instead of silently rewriting history if pre-existing duplicate first-known classifications are ever detected;
- retaining secure-token replay locking and all existing RLS/authorization controls.

### Deterministic evidence

- Persona QA #62 on concurrency-hardened head `c2003df199d57d96660fd842e817a07314fd5879`: PASS.
  - local Supabase start/reset/seed: PASS;
  - all pgTAP/RLS suites including 16 CP5 assertions: PASS;
  - Guardian/persona/access/redemption Playwright: PASS.
- CI #211: PASS on the concurrency-hardened slice.
- CI #214 on pre-fix acceptance head `a98b5ac387892629e92c633390b99ebc21e0f3d2`: PASS.
- Hosted QA #112 on `a98b5ac387892629e92c633390b99ebc21e0f3d2`: FAILED only in Admin QA browser selector logic after Vercel exact-SHA readiness succeeded.
  - 6 hosted tests passed before the serial suite stopped; 2 later tests did not run.
  - Failure classification: GREEN test-selector defect, not application authorization, Supabase, RLS, deployment readiness, or CP5 savings behavior.
  - Root cause: `getByRole("status")` became ambiguous because the page legitimately contains both the Admin QA banner and a separate empty live status region.
  - Correction `4614e3c`: all Admin QA persona-banner assertions target the status region containing `ADMIN QA MODE`; coverage is narrowed semantically rather than weakened.
- CI #217 on the corrected head lineage: PASS (`npm ci`, lint, unit tests, production build).
- Full Hosted QA on the corrected READY head is the remaining CP5 acceptance evidence.

### Cost-control state

- No Copilot/Copilot review was invoked for this diagnosis or fix.
- The defect was diagnosed from native GitHub Actions logs and corrected directly.
- Persona QA remains change-aware/deliberate rather than being attached to every PR update.

### Deliberate RED boundary

No effective/adjusted customer-facing savings total or lifetime verified total is introduced. Original captured values stay immutable and corrections stay append-only. The owner must still approve what evidence/calculation qualifies as customer-facing `verified savings`, including treatment of corrections, refunds, reversals, bundles, free items, evidence strength, and Partner-entered values.

This RED rule does not automatically block provider-agnostic Checkpoint 6 engineering that does not depend on verified-savings totals or charitable-money provider selection. Issue #14 is prepared as the bounded CP6 contract but implementation must not advance until the CP5 pre-decision acceptance evidence is green and recorded COMPLETE.

### Vercel connector blocker

Direct ChatGPT Vercel access remains unauthorized/incomplete: `list_teams` returns exactly `{"teams": []}`, so team `jims-projects-acec6bcb` and project `lost-paws` cannot be enumerated or inspected through the connector. This is an OAuth/account-scope blocker. It is independent of deployment readiness: Hosted QA #112's native GitHub/Vercel readiness gate confirmed the exact acceptance SHA Ready on `https://lost-paws-one.vercel.app/` before browser tests ran.

### Human action required

None for the current GREEN selector correction. Continue deterministic acceptance. After CP5 pre-decision acceptance, the verified-savings rule remains an owner decision before any customer-facing verified totals are enabled; independent provider-agnostic Phase 2 work may continue.
