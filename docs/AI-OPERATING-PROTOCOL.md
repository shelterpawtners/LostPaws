# AI Operating Protocol

## Purpose

Use GitHub as the coordination/control plane so ChatGPT, Codex, Copilot, CI, and the product owner do not depend on copying large prompts or completion reports between tools.

## Source-of-truth hierarchy

1. **GitHub Issue** — task contract, scope, acceptance criteria, guardrails.
2. **Repository code/docs** — implemented truth.
3. **Pull request + CI** — review and verification evidence.
4. **`docs/AI-HANDOFF.md`** — latest concise agent-to-agent baton.
5. **`docs/CURRENT-WORK.md`** — current phase, priorities, and execution state.
6. **`docs/DECISION-LOG.md`** — durable approved/autonomous decisions.

Do not create parallel planning documents when an authoritative file already exists.

## Agent responsibilities

### ChatGPT

- Product owner / architect / acceptance coordinator.
- Reads GitHub state directly before issuing new implementation direction.
- Creates or updates Issues for meaningful work.
- Reviews commits, PRs, CI failures, and handoff state.
- Separates blockers into application defect, test defect, environment defect, or product decision.
- Updates priorities and decision records when appropriate.

### Codex

- Primary implementation agent.
- Starts from the GitHub Issue and current `AI-HANDOFF.md` rather than relying on a pasted chat transcript.
- Preserves newer branch work and checks current remote state before editing.
- Implements, tests, commits, pushes, updates the relevant Issue, and updates `AI-HANDOFF.md` before completion.
- Does not merge unless explicitly authorized.

### Copilot

- Independent bounded reviewer / QA engineer.
- Reviews PR changes for correctness, security/RLS, maintainability, and missing test coverage.
- Should comment on the PR/Issue rather than creating a parallel task narrative.
- May implement bounded fixes when explicitly assigned.

### GitHub Actions / Playwright / pgTAP

- Automated verification layer.
- Must fail for real regressions and avoid false failures caused by invalid assertions or missing optional configuration.
- Golden-path regression coverage grows with each MVP vertical slice.
- Broad exhaustive QA waits until the main MVP slices are connected.

### Product owner (Jim)

- Needed for material product/legal/financial/privacy/security/production decisions and key UX acceptance.
- Should not be required to shuttle routine agent status text between systems.

## Standard task lifecycle

1. ChatGPT reads `CURRENT-WORK.md`, `AI-HANDOFF.md`, relevant Issue/PR, and CI state.
2. ChatGPT creates/updates one GitHub Issue with scope, acceptance criteria, and guardrails.
3. Codex is instructed to execute that Issue and read this protocol first.
4. Codex implements on the designated branch and pushes commits.
5. CI runs automatically.
6. Copilot reviews the PR where appropriate.
7. Codex fixes blocking review/CI findings.
8. Codex updates `AI-HANDOFF.md` with final SHA, tests, open items, and recommended next action.
9. ChatGPT reads GitHub directly and performs acceptance/review.
10. Human UX review occurs only where useful or required.
11. Merge/phase advancement happens only after the applicable gate is met.

## Handoff trigger convention

Until an automatic ChatGPT Work GitHub-event trigger is configured, the lightweight human trigger is simply:

> `check the GitHub handoff`

No pasted Codex completion report is required. ChatGPT should then read `docs/AI-HANDOFF.md`, the active Issue/PR, and CI directly.

When a supported GitHub-event-triggered Work task is configured later, use PR/Issue activity as the trigger and keep this same repository contract.

## MVP testing policy

Use strategic vertical-slice testing:

- Build one business-critical flow.
- Add one strong golden-path regression (plus essential security/RLS checks).
- Move on.
- Avoid exhaustive permutations and cosmetic automation while the workflow is still changing.
- Run the broader full-site audit after the main MVP tent poles connect.

Priority testing now:

- auth/login/account creation;
- roles and authorization;
- profile/onboarding persistence;
- core entity relationships;
- RLS/security boundaries;
- idempotent/retry-safe saves;
- Partner offer publication/redemption golden path;
- Guardian/Pet golden path;
- Admin QA switching only to the level needed to support testing.

## Required Codex completion contract

Every meaningful Codex task must update `docs/AI-HANDOFF.md` and include:

- Issue/task number and title
- branch
- final remote SHA
- implementation summary
- tests run and exact outcomes
- CI/hosted QA state
- unresolved defects
- product-owner decisions needed
- deferred work
- recommended next action

A task is not considered handed off until the file is updated and pushed.

## Guardrails

- GitHub remains source of truth.
- No secrets in repository docs, issues, logs, or frontend.
- No production DNS or production Supabase changes without explicit approval.
- No paid infrastructure without approval.
- No force push or destructive reset of valid work.
- Do not begin Phase 2 Checkpoint 5 or Phase 3 without explicit authorization.
