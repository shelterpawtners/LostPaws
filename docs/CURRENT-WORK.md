# Current ShelterPawtners Work

## Current phase

Phase 2 — Partner Marketplace MVP is active.

Phase 1 — Platform + Data Foundation is complete.

Phase 3 remains explicitly unauthorized.

## Integrated baseline

PR #2 integrated accepted CP1–CP5.

Dev Loop v2 is integrated into `build/festival-mvp` at `f88a9ccc1cfaa71fc0b5018ab735134d0447075f`.

The Database QA pushed-delta follow-up is integrated at `0da330e798c5e6316fb755d127a0b160f359c937`.

Accepted Phase 2 status:

| Checkpoint                                                             | Status   |
| ---------------------------------------------------------------------- | -------- |
| CP1 — Partner Organization Foundation                                  | ACCEPTED |
| CP2 — Partner Profile + Public Directory                               | ACCEPTED |
| CP3 — Offer Engine                                                     | COMPLETE |
| CP4 — Claim + QR/Code Redemption                                       | ACCEPTED |
| CP5 — Verified Savings + Customer Attribution pre-decision engineering | COMPLETE |
| CP6 — Provider-agnostic Impact, Reputation + Giving Foundation         | COMPLETE |

## Accepted CP6

- Issue #14 is complete.
- Branch: `phase2/cp6-impact-giving`.
- PR #19 targets `build/festival-mvp` and is accepted at implementation SHA `b727e26df064acdc11972e98be7a92958bc5fc6d`.
- Acceptance evidence: CI #269 PASS; Database QA #32 PASS; Persona QA #97 PASS; Hosted QA #163 PASS; Dependency Review #32 PASS; Merge Gate #33 PASS; AI Ops Status #35 PASS.
- CP6 delivers truthful, audited provider-agnostic commitments, accruals, externally verified settled-contribution evidence, server-derived Partner reputation, demo exclusion, RLS coverage, and permission-safe impact presentation without introducing production money movement or a parallel ledger.

## Next Phase 2 work

After PR #19 is integrated, verify the updated `build/festival-mvp` baseline and prepare the next authorized MVP-readiness task from existing Phase 2 backlog. Prefer a bounded vertical-slice/readiness task that does not require `OD-003`, `OD-004`, production/DNS changes, paid infrastructure, destructive operations, or Phase 3.

Candidate remaining Phase 2 work should be selected from the existing MVP/QA backlog based on user-facing value and remaining acceptance gaps, not by adding new product scope implicitly.

## Operating model

Use `docs/DEV-LOOP-V2.md`.

Key rules:

- one Issue → one short branch → one bounded PR → acceptance → merge;
- GitHub Actions/scripts own deterministic work;
- AI credits are reserved for implementation/reasoning;
- implementation-time Database QA classifies the pushed delta while Merge Gate assesses the whole PR;
- Persona and Hosted browser suites run at checkpoint acceptance only when required;
- generic Hosted QA validates normal product flows on the PR Preview artifact;
- hidden Admin QA security behavior runs in the local Persona acceptance lane;
- Merge Gate validates deterministic evidence and `ACCEPTED_CODE_SHA`;
- AI Ops status uses one native Issue #12 record;
- stale watchdog cadence is hourly.

## Owner gates

The remainder of Phase 2 is authorized.

Still owner-gated:

- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` giving-provider selection and production charitable settlement/integration;
- production deployment/DNS;
- paid infrastructure;
- destructive operations;
- material legal/privacy/security/financial/product RED decisions;
- Phase 3.
