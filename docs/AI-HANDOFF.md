# AI Handoff

STATUS: IN_PROGRESS
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
- CP6 Issue #14 remains authorized next, but feature implementation must wait until Dev Loop v2 is integrated.
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

- No automatic Copilot/Codex/Claude invocation.
- No automatic AI review.
- Native GitHub Actions/scripts own deterministic validation/status.
- One primary coding agent per bounded checkpoint by default.
- No CP6 product work in this bootstrap branch.

## RED boundaries

- `OD-003` remains blocking only for customer-facing verified-savings rules/totals.
- `OD-004` remains blocking only for provider-dependent charitable-money movement/settlement/integration.
- No production/DNS, paid infrastructure, destructive migration, auto-merge, or Phase 3.

## Completion contract

Before marking this bootstrap COMPLETE:

1. new native workflows must validate on the Dev Loop PR;
2. classifier and shell scripts must pass syntax/behavior checks;
3. CI must be green;
4. the new single-record AI Ops status path must be working;
5. document any deliberately deferred optimization;
6. set `ACCEPTED_CODE_SHA` to the exact accepted bootstrap implementation SHA;
7. update Issue #15 and this handoff;
8. merge only under the owner's already-granted authorization for this optimization rollout, then create the fresh CP6 branch/PR.
