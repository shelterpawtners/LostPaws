# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: CP6 — provider-agnostic impact, reputation + giving foundation — Issue #14
NEXT_CHECKPOINT: Complete CP6 provider-agnostic acceptance; stop before OD-004 provider-dependent money movement
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE

## Current state

- Phase 1 is complete.
- Phase 2 CP1–CP5 are integrated into `build/festival-mvp`.
- Dev Loop v2 is integrated at merge commit `f88a9ccc1cfaa71fc0b5018ab735134d0447075f`.
- Database QA pushed-delta routing follow-up is integrated at `0da330e798c5e6316fb755d127a0b160f359c937`.
- Active branch: `phase2/cp6-impact-giving`.
- Active Issue: #14.
- CP6 must reuse the existing economic/giving foundation instead of introducing a parallel ledger.
- Phase 3 remains unauthorized.

## CP6 contract

Implement provider-agnostic foundations for:

- truthful Partner progression: Partner → Participating Partner → Redemption Verified → Shelter Impact Partner;
- Redemption Verified derived only from legitimate non-demo confirmed redemption evidence;
- Partner contribution commitments/terms without claiming money is already donated or settled;
- commitment/accrual kept distinct from verified settled contribution;
- privileged audited platform-admin verification of external settled-contribution evidence;
- Shelter Impact Partner requiring real redemption + verified settled contribution + good standing/admin review;
- substantiated permission-safe impact metrics excluding demo activity;
- append-only/auditable reasoned transitions and server-side authorization.

Reuse where appropriate:

- `economic_events` / `economic_event_lines`;
- `donation_intents` for accrued partner contribution obligations;
- existing redemptions and CP5 attribution evidence;
- existing organization membership/admin helpers and private audit events.

Do not create a fake giving provider or provider transaction while OD-004 is unresolved.

## Validation minimum

- ordinary Partner cannot self-assign privileged reputation states;
- non-demo confirmed redemption can qualify Redemption Verified; demo redemption cannot;
- commitments/accruals never present as settled contributions;
- external settled evidence approval is platform-admin-only and audited;
- Shelter Impact Partner cannot be awarded from pledge/accrual alone;
- cross-organization reads/writes remain RLS-safe;
- append-only economic/audit history remains intact;
- migration replay + targeted pgTAP/RLS + relevant browser acceptance pass.

## Cost policy

- GitHub Actions/scripts own deterministic validation.
- Database QA runs on database-sensitive pushed deltas; Merge Gate assesses the whole PR.
- Persona and Hosted browser suites run only at acceptance when required.
- No automatic coding-agent invocation or automatic AI review.
- One active writer on this branch during the live sprint.

## RED boundaries

- `OD-003`: customer-facing verified-savings rules/totals remain blocked.
- `OD-004`: giving-provider selection, production charitable settlement/money movement, receipts/tax-provider integration remain blocked.
- No production/DNS, paid infrastructure, destructive migration, material legal/privacy/security/financial RED decision, or Phase 3.

## Next action

Implement the smallest truthful CP6 vertical slice using the existing ledger and RLS foundations, add targeted database tests, and continue through GREEN/YELLOW defects until the checkpoint reaches `READY_FOR_ACCEPTANCE` or a genuine RED boundary appears.
