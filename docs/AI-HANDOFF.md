# AI Handoff

STATUS: COMPLETE
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Dev Loop v2 bootstrap — Issue #15
NEXT_CHECKPOINT: Manually integrate accepted PR #16; then begin CP6 Issue #14 from fresh `phase2/cp6-impact-giving`
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: 7d3f69782da7365400fbce639837b692b37c995c

## Current state

- PR #2 is merged into `build/festival-mvp` at merge commit `e248f8b3ae754da7faccf41ebe2c0a4bb3857f27`.
- Dev Loop v2 branch: `ops/dev-loop-v2`; active PR #16.
- Issue #15 completion contract is satisfied at accepted code SHA `7d3f69782da7365400fbce639837b692b37c995c`.
- Exact native evidence on the accepted SHA: CI #244 PASS; Database QA #9 PASS; Persona QA #74 PASS; Hosted QA #140 PASS with actual `hosted-smoke` SUCCESS; Merge Gate #10 PASS at the acceptance boundary; Dependency Review #9 PASS; AI Ops Status #10 PASS.
- Two GREEN Hosted QA control-plane defects were corrected during acceptance: mutable Vercel-comment readiness was replaced by exact frontend-commit Vercel status, and the browser target was restored to canonical `QA_BASE_URL` rather than a mutable branch Preview alias.
- No application, RLS, security, product, production, paid-infrastructure, or RED decision blocker remains for Dev Loop v2.
- PR #16 is ready for manual integration into `build/festival-mvp`; auto-merge remains prohibited.
- CP6 Issue #14 is the next already-authorized Phase 2 checkpoint after integration.
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
- No CP6 product work belongs in the bootstrap branch.

## RED boundaries

- `OD-003` remains blocking only for customer-facing verified-savings rules/totals.
- `OD-004` remains blocking only for provider-dependent charitable-money movement/settlement/integration.
- No production/DNS, paid infrastructure, destructive migration, auto-merge, or Phase 3.

## Next action

1. Manually merge accepted PR #16 into `build/festival-mvp` without changing accepted implementation.
2. Create `phase2/cp6-impact-giving` from the updated `build/festival-mvp`.
3. Open one bounded CP6 PR for Issue #14 and move `<!-- ai-active-build-pr -->` to it.
4. Set the handoff to `IN_PROGRESS`, `OWNER_DECISION_REQUIRED: NO`, `SAFE_TO_CONTINUE: YES`, `ACCEPTED_CODE_SHA: NONE`.
5. Implement the provider-agnostic CP6 impact/reputation/giving foundation only; stop before provider-dependent production money movement or any unresolved RED decision.
