---
description: "Frontend implementation and design-hardening rules for ShelterPawtners React UI."
applyTo: "src/**"
---

# Frontend instructions

- Preserve accessibility, keyboard behavior, mobile-first layouts, and existing role/organization isolation.
- Browser code may use only the Supabase public/publishable client configuration; never service-role credentials.
- Prefer existing shared presentation/validation helpers before adding duplicate logic.
- Changes to shared routing, auth/session, `src/main.tsx`, or common data clients are cross-cutting: expect broader relevant browser acceptance.
- Keep financial/savings values in integer minor units until presentation formatting.
- Do not introduce a new UI framework or state-management dependency without a demonstrated need.

## Design-hardening workflow

For material customer-facing UI work:

1. read `docs/AI-TOOLING-AND-DESIGN-ROADMAP.md`;
2. use the relevant `.github/skills/` guidance, especially brand, Marketplace UX/merchandising, and responsive visual QA;
3. establish the primary user task and content hierarchy before styling;
4. prefer code-first concepts and hosted previews over duplicate mockup artifacts;
5. design explicit loading, empty, error, hover/focus, selected, disabled, success, and unavailable states when relevant;
6. verify representative phone/tablet/desktop layouts and keyboard/focus behavior;
7. request independent UX/Accessibility QA and Product Critic review for flagship or cross-cutting design changes.

## Marketplace quality bar

- Marketplace is the flagship experience; prioritize visible Guardian value, PetBiz identity/credibility, supported savings/benefit signals, relevance/location, supported impact cues, and a clear next action.
- Avoid repetitive low-information white tiles, excessive whitespace, excessive pills/containers, gratuitous gradients/glassmorphism, filler copy, and ornamental UI that does not improve hierarchy or understanding.
- Never fabricate offers, ratings, reviews, partnerships, scarcity, verification, donations, savings, or impact data.
- Storybook may be introduced during the Marketplace Sprint once reusable components/states exist and isolated component iteration is faster than route-only work; it is not a prerequisite for starting the sprint.
