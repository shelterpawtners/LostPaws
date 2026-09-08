# AI Handoff

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Dev Loop v2 bootstrap — Issue #15
NEXT_CHECKPOINT: Integrate PR #16 after final native acceptance; then begin CP6 Issue #14 on fresh `phase2/cp6-impact-giving`
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE

## Current state

- PR #2 is merged into `build/festival-mvp` at merge commit `e248f8b3ae754da7faccf41ebe2c0a4bb3857f27`.
- Dev Loop v2 branch: `ops/dev-loop-v2`; active PR #16.
- Earlier acceptance evidence at `7d3f69782da7365400fbce639837b692b37c995c` is superseded because the QA control-plane architecture changed afterward.
- Final architecture must prove itself before integration; no stale accepted SHA is being reused.
- Generic Hosted QA now verifies the latest frontend-impacting commit's Vercel status and tests the PR's Vercel Preview URL.
- Hidden Admin QA regression is separated from generic Preview Hosted QA and runs in the deterministic local Persona acceptance lane with `VITE_ADMIN_QA_MODE_ENABLED=true` and seeded demo identities.
- QA workflow changes self-trigger their relevant acceptance lane through the canonical change-impact classifier.
- The hourly ChatGPT Build Controller is temporarily disabled during this live one-writer sprint to prevent concurrent branch edits; re-enable it at the next real stopping boundary.
- CP6 Issue #14 is the next already-authorized Phase 2 checkpoint after Dev Loop v2 integration.
- Phase 3 remains unauthorized.

## Dev Loop v2 delivered scope to validate

- one canonical change-impact classifier;
- change-aware CI;
- separate Database QA from Persona browser acceptance;
- acceptance-only Persona and Hosted QA;
- deterministic Merge Gate using `ACCEPTED_CODE_SHA`;
- centralized exact Supabase CLI pin wrapper;
- short root agent instructions plus path-specific GitHub instructions;
- event-driven native AI Ops status with one Issue #12 status record;
- hourly stale watchdog;
- grouped Dependabot updates and native dependency review;
- PR Preview browser acceptance for branch-specific product changes;
- Admin QA security acceptance independent of Vercel Preview feature-flag scope;
- full operating-model documentation.

## Cost policy

- No automatic coding-agent invocation.
- No automatic AI review.
- Native GitHub Actions/scripts own deterministic validation/status.
- No CP6 product work belongs in the bootstrap branch.
- One active writer per code path.

## RED boundaries

- `OD-003` remains blocking only for customer-facing verified-savings rules/totals.
- `OD-004` remains blocking only for provider-dependent charitable-money movement/settlement/integration.
- No production/DNS, paid infrastructure, destructive migration, auto-merge, or Phase 3.

## Acceptance required now

1. CI Gate PASS.
2. Database QA Gate PASS (full DB QA if classifier requires it).
3. Persona QA Gate PASS with the local Admin QA security regression executing successfully.
4. Hosted QA Gate PASS with actual hosted golden paths against the resolved PR Preview URL.
5. Dependency Review PASS when applicable.
6. Merge Gate accepts the final `ACCEPTED_CODE_SHA` only after the required evidence is green.
7. Then mark Issue #15 COMPLETE, merge PR #16 under the owner's standing Dev Loop v2 authorization, and create the fresh CP6 branch/PR.
