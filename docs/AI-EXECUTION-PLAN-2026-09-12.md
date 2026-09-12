# AI execution plan — 2026-09-12

Owner-authorized coordination plan for the next ShelterPawtners/LostPaws launch-readiness window.

This document is the shared plan for **ChatGPT advisor + Codex Work + Codex in VS Code + Claude Code**. It exists so every agent can see the same responsibilities, order, stop conditions, and handoff format.

## Objective

Use the available Codex five-hour window efficiently while Claude Code is temporarily unavailable for roughly the first two hours, then run Claude and Codex in parallel without overlapping ownership.

Primary outcome: move the accepted product as close as possible to reliable live acceptance on `https://shelterpawtners.com`, while preserving Claude's paused work and keeping `main` as the source of truth.

The goal is **completed checkpoints**, not using every available minute.

## Roles

### ChatGPT advisor

Read-only/advisory unless the owner explicitly asks for development.

Responsibilities:
- maintain overall priority and cross-agent coordination;
- review Work/Codex/Claude findings;
- decide whether a defect belongs to Codex, Claude, owner, or external provider;
- help resolve ambiguous branch dispositions before historical work is ported;
- prevent duplicate work and scope collision;
- review human-gate results and recommend the next prompt.

### Codex Work

Use for cross-system/browser/provider work:
- hosted Supabase verification;
- Vercel production verification;
- `shelterpawtners.com` live runtime;
- HTTPS/TLS validation;
- Google OAuth acceptance;
- Meta/Facebook investigation;
- production browser smoke.

Avoid repo source changes from Work unless a clear live blocker requires one. If code must change, hand it to Codex in VS Code or Claude based on ownership.

### Codex in VS Code

Use for repository-native work:
- branch diff/history analysis;
- reconciliation of the intentionally retained historical branches;
- precise porting of useful deltas from old branches onto current `main`;
- migrations/tests/source fixes when actually required;
- commits and PRs.

Codex must not work on Claude's active branch.

If changes are required, create from current `main`:

`release/branch-reconciliation-codex`

### Claude Code

When its allowance returns, Claude resumes the exact current work it had already been doing before its limit was reached.

Claude owns its existing current-development/design work. Do not redirect Claude into historical branch reconciliation unless the owner changes this plan.

## Global guardrails

- GitHub `main` remains the release-candidate source of truth.
- Do not blindly merge historical branches.
- Do not delete the retained historical branches until their useful delta is merged or they are explicitly judged superseded/obsolete.
- Do not overwrite Claude's paused work.
- Do not change Microsoft 365 MX/SPF/DKIM/DMARC.
- Do not publish unapproved final legal pages.
- Do not decide OD-003 or OD-004.
- Do not invent payment/donation/tax mechanics.
- Do not buy or upgrade services without owner approval.
- Do not weaken RLS, authentication, or tests.
- Facebook stays publicly disabled until its callback/account-continuity acceptance is complete.
- If a task is blocked by credentials/2FA/provider access for roughly 10–15 minutes, record the blocker and move to another independent task.
- Prefer existing docs over creating more planning documents.

## Five-hour allocation

The five-hour allowance is divided into recoverable checkpoints rather than one long task.

| Window | Target time | Tool | Goal |
| --- | ---: | --- | --- |
| A1 | 0:00–0:45 | Codex Work | Hosted Supabase + Vercel + production domain + HTTPS |
| A2 | 0:45–1:30 | Codex Work | Google OAuth production acceptance |
| A3 | 1:30–2:00 | Codex Work | Meta discovery and/or quick live smoke if Google finishes early |
| B1 | ~2:00–3:30 | Codex VS Code + Claude Code in parallel | Codex: retained branch reconciliation. Claude: resume paused current work |
| B2 | 3:30–4:15 | Codex VS Code | Next reconciliation batch or a targeted non-Claude release fix |
| C | 4:15–5:00 | Codex Work + ChatGPT advisor | Final live production acceptance and human/Claude/Codex handoff |

These are planning targets, not hard limits. Finish early when an outcome is proven.

