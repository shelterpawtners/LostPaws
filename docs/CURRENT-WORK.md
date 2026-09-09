# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

The project is now in **MVP Design Hardening + Human Release Readiness** before ShelterPawtners domain cutover and before Phase 3 feature work.

**Phase 3 remains explicitly owner-gated.**

## Canonical application state

- `main` is the canonical application branch.
- Vercel Production Branch is `main`.
- The accepted Phase 2 application build at `fdc3b1e76063af86970f31a996740d29fa2024d1` was promoted to Vercel production.
- Production deployment `dpl_7n3zhia8RF3DrJ4RjFi6SQWkQGdG` is READY.
- `lost-paws-one.vercel.app` resolves to the main-backed production deployment and returns HTTP 200.
- `shelterpawtners.com` and `www.shelterpawtners.com` DNS remain unchanged.

## Current priority

Make ShelterPawtners look and feel polished, professional, distinctive, valuable, accessible, and trustworthy before adding the next major feature phase.

The **Marketplace is the flagship design priority**. It is a primary reason Guardians should return to the platform and must communicate substantially more value than a minimal grid of generic offer tiles.

Design work must improve both:

1. visual/product quality; and
2. the Marketplace value architecture — offer value, PetBiz identity/credibility, relevance/location, supported savings/benefit, supported shelter impact, state/eligibility, and clear actions.

## Three-stream capability setup

Before the large Marketplace redesign, establish the minimum capability stack documented in `docs/AI-TOOLING-AND-DESIGN-ROADMAP.md`.

### Stream 1 — GitHub Copilot + repo-native design/build capability

**Current bounded task:** `ops/stream1-copilot-design-tooling`.

Includes:

- updated post-Phase-2 Copilot operating rules;
- Marketplace Product Designer agent;
- Frontend Design-System Engineer agent;
- UX + Accessibility QA agent;
- Product Critic agent;
- ShelterPawtners Brand System skill;
- Marketplace UX Design skill;
- Marketplace Value Merchandising skill;
- Responsive Visual QA skill;
- Release Readiness Review skill;
- repository-level Vercel plugin enablement;
- local Copilot setup instructions for Vercel, official Supabase Agent Skills, and Chrome DevTools;
- explicit Figma/Storybook timing decisions.

### Stream 2 — ChatGPT product/operator capability

Configure ChatGPT as the complementary researcher/operator/reviewer rather than a duplicate coding agent. Focus on product research, competitive pattern analysis, visual critique, GitHub/Vercel/Supabase operations, architecture, release readiness, imagery/brand ideation, and later analytics/observability strategy.

### Stream 3 — Shared design + deterministic quality toolchain

Minimum setup before the Marketplace implementation sprint:

- Playwright screenshot/interaction loop;
- axe accessibility integration;
- representative phone/tablet/desktop visual QA;
- browser console/network checks.

Storybook is added **inside the Marketplace Sprint** once enough reusable marketplace components/states exist to make isolated component development faster.

## Figma decision

Figma is **deferred and is not a prerequisite**.

Default to code-first design using the real React/Tailwind application, Vercel previews, screenshots, and reusable components. Reconsider Figma when multiple contributors, stakeholder handoff, or design-system complexity makes a dedicated collaborative design workspace faster than code-first iteration.

## Marketplace Sprint

**The Marketplace Sprint starts immediately after Streams 1–3 reach minimum viable setup. It is the next product-design sprint.**

Sequence:

1. marketplace research + Guardian value/information architecture;
2. 2–3 materially different code-first visual concepts;
3. select direction through independent product/design critique;
4. build reusable Marketplace component system;
5. add Storybook when reusable component/state volume justifies it;
6. implement flagship Marketplace experience;
7. responsive/accessibility/browser/Playwright QA;
8. propagate the accepted brand system to global shell and highest-value Guardian/PetBiz screens;
9. run Issue #5 broad release-readiness/human-style audit;
10. only then consider ShelterPawtners domain cutover.

## Operating model

For new design-hardening work:

- one bounded Issue -> one short-lived branch -> one PR -> acceptance -> `main`;
- `main` is the integration/production branch;
- do not target new product work at `build/festival-mvp` unless legacy automation is deliberately refactored;
- GitHub Actions/scripts own deterministic validation;
- specialist AI agents provide independent product/design/QA perspectives;
- never let the implementation agent be the only reviewer of its own UX/design;
- preserve/strengthen tests rather than weakening them to make CI green.

## Owner gates

Authorized now:

- Stream 1/2/3 capability setup;
- human QA and brand/design hardening;
- Marketplace design sprint and visual implementation using existing approved product rules/data;
- reversible tooling additions that are free/low-cost and do not weaken security.

Still owner-gated/deferred:

- attaching/changing `shelterpawtners.com` or `www.shelterpawtners.com` DNS;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` giving-provider selection and production charitable settlement/integration;
- paid infrastructure/tools unless separately justified and approved;
- destructive operations;
- material legal/privacy/security/financial/product RED decisions;
- Phase 3 feature development.
