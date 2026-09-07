# Phase 2 Continuous Execution Prompt

Use this prompt from VS Code/Codex to reduce manual handoffs while preserving ShelterPawtners product and safety gates.

Repository: `shelterpawtners/LostPaws`
Branch: `build/festival-mvp`

Read and follow:
- `AGENTS.md`
- `.agents/skills/shelterpawtners/SKILL.md`
- `docs/CURRENT-WORK.md`
- `docs/DECISION-LOG.md`
- `docs/PHASE-2-EXECUTION-PLAN.md`
- `docs/phases/PHASE-2.md`
- the active checkpoint prompt(s) under `docs/prompts/`

## Operating instruction

Continue Phase 2 autonomously from the current accepted remote state. Do not ask the user to mediate routine engineering, QA, refactoring, documentation, test, or implementation decisions.

Use local Docker, Supabase CLI, browser, Playwright, and the development Supabase project where available to clear validation debt that cloud Work environments could not run.

Commit and push recoverable milestones to `build/festival-mvp`.

Do not begin Phase 3.

## Remaining Phase 2 execution bundles

### Bundle A — Checkpoints 3 + 4: Marketplace Transaction Engine

Complete Checkpoint 3 (Offer Engine), perform its required QA, fix bounded defects, commit and push it, then continue directly into Checkpoint 4 (Claim + QR/Code Redemption) without waiting for user approval between the two unless a material business/security decision arises.

Checkpoint 3 must preserve:
- multiple offers per organization;
- create/edit/preview/publish/pause/archive/duplicate/expire;
- immutable/versioned offer history;
- shelter-pet-enhanced and all-pet eligibility;
- location/online applicability;
- default 30-day claim expiration with configurable bounded rules;
- quantity/user/pet/schedule/expiration rules;
- truthful classifications and no silent history rewrite.

Checkpoint 4 must preserve:
- Offer, Claim, and Redemption as distinct records/states;
- exact offer-version binding;
- opaque QR/code/token with no PII;
- partner scan plus manual fallback;
- concise validation before confirmation;
- minimal transaction inputs;
- one clear Confirm Utilization action;
- expiration/cancel/no-show/reversal/correction foundations;
- server-side validation and auditability;
- target UX of scan/open → validate → confirm.

### Required user gate after Bundle A

STOP after a working Checkpoint 4 redemption UX is implemented, locally tested, and pushed. Do not proceed to Checkpoint 5 until the user has reviewed the working redemption UX with ChatGPT Project and approval is recorded in the repository.

Return a concise handoff that says Checkpoint 4 is ready for redemption UX review and includes the remote SHA, local test results, and how to open the working flow.

### Bundle B — Checkpoints 5 + 6: Verified Value + Impact Foundation

After explicit approval to continue:

Complete Checkpoint 5 (Verified Savings + Customer Attribution). Implement the data model, provenance, evidence, reversals, first-known/returning relationship logic, and partner attestation foundations. Do not expose customer-facing verified savings totals until the user-approved verified-savings standard is recorded.

#### Required user gate inside Bundle B — verified savings

STOP before exposing verified totals or freezing the final verification standard. Present the implementation-ready rule options and current evidence model for ChatGPT Project/user approval. Resume only after the approved standard is recorded in the repository.

Then continue Checkpoint 5 to completion, test, commit, and push.

Proceed to Checkpoint 6 (Partner Impact + Reputation + Giving Foundation). Research and compare Pledge, Every.org, and any materially better currently viable provider options before provider-dependent implementation. Keep commitment/accrual/settled contribution states separate. Do not imply ShelterPawtners is a charity recipient. Do not implement production money movement without explicit approval.

#### Required user gate inside Bundle B — giving provider

STOP before selecting or integrating a production giving provider or moving money. Return the provider comparison and recommendation for ChatGPT Project/user approval. Resume only after the provider decision is recorded in the repository.

After approval, complete only the approved provider-agnostic or approved-provider foundation, test, commit, and push.

### Bundle C — Checkpoint 7: Dashboard + Admin + Exports + Hardening

Complete Checkpoint 7 after Checkpoints 5 and 6 are accepted.

Include:
- partner dashboard;
- admin controls;
- exports;
- demo isolation;
- documentation cleanup;
- RLS/security review;
- unit/integration/pgTAP/Playwright tests;
- mobile/accessibility review;
- build validation;
- migration replay;
- clearing deferred Checkpoint 1/2 clean-local validation debt;
- no fabricated metrics;
- no cross-org leaks;
- no Phase 3 implementation;
- no production/DNS changes.

STOP for final Phase 2 product acceptance after Checkpoint 7 is complete and pushed.

## Autonomous decision policy

Proceed without user interruption for normal technical choices. Escalate only when a decision materially changes:
- business promises or marketplace rules;
- legal/charitable/tax meaning;
- verified financial/savings definitions;
- privacy/security boundaries;
- organization ownership/control;
- destructive data handling;
- paid services/credentials;
- production infrastructure/DNS;
- redemption UX in a way that materially changes business behavior;
- giving-provider selection or money movement.

## Validation policy

Do not mark a checkpoint complete merely because cloud execution is unavailable. Since this prompt is intended for the local VS Code environment, use local Docker/Supabase/Playwright/browser capabilities where available and clear previously deferred validation debt.

Do not weaken tests or RLS to make validation pass.

## Completion behavior

At the end of each checkpoint, update evidence docs and commit/push a recoverable milestone, but continue automatically into the next checkpoint within the same bundle unless a required user gate above is reached.

Do not require the user to shuttle text between ChatGPT, GitHub, VS Code, and Codex for routine checkpoint transitions.
