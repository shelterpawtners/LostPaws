# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

The project is now in **MVP Design Hardening + Human Release Readiness** before ShelterPawtners domain cutover and before Phase 3 feature work.

**Phase 3 remains explicitly owner-gated.**

## Canonical application state

- `main` is the canonical application branch and Vercel Production Branch.
- Stream 1 PR #22 merged to `main` at `eaa7b09edc3496eb8e52d57d081fce42d67f5151`.
- Stream 1 accepted SHA is `0a48f446a103a8495ec2ce8a8c31c62bd9d02c3b`.
- Stream 2 accepted SHA is `1163e6c3deb07c5d20cd7a88961b213c4bd327f0`; PR #24 is in final merge validation.
- `shelterpawtners.com` and `www.shelterpawtners.com` DNS remain unchanged.

## Current priority

Make ShelterPawtners look and feel polished, professional, distinctive, valuable, accessible, and trustworthy before adding the next major feature phase.

The **Marketplace is the flagship design priority**. It must communicate substantially more value than a minimal grid of generic offer tiles.

Design work must improve both:

1. visual/product quality; and
2. Marketplace value architecture — offer value, PetBiz identity/credibility, relevance/location, supported savings/benefit, supported shelter impact, state/eligibility, and clear actions.

## Three-stream capability setup

### Stream 1 — GitHub Copilot + repo-native design/build capability

**Status: COMPLETE and merged in PR #22.**

### Stream 2 — ChatGPT product/operator capability

**Status: COMPLETE on accepted SHA `1163e6c3deb07c5d20cd7a88961b213c4bd327f0`; PR #24 is in final merge validation.**

Delivered:

- `docs/CHATGPT-OPERATING-PROTOCOL.md` with source-of-truth order, role split, connected-tool routing, cost rules, owner gates, and implementation handoff contract;
- `docs/prompts/CHATGPT-SESSION-BOOTSTRAP.md` for fresh-session project recovery before asking the owner to reconstruct context;
- explicit routing: ChatGPT for product/controller/operator work, coding agents for substantial implementation, GitHub Actions/scripts for deterministic validation;
- current private/project state through connected GitHub/Vercel/Supabase tools, with web research reserved for current external facts and evidence.

### Stream 3 — Shared design + deterministic quality toolchain

**Current next bounded task: Issue #25.**

Minimum setup before the Marketplace implementation sprint:

- axe accessibility integration using `@axe-core/playwright`;
- focused Marketplace/public-shell Playwright design QA;
- representative phone/tablet/desktop screenshots;
- browser page/console error checks;
- meaningful failed-network-request checks;
- reuse the existing Hosted QA browser pass rather than adding another heavy workflow.

Storybook is added **inside the Marketplace Sprint** once enough reusable Marketplace components/states exist to make isolated component development faster.

## Figma decision

Figma is **deferred and is not a prerequisite**.

Default to code-first design using the real React/Tailwind application, Vercel previews, screenshots, and reusable components. Reconsider Figma only when team/design-system complexity makes it materially faster than code-first iteration.

## Marketplace Sprint

**The Marketplace Sprint starts immediately after Stream 3 reaches minimum viable acceptance.**

Sequence:

1. Marketplace research + Guardian value/information architecture;
2. 2–3 materially different code-first visual concepts;
3. independent critique and direction selection;
4. reusable Marketplace component system;
5. Storybook when component/state volume justifies it;
6. flagship Marketplace implementation;
7. responsive/accessibility/browser/Playwright QA;
8. propagate the accepted brand system to the highest-value remaining screens;
9. run Issue #5 broad release-readiness/human-style audit;
10. only then consider ShelterPawtners domain cutover.

## Operating model

- one bounded Issue -> one short-lived branch -> one PR -> acceptance -> `main`;
- `main` is the integration/production branch;
- GitHub Actions/scripts own deterministic validation;
- ChatGPT owns controller/product/operator decisions and connected-system coordination;
- substantial coding defaults to a coding agent when that surface is available and cheaper;
- specialist AI agents may provide independent product/design/QA perspectives;
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
