# AI Release State

This is the canonical machine-readable release-state contract for repository
automation. It is intentionally compact. Human live status, blockers, and next
actions belong in [`../AI-CONTROLLER.md`](../AI-CONTROLLER.md).

<!-- GENERATED FILE -- do not hand-edit. Source of truth is
     docs/engineering/state/release-state.yaml. Regenerate with
     `node scripts/release-state.mjs generate`. -->

STATUS: IN_PROGRESS
CURRENT_PHASE: Post-MVP UAT sprint (Issue #183): autonomous Claude/Codex overnight execution on the Guardian and Raver Vendor QR->/lostpaws signup funnels
CURRENT_CHECKPOINT: UAT control plane established (docs/operations/UAT-OVERNIGHT-OPERATIONS.md, .github/agent-ops/uat-queue.yaml, .github/agent-ops/uat-run-state.yaml) with 17 work-packet issues (#186-#202) tracing all 45 UAT-N items from #183; Codex re-authorized for this sprint.
NEXT_CHECKPOINT: Merge P0 funnel fixes (Issues #186, #187, #188), verify staging health, then continue P1 queue items.
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE
ACCEPTANCE_RUNTIME: OWNER_RESUMED_2026_09_12
ACCEPTANCE_DEPLOYED_SHA: NONE

## Contract

The required top-level fields are `STATUS`, `CURRENT_PHASE`,
`CURRENT_CHECKPOINT`, `NEXT_CHECKPOINT`, `OWNER_DECISION_REQUIRED`,
`SAFE_TO_CONTINUE`, and `ACCEPTED_CODE_SHA`. Workflows and
`scripts/update-ai-ops-status.sh` parse this path directly.

`docs/AI-HANDOFF.md` remains a field-compatible legacy adapter for inbound
links and integrations. Its status block is generated from the same source
(`docs/engineering/state/release-state.yaml`) and kept synchronized
automatically; it is not independently hand-edited.
