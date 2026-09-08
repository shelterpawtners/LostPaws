# AI Cost and Testing Governance

## Principle

Use deterministic native automation for repeatable work. Spend AI credits only where reasoning, implementation, diagnosis, or semantic review adds material value. This policy does not weaken product, security, RLS, data-integrity, or acceptance requirements.

The GitHub control plane is **zero-AI by default**. GitHub Actions may detect, record, and surface READY / FAILED / STALLED / BLOCKED states, but it must not automatically mention or launch Copilot, Codex, Claude, or another coding agent.

## Execution-surface priority

Choose the lowest-cost surface that can safely complete the task.

| Work type | Preferred surface | Rule |
| --- | --- | --- |
| Product/architecture/spec/acceptance reasoning | regular ChatGPT | Use for decisions, issue contracts, architecture review, and semantic acceptance. |
| Substantial code-centric repository implementation | Codex / ChatGPT Work when included agentic allowance is available | Use one bounded session for the checkpoint/defect cluster; do not run Work and Codex on the same task concurrently. |
| Tiny local edits / boilerplate while a human is editing | Copilot IDE completions / next-edit suggestions | Prefer non-agent suggestions over a cloud coding-agent session. |
| Fallback code implementation when OpenAI agentic allowance is unavailable | intentionally started Copilot session | Prefer a bounded CLI session with an AI-credit cap when practical; cloud agent is a manual fallback, never an automatic scheduler. |
| Formatting, lint, typecheck, tests, migration replay, pgTAP, browser regression, polling, status, dedup, stall detection | native scripts / GitHub Actions | Never spend AI credits merely to run or watch deterministic checks. |
| Code review | deterministic checks first; one semantic AI review only when material | No repeated review during iterative fixes. |

Do not route Codex through GitHub's third-party coding-agent surface merely to avoid GitHub Copilot usage; GitHub-hosted coding agents can still consume GitHub AI credits. Use the OpenAI execution surface directly when choosing Codex/Work.

## AI-credit rules

- No GitHub workflow may automatically invoke a coding agent.
- Agent launch is an intentional operator decision after the native control plane reports the state.
- One bounded coding-agent session per checkpoint or defect cluster by default.
- Do not start a new agent session because routine CI/Hosted QA passed.
- Keep one agent working through related GREEN/YELLOW defects instead of repeatedly steering/re-prompting it.
- If a fallback Copilot CLI session is used, configure an explicit AI-credit session limit before starting work when supported.
- Use native GitHub Actions/scripts for formatting, lint, typecheck, unit tests, builds, migration replay, pgTAP, Playwright, status polling, deduplication, and stall detection.
- Prefer one complete task prompt with scope, validation, defect-fixing authority, stopping condition, and handoff contract over several small prompts.
- Keep persistent agent instructions short. Route to canonical docs instead of duplicating large policy blocks across `AGENTS.md`, `CLAUDE.md`, Copilot instructions, skills, prompts, and READMEs.

## Copilot review

- Do not request review on every commit.
- No Copilot review for docs-only, formatting-only, lockfile-only, or trivial workflow changes unless security/execution behavior materially changed.
- Default to at most one Copilot review per checkpoint at acceptance, and only when its semantic value justifies AI-credit use.
- A second review is justified only after material code/security changes caused by the first review.
- One broader review may be used at final Phase 2 hardening.
- Keep implementation PRs draft until the acceptance boundary when an automatic review ruleset is enabled, so opening the PR does not spend review credits early.

## PR lifecycle

Long-lived integration PRs increase AI review context, human review effort, merge-conflict risk, and semantic-review cost.

- Default future work to one bounded checkpoint/feature PR into `build/festival-mvp`.
- Open the PR as **draft** during implementation.
- Do not let a single active PR accumulate unrelated checkpoints indefinitely.
- The five-minute supervisor discovers the active build lane from the `<!-- ai-active-build-pr -->` marker rather than a hardcoded PR number.
- Exactly one open integration PR should carry that marker.
- Move the marker to the next checkpoint PR after the prior PR reaches its approved integration boundary.
- PR merging remains owner-gated unless a later policy explicitly changes that rule.
- Push cohesive checkpoints/meaningful increments; do not push every tiny edit merely to make the cloud rerun checks.

