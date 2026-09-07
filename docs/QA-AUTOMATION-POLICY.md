# ShelterPawtners QA automation policy

Status: User-approved operating rule.

## Principle

Testing and defect handling should continue autonomously without waiting for Jim on routine engineering issues.

## Defect handling

When an automated test, agent review, CI run, or local validation identifies a defect:

1. Record the defect in the current PR/work log with enough evidence to reproduce it.
2. Classify it as blocking, non-blocking, or decision-required.
3. If blocking, fix it immediately, add or update regression coverage, rerun the affected test set, and continue.
4. If non-blocking, document it clearly, preserve evidence, and continue with the current checkpoint unless it materially affects acceptance.
5. Do not wait for Jim merely to report a routine bug or ask whether it should be fixed.

## Blocking defects

Treat an issue as blocking when it prevents a required user journey, causes incorrect or unsafe data persistence, breaks authorization/RLS, corrupts transaction history, breaks the build/migration/test pipeline, causes a required acceptance test to fail, or makes the current checkpoint materially unusable.

## Non-blocking defects

Examples include cosmetic defects, minor copy issues, low-priority polish, known test-environment limitations with a documented workaround, or deferred enhancements that do not invalidate the checkpoint acceptance criteria.

## Decision-required defects

Pause and ask Jim only when the fix requires a material business/product choice or changes an approved boundary, including:

- legal/entity or charitable-money assumptions
- privacy/data-sharing policy
- authentication or security posture with meaningful user impact
- financial/savings/giving truth standards
- production infrastructure, DNS, or public-site replacement
- material UX behavior where multiple valid product directions exist
- scope changes that would begin a later frozen phase/checkpoint

## Automation workflow

The default loop is:

`test -> detect -> document -> classify -> fix blocker or log non-blocker -> add regression test -> rerun -> continue`

No human approval is required for routine code/test fixes inside already-approved product behavior.

## Continuous next-action handoff

Never end a work cycle in an ambiguous state. At every checkpoint, failure report, PR review, or chat handoff:

1. State what ChatGPT is doing next.
2. State what Codex and/or GitHub Copilot should do next, if anything.
3. State exactly what Jim should do next, if anything.
4. If Jim has no action, say `No action needed from Jim right now.` explicitly.
5. When Jim's action becomes necessary, provide the exact command, click path, or prompt needed to proceed.
6. Prefer presenting 1-3 concrete proceed options when there is more than one valid path, with a recommended default.
7. Do not leave the project waiting merely because an automated step or agent handoff has not yet been initiated; create the handoff artifact or give Jim the exact launch action before ending the cycle.

## Reporting

At checkpoint or PR review, provide Jim a concise summary of:

- blockers found and fixed
- non-blockers logged
- regression tests added
- remaining decision-required items
- final CI/Playwright/pgTAP/build status
- explicit next action for ChatGPT, Codex/Copilot, and Jim

Do not stop progress merely because bugs were found; use the test system to drive the next corrective step.
