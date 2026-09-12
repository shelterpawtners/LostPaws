# AI Operating Protocol

## Purpose

Use GitHub as the coordination/control plane so ChatGPT, Codex, Copilot, Claude Code, CI, and the product owner do not depend on copying large prompts or completion reports between tools.

## Source-of-truth hierarchy

1. **GitHub Issue** — task contract, scope, acceptance criteria, guardrails.
2. **Repository code/docs** — implemented truth.
3. **Pull request + CI** — review and verification evidence.
4. **`docs/AUTONOMOUS-EXECUTION-POLICY.md`** — standing autonomy/escalation rules for invoked agents.
5. **`docs/AI-HANDOFF.md`** — latest concise agent-to-agent baton.
6. **`docs/CURRENT-WORK.md`** — current phase, priorities, and execution state.
7. **`docs/OWNER-DECISION-BACKLOG.md`** — provisional owner preferences and true blocking decisions.
8. **`docs/DECISION-LOG.md`** — durable approved/autonomous decisions.

Do not create parallel planning documents when an authoritative file already exists. As of 2026-09-12 this is a hard cap: no new `docs/product/*` or other planning files without an explicit owner request — update `AI-HANDOFF.md`, `CURRENT-WORK.md`, or the existing controlling doc instead.

## Branch policy

Prefer fewer, longer-lived branches over one branch per issue/sub-task. Reuse the current track's branch for its full scope (through PR merge) rather than opening a new branch each time a sub-task starts. Do not open the next track's branch until the current track has merged. This repository has accumulated a large number of short-lived, mostly-stale branches; do not add to that pattern.

## Agent responsibilities

### ChatGPT

- Product owner / architect / acceptance coordinator.
- Reads GitHub state directly before issuing new implementation direction.
- Creates or updates Issues for meaningful work.
- Reviews commits, PRs, CI failures, and handoff state.
- Separates blockers into application defect, test defect, environment/configuration defect, or product-owner decision.
- Updates priorities, operating rules, and decision records when appropriate.
- Performs or triggers acceptance checks when the required tooling is available.

### Codex

- **Paused for the current RAVE Shelter / LostPaws dual-marketplace sprint (from 2026-09-12).** Do not create or delegate Codex sessions until the owner explicitly re-authorizes Codex for Track 2. Claude Code is the sole active implementation agent during this sprint.
- Primary heavy implementation/debugging agent when OpenAI work credits are available.
- Starts from the GitHub Issue and current repository instructions rather than relying on a pasted chat transcript.
- Preserves newer branch work and checks current remote state before editing.
- Follows `docs/AUTONOMOUS-EXECUTION-POLICY.md`: GREEN decide/continue, YELLOW provisionalize/continue, RED stop narrowly.
- Implements, tests, commits, pushes, and updates `AI-HANDOFF.md` before completion/blockage.
- Does not merge unless explicitly authorized.

### GitHub Copilot coding agent

- Primary GitHub-hosted implementation fallback and bounded autonomous engineer.
- Works from the active Issue/PR branch and repository-native instructions.
- Follows `docs/AUTONOMOUS-EXECUTION-POLICY.md` and continues through routine in-scope blockers without requesting approval.
- Uses clearly labeled demo/QA placeholders for reversible YELLOW content decisions and records them in `OWNER-DECISION-BACKLOG.md`.
- Updates `AI-HANDOFF.md` before completion/blockage.
- Does not merge unless explicitly authorized.

### GitHub Copilot code review

- Independent reviewer / QA layer.
- Reviews PR changes for correctness, security/RLS, maintainability, and missing test coverage.
- Should comment on the PR rather than creating a parallel task narrative.
- Automatic review is intentionally low-noise; re-review after substantial fixes may be requested manually.

### Claude Code / Claude coding agent

- Fallback implementation agent and independent second-opinion reviewer when available.
- Reads `CLAUDE.md`, `AGENTS.md`, the active Issue/PR, `AI-HANDOFF.md`, and the autonomous execution policy.
- Must not reinterpret a provisional owner decision as durable approval.
- Particularly useful for independent review of RLS/auth, concurrency, financial/redemption logic, and architectural changes.
- Updates `AI-HANDOFF.md` before completion/blockage when acting as the implementation agent.

### GitHub Actions / Playwright / pgTAP

- Automated verification layer.
- Must fail for real regressions and avoid false failures caused by invalid assertions or missing optional configuration.
- Golden-path regression coverage grows with each MVP vertical slice.
- Broad exhaustive QA waits until the main MVP slices are connected.

### Product owner (Jim)

- Needed for RED decisions, explicit progression gates, and key UX/business acceptance.
- Should not be required to shuttle routine agent status text between systems.
- Non-blocking YELLOW decisions should be batched in `docs/OWNER-DECISION-BACKLOG.md` for efficient later review.

## Autonomous execution model

