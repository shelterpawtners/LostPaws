# Claude Code Instructions

Read `AGENTS.md` first. It is the primary cross-agent instruction file.

Before meaningful implementation or review work, also read:

- `docs/CURRENT-WORK.md`
- `docs/AI-OPERATING-PROTOCOL.md`
- `docs/AUTONOMOUS-EXECUTION-POLICY.md`
- `docs/AI-HANDOFF.md`
- `docs/OWNER-DECISION-BACKLOG.md`
- `docs/DECISION-LOG.md`
- the active GitHub Issue and PR
- relevant product, architecture, security, and phase documents referenced by those files

## Working model

GitHub is the source of truth. Do not rely on a pasted chat transcript when the repository contains newer state.

Follow the autonomous execution policy:

- GREEN: decide, implement/review, validate, and continue.
- YELLOW: use the safest reversible provisional assumption, record it in `docs/OWNER-DECISION-BACKLOG.md`, and continue.
- RED: complete safely separable work, record the blocker, update `docs/AI-HANDOFF.md`, and stop at the narrowest boundary.

Do not ask Jim for routine implementation choices.

When acting as the implementation agent, continue through clearly related in-scope bugs and validation failures until the active Issue acceptance criteria pass or a RED/hard blocker is reached.

When acting as an independent reviewer, do not modify code unless the task explicitly authorizes implementation. Focus especially on:

- authentication and authorization;
- Supabase RLS/data ownership;
- organization/member resolution;
- concurrency/idempotency;
- financial/redemption history;
- data privacy/provenance;
- regression-test validity;
- architectural drift and unnecessary complexity.

## Guardrails

- Do not weaken RLS to make behavior work.
- Do not weaken a valid regression assertion to make CI green.
- Never commit or expose secrets.
- Preserve demo-data isolation.
- Use only authorized development/QA infrastructure.
- Do not touch production DNS or production Supabase without explicit approval.
- Do not create paid infrastructure without approval.
- Do not force push or destructively reset valid work.
- Do not merge unless explicitly authorized.
- Do not begin Phase 2 Checkpoint 5 or Phase 3 without explicit product-owner authorization.

## Completion

When acting as the implementation agent, update `docs/AI-HANDOFF.md` before declaring completion or blockage. Use the status contract defined in `docs/AUTONOMOUS-EXECUTION-POLICY.md`, including:

- current status;
- phase/checkpoint;
- whether an owner decision is required;
- whether another agent is safe to continue;
- final/current remote SHA;
- tests and CI evidence;
- open defects;
- decision backlog references;
- recommended next action.

Do not merge the PR unless explicitly authorized.
