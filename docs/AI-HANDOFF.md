# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: MVP Design Hardening + Human Release Readiness
CURRENT_CHECKPOINT: Marketplace Sprint 1 — Issue #27 value architecture + three code-first concepts
NEXT_CHECKPOINT: Validate/deploy the three concept preview, run independent critique, then select the flagship Marketplace direction.
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE

## Completed foundation

- Phase 1 is complete.
- Phase 2 CP1–CP6 are complete.
- `main` is canonical and is the Vercel Production Branch.
- Stream 1 PR #22 merged to `main` at `eaa7b09edc3496eb8e52d57d081fce42d67f5151`.
- Stream 2 PR #24 merged to `main` at `3e49f4c42fba2081b5bd6221c46ffd4b7fd1152c`.
- Stream 3 PR #26 merged to `main` at `a0c763b49f79e90fdd2e0c0586091636e39680f8`; accepted Stream 3 SHA `95db103b606504155f83ca8f217b4e100e35f5c7`.
- Stream 3 deterministic design QA is available: axe, runtime/console/network checks, and responsive screenshot evidence.
- ShelterPawtners DNS remains unchanged.
- Phase 3 remains owner-gated.

## Active task

Issue #27: **Marketplace Sprint 1: Value architecture + three code-first concepts**

Branch:

`design/marketplace-concepts`

Goal:

Turn the current functional but visually weak Marketplace into the flagship ShelterPawtners experience by improving information/value hierarchy and providing three working code-first directions for comparison.

## Research/value architecture completed

`docs/MARKETPLACE-DESIGN-SPRINT.md` records:

- Stream 3 baseline findings;
- current Baymard/Nielsen Norman/Groupon pattern research;
- Guardian jobs-to-be-done;
- Marketplace information hierarchy;
- current `PublicOffer` data boundary;
- explicit no-fabrication rules;
- three concept families;
- Storybook trigger after direction selection rather than before prototyping.

No offer schema migration is authorized or required for these concepts.

## Implementation in progress

Current branch changes include:

- richer `OfferCard` hierarchy using only existing `PublicOffer` fields;
- provider identity moved near the top of each card;
- visible eligibility/classification metadata;
- applicability and expiration surfaced as compact decision metadata;
- repeated card-level endorsement disclaimer removed from list cards while global Marketplace disclosure remains and detail-page disclosure stays explicit;
- keyword search across existing offer fields;
- dynamically generated classification filters from actual returned data;
- result count and clear-search/filter action;
- three preview-selectable concepts:
  - A — Value-first Deal Feed;
  - B — Local + Trust Marketplace;
  - C — Curated Guardian Savings Hub;
- new `src/marketplace.css` isolates the sprint design system from the rest of the product;
- existing `.offerCard` class and `View offer details` link text are preserved for the hosted redemption golden path;
- detail/claim/redemption server behavior is intentionally unchanged.

## Data/claim guardrails

Do not fabricate or imply unavailable structured data such as:

- discount percentages or guaranteed savings;
- original/current prices;
- provider logos/photos;
- ratings/review counts;
- precise distance;
- verified savings totals;
- shelter-impact totals;
- exclusive partnership status.

RAVE query state may change presentation, but must not claim channel filtering unless the public query exposes channel metadata.

## Validation still required

Before this sprint can be accepted:

1. open a draft PR from `design/marketplace-concepts` to `main`;
2. allow fast CI/lint/unit/build checks to run;
3. verify Vercel preview availability;
4. inspect each concept at phone and desktop widths;
5. run Stream 3 Hosted design QA at the acceptance boundary;
6. preserve the existing Partner → Guardian → claim/redemption golden path;
7. request independent Copilot code review when the PR is ready for review;
8. run a separate product/design critique against the three concepts;
9. owner selects a direction before removing the prototype selector and hardening the flagship implementation.

## Known tooling note

The repository currently has a ruleset named `Copilot PR Review` that still targets `refs/heads/build/festival-mvp` and contains deletion/non-fast-forward rules. The connected GitHub API in this session can read but not administer that ruleset. This does not block Issue #27 because Copilot review can be explicitly requested on the PR via the reviewer API when ready.

## Explicit non-goals / owner gates

- no Figma prerequisite;
- no Storybook prerequisite before the winning component system earns it;
- no new offer schema/data-model fields without owner review;
- no fabricated partnerships/savings/impact claims;
- no paid design/QA tooling;
- no Phase 3 feature work;
- no `shelterpawtners.com` / `www.shelterpawtners.com` DNS changes;
- no destructive operations or weakened tests.

## Next action

1. finish the three visual-system implementation;
2. open draft PR for Issue #27;
3. fix fast CI/build findings;
4. validate Vercel preview and compare A/B/C;
5. request independent Copilot review and run Product Critic review;
6. move to acceptance only after real preview evidence exists.
