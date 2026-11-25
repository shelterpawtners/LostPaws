# Agent baton handoff (OD-009)

Status: **PROPOSED (2026-11-25)**. Not active until the owner and ChatGPT approve it on the restart-review Issue. This brief extends `docs/engineering/AGENT-BRIDGE-PROTOCOL.md`; it does not replace it.

## Problem

GitHub already stores the shared context. What it lacks is a signal telling each tool when it is its turn. Today the owner relays that signal by pasting prompts, and during peak dev sessions with many handoffs the owner becomes the bottleneck.

## Constraints

- No pay-per-token API keys. `scripts/ai-dispatch.ps1` already refuses to run when `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` is set.
- Workflows never invoke an AI agent (`.github/instructions/workflows.instructions.md`).
- Nothing is scheduled. Polling is allowed only while a dev session the owner started is running.
- RED, payments, legal, production database and DNS work always goes back to the owner.

## Tier 0: labels, comment template, notify-only workflow (free)

- **Labels:** `turn:claude`, `turn:codex`, `turn:copilot`, `turn:chatgpt`, `turn:owner`, `needs:decision`, `agents:paused`.
  - An issue carries exactly one `turn:*` label at a time.
  - `agents:paused` set on the repository's pinned control Issue stops every Tier 1 run.
- **Handoff comment:** each agent writes it when it passes the baton, in the protocol's checkpoint format:

  ```
  ### Baton → <next>
  Done: <PRs/SHAs>
  State: <exact state; hosted PASS/FAIL if relevant>
  Blocker/decision: <none | exact question>
  Next action: <one bounded step>
  Hop: <n>/3
  ```

- **`baton-notify.yml`:** runs on `issues: labeled`. It makes no AI calls and uses no secrets beyond `GITHUB_TOKEN`.
  - For `turn:owner` or `needs:decision`, it assigns the owner and posts a one-line mention, so the owner gets a GitHub mobile push only when their input is needed.
  - For any other `turn:*` label, it removes the other `turn:*` labels and does nothing else.

## Tier 1: local baton watcher (billed to existing plans)

`scripts/baton-watch.ps1` is started by the owner at the beginning of a dev session and stopped at the end. It is never a scheduled task.

1. Every N minutes (default 3) it runs `gh issue list --label turn:codex` and `--label turn:claude`. This costs GitHub API calls only, no AI tokens.
2. It does nothing while `agents:paused` is set on the control Issue.
3. For the oldest matching issue it calls `scripts/ai-dispatch.ps1` with a short pointer brief: "Work issue #N per AGENTS.md; finish by posting the baton comment and moving the label." `codex exec` bills against the ChatGPT plan; `claude -p` bills against the Claude subscription (see the billing note below).
4. **Hard limits:**
   - one run at a time;
   - a wall-clock timeout per run (default 30 minutes) and a turn cap (`--max-turns`);
   - a cap per session (default 10 runs);
   - a **hop cap of 3** agent-to-agent passes per issue, after which the watcher sets `turn:owner`;
   - if a run ends without moving the baton, the watcher sets `turn:owner` and posts the log path.
5. Logs go to the gitignored `.ai-runs/`.

`ai-dispatch.ps1` hardening ships in the same PR: the timeout and turn cap, narrowing `npm run *` to named scripts, and checking for more provider environment variables.

## Tier 2: cloud agents (optional pilot, one at a time)

| Trigger                                                        | Billing (verify on the live billing page first)                                                   | Notes                                                                                                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `@codex review` on a PR                                        | ChatGPT plan: cloud-task and code-review limits per 5 hours, plus weekly caps; credits after that | Pilot first. Measure the weekly-limit share used over one week.                                                                     |
| Assign an issue to the Copilot coding agent                    | Copilot allowance (premium requests, or AI credits on usage-based billing) plus Actions minutes   | Only if Tier 1 is the bottleneck.                                                                                                   |
| Claude GitHub Action (`@claude`) via `CLAUDE_CODE_OAUTH_TOKEN` | Claude subscription, possibly a separate programmatic/Agent SDK credit pool, plus Actions minutes | It is a workflow that invokes an agent, so it **conflicts with `workflows.instructions.md`** and needs an explicit owner exception. |

ChatGPT chat cannot be triggered by an event. The `turn:chatgpt` label means the owner opens ChatGPT with "Handle the open `turn:chatgpt` issue" (see `docs/prompts/CHATGPT-SESSION-BOOTSTRAP.md`). Keep ChatGPT for decisions, where the owner is in the loop anyway.

## Change to the continuous-execution contract

AGENTS.md and the bridge protocol say "claim the next safe ready task". Proposed amendment: an agent may continue to a next task **only if that task's issue carries the agent's `turn:` label**, or the owner directed that task in the current session. Everything else ends with the baton comment.

## Verification

1. On a test issue, setting `turn:codex` makes the watcher run one bounded task. A baton comment appears and the label moves. On `turn:owner` the owner gets exactly one notification.
2. Setting `agents:paused` stops the next run.
3. The hop cap forces `turn:owner` on the fourth hop.
4. Record plan usage before and after one pilot day.
