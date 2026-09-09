# LostPaws agent instructions

## Authority

ShelterPawtners/LostPaws is in active MVP development.

- The remainder of **Phase 2** is authorized for autonomous bounded execution.
- **Phase 3 is not authorized.**
- Do not auto-merge unless the owner explicitly approves that specific merge.
- Do not modify production DNS/Supabase, replace the public live site, create paid infrastructure, perform destructive migrations, or cross a material legal/privacy/security/financial/product RED boundary without owner approval.
- Never expose secrets, weaken RLS, or put service-role credentials in browser code.
- Newer explicit owner decisions and the live handoff supersede stale historical planning text.

## Start every meaningful task here

Read only the context needed for the task, in this order:

1. active GitHub Issue/PR;
2. `docs/AI-HANDOFF.md`;
3. `docs/CURRENT-WORK.md`;
4. `docs/AUTONOMOUS-EXECUTION-POLICY.md`;
5. `docs/DEV-LOOP-V2.md`;
6. relevant phase/product/architecture/security docs.

Do not load unrelated historical files just for completeness.

## Dev Loop v2

Use one bounded Issue → one short-lived branch → one PR → one acceptance boundary.

- Open implementation PRs as draft when practical.
- Exactly one open PR targeting `build/festival-mvp` carries `<!-- ai-active-build-pr -->`.
- One primary coding agent owns a bounded checkpoint by default.
- Do not run competing coding agents on the same code path.
- GitHub Actions/scripts own deterministic work: classification, formatting, lint, unit tests, build, migration replay, pgTAP/RLS, Playwright, dependency review, status, merge evidence, and the hourly stale watchdog.
- AI is reserved for implementation, non-obvious diagnosis, architecture/product/security reasoning, semantic acceptance, and RED decisions.

## Autonomous behavior inside an intentionally started coding session

- **GREEN:** decide, implement, test, and continue.
- **YELLOW:** choose the safest reversible assumption, log it when material, and continue.
- **RED:** finish safely separable work, record the blocker, update the handoff, and stop narrowly.
- Fix related in-scope GREEN/YELLOW defects before declaring completion.
- Never weaken a valid test merely to make CI green.

## Core engineering invariants

- React + TypeScript + Vite + Tailwind + Supabase.
- Git migrations are the schema source of truth.
- Preserve RLS, provenance, auditability, demo-data isolation, append-oriented economic history, and integer minor-unit money values.
- Never fabricate partnerships, verification, donations, discounts, metrics, affiliations, or production facts.
- Preserve accessibility and mobile-first behavior.
- Prefer the existing model before adding parallel tables/services/dependencies.

## Validation

The native change-impact classifier determines the minimum deterministic checks.

- **Implementation:** CI plus Database QA when database/RLS paths changed.
- **Acceptance:** Persona QA only for persona-sensitive changes; Hosted QA only for product/browser-impacting changes.
- **Merge:** `Merge Gate` validates the required evidence from the accepted code SHA and current documentation/metadata head.
- **Phase hardening:** broader Issue #5/security/accessibility regression when scheduled by the phase plan.

When impact is uncertain, classify conservatively and run the broader deterministic test.

## Completion contract

Before completing/blocking a meaningful task, update `docs/AI-HANDOFF.md`.

Required top-level fields:

- `STATUS`
- `CURRENT_PHASE`
- `CURRENT_CHECKPOINT`
- `NEXT_CHECKPOINT`
- `OWNER_DECISION_REQUIRED`
- `SAFE_TO_CONTINUE`
- `ACCEPTED_CODE_SHA`

Use `ACCEPTED_CODE_SHA: NONE` until deterministic checkpoint acceptance exists. At `STATUS: COMPLETE`, record the exact accepted code SHA that passed the required acceptance checks.
