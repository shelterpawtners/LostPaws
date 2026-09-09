# AI Handoff

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: MVP Design Hardening + Human Release Readiness
CURRENT_CHECKPOINT: Issue #5 — full-site human-style browser and persistence audit
NEXT_CHECKPOINT: Run the first complete exact-code Issue #5 audit, classify/fix routine blockers, then repeat until release-readiness evidence is green.
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: LOCAL_HEAD

## Canonical baseline

PR #30 / Issue #29 merged to `main` on September 9, 2026 at:

`eeea59cf25435871145118eb244c16753aa3a91b`

Accepted brand-propagation product SHA from PR #30:

`38449c1796b5e30542a3c2e88f898119b1d315ee`

## Active checkpoint — Issue #5

Branch: `qa/issue5-full-site-audit`

Issue #5 is a release-readiness audit, not Phase 3 development. The audit must behave like a human moving through the current application and verify persisted truth rather than isolated happy-path responses.

Required coverage:

1. every currently implemented public and authenticated route;
2. Guardian create -> leave -> return -> reopen -> reload/sign-in journeys;
3. multiple pets and correct empty/non-empty CTA behavior;
4. PetBiz profile + multiple-offer lifecycle, revisit, claim, redemption, replay/cross-partner protections already implemented;
5. Shelter and RAVE Vendor current dashboard/onboarding/profile state using Admin QA impersonation where useful;
6. direct Supabase/RLS verification for canonical rows, relationships, statuses, and isolation;
7. failure/recovery behavior for currently implemented request paths;
8. browser back/forward/reload and fresh-context reconstruction where material;
9. failure evidence with route/persona/runtime context.

## Test strategy

- Reuse existing Playwright golden paths, Persona QA, axe/runtime checks, and QA Supabase fixtures.
- Add one dedicated Issue #5 human-audit suite plus reusable helpers/coverage matrix rather than duplicating all existing tests.
- Use `LOCAL_HEAD` exact-code acceptance while Vercel remains rate-limited.
- Use Admin QA Mode for Shelter/RAVE seeded identities so their real RLS sessions are exercised without adding credentials.
- Direct database checks must authenticate as the persona being verified; do not use service-role credentials in browser code or test artifacts.

## Defect policy

Follow `docs/QA-AUTOMATION-POLICY.md`:

- blocking routine engineering defect -> document, fix immediately, add regression, rerun;
- non-blocking -> log and continue when acceptance remains valid;
- decision-required -> stop only for a material product/privacy/security/financial/domain/Phase 3 choice.

## Guardrails

- no new Phase 3 features;
- no new product/business-rule fields merely to satisfy tests;
- no fabricated savings, ratings, verification, ranking, scarcity, partnerships, or impact claims;
- preserve RLS and economic-history integrity;
- no DNS/custom-domain change;
- no paid infrastructure required;
- do not weaken tests to make the audit green.

## Acceptance boundary

The coverage matrix, reusable helpers, dedicated human-audit suite, Admin QA exact-code enablement, and acceptance-gated workflow integration are now present. Fast validation passed lint, shell checks, unit tests, TypeScript, and the production build before entering this boundary.

The first full acceptance run must execute:

1. existing Hosted Guardian/Partner/Marketplace golden paths;
2. existing hosted design/axe/runtime QA;
3. `e2e/issue-5-human-audit.spec.ts`;
4. `e2e/admin-qa-mode.spec.ts`;
5. the existing phase/persona browser and RLS suites listed in Hosted QA.

Any routine blocker found by this run is fixed with regression coverage before acceptance can complete.

## Completion boundary

Before Issue #5 can complete:

1. coverage matrix maps implemented routes/features to automated journeys;
2. broad audit executes deterministically against exact code;
3. routine blocking defects from the first full run are fixed with regression coverage;
4. remaining non-blockers/future-scope items are documented separately;
5. final CI/Persona/Database/Hosted evidence is green;
6. one accepted code SHA is recorded;
7. release-readiness result is presented before any `shelterpawtners.com` cutover or Phase 3 work.

No action needed from Jim right now.
