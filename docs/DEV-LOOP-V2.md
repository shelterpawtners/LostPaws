# LostPaws Dev Loop v2

## Purpose

Dev Loop v2 is the operating model for fast, cost-controlled ShelterPawtners MVP delivery and design hardening.

The design goal is simple:

> Use deterministic native automation for repeatable work and reserve AI credits/tokens for implementation, diagnosis, architecture, product/design judgment, and semantic review.

GitHub remains the control plane. Supabase remains the backend. Vercel remains the hosted preview/production platform. No additional paid CI/CD, monitoring, database, or orchestration platform is introduced without a demonstrated need and owner approval.

## Canonical branch model

`main` is the canonical integration branch and Vercel Production Branch.

The default unit of new work is:

`GitHub Issue -> short-lived branch from main -> one bounded PR to main -> deterministic acceptance -> owner-approved merge -> fresh branch`

Rules:

- One primary coding agent per bounded implementation slice by default.
- Do not run multiple substantial coding agents against the same code path.
- Specialist product/design/QA agents may independently advise or review the primary implementation.
- Open implementation PRs as draft when practical.
- At most one open PR targeting `main` carries `<!-- ai-active-build-pr -->` as the active automated build lane.
- Routine docs/tooling PRs do not need the active-build marker.
- Do not accumulate unrelated work in one PR.
- PRs over roughly 25 changed files or 1,200 changed lines receive a native advisory to consider splitting future unrelated scope.
- `build/festival-mvp` is retained as historical Phase 2 integration history; it is no longer the target for new product work.

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

- bounded implementation;
- non-obvious defect diagnosis;
- architecture/product/security reasoning;
- Marketplace UX/merchandising/design exploration;
- independent visual/product/accessibility critique;
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

Runs on PRs targeting `main`.

**CI**

- docs/instructions/config-only: formatting/config validation;
- web/workflow/dependency/E2E/shared changes: formatting, unit tests, production build.

**Database QA**

For database/RLS/RPC/Supabase changes:

- start local Supabase;
- reset/replay migrations and seed;
- pgTAP/RLS tests.

No Chromium is required in this tier.

### Tier 2 — acceptance boundary

Triggered by `STATUS: READY_FOR_ACCEPTANCE` when the classifier says the heavier evidence is needed.

**Persona QA**

Runs only for persona-sensitive impact.

- fresh local Supabase reset/seed;
- Chromium;
- Guardian/persona/access/redemption Playwright.

Database pgTAP is not repeated here because Database QA owns that evidence.

**Hosted QA**

Runs only when product/browser impact requires it and the PR is marked as the active build lane.

- resolve the relevant Vercel preview artifact;
- verify deployment readiness;
- run the hosted golden paths once at the acceptance boundary.

### Tier 3 — release hardening

Issue #5 and similar broad sweeps cover cross-cutting browser/accessibility/security/RLS regression. These do not run after every implementation commit.

Use `.github/skills/release-readiness-review/SKILL.md` before ShelterPawtners domain cutover.

## Design-hardening extension

For material customer-facing design work:

1. use the relevant project skills in `.github/skills/`;
2. establish user task/value architecture before styling;
3. prefer code-first concepts and Vercel previews;
4. use the Marketplace Product Designer/Product Critic for independent product perspective;
5. use the Frontend Design-System Engineer for approved implementation;
6. use UX + Accessibility QA for independent runtime review;
7. capture representative phone/tablet/desktop evidence and run relevant browser tests.

Figma is not required. Storybook may be introduced during the Marketplace Sprint once isolated reusable component work creates a net speed advantage.

## Supabase CLI pin

`scripts/supabase-cli.sh` contains the single exact Supabase CLI version used by CI/local automation: `2.117.0`.

This centralizes an exact pin without adding the CLI's transitive dependency tree to the application lockfile. Workflows call the wrapper rather than repeating a versioned `npx` command.

## Acceptance and merge evidence

`docs/AI-HANDOFF.md` has a required top-level field: `ACCEPTED_CODE_SHA`.

Use `ACCEPTED_CODE_SHA: NONE` until checkpoint acceptance exists.

When a meaningful implementation checkpoint reaches `COMPLETE`, record the exact code SHA that passed required acceptance.

The `Merge Gate` then:

