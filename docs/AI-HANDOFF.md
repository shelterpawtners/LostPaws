# AI Handoff

STATUS: COMPLETE
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: CP6 — provider-agnostic impact, reputation + giving foundation — Issue #14
NEXT_CHECKPOINT: Integrate accepted PR #19, then prepare the next authorized Phase 2 MVP readiness task from the updated `build/festival-mvp` baseline
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: b727e26df064acdc11972e98be7a92958bc5fc6d

## Current state

- Phase 1 is complete.
- Phase 2 CP1–CP5 are integrated into `build/festival-mvp`.
- Dev Loop v2 is integrated at merge commit `f88a9ccc1cfaa71fc0b5018ab735134d0447075f`.
- Database QA pushed-delta routing follow-up is integrated at `0da330e798c5e6316fb755d127a0b160f359c937`.
- Active branch: `phase2/cp6-impact-giving`.
- Active PR: #19.
- Issue #14 is COMPLETE.
- Accepted CP6 implementation SHA: `b727e26df064acdc11972e98be7a92958bc5fc6d`.
- Acceptance on that SHA: CI #269 PASS; Database QA #32 PASS; Persona QA #97 PASS; Hosted QA #163 PASS; Dependency Review #32 PASS; Merge Gate #33 PASS; AI Ops Status #35 PASS.
- Phase 3 remains unauthorized.

## CP6 accepted scope

- Provider-agnostic Partner contribution commitments for fixed-per-redemption, percentage, recurring, and one-time campaign terms.
- External settled-contribution evidence kept separate from commitments, accruals, and provider transactions.
- Append-only, platform-admin-only audited evidence review and good-standing review.
- Server-derived Partner reputation progression through Basic Partner, Participating Partner, Redemption Verified, and Shelter Impact Partner.
- Redemption Verified requires legitimate non-demo confirmed redemption evidence.
- Shelter Impact Partner requires real redemption, verified settled-contribution evidence, and current good standing/admin review.
- Direct Partner escalation of privileged participation/reputation states is blocked.
- Public impact summary exposes only substantiated non-demo redemption counts and verified settlement totals by currency.
- Private Partner/admin impact summary keeps commitments/accruals separate from settled values.
- Existing donation/economic ledgers are reused rather than duplicated.
- Active commitments accrue from trusted confirmed redemptions; reversal appends correcting economic history instead of deleting prior history.
- Demo organizations cannot earn real reputation or real contribution accruals.
- Targeted pgTAP/RLS and browser regression cover authorization, truthful derivation, accrual-vs-settlement separation, reversal history, admin verification, RLS isolation, demo exclusion, and public impact presentation.

## RED boundaries

- `OD-003`: customer-facing verified-savings rules/totals remain blocked.
- `OD-004`: giving-provider selection, production charitable settlement/money movement, receipts/tax-provider integration remain blocked.
- No production/DNS, paid infrastructure, destructive migration, material legal/privacy/security/financial RED decision, or Phase 3.

## Next action

1. Let documentation-only acceptance-state commits pass applicable native checks without invalidating the accepted implementation SHA.
2. Integrate PR #19 only under the existing no-auto-merge boundary.
3. Verify the updated `build/festival-mvp` baseline.
4. Identify and prepare the next already-authorized Phase 2 MVP-readiness task that does not depend on `OD-003`, `OD-004`, production changes, or Phase 3.
