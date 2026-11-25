# AI Release State

This is the canonical machine-readable release-state contract for repository
automation. It is intentionally compact. Human live status, blockers, and next
actions belong in [`../AI-CONTROLLER.md`](../AI-CONTROLLER.md).

<!-- GENERATED FILE -- do not hand-edit. Source of truth is
     docs/engineering/state/release-state.yaml. Regenerate with
     `node scripts/release-state.mjs generate`. -->

STATUS: BLOCKED
CURRENT_PHASE: Restart reconciliation (Issue #325); launch stabilization acceptance (#273/#283) pending
CURRENT_CHECKPOINT: Restart reconciliation 2026-11-25 after a 7-week pause; new agent work is paused (owner gate). MERGED to main (not the same as deployed or accepted): #273 P0-A/P0-B/Swag requestability/#285 messaging; #283 P1 offer-persistence recovery (#294) and RAVE publish validation (#300); mobile-first forms sprint (#310, 126d052). DEPLOYED: not independently verified this session; Vercel production tracks main. ACCEPTED: none -- #273 hosted chain, #283 hosted acceptance and owner phone review of #310 remain open. HOSTED MIGRATION HISTORY: the controller REPORTS 20260916070000 and the persistence-recovery migration as applied; #318 records the persistence-recovery version in hosted history as 20260916091931 (repo file 20260916090000); hosted status of 20260916135500 (#300) is unconfirmed. Not independently reverified -- reconcile privately before any apply; never replay or re-apply historical migrations. #318 (October Data API grants) is open and unmerged. A private security advisory is open; see the owner.
NEXT_CHECKPOINT: Owner-gated, in order: (1) private security verification and fix approval; (2) owner review/merge of restart PRs (this PR and the proposal PR) per Issue #325; (3) private hosted migration-history reconciliation and backup, then a separately authorized #318 / security-fix apply; (4) owner phone review of #310 on production; (5) #283 hosted acceptance with a real authorized RAVE-vendor identity (no synthetic public vendor data) and the #273 stabilization chain, then close both. Set STATUS=READY_FOR_ACCEPTANCE, OWNER_DECISION_REQUIRED=NO, SAFE_TO_CONTINUE=YES only when the owner authorizes resumption on a GitHub Issue. The .github/agent-ops UAT queue is historical and must not be claimed.
OWNER_DECISION_REQUIRED: YES
SAFE_TO_CONTINUE: NO
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
