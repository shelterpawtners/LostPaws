# ShelterPawtners Copilot Instructions

Read `AGENTS.md` before implementing work.

Also read:

- `docs/CURRENT-WORK.md`
- `docs/AI-OPERATING-PROTOCOL.md`
- `docs/AUTONOMOUS-EXECUTION-POLICY.md`
- `docs/AI-HANDOFF.md`
- `docs/OWNER-DECISION-BACKLOG.md`
- `docs/DECISION-LOG.md`
- the active GitHub Issue/PR
- the active phase specification referenced by `docs/CURRENT-WORK.md`
- the active phase progress file when present

Do not redesign approved product/business rules.

## Autonomy

Work autonomously through routine implementation, debugging, validation, and related in-scope blockers.

- GREEN decisions: decide and continue without asking Jim.
- YELLOW decisions: use the safest reversible assumption, record it in `docs/OWNER-DECISION-BACKLOG.md`, and continue.
- RED decisions: complete safely separable work, record the blocker, update `docs/AI-HANDOFF.md`, and stop at the narrowest boundary.
- Do not ask for approval for ordinary engineering choices.
- Do not weaken valid regression tests merely to make CI green.
- Continue through clearly related in-scope failures until the active Issue acceptance criteria are met or a RED/hard blocker is reached.

Current explicit progression gates remain in force: do not begin Phase 2 Checkpoint 5 or Phase 3 without explicit product-owner authorization.

Primary stack:

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase

General rules:

- Use GitHub migrations as the source of truth for schema changes.
- Never weaken RLS simply to make a test pass.
- Never commit secrets.
- Financial history is append-oriented; do not silently rewrite finalized financial events.
- Store money as integer minor units plus ISO currency.
- User-facing U.S. financial values use centralized U.S. accounting/currency formatting.
- Preserve demo-data isolation.
- Preserve provenance and auditability.
- Keep mobile-first and accessibility requirements.
- Do not expand a bounded Copilot task into unrelated product work or an unauthorized phase.
- Prefer clearly labeled demo/QA placeholders over blocking on non-material copy/content preferences.

Before completing or stopping a coding task:

1. run the strongest relevant available lint/typecheck/tests/build,
2. classify failures and fix in-scope GREEN/YELLOW defects,
3. update tests when behavior changes,
4. update `docs/OWNER-DECISION-BACKLOG.md` for unresolved owner preferences or blockers,
5. update `docs/AI-HANDOFF.md` using the status contract in `docs/AUTONOMOUS-EXECUTION-POLICY.md`,
6. update the active progress file when the task completes a phase gate,
7. push completed work to the active branch/PR when the task allows it,
8. never merge unless explicitly authorized.
