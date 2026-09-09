# ShelterPawtners AI Tooling + Design Roadmap

## Purpose

Build quickly while improving product quality. Tooling must reduce rework, expose defects earlier, and make design decisions more deliberate without creating process overhead that delays visible product improvements.

## Operating principle

Use the lightest tool that proves the next decision.

- Prefer code-first design and real hosted previews.
- Add deterministic QA before paid SaaS.
- Add specialist AI roles instead of asking one coding agent to design, implement, test, and approve its own work.
- Avoid duplicate tools that solve the same problem without a measurable benefit.

## Stream 1 — GitHub Copilot + repo-native capability

**Status:** in setup.

### Repository-native agents

- Marketplace Product Designer — user value, information architecture, marketplace discovery, merchandising, trust, hierarchy.
- Frontend Design-System Engineer — reusable React/Tailwind components, tokens, responsive implementation.
- UX + Accessibility QA — independent runtime/interaction/accessibility review.
- Product Critic — independent quality/value critique; does not approve its own implementation.

### Repository-native skills

- `shelterpawtners-brand-system`
- `marketplace-ux-design`
- `marketplace-value-merchandising`
- `responsive-visual-qa`
- `release-readiness-review`

### Existing deterministic foundation

Keep and use:

- Playwright
- Vitest
- TypeScript
- Prettier
- GitHub Actions
- CodeQL / dependency security review
- Supabase database/RLS QA
- Vercel previews/production

### External Copilot capabilities to evaluate/install locally

These are helpful but are not blockers for the Marketplace Sprint:

1. Official Vercel Copilot plugin — recommended now for local Copilot/VS Code use.
2. Official Supabase agent skills — recommended now for local Copilot/CLI use.
3. Chrome DevTools MCP — recommended for deliberate performance/runtime diagnosis.
4. GitHub/Playwright MCP — retain where already available.

Do not give cloud agents broad database write access merely for convenience.

## Stream 2 — ChatGPT operator/product capability

**Status:** next.

Goal: keep ChatGPT complementary to Copilot rather than duplicative.

Primary jobs:

- product/marketplace research and competitive pattern analysis;
- independent visual/product critique;
- GitHub/Vercel/Supabase operations;
- architecture and release-readiness reasoning;
- image/brand ideation when useful;
- analytics/observability strategy;
- tool/plugin discovery and cost control.

## Stream 3 — Shared design + quality toolchain

**Status:** minimum viable setup follows Stream 2.

### Use now / during Marketplace Sprint

- Playwright screenshots and interaction tests
- automated accessibility checks (axe + Playwright)
- responsive screenshots at representative phone/tablet/desktop sizes
- browser console/network inspection
- Storybook once a reusable marketplace component system emerges

### Add after the first Marketplace redesign

- Lighthouse CI performance/accessibility budgets
- broader visual-regression baselines
- observability/behavior analytics after product flows stabilize

### Later / scale-triggered

- Chromatic/Percy/BrowserStack if team size and UI surface justify paid tooling
- richer design collaboration if multiple designers/developers need shared visual handoff

## Figma decision

**Decision: deferred; not a prerequisite.**

For the current startup/MVP stage, code-first design is expected to be faster because:

- the owner wants to review the real application rather than static mockups;
- the existing React/Tailwind application already provides the canvas;
- Vercel previews make real-device/browser feedback cheap;
- one primary builder does not yet need a formal designer-to-developer handoff;
- creating and maintaining duplicate Figma + code artifacts can add avoidable cycles.

Reconsider Figma when one or more of these become true:

- multiple people are designing/implementing in parallel;
- visual exploration in code becomes materially slower than mockups;
- the component/token system becomes difficult to reason about without a shared design workspace;
- external stakeholders need structured design review before implementation.

Until then, use screenshots, hosted previews, code components, and documented tokens as the source of visual truth.

## Marketplace Sprint — when it starts

**The Marketplace Sprint begins immediately after Streams 1–3 reach minimum viable setup.**

It is the next product-design sprint; it is not deferred to a later phase.

### Marketplace Sprint sequence

1. **Research + value architecture**
   - review leading marketplace/e-commerce/service discovery patterns;
   - define Guardian jobs-to-be-done;
   - define Marketplace information architecture and offer hierarchy;
   - define how savings, PetBiz credibility, location/relevance, eligibility, urgency, and shelter impact are communicated without fabricated claims.

2. **Code-first visual concepts**
   - create 2–3 materially different Marketplace directions in code or isolated prototype routes/components;
   - review on phone and desktop;
   - select one direction based on value communication, usability, brand fit, accessibility, and maintainability.

3. **Marketplace component system**
   - establish design tokens and reusable offer/partner/category/filter/impact primitives;
   - introduce **Storybook here** when there are enough reusable components/states to benefit from isolated development and review;
   - Storybook is a sprint accelerator, not a prerequisite.

4. **Marketplace implementation**
   - implement discovery, hierarchy, offer cards/details, partner trust/value cues, filters, loading/empty/error states, and mobile behavior;
   - preserve existing business rules and data integrity.

5. **Independent QA + critique**
   - Product Critic review;
   - UX/Accessibility QA;
   - responsive screenshots;
   - Playwright golden paths;
   - axe accessibility checks;
   - console/network review.

6. **Brand-system propagation**
   - apply the accepted visual system to global header/navigation and the highest-value Guardian/PetBiz screens;
   - avoid redesigning every low-priority administrative screen before the flagship Marketplace is proven.

7. **Release-readiness audit**
   - run broad human-style Issue #5 review;
   - fix real blockers;
   - only then consider ShelterPawtners domain cutover.

## MVP vs full-site roadmap

### MVP release-readiness target

- professional branded shell;
- flagship Marketplace experience;
- coherent Guardian/PetBiz value presentation;
- critical mobile flows polished;
- accessibility and deterministic browser QA on golden paths;
- production remains main-backed on Vercel;
- domain cutover only after release-readiness acceptance.

### Full-site evolution

After the MVP proves the visual/product system:

- expand Storybook coverage;
- formalize design tokens/components;
- add Lighthouse performance budgets;
- add behavior analytics/observability;
- expand visual regression/device coverage as usage/team size grows;
- reconsider Figma or a comparable collaborative design workspace if scale justifies it;
- authorize Phase 3 features separately from visual hardening.

## Cost rule

Default to $0/open-source/native capabilities while they remain sufficient. Introduce paid tools only when the expected reduction in rework, testing effort, incidents, or coordination time clearly exceeds the cost.
