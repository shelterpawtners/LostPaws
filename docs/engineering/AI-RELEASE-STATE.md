# AI Release State

This is the canonical machine-readable release-state contract for repository
automation. It is intentionally compact. Human live status, blockers, and next
actions belong in [`../AI-CONTROLLER.md`](../AI-CONTROLLER.md).

<!-- GENERATED FILE -- do not hand-edit. Source of truth is
     docs/engineering/state/release-state.yaml. Regenerate with
     `node scripts/release-state.mjs generate`. -->

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Launch stabilization (Issue #273): remaining LostPaws messaging and final hosted acceptance
CURRENT_CHECKPOINT: P0-A returning vendor/business lifecycle (#275), P0-B Event->Offer republish clarity/regression (#277), and Swag catalog requestability with signed-in autofill (#280) are merged and verified. The active umbrella Issue #273 remains open only for the coordinated LostPaws messaging slice and final real hosted stabilization chain.
NEXT_CHECKPOINT: After the conflicting decorative PR #184 is resolved or retired, ship the owner-directed LostPaws landing messaging, then run the real hosted stabilization acceptance chain.
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE
ACCEPTANCE_RUNTIME: OWNER_UAT_2026_09_15
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
