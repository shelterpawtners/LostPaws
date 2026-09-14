# LostPaws agent instructions

## Authority

ShelterPawtners/LostPaws is in active MVP design hardening and release-readiness work.

- **Phase 1 is complete.**
- **Phase 2 is complete.**
- The current authorized work is **design hardening + human release readiness**, with the Marketplace as the flagship experience.
- **Phase 3 feature development is not authorized.**
- `main` is the canonical application branch and the Vercel production branch.
- Use one short-lived branch -> one bounded PR -> `main` for new work.
- For an already owner-approved, bounded, non-destructive PR with required checks green, merge it yourself when tool access exists; do not send routine merge steps back to the owner. Require owner action only when the merge is not already approved or crosses a material RED boundary.
- Do not modify ShelterPawtners production DNS, create paid infrastructure, perform destructive migrations, weaken RLS, expose secrets, or cross a material legal/privacy/security/financial/product RED boundary without owner approval.
- Newer explicit owner decisions and the live handoff supersede stale historical planning text.

## Start every meaningful task here

Read only the context needed for the task, in this order:

1. current GitHub `main`;
2. this `AGENTS.md`;
3. `docs/AI-CONTROLLER.md` — the human live-status, blocker, and next-action authority;
4. the active GitHub Issue/PR (or active task brief);
5. at most one relevant canonical domain document.

`docs/engineering/AI-RELEASE-STATE.md` is the CI-required machine-readable
release-state file. Read or update it only when a task needs
completion/acceptance/workflow state. `docs/AI-HANDOFF.md` is its
field-compatible legacy adapter for inbound links, not a competing
human live-status narrative.

Do not load unrelated historical files just for completeness.

## Current development loop

Use one bounded Issue -> one short-lived branch -> one PR -> one acceptance boundary -> `main`.

- Open implementation PRs as draft when practical.
- One primary coding agent owns a bounded implementation slice by default.
- Use specialist design/review agents as independent advisers; do not run competing coding agents on the same code path.
- GitHub Actions/scripts own deterministic validation: formatting, lint, unit tests, build, migration replay, pgTAP/RLS, Playwright, dependency/security review, and merge evidence.
- AI is reserved for implementation, product/design reasoning, non-obvious diagnosis, architecture/security reasoning, visual critique, semantic acceptance, and RED decisions.
- Legacy Phase 2 automation that explicitly targets `build/festival-mvp` is historical/maintenance infrastructure. Do not use it as the target for new design-hardening work unless the workflow is intentionally refactored first.

## Autonomous behavior

- Default to acting, not instructing: if the agent has the required tool/access and the action is safe, simple, reversible, and within approved scope, execute it instead of asking the owner to click, type, merge, or perform the same action manually.
- Ask the owner to act only when explicit owner judgment/approval is genuinely required, the available tools cannot perform the action, or the action crosses a RED boundary.
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
- **Code-first design is the default. Figma is not a prerequisite.** Add a design workspace only when collaboration or design-system complexity clearly saves more time than it costs.
- The Marketplace must communicate tangible user value, offer quality, partner credibility, savings, location/relevance, and shelter impact; do not optimize only for visual polish.
- Avoid generic AI UI patterns: interchangeable card grids, excessive pills, gratuitous gradients/glassmorphism, unnecessary containers, filler copy, and decoration without hierarchy or product meaning.
- For material UI work, use the relevant repository skills under `.github/skills/` and seek independent review from the appropriate agents under `.github/agents/`.

## Validation

The native change-impact classifier determines the minimum deterministic checks.

- **Implementation:** CI plus Database QA when database/RLS paths changed.
- **UI/design:** responsive review at phone/tablet/desktop, keyboard/accessibility review, relevant Playwright coverage, and before/after screenshots when practical.
- **Acceptance:** Persona QA only for persona-sensitive changes; Hosted QA for product/browser-impacting changes when applicable.
- **Release readiness:** run the broader Issue #5 human-style/security/accessibility regression before ShelterPawtners domain cutover.

When impact is uncertain, classify conservatively and run the broader deterministic test.

## Completion contract

Before completing/blocking a meaningful task that has a workflow/acceptance
contract, update `docs/engineering/AI-RELEASE-STATE.md` and its compatible
`docs/AI-HANDOFF.md` adapter together.

Required top-level fields:

- `STATUS`
- `CURRENT_PHASE`
- `CURRENT_CHECKPOINT`
- `NEXT_CHECKPOINT`
- `OWNER_DECISION_REQUIRED`
- `SAFE_TO_CONTINUE`
- `ACCEPTED_CODE_SHA`

Use `ACCEPTED_CODE_SHA: NONE` until deterministic checkpoint acceptance exists. At `STATUS: COMPLETE`, record the exact accepted code SHA that passed the required acceptance checks.
