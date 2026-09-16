# AI Release State

This is the canonical machine-readable release-state contract for repository
automation. It is intentionally compact. Human live status, blockers, and next
actions belong in [`../AI-CONTROLLER.md`](../AI-CONTROLLER.md).

<!-- GENERATED FILE -- do not hand-edit. Source of truth is
     docs/engineering/state/release-state.yaml. Regenerate with
     `node scripts/release-state.mjs generate`. -->

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Launch stabilization (Issue #273): owner UAT-driven hardening of returning business management, event-linked offers, LostPaws messaging, and Swag requestability
CURRENT_CHECKPOINT: P0-A returning vendor/business lifecycle is merged in PR #275 and P0-B Event->Offer republish clarity/regression is merged in PR #277. Active umbrella Issue #273 remains open for LostPaws messaging, all-product Swag requestability/autofill, and any remaining hosted verification. STATUS intentionally remains READY_FOR_ACCEPTANCE so Persona QA and Hosted QA execute their real browser suites.
NEXT_CHECKPOINT: Complete and verify Issue #273 remaining items: record P0-B hosted verification if still pending, ship LostPaws landing messaging, then all-product Swag requestability with logged-in autofill; merge green authorized PRs and finish with the real hosted stabilization acceptance chain.
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
