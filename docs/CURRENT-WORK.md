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

Branch: `design/marketplace-concepts`

PR: #28

Owner-selected direction on September 9, 2026: **A+B hybrid**.

The final flagship direction combines:

- Concept A's fast scanability, search/filter discovery, strong CTA hierarchy, and three-column desktop offer grid;
- Concept B's premium dark frame, stronger brand character, and clearer provider/trust context;
- a compact trust strip rather than B's larger explanatory side rail;
- no Concept C editorial ranking or first-two prominence without an approved curation rule.

The prototype A/B/C selector has been removed from the active implementation.

## Marketplace information hierarchy

A Guardian should quickly understand:

1. the offer/benefit;
2. the provider;
3. eligibility/listing type;
4. applicability/location context;
5. expiration/current status when available;
6. source/terms context;
7. the next action.

Current flagship implementation preserves that order without inventing new savings/value fields.

## Capability setup

### Stream 1 — GitHub Copilot + repo-native design/build capability

**COMPLETE — PR #22.**

### Stream 2 — ChatGPT product/operator capability

**COMPLETE — PR #24.**

### Stream 3 — Shared deterministic design QA

**COMPLETE — PR #26.**

Available for Marketplace acceptance:

- axe accessibility checks;
- phone/tablet/desktop screenshot evidence;
- browser page/console error detection;
- meaningful failed-network/HTTP 5xx detection;
- existing Hosted Guardian/Partner golden paths;
- acceptance-gated browser execution so ordinary iteration remains cheaper.

## Marketplace Sprint 1 status

Completed:

- baseline and competitive/product-pattern research;
- Guardian jobs-to-be-done and Marketplace information hierarchy;
- three code-first concepts;
- owner review and A+B direction selection;
- Product Critic review;
- search/filter/result-count functional improvements;
- provider/eligibility/applicability/expiration hierarchy;
- accessible filter pressed states and live result-count updates;
- final A+B flagship implementation in the branch;
- QA spec collapsed from three prototype concepts to one flagship target.

Remaining before Issue #27 is complete:

1. pass fast CI on the selected flagship code;
2. verify a READY Vercel preview for the exact final product SHA;
3. move `docs/AI-HANDOFF.md` to `READY_FOR_ACCEPTANCE`;
4. run one real Stream 3 Hosted acceptance cycle;
5. inspect phone/tablet/desktop visual evidence plus axe/runtime results;
6. preserve Partner → Guardian → claim → redemption golden paths;
7. record `ACCEPTED_CODE_SHA` and make docs-only completion changes;
8. merge PR #28 and close Issue #27.

## Figma / Storybook decisions

Figma remains **deferred and is not a prerequisite**. Code-first Vercel previews remain the review surface.

Storybook is now eligible for evaluation because a design direction has been selected, but it is **not an Issue #27 acceptance dependency**. Add it only when isolated reusable component/state work becomes faster than direct page iteration.

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

- Marketplace flagship visual hardening using existing approved product rules/data;
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
