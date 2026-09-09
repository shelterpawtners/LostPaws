# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

The project is now in **MVP Design Hardening + Human Release Readiness** before ShelterPawtners domain cutover and before Phase 3 feature work.

**Phase 3 remains explicitly owner-gated.**

## Canonical application state

- `main` is the canonical application branch and Vercel Production Branch.
- Stream 1 PR #22 merged to `main` at `eaa7b09edc3496eb8e52d57d081fce42d67f5151`.
- Stream 2 PR #24 merged to `main` at `3e49f4c42fba2081b5bd6221c46ffd4b7fd1152c`.
- Stream 3 PR #26 merged to `main` at `a0c763b49f79e90fdd2e0c0586091636e39680f8`; accepted Stream 3 SHA is `95db103b606504155f83ca8f217b4e100e35f5c7`.
- `shelterpawtners.com` and `www.shelterpawtners.com` DNS remain unchanged.

## Current priority

**Marketplace Sprint 1 — Issue #27 — is active now.**

Branch:

`design/marketplace-concepts`

Goal:

Make the Marketplace the flagship ShelterPawtners experience by improving both the visual system and the value/information architecture before broad brand propagation to the rest of the site.

The Marketplace must communicate more than a minimal grid of offer records. A Guardian should quickly understand:

1. the offer/benefit;
2. the provider;
3. eligibility/listing type;
4. applicability/location context;
5. expiration/current status when available;
6. source/terms context;
7. the next action.

## Capability setup

### Stream 1 — GitHub Copilot + repo-native design/build capability

**COMPLETE — PR #22.**

### Stream 2 — ChatGPT product/operator capability

**COMPLETE — PR #24.**

### Stream 3 — Shared deterministic design QA

**COMPLETE — PR #26.**

Available for Marketplace work:

- axe accessibility checks;
- phone/tablet/desktop screenshot evidence;
- browser page/console error detection;
- meaningful failed-network/HTTP 5xx detection;
- existing Hosted Guardian/Partner golden paths;
- acceptance-gated browser execution so ordinary iteration remains cheaper.

## Marketplace Sprint 1

Issue #27 covers the first design decision loop.

### Research/value architecture

`docs/MARKETPLACE-DESIGN-SPRINT.md` is the sprint design brief and records current research, Guardian jobs-to-be-done, the information hierarchy, existing `PublicOffer` field boundary, no-fabrication rules, and the three concept directions.

### Three code-first concepts

A — **Value-first Deal Feed**

- fastest scanning;
- commerce-forward visual hierarchy;
- strong title/provider/eligibility/action priority;
- 3-column desktop / 1-column phone target.

B — **Local + Trust Marketplace**

- provider/context first;
- premium darker presentation;
- trust/context rail;
- wider offer rows and fewer competing items per viewport.

C — **Curated Guardian Savings Hub**

- editorial/value-destination feel;
- larger opening offers and calmer follow-on browsing;
- strongest membership/value-hub framing.

The prototype selector is a sprint-review device only. It should be removed after the winning direction is selected.

### Functional improvements included in the prototypes

Use only existing public offer data:

- keyword search across current offer text/provider/context;
- dynamically generated classification filters;
- visible result count;
- clear applied-search/filter reset;
- stronger provider, eligibility, applicability, expiration, and CTA hierarchy.

Do not invent or migrate offer fields during this concept sprint.

## Figma / Storybook decisions

Figma remains **deferred and is not a prerequisite**. Code-first Vercel previews are the review surface.

Storybook is introduced **after the winning Marketplace direction is selected**, and only when the reusable component/state volume makes isolated component work faster.

## Immediate execution sequence

1. finish Issue #27 concept implementation;
2. open draft PR to `main`;
3. pass fast CI/lint/unit/build checks;
4. obtain Vercel preview;
5. compare all three concepts at phone and desktop widths;
6. run Product Critic / independent review;
7. request GitHub Copilot code review explicitly on the PR when ready;
8. run Stream 3 Hosted QA at acceptance;
9. owner selects the flagship direction;
10. remove prototype-only controls and harden the selected design;
11. then propagate the winning brand system to the highest-value remaining screens.

## Operating model

- one bounded Issue -> one short-lived branch -> one PR -> acceptance -> `main`;
- `main` is the integration/production branch;
- GitHub Actions/scripts own deterministic validation;
- ChatGPT owns controller/product/operator decisions and connected-system coordination;
- coding agents/Copilot should be used for bounded implementation/review where the connected surface supports it;
- never let the implementation agent be the only reviewer of its own UX/design;
- preserve/strengthen tests rather than weakening them to make CI green;
- keep expensive Hosted/Persona/Database work acceptance- or impact-gated.

## Guardrails

Authorized now:

- Marketplace design research, concepts, and visual implementation using existing approved product rules/data;
- human QA and brand/design hardening;
- reversible free/low-cost tooling that does not weaken security.

Still owner-gated/deferred:

- new Marketplace/offer data-model fields not already approved;
- fabricated savings, ratings, provider assets, partnerships, or impact claims;
- attaching/changing `shelterpawtners.com` or `www.shelterpawtners.com` DNS;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` giving-provider selection and production charitable settlement/integration;
- paid infrastructure/tools unless separately justified and approved;
- destructive operations;
- material legal/privacy/security/financial/product RED decisions;
- Phase 3 feature development.
