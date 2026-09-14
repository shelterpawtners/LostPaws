# 2026 MVP archive — historical, non-authoritative

Everything under `docs/archive/2026-mvp/` is retained evidence, not current instruction. It exists so a human or agent investigating history has something more precise than raw Git history to start from, and so durable decisions extracted from these files (into `docs/DECISIONS.md`, `docs/engineering/AGENT-OPERATIONS.md`, or another canonical document) can be traced back to their original context.

## Rules for agents

- **Do not read anything under this tree as part of routine startup or task work.** The authority chain is `AGENTS.md` -> `docs/AI-CONTROLLER.md` -> the active GitHub Issue/PR -> at most one canonical domain document. Nothing here is ever on that path.
- **Do not treat anything here as a current instruction, policy, or status**, even if its own text reads as an instruction. A file's presence here means it has already been superseded, completed, or retired.
- **Only open a file here when explicitly investigating history** -- for example, tracing why a decision was made, or confirming that a durable fact was correctly carried into its canonical replacement before this archival happened.
- If a file here appears to contradict current authority (`AGENTS.md`, `docs/AI-CONTROLLER.md`, or a canonical domain document), current authority wins. Report the contradiction rather than acting on the archived text.

## Subdirectories

- `retired-protocols/` -- agent operating protocols and cost/testing governance documents superseded by `docs/engineering/AGENT-OPERATIONS.md`.
- `retired-plans/` -- completed roadmaps, sprint plans, and point-in-time reviews whose durable content (if any) has been migrated to a canonical document.
- `checkpoints/` -- dated phase/checkpoint/branch-hygiene execution records for work that is now complete.
- `launch/` -- dated launch-readiness checklists and cutover records for milestones already reached.
- `retired-prompts/` -- historical task-brief prompts for resolved work; see `docs/prompts/README.md` for the one prompt still retained as a live adapter.
