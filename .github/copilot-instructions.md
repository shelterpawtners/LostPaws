# ShelterPawtners Copilot instructions

Read `AGENTS.md` first, then only the active Issue/PR, `docs/AI-HANDOFF.md`, `docs/CURRENT-WORK.md`, `docs/AI-TOOLING-AND-DESIGN-ROADMAP.md` when relevant, and task-specific architecture/product/security/design files.

## Current state and boundaries

- Phase 1 is complete.
- Phase 2 is complete.
- Current authorized work: **design hardening + human release readiness**.
- Marketplace is the flagship experience and receives priority design attention.
- `main` is canonical and backs Vercel production.
- New work uses a short-lived branch -> bounded PR -> `main`.
- Phase 3 features, ShelterPawtners DNS changes, paid infrastructure, destructive operations, material RED decisions, RLS weakening, and secrets in browser code remain owner-gated.

## Execution

- GREEN: implement/test/continue.
- YELLOW: use the safest reversible assumption and document it when material.
- RED: finish separable work, update the handoff, and stop narrowly.
- Work through related in-scope defects in the same session.
- Never weaken a valid test just to make CI green.
- Use native scripts/Actions for deterministic validation instead of spending AI cycles on repeated status polling.
- Keep context lean and follow matching path-specific instructions under `.github/instructions/`.

## Design-hardening rules

- Default to **code-first design**; Figma is optional and not a prerequisite.
- Use relevant project skills under `.github/skills/` and specialist agents under `.github/agents/` for meaningful UX/design work.
- Establish user value, content hierarchy, interaction states, responsive behavior, accessibility, and product credibility before decoration.
- Do not invent discounts, partnerships, ratings, scarcity, donations, verification, or other production facts.
- Avoid generic AI aesthetics: repetitive white tiles, excessive pills/containers, gratuitous gradients, glassmorphism, oversized rounding, ornamental icons, and filler copy.
- Preserve accessibility, keyboard behavior, reduced-motion support, mobile-first layouts, role/organization isolation, and the existing React/TypeScript/Vite/Tailwind/Supabase stack unless a demonstrated need justifies change.

## Completion

Run the strongest relevant deterministic tier, capture UI evidence for material visual changes when practical, preserve/strengthen tests, and update `docs/AI-HANDOFF.md` with exact evidence and `ACCEPTED_CODE_SHA`.

Never merge without explicit owner authority.
