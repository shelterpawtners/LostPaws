# AI Handoff

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: Run full Hosted QA for the hardened CP5 pre-decision slice; if green, mark that slice COMPLETE, record verified-savings rules as an owner decision gate, and continue only safely separable Phase 2 Checkpoint 6 provider-agnostic work
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
Concurrency migration SHA: `882c958b804c4466b47bfe108364c45427186d1a`
Concurrency test fix SHA: `c2003df199d57d96660fd842e817a07314fd5879`

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

Architecture review identified that two different claims for the same Guardian + Partner could be confirmed concurrently and both observe no prior redemption. CP5 now prevents duplicate `first_known` attribution by:

- taking a transaction-scoped advisory lock keyed to Guardian + Partner before relationship classification;
- enforcing a unique partial index allowing at most one confirmed non-demo `first_known` redemption per Guardian + Partner;
- failing migration loudly instead of silently rewriting history if pre-existing duplicate first-known classifications are ever detected;
- retaining secure-token replay locking and all existing RLS/authorization controls.

### Deterministic acceptance evidence

- Earlier CP5 Persona QA runs established migration/RLS/attribution/UI behavior.
- Persona QA #62 on concurrency-hardened head `c2003df199d57d96660fd842e817a07314fd5879`: PASS.
  - local Supabase start/reset/seed: PASS;
  - all pgTAP/RLS suites including 16 CP5 assertions: PASS;
  - Chromium install: PASS;
  - Guardian/persona/access/redemption Playwright: PASS.
- CI #211: PASS.
- Hosted QA remains lightweight while IN_PROGRESS and must now run full browser acceptance from this READY handoff state.

### Deliberate RED boundary

No effective/adjusted customer-facing savings total or lifetime verified total is introduced. Original captured values stay immutable and corrections stay append-only. The owner must still approve what evidence/calculation qualifies as customer-facing `verified savings`, including treatment of corrections, refunds, reversals, bundles, free items, evidence strength, and Partner-entered values.

This RED rule does not automatically block provider-agnostic Checkpoint 6 engineering that does not depend on verified-savings totals or charitable-money provider selection. Complete and record the CP5 pre-decision slice first, then continue only safely separable Phase 2 work.

### Vercel connector blocker

Direct ChatGPT Vercel API access still returns an empty team list after reconnect attempts. This remains an external OAuth/account-scope issue and does not block GitHub/Vercel Hosted QA, which independently observes exact-SHA deployment readiness.

### Human action required

None until full Hosted QA completes. After CP5 pre-decision acceptance, the verified-savings rule is an owner decision before any customer-facing verified totals are enabled; independent provider-agnostic Phase 2 work may continue.
