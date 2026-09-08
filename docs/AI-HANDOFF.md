# AI Handoff

STATUS: COMPLETE
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: Phase 2 Checkpoint 6 — provider-agnostic impact, reputation + giving foundation (Issue #14)
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES

This file is the shared baton between ChatGPT, repository automation, GitHub Actions, and human review.

## Rules

- GitHub Issues define task scope; code/commits contain implementation; this file records current state.
- Never store secrets/private customer data here.
- Phase 2 remainder is authorized under `docs/AUTONOMOUS-EXECUTION-POLICY.md`.
- Do not expose customer-facing `verified savings` until its evidence/calculation standard is explicitly approved.
- Phase 3, production/DNS, paid infrastructure, material RED decisions, auto-merge, destructive migrations, and destructive production actions remain owner-gated.
- Follow `docs/AI-COST-AND-TESTING-GOVERNANCE.md`: GitHub Actions is the deterministic control plane; do not spend AI credits for polling or routine green validation.

## Current handoff

Updated by: ChatGPT supervisory build controller
Branch: `qa/guardian-registration-personas`
Active PR: #2 (`<!-- ai-active-build-pr -->`)
Completed Issue: #13
Next authorized Issue: #14
Accepted CP5 head: `373fcd53126a060fa762f486097645bc940fc072`
Admin QA false-success locator correction: `d39b99b06202999f2d07a84f6b5394c986a718e4`

## Checkpoint 5 accepted scope

- Reuses `retail_amount_minor`, `paid_amount_minor`, and `currency_code`; no duplicate money model.
- Non-customer-facing `candidate_savings_minor` uses exact integer minor-unit math with zero floor.
- Reference value kind/source and evidence metadata preserve provenance.
- `shelterpawtners_relationship` derives `first_known` / `returning` only from non-demo confirmed Guardian + Partner redemptions and is concurrency-hardened.
- Partner customer attestation remains independent (`new_to_business` / `existing_customer` / `unknown`).
- Redemption confirmation accepts optional attribution without breaking existing callers.
- Corrections remain append-only delta events; reversal/audit history remains intact.
- Partner redemption UI captures optional candidate-savings context without presenting it as verified savings.

## Final acceptance evidence

- Persona QA #62: PASS after CP5 concurrency hardening, including migration replay, pgTAP/RLS, and Guardian/persona/access/redemption Playwright.
- CI #231 on accepted head `373fcd53`: PASS.
- Hosted QA #128 on accepted head `373fcd53`: PASS.
- Hosted QA #128 executed the full `hosted-smoke` job successfully, including handoff/config authorization checks, Vercel readiness verification, dependency install, Chromium install, and the hosted smoke Playwright suite.
- The prior Admin QA false-success regression defect was corrected without weakening the visible-error, authorization, session, or RLS assertions.
- No open CP5 application, test, RLS, deployment, or environment blocker remains.

## Next authorized task — Checkpoint 6

Issue #14 is authorized to begin because its stated precondition is now satisfied: CP5 has green Hosted QA acceptance and is recorded COMPLETE.

CP6 must remain provider-agnostic and may implement truthful Partner participation/reputation progression, contribution commitments/accrual semantics, privileged verification of external settled-contribution evidence, permission-safe impact metrics, and targeted RLS/audit regression using existing Phase 1 giving/economic foundations.

Do not route or settle production charitable funds, integrate a production giving provider, imply pledges/accruals are settled donations, or depend on customer-facing verified-savings totals.

## Deliberate RED boundaries

`OD-003` remains BLOCKING only for customer-facing `verified savings` evidence/calculation rules and verified totals.

`OD-004` remains BLOCKING only for provider-dependent charitable money movement, production settlement, provider-specific APIs/webhooks/receipts, and related production integration.

Phase 3 remains unauthorized.

## Human action required

None for provider-agnostic CP6 engineering. Escalate only if CP6 reaches `OD-004`, another RED decision, production/paid infrastructure, destructive migration, or the Phase 3 gate.
