# Documentation Authority Guide

This directory contains current project knowledge, operational state, and historical evidence.

## Read order for substantial work

1. current GitHub `main`;
2. `AGENTS.md`;
3. `docs/AI-CONTROLLER.md`;
4. the active GitHub Issue/PR or task brief;
5. only the domain document needed for the task.

## Authority boundaries

- **Live human status:** `AI-CONTROLLER.md` is the source for current blockers, active lanes, and next actions.
- **Machine-readable release state:** `AI-HANDOFF.md` is CI-required. Keep its path and existing top-level fields—including `CURRENT_CHECKPOINT`—until all workflow and script consumers are migrated together.
- **Task-specific contract:** the active GitHub Issue/PR takes precedence for scope and acceptance.
- **Durable knowledge:** use the relevant product, architecture, security/privacy, legal, support, data, design, or roadmap document.
- **Historical material:** dated phase, launch, checkpoint, and completed-prompt files are evidence, not default startup instructions.

## Documentation changes

Do not move, archive, or delete a document until its inbound references and unique durable knowledge have been audited. Keep tool-discovered files in their required paths. Make one bounded documentation migration per pull request and validate links, formatting, workflows, and any affected scripts.

For the current Phase-0 audit ledger and information-architecture plan, see Issue #136 and its planning PR.
