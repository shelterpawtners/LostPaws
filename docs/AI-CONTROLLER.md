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

Updated from GitHub `main` at `9556e4c3a06290debc7fbb8073add10e9b618882`.

- Issue #136 control-plane consolidation is in final verification and issue
  triage. PRs #163–#166 completed the authority adapters, atomic release-state
  migration, historical-prompt disposition, and remaining active-entry cleanup.
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

1. Complete Issue #136 cross-tool verification and evidence-based open-issue
   triage, then refresh this controller and close #136 only when its definition
   of done is satisfied.
2. Continue non-owner-gated MVP readiness verification on current `main`.
3. Issue #107: `main` protection is active for deletion, force pushes, CI Gate,
   and Merge Gate. Admin-only PR-review enforcement and approved stale-ref
   deletion remain a bounded owner action; they do not block other work.
4. Produce the final GitHub MVP closeout report with verified production state,
   deferred work, provider/admin blockers, and a freeze-SHA recommendation.

## Boundaries

Do not change production DNS, secrets, RLS, production data, payments, paid
services, Meta/Facebook enablement, or final legal publication without explicit
owner authority. If provider authentication is unavailable, do not spin: record
the exact pending action and continue independent safe work.
