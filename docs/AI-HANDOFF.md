# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: CP6 — provider-agnostic impact, reputation + giving foundation — Issue #14
NEXT_CHECKPOINT: Validate CP6 database/RLS slice, then add the smallest public UI/golden-path acceptance slice
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE

## Current state

- Phase 1 is complete.
- Phase 2 CP1–CP5 are integrated into `build/festival-mvp`.
- Dev Loop v2 is integrated at merge commit `f88a9ccc1cfaa71fc0b5018ab735134d0447075f`.
- Database QA pushed-delta routing follow-up is integrated at `0da330e798c5e6316fb755d127a0b160f359c937`.
- Active branch: `phase2/cp6-impact-giving`.
- Active PR: #19.
- Active Issue: #14.
- CP6 database implementation commit staged at `21ae98fa87bf55077a5206131ba73d0bab21f3a0`; branch ref update/validation follows this handoff refresh.
- Phase 3 remains unauthorized.

## CP6 implemented slice

- Provider-agnostic Partner contribution commitments:
  - fixed amount per redemption;
  - percentage of paid amount;
  - recurring commitment terms;
  - one-time campaign terms;
  - optional designated active shelter/rescue recipient.
- External settled-contribution evidence stored separately from commitments/accruals/provider transactions.
- Evidence review is append-only, platform-admin-only, and audited.
- Good-standing review is append-only, platform-admin-only, and audited.
- Partner reputation is server-derived:
  - Basic Partner;
  - Participating Partner;
  - Redemption Verified from real, non-demo confirmed redemption evidence;
  - Shelter Impact Partner only from real redemption + verified external settlement evidence + current good-standing review.
- Direct Partner escalation of `participation_state` is blocked.
- Public impact summary exposes only substantiated non-demo redemption counts and verified settlement totals by currency.
- Private Partner/admin impact summary keeps active commitments and accrued intents separate from settled values.
- Existing `donation_intents`, `economic_events`, and `economic_event_lines` are reused rather than creating a parallel ledger.
- Active fixed/percentage commitments accrue automatically from trusted confirmed redemption inserts.
- Redemption reversal cancels the linked accrual and appends a negative economic reversal event instead of deleting history.
- Demo organizations cannot earn real reputation or create real contribution accruals.
- Targeted pgTAP covers authorization, truthful status derivation, accrual vs settlement separation, reversal history, admin verification, RLS isolation, and demo exclusion.

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

1. Move branch to the CP6 database implementation commit.
2. Run pushed-delta Database QA + normal CI.
3. Fix any GREEN/YELLOW migration/RLS/test defects without weakening the regression.
4. Add only the minimum public Partner impact presentation/browser regression needed for Issue #14.
5. Move to checkpoint acceptance and full required Persona/Hosted gates.
