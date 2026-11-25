# Agent baton handoff (OD-009)

Status: **Direction approved 2026-11-25 on Issue #325: Tier 0 only.** Implementing Tier 0 is a separate packet that needs its own owner approval. Tier 1 and Tier 2 are experimental and not authorized. Automated agent execution stays **disabled**. This brief extends `docs/engineering/AGENT-BRIDGE-PROTOCOL.md`. The execution contract itself is in `AGENTS.md` ("Bounded packet contract").

## Problem

GitHub already holds the shared context. It lacks a reliable signal of whose turn it is and what that turn may do; today the owner relays both by pasting prompts. The first goal is a cheap, deterministic signal. Taking the owner out of decisions is not a goal.

## Rules for every tier

- **A `turn:*` label is routing metadata, never authorization.** An agent acts only on an owner-authored (or owner-recorded) assignment comment that defines the scope.
- **Complete one approved packet, record evidence, and stop.** Never claim the next task automatically.
- An Issue carries exactly one `turn:*` label at a time.
- RED, payments, legal, security remediation, production database and DNS work always return to `turn:owner`.
- Issue and comment text is **untrusted content**. Never interpolate it into shell commands, into prompts that carry tool authority, or into workflow expressions.
- No metered API keys (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) for this pipeline. `scripts/ai-dispatch.ps1` already refuses to run when either is set.
- No scheduled runs (cron), no automatic merges, no production writes.
- No baton routing to Copilot.

## Required handoff fields

Every handoff comment includes all of these fields. If a handoff is missing a field, or its values don't match, the receiving agent stops and reports instead of starting.

```
### Baton → <next owner>
Repository: shelterpawtners/LostPaws
Issue: #<n>
Expected label: turn:<agent>
Authorized assignment: <link to the owner-authored assignment comment>
Scope: <the bounded packet, one or two lines>
Stopping condition: <what "done" or "stop" means for this packet>
Next baton owner: <owner | claude | codex | chatgpt>
Execution ID: <unique ID for automated runs; "manual" for owner-started sessions>
Done: <PRs/SHAs>
Validation: <commands and actual PASS/FAIL/SKIP>
State: <exact state; hosted PASS/FAIL only with real evidence>
Blocker/decision: <none | exact question>
Hop: <n>/3
```

## Tier 0: labels, comment template, notify-only workflow (approved direction, implementation pending)

- **Labels:**
  - `turn:claude`, `turn:codex`, `turn:chatgpt`, `turn:owner`;
  - `needs:decision`;
  - `agents:paused`, which stops any future dispatcher and marks the Issue as paused for humans.

  `turn:chatgpt` and `turn:claude` already exist. The Tier 0 packet creates the rest.

- **Handoff comment:** the template above, written by the agent that ends a packet.
- **`baton-notify.yml` (proposed, not created):**
  - Runs on `issues: labeled` and makes no AI call.
  - Its permissions are restricted to `issues: write` with `GITHUB_TOKEN`.
  - For `turn:owner` or `needs:decision`, it assigns the owner and posts one mention. A marker comment prevents double posting.
  - For any other `turn:*` label, it removes only the other `turn:*` labels and leaves unrelated labels alone.
  - It ignores events it caused itself, which avoids recursion and label races.
  - It never evaluates Issue text.
- **First proof:** the manual #325 handoff showed that labels and comments work as a routing record. It does not prove that autonomous dispatch works or that it saves money.

## Tier 1: owner-started local dispatcher (experimental, not authorized)

Not implemented and not enabled. If the owner later approves a pilot, it starts as one owner-started session with one run: no automatic next task, no retry, and billing measured before and after. Before any watcher runs, it must provide all of the following:

1. **Authorization check:**
   - an owner-authored approval comment that defines the scope;
   - the expected repository and ref;
   - the expected label;
   - all of the handoff fields above.
2. **Isolation:** a dedicated worktree for each run. Headless agents get no repo-wide write access and no broad shell access.
3. **No duplicate dispatch:** an atomic claim or lock, plus a durable execution ID recorded on the Issue.
4. **Fresh state checks before each launch:** the label, `agents:paused`, and the release-state gate fields.
5. **Bounded runtime:**
   - a wall-clock timeout that terminates the whole process tree;
   - per-agent limits that each CLI actually supports (do not assume Codex has Claude's `--max-turns`);
   - one global budget per session.
6. **A tested kill switch:** `agents:paused` blocks new launches, and a documented, tested method terminates processes that are already running.
7. **Safe failure:** any error, timeout or missing field sets `turn:owner` and posts the log path.
8. **An explicit publishing step:** the existing dispatcher only commits locally and does not push. The design must say how a separately approved PR or evidence step happens.
9. **Permissions enforced in code, not prose:** the broad `npm run *` allowance is replaced with named scripts, and more provider environment variables are checked.
10. **Verified billing:** confirm the plan-billed CLI incurs no extra usage and that no credential appears in logs.

## Tier 2: cloud agents (optional measured pilot, not authorized)

| Trigger                                                        | Billing (verify on the live billing page first)                                                   | Notes                                                                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `@codex review` on a PR                                        | ChatGPT plan: cloud-task and code-review limits per 5 hours, plus weekly caps; credits after that | Separate, optional pilot. Measure the share of the weekly limit it uses.                                  |
| Claude GitHub Action (`@claude`) via `CLAUDE_CODE_OAUTH_TOKEN` | Claude subscription, possibly a separate programmatic/Agent SDK credit pool, plus Actions minutes | It is a workflow that invokes AI, so it needs an explicit owner exception to `workflows.instructions.md`. |

The Copilot coding agent is not part of this plan.

ChatGPT chat cannot be triggered by an event. `turn:chatgpt` means the owner opens ChatGPT with the short form in `docs/prompts/CHATGPT-SESSION-BOOTSTRAP.md`. Keep ChatGPT for review and decisions, where the owner is in the loop anyway.

## Packet split (replaces the earlier "PR C")

1. **Tier 0 governance packet:** the labels, `baton-notify.yml` (notify-only, idempotent, least-privilege) and a test-Issue proof. Needs its own owner approval.
2. **Tier 1 hardening and pilot:** only after Tier 0 has run on real packets and the owner approves a measured pilot.

No watcher becomes active until both packets pass.

## Verification (Tier 0 packet)

1. Setting `turn:owner` on a test Issue produces exactly one assignment and one mention. Setting it again does not post a second mention.
2. Setting `turn:codex` removes the other `turn:*` labels and keeps unrelated labels.
3. The workflow makes no AI call and uses only `GITHUB_TOKEN` with `issues: write`.
