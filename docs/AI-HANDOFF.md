# AI Handoff

STATUS: COMPLETE
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: OWNER MERGE GATE — merge PR #2 into `build/festival-mvp`; after merge create a fresh CP6 branch/PR for Issue #14
OWNER_DECISION_REQUIRED: YES
SAFE_TO_CONTINUE: NO

This file is the shared baton between ChatGPT, repository automation, coding agents, and human review.

## Current state

- Branch: `qa/guardian-registration-personas`
- Active integration PR: #2 (`<!-- ai-active-build-pr -->`)
- Completed checkpoint Issue: #13
- Next authorized implementation Issue: #14
- Accepted CP5 feature/test head: `373fcd53126a060fa762f486097645bc940fc072`
- Current PR head before merge-prep batch: `217ddce9ad469c4402fccb7ed3056749fbd36dbb`
- The only commit after the accepted CP5 head changed this handoff document; no CP6 feature work has been added to PR #2.

## CP5 final acceptance

Checkpoint 5 is COMPLETE.

Accepted provider-/rule-independent scope includes:

- exact integer-minor-unit candidate savings with a non-negative floor;
- reference value/evidence provenance;
- concurrency-safe `first_known` / `returning` ShelterPawtners relationship classification using non-demo confirmed history;
- independent Partner customer attestation;
- backwards-compatible redemption attribution capture;
- append-only corrections and compatible reversal/audit history;
- Partner UI capture that explicitly does not present candidate amounts as verified savings.

Final evidence:

- Persona QA #62: PASS — migration replay, pgTAP/RLS, Guardian/persona/access/redemption Playwright.
- CI #231 on accepted head `373fcd53`: PASS.
- Hosted QA #128 on accepted head `373fcd53`: PASS with the full `hosted-smoke` job after Vercel readiness verification.
- Current documentation-only head has CI #232 PASS and Hosted QA #129 acceptance-gate PASS.
- PR #2 is currently mergeable with no reported conflict.
- Issue #13 is CLOSED as completed.

## Merge gate

PR #2 is now **merge-only**. Do not add Checkpoint 6 feature work, broad cleanup, new architecture, or unrelated tests to this branch.

The next action requires owner approval because repository policy prohibits auto-merge:

1. merge PR #2 into `build/festival-mvp`;
2. confirm the integration branch head and post-merge CI state;
3. create a fresh branch from the updated integration base, recommended name `phase2/cp6-impact-giving`;
4. open a small CP6 PR for Issue #14;
5. move the `<!-- ai-active-build-pr -->` marker to that new PR;
6. reset this handoff on the CP6 branch to `STATUS: IN_PROGRESS`, `OWNER_DECISION_REQUIRED: NO`, `SAFE_TO_CONTINUE: YES`.

## Next authorized task — CP6 / Issue #14

After the merge gate, CP6 may implement only the provider-agnostic impact, reputation, and giving foundation described in Issue #14. Reuse the existing Phase 1 economic/giving model rather than creating a parallel ledger.

## RED boundaries

- `OD-003`: customer-facing `verified savings` evidence/calculation rules and verified totals remain owner-gated.
- `OD-004`: production charitable-money movement, provider selection/integration, settlement, provider APIs/webhooks/receipts remain owner-gated.
- Phase 3 remains unauthorized.
- Production/DNS, paid infrastructure, destructive production actions, auto-merge, and material legal/privacy/security/financial/product decisions remain owner-gated.

## Cost/automation rule

Use GitHub Actions/native APIs for polling, CI, targeted Persona QA, Hosted QA, status reconciliation, and stall detection. Spend coding-agent credits only for bounded implementation or non-trivial diagnosis. Future checkpoints should use small PRs rather than extending PR #2.
