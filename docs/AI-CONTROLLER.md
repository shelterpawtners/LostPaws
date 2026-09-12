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
- Accepted live runtime product SHA before the current forced deployment: `9c114eada2018664e96ce37b002e901523129722`.
- Production `VITE_GOOGLE_AUTH_ENABLED=true` has been set by the owner.

### Deployment automation improvement

The prior manual Vercel ignored-build toggle is retired as the normal operating pattern.

`scripts/vercel-ignore-build.sh` now supports explicit commit-message controls:

- `[deploy]` => force a Vercel build.
- `[skip deploy]` => force a Vercel skip when intentionally safe.
- Otherwise the existing change-impact classifier decides automatically.

This allows agents to trigger rebuilds for environment-variable-only changes without requiring the owner to toggle Vercel settings manually.

Commit `5baee666d3e6084a6f01494a85305db6648bb448` added this behavior with `[deploy]`, so that commit itself should force a production build using the already-set Google environment flag.

### Google OAuth

Status: **WAITING FOR FORCED PRODUCTION BUILD / THEN LIVE ACCEPTANCE**.

Once the deployment is READY, verify:

- usable Google sign-in on `/login`;
- Google authorization;
- Supabase callback;
- return to apex;
- logout/re-login;
- Guardian/persona continuity;
- no duplicate profile/role/organization/persona behavior.

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

1. Verify Vercel receives and builds commit `5baee666d3e6084a6f01494a85305db6648bb448` rather than skipping it.
2. Wait for the production deployment to become READY.
3. Verify `https://shelterpawtners.com/login` presents usable Google sign-in.
4. Continue immediately into full Google OAuth live acceptance.
5. If Google passes cleanly, continue into Meta/Facebook configuration discovery while keeping Facebook publicly disabled.
6. If Meta becomes externally blocked, run a quick live production smoke and update this controller.

Do not ask the owner to manually toggle Vercel Ignored Build Step for ordinary future environment-only rebuilds. Use an explicit `[deploy]` commit instead.

---

## AUTONOMOUS CONTINUATION RULES FOR WORK

Codex Work should not stop after every successful sub-step.

It is authorized to continue through the following sequence without another owner prompt when the prior checkpoint passes cleanly:

1. Forced Vercel production deployment.
2. Full Google OAuth acceptance.
3. Meta/Facebook configuration discovery only, keeping Facebook publicly disabled.
4. Quick live production smoke if Meta becomes externally blocked.

Stop and request advisor/owner review only when one of these occurs:

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
4. proactively look for process improvements and bottlenecks, not merely answer the immediate blocker;
5. prefer durable automation over repeated manual owner handoffs;
6. provide the smallest next decision or prompt;
7. update this controller if the operating plan/next action materially changes.

The advisor should treat repeated manual handoffs as a process smell and actively replace them with safe automation whenever practical.

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
TIME: 2026-09-12 17:30 EDT
STATUS: PASS
CHECKPOINT: Google OAuth production acceptance
PROVEN:
- Forced deployment `dpl_4x32sTRgy9f1Knvt7xcNEqD9967P` is READY at `5baee666d3e6084a6f01494a85305db6648bb448` and serves the apex.
- Live `/login` shows enabled `Continue with Google`; Facebook remains disabled.
- Google authorization, Supabase callback, HTTPS apex return, sign-out, and Google re-login all passed.
- Before and after re-login, the tested account had exactly one auth user, one profile, and one Google identity; no organization, membership, or guardianship record was created.
CHANGED:
- none
BLOCKERS:
- none for Google OAuth.
RISKS_OR_UNCERTAINTY:
- Meta/Facebook acceptance remains untested and stays publicly disabled.
NEXT_RECOMMENDED_ACTION:
- Continue read-only Meta/Facebook configuration discovery while preserving the disabled public UI.
ADVISOR_REVIEW_REQUIRED: NO
ADVISOR_QUESTION:
- none