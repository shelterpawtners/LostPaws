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

### Checkpoint 2 — Partner Profile + Public Directory

**Status: ACCEPTED.**

Accepted capabilities include:

- full authenticated Partner profile editing;
- public/private contact separation;
- categories and species served;
- business model and service-area/nationwide/online support;
- booking/order links, social links, and business hours;
- server-side minimum-safe publication validation;
- publish and unpublish behavior;
- moderation-state foundations;
- public directory filters for category, city, state, service model, and species;
- durable public Partner profile rendering;
- explicit public-data allowlisting;
- committed Checkpoint 2 pgTAP RLS/security tests;
- maintainability extraction for shared Partner profile presentation/validation helpers.

Independent connected-Supabase verification confirmed anonymous users cannot read private Partner contacts and unpublished profiles are hidden from the public profile-details RPC.

Environment validation debt remains: clean local Supabase reset/pgTAP replay and authenticated Playwright runs should be completed when Docker/local test credentials are available and no later than Phase 2 final hardening.

### Checkpoint 3 — Offer Engine

**Status: COMPLETE.** See `docs/PHASE-2-CHECKPOINT-3-PROGRESS.md`.

### Checkpoint 4 — Claim + QR/Code Redemption

**Status: READY FOR REQUIRED USER UX REVIEW.**

The local flow supports exact-version Guardian claims, opaque PII-free codes, Partner deep-link/manual validation, one-action utilization confirmation, replay prevention, and reversal history. See `docs/PHASE-2-CHECKPOINT-4-PROGRESS.md`.

Checkpoint 5 must not begin until the redemption UX is reviewed and approval is recorded.

### Shared QA preview

GitHub Issue #6 adds branch-scoped Vercel Preview configuration, SPA refresh routing, deterministic shared-dev seeding guidance, and hosted Playwright smoke/audit entry points. The preview is limited to `shelterpawtners-dev`; production hosting, DNS, Supabase, and credentials remain untouched. See `docs/HOSTED-QA.md`.

## MVP execution strategy

The active execution model is **vertical-slice MVP delivery with strategic testing**.

While the product is still being assembled, target effort is approximately:

- 65–70% critical MVP feature/tent-pole delivery;
- 20–25% automated foundation and golden-path regression testing;
- 5–10% human UX acceptance;
- minimal cosmetic polish until the core flows are connected.

For each business-critical vertical slice:

1. build the usable end-to-end path;
2. protect it with one strong golden-path Playwright regression plus essential RLS/security checks;
3. fix blockers immediately;
4. defer broad permutations/cosmetic automation until later;
5. move to the next tent pole.

The broad Issue #5 full-site audit is intentionally deferred until the major MVP vertical slices connect.

### Current strategic sequence

1. Keep Admin QA functional enough to support testing; do not over-polish the tool.
2. Finish/stabilize the active Partner Marketplace golden path with focused support/moderation visibility and targeted regression.
3. Build a small private Guardian profile-lite vertical slice.
4. Continue Pet/Guardian foundation work only within the approved phase boundary.
5. Defer adoption verification, shelter-created Passport transfer/handoff, and other Phase 3 work until explicitly authorized.

Issue #9 completed the MVP profile/data-model review and found no immediate schema migration necessary. The review identified future policy/design work around co-guardians, adoption evidence/disputes, shelter responder linking, and public Shelter profile fields.

## Repo-native AI coordination

GitHub is the shared coordination layer between ChatGPT, Codex, Copilot, CI, and the product owner.

Authoritative coordination files:

- `docs/CURRENT-WORK.md` — phase, priorities, active execution strategy;
- `docs/AI-HANDOFF.md` — latest concise agent-to-agent baton;
- `docs/AI-OPERATING-PROTOCOL.md` — required agent workflow and completion contract;
- `docs/DECISION-LOG.md` — durable decisions.

### Required handoff behavior

Every meaningful Codex/agent task must:

1. start from the relevant GitHub Issue and current repository state;
2. read `docs/AI-HANDOFF.md` and `docs/AI-OPERATING-PROTOCOL.md`;
3. implement/test/commit/push on the assigned branch;
4. update the relevant Issue/PR;
5. update `docs/AI-HANDOFF.md` before declaring completion.

The handoff must contain the final remote SHA, changes made, tests/results, CI/hosted QA state, open defects, decisions needed, deferred items, and recommended next action.

The normal human trigger back to ChatGPT is simply: **“check the GitHub handoff.”** Large Codex completion reports should no longer need to be copied between tools.

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
