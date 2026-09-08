# AI Cost and Testing Governance

## Purpose

Keep ShelterPawtners engineering fast and safe while minimizing AI-credit consumption, duplicated validation, unnecessary cloud-agent sessions, and avoidable human review effort.

This policy complements `docs/AUTONOMOUS-EXECUTION-POLICY.md` and the GitHub Actions orchestration workflows. It does not weaken product, security, RLS, data-integrity, or acceptance requirements.

## Core principle

Use deterministic native automation for repeatable work. Spend AI credits only where reasoning, implementation, diagnosis, or semantic review adds material value.

Prefer:

1. GitHub Actions / scripts for lint, typecheck, unit tests, builds, migration replay, pgTAP, Playwright, status checks, diff classification, deduplication, and stall detection.
2. One coding-agent session for one bounded checkpoint or defect cluster.
3. One semantic AI review only when the checkpoint is materially ready for acceptance or a security/business-rule change warrants it.
4. Human/product-owner input only for RED decisions or explicit phase gates.

## AI-credit rules

### Coding agents

- Do not start a new Copilot/Codex/Claude cloud-agent session merely because a routine CI or hosted-QA run succeeded.
- Keep the current agent working through GREEN/YELLOW defects inside the same bounded task instead of repeatedly re-prompting it.
- Re-engage an agent after failure only when the failure remains unresolved and there has been no meaningful newer activity for the configured stall window.
- Prefer one comprehensive task prompt that includes implementation, validation, defect fixing, handoff update, and completion contract over several small steering prompts.
- Do not use an AI agent for deterministic formatting, status polling, test reruns, branch/SHA checks, artifact upload, or other work that native tooling can perform.

### Copilot code review

- Do not request Copilot review on every commit or minor fix.
- Do not request Copilot review for docs-only, formatting-only, dependency-lock-only, or workflow-comment-only changes unless the change materially affects security or execution behavior.
- Default to at most one Copilot code review per checkpoint when the checkpoint is ready for acceptance.
- A second review is justified only when the first review caused material code/security changes that need an independent re-check.
- Final phase hardening may use one broader review after deterministic checks are green.

## Test tiers

### Tier 1 — implementation loop

Run on normal code PR commits where applicable:

- lint / formatting check;
- TypeScript typecheck;
- unit tests;
- production build.

These are deterministic and cheap. Do not replace them with AI review.

### Tier 2 — checkpoint acceptance

Run when the handoff is `READY_FOR_ACCEPTANCE` or equivalent:

- relevant hosted Playwright golden path;
- relevant database/RLS/pgTAP checks;
- targeted integration tests for the completed checkpoint;
- failure artifacts only when needed.

Do not run the full browser/database acceptance stack on every intermediate implementation commit unless a specific defect requires it.

### Tier 3 — phase/final hardening

Run at phase acceptance or when cross-cutting risk justifies it:

- broader Persona QA;
- broader browser/accessibility regression;
- security/RLS sweep;
- migration replay;
- exports/reporting consistency where applicable.

Broad full-site QA should not block every vertical slice.

## Change-aware testing

Selective tests are allowed when the mapping from changed code to affected behavior is deterministic and maintained. However, shared application files or cross-cutting database/security changes must fall back to the broader applicable suite.

Safe examples:

- docs-only changes: no app CI or browser QA;
- isolated test-file changes: run the affected test plus lightweight CI if code/config also changed;
- Supabase migrations/RLS/RPC changes: database/RLS tests are mandatory and affected browser flows should run at acceptance;
- shared routing/auth/profile/application-shell changes: run the broader relevant web regression rather than assuming one feature is isolated;
- package/workflow/config changes: run the checks affected by that configuration.

When confidence in impact mapping is low, choose the broader deterministic test rather than spend AI credits deciding whether to skip it.

## Workflow deduplication

- One canonical Hosted QA lane per PR/SHA. Avoid simultaneous push + pull-request copies of the same acceptance suite.
- Use `concurrency` with `cancel-in-progress` for obsolete CI/QA runs.
- Heavy hosted browser tests should be gated by handoff readiness, not every implementation commit.
- Persona QA remains a deliberate deterministic lower-level gate and should run only when schema/RLS/persona behavior changes or at planned hardening points.
- Upload failure artifacts only on failure and use short retention where supported.

## Orchestrator behavior

The supervisor may inspect state frequently using native GitHub APIs/Actions without spending AI credits. It should invoke an AI agent only when one of these is true:

1. a bounded authorized next checkpoint is ready to start and has not already been delegated;
2. a genuine failure remains unresolved after the stall window and no active/newer work is visible;
3. a semantic acceptance/review task materially benefits from AI reasoning.

A green workflow by itself is not a reason to create another AI session.

## Agent handoff requirements

Each bounded agent session should leave enough structured evidence that another AI call is not needed just to discover state:

- task / issue;
- branch and final SHA;
- files/areas changed;
- tests run and exact results;
- CI / hosted QA state;
- blocker classification;
- next action;
- `SAFE_TO_CONTINUE` and `OWNER_DECISION_REQUIRED`.

## Cost guardrails

- Keep standard GitHub-hosted runners; do not introduce paid larger runners without owner approval.
- Do not add a paid SaaS testing/observability provider while native GitHub/Vercel/Supabase capabilities are sufficient.
- Do not create additional Supabase projects/branches or paid Vercel infrastructure without owner approval.
- Prefer repository-native JSON/status artifacts and GitHub APIs for the AI Ops dashboard rather than a new monitoring service.
- Treat AI credits as a scarce reasoning budget, not as a scheduler or polling mechanism.

## Review cadence

Revisit this policy when:

- the repository becomes private;
- GitHub/Copilot billing changes materially;
- test duration becomes a real delivery bottleneck;
- the app is modular enough for reliable changed-component test selection;
- production deployment begins;
- a new coding agent/provider is added.
