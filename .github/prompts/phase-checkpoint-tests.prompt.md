# Phase Checkpoint Test Pass

Read:

- `AGENTS.md`
- `.github/copilot-instructions.md`
- `docs/AI-CONTROLLER.md`
- the active Issue/PR
- only the relevant domain specification and decision-log entry

Review only the most recently completed implementation checkpoint.

Expand automated test coverage without changing approved product behavior or redesigning the architecture.

Focus on:

- the checkpoint's main user flow,
- authorization/RLS implications,
- regression coverage,
- useful error/edge states,
- mobile-critical behavior where relevant.

Run:

- lint
- typecheck
- relevant unit tests
- relevant Playwright tests

Fix bounded defects where intended behavior is already clear.

Do not modify database schema unless a demonstrable defect requires it; if so, use a migration and explain why.

Update the controller or release-state contract only when the task's current
Issue/PR requires it.

Create a descriptive commit and summarize:

1. tests added,
2. defects fixed,
3. commands/results,
4. remaining risks.
