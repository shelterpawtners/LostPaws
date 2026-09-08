# AI Handoff

STATUS: COMPLETE
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Dev Loop v2 bootstrap — Issue #15
NEXT_CHECKPOINT: Merge accepted PR #16, then launch CP6 Issue #14 from fresh `phase2/cp6-impact-giving`
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: 6a63827a1111d00ea930a1e07e8aa3ffd9e911ed

## Current state

- PR #2 is merged into `build/festival-mvp` at `e248f8b3ae754da7faccf41ebe2c0a4bb3857f27`.
- Dev Loop v2 branch: `ops/dev-loop-v2`; active PR #16.
- Dev Loop v2 implementation is accepted at `6a63827a1111d00ea930a1e07e8aa3ffd9e911ed`.
- Acceptance evidence on that exact implementation SHA:
  - CI #257 PASS;
  - Database QA #22 PASS;
  - Persona QA #87 PASS, including the local Admin QA security regression with the local-only Edge Function QA flag;
  - Hosted QA #153 PASS with actual hosted golden paths against the resolved Vercel Preview artifact;
  - Merge Gate #23 PASS at the acceptance boundary;
  - Dependency Review #22 PASS;
  - AI Ops Status #23 PASS.
- Generic Hosted QA no longer depends on the hidden Admin QA Vercel feature flag. Admin QA security behavior is validated in the deterministic local Persona lane.
- Tooling/docs-only commits may reuse the last successful frontend-impacting Vercel Preview artifact instead of waiting for an ignored deployment.
- CP6 Issue #14 is the next authorized Phase 2 checkpoint after PR #16 integration.
- Phase 3 remains unauthorized.

## Dev Loop v2 accepted scope

- one canonical change-impact classifier;
- change-aware CI;
- Database QA separated from Persona browser acceptance;
- acceptance-only Persona and Hosted QA;
- deterministic Merge Gate using `ACCEPTED_CODE_SHA`;
- centralized exact Supabase CLI pin wrapper;
- short root agent instructions plus path-specific GitHub instructions;
- event-driven native AI Ops status with one Issue #12 status record;
- hourly stale watchdog;
- grouped Dependabot updates and native Dependency Review;
- Vercel ignored-build logic delegated to the classifier;
- branch-specific PR Preview browser acceptance;
- hidden Admin QA security acceptance independent of Vercel Preview feature-flag scope;
- full Dev Loop v2 operating-model documentation.

## Cost policy

- No automatic coding-agent invocation or automatic AI review.
- GitHub Actions/scripts own deterministic validation, status, and merge evidence.
- AI is reserved for implementation, architecture, diagnosis, and material semantic review.
- One active writer per code path.

## RED boundaries

- `OD-003` remains blocking only for customer-facing verified-savings rules/totals.
- `OD-004` remains blocking only for provider-dependent charitable-money movement/settlement/integration.
- No production/DNS, paid infrastructure, destructive migration, or Phase 3.

## Next action

1. Let the final documentation-only head pass CI/Merge Gate using the accepted implementation evidence above.
2. Close Issue #15 and merge PR #16 under the owner's standing authorization.
3. Verify the updated `build/festival-mvp` baseline.
4. Create `phase2/cp6-impact-giving`, open one bounded CP6 PR for Issue #14, move the active-build marker, and set the handoff to `IN_PROGRESS` / `OWNER_DECISION_REQUIRED: NO` / `SAFE_TO_CONTINUE: YES` / `ACCEPTED_CODE_SHA: NONE`.
5. Implement only the provider-agnostic CP6 foundation allowed before `OD-004`.
