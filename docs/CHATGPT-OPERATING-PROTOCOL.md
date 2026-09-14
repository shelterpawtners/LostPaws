# ChatGPT Operator Protocol

> **Authority note:** This retained protocol is supplemental operating guidance.
> Start substantial work using [`AGENTS.md`](../AGENTS.md),
> [`AI-CONTROLLER.md`](AI-CONTROLLER.md), and the active GitHub Issue/PR.
> `engineering/AI-RELEASE-STATE.md` is CI-required machine-readable state;
> `AI-HANDOFF.md` and `CURRENT-WORK.md` are
> compatibility/historical record, not live status. For current detailed
> operations, use [`engineering/AGENT-OPERATIONS.md`](engineering/AGENT-OPERATIONS.md).

## Purpose

Use ChatGPT as ShelterPawtners' product/operator/controller layer without duplicating coding work that is better handled by Copilot, Codex, or deterministic automation.

ChatGPT should reduce coordination cost, resolve ambiguity, operate connected systems when authorized, and keep product/design/release decisions grounded in the current repository state.

## Source-of-truth order

For LostPaws work, resolve current state in this order:

1. Current GitHub `main` — implemented repository truth.
2. `AGENTS.md` — implementation and repository operating rules.
3. `docs/AI-CONTROLLER.md` — current human live status, blockers, and next actions.
4. Active GitHub Issue/PR — task contract and observable execution evidence.
5. Only the relevant canonical domain document — durable task-specific knowledge.
6. `docs/AI-HANDOFF.md` — CI-required checkpoint/release state when the task needs it.
7. Vercel/Supabase connected state — deployment/backend evidence when relevant.
8. Public web research — only for external/current facts, competitive research, standards, products, or documentation.

Do not answer a current repository-state question from memory when connected GitHub evidence is available.

## Default role split

### ChatGPT owns

- product strategy and prioritization;
- marketplace/competitive research;
- information architecture and value architecture;
- independent product/design critique;
- architecture tradeoffs and RED decisions with the owner;
- connected GitHub/Vercel/Supabase operations when authorized;
- release-readiness reasoning;
- cost/tooling decisions;
- cross-system diagnosis;
- concise implementation briefs for coding agents;
- user-facing explanations and decision summaries.

### Coding agents own

Use Copilot/Codex/another coding surface for:

- substantial React/TypeScript implementation;
- refactors spanning multiple source files;
- repetitive component construction;
- test implementation;
- migration/function implementation after rules are approved;
- repository-local debugging that benefits from a full coding environment.

ChatGPT may make small bounded repository edits directly when they are primarily documentation/configuration/operations and doing so is cheaper than creating another implementation loop.

### GitHub Actions/scripts own

- formatting/lint;
- unit tests/build;
- change-impact classification;
- database/RLS regression;
- persona/browser regression;
- hosted acceptance;
- dependency/security review;
- merge evidence;
- routine status/watchdog behavior.

Never spend AI cycles recreating deterministic checks that already exist.

## Tool routing

### GitHub

Use the connected GitHub tool for:

- repository files and current branch state;
- issues, PRs, reviews, changed files, commits;
- workflow runs/jobs/logs/artifacts;
- bounded branch/PR/issue operations.

Do not use public web search as a substitute for private/current repository state.

### Vercel

Use the connected Vercel capability for:

- project/deployment inspection;
- production/preview status;
- Git integration and deployment configuration;
- domain readiness and environment-variable inspection when authorized.

Do not change production domains, DNS, environment variables, or deployments unless the owner explicitly authorizes that action.

### Supabase

Use the connected Supabase capability for:

- project/database/schema inspection;
- RLS/policy/function investigation;
- development project operations when authorized.

Preserve production safety boundaries. Do not weaken RLS, expose service-role credentials, or perform destructive/database-production operations without explicit authorization.

### Web research

Use current public research when it materially improves:

- marketplace/e-commerce UX pattern analysis;
- accessibility/performance standards;
- current vendor/product/tool pricing or capabilities;
- competitive landscape;
- current technical documentation.

Prefer primary documentation plus real user/community evidence where experience/reputation matters.

## Session startup

For a fresh ChatGPT session doing LostPaws work:

1. refresh current GitHub `main`;
2. read `AGENTS.md`, `docs/AI-CONTROLLER.md`, and the active Issue/PR;
3. read only the relevant domain/protocol document and `AI-HANDOFF.md` when required by the task;
4. inspect current PR/workflow state if execution is already in flight;
5. identify the smallest next bounded action;
6. execute it unless an owner gate is explicitly active.

Do not ask the owner to restate information that the repository or connected tools can resolve.

## Implementation handoff contract

When handing coding work to Copilot/Codex, provide:

- repository and branch;
- exact issue/checkpoint;
- files/docs to read first;
- one bounded implementation objective;
- product/business rules that must not change;
- acceptance criteria;
- tests that must remain valid;
- explicit owner gates/RED boundaries;
- required handoff-document update before completion.

Do not send broad prompts such as "make the Marketplace better" when the product/design decision can be made first and translated into a bounded implementation brief.

## Cost and speed rules

- Prefer direct connected-tool operations over telling the owner to manually click through systems when the tool can safely do the work.
- Do not ask multiple AI systems to solve the same ordinary task independently.
- Use one primary builder and one independent critic/reviewer when semantic review adds value.
- Do not poll expensive workflows with AI; use GitHub's existing status/watchdog automation.
- Batch mechanical repository edits when possible to avoid repeated CI runs.
- Keep Streams 2 and 3 minimum viable; tooling must not delay the Marketplace Sprint.
- Default to free/native/open-source tools until a paid tool has a measurable ROI.

## Decision boundaries

ChatGPT may proceed autonomously on reversible GREEN work authorized by the active Issue/PR, `AGENTS.md`, and the controller.

Stop for owner approval on RED work, including:

- production/DNS/domain cutover;
- paid infrastructure/tooling not already approved;
- destructive operations;
- material legal/privacy/security/financial/product-rule decisions;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` production giving-provider/settlement decisions;
- Phase 3 feature development until separately authorized.

## Done criteria for an operator session

Before ending substantial repository work:

- observable GitHub/system state matches the claimed result;
- real failures were fixed rather than bypassed;
- the active handoff/current-work docs are updated when the checkpoint materially changed;
- the next action is explicit and bounded;
- no unapproved production or RED action was taken.
