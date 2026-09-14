# Claude Code Instructions

Read the shared authority chain in this order:

1. current GitHub `main`;
2. `AGENTS.md`;
3. `docs/AI-CONTROLLER.md` — human live status, blockers, and next actions;
4. the active GitHub Issue/PR (or active task brief);
5. only the domain document needed for the task.

`docs/engineering/AI-RELEASE-STATE.md` is the CI-required machine-readable
release-state file, not a replacement for the controller. Consult or update it
only when the task's completion/acceptance/workflow contract requires it, and
keep the field-compatible `docs/AI-HANDOFF.md` adapter synchronized. Do not use
`docs/CURRENT-WORK.md` as competing live status.

Do not duplicate cross-agent policy here. Newer owner instructions and the authority chain above supersede stale historical plans.

When implementing, work through related GREEN/YELLOW defects in the same bounded task and use native deterministic validation. When reviewing, remain non-mutating unless implementation is explicitly authorized and focus on auth/RLS, ownership, idempotency, economic history, privacy/provenance, regression validity, and unnecessary complexity.

Phase 2 remainder is authorized under current repository policy. Phase 3, production/DNS, paid infrastructure, material RED decisions, and merging remain owner-gated.

Before completion or blockage, follow `AGENTS.md`'s completion contract,
including the required release-state update when applicable.
