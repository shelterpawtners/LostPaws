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

**Status: COMPLETE — merged in PR #22.**

Repository-native agents/skills, Vercel/Supabase/Chrome DevTools setup guidance, and the `main`-target deterministic CI/QA control plane are in place.

## Stream 2 — ChatGPT operator/product capability

**Status: COMPLETE — merged in PR #24.**

Delivered:

- `docs/CHATGPT-OPERATING-PROTOCOL.md` — source-of-truth order, role split, connected-tool routing, owner gates, cost controls, and coding-agent handoff contract.
- `docs/prompts/CHATGPT-SESSION-BOOTSTRAP.md` — reusable fresh-session startup that makes ChatGPT recover project state before asking the owner to reconstruct it.
- current-work/handoff integration defining ChatGPT vs coding-agent vs deterministic-automation responsibilities.

## Stream 3 — Shared design + quality toolchain

**Status: IN PROGRESS — Issue #25 / `ops/stream3-design-qa`.**

Minimum implementation before Marketplace design work:

- axe accessibility scanning for the public shell and Marketplace;
- focused Hosted Marketplace/public-shell design-QA Playwright coverage;
- representative phone/tablet/desktop screenshots as review evidence;
- failure on unexpected page errors and meaningful console errors;
- meaningful failed-network and HTTP 5xx detection;
- reuse of the existing Hosted QA browser installation/run;
- design evidence uploaded only at the acceptance boundary.

Cost/design decisions:

- use exact pinned `@axe-core/playwright@4.13.0` as a QA-only transient install in Hosted acceptance;
- do not add production/runtime dependency or root lockfile churn solely for axe;
- do not create another browser workflow or paid QA platform;
- normal implementation commits remain on fast deterministic checks; one Hosted design-QA run is activated at `READY_FOR_ACCEPTANCE`.

Explicit Stream 3 non-goals:

- no Figma prerequisite;
- no Storybook prerequisite;
- no paid visual-regression/device SaaS;
- no broad browser matrix yet;
- no Lighthouse CI yet unless a concrete Marketplace need appears;
- no Phase 3 feature work;
- no DNS/domain/production changes.

## Figma decision

**Decision: deferred; not a prerequisite.**

For the current startup/MVP stage, code-first design is expected to be faster because the real React/Tailwind application and Vercel previews already provide the review surface. Reconsider Figma only when collaboration or design-system complexity makes a dedicated visual workspace materially faster.

## Marketplace Sprint — when it starts

**The Marketplace Sprint begins immediately after Stream 3 reaches minimum viable acceptance.**

It is the next product-design sprint; it is not deferred to a later phase.

### Marketplace Sprint sequence

1. **Research + value architecture**
   - review leading marketplace/e-commerce/service-discovery patterns;
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

## After the first Marketplace redesign

- add Lighthouse CI performance/accessibility budgets if useful;
- expand visual-regression baselines only when the surface justifies them;
- add observability/behavior analytics after product flows stabilize;
- consider Chromatic/Percy/BrowserStack or a collaborative design workspace only when team/UI scale creates clear ROI.

## MVP release-readiness target

- professional branded shell;
- flagship Marketplace experience;
- coherent Guardian/PetBiz value presentation;
- critical mobile flows polished;
- accessibility and deterministic browser QA on golden paths;
- production remains main-backed on Vercel;
- domain cutover only after release-readiness acceptance.

## Cost rule

Default to $0/open-source/native capabilities while they remain sufficient. Introduce paid tools only when the expected reduction in rework, testing effort, incidents, or coordination time clearly exceeds the cost.