## Prompt-size / reasoning policy

Avoid giant prompts that ask for every task at once. The repository already contains the detailed product and operating context.

Each prompt should:
1. point to the authoritative repo docs;
2. define one outcome;
3. identify forbidden overlap;
4. define a stop condition;
5. require a concise evidence-based result;
6. require an **ADVISOR HANDOFF PROMPT** for ChatGPT.

Default to a capable medium reasoning mode. Increase reasoning only for genuinely ambiguous areas such as RLS/security, OAuth identity continuity, migration failures, or conflicting historical implementations. Use a faster/lower-cost mode for repetitive inventories, simple diff classification, test reruns, or documentation.

Do not repeatedly reread the entire repository. Reuse conclusions already recorded in handoff docs and inspect only files relevant to the active checkpoint.

---

# Window A1 — Codex Work: production foundation

Use **Work mode**, not VS Code.

Prompt:

```text
Continue ShelterPawtners/LostPaws launch readiness.

Repository:
shelterpawtners/LostPaws

Read first:
- docs/AI-EXECUTION-PLAN-2026-09-12.md
- docs/AI-HANDOFF.md
- docs/CURRENT-WORK.md
- docs/OPEN-ITEMS-2026-09-12.md
- docs/AI-OPERATING-PROTOCOL.md

Do NOT continue Claude Code's paused current-development work.

For this checkpoint only:
1. Confirm current GitHub main SHA.
2. Compare hosted Supabase migration state with current main.
3. Verify the Track 2 Events + marketplace-audience migrations are applied.
4. If repo-approved migrations are missing and authenticated access permits it, apply only those migrations and verify them.
5. Verify Vercel production is deploying current main.
6. Verify https://shelterpawtners.com is the current production deployment.
7. Validate HTTPS/TLS:
   - valid certificate
   - HTTP -> HTTPS
   - no mixed content
   - no insecure auth/API calls
   - no browser security warnings

Do not:
- modify Microsoft 365 mail DNS
- change product UI
- publish legal pages
- work on retained historical branches yet
- touch Claude's paused work

If a human login/2FA step blocks one system, tell me the exact step and continue checking the other systems.

At the end report only:
- main SHA
- deployed SHA
- hosted migration status
- HTTPS status
- exact blockers
- evidence/links used

Then provide a final section titled:
ADVISOR HANDOFF PROMPT

That section must be a concise, self-contained prompt I can paste directly to ChatGPT. It must contain:
- the verified facts above;
- any changes actually made;
- any uncertain items clearly labeled uncertain;
- exact blockers;
- the one or two decisions/questions ChatGPT should evaluate next.

Do not ask ChatGPT to re-investigate facts you already proved.

Then stop.
```

### Bring the result to ChatGPT

Immediately after Work returns its checkpoint, paste the **ADVISOR HANDOFF PROMPT** into the project ChatGPT conversation before starting A2 if any of these occurred:
- a migration was applied;
- deployed SHA does not match `main`;
- TLS/HTTPS is not fully clean;
- Work found a production/runtime inconsistency;
- Work recommends a code/config change.

If everything is clean and no decision is needed, proceed directly to A2 and bring both A1 + A2 handoffs to ChatGPT together.

---

# Window A2 — Codex Work: Google OAuth

Stay in **Work mode**.

Prompt:

```text
Continue from the verified ShelterPawtners production state.

Read docs/AI-EXECUTION-PLAN-2026-09-12.md and the latest handoff state.

For this checkpoint work ONLY on Google OAuth production acceptance.

Target:
https://shelterpawtners.com

Expected Supabase callback:
https://jukmlmryykcnjtpblbja.supabase.co/auth/v1/callback

Verify end to end:
1. Google login is enabled where intended.
2. Authentication initiates normally.
3. Google authorization succeeds.
4. Supabase callback succeeds.
5. Browser returns to the apex over HTTPS.
6. Existing Guardian/persona continuity is preserved.
7. Logout succeeds.
8. Re-login uses the same account.
9. No duplicate profile, role, or organization is created.

Do not ask the owner to paste credentials/secrets.

If browser login/2FA requires the owner, request exactly one action and otherwise continue as far as possible.

Do not investigate Meta unless Google finishes early.
Do not make unrelated source/UI changes.

At the end report:
- PASS / BLOCKED / PARTIAL
- exact failure point if not PASS
- evidence
- whether a source change is required
- whether an owner/provider action is required

Then provide:
ADVISOR HANDOFF PROMPT

Make it a concise self-contained prompt for ChatGPT containing the verified OAuth state, exact evidence, any duplicate-account/persona finding, any blocker, and the next decision/recommendation needed.

Then stop.
```

