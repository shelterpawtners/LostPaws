# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: Fix the CP5 pgTAP plan count mismatch, rerun Persona QA, then finish remaining Checkpoint 5 acceptance evidence before the verified-savings RED rule gate
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES

This file is the shared baton between ChatGPT, Codex, Copilot, GitHub Actions, and human review.

## Rules

- The agent that completes a meaningful task must update this file before declaring the task complete.
- Keep this file current; do not append an unbounded transcript.
- GitHub Issues define the task contract. Pull requests/commits contain implementation. This file summarizes the latest handoff state.
- Never store passwords, tokens, service-role keys, private customer data, or other secrets here.
- If a material product/legal/privacy/security/financial decision is unresolved, record it as `OPEN DECISION` and reference `docs/DECISION-LOG.md` and/or `docs/OWNER-DECISION-BACKLOG.md`.
- Jim explicitly authorized autonomous completion of the remainder of Phase 2 on 2026-09-08 under `docs/AUTONOMOUS-EXECUTION-POLICY.md`.
- Phase 2 Checkpoint 5 is authorized. Implement the provider-/rule-independent engineering scope autonomously.
- Do not expose customer-facing values as `verified savings` until the calculation/evidence rule is explicitly approved; that remains a RED financial/product decision.
- Phase 3 remains explicitly unauthorized. Do not begin Phase 3 without a new owner authorization.
- Do not auto-merge pull requests. Production/DNS, paid infrastructure, legal/privacy/security posture, and real financial behavior remain RED gates.

## Current handoff

Updated by: ChatGPT supervisory validator
Branch: `qa/guardian-registration-personas`
Active PR: #2 (`<!-- ai-active-build-pr -->`)
Active Issue: #13
Current remote SHA at validation: `92f2fe72464061d0fc3a04daa1d03dd4d3576c1d`

### Accepted prior work

- Issue #11 Partner Marketplace golden path: ACCEPTED and CLOSED.
- Issue #6 Hosted shared QA hardening: COMPLETE and accepted by green hosted QA.
- Phase 2 Checkpoints 1-4 remain accepted/complete per `docs/CURRENT-WORK.md`.

### Checkpoint 5 implemented scope

Implementation commits in the current slice include:

- `a64dcc24b4f771a4c472947ff8425bd7a917a465` — CP5 savings/attribution database foundation.
- `016fc2fb4a6a4abae2640f3ba05cfa542b352d79` — CP5 pgTAP coverage.
- `765808866d4e10a1b65a0bbd589d86ef92b364bd` / `496b581e61c94d99071a1355ffb3cdeb8f9fd747` — exact bigint candidate-savings helper and unit tests.
- `fa48bbb204886c6f3894cdf5e76e556d59a69be6` — Persona QA restored to deliberate/manual execution.

Implemented behavior:

- preserve existing `retail_amount_minor`, `paid_amount_minor`, and `currency_code` instead of creating a duplicate money model;
- add non-customer-facing `candidate_savings_minor` generated with exact integer minor-unit math and a zero floor;
- add reference-value kind/source plus evidence reference/metadata provenance;
- add `shelterpawtners_relationship` classification (`first_known` / `returning`) derived only from prior non-demo confirmed redemptions for the same Guardian + Partner organization;
- add independent Partner customer attestation (`new_to_business` / `existing_customer` / `unknown`) without inferring business-newness from ShelterPawtners history;
- extend redemption confirmation with optional attribution while preserving existing callers via a defaulted third JSON argument;
- add append-only redemption correction delta events and retain existing reversal audit history;
- protect `redemption_events` from update/delete mutation with the existing append-only trigger function;
- add unit + pgTAP coverage for exact math, provenance, first-known/returning classification, separate Partner attestation, non-negative candidate savings, append-only adjustments, and reversal compatibility.

### Validation state — meaningful FAILED state

- Current head `92f2fe72464061d0fc3a04daa1d03dd4d3576c1d`: CI #185 PASS.
- Current head: Hosted QA #83 PASS (lightweight IN_PROGRESS gate).
- Persona QA #54 (`34235351085`) on CP5 implementation SHA `496b581e61c94d99071a1355ffb3cdeb8f9fd747`: FAIL in pgTAP only.
- Classification: **test defect**, not application, RLS, migration, or environment failure.
- Migration replay/reset succeeded.
- Existing pgTAP suites passed.
- Every CP5 assertion passed, but `supabase/tests/phase_2_checkpoint_5_savings_attribution.sql` declares `select plan(12);` while 14 assertions run. pg_prove reports `Bad plan. You planned 12 tests but ran 14.`
- Browser persona/redemption tests were skipped only because the pgTAP step failed first.

### Recommended bounded next task

Change only the CP5 pgTAP declared plan from 12 to 14, preserving all assertions and RLS/application behavior. Then rerun Persona QA. If pgTAP is green, allow the persona/redemption browser suite to execute and classify any resulting failure independently. Do not weaken or remove assertions.

### Vercel environment blocker

The ChatGPT Vercel connector previously returned an empty team list / 403 due to OAuth/account scope. This remains an external connector issue unless separately confirmed resolved; it is not the cause of the current Persona QA failure.

### Remaining Checkpoint 5 work after the test-plan correction

- obtain green Persona QA migration/pgTAP/persona-redemption evidence;
- add targeted Playwright coverage for attribution capture only if still needed and provider/rule-independent;
- evaluate whether adjusted candidate totals need a read model/helper over append-only correction events before CP5 acceptance;
- update active progress/decision docs for durable CP5 implementation choices;
- when implementation and deterministic validation are complete, move to `READY_FOR_ACCEPTANCE` and run the acceptance-boundary hosted gate;
- stop narrowly if a rule is required for what evidence/calculation qualifies as customer-facing `verified savings`.

### Human action required

No RED/product-owner decision is required. Operator attention is needed only to run the bounded test-plan correction task; this validator intentionally does not launch a coding agent under the zero-AI control-plane policy.
