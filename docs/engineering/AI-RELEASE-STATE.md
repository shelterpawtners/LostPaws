# AI Release State

This is the canonical machine-readable release-state contract for repository
automation. It is intentionally compact. Human live status, blockers, and next
actions belong in [`../AI-CONTROLLER.md`](../AI-CONTROLLER.md).

<!-- GENERATED FILE -- do not hand-edit. Source of truth is
     docs/engineering/state/release-state.yaml. Regenerate with
     `node scripts/release-state.mjs generate`. -->

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Post-MVP UAT sprint (Issue #183): autonomous Claude/Codex overnight execution on the Guardian and Raver Vendor QR->/lostpaws signup funnels
CURRENT_CHECKPOINT: UAT control plane established; P0 items (uat-186, 187, 188) and P1 items (uat-189, 191, 192, 190) in progress. STATUS is kept at READY_FOR_ACCEPTANCE (not a sprint-status field) because persona-qa.yml and hosted-qa.yml only execute their real browser suites -- not just their lightweight gate step -- when this exact value is set; an earlier IN_PROGRESS value here silently skipped real Persona/Hosted QA on every PR in this sprint until this correction.
NEXT_CHECKPOINT: Manually re-run Persona QA and Hosted QA against main to validate the PRs merged while this was misconfigured, then continue P1/P2 queue items.
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