### Bring the result to ChatGPT

Bring A2 to ChatGPT immediately if it is BLOCKED/PARTIAL, finds duplicate identity/persona behavior, or recommends changing auth/source/config.

If PASS, Codex Work may continue into A3 first, then bring A2+A3 together.

---

# Window A3 — Codex Work: Meta discovery / quick live smoke

Use **Work mode**.

Prompt:

```text
Continue ShelterPawtners launch readiness.

Read docs/AI-EXECUTION-PLAN-2026-09-12.md and current auth handoff.

Investigate current Facebook/Meta authentication state without enabling it publicly.

Determine:
- what is already configured;
- what is still required for Supabase callback acceptance;
- whether a Facebook identity can be created/linked without duplicate persona/profile creation;
- whether legal/app-review requirements block public activation.

Do not:
- publish the Meta app;
- enable Facebook publicly;
- alter legal pages;
- request unnecessary permissions;
- assume Instagram consumer login is the same thing.

If owner action is required, provide the exact action.
If Meta cannot progress safely, stop Meta work and use remaining checkpoint time for a quick production smoke of the apex instead.

At the end provide:
- Meta status
- exact blocker/action if any
- anything proven vs still untested

Then provide:
ADVISOR HANDOFF PROMPT

Make it a concise self-contained prompt for ChatGPT with the verified Meta state and the smallest safe next step.

Then stop.
```

### Bring the result to ChatGPT

Bring A3 to ChatGPT before switching to VS Code so the advisor can confirm whether any auth/provider issue should alter the next plan.

---

# Window B — switch to VS Code

**Switch to VS Code when either:**
- Claude becomes available again, or
- Work has finished A1/A2/A3 and the remaining work is repository-native.

At this point:
- Claude Code resumes its own existing current work.
- Codex runs separately in VS Code for historical branch reconciliation.
- Do not put Codex on Claude's branch.

Codex branch if source changes are needed:

`release/branch-reconciliation-codex`

## VS Code Codex prompt — branch reconciliation

```text
Work on ShelterPawtners/LostPaws retained-branch reconciliation.

Start from latest origin/main.

Read:
- docs/AI-EXECUTION-PLAN-2026-09-12.md
- docs/BRANCH-RETIREMENT-2026-09-12.md
- docs/AI-HANDOFF.md
- docs/CURRENT-WORK.md
- docs/AI-OPERATING-PROTOCOL.md

Claude Code may be working concurrently on its own current-development branch.
Do NOT edit Claude's branch or intentionally continue Claude's paused/current work.

Create from current main only if changes are needed:
release/branch-reconciliation-codex

Goal:
Reconcile the historical branches intentionally retained because they contain unique unmerged content.

Process only 3 branches per batch.

For each branch:
1. Compare actual content against current main.
2. Read associated issue/PR/commit history to understand the original intent.
3. Identify the unique delta.
4. Classify meaningful deltas as:
   KEEP
   SUPERSEDED
   CONFLICTS_WITH_CURRENT_DIRECTION
   OWNER_REVIEW
   CLAUDE_REVIEW
5. For KEEP:
   - port only the still-valid delta onto the current-main reconciliation branch;
   - never blindly merge the historical branch;
   - preserve newer main behavior;
   - run targeted tests.
6. Be especially conservative with old LostPaws/RAVE branches because product direction changed after many were created.
7. Do not delete retained branches yet.

After each 3-branch batch:
- commit completed KEEP work if applicable;
- leave git status clean;
- report all three dispositions and evidence;
- identify any files that overlap Claude's active work;
- stop if the next useful delta requires editing a file Claude is actively changing.

At the end of each batch provide:
ADVISOR HANDOFF PROMPT

Make it a self-contained prompt for ChatGPT containing:
- the three branches reviewed;
- exact unique deltas found;
- KEEP/SUPERSEDED/CONFLICTS/OWNER_REVIEW/CLAUDE_REVIEW decisions;
- commits/tests produced;
- any ambiguous merge/porting decision ChatGPT should review;
- whether it is safe to run the next batch.

Then stop after the batch unless the owner explicitly tells you to continue.
```

