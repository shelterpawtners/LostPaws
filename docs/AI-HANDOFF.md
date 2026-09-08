# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: Complete the fresh Persona QA run, classify any remaining failure, then finish CP5 acceptance evidence before the verified-savings RED rule gate
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

Updated by: ChatGPT supervisory validator
Branch: `qa/guardian-registration-personas`
Active PR: #2 (`<!-- ai-active-build-pr -->`)
Active Issue: #13
Code/workflow head before this handoff update: `c0e9951918dfa2072b1a9599dd0e7fc033c86ff5`

### Checkpoint 5 implemented scope

- Reuse `retail_amount_minor`, `paid_amount_minor`, and `currency_code`; no duplicate money model.
- Non-customer-facing `candidate_savings_minor` uses exact integer minor-unit math with zero floor.
- Reference value kind/source and evidence metadata preserve provenance.
- `shelterpawtners_relationship` derives `first_known` / `returning` only from prior non-demo confirmed Guardian + Partner redemptions.
- Partner customer attestation is independent (`new_to_business` / `existing_customer` / `unknown`); ShelterPawtners history does not imply business-newness.
- Redemption confirmation accepts optional attribution without breaking existing callers.
- Corrections are append-only delta events; reversal audit history remains compatible.
- Unit + pgTAP coverage exists for exact math, provenance, attribution separation, relationship classification, non-negative savings, adjustments, and reversal compatibility.

### Validation / automation state

- Prior CP5 Persona QA #54 failed only because the pgTAP file planned 12 tests while running 14; every CP5 assertion itself passed. Classified as a test-plan defect, not app/RLS/migration behavior.
- Commit `2b6fc4cac752c0ff2e7f1dd00f62562f9ebc56ea` corrected only `select plan(12)` → `select plan(14)`; no assertion was removed or weakened.
- Commit `c0e9951918dfa2072b1a9599dd0e7fc033c86ff5` makes Persona QA automatically run only for database/RLS/persona-sensitive PR changes while retaining manual dispatch. This removes a human/AI trigger without running the heavy suite on ordinary frontend/docs commits.
- Fresh Persona QA #55 (`34239115732`) is currently in progress on `c0e9951918dfa2072b1a9599dd0e7fc033c86ff5`.
- Hosted QA #86 ran the lightweight IN_PROGRESS gate; heavy hosted browser acceptance remains skipped until the checkpoint reaches the acceptance boundary.
- CI is running/expected on the same head; prior CI was green.

### Vercel connector

The ChatGPT Vercel connector still returns an empty team list, so direct Vercel API access remains an OAuth/account-scope blocker. This is independent of LostPaws application QA and does not block GitHub/Supabase work.

### Remaining CP5 work

1. Finish Persona QA #55 and classify any result.
2. Add targeted attribution Playwright only if current coverage leaves a meaningful gap.
3. Decide whether adjusted candidate totals need a read helper over append-only correction events before CP5 acceptance.
4. Update durable progress/decision docs.
5. Move to `READY_FOR_ACCEPTANCE` only when deterministic evidence is green; then run full Hosted QA acceptance.
6. Stop narrowly if the customer-facing verified-savings rule is required.

### Human action required

None for CP5 right now. Vercel reconnect is still needed if direct Vercel management from ChatGPT is desired.
