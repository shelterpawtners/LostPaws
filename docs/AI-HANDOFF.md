# AI Handoff

STATUS: COMPLETE
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Dev Loop v2 bootstrap — Issue #15
NEXT_CHECKPOINT: Integrate accepted PR #16 manually, then launch CP6 Issue #14 from a fresh `phase2/cp6-impact-giving` branch
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: NO
ACCEPTED_CODE_SHA: fd905eee638c0d3c8b2810f26a799d0130291ebc

## Current state

- PR #2 is merged into `build/festival-mvp` at merge commit `e248f8b3ae754da7faccf41ebe2c0a4bb3857f27`.
- Dev Loop v2 implementation branch: `ops/dev-loop-v2`.
- Issue #15 acceptance contract is satisfied at `fd905eee638c0d3c8b2810f26a799d0130291ebc`.
- Native acceptance evidence on that SHA: CI #239 PASS, Database QA #4 PASS, Persona QA #69 PASS, Hosted QA #135 PASS, Merge Gate #4 PASS, Dependency Review #4 PASS, AI Ops Status #4 PASS.
- The prior CI #238 formatting failure was a GREEN formatting defect. The deterministic formatter artifact was applied exactly and the temporary one-shot formatter workflow was removed before the accepted run.
- CP6 Issue #14 remains the next authorized Phase 2 product checkpoint.
- PR #16 must be integrated into `build/festival-mvp` before creating the fresh CP6 branch. Current controller policy prohibits auto-merge, so that integration remains an operator action rather than an engineering blocker or RED product decision.
- Phase 3 remains unauthorized.

## Dev Loop v2 delivered scope

Accepted:

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
- No CP6 product work belongs in the bootstrap branch.

## RED boundaries

- `OD-003` remains blocking only for customer-facing verified-savings rules/totals.
- `OD-004` remains blocking only for provider-dependent charitable-money movement/settlement/integration.
- No production/DNS, paid infrastructure, destructive migration, auto-merge, or Phase 3.

## Next action

1. Manually merge accepted PR #16 into `build/festival-mvp` without changing the accepted implementation.
2. Create `phase2/cp6-impact-giving` from the updated `build/festival-mvp`.
3. Open the bounded CP6 PR for Issue #14 and move `<!-- ai-active-build-pr -->` to it.
4. Set the handoff back to `IN_PROGRESS` with `ACCEPTED_CODE_SHA: NONE` for CP6.
5. Implement only the provider-agnostic CP6 foundation allowed before `OD-004`.
