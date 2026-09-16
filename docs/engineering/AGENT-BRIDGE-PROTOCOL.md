# Agent Bridge Protocol

Status: CANONICAL
Owner: Repository operations

## Purpose

GitHub is the shared durable control plane for ChatGPT, Claude Code, Codex, Copilot, and any other coding agent. Human chat is not the system of record for active work.

The goal is to minimize repeated context, AI cost, swivel-chair handoffs, and idle agent time while keeping ownership and RED boundaries explicit.

## Authority chain

For every meaningful task, use this order:

1. current GitHub `main`;
2. `AGENTS.md`;
3. `docs/AI-CONTROLLER.md`;
4. the active GitHub Issue/PR or task brief;
5. only the one canonical domain document needed for that task;
6. `docs/engineering/state/release-state.yaml` only when workflow/acceptance state is needed.

Newer explicit owner direction and the active Issue/PR supersede stale narrative text. Historical material under `docs/archive/**` is evidence only and must not be loaded for routine work.

## Shared-memory rule

Detailed plans, acceptance criteria, blockers, and agent handoffs belong in GitHub once. Do not repeatedly paste the same plan into Claude, Codex, Copilot, and ChatGPT prompts.

Use:

- active Issue: scope, acceptance, priority, task ownership;
- PR: implementation evidence and review discussion;
- `.github/agent-ops/*`: machine-readable queue/claim/run state when applicable;
- controller: compact human priority and blocker pointer only;
- release state: generated/CI workflow state only.

Prompts should normally be pointers, not restatements. Preferred form:

`Refresh main. Read AGENTS.md, AI-CONTROLLER.md, and the active work issue. Continue the highest-priority task you own under the repository rules.`

## Ownership and collision avoidance

One primary coding agent owns one bounded code path at a time.

- Claude: prefer cross-cutting state/auth/RLS/data-flow diagnosis, ambiguous product-state issues, and difficult integration work.
- Codex: prefer bounded implementation, UI, tests, validation, and low-conflict follow-on work.
- Copilot: prefer local developer assistance, scoped edits, and specialist repository instructions.
- ChatGPT: prefer control-tower reasoning, owner decisions, prioritization, review, and direct GitHub coordination when available.

These are cost/coordination defaults, not capability limits. The active Issue may assign work differently.

Before editing, refresh `main` and check the active Issue/PR and agent queue. If another agent owns the same files or code path, take a different independent task rather than competing.

## Continuous execution

A status update, commit, PR creation, CI start, merge, deployment, queue update, or checkpoint is not a voluntary stopping point.

For approved GREEN/YELLOW work, continue:

`claim -> implement -> focused validation -> PR -> resolve CI -> merge when authorized/green -> hosted/staging verification -> durable state update -> refresh main -> next safe task`

If one task is RED or owner-blocked, record the exact blocker and continue the highest-priority independent safe task.

Stop voluntarily only when all remaining work is RED/owner-blocked/deferred, access is unavailable and no independent safe work remains, or the execution environment actually terminates.

## Merge rule

A bounded PR may be merged by the active coding agent when all of the following are true:

- the work is already authorized by the owner, active Issue, controller, or newer explicit direction;
- required checks are green;
- the PR does not cross a RED boundary;
- there is no unresolved required review or material conflict.

Do not send routine merge work back to the owner merely because a PR exists. Phase gates and RED decisions remain owner-gated.

## Cost discipline

Use deterministic automation for deterministic work. Do not spend AI credits on repeated CI polling, formatting, dependency bookkeeping, or rereading broad project history.

Prefer:

- GitHub Actions/scripts for repeatable validation;
- one coding agent per bounded implementation;
- targeted file reads/searches instead of repository-wide rediscovery;
- short pointer prompts after durable state is written;
- GitHub checkpoints before context/cache/session exhaustion.

When a model reports low context, prompt-cache expiry, credit pressure, or session limits, externalize remaining state to GitHub immediately and continue from the durable issue/PR rather than expanding the prompt.

## Required checkpoint format

Before a session ends or ownership changes, write a concise durable checkpoint containing only:

- completed PRs/SHAs;
- current task and exact state;
- hosted/staging PASS/FAIL where relevant;
- exact blocker or owner decision, if any;
- next safe action;
- next agent owner, if assigned.

Do not duplicate long investigation narratives already present in Issues/PRs.

## Tool/location independence

These rules apply regardless of where the coding agent runs: VS Code extension, terminal/CLI, desktop application, cloud agent, Codespace, Work session, or other supported environment.

The repository is the continuity layer. A local IDE session must never become the only place where active state exists.
