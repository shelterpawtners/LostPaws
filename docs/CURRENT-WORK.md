# Current ShelterPawtners Work

## Current phase

Phase 2 — Partner Marketplace MVP is active.

Phase 1 — Platform + Data Foundation is complete.

Phase 3 remains explicitly unauthorized.

## Integrated baseline

PR #2 was owner-approved and merged into `build/festival-mvp` on 2026-09-08.

Accepted Phase 2 status:

| Checkpoint                                                             | Status          |
| ---------------------------------------------------------------------- | --------------- |
| CP1 — Partner Organization Foundation                                  | ACCEPTED        |
| CP2 — Partner Profile + Public Directory                               | ACCEPTED        |
| CP3 — Offer Engine                                                     | COMPLETE        |
| CP4 — Claim + QR/Code Redemption                                       | ACCEPTED        |
| CP5 — Verified Savings + Customer Attribution pre-decision engineering | COMPLETE        |
| CP6 — Provider-agnostic Impact, Reputation + Giving Foundation         | AUTHORIZED NEXT |

## Dev Loop v2 bootstrap

**Issue #15 — Dev Loop v2 bootstrap** is COMPLETE at accepted code SHA `6a63827a1111d00ea930a1e07e8aa3ffd9e911ed`.

Accepted native evidence on that implementation SHA:

- CI #257 PASS;
- Database QA #22 PASS;
- Persona QA #87 PASS, including local Admin QA security regression;
- Hosted QA #153 PASS with actual hosted golden paths against the resolved Vercel Preview artifact;
- Merge Gate #23 PASS at the acceptance boundary;
- Dependency Review #22 PASS;
- AI Ops Status #23 PASS.

PR #16 now requires only final documentation-only Merge Gate validation and integration under the owner's standing authorization.

## Next product checkpoint

After PR #16 is integrated:

1. create `phase2/cp6-impact-giving` from the updated `build/festival-mvp`;
2. open one bounded CP6 PR for Issue #14;
3. move the `<!-- ai-active-build-pr -->` marker to that PR;
4. set the handoff to `IN_PROGRESS`, owner decision `NO`, safe to continue `YES`, accepted SHA `NONE`;
5. implement CP6 provider-agnostic impact/reputation/giving foundations;
6. stop only before provider-dependent production money movement or another RED decision.

## Operating model

Use `docs/DEV-LOOP-V2.md` as the current development process.

Key rules:

- one Issue → one short branch → one bounded PR → acceptance → merge;
- GitHub Actions/scripts own deterministic work;
- AI credits are reserved for implementation/reasoning;
- Database QA runs for relevant DB changes;
- Persona and Hosted browser QA run at checkpoint acceptance only when the classifier requires them;
- generic Hosted QA validates normal product flows on the PR Preview artifact;
- hidden Admin QA security behavior runs in the local Persona acceptance lane;
- Merge Gate validates deterministic evidence and `ACCEPTED_CODE_SHA`;
- AI Ops status is one native Issue #12 record;
- stale watchdog cadence is hourly;
- tooling/docs-only commits reuse valid prior frontend acceptance instead of forcing redundant deployment/browser work.

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
