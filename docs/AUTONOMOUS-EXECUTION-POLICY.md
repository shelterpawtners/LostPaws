# Autonomous Execution Policy

## Purpose

Allow ChatGPT, GitHub Copilot, Codex, Claude Code, and future coding agents to advance ShelterPawtners/LostPaws work with minimal product-owner interruption while preserving explicit business, security, legal, privacy, financial, phase, and production gates.

This policy applies only when an agent has been invoked for an authorized task. It governs how the agent should behave during that task; it does not itself start or schedule a new agent session.

## Core rule

Continue working through ordinary implementation, debugging, validation, and in-scope follow-on blockers without asking the product owner for routine approval.

When a decision is reversible and does not materially alter approved product behavior, make a reasonable provisional choice, document it, and continue.

Stop only when a RED decision, an explicit phase gate, or a genuine technical/environment blocker prevents safe progress.

## Decision classes

### GREEN — decide and continue

Agents are authorized to make these decisions autonomously when they remain inside the active Issue, approved roadmap, architecture, and security requirements:

- implementation details and code structure;
- component decomposition and reusable helpers;
- naming of internal functions, variables, files, and tests;
- query composition and ordinary database access patterns that preserve RLS and approved data ownership;
- bug fixes and regression fixes;
- deterministic seed/test setup;
- loading, error, empty, retry, and ordinary failure states;
- accessibility improvements;
- ordinary performance improvements;
- refactoring that preserves behavior;
- test organization and additional regression coverage;
- small documentation corrections required by implemented behavior;
- choosing among equivalent low-risk libraries already in the approved stack when no new paid service or major dependency is introduced.

Do not stop for a GREEN decision. Implement it, validate it, and record a meaningful autonomous decision in `docs/DECISION-LOG.md` only when it has durable architectural, product, security, sequencing, or operational consequences.

### YELLOW — provisionalize and continue

When the product owner's preference may matter later but the decision is reversible and does not create material legal, privacy, security, financial, production, or business-model risk, choose a conservative provisional value and continue.

Typical YELLOW decisions include:

- exact non-final UI copy;
- optional labels and helper text;
- default sorting or ordering;
- minor workflow ordering that does not change permissions or contractual behavior;
- placeholder public-profile descriptions in QA;
- demo marketplace content;
- temporary non-financial thresholds used only in development/QA;
- non-critical notification copy;
- visual defaults within the approved design system;
- optional profile fields whose presence does not change authorization, eligibility, verification, or money flows.

For every YELLOW decision:

1. use the safest reversible assumption;
2. clearly mark demo/sample data as demo or QA data;
3. add or update an entry in `docs/OWNER-DECISION-BACKLOG.md`;
4. include the decision ID in the handoff when relevant;
5. continue the task without waiting for product-owner approval.

Never use a provisional decision to fabricate a real partnership, testimonial, discount, statistic, medical fact, legal claim, affiliation, donation, tax result, or other production-facing factual claim.

### RED — stop and request product-owner decision

Agents must stop before implementing a material decision involving any of the following unless the decision is already explicitly resolved in authoritative repository documentation:

- material product behavior or business-model change;
- legal entity, contract, regulatory, tax, or compliance position;
- privacy policy or data-sharing policy;
- material change to who may access, control, transfer, or disclose another user's data;
- material security posture or weakening of an existing security control;
- real payments, donations, tax reporting, financial settlement, or irreversible financial history behavior;
- production infrastructure, production Supabase, production DNS, or replacement of the public live site;
- creation of paid infrastructure or a new paid vendor commitment;
- destructive or irreversible production data migration/deletion;
- entering a phase or checkpoint that is explicitly gated by product-owner authorization;
- a material contradiction between authoritative product documents that cannot be resolved without choosing new product behavior.

When blocked by a RED decision, complete all safely separable work first, add the decision to `docs/OWNER-DECISION-BACKLOG.md` as `BLOCKING`, update `docs/AI-HANDOFF.md`, and stop at the narrowest possible boundary.

## Current phase authorization gate

Jim explicitly authorized autonomous completion of the remainder of Phase 2 on 2026-09-08.

Therefore:

