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
not treat `docs/CURRENT-WORK.md`, dated prompts, or retained protocols as live
status.

## Current status

Updated from GitHub `main` at `4853ebf12f213fa676b86eb9dac2d0029e6d68ce`.
Production (`https://shelterpawtners.com`) is confirmed deployed at this exact
SHA (Vercel: success) with all five security headers live.

- Issue #136 control-plane consolidation: PRs #144, #146–#167 completed the
  authority adapters, atomic release-state migration, historical-prompt
  disposition, remaining active-entry cleanup, the file-by-file documentation
  migration matrix (`docs/DOCUMENTATION-MIGRATION-MATRIX.md`), and this
  controller's own rewrite to a short current-authority form. Evidence-based
  issue triage is complete: #7, #152–#156 closed (implemented and merged);
  #10, #12, #48, #54, #119 confirmed correctly classified as
  backlog/deferred/owner-gated and left open with current triage comments.
  **Not yet done:** Phase C's actual historical-doc retirement pass. The
  migration matrix marks roughly a dozen dated Phase 2 checkpoint/execution
  docs (`docs/PHASE-2-CHECKPOINT-*.md`, `docs/PHASE-2-EXECUTION-PLAN.md`,
  `docs/AI-EXECUTION-PLAN-2026-09-12.md`,
  `docs/LAUNCH-CONTROLLER-CHECKPOINT-2026-09-11.md`,
  `docs/LAUNCH-PRE-CUTOVER-CHECKPOINT.md`) as safe to remove from the working
  tree — verified zero inbound references from any canonical doc, workflow, or
  script — but this session's own tool-safety layer blocked the `git rm`
  itself (categorical destructive-action gate, not a permissions or evidence
  problem). The next agent with an approved delete path should remove exactly
  that verified list and nothing else; every other `REVIEW` row in the matrix
  (Phase 1 files, `LAUNCH-*`, `LL4`–`LL6`, `CUTOVER-*`, `MARKETPLACE-*`, etc.)
  still needs its own inbound-reference check first — do not batch them
  together. Do not close #136 until this pass runs; everything else in its
  definition of done is satisfied.
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

1. Run the verified-safe Phase C doc-retirement batch above, then close #136.
2. Issue #107: `main` protection (deletion/force-push/CI Gate/Merge Gate) is
   active via the `Protect Main` ruleset. Two verified, low-risk actions
   remain: (a) add a `pull_request` rule to that ruleset with
   `required_approving_review_count: 0` — confirmed against GitHub's ruleset
   schema as valid and sufficient to require every change go through a PR
   without requiring approvals, so it will not block the existing
   merge-when-green autonomous workflow; (b) delete branch refs already
   GitHub-confirmed as fully merged
   (`build/festival-mvp` and 15 `docs/*`/`feat/*`/`fix/*` branches whose PRs
   show `state: MERGED`) plus two more `docs/BRANCH-CLEANUP-2026-09-11.md`
   already resolved as safe by diff/content review
   (`ux/guardian-marketplace-launch-polish`, `issue-58-lostpaws`). This
   session has full repo-admin API access
   (`permissions.admin: true`) but its own tool-safety layer blocked both the
   ruleset PATCH and the ref deletion (categorical gates, not missing
   credentials this time — a change from the "no admin endpoint" blocker
   recorded in #107's earlier checkpoints). ~10 other closed-but-unmerged-PR
   branches remain genuinely "kept for your review" per that doc's own
   judgment call and should not be deleted without checking for unique
   content first.
3. MVP readiness verification on current `main` is complete: `npm run check`
   (lint/typecheck/50 unit tests), `npm run build`, and live production all
   pass at `4853ebf12f213fa676b86eb9dac2d0029e6d68ce`.
4. **Recommended MVP freeze SHA: `4853ebf12f213fa676b86eb9dac2d0029e6d68ce`.**
   Everything currently authorized for MVP (Store, events, offer media, UX
   polish, mobile audit, Admin QA Mode, owner-approved legal decisions) is
   merged, green, and live at this SHA. Remaining open items (#10 native
   webhook gap, #12 dashboard re-scope, #48/#54 backlog, #107's two admin
   actions, #119 Meta/final-legal) are explicitly non-blocking or owner-gated,
   not implementation gaps.

## Boundaries

Do not change production DNS, secrets, RLS, production data, payments, paid
services, Meta/Facebook enablement, or final legal publication without explicit
owner authority. If provider authentication is unavailable, do not spin: record
the exact pending action and continue independent safe work.
