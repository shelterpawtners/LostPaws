# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Phase 3 — Guardian + Shelter Passport MVP
CURRENT_CHECKPOINT: Issue #34 — Guardian Passport foundation
NEXT_CHECKPOINT: Continue Phase 3 vertical slices after CP1 acceptance
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE

## Active task

Issue #34 — **Phase 3 CP1: Guardian Passport foundation**

Branch: `phase3/passport-foundation`

PR: not yet created

## Owner authorization

On 2026-09-10 the owner explicitly authorized autonomous continuation through the remaining MVP work, including:

- merge PR #33 when required checks were green;
- free-tier transactional email setup and `auth.shelterpawtners.com` sending-domain configuration;
- Supabase Auth Site URL, redirect, SMTP, confirmation/recovery, and leaked-password-protection configuration where appropriate;
- safe external signup/email validation;
- Phase 3 implementation;
- non-destructive code, database, test, documentation, UI, and QA improvements without routine approval.

PR #33 was merged to `main` at `a05e9b21a6a65da51b4c258e6924ca8ac27dfa63` after all required acceptance lanes were confirmed green.

## Current Phase 3 slice

Implement the first bounded vertical slice from `docs/phases/PHASE-3.md`:

- Guardian dashboard foundation;
- create/edit/list pet using the canonical pet model;
- Passport navigation and same-record Passport presentation;
- private-by-default Passport visibility foundation;
- durable opaque public/emergency identifier foundation without private data exposure;
- provenance preservation;
- RLS regression proving Guardian A cannot read Guardian B private Passport data;
- mobile-first critical path validation.

Do not create a duplicate Passport/pet datastore.

## Guardrails still in force

- no paid services/upgrades without approval;
- no destructive production-data changes;
- no Microsoft 365 mail DNS changes;
- no OD-004 production money movement/settlement decision;
- no invented OD-003 customer-facing verified-savings rules;
- do not publish final Terms or Privacy Notice without owner review;
- do not perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover;
- do not weaken tests or RLS.

Terms and Privacy drafts may be prepared for review. Main-domain cutover may be fully prepared but must stop before the final routing change.

## External setup

Transactional email, DNS, and Supabase Auth production configuration are authorized, but if an external account/credential or connector capability is unavailable, continue all independent engineering work and document the exact remaining external action rather than blocking Phase 3.

## Completion contract

Before CP1 completion, run deterministic validation according to change impact, update this handoff and `docs/CURRENT-WORK.md`, record the accepted code SHA, and create the bounded PR to `main`.