- Phase 2 Checkpoint 5 and subsequent remaining Phase 2 checkpoints are authorized to proceed checkpoint-to-checkpoint after required acceptance evidence passes.
- Agents do not need a separate routine owner approval to enter Checkpoint 5.
- Material RED decisions encountered inside Phase 2 remain blocking and must be escalated.
- Do **not** begin Phase 3 without a new explicit product-owner authorization.

Within the authorized Phase 2 range, agents should continue autonomously through implementation, bug fixing, validation, and acceptance preparation.

## Placeholder and demo-data policy

Development, QA, tests, and seeded demo accounts may use clearly labeled fictional/sample data so engineering progress is not blocked by final content decisions.

Allowed examples include:

- `Demo Shelter`;
- `Demo Partner`;
- `Demo Pet`;
- `QA Partner profile for marketplace testing`;
- clearly fictional QA offers or discounts.

Requirements:

- demo data must be distinguishable from real providers/customers;
- do not imply a real entity is a ShelterPawtners partner;
- do not surface fictional claims as production facts;
- do not use real personal data when deterministic test data is sufficient;
- keep demo-data isolation and RLS protections intact.

## Autonomous execution loop

For every invoked coding task:

1. Read `AGENTS.md`.
2. Read `docs/CURRENT-WORK.md`.
3. Read `docs/AI-OPERATING-PROTOCOL.md`.
4. Read `docs/AUTONOMOUS-EXECUTION-POLICY.md`.
5. Read `docs/AI-HANDOFF.md`.
6. Read the active GitHub Issue/PR and relevant authoritative product/architecture/security docs.
7. Confirm the active branch and preserve newer remote work.
8. Implement the current authorized objective.
9. Run the strongest relevant available tests/checks.
10. Classify failures as application defect, test defect, environment/configuration defect, or owner decision.
11. Fix GREEN/YELLOW in-scope defects autonomously and rerun validation.
12. Continue through related in-scope blockers until the task's acceptance criteria are met or a RED/hard blocker is reached.
13. Update `docs/OWNER-DECISION-BACKLOG.md` for unresolved YELLOW/RED decisions.
14. Update `docs/AI-HANDOFF.md` before declaring completion or blockage.
15. Do not merge unless explicitly authorized.

## Handoff status contract

When updating `docs/AI-HANDOFF.md`, maintain a compact status block near the top using these fields:

```text
STATUS: IN_PROGRESS | BLOCKED | READY_FOR_ACCEPTANCE | COMPLETE
CURRENT_PHASE: <phase>
CURRENT_CHECKPOINT: <checkpoint or issue>
NEXT_CHECKPOINT: <next authorized checkpoint or NONE>
OWNER_DECISION_REQUIRED: YES | NO
SAFE_TO_CONTINUE: YES | NO
```

Definitions:

- `IN_PROGRESS`: implementation is still underway.
- `BLOCKED`: a RED decision or hard technical/environment blocker prevents safe continuation.
- `READY_FOR_ACCEPTANCE`: implementation is complete and awaits the required acceptance gate/review.
- `COMPLETE`: the applicable acceptance gate has passed and no further work remains in the authorized task.
- `SAFE_TO_CONTINUE: YES` means the next listed action is already authorized and does not cross an explicit phase/checkpoint gate.

## Acceptance and progression

Passing compilation alone is not acceptance.

Use the repository's vertical-slice testing strategy:

- fast CI during implementation;
- targeted golden-path regression for the completed slice;
- relevant RLS/security checks;
- hosted/manual acceptance where configured and warranted;
- broader full-site audit only at the planned maturity point.

An agent may continue fixing failures exposed by the current authorized acceptance path when those failures are within scope. It must not broaden the task into Phase 3 merely because the current tests pass.

## Conflict resolution

Source-of-truth priority remains:

1. explicit current product-owner instruction;
2. active GitHub Issue/task contract;
3. authoritative repository product/security/architecture documents;
4. repository code and migrations;
5. PR + CI evidence;
6. `docs/AI-HANDOFF.md`;
7. provisional entries in `docs/OWNER-DECISION-BACKLOG.md`.

A provisional decision never overrides an approved durable decision.
