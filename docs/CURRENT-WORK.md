# Current ShelterPawtners Work

## Current phase

Phase 1 — Platform + Data Foundation is engineering-complete and is the approved foundation baseline.

Phase 2 — Partner Marketplace MVP is the next phase, but implementation remains inactive until it is explicitly activated after the documentation and execution-plan review.

## Authoritative phase structure

The five-phase structure is frozen:

1. Platform + Data Foundation
2. Partner Marketplace MVP
3. Guardian + Shelter Passport MVP
4. Impact + Giving + Financial Intelligence
5. Integrations + Marketplace + Production Launch

The authoritative future-phase specifications are:

- `docs/phases/PHASE-2.md`
- `docs/phases/PHASE-3.md`
- `docs/phases/PHASE-4.md`
- `docs/phases/PHASE-5.md`

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

Reconcile canonical project knowledge and prepare the Phase 2 execution plan without beginning Phase 2 implementation.

Before activation, review the approved Phase 2 specification against the user-approved Partner Marketplace decision baseline in `docs/DECISION-LOG.md`, identify any remaining material OPEN DECISION items, and break implementation into small Codex checkpoints with QA gates.

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

- Do not begin Phase 2 until it is explicitly activated.
- Preserve valid existing work and project knowledge.
- Do not inherit architecture from Core or RaveShelter merely because it existed previously.
- Record meaningful approved or autonomous decisions in `docs/DECISION-LOG.md` with their authority and status.
- Test, fix, commit, and push at meaningful checkpoints so work remains recoverable and reviewable.
