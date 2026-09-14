@AGENTS.md

## Claude Code

Do not duplicate cross-agent policy here. Newer owner instructions and the authority chain in `AGENTS.md` supersede stale historical plans. A project skill router is available at `.claude/skills/lostpaws/SKILL.md` for domain-specific document lookups.

`docs/engineering/AI-RELEASE-STATE.md` is the CI-required machine-readable
release-state file, not a replacement for the controller. Consult or update it
only when the task's completion/acceptance/workflow contract requires it, and
keep the field-compatible `docs/AI-HANDOFF.md` adapter synchronized.

When implementing, work through related GREEN/YELLOW defects in the same bounded task and use native deterministic validation. When reviewing, remain non-mutating unless implementation is explicitly authorized and focus on auth/RLS, ownership, idempotency, economic history, privacy/provenance, regression validity, and unnecessary complexity.

Phase 3, production/DNS, paid infrastructure, material RED decisions, and merging remain owner-gated (`OD-002` and others in `docs/DECISIONS.md`).

Before completion or blockage, follow `AGENTS.md`'s completion contract,
including the required release-state update when applicable.
