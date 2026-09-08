# AI Handoff

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: Run the full Hosted QA acceptance boundary for the CP5 pre-decision slice; after acceptance, stop at the customer-facing verified-savings RED rule gate
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

Updated by: ChatGPT automation execution
Branch: `qa/guardian-registration-personas`
Active PR: #2 (`<!-- ai-active-build-pr -->`)
Active Issue: #13
Final CP5 code/test SHA: `7ecaf0359ab8d2cba0c68cb39a45bce9acd487c5`

### Checkpoint 5 implemented scope

- Reuse `retail_amount_minor`, `paid_amount_minor`, and `currency_code`; no duplicate money model.
- Non-customer-facing `candidate_savings_minor` uses exact integer minor-unit math with zero floor.
- Reference value kind/source and evidence metadata preserve provenance.
- `shelterpawtners_relationship` derives `first_known` / `returning` only from prior non-demo confirmed Guardian + Partner redemptions.
- Partner customer attestation is independent (`new_to_business` / `existing_customer` / `unknown`); ShelterPawtners history does not imply business-newness.
- Redemption confirmation accepts optional attribution without breaking existing callers.
- Corrections are append-only delta events; reversal audit history remains compatible.
- The Partner redemption UI optionally captures reference/list value, amount actually paid, currency, reference type/source, evidence reference, and Partner customer attestation while explicitly stating the values are not verified savings.
- Targeted Playwright verifies the Partner UI values persist and produce exact candidate savings.

### Deterministic validation — GREEN

- Persona QA #56 passed the CP5 database foundation end to end.
- The earlier pgTAP plan mismatch was corrected from 12 to 14 without weakening any assertion.
- CI on the final code/test SHA passed lint, unit tests, and production build after a formatting-only GREEN fix.
- Persona QA #59 attempt 2 on exact final code/test SHA `7ecaf0359ab8d2cba0c68cb39a45bce9acd487c5` PASSED:
  - npm install/setup;
  - local Supabase start;
  - database reset and deterministic seed;
  - all pgTAP database/RLS tests;
  - browser environment export;
  - Chromium install;
  - Guardian/persona/access/redemption Playwright, including CP5 attribution persistence.
- Lightweight Hosted QA gates on the implementation/workflow heads passed. Full Hosted QA is now authorized at this READY boundary.

### Cost-control correction

Persona QA is deliberate/manual again. A temporary `pull_request.paths` trigger was removed because GitHub evaluates path filters against the whole long-lived PR, which could repeatedly launch the heavy local-Supabase + Chromium suite on later documentation/status commits. The final cancelled Persona job was rerun directly on the exact code SHA instead.

### Durable progress record

See `docs/PHASE-2-CHECKPOINT-5-PROGRESS.md` for the implemented scope, evidence, and RED boundary.

### Deliberate RED boundary

No effective/adjusted customer-facing savings total or lifetime verified total is introduced here. Original captured values stay immutable and corrections stay append-only. Deciding how corrections, refunds, reversals, bundles, free items, evidence strength, or Partner-entered values roll into customer-facing `verified savings` is the explicit Checkpoint 5 financial/product rule gate and must not be guessed.

### Vercel connector

The ChatGPT Vercel connector still returns an empty team list, so direct API access to team `jims-projects-acec6bcb` / project `lost-paws` remains blocked by Vercel OAuth/account scope. This does not block repository acceptance because Hosted QA uses the configured GitHub/Vercel integration and stable QA surface.

### Remaining CP5 work

1. Run and inspect the full Hosted QA acceptance boundary on this READY handoff state.
2. If acceptance is green, mark the pre-decision CP5 engineering slice complete/accepted and stop narrowly at the verified-savings calculation/evidence rule gate.
3. Do not enable customer-facing `verified savings` until the owner approves that rule.

### Human action required

None until the Hosted QA acceptance result is known. The next product decision is the explicit verified-savings rule gate after the pre-decision engineering slice is accepted.
