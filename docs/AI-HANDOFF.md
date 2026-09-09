# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: MVP Design Hardening + Human Release Readiness
CURRENT_CHECKPOINT: Marketplace Sprint 1 — owner visual selection + winner hardening
NEXT_CHECKPOINT: Owner selects A, B, C, or an A+B hybrid; then remove prototype chrome and harden the winning flagship Marketplace direction.
OWNER_DECISION_REQUIRED: YES
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

PR #28: **Marketplace Sprint 1: value architecture + three concepts**

Branch: `design/marketplace-concepts`

Current tested product SHA: `860f0cb319827491209946b5ce83de8081c2bdca`

Vercel branch preview: `https://lost-paws-git-design-marketplace-11cbb5-jims-projects-acec6bcb.vercel.app`

Current concept URLs:

- A — Value-first Deal Feed: `/marketplace?concept=value`
- B — Local + Trust Marketplace: `/marketplace?concept=trust`
- C — Curated Guardian Savings Hub: `/marketplace?concept=curated`

Vercel deployment `dpl_3yejHvzj7Qq7po3xVGFk9z6NLVti` is READY and was built from tested product SHA `860f0cb319827491209946b5ce83de8081c2bdca`.

## Research/value architecture completed

`docs/MARKETPLACE-DESIGN-SPRINT.md` records the baseline findings, Guardian jobs-to-be-done, Marketplace information hierarchy, current `PublicOffer` data boundary, no-fabrication rules, three concept families, and the Storybook trigger after direction selection.

No offer schema migration is authorized or required for these concepts.

## Three concepts now implemented

### A — Value-first Deal Feed

Best current strength: fast scanability and comparison. Commerce-forward card grid with provider identity, eligibility/classification, applicability/expiration, and a strong details CTA.

### B — Local + Trust Marketplace

Best current strength: premium brand/trust character. Darker frame, provider/trust rail, and wider offer rows. It should reduce repeated trust/legal explanation if selected.

### C — Curated Guardian Savings Hub

Best current strength: membership/editorial destination feel. Larger lead cards plus secondary browsing. The first-two prominence is **prototype layout only**; there is no approved curation/ranking rule and this behavior must not become production merchandising by accident.

## Common implementation improvements completed

- richer `OfferCard` hierarchy using only existing `PublicOffer` fields;
- provider identity near the top of each card;
- visible eligibility/classification metadata;
- applicability and expiration surfaced as decision metadata;
- keyword search across existing offer fields;
- dynamically generated classification filters from actual returned data;
- result count and clear-search/filter action;
- `aria-pressed` state for filter buttons;
- live result-count announcement for assistive technology;
- list-card disclosure repetition reduced while global/detail disclosures remain;
- `src/marketplace.css` isolates sprint design work from the broader app;
- existing `.offerCard` and `View offer details` hooks preserved for hosted golden-path tests;
- detail/claim/redemption server behavior unchanged.

## Validation status

On tested product SHA `860f0cb319827491209946b5ce83de8081c2bdca`:

- Vercel preview: READY;
- Prettier: success;
- shell validation: success;
- unit tests: success;
- TypeScript/build: success;
- CI Gate: success;
- Merge Gate: success;
- Database QA: success;
- Persona QA: success;
- Dependency Review: success;
- Hosted QA gate: success; heavy hosted-smoke intentionally remains acceptance-gated until the owner-selected design is final.

PR #28 is ready for review but **must not be merged before owner design selection and winner hardening**.

Copilot code review has been explicitly requested; no Copilot review submission has been returned yet. Independent Product Critic review is recorded on PR #28.

## Product Critic findings to preserve

1. Remove A/B/C prototype chrome after direction selection.
2. Do not invent savings percentages, dollar values, ratings, logos, distance, verified impact, or partnership claims that are not in approved data.
3. Concept C first-two prominence is layout-only until a real ranking/curation rule is approved.
4. Compress duplicate trust/legal copy, especially in Concept B.
5. Provider monograms are placeholders, not provider logos.
6. Define deterministic ordering before release; do not let RPC order become an accidental merchandising policy.
7. Client-side search is acceptable for MVP scale but is not the long-term catalog-search architecture.
8. `channel=rave` changes presentation only; current `PublicOffer` data does not expose channel metadata for truthful client-side filtering.
9. Preserve the strongest common hierarchy: provider identity → offer title/value → eligibility/listing type → applicability/expiration → CTA → source/current terms.
10. Final acceptance must include phone + desktop visual evidence, axe/runtime checks, and the existing Partner → Guardian → claim → redemption golden path.

Initial critic direction before owner feedback: **combine A's scanability with B's premium/trust character** unless owner testing strongly favors one concept as-is.

## Known tooling note

The repository ruleset named `Copilot PR Review` still targets `refs/heads/build/festival-mvp`; explicit Copilot review requests are used on PR #28. This cleanup does not block design selection.

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

1. Owner tests A, B, and C on the current READY Vercel preview.
2. Owner selects A, B, C, or explicitly approves a hybrid direction.
3. Remove prototype-only selector/explanatory chrome.
4. Implement the selected flagship direction and common critic fixes.
5. Run final Stream 3 phone/desktop visual evidence, axe/runtime checks, and existing Marketplace golden path.
6. Accept and merge Issue #27 only after the winning design passes that boundary.
