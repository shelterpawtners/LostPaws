# Agent Start Prompts — Next Product Sprint

Use these prompts only after the owner reviews the controlling execution plan.

## Claude Code — Track 1

Read first:

- `docs/AI-HANDOFF.md`
- `docs/CURRENT-WORK.md`
- `docs/AI-OPERATING-PROTOCOL.md`
- `docs/product/DUAL-MARKETPLACE-RAVE-SHELTER-EXECUTION-PLAN.md`
- `docs/product/CODEX-CLAUDE-COLLABORATION-PROTOCOL.md`
- GitHub Issue #125 and any newer controlling issue.

Work on a short-lived branch from current `main`, recommended:

`feature/mobile-rave-lostpaws-claude`

Goal: complete Track 1 only — mobile-first RAVE Shelter / LostPaws branding and conversion correction.

Key requirements:

- RAVE Shelter = **Rewarding Adoption with Vendor Exclusives**.
- Put **Rave with purpose. Shop with impact.** at the heart/top of the RAVE Shelter experience.
- LostPaws is reserved for Lost Lands / Excision-related festival and headlining-show campaigns; do not describe it as the generic festival activation brand.
- Use the owner-provided brand assets already under `public/brand/`; do not redraw logos.
- Prioritize flawless mobile Guardian and RAVE Vendor conversion paths.
- Improve safe-area/padding/hero readability and avoid horizontal overflow.
- Preserve non-affiliation language.
- Do not alter marketplace/event schema, RLS, financial mechanics, or legal policy.
- Do not publish unsupported donation/tax claims.
- Do not work directly on `main`.

Before finishing: run relevant lint/tests/build/mobile QA, open a PR, attach visual QA evidence, and update handoff/current-work docs.

## Codex — Track 2 schema review first

Read first:

- `docs/AI-HANDOFF.md`
- `docs/CURRENT-WORK.md`
- `docs/AI-OPERATING-PROTOCOL.md`
- `docs/product/DUAL-MARKETPLACE-RAVE-SHELTER-EXECUTION-PLAN.md`
- `docs/product/CODEX-CLAUDE-COLLABORATION-PROTOCOL.md`
- current schema/migrations/RPCs/tests.

Work on a separate short-lived branch from current `main`, recommended:

`feature/dual-marketplace-events-codex`

First deliverable: inspect the existing schema and document the minimum safe design for:

- marketplace audience = `pet` / `human_rave` / `both`;
- separate ShelterPawtners and RAVE Shelter storefront filters sharing one data engine;
- Events as a first-class cross-audience concept;
- pet/human/both event classification;
- event categories such as Adoption Event and Music Festival;
- business-event roles such as attending, vending, and for-hire/service;
- pet-friendly/dog-friendly attributes;
- onboarding that hides rave-specific content from ordinary pet businesses unless opted in.

Reuse existing tables/relationships where practical. Do not create duplicate event/location/organization concepts blindly.

Identify RLS/security consequences and targeted regression tests before broad implementation.

Avoid editing Claude Code's high-churn RAVE/LostPaws visual files. If routing integration requires `src/main.tsx`, keep the change minimal and coordinate through the PR boundary.

Do not work directly on `main`.

Before finishing: database QA, targeted marketplace/event tests, PR documentation, and handoff update.
