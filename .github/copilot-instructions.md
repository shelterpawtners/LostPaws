# ShelterPawtners Copilot Instructions

Read `AGENTS.md` before implementing work.

Also read:

- `docs/CURRENT-WORK.md`
- `docs/DECISION-LOG.md`
- the active phase specification referenced by `docs/CURRENT-WORK.md`
- the active phase progress file when present

Do not redesign approved product/business rules.

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
- Do not expand a bounded Copilot task into unrelated product work.

Before completing a coding task:

1. run relevant lint/typecheck/tests,
2. fix bounded defects,
3. update tests when behavior changes,
4. update the active progress file when the task completes a phase gate,
5. create a descriptive commit when requested.