Every invoked coding agent must follow `docs/AUTONOMOUS-EXECUTION-POLICY.md`.

The desired behavior is:

1. Read current Issue/PR, instructions, handoff, roadmap, and relevant authoritative docs.
2. Implement the currently authorized objective.
3. Run relevant validation.
4. Classify failures.
5. Fix GREEN/YELLOW in-scope failures autonomously.
6. Rerun validation.
7. Continue until acceptance criteria are met or a RED/hard blocker is reached.
8. Record deferred owner preferences in `OWNER-DECISION-BACKLOG.md` instead of interrupting Jim.
9. Update `AI-HANDOFF.md` before completion or blockage.
10. Do not cross an explicit checkpoint/phase gate without authorization.

Instruction files govern behavior after an agent is invoked; they do not themselves schedule or launch the next independent agent session.

## Standard task lifecycle

1. ChatGPT reads `CURRENT-WORK.md`, `AI-HANDOFF.md`, relevant Issue/PR, owner-decision backlog, and CI state.
2. ChatGPT creates/updates one GitHub Issue with scope, acceptance criteria, guardrails, and the authorized range.
3. One implementation agent (Copilot, Codex, or Claude) is assigned/invoked against the designated branch/PR.
4. The implementation agent works autonomously under the execution policy and pushes completed work.
5. Lightweight CI runs automatically during iteration.
6. Copilot code review or another independent agent reviews when appropriate.
7. The implementation agent fixes blocking in-scope review/CI findings.
8. The implementation agent updates `AI-HANDOFF.md` with status, SHA, tests, blockers, and next safe action.
9. ChatGPT reads GitHub directly and performs acceptance/review.
10. Targeted Persona/Hosted QA runs at the acceptance gate when configured/needed.
11. Human UX review occurs only where useful or required.
12. Merge/phase advancement happens only after the applicable gate is met.

Avoid multiple implementation agents editing the same active code path/branch simultaneously unless explicitly coordinated. Independent review may run in parallel when it does not mutate the same files.

## GitHub Copilot PR review configuration

- Keep exactly one repository ruleset for automatic Copilot PR review: `Automatic Copilot Review`.
- Target branch: `build/festival-mvp`.
- Enforcement should be active when automatic review is desired.
- `Review new pushes` stays **off** to avoid repeated review/credit/notification noise during agent iteration.
- `Review draft pull requests` stays **off** so drafts remain a low-noise workspace.
- Do not create a duplicate Copilot review ruleset unless the review policy materially changes.

## Handoff trigger convention

Until an automatic ChatGPT Work GitHub-event trigger is configured, the lightweight human trigger is simply:

> `check the GitHub handoff`

No pasted coding-agent completion report is required. ChatGPT should then read `docs/AI-HANDOFF.md`, the active Issue/PR, owner-decision backlog, and CI directly.

When a supported GitHub-event-triggered Work task is configured later, use PR/Issue activity as the trigger and keep this same repository contract.

## Handoff status contract

Every meaningful implementation-agent update to `docs/AI-HANDOFF.md` must keep a compact status block near the top:

```text
STATUS: IN_PROGRESS | BLOCKED | READY_FOR_ACCEPTANCE | COMPLETE
CURRENT_PHASE: <phase>
CURRENT_CHECKPOINT: <checkpoint or issue>
NEXT_CHECKPOINT: <next authorized checkpoint or NONE>
OWNER_DECISION_REQUIRED: YES | NO
SAFE_TO_CONTINUE: YES | NO
```

The rest of the handoff must include:

- Issue/task number and title;
- agent;
- branch;
- final/current remote SHA;
- root cause for defects where applicable;
- implementation summary;
- tests run and exact outcomes;
- CI/hosted QA state;
- unresolved defects;
- owner decisions needed (reference decision backlog IDs);
- deferred work;
- recommended next action.

A task is not considered handed off until the file is updated and pushed.

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

## Current progression gates

The autonomous policy does **not** lift existing explicit product-owner gates.

Current gates:

- Do not begin Phase 2 Checkpoint 5 without explicit authorization.
- Do not begin Phase 3 without explicit authorization.

These are recorded in `docs/OWNER-DECISION-BACKLOG.md` so an agent reaching the boundary stops narrowly instead of asking repeatedly during earlier work.

## Guardrails

- GitHub remains source of truth.
- No secrets in repository docs, issues, logs, or frontend.
- No production DNS or production Supabase changes without explicit approval.
- No paid infrastructure without approval.
- No force push or destructive reset of valid work.
- Never weaken RLS or a valid regression test just to make a gate pass.
- Prefer reversible, explicitly labeled QA/demo placeholders for YELLOW decisions over blocking development.
- Do not fabricate real partnerships, claims, discounts, donations, testimonials, statistics, affiliations, or customer data.
- Do not begin Phase 2 Checkpoint 5 or Phase 3 without explicit authorization.