1. classifies the full PR impact;
2. requires CI on the current PR head so later documentation/metadata changes stay valid;
3. verifies `ACCEPTED_CODE_SHA` is an ancestor of the current head;
4. requires Database QA evidence when database impact exists;
5. requires the actual Persona browser job when persona impact exists;
6. requires the actual Hosted browser job when hosted impact exists;
7. requires dependency review when dependencies changed.

During `IN_PROGRESS` or `READY_FOR_ACCEPTANCE`, Merge Gate remains informational rather than pretending acceptance already exists.

## Pull request lifecycle

1. create/identify bounded scope and acceptance criteria;
2. branch from current `main`;
3. open a small PR to `main`;
4. mark the PR with `<!-- ai-active-build-pr -->` only when it should be the single active automated build lane;
5. set handoff `IN_PROGRESS`, owner `NO`, safe `YES`, accepted SHA `NONE`;
6. implement cohesive increments;
7. Tier 1 checks run by impact;
8. for meaningful product code, update handoff to `READY_FOR_ACCEPTANCE`;
9. applicable Tier 2 checks run;
10. fix real GREEN/YELLOW defects;
11. record accepted SHA and set `COMPLETE` when deterministic evidence is green;
12. Merge Gate validates required evidence;
13. owner-approved merge to `main`;
14. verify Vercel behavior as appropriate;
15. create the next branch from updated `main`.

## AI execution routing

Use the lowest-cost capable execution surface.

- ChatGPT: product/architecture/controller/research/acceptance/RED decisions and connected operations.
- Copilot custom agents/skills: repo-native product/design/engineering/QA specialties.
- Copilot IDE completions: small human-driven edits/boilerplate.
- Copilot coding agent: bounded implementation when intentionally invoked; never an automatic scheduler.
- Codex / ChatGPT Work: substantial code-centric work when it is the best available execution surface.
- GitHub Actions: all deterministic automation.

Do not ask multiple coding agents to independently solve the same ordinary implementation task. Independent product/design/QA review is encouraged because it serves a different role from implementation.

## AI review policy

- Avoid automatic duplicate AI reviews for trivial changes.
- No extra semantic AI review is needed for routine formatting or lockfile-only work unless security evidence suggests otherwise.
- Use specialist semantic review near meaningful design/product acceptance.
- A second implementation-oriented review is justified only after material code/security changes caused by the first review.
- Release hardening may receive a broader independent review.

## AI Ops status

Issue #12 is the single native operational status source.

`scripts/update-ai-ops-status.sh` tracks open PRs targeting `main` and updates one comment containing overall state, phase/checkpoint, active PR/branch/head, handoff state, last commit age, deterministic workflow status, and next expected action.

The comment is updated in place rather than creating repeated status comments or status commits.

The state is inferred only from observable GitHub signals. It must not claim an AI process is literally running unless the platform exposes that fact.

## Event-driven supervision and watchdog

Workflow completion updates status. The stale watchdog runs once per hour.

A stale signal never launches a coding agent automatically. It only records state so the next intentional engineering/controller session can act.

## Dependency maintenance

Dependabot runs weekly with grouped PRs for frontend core, test tooling, Supabase client, styling, and GitHub Actions.

Dependency-changing PRs to `main` run GitHub's native Dependency Review and fail on newly introduced high-severity vulnerabilities.

## Vercel

The configured Ignored Build Step uses `scripts/vercel-ignore-build.sh`, which delegates to the canonical classifier.

It skips deployments when a commit cannot affect the deployed web artifact.

`main` is the Production Branch; short-lived feature/design branches create preview artifacts when the Vercel classifier determines the deployed frontend changed.

## Cost guardrails

- Standard GitHub-hosted runners only.
- No paid/larger runner without owner approval.
- No new monitoring/testing/orchestration SaaS while native tools are sufficient.
- No automatic coding-agent invocation.
- No full browser suite on every implementation commit.
- No duplicate CI push + PR runs on every short-lived branch; routine PR validation is PR-triggered and `main` receives the post-merge push run.
- No giant long-lived PRs.
- No status commits every few minutes.
- No repeated duplicated path logic when the classifier can decide deterministically.

## Known owner gates

- `OD-003`: customer-facing verified-savings evidence/calculation rules.
- `OD-004`: production charitable-money movement/provider selection/settlement/integration.
- ShelterPawtners DNS changes.
- paid infrastructure/tools.
- destructive actions/material RED decisions.
- Phase 3 feature authorization.
