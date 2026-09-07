# Current ShelterPawtners Work

## Current phase

Phase 1 — Platform + Data Foundation is engineering-complete and is the approved foundation baseline.

Phase 2 — Partner Marketplace MVP is now **active**. The user explicitly authorized moving forward after reviewing and approving the canonical Phase 2 business baseline and requested that routine work be automated as much as possible.

## Authoritative phase structure

The five-phase structure is frozen:

1. Platform + Data Foundation
2. Partner Marketplace MVP
3. Guardian + Shelter Passport MVP
4. Impact + Giving + Financial Intelligence
5. Integrations + Marketplace + Production Launch

The authoritative phase specifications are:

- Phase 1: `docs/PHASE-1-EXECUTION.md` and `docs/PHASE-1-PROGRESS.md`
- Phase 2: `docs/phases/PHASE-2.md`
- Phase 3: `docs/phases/PHASE-3.md`
- Phase 4: `docs/phases/PHASE-4.md`
- Phase 5: `docs/phases/PHASE-5.md`

The bounded Phase 2 execution sequence is defined in `docs/PHASE-2-EXECUTION-PLAN.md`.

Older roadmap phase numbering or festival-MVP sequencing does not override this structure. Useful older requirements may be preserved as research, acceptance criteria, or backlog items, but they do not become active MVP requirements unless explicitly re-approved.

## Phase 1 final state

Phase 1 engineering validation is complete for the current foundation:

- two clean local database resets reproduced the committed schema and seed state;
- both post-reset pgTAP runs passed all 9 RLS/append-only assertions;
- Playwright passed all 8 Phase 1 E2E/accessibility checks;
- `npm run check` passed;
- `npm run build` passed;
- responsive and accessibility validation passed across the documented local browser widths;
- the validated branch state is `build/festival-mvp`.

A cloud/sandbox environment being unable to run Docker, `supabase db reset`, or a browser preview is an environment limitation and is not a product blocker when stronger completed local validation already covers the same gate.

## Current objective

Phase 2 Checkpoint 1 — Partner Organization Foundation has completed its required QA review and is awaiting product acceptance. Its evidence ledgers are `docs/PHASE-2-CHECKPOINT-1-PROGRESS.md` and `docs/PHASE-2-CHECKPOINT-1-QA.md`.

Do not activate or implement Checkpoint 2 until Checkpoint 1 is reviewed and accepted. Checkpoint 1 covers Partner onboarding entry, entry-first organization discovery, secure membership/claim requests, organization creation, multi-location businesses, corporate parent/child structures, independent franchises/brand relationships, duplicate handling foundations, RLS, and auditability.

Do not jump ahead into Partner profiles, offers, redemption, verified savings, or giving except for minimal supporting scaffolding required by Checkpoint 1.

## User-involvement policy

Automate routine engineering, QA, documentation, and implementation decisions. Escalate to the user only when a decision materially affects:

- business promises or marketplace rules;
- legal, charitable, or tax meaning;
- financial calculations or customer-facing verified totals;
- privacy/security boundaries;
- organization ownership/control where policy cannot be safely deferred;
- destructive data operations;
- paid service activation or credentials;
- critical UX with materially different business outcomes;
- production deployment, DNS, or infrastructure.

Expected planned user checkpoints are:

1. working redemption UX review during Checkpoint 4;
2. verified-savings rule approval during Checkpoint 5;
3. giving-provider selection during Checkpoint 6;
4. final Phase 2 acceptance before Phase 3.

## Operating model

- GitHub is the source of truth and control plane.
- Codex is the primary engineer.
- Copilot is QA and a bounded engineer.
- ChatGPT Project owns business decisions, UX, schemas, phase planning, review, financial rules, and execution prompts.
- Make is on hold and is not part of the current architecture.
- Newer explicit user decisions supersede older project choices.
- Implemented repository architecture supersedes stale planning notes.
- Ambiguous material product, legal, financial, privacy, security, or architectural matters are marked `OPEN DECISION` rather than invented.

## Handoff rules

- Preserve valid existing work and project knowledge.
- Do not inherit architecture from Core or RaveShelter merely because it existed previously.
- Record meaningful approved or autonomous decisions in `docs/DECISION-LOG.md` with their authority and status.
- Test, fix, commit, and push at meaningful checkpoints so work remains recoverable and reviewable.
- Do not begin Phase 3 until Phase 2 is completed and explicitly approved.
