# Current ShelterPawtners Work

## Current phase

Phase 1 — Platform + Data Foundation is engineering-complete and is the approved foundation baseline.

Phase 2 — Partner Marketplace MVP is **active**.

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

Older roadmap phase numbering or festival-MVP sequencing does not override this structure.

## Phase 1 final state

Phase 1 engineering validation is complete for the current foundation. See `docs/PHASE-1-PROGRESS.md` for evidence.

## Phase 2 checkpoint status

### Checkpoint 1 — Partner Organization Foundation

**Status: ACCEPTED.**

Evidence: `docs/PHASE-2-CHECKPOINT-1-PROGRESS.md` and `docs/PHASE-2-CHECKPOINT-1-QA.md`.

Accepted capabilities include entry-first assisted organization matching, private drafts, safe access/claim review requests, atomic organization creation, multi-location support, corporate hierarchy, independent franchise/brand relationships without inherited control, duplicate-review/audit foundations, and RLS/authorization protections.

The remaining clean-local pgTAP and authenticated Playwright reruns are validation debt, not current product blockers, and must be cleared no later than Phase 2 final hardening.

### Checkpoint 2 — Partner Profile + Public Directory

**Status: engineering-complete pending product/QA acceptance.**

Current objective:

- Partner public/private profile model and UX are implemented, including categories, species served, business model, locations/service areas, online/nationwide participation, booking/order URLs, social links, hours, and profile completion;
- server-side minimum safe publication and unpublish behavior are implemented;
- monitored self-publication with moderation/suspension/removal foundations and durable public Partner profile/directory experiences are implemented;
- preserve Michigan/Metro Detroit go-to-market emphasis without restricting nationwide/online participation;
- preserve strong separation between public profile fields and private operational contacts;
- refactor the large Partner onboarding component/API boundary as needed before materially expanding Partner UI.

Do not begin Checkpoint 3 offer implementation except minimal scaffolding needed to display whether an organization has active offers.

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
- Test, fix, commit, and push at meaningful checkpoints.
- Do not begin Phase 3 until Phase 2 is completed and explicitly approved.
