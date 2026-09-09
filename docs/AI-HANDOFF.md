# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: MVP Design Hardening + Human Release Readiness
CURRENT_CHECKPOINT: Marketplace Sprint 1 — A+B flagship review hardening
NEXT_CHECKPOINT: Pass fast CI on Copilot review fixes, obtain an exact-code preview or local acceptance target, then rerun final Stream 3 Hosted acceptance.
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE
ACCEPTANCE_DEPLOYED_SHA: NONE

## Completed foundation

- Phase 1 is complete.
- Phase 2 CP1–CP6 are complete.
- `main` is canonical and is the Vercel Production Branch.
- Stream 1 PR #22 merged to `main` at `eaa7b09edc3496eb8e52d57d081fce42d67f5151`.
- Stream 2 PR #24 merged to `main` at `3e49f4c42fba2081b5bd6221c46ffd4b7fd1152c`.
- Stream 3 PR #26 merged to `main` at `a0c763b49f79e90fdd2e0c0586091636e39680f8`; accepted Stream 3 SHA `95db103b606504155f83ca8f217b4e100e35f5c7`.
- ShelterPawtners DNS remains unchanged.
- Phase 3 remains owner-gated.

## Active task

Issue #27: **Marketplace Sprint 1: Value architecture + flagship design**

PR #28: **Marketplace Sprint 1: value architecture + three concepts**

Branch: `design/marketplace-concepts`

Owner decision on September 9, 2026: **combine Concept A + Concept B**.

Selected product direction:

- A's fast scanability, search/filter flow, and compact comparison grid;
- B's premium dark frame, stronger brand character, and trust/context emphasis;
- no prototype A/B/C selector in the final product;
- no Concept C first-two editorial prominence without an approved ranking/curation rule.

## Current A+B implementation

The selected Marketplace keeps provider identity, offer title/value, eligibility/listing type, applicability/expiration, CTA, and source/current terms in the scan hierarchy. It uses a compact trust strip inside a premium dark Marketplace frame and retains A's scan-first offer cards.

No new offer schema fields or fabricated savings, pricing, ratings, logos, distance, impact, or partnership claims are introduced.

## Copilot review hardening now in progress

The first final-acceptance run passed, but the later GitHub Copilot review identified edge cases that must be corrected before merge. That earlier acceptance evidence is therefore historical only and is **not** the final accepted code.

Current hardening batch addresses:

1. separate RPC load failure, true catalog-empty, and filtered-empty states;
2. humanize enum-backed classification/eligibility/applicability values before search matching;
3. expose listing-type filters as an accessible control group while preserving `aria-pressed` state;
4. use classification-neutral trust wording on offer detail pages;
5. render a compact embedded offer-list variant inside public PetBiz profiles instead of the full flagship Marketplace shell;
6. require hosted design QA to prove at least one real `.offerCard` loaded before axe checks/screenshots;
7. retain phone, tablet, and desktop visual evidence.

Because these changes modify runtime behavior, the prior READY Vercel artifact at `69164a9a040122039202454a35c027da3cbb6a5a` can no longer be reused for final acceptance. Do not force equivalence or merge against stale runtime evidence.

## Final QA contract

Before Issue #27 can be accepted:

1. Prettier/lint, shell validation, unit tests, TypeScript, and Vite build pass on the review-fix code;
2. the exact current frontend is tested, using a fresh Vercel preview if available or an explicitly reviewed exact-code local-hosted fallback if the Vercel free-tier cap still blocks deployment;
3. axe WCAG A/AA checks pass on home and `/marketplace`;
4. no meaningful page/console/network failures occur;
5. phone (390x844), tablet (768x1024), and desktop (1440x1000) full-page Marketplace evidence is captured;
6. existing Partner → Guardian → claim → redemption golden paths remain green;
7. active Copilot review threads are resolved with evidence;
8. Database/Persona/Dependency/Merge gates remain green as applicable.

After final acceptance passes, record its exact code SHA as `ACCEPTED_CODE_SHA`, make only docs-only completion changes, update PR #28 to the A+B flagship scope, merge, and close Issue #27.

## Product/data guardrails

- Provider monograms are placeholders, not provider logos.
- Current RPC order must not be described as editorial ranking, popularity, relevance, or value ranking.
- `channel=rave` may change presentation but must not claim actual channel filtering until approved public data exposes channel metadata.
- Client-side search is acceptable for MVP scale but is not the long-term large-catalog search architecture.

## Figma / Storybook

- Figma remains deferred and is not a prerequisite.
- Storybook is eligible for later evaluation but is not an Issue #27 acceptance dependency.

## Explicit non-goals / owner gates

- no new offer schema/data-model fields without owner review;
- no fabricated partnerships/savings/impact claims;
- no paid design/QA tooling;
- no Phase 3 feature work;
- no `shelterpawtners.com` / `www.shelterpawtners.com` DNS changes;
- no destructive operations or weakened tests.

## Next action

1. commit the Copilot review fixes as one bounded batch;
2. pass fast CI and relevant deterministic gates;
3. resolve review threads already fixed by the new code and verify no new review blockers;
4. establish an exact-code acceptance target;
5. rerun one final Stream 3 Hosted acceptance cycle;
6. record the accepted code SHA and complete Issue #27.
