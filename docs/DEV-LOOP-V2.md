# LostPaws Dev Loop v2

## Purpose

Dev Loop v2 is the operating model for fast, cost-controlled MVP delivery after the Phase 2 CP1–5 integration merge.

The design goal is simple:

> Use deterministic native automation for repeatable work and reserve AI credits/tokens for implementation, diagnosis, architecture, and judgment.

GitHub remains the control plane. Supabase remains the backend. Vercel remains the hosted QA surface. No additional CI/CD, monitoring, database, or paid orchestration platform is introduced.

## Delivery unit

The default unit of work is:

`GitHub Issue → short-lived branch → one bounded PR → deterministic acceptance → merge → fresh branch`

Rules:

- One primary coding agent per bounded checkpoint by default.
- Do not run multiple substantial coding agents against the same code path.
- Open checkpoint PRs as draft during implementation when practical.
- Exactly one open PR targeting `build/festival-mvp` carries `<!-- ai-active-build-pr -->`.
- Do not accumulate unrelated checkpoints in one PR.
- PRs over roughly 25 changed files or 1,200 changed lines receive a native advisory to consider splitting future unrelated scope.

## Control plane

### Native / zero-AI work

GitHub Actions and repository scripts own:

- change-impact classification;
- formatting/lint;
- unit tests;
- TypeScript/build;
- Supabase migration replay;
- pgTAP/RLS tests;
- Persona Playwright acceptance;
- Hosted Playwright acceptance;
- dependency review;
- PR-size advisory;
- merge evidence validation;
- single-record AI Ops status;
- stale detection.

### AI work

Use AI only where reasoning materially helps:

- bounded feature/checkpoint implementation;
- non-obvious defect diagnosis;
- architecture/product/security reasoning;
- semantic acceptance review when warranted;
- RED decisions with the owner.

Do not spend AI credits on polling, formatting, test reruns, routine green status, dependency checks, or scheduler behavior.

## Change-impact classifier

`scripts/classify-change-impact.sh` is the canonical risk classifier.

It compares the PR base and head and emits risk and requirement flags for docs, web/shared app, database/persona, E2E, workflows, dependencies, deployment, and unknown paths.

Unknown paths fall back conservatively to broader testing.

Workflows consume this classifier rather than each maintaining separate path rules.

## Test tiers

### Tier 1 — implementation loop

Runs on ordinary PR updates.

**CI**

- docs-only: documentation/instruction formatting only;
- web/workflow/dependency/E2E/shared changes: formatting, unit tests, production build.

**Database QA**

For database/RLS/RPC/Supabase changes:

- start local Supabase;
- reset/replay migrations and seed;
- pgTAP/RLS tests.

No Chromium is required in this tier.

### Tier 2 — checkpoint acceptance

Triggered by `STATUS: READY_FOR_ACCEPTANCE`.

**Persona QA**

Runs only when the classifier marks persona-sensitive impact.

- fresh local Supabase reset/seed;
- Chromium;
- Guardian/persona/access/redemption Playwright.

Database pgTAP is not repeated here because Database QA owns that evidence.

**Hosted QA**

Runs only when product/browser impact requires it and the PR is the active build lane.

- verify the relevant Vercel QA deployment is Ready;
- run the hosted golden paths once at the acceptance boundary.

### Tier 3 — phase hardening

Issue #5 and similar broad sweeps cover cross-cutting browser/accessibility/security/RLS regression. These do not run after every checkpoint commit.

## Supabase CLI pin

`scripts/supabase-cli.sh` contains the single exact Supabase CLI version used by CI/local automation: `2.117.0`.

This centralizes an exact pin without adding the CLI's transitive dependency tree to the application lockfile. Workflows call the wrapper rather than repeating a versioned `npx` command.

## Acceptance and merge evidence

`docs/AI-HANDOFF.md` has a required top-level field: `ACCEPTED_CODE_SHA`.

Use `ACCEPTED_CODE_SHA: NONE` until checkpoint acceptance exists.

When a checkpoint reaches `COMPLETE`, record the exact code SHA that passed required acceptance.

