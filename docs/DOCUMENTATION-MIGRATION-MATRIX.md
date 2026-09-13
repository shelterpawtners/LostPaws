# Documentation Migration Matrix

Status: **Phase-B planning artifact — no source documentation has been deleted or moved.**

Scope: current `main` at `64b13cb30216a3dd04db485e935f609837169c4b`; generated for Issue #136 after Issue #141/PR #142 merged.

## Operating rules

- This is a file-by-file disposition ledger, not authority to delete.
- Before any `CONSOLIDATE` or `REVIEW` item changes, identify inbound references with `rg`, migrate unique durable content, and validate affected links/build checks.
- Legal, security, support, data, architecture, and open owner-decision material stays explicit until reviewed.
- `docs/AI-CONTROLLER.md` remains the live status authority. No historical document may become a competing live control plane.
- Use one focused documentation PR per migration batch; do not mix product behavior, provider settings, Meta work, or branch retirement with document content changes.

## Canonical destinations proposed by the approved master plan

- Live state: `docs/AI-CONTROLLER.md`
- Agent operations: `docs/engineering/AGENT-OPERATIONS.md` (planned)
- Decisions: `docs/DECISIONS.md` (planned)
- Active task briefs: `docs/tasks/active/` (planned)
- Documentation map: `docs/README.md` (planned)

## File-by-file ledger

| Source | Disposition | Target | Required before changing |
|---|---|---|---|


## Migration-batch order

1. Create the thin authority index and agent-operations/decisions destinations; do not delete legacy sources.
2. Convert `AI-HANDOFF.md` and `CURRENT-WORK.md` to compatibility pointers only after their still-live facts are in the controller.
3. Migrate one historical family at a time (prompts, phase/progress, launch snapshots), with link/build validation after each PR.
4. Delete only files whose matrix row has been upgraded from `REVIEW` to an evidence-backed archival decision.

## Validation checklist for every follow-up PR

- `rg` finds no unresolved inbound reference to a removed/moved path.
- `npm run check` remains green when changed documentation is subject to formatting/CI checks.
- `AGENTS.md`, the controller, and active issue/task brief still lead an agent to one current authority.
- No legal, security, support, provider, or product assertion became less precise.