# ShelterPawtners AI Workflow

This file is a human-facing pointer only. It is not an authority source and should not duplicate agent policy.

## Current model

- GitHub is the shared source of truth.
- `AGENTS.md` defines current cross-agent authority and guardrails.
- `docs/AI-CONTROLLER.md` and the active GitHub Issue define current human live status and work.
- `docs/AI-HANDOFF.md` is CI-required machine-readable release state, not the live narrative.
- `docs/CURRENT-WORK.md` is a retained inbound-compatible historical record.
- `docs/AUTONOMOUS-EXECUTION-POLICY.md` defines GREEN/YELLOW/RED behavior.
- `docs/AI-COST-AND-TESTING-GOVERNANCE.md` defines cost-efficient use of AI vs native automation.
- Follow the controller and active Issue for current authorization; do not infer it from this historical pointer.

Do not use the old bootstrap/install instructions or old phase-activation commands as current authority. They were part of initial repository setup and are superseded by the live repo state.

## Operating rule

Use one substantial coding agent on the same code path at a time. Prefer bounded checkpoint-level agent sessions, deterministic GitHub Actions for repeatable validation/polling, and concise handoffs between agents. Do not request repeated AI reviews or agent sessions for routine green CI results.