The `Merge Gate` then:

1. classifies the full PR impact;
2. requires CI on the current PR head so later documentation/metadata changes stay valid;
3. verifies `ACCEPTED_CODE_SHA` is an ancestor of the current head;
4. requires Database QA on the accepted SHA when database impact exists;
5. requires the actual Persona browser job on the accepted SHA when persona impact exists;
6. requires the actual Hosted browser job on the accepted SHA when hosted impact exists;
7. requires dependency review when dependencies changed.

This prevents skipped heavy jobs from being mistaken for full acceptance and avoids rerunning browser suites because final handoff documentation changed.

## Pull request lifecycle

1. create Issue with scope/acceptance;
2. branch from current `build/festival-mvp`;
3. open a small draft PR;
4. mark exactly one PR with `<!-- ai-active-build-pr -->`;
5. set handoff `IN_PROGRESS`, owner `NO`, safe `YES`, accepted SHA `NONE`;
6. implement cohesive increments;
7. Tier 1 checks run by impact;
8. update handoff to `READY_FOR_ACCEPTANCE`;
9. applicable Tier 2 checks run;
10. fix real GREEN/YELLOW defects;
11. record accepted SHA and set `COMPLETE`;
12. Merge Gate validates evidence;
13. owner-approved merge;
14. create next checkpoint branch from updated integration base.

## AI execution routing

Use the lowest-cost capable execution surface.

- ChatGPT: product/architecture/controller/acceptance/RED decisions.
- Codex / ChatGPT Work: substantial code-centric implementation when included allowance is available.
- Copilot IDE completions: small human-driven edits/boilerplate.
- Copilot coding agent: bounded fallback implementation when needed; never an automatic scheduler.
- Claude Code: optional alternate engineer or independent semantic review when explicitly invoked.
- GitHub Actions: all deterministic automation.

Do not ask multiple AI systems to independently solve the same ordinary implementation task.

## AI review policy

- Automatic Copilot PR review is disabled.
- No AI review for docs-only, formatting-only, routine lockfile, or trivial workflow changes.
- Default maximum: one semantic AI review near checkpoint acceptance when material.
- A second review is justified only after material code/security changes caused by the first review.
- Phase-level hardening may receive a broader review.

## AI Ops status

Issue #12 is the single native operational status source.

`scripts/update-ai-ops-status.sh` updates one comment containing overall state, phase/checkpoint, active PR/branch/head, handoff state, last commit age, latest deterministic workflow status, and next expected action.

The comment is updated in place rather than creating repeated status comments or status commits.

The state is inferred only from observable GitHub signals. It must not claim an AI process is literally running unless the platform exposes that fact.

## Event-driven supervision and watchdog

Workflow completion and PR events update status immediately.

The stale watchdog runs **once per hour**.

A stale signal never launches a coding agent automatically. It only records the state so the next intentional engineering/controller session can act.

## Dependency maintenance

Dependabot runs weekly with grouped PRs for frontend core, test tooling, Supabase client, styling, and GitHub Actions.

Dependency-changing PRs run GitHub's native Dependency Review and fail on newly introduced high-severity vulnerabilities.

## Vercel

The configured Ignored Build Step uses `scripts/vercel-ignore-build.sh`, which delegates to the canonical classifier.

It skips deployments when the commit cannot affect the deployed web artifact.

Vercel `repository_dispatch` deployment events are a future optional improvement; they are not required to start CP6.

## Cost guardrails

- Standard GitHub-hosted runners only.
- No paid/larger runner without owner approval.
- No new monitoring/testing/orchestration SaaS while native tools are sufficient.
- No automatic coding-agent invocation.
- No automatic AI review.
- No full browser suite on every implementation commit.
- No giant long-lived checkpoint PRs.
- No status commits every few minutes.
- No repeated duplicated path logic when the classifier can decide deterministically.

## Known owner gates

- `OD-003`: customer-facing verified-savings evidence/calculation rules.
- `OD-004`: production charitable-money movement/provider selection/settlement/integration.
- production/DNS/paid infrastructure/destructive actions.
- Phase 3 authorization.
