# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: MVP Design Hardening + Human Release Readiness
CURRENT_CHECKPOINT: Marketplace Sprint 1 — exact-code A+B acceptance fallback
NEXT_CHECKPOINT: Validate the local exact-code Hosted QA fallback, then move to READY_FOR_ACCEPTANCE and rerun final Stream 3 acceptance on the current PR head.
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: LOCAL_HEAD

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

## Copilot review hardening completed in code

The first final-acceptance run passed, but the later GitHub Copilot review identified edge cases that required correction before merge. That earlier acceptance evidence is historical only and is **not** the final accepted code.

Current hardening addresses:

1. separate RPC load failure, true catalog-empty, and filtered-empty states;
2. humanize enum-backed classification/eligibility/applicability values before search matching;
3. expose listing-type filters as an accessible control group while preserving `aria-pressed` state;
4. use classification-neutral trust wording on offer detail pages;
5. render a compact embedded offer-list variant inside public PetBiz profiles instead of the full flagship Marketplace shell;
6. require hosted design QA to prove at least one real `.offerCard` loaded before axe checks/screenshots;
7. retain phone, tablet, and desktop visual evidence.

Fast CI on the review-hardening runtime code has passed Prettier, shell validation, unit tests, TypeScript, and Vite build.

## Exact-code acceptance fallback

Vercel Hobby build-rate limits are currently preventing a fresh preview for the final review-hardening commit. Do not pay for an upgrade solely to obtain this acceptance artifact.

`ACCEPTANCE_RUNTIME: LOCAL_HEAD` tells the acceptance-gated Hosted QA workflow to leave `PLAYWRIGHT_BASE_URL` unset. The existing Playwright config then starts the exact PR-head Vite application locally on the GitHub runner and injects the same QA Supabase URL/publishable key used by Hosted QA.

This fallback must remain explicit and acceptance-gated. Ordinary PR runs stay cheap, and normal Vercel-backed acceptance remains the default when `ACCEPTANCE_RUNTIME` is not `LOCAL_HEAD`.

## Final QA contract

Before Issue #27 can be accepted:

1. Prettier/lint, shell validation, unit tests, TypeScript, and Vite build pass on the review-fix code;
2. the exact current frontend is tested, using a fresh Vercel preview when available or the explicit `LOCAL_HEAD` exact-code fallback when the Vercel free-tier cap blocks deployment;
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

1. validate the `LOCAL_HEAD` workflow change under normal fast CI while `STATUS: IN_PROGRESS` keeps heavy Hosted QA skipped;
2. resolve review threads already fixed by code where evidence is sufficient;
3. move handoff to `READY_FOR_ACCEPTANCE`;
4. run one final Stream 3 Hosted acceptance cycle against exact PR-head code;
5. record the accepted code SHA and complete Issue #27.
