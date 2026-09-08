# Current ShelterPawtners Work

## Current phase

Phase 2 — Partner Marketplace MVP is active.

Phase 1 — Platform + Data Foundation is complete and remains the approved foundation baseline.

Frozen phase structure:

1. Platform + Data Foundation
2. Partner Marketplace MVP
3. Guardian + Shelter Passport MVP
4. Impact + Giving + Financial Intelligence
5. Integrations + Marketplace + Production Launch

Phase 3 remains explicitly unauthorized.

## Phase 2 checkpoint status

| Checkpoint                                                             | Status          | Primary evidence                                                           |
| ---------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------- |
| CP1 — Partner Organization Foundation                                  | ACCEPTED        | `docs/PHASE-2-CHECKPOINT-1-PROGRESS.md`, `docs/PHASE-2-CHECKPOINT-1-QA.md` |
| CP2 — Partner Profile + Public Directory                               | ACCEPTED        | committed profile/directory RLS + hosted regression                        |
| CP3 — Offer Engine                                                     | COMPLETE        | `docs/PHASE-2-CHECKPOINT-3-PROGRESS.md`                                    |
| CP4 — Claim + QR/Code Redemption                                       | ACCEPTED        | `docs/PHASE-2-CHECKPOINT-4-PROGRESS.md`                                    |
| CP5 — Verified Savings + Customer Attribution pre-decision engineering | COMPLETE        | Issue #13, Persona QA #62, CI #231, Hosted QA #128                         |
| CP6 — Provider-agnostic Impact, Reputation + Giving Foundation         | AUTHORIZED NEXT | Issue #14; begin only after PR #2 merge gate                               |

## Immediate integration gate

PR #2 (`qa/guardian-registration-personas` → `build/festival-mvp`) contains the accumulated Phase 2 QA/integration foundation through accepted Checkpoint 5.

Current policy:

- PR #2 is merge-only; do not add CP6 features or unrelated cleanup.
- CP5 is fully accepted and Issue #13 is closed.
- PR #2 is mergeable and its accepted feature/test head has green Persona QA, CI, and full Hosted QA.
- Auto-merge is prohibited, so owner approval is required for the merge itself.
- After merge, confirm the integration branch state before starting the next checkpoint.

## Clean execution model after PR #2

Starting with CP6, use **one bounded checkpoint/feature PR at a time** instead of a long-lived integration PR.

Post-merge launch sequence:

1. merge PR #2 into `build/festival-mvp` after owner approval;
2. create `phase2/cp6-impact-giving` from the updated integration branch;
3. open a small PR for Issue #14;
4. place `<!-- ai-active-build-pr -->` on exactly one active implementation PR;
5. set `docs/AI-HANDOFF.md` to `IN_PROGRESS` on that branch;
6. implement the bounded checkpoint;
7. use normal CI during implementation;
8. use targeted Persona QA only for database/RLS/persona-sensitive changes;
9. run full Hosted QA only at `READY_FOR_ACCEPTANCE`;
10. mark COMPLETE only after deterministic acceptance is green;
11. merge, then start the next checkpoint from a fresh integration base.

## MVP delivery strategy

Keep the vertical-slice balance:

- 65–70% critical MVP feature delivery;
- 20–25% automated golden-path/RLS regression;
- 5–10% human UX acceptance;
- minimal cosmetic polish until major flows are connected.

For each critical slice:

1. build the usable end-to-end path;
2. protect it with targeted deterministic tests;
3. fix GREEN/YELLOW blockers immediately;
4. defer broad permutations and cosmetic work;
5. move on after acceptance.

Issue #5 remains the broader full-site QA/hardening epic and is not the gate for every checkpoint.

## Cost-controlled AI operating model

GitHub is the source of truth and zero-AI control plane.

Use native GitHub Actions/scripts for:

- polling and workflow status;
- lint/unit/build;
- migration replay and pgTAP/RLS;
- Playwright execution;
- targeted Persona QA;
- Hosted QA gating;
- stall detection and status reconciliation.

Use AI only when reasoning or implementation adds material value:

- bounded checkpoint implementation;
- non-obvious defect diagnosis;
- architecture/product/security reasoning;
- semantic acceptance review;
- RED-decision escalation.

Do not invoke coding agents for routine green CI, polling, status updates, simple locator/test-plan fixes, or repetitive review. Prefer one substantial coding session per bounded checkpoint rather than many small steering prompts.

Authoritative coordination:

- active GitHub Issue — task contract;
- `docs/AI-HANDOFF.md` — live baton/state;
- `docs/AUTONOMOUS-EXECUTION-POLICY.md` — GREEN/YELLOW/RED behavior;
- `docs/AI-COST-AND-TESTING-GOVERNANCE.md` — cost/test rules;
- `docs/OWNER-DECISION-BACKLOG.md` — unresolved owner gates;
- this file — phase/checkpoint status and immediate execution sequence.

## Current owner policy

Jim authorized autonomous completion of the remainder of Phase 2 on 2026-09-08.

Still owner-gated:

- auto-merge / merge approval when explicitly required by repo policy;
- customer-facing verified-savings rules or totals (`OD-003`);
- giving-provider selection, production charitable-money movement, settlement, APIs/webhooks/receipts (`OD-004`);
- legal/privacy/security posture changes;
- destructive data operations;
- paid infrastructure;
- production deployment/DNS;
- Phase 3 authorization.

Newer explicit owner decisions and implemented repository state supersede stale historical planning notes.
