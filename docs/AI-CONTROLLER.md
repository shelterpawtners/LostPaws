# ShelterPawtners AI Controller

This is the compact human control-plane document for Codex Work, Claude Code,
Copilot/VS Code, and the ChatGPT advisor.

## Current authority

1. Current GitHub `main` is implemented repository truth.
2. `AGENTS.md` is the universal startup contract.
3. This controller is the live human status, blocker, and next-action authority.
4. The active GitHub Issue/PR supplies task scope and acceptance.
5. `docs/engineering/AI-RELEASE-STATE.md` is the machine-readable workflow
   contract. `docs/AI-HANDOFF.md` is its field-compatible inbound adapter.

Use `docs/engineering/AGENT-OPERATIONS.md` for detailed operating rules. Do
not treat dated prompts or archived material under `docs/archive/**` as live
status.

## Current status

Updated from GitHub `main` at `63eda574399c0544552e9f2a88cef3f8eeb7dbdc`, plus
this PR's own final repo-normalization batch.

- Issue #136 is **complete**. PRs #144, #146–#168 completed the authority
  adapters, atomic release-state migration, historical-prompt disposition,
  remaining active-entry cleanup, the file-by-file documentation migration
  matrix (`docs/DOCUMENTATION-MIGRATION-MATRIX.md`), and this controller's own
  rewrite to a short current-authority form. Evidence-based issue triage is
  complete: #7, #152–#156 closed (implemented and merged); #10, #12, #48,
  #54, #119 confirmed correctly classified as backlog/deferred/owner-gated
  and left open with current triage comments. Phase C's historical-doc
  retirement pass is done: the 10 dated Phase 2 checkpoint/execution docs the
  matrix marked as zero-inbound-reference (`docs/PHASE-2-CHECKPOINT-*.md`,
  `docs/PHASE-2-EXECUTION-PLAN.md`, `docs/AI-EXECUTION-PLAN-2026-09-12.md`,
  `docs/LAUNCH-CONTROLLER-CHECKPOINT-2026-09-11.md`,
  `docs/LAUNCH-PRE-CUTOVER-CHECKPOINT.md`) were removed from the working tree
  after a fresh repo-wide reference re-check found nothing live pointing at
  them; Git history remains the archive. Every other `REVIEW` row in the
  matrix (Phase 1 files, `LAUNCH-*`, `LL4`–`LL6`, `CUTOVER-*`,
  `MARKETPLACE-*`, etc.) is unchanged and still needs its own
  inbound-reference check before it moves — that is intentionally out of
  scope for #136's own definition of done and is future hygiene work, not a
  blocker.
- Issue #107 is **complete**. The `Protect Main` ruleset now also requires a
  pull request for every change to `main` (`required_approving_review_count:
0`, so the existing merge-when-green autonomous workflow is unaffected),
  in addition to its existing deletion/non-fast-forward/CI Gate/Merge Gate
  rules — none of which were weakened. 18 branches confirmed fully
  merged/superseded (re-validated against current GitHub PR-merge state
  immediately before deletion, including a fresh content check on the two
  branches with no PR record) were deleted: `build/festival-mvp`, 15
  `docs/*`/`feat/*`/`fix/*` branches, `ux/guardian-marketplace-launch-polish`,
  and `issue-58-lostpaws`. 11 branches with closed-but-unmerged PRs remain,
  per `docs/archive/2026-mvp/checkpoints/BRANCH-CLEANUP-2026-09-11.md`'s own "kept for your review"
  judgment call — they were not touched and should not be deleted without a
  content review first.
- Current product work already merged on `main` includes Store MVP, navigation
  and UX polish, event attendance/event-scoped offers, and rich vendor media and
  external-commerce links. Do not reopen accepted behavior without regression
  evidence.
- Owner-approved legal policy decisions are merged. Draft/reconciliation work
  may continue; final legal publication remains owner/legal-gated.
- Meta/Facebook remains intentionally deferred. Keep Facebook disabled and do
  not spend work cycles on Meta.
- Google OAuth is accepted; do not repeat OAuth acceptance unless auth changes.
- Documentation-only commits do not justify Vercel inspection. For a
  product-affecting pending deployment, inspect Vercel at most once; do not poll
  or force deployment.

## Remaining closeout actions

Repo-side Issue #136 / #107 cleanup is complete. What remains is intentionally
non-blocking or owner-gated, not implementation work:

1. `docs/DOCUMENTATION-MIGRATION-MATRIX.md`'s other `REVIEW` rows (Phase 1
   files, `LAUNCH-*`, `LL4`–`LL6`, `CUTOVER-*`, `MARKETPLACE-*`, etc.) remain
   for future hygiene passes, each needing its own inbound-reference check.
   Not urgent; no live authority depends on them.
2. #10's native GitHub-event → Work webhook gap, #12's dashboard re-scope,
   and #48/#54's backlog items remain open by design — see their own triage
   comments.
3. #119 (Meta/final legal publication) remains owner/legal-gated.
4. **Recommended MVP freeze SHA: the merge commit of this PR.**
   Everything currently authorized for MVP (Store, events, offer media, UX
   polish, mobile audit, Admin QA Mode, owner-approved legal decisions, and
   now full repo normalization) is merged, green, and live. `npm run check`
   (lint/typecheck/50 unit tests) and `npm run build` both pass on the branch
   that produced this update.

## Boundaries

Do not change production DNS, secrets, RLS, production data, payments, paid
services, Meta/Facebook enablement, or final legal publication without explicit
owner authority. If provider authentication is unavailable, do not spin: record
the exact pending action and continue independent safe work.
