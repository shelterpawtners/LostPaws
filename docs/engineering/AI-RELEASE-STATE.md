# AI Release State

This is the canonical machine-readable release-state contract for repository
automation. It is intentionally compact. Human live status, blockers, and next
actions belong in [`../AI-CONTROLLER.md`](../AI-CONTROLLER.md).

<!-- GENERATED FILE -- do not hand-edit. Source of truth is
     docs/engineering/state/release-state.yaml. Regenerate with
     `node scripts/release-state.mjs generate`. -->

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Repository normalization and non-owner-gated MVP closeout (Issues #136 and #107)
CURRENT_CHECKPOINT: Issue #136 atomic release-state consumer migration is in validation.
NEXT_CHECKPOINT: Merge the validated atomic migration, then continue the remaining #136 cleanup sequence.
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
