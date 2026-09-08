# ShelterPawtners Copilot instructions

Read `AGENTS.md` first, then only the active Issue/PR, `docs/AI-HANDOFF.md`, `docs/CURRENT-WORK.md`, `docs/DEV-LOOP-V2.md`, and task-relevant architecture/product/security files.

## Boundaries

- Phase 2 remainder is authorized; Phase 3 is not.
- No auto-merge, production/DNS changes, paid infrastructure, destructive migrations, RLS weakening, secrets in browser code, or material RED decisions.
- This coding-agent session must have been intentionally started for one bounded task. Do not create another agent session as a polling/retry/continuation mechanism.

## Execution

- GREEN: implement/test/continue.
- YELLOW: use the safest reversible assumption and document it when material.
- RED: finish separable work, update the handoff, stop narrowly.
- Work through related in-scope defects in the same session.
- Use native scripts/Actions for deterministic validation instead of spending AI credits on reruns or status checks.
- Keep context lean and follow any matching path-specific instructions under `.github/instructions/`.

## Completion

Run the strongest relevant deterministic tier, preserve/strengthen tests, and update `docs/AI-HANDOFF.md` with exact evidence and `ACCEPTED_CODE_SHA`. Never merge without explicit authority.
