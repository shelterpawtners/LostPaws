# AI Release State

This is the canonical machine-readable release-state contract for repository
automation. It is intentionally compact. Human live status, blockers, and next
actions belong in [`../AI-CONTROLLER.md`](../AI-CONTROLLER.md).

<!-- GENERATED FILE -- do not hand-edit. Source of truth is
     docs/engineering/state/release-state.yaml. Regenerate with
     `node scripts/release-state.mjs generate`. -->

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Launch stabilization (Issue #273): final hosted acceptance
CURRENT_CHECKPOINT: P0-A returning vendor/business lifecycle (#275/#281), P0-B Event->Offer republish clarity/regression (#277), Swag catalog requestability with signed-in autofill (#280), and LostPaws vendor messaging (#285) are merged and verified. The only remaining Issue #273 work is the real hosted stabilization acceptance chain.
NEXT_CHECKPOINT: Run the real hosted stabilization chain: LostPaws landing -> vendor signup/returning business management -> event-linked offer publish -> public event offer visibility -> Swag request; then close Issue #273.
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
