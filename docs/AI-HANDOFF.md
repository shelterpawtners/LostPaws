# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Phase 3 — Lost Lands MVP
CURRENT_CHECKPOINT: LL-6 / Issue #46 — final regression, launch readiness, and owner-gated cutover prep
NEXT_CHECKPOINT: OWNER-GATED production cutover after external provider acceptance and explicit owner authorization
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: 031c69f77ef94b286f627910f73346aecc366942
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: MAIN

## Active task

Issue #46 — **LL-6: final regression, launch readiness, and owner-gated cutover prep**

Agent: ChatGPT / GitHub operator

Branch: `phase3/ll6-launch-readiness`

## Owner authorization

The owner has authorized autonomous continuation through the Lost Lands MVP and standing merge authorization for green engineering PRs until revoked. After a completed or externally blocked slice, immediately advance to the next authorized independent slice.

Protected gates remain: no paid upgrades, no destructive production-data changes, no Microsoft 365 mail DNS changes, no OD-003 customer-facing verified-savings rule invention, no OD-004 money movement/settlement decisions, no publication of final unreviewed Terms/Privacy, and no final `shelterpawtners.com` production web-domain DNS/custom-domain cutover.

## Completed launch slices

- LL-1 Guardian Digital Pet Passport merged via PR #37 at `0ae4b4d86f8f1083343d8e23357d64268ccce06c`.
- LL-2 Premium Marketplace merged via PR #42 at `08bd137ea79b951e540b3f0c2909a4ea5adc82fc`.
- LL-3 Shelter adoption verification merged via PR #43 at `33447725649cc91cfeb1e388b06092e086558321` after full required acceptance.
- LL-4 provider-independent production Auth/email readiness merged via PR #44 at `cdf827fc255bf446a9eb61bbb647ce7d1d03f2da` after CI, Hosted QA, Database QA, Persona QA, Dependency Review, and Merge Gate all passed. Live Resend SMTP, hosted Auth URL/provider configuration, and inbox click-through remain an external-console prerequisite documented in `docs/LL4-AUTH-EMAIL-READINESS.md`.
- LL-5 Meta social-auth capability prep merged via PR #45 at `031c69f77ef94b286f627910f73346aecc366942` after CI, Hosted QA, Database QA, Persona QA, Dependency Review, and Merge Gate all passed. Facebook is the truthful general Meta sign-in path; universal consumer Instagram login is not advertised. Live Facebook acceptance remains dependent on Meta/Supabase provider credentials.

## LL-6 objective

Run the full integrated Lost Lands MVP regression against the current main lineage; document mobile/browser/accessibility acceptance; prepare launch-readiness, rollback, legal-review drafts, and the main-domain cutover procedure; then stop before the protected final `shelterpawtners.com` production web-domain DNS/custom-domain change.

## Current external capability boundary

Live provider acceptance still requires external console/browser access not exposed by the current connectors:

1. Resend free-tier account/domain verification and SMTP credentials for `auth.shelterpawtners.com`.
2. Supabase hosted Auth Site URL, exact redirect allowlist, SMTP, email confirmation/recovery, Google provider, and Facebook provider settings.
3. Google OAuth credentials and live flow validation.
4. Meta developer app credentials and live Facebook flow validation.
5. Safe inbox click-through tests for confirmation and recovery.

Leaked-password protection is currently documented by Supabase as Pro-only; paid upgrades remain prohibited for this MVP.

## Next safe action

Complete Issue #46 as a bounded launch-readiness PR: add the exact cutover/rollback checklist and owner-review legal drafts, run all repository gates against the exact PR head, fix only evidenced defects without weakening tests/RLS, merge when green, and stop immediately before the final production web-domain DNS/custom-domain change. External provider-console actions should be recorded precisely but must not idle independent engineering work.
