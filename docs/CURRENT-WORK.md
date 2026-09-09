# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

The project is in **MVP Design Hardening + Human Release Readiness** before ShelterPawtners domain cutover and before Phase 3 feature work.

**Phase 3 remains explicitly owner-gated.**

## Canonical application state

- `main` is the canonical application branch and Vercel Production Branch.
- Stream 1 PR #22 merged to `main`.
- Stream 2 PR #24 merged to `main`.
- Stream 3 PR #26 merged to `main`.
- Marketplace Sprint 1 / PR #28 merged to `main` on September 9, 2026 at `0550625f296c3ef87ffa34dadf810d0f07e318e6`.
- Accepted Marketplace code SHA: `d9b9c32ea7647ff0e9a616e8c8206bfb9ca5742d`.
- Issue #27 is closed as completed.
- `shelterpawtners.com` and `www.shelterpawtners.com` DNS remain unchanged.

## Current priority

**Issue #29 — Design hardening: propagate flagship brand to shell + Guardian/PetBiz — is active now.**

Branch: `design/brand-propagation`

The bounded target is deliberately smaller than a full-site redesign:

1. global header/navigation/shell;
2. Guardian dashboard and high-value pet/passport/Marketplace actions;
3. PetBiz dashboard/profile/offer-management entry surfaces.

The accepted Marketplace A+B system is the visual reference: premium dark/navy structure, restrained purple/teal accents, stronger typography and hierarchy, purposeful cards/panels, clear action priority, and accessible responsive behavior.

Do not mechanically copy the Marketplace container onto every screen. Propagate the visual language while preserving each screen's job.

## Issue #29 acceptance

Required before merge:

- high-value surfaces visibly align with the accepted Marketplace brand system;
- phone/tablet/desktop layouts remain coherent;
- axe and runtime checks remain clean;
- Guardian/Partner golden paths remain functional;
- auth, onboarding, persistence, RLS, offer, claim, redemption, and economic behavior remain unchanged;
- Product Critic/Copilot findings are addressed;
- accepted code SHA is recorded;
- merge occurs only after explicit owner authorization.

## Next after Issue #29

Run **Issue #5 — Full-site human-style browser and persistence audit** across the stabilized product. That broader audit should cover all implemented routes/personas, reload/return journeys, persistence truth, multi-record behavior, failure recovery, and obvious navigation/state defects before any ShelterPawtners domain cutover.

## Tooling / cost decisions

- Code-first remains the default design workflow.
- Figma remains deferred and is not a prerequisite.
- Storybook remains optional; add only when isolated component iteration becomes faster than direct route work.
- Use existing Playwright/axe/runtime tooling first.
- No paid tooling or Vercel upgrade solely for temporary build-rate limits without owner approval.

## Guardrails

Authorized now:

- bounded brand propagation using the accepted Marketplace visual system and existing approved product rules/data;
- human QA and brand/design hardening;
- reversible free/low-cost tooling that does not weaken security.

Still owner-gated/deferred:

- new Marketplace/offer data-model fields not already approved;
- fabricated savings, ratings, provider assets, partnerships, ranking/popularity, verification, scarcity, or impact claims;
- attaching/changing `shelterpawtners.com` or `www.shelterpawtners.com` DNS;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` giving-provider selection and production charitable settlement/integration;
- paid infrastructure/tools unless separately justified and approved;
- destructive operations;
- material legal/privacy/security/financial/product RED decisions;
- Phase 3 feature development.
