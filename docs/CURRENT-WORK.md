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

| Checkpoint                                                             | Status      |
| ---------------------------------------------------------------------- | ----------- |
| CP1 — Partner Organization Foundation                                  | ACCEPTED    |
| CP2 — Partner Profile + Public Directory                               | ACCEPTED    |
| CP3 — Offer Engine                                                     | COMPLETE    |
| CP4 — Claim + QR/Code Redemption                                       | ACCEPTED    |
| CP5 — Verified Savings + Customer Attribution pre-decision engineering | COMPLETE    |
| CP6 — Provider-agnostic Impact, Reputation + Giving Foundation         | IN_PROGRESS |

## Active work

- Issue: #14 — CP6 provider-agnostic impact, reputation + giving foundation.
- Branch: `phase2/cp6-impact-giving`.
- One bounded CP6 PR targets `build/festival-mvp`.
- `ACCEPTED_CODE_SHA` remains `NONE` until checkpoint acceptance.

CP6 must reuse the existing Phase 1/2 economic and giving foundation wherever appropriate. In particular, do not create a fake giving provider or a second giving ledger merely to represent provider-independent commitments or external settlement evidence.

## CP6 focus

Build truthful, auditable foundations for:

- Partner participation/reputation progression;
- non-demo redemption-derived `Redemption Verified` status;
- provider-agnostic contribution commitments;
- accruals distinct from settled contributions;
- admin-only verification of external settled-contribution evidence;
- `Shelter Impact Partner` eligibility requiring real redemption + verified settled contribution + good standing/admin review;
- permission-safe impact metrics that exclude demo activity.

Do not route or settle production charitable funds in CP6.

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
