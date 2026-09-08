# AI Handoff

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Dev Loop v2 bootstrap — Issue #15
NEXT_CHECKPOINT: Complete and integrate Dev Loop v2; then launch CP6 Issue #14 from a fresh `phase2/cp6-impact-giving` branch
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE

## Current state

- PR #2 is merged into `build/festival-mvp` at merge commit `e248f8b3ae754da7faccf41ebe2c0a4bb3857f27`.
- Active work branch: `ops/dev-loop-v2`.
- Active Issue: #15.
- The deterministic formatting defect is fixed. CI #239 passed on `fd905eee638c0d3c8b2810f26a799d0130291ebc`.
- Merge Gate #7 correctly identified that the required Hosted QA `hosted-smoke` job had been skipped because the handoff had not entered `READY_FOR_ACCEPTANCE` before COMPLETE was recorded.
- Failure classification: GREEN workflow/state-contract defect. No application, RLS, security, product, or environment defect is indicated.
- This handoff now enters the required acceptance boundary. Full Hosted QA must execute successfully on this head before COMPLETE is restored.
- CP6 Issue #14 remains authorized next after Dev Loop v2 acceptance and integration.
- Phase 3 remains unauthorized.

## Dev Loop v2 scope

Implement and validate:

- one change-impact classifier;
- change-aware CI;
- separate Database QA from Persona browser acceptance;
- acceptance-only Persona and Hosted QA;
- deterministic Merge Gate using `ACCEPTED_CODE_SHA`;
- centralized exact Supabase CLI pin wrapper;
- short root agent instructions plus path-specific GitHub instructions;
- event-driven native AI Ops status with one Issue #12 status record;
- hourly stale watchdog;
- grouped Dependabot updates and native dependency review;
- full operating-model documentation.

## Cost policy

- No automatic coding-agent invocation.
- No automatic AI review.
- Native GitHub Actions/scripts own deterministic validation/status.
- One primary coding agent per bounded checkpoint by default.
- No CP6 product work in this bootstrap branch.

## RED boundaries

- `OD-003` remains blocking only for customer-facing verified-savings rules/totals.
- `OD-004` remains blocking only for provider-dependent charitable-money movement/settlement/integration.
- No production/DNS, paid infrastructure, destructive migration, auto-merge, or Phase 3.

## Acceptance action

1. Let native CI and Hosted QA execute on this `READY_FOR_ACCEPTANCE` head.
2. Require the actual Hosted QA `hosted-smoke` job to pass; a skipped heavy job is not acceptance.
3. If required evidence is green, set `ACCEPTED_CODE_SHA` to this acceptance head, restore `STATUS: COMPLETE`, close Issue #15, and require Merge Gate to pass on the final documentation-only head.
4. Do not merge automatically.
