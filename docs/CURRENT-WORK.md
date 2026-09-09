# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

The project is in **MVP Design Hardening + Human Release Readiness** before ShelterPawtners domain cutover and before Phase 3 feature work.

**Phase 3 remains explicitly owner-gated.**

## Canonical application state

- `main` is canonical and Vercel Production Branch.
- Marketplace Sprint 1 / PR #28 is merged.
- Brand propagation / PR #30 is merged to `main` at `eeea59cf25435871145118eb244c16753aa3a91b`.
- Accepted PR #30 product SHA: `38449c1796b5e30542a3c2e88f898119b1d315ee`.
- Issue #29 is closed.
- `shelterpawtners.com` / `www.shelterpawtners.com` DNS remain unchanged.

## Current priority

**Issue #5 — Full-site human-style browser and persistence audit — is active now.**

Branch: `qa/issue5-full-site-audit`

This checkpoint validates the stabilized MVP as a human would use it before any public-domain cutover. It is not a redesign and does not begin Phase 3.

The audit must cover:

- public and protected route traversal/navigation;
- Guardian multiple-pet, return/reload/sign-in and detail reopening behavior;
- PetBiz profile/offer lifecycle and multi-record behavior;
- current Shelter and RAVE Vendor journeys through real QA identities;
- claim/redemption continuity and existing replay/cross-partner protections;
- direct database/RLS truth checks after state changes;
- failure/recovery behavior for implemented requests;
- fresh-context reconstruction from backend state;
- human-visible labels, CTAs, statuses, records and next actions.

## Execution model

- Add a dedicated Issue #5 Playwright suite and reusable helpers rather than replacing existing golden tests.
- Create a coverage matrix for all implemented routes/features.
- Extend Hosted QA so Issue #5 runs deterministically at its acceptance boundary.
- Use exact-code `LOCAL_HEAD` acceptance while Vercel is rate-limited.
- Use Admin QA impersonation for seeded Shelter/RAVE identities instead of adding secrets.
- Routine blocking defects are fixed autonomously under `docs/QA-AUTOMATION-POLICY.md`.

## Acceptance goal

A manual tester should not be able to discover obvious navigation/state/persistence defects within a few minutes that this automated audit should reasonably have caught first.

Before completion:

1. run the broad suite;
2. classify defects;
3. fix routine blockers with regressions;
4. document future-scope/non-blockers separately;
5. get deterministic CI/Persona/Database/Hosted evidence green;
6. record one accepted code SHA;
7. present release-readiness result before domain cutover.

## Guardrails

Authorized now:

- Issue #5 QA automation, route/persistence verification, browser/accessibility hardening, and bounded routine defect fixes;
- reversible free/low-cost tooling that preserves security.

Still owner-gated/deferred:

- `shelterpawtners.com` / `www.shelterpawtners.com` DNS/custom-domain routing;
- Phase 3 feature development;
- new Marketplace/business model fields or material product rules;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` giving provider/settlement decisions;
- paid infrastructure unless separately justified and approved;
- destructive or material privacy/security/financial/legal changes.

No action needed from Jim right now.
