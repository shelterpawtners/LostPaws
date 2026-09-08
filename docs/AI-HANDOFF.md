# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: Finish the rerun Persona QA on the final CP5 attribution UI/test SHA, then move to acceptance only if deterministic evidence is green
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
Latest non-doc/workflow CP5 code/test SHA: `7ecaf0359ab8d2cba0c68cb39a45bce9acd487c5`
Current branch head before this handoff update: `ae2bc5e5d838078205ce02e9bf60a7cc967b66d6`

### Checkpoint 5 implemented scope

- Reuse `retail_amount_minor`, `paid_amount_minor`, and `currency_code`; no duplicate money model.
- Non-customer-facing `candidate_savings_minor` uses exact integer minor-unit math with zero floor.
- Reference value kind/source and evidence metadata preserve provenance.
- `shelterpawtners_relationship` derives `first_known` / `returning` only from prior non-demo confirmed Guardian + Partner redemptions.
- Partner customer attestation is independent (`new_to_business` / `existing_customer` / `unknown`); ShelterPawtners history does not imply business-newness.
- Redemption confirmation accepts optional attribution without breaking existing callers.
- Corrections are append-only delta events; reversal audit history remains compatible.
- The Partner redemption UI now optionally captures reference/list value, amount actually paid, currency, reference type/source, evidence reference, and Partner customer attestation while explicitly stating the values are not verified savings.
- Targeted Playwright now verifies those UI-captured values persist and produce exact candidate savings.

### Validation state

- Persona QA #56 passed the CP5 database foundation end to end: local Supabase start/reset/seed, all pgTAP database tests, and Guardian/persona/access/redemption Playwright.
- The earlier pgTAP plan mismatch was corrected from 12 to 14 without weakening any assertion.
- CI on `7ecaf0359ab8d2cba0c68cb39a45bce9acd487c5` passed lint, unit tests, and production build after a formatting-only GREEN fix.
- Hosted QA on the implementation slice passed the lightweight IN_PROGRESS gate; full hosted acceptance remains intentionally deferred until `READY_FOR_ACCEPTANCE`.
- Persona QA run #59 on the final UI/test SHA was cancelled by subsequent documentation/workflow commits before reaching database/browser assertions. The cancelled job has been intentionally rerun as attempt 2 on the exact code/test SHA; it is currently pending.
- Current branch head `ae2bc5e5d838078205ce02e9bf60a7cc967b66d6` has green CI and green lightweight Hosted QA.

### Cost-control correction

The temporary `pull_request.paths` Persona QA trigger was removed. On this long-lived PR, GitHub evaluates PR path filters against the whole PR, so docs/status commits could repeatedly launch the heavy local-Supabase + Chromium suite after any sensitive file had entered the PR. Persona QA is deliberate/manual again; a cancelled final-code job was rerun directly instead of reintroducing the noisy trigger.

### Durable progress record

See `docs/PHASE-2-CHECKPOINT-5-PROGRESS.md` for the implemented scope, evidence, and RED boundary.

### Deliberate RED boundary

No effective/adjusted customer-facing savings total or lifetime verified total is introduced here. Original captured values stay immutable and corrections stay append-only. Deciding how corrections, refunds, reversals, bundles, free items, evidence strength, or Partner-entered values roll into customer-facing `verified savings` is the explicit Checkpoint 5 financial/product rule gate and must not be guessed.

### Vercel connector

The ChatGPT Vercel connector still returns an empty team list, so direct API access to team `jims-projects-acec6bcb` / project `lost-paws` remains blocked by Vercel OAuth/account scope. This does not block GitHub/Supabase validation.

### Remaining CP5 work

1. Finish Persona QA run #59 attempt 2 on `7ecaf0359ab8d2cba0c68cb39a45bce9acd487c5` and classify the result.
2. If green, update this handoff to `READY_FOR_ACCEPTANCE` and run the full Hosted QA acceptance boundary on the resulting exact READY SHA.
3. Stop before enabling customer-facing `verified savings`; that rule still requires owner approval.

### Human action required

None for the active engineering slice. Vercel reconnect remains external account work if direct Vercel management from ChatGPT is desired.
