---
name: AI Agent Task
description: Define a bounded implementation task for Codex/Copilot using the repo-native handoff workflow.
title: "AI TASK: "
labels: []
assignees: []
---

## Objective

<!-- State the business/engineering outcome. -->

## Scope

<!-- List the bounded changes that are in scope. -->

## Acceptance criteria

- [ ] Implementation meets the objective.
- [ ] Required tests pass.
- [ ] Relevant CI/hosted QA status is recorded.
- [ ] `docs/AI-HANDOFF.md` is updated when the task requires its CI/workflow completion contract.
- [ ] Final remote SHA is recorded.

## Testing level

Choose the minimum useful level:

- [ ] Unit/type/build only
- [ ] pgTAP/RLS foundation
- [ ] One golden-path Playwright regression
- [ ] Hosted shared-dev regression
- [ ] Human UX acceptance required

## Guardrails

- Do not expose secrets or credentials.
- Do not change production DNS or production Supabase without explicit approval.
- Do not add paid infrastructure without approval.
- Merge only when the active Issue/PR or newer owner direction explicitly authorizes it.
- Do not begin Phase 2 Checkpoint 5 or Phase 3 unless explicitly authorized.

## Agent start instructions

Before changing code:

1. Refresh current `main`; read `AGENTS.md`, `docs/AI-CONTROLLER.md`, and this Issue.
2. Read `docs/engineering/AGENT-OPERATIONS.md` and only the relevant domain document.
3. Read `docs/AI-HANDOFF.md` if completion/acceptance/workflow state is required.
4. Confirm current branch/remote state so newer work is preserved.

## Completion contract

Before declaring complete, update `docs/AI-HANDOFF.md` with:

- Issue/task
- Agent
- Branch
- Final remote SHA
- What changed
- Tests and results
- CI/hosted QA status
- Open defects
- Product-owner decisions needed
- Deferred items
- Recommended next action
