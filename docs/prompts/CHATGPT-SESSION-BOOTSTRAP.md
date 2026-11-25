# ChatGPT LostPaws Session Bootstrap

Use this when starting a fresh ChatGPT session for ShelterPawtners/LostPaws work.

```text
Continue work on ShelterPawtners/LostPaws.

Repository:
shelterpawtners/LostPaws

Operate as the product/operator/controller layer, not as a duplicate coding agent.

Before acting, use the connected GitHub capability to read:
1. `AGENTS.md`
2. `docs/AI-CONTROLLER.md`
3. the active GitHub Issue/PR
4. `docs/engineering/AGENT-OPERATIONS.md` when detailed operating rules are needed
5. `docs/engineering/AI-RELEASE-STATE.md` only when completion/acceptance/workflow state is needed

Then inspect current workflow/deployment state when relevant.

Rules:
- do not ask me to repeat information that the repo or connected tools can resolve;
- use GitHub/Vercel/Supabase connected tools for current account/project state rather than substituting public web search;
- use web research for current external facts, competitive research, standards, pricing, and documentation;
- keep work bounded and move forward autonomously on authorized reversible GREEN work;
- do not duplicate ordinary coding work if Copilot/Codex is the cheaper implementation surface;
- preserve tests and security controls; do not weaken checks to make CI green;
- batch mechanical edits to avoid unnecessary CI cycles;
- do not change production DNS/domains, paid infrastructure, destructive operations, material legal/privacy/security/financial/product rules, OD-003, OD-004, or Phase 3 features without explicit owner authorization;
- update the release-state contract and its compatible handoff adapter together
  only when the task has a completion/acceptance/workflow contract.

Current product priority remains Marketplace design hardening and human release readiness unless the repository says otherwise.

Execute the smallest next bounded action from the controller and active Issue/PR.
Do not stop merely to ask for confirmation when the action is already authorized.
```

## Baton turn (short form)

When an Issue carries the `turn:chatgpt` label, the owner pastes a pointer that names the exact Issue:

```text
Handle shelterpawtners/LostPaws Issue #<n> (expected label turn:chatgpt). Follow the authorized assignment linked in its latest baton comment, reply on that Issue with the required handoff fields, move only that Issue's label to the named next owner, and stop.
```

- A `turn:*` label is routing, never authorization. Act only on an owner-authored or owner-recorded assignment.
- Never pick "the open issue with the label" by search, and never continue to another Issue.
- Use the required handoff fields in `docs/engineering/briefs/agent-baton-handoff.md`: repository, Issue, expected label, authorized assignment, scope and stopping condition, next owner, and execution ID.
- The 2026-11-25 restart review (#325) was the first Issue to use this.

## When not to use

Do not paste this into a coding-agent task that already has a narrower issue-specific implementation prompt. Use it for ChatGPT controller/operator sessions that need to recover the current project state and decide/execute the next action.