PR #2 is the historical exception because it already accumulated the Phase 2 QA/integration foundation. Finish the current bounded Checkpoint 5 work there, then prefer smaller PRs.

## Test tiers

### Tier 1 — implementation loop

For normal code commits: lint, unit tests, and production build. The production build includes TypeScript compilation; do not compile TypeScript twice in the same CI path. These deterministic checks are cheap and should not be replaced with AI review.

### Tier 2 — checkpoint acceptance

When `docs/AI-HANDOFF.md` is `READY_FOR_ACCEPTANCE` or equivalent: relevant Hosted QA golden path, relevant database/RLS/pgTAP checks, and targeted integration tests.

Do not run the full hosted browser/database acceptance stack on every intermediate commit unless a specific defect requires it.

### Tier 3 — phase/final hardening

Broader Persona QA, browser/accessibility regression, security/RLS sweep, migration replay, and other cross-cutting phase checks.

## Change-aware testing

Selective tests are allowed only when impact mapping is deterministic. Shared app/auth/routing files and cross-cutting database/security changes fall back to broader relevant deterministic tests.

- Docs-only: no app CI/browser QA.
- Supabase migration/RLS/RPC: database/RLS tests mandatory; affected browser flow at acceptance.
- Shared auth/routing/application shell: broader relevant web regression.
- Package/workflow/config: run affected configuration checks.

When impact is uncertain, run the broader deterministic test rather than spend AI credits deciding whether to skip it.

## Workflow deduplication

- One canonical Hosted QA lane per PR/SHA; no duplicate push + PR copies of the same suite.
- Use concurrency with cancellation for obsolete CI/QA runs.
- Heavy hosted browser QA is acceptance-gated.
- Persona QA is deliberate: schema/RLS/persona changes and planned hardening, not every commit.
- Upload failure artifacts only on failure.
- A prior failed run is resolved when the latest run for that workflow/current SHA succeeds; do not react to historical failures.

## Zero-AI supervisor

The supervisor may poll frequently with native GitHub APIs/Actions without invoking AI.

- It may post deduplicated READY / FAILED / STALLED / BLOCKED status comments.
- It must never include an `@copilot`, Codex, Claude, or other coding-agent invocation.
- Only the PR marked `<!-- ai-active-build-pr -->` is supervised as the active lane.
- Default stale signal threshold is 30 minutes.
- A stalled signal is informational; it does not authorize an AI session automatically.
- The next implementation session is intentionally started by the owner/operator using the execution-surface priority above.

## Deployment and hosted acceptance

Vercel should not rebuild the frontend for docs-only, GitHub-workflow-only, E2E-only, or Supabase-only commits.

- Use `bash scripts/vercel-ignore-build.sh` as the Vercel Ignored Build Step when enabled in project settings.
- The script builds conservatively when frontend/build inputs change and skips only commits that cannot alter the deployed web artifact.
- Keep Vercel's native dependency/build cache enabled.
- Do not introduce another CI/CD provider just to optimize preview builds.
- Heavy Hosted QA must not claim acceptance until the relevant web deployment for the tested code is Ready. The workflow should use a native deployment/readiness signal rather than an AI judgment call.

## Handoff

Every bounded agent session must leave enough structured evidence that another AI call is not needed just to discover state: task/issue, branch/SHA, areas changed, exact tests/results, CI/Hosted QA state, blocker classification, next action, `SAFE_TO_CONTINUE`, and `OWNER_DECISION_REQUIRED`.

## Cost guardrails

- Standard GitHub-hosted runners only; no paid larger runners without owner approval.
- No new paid testing/monitoring SaaS while GitHub/Vercel/Supabase native capabilities are sufficient.
- No added paid Supabase/Vercel infrastructure without owner approval.
- Prefer repo-native status/JSON + GitHub APIs for AI Ops monitoring.
- Treat AI credits as scarce reasoning budget, not a scheduler, polling mechanism, or retry loop.
- Maintain account-level AI budgets/alerts as the final financial circuit breaker; automation must not assume an unlimited overage budget.
