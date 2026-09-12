# ShelterPawtners AI Controller

This is the compact live control-plane document for coordinating **Codex Work**, **Codex in VS Code**, **Claude Code**, and **ChatGPT advisor**.

Use this file for CURRENT STATUS, NEXT ACTION, BLOCKERS, and HANDOFFS.

The longer guardrails, model guidance, prompts, and environment-switch rules remain in:

- `docs/AI-EXECUTION-PLAN-2026-09-12.md`
- `docs/AI-HANDOFF.md`
- `docs/AI-OPERATING-PROTOCOL.md`

Do not duplicate the entire execution plan here. Keep this file short enough that every agent can reread it cheaply.

---

## CURRENT STATUS

Updated 2026-09-12.

### Production/runtime

- Hosted Supabase is current for the two already-merged PR #131 Track 2 migrations:
  - `track2_events_foundation`
  - `track2_marketplace_channel_filter`
- `public.events` and `public.event_participants` exist with RLS enabled.
- Channel-aware `public_active_offers(uuid, public.market_channel)` exists.
- Live production is `https://shelterpawtners.com`.
- HTTPS/TLS is healthy.
- Accepted live runtime product SHA: `9c114eada2018664e96ce37b002e901523129722`.
- Newer `main` commits after that live SHA are currently documentation/control-plane-only.

### Google OAuth

Status: **BLOCKED BEFORE OAUTH INITIATION**.

Verified blocker:

- Live `/login` renders disabled `Google sign-in coming soon`.
- Deployed code enables Google only when `VITE_GOOGLE_AUTH_ENABLED === "true"`.
- Vercel Production needs `VITE_GOOGLE_AUTH_ENABLED=true` followed by a successful production deployment.
- The Vercel ignored-build behavior must therefore be resolved now; it is no longer merely a documentation-SHA mismatch.

Untested until the new deployment succeeds:

- Google authorization
- Supabase callback
- return to apex
- logout/re-login
- Guardian/persona continuity
- duplicate profile/role/organization/persona behavior

### Meta/Facebook

Public Facebook login remains disabled. Do not enable it until Google is accepted and Meta callback/account-continuity checks are completed.

### Historical branches

Retained historical branches still require reconciliation. They must be reviewed in small batches from current `main`; do not wholesale merge them.

### Claude ownership

Claude resumes its own paused current-development/design work when available. Codex must not continue or overwrite that work.

---

## NEXT ACTION

### Active lane: Codex Work

Stay in the existing **Launch Readiness Work tab**.

Recommended setting:

- Model: Terra
- Reasoning: Medium
- Fast: OFF

Goal:

1. In Vercel project `lost-paws`, verify/set Production env var `VITE_GOOGLE_AUTH_ENABLED=true`.
2. Resolve the project's ignored-build behavior only as much as needed to permit the next real production build.
3. Trigger/allow one successful production deployment containing the Google flag.
4. Verify `https://shelterpawtners.com/login` now presents usable Google sign-in.
5. Continue immediately into full Google OAuth live acceptance if deployment succeeds.

Do not spend time deploying merely to synchronize documentation-only commits. The deployment is required now because the Google build-time flag is a production-affecting configuration change.

If Vercel requires owner login/2FA, request the exact single owner action and continue as soon as access is available.

---

## AUTONOMOUS CONTINUATION RULES FOR WORK

Codex Work should not stop after every successful sub-step.

It is authorized to continue through the following sequence without another owner prompt when the prior checkpoint passes cleanly:

1. Vercel Google flag + successful production deployment.
2. Full Google OAuth acceptance.
3. Meta/Facebook configuration discovery only, keeping Facebook publicly disabled.
4. Quick live production smoke if Meta becomes externally blocked.

Stop and request advisor/owner review only when one of these occurs:

- production source/config change beyond the approved Google flag/deployment fix is proposed;
- destructive DB/data change would be required;
- OAuth shows possible duplicate identity/profile/persona behavior;
- auth/RLS/security behavior is ambiguous;
- Microsoft 365 DNS would be touched;
- legal publication is required;
- paid upgrade/purchase is proposed;
- Work would overlap Claude's active source files;
- Work cannot proceed without an owner login/2FA action;
- a provider/account restriction makes the intended action unsafe or unclear.

Otherwise, keep moving and update this controller after each material checkpoint.

---

## REQUIRED CONTROLLER UPDATE FORMAT

After every material checkpoint, Codex Work / Codex VS Code / Claude should update this file's `LATEST AGENT UPDATE` section with a compact entry using this format:

