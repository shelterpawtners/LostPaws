# Claude Code Instructions

`AGENTS.md` is the primary cross-agent instruction file. Read it first.

For the active task, then read only:
- the active GitHub Issue/PR;
- `docs/CURRENT-WORK.md`;
- `docs/AI-HANDOFF.md`;
- `docs/AUTONOMOUS-EXECUTION-POLICY.md`;
- `docs/AI-COST-AND-TESTING-GOVERNANCE.md`;
- relevant product/architecture/security/phase files.

Do not duplicate policy from those files here. Newer owner instructions and the live handoff supersede stale historical gates.

When implementing, work through related GREEN/YELLOW defects in the same bounded task and use native deterministic validation. When reviewing, remain non-mutating unless implementation is explicitly authorized and focus on auth/RLS, ownership, idempotency, economic history, privacy/provenance, regression validity, and unnecessary complexity.

Phase 2 remainder is authorized under the current repo policy. Phase 3, production/DNS, paid infrastructure, material RED decisions, and merging remain owner-gated.

Before completion or blockage, update `docs/AI-HANDOFF.md` with the final SHA, exact validation evidence, defects/decisions, and next action.
