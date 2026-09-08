# AI Handoff

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: Run the full Hosted QA acceptance boundary for the CP5 pre-decision slice; if green, mark the slice COMPLETE and stop at the customer-facing verified-savings RED rule gate
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
Final CP5 feature/test SHA: `7ecaf0359ab8d2cba0c68cb39a45bce9acd487c5`
Hosted QA credential-dedup fix SHA: `78ebdf34478f7280675c8c996d2309d89c0c8d41`

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

### Deterministic validation

- Persona QA #56 passed the CP5 database foundation end to end.
- Earlier pgTAP plan mismatch was corrected from 12 to 14 without weakening any assertion.
- Persona QA #59 attempt 2 on exact feature/test SHA `7ecaf0359ab8d2cba0c68cb39a45bce9acd487c5` PASSED local Supabase reset/seed, all pgTAP/RLS tests, and Guardian/persona/access/redemption Playwright including CP5 attribution persistence.
- CI #199 passed on pre-acceptance head `584d8b0576d2c3b616a8f71644dce85cff461c65`.
- Hosted QA #97 reached exact-SHA Vercel Ready and then failed only in `admin-qa-mode.spec.ts` because the configured duplicate non-admin credential pair was mismatched. Failure evidence showed Guardian A email paired with a different Guardian password and Supabase returned `Invalid login credentials`.
- Classification: hosted QA configuration duplication, not CP5 application, RLS, authorization, migration, or Vercel readiness failure.
- GREEN correction: Admin QA denial coverage now reuses the already-required/validated Guardian QA credentials as its non-admin identity; dedicated `QA_NON_ADMIN_*` secrets were removed from the workflow. The authorization assertion remains unchanged.
- CI #201 PASSED the credential-dedup code/workflow fix.
- Full Hosted QA rerun on the final READY handoff state is the remaining acceptance evidence.

### Cost-control notes

- No Copilot/Copilot review was invoked for this defect.
- Persona QA remains deliberate/manual; no repeated heavy schema suite is attached to every long-lived PR update.
- Hosted acceptance still verifies Vercel reports the exact acceptance SHA Ready before browser tests run.

### Deliberate RED boundary

No effective/adjusted customer-facing savings total or lifetime verified total is introduced. Original captured values stay immutable and corrections stay append-only. Deciding how corrections, refunds, reversals, bundles, free items, evidence strength, or Partner-entered values roll into customer-facing `verified savings` is the explicit Checkpoint 5 financial/product rule gate and must not be guessed.

### Vercel connector blocker

Direct ChatGPT Vercel API access remains blocked: `list_teams` returns an empty team list, so team `jims-projects-acec6bcb` / project `lost-paws` cannot be queried through the connector. This is an OAuth/account-scope issue. It does not block Hosted QA because the GitHub/Vercel integration independently reported the exact acceptance deployment Ready.

### Remaining CP5 work

1. Inspect the full Hosted QA rerun on this final READY handoff state.
2. If green, mark the pre-decision CP5 engineering slice COMPLETE/accepted and stop narrowly at the verified-savings calculation/evidence RED gate.
3. Do not enable customer-facing `verified savings` until the owner approves that rule.

### Human action required

None until Hosted QA completes. The next owner decision is the verified-savings rule gate after the pre-decision engineering slice is accepted.