```text
AGENT: WORK | CODEX_VSCODE | CLAUDE
TIME: <local timestamp if known>
STATUS: PASS | PARTIAL | BLOCKED | COMPLETE
CHECKPOINT: <short name>
PROVEN:
- <facts only>
CHANGED:
- <exact changes; "none" if none>
BLOCKERS:
- <exact blocker; "none" if none>
RISKS_OR_UNCERTAINTY:
- <only unresolved uncertainty>
NEXT_RECOMMENDED_ACTION:
- <one smallest next action>
ADVISOR_REVIEW_REQUIRED: YES | NO
ADVISOR_QUESTION:
- <specific question, or "none">
```

Keep only the latest few updates here; durable detail belongs in existing handoff/open-items docs.

---

## CHATGPT ADVISOR SYNC PROTOCOL

Important limitation: updating GitHub does **not automatically wake or message the existing ChatGPT conversation**.

The owner can trigger advisor review with a very short message in the project chat:

> `Sync AI controller and continue.`

When the owner sends that phrase, ChatGPT should:

1. read `docs/AI-CONTROLLER.md` from GitHub;
2. read only the additional referenced file/issue/PR needed for the current blocker;
3. evaluate the latest agent update;
4. provide the smallest next decision or prompt;
5. update this controller if the operating plan/next action materially changes.

This avoids copying long Work/Codex outputs into chat and avoids repeatedly reloading the full project history.

For urgent human gates, the owner may instead paste only the exact blocker and ask ChatGPT to `sync controller`.

---

## VS CODE CODEX TRIGGER

Switch to **Codex in VS Code** when:

- live-provider work is complete or externally blocked; and
- the next useful work is repository-native; or
- Claude is available and can resume its own lane while Codex separately reconciles historical branches.

VS Code Codex should read:

- `docs/AI-CONTROLLER.md`
- `docs/AI-EXECUTION-PLAN-2026-09-12.md`
- `docs/BRANCH-RETIREMENT-2026-09-12.md`

Use branch from latest `main` only if changes are required:

`release/branch-reconciliation-codex`

Process retained historical branches in batches of 3 under the existing reconciliation rules.

After each batch:

- update `LATEST AGENT UPDATE` here;
- stop for `OWNER_REVIEW` / `CLAUDE_REVIEW` / non-trivial auth-RLS-architecture conflicts;
- otherwise continue the next small batch if the owner has authorized continued autonomous reconciliation.

---

## CLAUDE RESUME TRIGGER

When Claude becomes available:

1. Claude reads `docs/AI-CONTROLLER.md` first.
2. Claude resumes only its own paused/current-development lane.
3. Claude does not take over historical branch reconciliation unless explicitly reassigned.
4. Claude records any overlap/conflict in `LATEST AGENT UPDATE` rather than silently editing Codex-owned reconciliation work.

---

## MODEL / CREDIT GUARDRAIL

Default:

- Terra / Medium / Fast OFF

Use Terra Low for mechanical verification.
Use Terra High only for a specific difficult problem.
Use Sol only as targeted escalation when Terra is demonstrably insufficient for a high-value ambiguity such as auth identity continuity, RLS/security, migration failure, or non-trivial merge conflict.

Prefer small recoverable checkpoints over one long autonomous job.

---

## LATEST AGENT UPDATE

AGENT: WORK
TIME: 2026-09-12 17:00 EDT
STATUS: BLOCKED
CHECKPOINT: Vercel redeploy verification
PROVEN:
- The owner-triggered production redeploy is visible as `dpl_6TvgQwW27EHJP6ZdNA83oerFKB9J`, created recently for commit `132fe775`.
- That redeploy and its original deployment `dpl_CUP5z9APQU8D3y1ArFCLujj1yNu5` are both `CANCELED`.
- The apex remains mapped to READY deployment `dpl_EVCBhJZptAZKdU2JefqcCjHww5JK` at accepted runtime `9c114eada2018664e96ce37b002e901523129722`.
- No further deploy or redeploy was triggered by Work.
CHANGED:
- none
BLOCKERS:
- Vercel’s ignored-build behavior still cancels the required production build; the new Google production flag cannot take effect until one build completes.
RISKS_OR_UNCERTAINTY:
- Live Google OAuth remains blocked before initiation; callback and identity-continuity behavior remain untested.
NEXT_RECOMMENDED_ACTION:
- In Vercel project settings, identify and disable/correct the ignored-build step for the `lost-paws` production deployment, then request one new deployment.
ADVISOR_REVIEW_REQUIRED: YES
ADVISOR_QUESTION:
- What is the current ignored-build command/setting shown in Vercel for this project?