# AI Handoff

STATUS: FAILED
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: Correct the Hosted Admin QA false-success assertion to target only the QA impersonation status banner, rerun CI + Hosted QA, and if green mark the CP5 pre-decision slice COMPLETE. Do not begin Phase 3.
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

Updated by: ChatGPT supervisory validator
Branch: `qa/guardian-registration-personas`
Active PR: #2 (`<!-- ai-active-build-pr -->`)
Active Issue: #13
Current acceptance head before this documentation update: `5048f714da0a82e517798881ae15e7a5cb5142df`
Admin QA locator correction: `e328b5367ede050834be46c99d83fbf8abb7680a`
Hosted QA PR-trigger correction: `c704a3b19399e19a3d0678f5ec4b18119339bc0a`

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
- CI #228 on acceptance head `5048f714`: PASS.
- Hosted QA #125 on `5048f714`: FAILED with 8 passed / 1 failed after Vercel readiness succeeded.
- Failure classification: **GREEN test defect**, not application, RLS, authorization, deployment, Supabase, or financial behavior.
- The failing test is `an Edge Function error is visible and never reports false QA success` in `e2e/admin-qa-mode.spec.ts`.
- The simulated Edge Function failure is correctly visible as an alert: `Unable to start QA mode. Edge Function returned a non-2xx status code`.
- The failing assertion uses `page.getByText("ADMIN QA MODE").toHaveCount(0)`. Playwright's text locator also matches the legitimate page heading `Admin QA Mode` on the restricted support tool, so the assertion reports one element even though no impersonation-success banner is present.
- The test file already defines `adminQaBanner(page)` to target the role=`status` element containing `ADMIN QA MODE`; that is the precise object the false-success assertion intends to exclude.

## Bounded next task

Change only the final assertion in the Edge Function failure regression from the broad text locator to the existing `adminQaBanner(page)` helper and assert that banner count is zero. Preserve the visible error assertion and all authorization/session/RLS coverage. Do not remove or weaken the test. Then rerun CI and Hosted QA.

If Hosted QA is green, record CP5 pre-decision engineering COMPLETE and close Issue #13 as completed. Do not repeat Persona QA unless a new database/persona-sensitive change occurs.

## Deliberate RED boundaries

Customer-facing `verified savings` remains blocked until the owner approves the evidence/calculation standard, including treatment of corrections, refunds, reversals, bundles, free items, evidence strength, and Partner-entered values.

Provider-dependent charitable-money movement remains owner-gated. Phase 3 is not authorized.

## Vercel state

Hosted QA #125 independently verified the relevant Vercel deployment Ready before browser execution. Direct ChatGPT Vercel team enumeration may still have connector OAuth/team-scope limitations, but that does not block the MVP acceptance workflow and is not related to this failure.

## Human action required

No RED decision is required. Operator attention is needed only for the single bounded test-locator correction above, followed by deterministic acceptance rerun.
