# AI Cost and Testing Governance

## Principle

Use deterministic native automation for repeatable work. Spend AI credits only where implementation, diagnosis, architecture, semantic review, or product judgment adds material value.

GitHub Actions is the **zero-AI control plane**. No workflow may automatically invoke Copilot, Codex, Claude, or another coding agent.

See `docs/DEV-LOOP-V2.md` for the complete operating model.

## Execution-surface priority

1. **GitHub Actions/scripts** — formatting, lint, build, tests, migration replay, pgTAP/RLS, Playwright, dependency review, classification, status, merge evidence, watchdog.
2. **Regular ChatGPT** — product/architecture/controller/acceptance/RED decisions.
3. **Codex / ChatGPT Work** — substantial bounded repository implementation when included allowance is available.
4. **Copilot IDE completions** — small human-driven edits/boilerplate.
5. **Copilot coding agent** — intentional bounded fallback; never a scheduler.
6. **Claude Code** — explicit alternate engineer/semantic reviewer when useful.

Do not run competing substantial coding agents on the same code path.

## AI-credit rules

- One primary coding-agent session per bounded checkpoint/defect cluster by default.
- No AI invocation for routine CI success/failure polling, formatting, reruns, or status.
- Do not re-prompt an agent because a routine workflow turned green.
- Prefer one complete task contract with stopping conditions over many steering comments.
- Automatic Copilot PR review remains disabled.
- Default to at most one semantic AI review near checkpoint acceptance when it materially helps.
- No AI review for docs-only, formatting-only, trivial workflow, or routine dependency updates.

## PR lifecycle

Default:

`Issue → short-lived branch → bounded draft PR → deterministic acceptance → owner-approved merge → fresh branch`

- Exactly one open PR targeting `build/festival-mvp` carries `<!-- ai-active-build-pr -->`.
- Do not accumulate unrelated checkpoints.
- PR size above roughly 25 files or 1,200 changed lines produces an advisory to split future unrelated scope.
- Auto-merge remains prohibited unless the owner explicitly changes that policy.

## Change-aware testing

`scripts/classify-change-impact.sh` is the canonical risk mapping.

Workflows must consume the classifier rather than independently duplicating path rules.

Unknown paths fall back to broader deterministic testing.

## Test tiers

### Tier 1 — implementation

**CI**
- docs-only → formatting/instruction checks;
- web/workflow/dependency/E2E/shared changes → formatting, unit tests, production build.

**Database QA**
- database/RLS/RPC/Supabase changes → local Supabase start/reset/replay + pgTAP/RLS.

No Chromium is required for Database QA.

### Tier 2 — checkpoint acceptance

Only when `STATUS: READY_FOR_ACCEPTANCE`.

**Persona QA**
- runs only when persona-sensitive impact exists;
- fresh local Supabase reset/seed + targeted Persona/Guardian/access/redemption Playwright.

**Hosted QA**
- runs only when product/browser impact exists and the PR is the active build lane;
- verifies relevant Vercel readiness;
- runs hosted golden paths once at acceptance.

### Tier 3 — phase hardening

Broader Issue #5 browser/accessibility/security/RLS sweeps run at planned phase boundaries, not after every checkpoint commit.

## Merge evidence

`docs/AI-HANDOFF.md` includes `ACCEPTED_CODE_SHA`.

- Use `NONE` until acceptance exists.
- At `COMPLETE`, record the exact accepted code SHA.
- Merge Gate requires current-head CI and the applicable acceptance evidence on the accepted SHA.
- Documentation/metadata commits after accepted code do not force redundant browser suites.
- A workflow whose heavy job was skipped does not count as full acceptance.

## Supabase CLI

All CI/local automation calls `scripts/supabase-cli.sh`.

That wrapper contains the single exact Supabase CLI pin (`2.117.0`). This central pin is intentionally used instead of adding a large CLI dependency tree to the application lockfile.

## AI Ops and watchdog

Issue #12 is the single native operational status record.

The status updater changes one comment in place; it does not create repeated status comments or repository commits.

Primary supervision is event-driven from PR/workflow state changes.

The stale watchdog runs **hourly**.

A stale signal never launches an AI agent automatically.

## Workflow deduplication

- Use concurrency + `cancel-in-progress` on PR workflows.
- One canonical Hosted QA lane.
- Database pgTAP is not repeated inside Persona browser QA.
- Full Persona/Hosted Chromium is acceptance-only.
- Upload heavy artifacts only on failure.
- Ignore historical failed runs once a later required run satisfies the current evidence contract.

## Dependency maintenance

- Dependabot runs weekly using grouped dependency PRs.
- Dependency-changing PRs run native Dependency Review.
- High-severity newly introduced vulnerabilities fail the dependency review gate.
- No AI review is required for routine safe update PRs unless semantics warrant it.

## Deployment

Vercel's Ignored Build Step uses `scripts/vercel-ignore-build.sh`, which delegates to the canonical change classifier.

Skip frontend builds when the commit cannot change the deployed web artifact.

Do not add another CI/CD or deployment provider to optimize this flow.

## Cost guardrails

- Standard GitHub-hosted runners only.
- No paid/larger runners without owner approval.
- No new monitoring/testing/orchestration SaaS while native capabilities are sufficient.
- No paid Supabase/Vercel expansion without owner approval.
- No automatic AI-agent launch.
- No automatic AI review.
- No giant long-lived implementation PRs.
- Treat AI credits/tokens as scarce reasoning budget, not scheduler/polling budget.
