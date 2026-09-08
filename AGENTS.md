# LostPaws agent instructions

## Authority

ShelterPawtners/LostPaws is in active development. The MVP and development work in `shelterpawtners-dev` are authorized. Jim explicitly authorized autonomous completion of the remainder of Phase 2 on 2026-09-08.

- Phase 2 Checkpoint 5 and later Phase 2 checkpoints may proceed under the autonomous policy.
- Phase 3 remains explicitly unauthorized.
- Do not auto-merge.
- Do not modify production DNS, production Supabase, replace the public live site, create paid infrastructure, or cross a material legal/privacy/security/financial/product RED boundary without explicit owner approval.
- Do not expose secrets, weaken RLS, or put service-role credentials in browser code.

Explicit newer owner instructions supersede older planning text. Resolve stale contradictions instead of stopping on an obsolete gate.

## Read first

For every meaningful coding task, read only what is relevant, starting with:

1. the active GitHub Issue/PR;
2. `docs/CURRENT-WORK.md`;
3. `docs/AI-HANDOFF.md`;
4. `docs/AUTONOMOUS-EXECUTION-POLICY.md`;
5. `docs/AI-COST-AND-TESTING-GOVERNANCE.md`;
6. the active phase specification/progress file;
7. relevant architecture/security/product docs.

Do not load unrelated historical documents merely for completeness. Keep task context lean.

## Autonomous execution

- GREEN: decide, implement, test, and continue.
- YELLOW: use the safest reversible assumption, record it in `docs/OWNER-DECISION-BACKLOG.md`, and continue.
- RED: finish safely separable work, record the blocker, update `docs/AI-HANDOFF.md`, and stop narrowly.
- Continue through related in-scope defects until acceptance criteria are met or a RED/hard blocker is reached.
- Do not ask Jim to approve routine engineering decisions.

## AI-cost discipline

Follow `docs/AI-COST-AND-TESTING-GOVERNANCE.md`.

- Treat each invoked coding-agent session as one bounded checkpoint/defect-cluster session.
- Do not request another agent session just because CI or Hosted QA turned green.
- Do not use AI for deterministic formatting, polling, reruns, lint/typecheck/build, or other native automation work.
- Do not request Copilot code review on every commit; default to one review at checkpoint acceptance when materially useful.
- Prefer one complete task prompt and a clear stopping condition over repeated steering comments.

## Engineering rules

- React + TypeScript + Vite + Tailwind + Supabase are the approved stack.
- Git migrations are the schema source of truth.
- Preserve provenance, append-oriented financial/economic history, integer minor-unit money values, demo-data isolation, and auditability.
- Never fabricate partnerships, metrics, discounts, affiliations, donations, verification, or production facts.
- Prefer small, testable changes and avoid unnecessary dependencies/enterprise complexity.
- Preserve accessibility and mobile-first behavior.

## Validation

Use the tiered testing strategy in `docs/AI-COST-AND-TESTING-GOVERNANCE.md`:

- implementation: lint, typecheck, unit tests, build;
- checkpoint acceptance: relevant hosted Playwright + relevant database/RLS tests;
- phase hardening: broader Persona QA/browser/security regression.

Do not weaken a valid test to make CI green. When impact mapping is uncertain, use the broader deterministic test rather than an AI judgment call.

## Completion

Before completing or blocking a meaningful task, update `docs/AI-HANDOFF.md` with task/issue, agent, branch, final SHA, areas changed, exact tests/results, CI/Hosted QA state, open defects, owner-decision state, and next action. Update durable decision/progress docs only when materially required.
