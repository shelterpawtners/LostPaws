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

CP5 evidence remains recorded in the handoff/progress history and Issue #13 is closed.

## Dev Loop v2 bootstrap

**Issue #15 — Dev Loop v2 bootstrap** is COMPLETE at accepted code SHA `7d3f69782da7365400fbce639837b692b37c995c`.

Accepted native evidence:

- CI #244 PASS;
- Database QA #9 PASS;
- Persona QA #74 PASS;
- Hosted QA #140 PASS with actual `hosted-smoke` job SUCCESS;
- Merge Gate #10 PASS at the acceptance boundary;
- Dependency Review #9 PASS;
- AI Ops Status #10 PASS.

PR #16 remains open only for manual integration because auto-merge is prohibited. No engineering or owner-decision blocker remains for this bootstrap.

## Next product checkpoint

After PR #16 is manually integrated:

1. create `phase2/cp6-impact-giving` from the updated `build/festival-mvp`;
2. open one bounded CP6 PR for Issue #14;
3. move the `<!-- ai-active-build-pr -->` marker to that PR;
4. set the handoff to `IN_PROGRESS`, owner decision `NO`, safe to continue `YES`, accepted SHA `NONE`;
5. implement CP6 provider-agnostic impact/reputation/giving foundations;
6. stop before provider-dependent production money movement.

## Operating model

Use `docs/DEV-LOOP-V2.md` as the current development process.

Key rules:

- one Issue → one short branch → one bounded PR → acceptance → merge;
- GitHub Actions/scripts own deterministic work;
- AI credits are reserved for implementation/reasoning;
- Database QA runs during relevant DB implementation changes;
- Persona and Hosted browser QA run at the acceptance boundary only when the classifier requires them;
- Merge Gate validates evidence;
- AI Ops status is one native Issue #12 record;
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
