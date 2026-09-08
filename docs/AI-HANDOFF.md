# AI Handoff

STATUS: FAILED
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: Correct the stale Hosted Admin QA locator for the fresh Guardian CTA, rerun deterministic validation, and if Hosted QA is green mark the CP5 pre-decision slice COMPLETE. Do not begin CP6 until CP5 acceptance is green and recorded COMPLETE.
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

Updated by: supervisory validator
Branch: `qa/guardian-registration-personas`
Active PR: #2 (`<!-- ai-active-build-pr -->`)
Active Issue: #13
Current acceptance head: `6c141dd74736927a55e9f00c3397289f6fad6b74`
Admin QA reload-state application fix: `11b23ef41861f0d2e26272ed588019ddaa217f94`

## Checkpoint 5 implemented scope

- Reuses `retail_amount_minor`, `paid_amount_minor`, and `currency_code`; no duplicate money model.
- Non-customer-facing `candidate_savings_minor` uses exact integer minor-unit math with zero floor.
- Reference value kind/source and evidence metadata preserve provenance.
- `shelterpawtners_relationship` derives `first_known` / `returning` only from non-demo confirmed Guardian + Partner redemptions and is concurrency-hardened.
- Partner customer attestation remains independent (`new_to_business` / `existing_customer` / `unknown`).
- Redemption confirmation accepts optional attribution without breaking existing callers.
- Corrections remain append-only delta events; reversal/audit history remains intact.
- Partner redemption UI captures optional candidate-savings context without presenting it as verified savings.

## Deterministic evidence

- Persona QA #62: PASS after CP5 concurrency hardening, including migration replay, pgTAP/RLS, and Guardian/persona/access/redemption Playwright.
- CI #219: PASS for the Admin QA reload-state application fix `11b23ef4`.
- Vercel status for acceptance head `6c141dd7`: SUCCESS. The prior Vercel build-rate-limit blocker is not the current failure.
- CI #224 on `6c141dd7`: PASS.
- Hosted QA #121 on `6c141dd7`: FAILED in `e2e/admin-qa-mode.spec.ts` after Vercel readiness succeeded.
- Hosted QA #121 result: 7 passed, 1 failed, 1 did not run.

## Hosted QA #121 failure classification

**GREEN test defect — stale accessible-name locator.**

The failing test waits for:

`getByRole("button", { name: "Create fresh Guardian test account" })`

The captured Playwright page snapshot proves the Admin QA page loaded correctly and rendered the fresh-account controls. The actual accessible button name is:

`Create fresh Guardian`

The failure is therefore not an application authorization, session-restoration, deployment, Supabase, RLS, or CP5 financial behavior defect. It is a stale test expectation after the UI label changed.

### Bounded next task

Update only the fresh-Guardian CTA locator in `e2e/admin-qa-mode.spec.ts` to target the current accessible name (`Create fresh Guardian`) using the existing role-based locator. Do not remove the test, broaden it to an unrelated element, weaken subsequent onboarding/banner assertions, or change RLS. Then rerun the relevant deterministic validation and Hosted QA acceptance.

If Hosted QA is green, record the CP5 pre-decision engineering slice COMPLETE and keep the verified-savings product/financial rule owner-gated. Only then identify provider-agnostic CP6 Issue #14 as the next already-authorized Phase 2 task; do not begin Phase 3.

## Deliberate RED boundaries

Customer-facing `verified savings` remains blocked until the owner approves the evidence/calculation standard, including treatment of corrections, refunds, reversals, bundles, free items, evidence strength, and Partner-entered values.

Provider-dependent charitable-money movement remains owner-gated. Phase 3 is not authorized.

## Vercel state

The acceptance deployment itself is no longer blocked: Vercel reported success for `6c141dd7`, and Hosted QA passed its deployment-readiness gate before executing browser tests. Direct Vercel account/team inspection may still require separate OAuth team-scope authorization, but that connector limitation is not the cause of Hosted QA #121.

## Human action required

No RED decision is required for the current failure. The next operator task is the single stale test-locator correction described above, followed by deterministic acceptance rerun. Do not purchase/upgrade infrastructure or begin Phase 3.
