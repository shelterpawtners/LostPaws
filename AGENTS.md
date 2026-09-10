# LostPaws agent instructions

## Authority

ShelterPawtners/LostPaws is in active MVP implementation.

- **Phase 1 is complete.**
- **Phase 2 is complete.**
- **Pre-cutover Launch Readiness / PR #33 is merged and accepted.**
- **Phase 3 — Guardian + Shelter Passport MVP is explicitly authorized and active.**
- `main` is the canonical application branch and the Vercel production branch.
- Use one short-lived branch -> one bounded PR -> `main` for new work.
- The owner has authorized autonomous non-destructive MVP implementation and merge of bounded work when required checks are green; preserve explicit RED restrictions below.
- Do not modify the final `shelterpawtners.com` production web DNS/custom-domain routing, create/upgrade paid infrastructure, perform destructive production-data changes, change Microsoft 365 mail DNS, weaken RLS, expose secrets, decide OD-003 verified-savings rules, decide OD-004 production money movement, or publish final legal policies without owner review.
- Newer explicit owner decisions and the live handoff supersede stale historical planning text.

## Start every meaningful task here

Read only the context needed for the task, in this order:

1. active GitHub Issue/PR;
2. `docs/AI-HANDOFF.md`;
3. `docs/CURRENT-WORK.md`;
4. `docs/phases/PHASE-3.md` for Phase 3 scope;
5. `docs/AI-TOOLING-AND-DESIGN-ROADMAP.md` when the work affects UX, visual design, testing, or AI tooling;
6. `docs/AUTONOMOUS-EXECUTION-POLICY.md`;
7. `docs/DEV-LOOP-V2.md`;
8. relevant product/architecture/security/design files.

Do not load unrelated historical files just for completeness.

## Current development loop

Use one bounded Issue -> one short-lived branch -> one PR -> one acceptance boundary -> `main`.

- Open implementation PRs as draft when practical.
- One primary coding agent owns a bounded implementation slice by default.
- Use specialist design/review agents as independent advisers; do not run competing coding agents on the same code path.
- GitHub Actions/scripts own deterministic validation: formatting, lint, unit tests, build, migration replay, pgTAP/RLS, Playwright, dependency/security review, and merge evidence.
- AI is reserved for implementation, product/design reasoning, non-obvious diagnosis, architecture/security reasoning, visual critique, semantic acceptance, and RED decisions.
- Legacy Phase 2 automation that explicitly targets `build/festival-mvp` is historical/maintenance infrastructure. Do not use it as the target for new work unless intentionally refactored.

## Autonomous behavior

- **GREEN:** decide, implement, test, and continue.
- **YELLOW:** choose the safest reversible assumption, document it when material, and continue.
- **RED:** finish safely separable work, record the blocker, update the handoff, and stop narrowly.
- Fix related in-scope GREEN/YELLOW defects before declaring completion.
- Never weaken a valid test merely to make CI green.

## Product and design invariants

- React + TypeScript + Vite + Tailwind + Supabase remain the core stack.
- Git migrations remain the schema source of truth.
- Preserve RLS, provenance, auditability, demo-data isolation, append-oriented economic history, and integer minor-unit money values.
- Never fabricate partnerships, verification, donations, discounts, metrics, affiliations, reviews, scarcity, or production facts.
- Preserve WCAG-minded accessibility, keyboard behavior, reduced-motion support, and mobile-first behavior.
- Prefer the existing model and stack before adding dependencies, services, frameworks, or parallel data structures.
- **Code-first design is the default. Figma is not a prerequisite.**
- The Marketplace and Passport experiences must communicate tangible user value rather than generic card-grid UI.
- Avoid generic AI UI patterns: interchangeable card grids, excessive pills, gratuitous gradients/glassmorphism, unnecessary containers, filler copy, and decoration without hierarchy or product meaning.
- For material UI work, use the relevant repository skills under `.github/skills/` and seek independent review from appropriate agents under `.github/agents/` when available.

## Phase 3 architectural invariants

- Shelter Report Card and Guardian Digital Pet Passport are views/lifecycle states of the same canonical pet data, not duplicate pet databases.
- Passport data is private by default; public/emergency exposure is explicitly Guardian-controlled.
- Preserve provenance so shelter-authored/imported/provider/Guardian/system history cannot be silently relabeled.
- QR routes use opaque identifiers and contain no private pet or Guardian data.
- Full microchip identifiers are never public by default.
- Shelter access must narrow appropriately after Guardian claim while historical shelter provenance remains.

## Validation

The native change-impact classifier determines the minimum deterministic checks.

- **Implementation:** CI plus Database QA when database/RLS paths changed.
- **UI/design:** responsive phone/tablet/desktop review, keyboard/accessibility review, relevant Playwright coverage, and screenshots when practical.
- **Acceptance:** Persona QA for persona-sensitive changes; Hosted QA for product/browser-impacting changes when applicable.
- **Release readiness:** broader human-style/security/accessibility regression before final production-domain cutover.

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