### Bring every batch to ChatGPT

Paste each **ADVISOR HANDOFF PROMPT** into the project chat before telling Codex to process the next batch if:
- any branch is OWNER_REVIEW;
- any branch is CLAUDE_REVIEW;
- a KEEP change touches current product architecture/auth/RLS;
- a conflict is non-trivial;
- a historical branch contradicts current RAVE/LostPaws direction.

If all three are obviously superseded or clean isolated KEEP items with green tests, the owner may immediately say “continue next 3” and bring two batches to ChatGPT together.

---

# Window C — Codex Work: final production acceptance

Return to **Work mode** after:
- Claude has made its current progress for this window;
- Codex VS Code has completed the useful branch-reconciliation batches that fit safely;
- latest intended `main` is deployed.

Prompt:

```text
Run final ShelterPawtners production acceptance against:
https://shelterpawtners.com

Read docs/AI-EXECUTION-PLAN-2026-09-12.md and the latest AI handoff before testing.

Use the currently deployed main.
Do not start new development.

Check public routes:
/
/marketplace
/rave
/lostpaws
/events
/login
/register

Check:
- HTTPS/security
- direct-route refresh
- navigation
- critical console/network errors
- Pet vs RAVE marketplace filtering
- Events
- Guardian login/signup entry
- RAVE Vendor signup entry
- Google login if enabled

Representative live viewports only:
360px
390px
430px
tablet portrait
desktop

Do not rerun every historical responsive width unless a problem is found; existing automated suites already cover the full matrix.

For every defect capture:
- severity P0/P1/P2/P3
- route
- viewport
- reproduction
- expected vs actual
- evidence
- owner: CODEX / CLAUDE / OWNER / PROVIDER

Do not automatically modify Claude-owned visual/current-development work.

Update only existing handoff/open-items docs for material state changes.

Final report:
1. current main SHA
2. production SHA
3. hosted DB status
4. HTTPS status
5. Google OAuth status
6. Meta status
7. branch reconciliation status
8. production smoke result
9. remaining Codex work
10. remaining Claude work
11. remaining owner/provider gates

Then provide:
ADVISOR HANDOFF PROMPT

This must be the final self-contained prompt for ChatGPT advisor. Include only proven current state, unresolved defects/gates, responsible owner for each, and the recommended next order. Do not repeat resolved history.

Then stop.
```

## Bring final result to ChatGPT

Always bring the final Work **ADVISOR HANDOFF PROMPT** back to ChatGPT. ChatGPT then performs the cross-agent final review and recommends what should go to Claude next, what Codex can still finish, and what remains an owner/provider gate.

## Concurrency rules

It is appropriate to use this ChatGPT project conversation while Codex/Claude are running.

Recommended pattern:
- **Claude Code** = current builder.
- **Codex VS Code** = repository reconciliation/surgical fixes.
- **Codex Work** = live systems/provider/browser operator.
- **ChatGPT** = advisor/controller/reviewer.

Do not have all agents editing the same files simultaneously.

ChatGPT should remain advisory/read-only unless explicitly asked to take development ownership.

## Stop condition

The sprint is complete when the remaining work consists only of:
- Claude's intentionally paused/current-development items;
- owner login/2FA actions;
- legal approval;
- OD-003/OD-004/commercial-policy decisions;
- provider-review constraints;
- clearly documented future/non-launch work.

At that point, preserve the handoff and stop adding scope.
