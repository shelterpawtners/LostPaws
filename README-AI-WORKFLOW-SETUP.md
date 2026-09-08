# ShelterPawtners AI Workflow

This file is a human-facing pointer only. It is not an authority source and should not duplicate agent policy.

## Current model

- GitHub is the shared source of truth.
- `AGENTS.md` defines current cross-agent authority and guardrails.
- `docs/CURRENT-WORK.md` and the active GitHub Issue define current work.
- `docs/AI-HANDOFF.md` is the live baton/status.
- `docs/AUTONOMOUS-EXECUTION-POLICY.md` defines GREEN/YELLOW/RED behavior.
- `docs/AI-COST-AND-TESTING-GOVERNANCE.md` defines cost-efficient use of AI vs native automation.
- The remainder of Phase 2 is currently authorized; Phase 3 remains owner-gated.

Do not use the old bootstrap/install instructions or old phase-activation commands as current authority. They were part of initial repository setup and are superseded by the live repo state.

## Operating rule

Use one substantial coding agent on the same code path at a time. Prefer bounded checkpoint-level agent sessions, deterministic GitHub Actions for repeatable validation/polling, and concise handoffs between agents. Do not request repeated AI reviews or agent sessions for routine green CI results.
