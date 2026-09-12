# AI execution plan — 2026-09-12

Owner-authorized coordination plan for the ShelterPawtners/LostPaws launch-readiness window.

This is the shared operating plan for **ChatGPT advisor + Codex Work + Codex in VS Code + Claude Code**. It defines responsibilities, model/effort guidance, checkpoints, prompts, stop conditions, and the required advisor handoff format so every agent can work from the same plan.

## Objective

Use the available Codex five-hour window efficiently while Claude Code is temporarily unavailable, then run Claude and Codex in parallel without overlapping ownership.

Primary outcome: move the accepted product as close as possible to reliable live acceptance on `https://shelterpawtners.com`, while preserving Claude's paused work and keeping `main` as the source of truth.

The goal is **completed checkpoints**, not consuming every available minute.

## Current verified checkpoint — after Window A1

The production-foundation checkpoint is complete.

Verified facts:

- GitHub `main`: `cbdafa4999e9556ba5f80121d43629e862a6911a`.
- Hosted Supabase was behind Track 2 and is now current for the two already-merged PR #131 migrations:
  - `track2_events_foundation`
  - `track2_marketplace_channel_filter`
- Both migrations are present in the hosted migration ledger.
- `public.events` and `public.event_participants` exist with RLS enabled and four policies each.
- The channel-aware `public_active_offers(uuid, public.market_channel)` RPC exists.
- No source/UI/DNS/legal changes were made during the hosted-database update.
- `shelterpawtners.com` is a READY Vercel production alias serving deployment `dpl_EVCBhJZptAZKdU2JefqcCjHww5JK` at product SHA `9c114eada2018664e96ce37b002e901523129722`.
- HTTPS is healthy: HTTP redirects to HTTPS with 308, HTTPS returns 200, HSTS is enabled, TLS verification passed, no insecure DOM resources were found, and no application console warnings were observed. The only console error observed was from the cloud-browser extension.
- Vercel has not deployed the newer `ba9cfd…` / `cbdafa…` commits because the project's ignored-build behavior canceled those builds.
- The currently deployed `9c114e…` runtime is accepted as **product-equivalent** for current live acceptance because the commits after it are documentation/control-plane-only, not product-runtime changes.
- Do **not** spend launch time forcing a deployment merely to make the documentation-only SHA match.
- Before the next production-affecting code, asset, migration-dependent frontend behavior, or environment/configuration change needs to go live, resolve the ignored-build behavior so Vercel can deploy normally.

Next launch checkpoint: **Google OAuth live acceptance**.

---

# Roles and ownership

## ChatGPT advisor

Read-only/advisory unless the owner explicitly asks for development.

Responsibilities:
- maintain overall priority and cross-agent coordination;
- review Work/Codex/Claude findings;
- decide whether a defect belongs to Codex, Claude, owner, or external provider;
- help resolve ambiguous branch dispositions before historical work is ported;
- prevent duplicate work and scope collision;
- decide when a difficult task justifies escalating model/reasoning effort;
- review human-gate results and recommend the next prompt.

## Codex Work

Use for cross-system/browser/provider work:
- hosted Supabase verification;
- Vercel production verification;
- `shelterpawtners.com` live runtime;
- HTTPS/TLS validation;
- Google OAuth acceptance;
- Meta/Facebook investigation;
- production browser smoke.

Avoid repository source changes from Work unless a clear live blocker requires one. If code must change, hand it to Codex in VS Code or Claude based on ownership.

## Codex in VS Code

Use for repository-native work:
- branch diff/history analysis;
- reconciliation of intentionally retained historical branches;
- precise porting of useful deltas from old branches onto current `main`;
- migrations/tests/source fixes when actually required;
- commits and PRs.

Codex must not work on Claude's active branch.

If changes are required, create from current `main`:

`release/branch-reconciliation-codex`

## Claude Code

When its allowance returns, Claude resumes the exact current work it had already been doing before its limit was reached.

Claude owns its existing current-development/design work. Do not redirect Claude into historical branch reconciliation unless the owner changes this plan.

---

# Model and reasoning policy

## Standing model recommendation

Optimize for **value per credit**, not maximum model strength on every task.

Default operating configuration for substantial Work/Codex tasks:

- **Model: Terra**
- **Reasoning: Medium**
- **Fast mode: OFF**

Escalation ladder:

`Terra Low -> Terra Medium -> Terra High -> Sol Medium -> Sol High`

Do not climb this ladder automatically. Escalate only when the current task demonstrates that deeper reasoning is needed.

Use **Low** for mechanical/repetitive work:
- route checks;
- inventories;
- known test reruns;
- straightforward documentation;
- simple configuration verification.

Use **Medium** for normal judgment:
- production configuration analysis;
- Google/Meta setup analysis;
- branch reconciliation;
- ordinary coding and migration reasoning.

Use **High** only for a specific hard problem:
- confusing OAuth identity/persona continuity;
- non-trivial merge ambiguity;
- RLS/security reasoning;
- migration failure/root-cause analysis.

Use **Sol** only as a targeted escalation when Terra is insufficient for a genuinely difficult problem. Do not make Sol the default for the whole five-hour window.

Keep **Fast mode OFF** unless turnaround speed is more important than allowance efficiency for a specific urgent step.

## Model by phase

| Phase | Environment | Recommended model | Effort | Fast |
| --- | --- | --- | --- | --- |
| Production foundation | Work | Terra | Medium | Off |
| Google OAuth acceptance | Work | Terra | Medium | Off |
| Hard Google/OAuth debugging | Work | Terra High first; Sol Medium only if needed | High / Medium | Off |
| Meta discovery | Work | Terra | Low/Medium | Off |
| Historical branch reconciliation | VS Code Codex | Terra | Medium | Off |
| Difficult auth/RLS/security/merge branch | VS Code Codex | Sol only if Terra proves insufficient | Medium/High | Off |
| Routine tests/docs/branch inventory | VS Code Codex | Terra or lighter available model | Low/Medium | Off |
| Final production smoke | Work | Terra | Low/Medium | Off |

## Prompt-efficiency policy

Avoid giant prompts that ask for every task at once. The repository already contains detailed product and operating context.

Each prompt should:
1. point to authoritative repo docs;
2. define one outcome;
3. identify forbidden overlap;
4. define a stop condition;
5. require a concise evidence-based result;
6. require an **ADVISOR HANDOFF PROMPT** for ChatGPT.

Do not repeatedly reread the whole repository. Reuse conclusions already recorded in handoff docs and inspect only files relevant to the active checkpoint.

After a controller prompt establishes the rules, use short continuation prompts such as `continue with the next 3 retained branches under the same rules` instead of re-pasting the entire plan.

---

# Global guardrails

- GitHub `main` remains the release-candidate source of truth.
- Do not blindly merge historical branches.
- Do not delete retained historical branches until their useful delta is merged or they are explicitly judged superseded/obsolete.
- Do not overwrite Claude's paused/current work.
- Do not change Microsoft 365 MX/SPF/DKIM/DMARC.
- Do not publish unapproved final legal pages.
- Do not decide OD-003 or OD-004.
- Do not invent payment/donation/tax mechanics.
- Do not buy or upgrade services without owner approval.
- Do not weaken RLS, authentication, or tests.
- Facebook stays publicly disabled until callback/account-continuity acceptance is complete.
- If a task is blocked by credentials/2FA/provider access for roughly 10–15 minutes, record the blocker and move to another independent task.
- Prefer existing docs over creating more planning documents.

---

# Five-hour allocation and environment switches

The allowance is divided into recoverable checkpoints rather than one long autonomous task.

| Window | Target | Environment | Goal |
| --- | ---: | --- | --- |
| A1 | ~30–60 min | Work | Hosted Supabase + Vercel + production domain + HTTPS — **COMPLETE** |
| A2 | ~20–45 min | Work | Google OAuth live acceptance — **NEXT** |
| A3 | ~20–30 min max | Work | Meta discovery and/or quick live smoke |
| B1 | after A1–A3 or when Claude returns | VS Code Codex + Claude in parallel | Codex: retained-branch reconciliation. Claude: resume paused current work |
| B2 | ~60–90 min initial batch window | VS Code Codex | Reconcile retained branches in batches of 3 |
| C | final ~30–45 min | Work + ChatGPT advisor | Final live production acceptance and cross-agent handoff |

These are planning targets, not hard limits. Finish early when an outcome is proven.

## Explicit environment switch rules

Stay in the existing **Launch Readiness Work tab** through A2/A3.

Switch from **Work -> VS Code Codex** when either:
- Google/Meta live-system checkpoints are complete and remaining work is repository-native; or
- Claude becomes available and can resume its own current work while Codex separately handles historical branch reconciliation.

Return from **VS Code -> Work** for final live production acceptance after the intended source work has settled.

Use this **ChatGPT project conversation in parallel** as the advisor/control tower. Bring back significant handoffs, ambiguity, risky merge decisions, auth/DB findings, or any proposal to escalate to Sol for a difficult problem.

---

# Window A1 — production foundation — COMPLETE

A1 is complete. Do not rerun it unless production state changes or a later checkpoint finds evidence of regression.

Accepted A1 outcome is recorded in **Current verified checkpoint** at the top of this document.

---

# Window A2 — Codex Work: Google OAuth live acceptance — NEXT

Stay in the existing **Launch Readiness Work tab**.

Recommended setting: **Terra / Medium / Fast OFF**.

Prompt:

```text
Continue ShelterPawtners/LostPaws launch readiness from the completed production-foundation checkpoint.

Repository:
shelterpawtners/LostPaws

Read:
- docs/AI-EXECUTION-PLAN-2026-09-12.md
- docs/AI-HANDOFF.md
- docs/CURRENT-WORK.md

For this checkpoint work ONLY on Google OAuth production acceptance.

Treat deployed SHA `9c114eada2018664e96ce37b002e901523129722` as the accepted live product-equivalent runtime for this checkpoint.
Do NOT block Google acceptance merely because current GitHub main is ahead by documentation/control-plane-only commits.

The Vercel ignored-build behavior must be resolved before the next production-affecting code/config change needs deployment, but it is not a reason to force a documentation-only deployment now.

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
9. No duplicate profile, role, organization, or persona record is created.

Do not ask the owner to paste credentials or secrets.

If browser login/2FA requires the owner, request exactly one action and otherwise continue as far as possible.

Do not investigate Meta until the Google result is known.
Do not make unrelated source/UI changes.
Do not spend time forcing Vercel to deploy documentation-only commits.

At the end report:
- PASS / BLOCKED / PARTIAL
- exact failure point if not PASS
- evidence
- whether a source change is required
- whether an owner/provider action is required
- whether anything discovered makes the Vercel ignored-build behavior immediately blocking rather than deferred

Then provide a final section titled:
ADVISOR HANDOFF PROMPT

Make it a concise, self-contained prompt for ChatGPT containing:
- the verified Google OAuth state;
- exact evidence;
- any duplicate-account/persona finding;
- any blocker;
- whether any source/config change is proposed;
- the smallest safe next decision/recommendation needed.

Do not ask ChatGPT to re-investigate facts already proved.

Then stop.
```

## Bring A2 back to ChatGPT

Bring the **ADVISOR HANDOFF PROMPT** to the ChatGPT project conversation immediately if:
- result is BLOCKED or PARTIAL;
- duplicate identity/persona behavior is found;
- a source/config change is proposed;
- Work thinks the ignored-build behavior has become immediately blocking;
- authentication/RLS/security behavior is ambiguous.

If Google is a clean PASS, continue to A3 first and bring A2+A3 together if that saves time.

---

# Window A3 — Codex Work: Meta discovery / quick live smoke

Use the same **Launch Readiness Work tab**.

Recommended setting: **Terra / Low or Medium / Fast OFF**.

Prompt:

```text
Continue ShelterPawtners launch readiness from the completed production-foundation and Google checkpoints.

Read docs/AI-EXECUTION-PLAN-2026-09-12.md and the current auth handoff.

Investigate the current Facebook/Meta authentication state without enabling it publicly.

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
- assume Instagram consumer login is the same thing;
- continue Claude's current-development work.

If owner action is required, provide the exact action.
If Meta cannot progress safely, stop Meta work and use remaining checkpoint time for a quick production smoke of the apex instead.

At the end provide:
- Meta status
- exact blocker/action if any
- anything proven vs still untested
- whether any source change is actually required

Then provide:
ADVISOR HANDOFF PROMPT

Make it a concise self-contained prompt for ChatGPT with the verified Meta state, exact blocker if any, and the smallest safe next step.

Then stop.
```

## Bring A3 back to ChatGPT

Bring A3 to ChatGPT before switching to VS Code if there is any auth/provider ambiguity or owner decision. If it is straightforward and non-blocking, proceed to the environment switch and bring A2+A3 together.

---

# Window B — switch to VS Code

Switch to **VS Code Codex** when either:
- Claude becomes available again; or
- Work has finished the relevant A2/A3 live-system checkpoints and the remaining work is repository-native.

At this point:
- Claude Code resumes its own existing current work.
- Codex runs separately in VS Code for historical branch reconciliation.
- Do not put Codex on Claude's branch.

Codex branch if source changes are needed:

`release/branch-reconciliation-codex`

Recommended setting: **Terra / Medium / Fast OFF**.

Use Sol only for a specific difficult branch after Terra proves insufficient or the advisor recommends escalation.

## VS Code Codex prompt — retained branch reconciliation

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
2. Read associated issue/PR/commit history to understand original intent.
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
- whether it is safe to run the next batch;
- whether a harder model/reasoning escalation is actually justified for the next problem.

Then stop after the batch unless the owner explicitly tells you to continue.
```

## Bring branch batches back to ChatGPT

Paste the **ADVISOR HANDOFF PROMPT** into the project chat before the next batch if:
- any branch is OWNER_REVIEW;
- any branch is CLAUDE_REVIEW;
- a KEEP change touches current product architecture/auth/RLS/security;
- a conflict is non-trivial;
- a historical branch contradicts current RAVE/LostPaws direction;
- Codex recommends escalating to Sol.

If all three are obviously superseded or clean isolated KEEP items with green tests, the owner may say `continue next 3` without re-pasting the full controller prompt and may bring two clean batches to ChatGPT together.

---

# Claude resume instructions

When Claude's allowance returns, resume Claude in its existing current-work context.

Claude should read:
- `docs/AI-EXECUTION-PLAN-2026-09-12.md`
- `docs/AI-HANDOFF.md`
- `docs/CURRENT-WORK.md`

Claude should:
- resume the exact current work it had already been doing;
- avoid historical retained-branch reconciliation unless specifically reassigned;
- not overwrite Codex's reconciliation branch;
- use the execution-plan document to understand that A1 hosted DB/HTTPS verification is complete and that Codex is handling the separate reconciliation lane.

If Claude and Codex need to touch the same files, stop the lower-priority lane and bring the conflict to ChatGPT advisor before proceeding.

---

# Window C — Codex Work: final production acceptance

Return to the **Launch Readiness Work tab** after:
- Claude has made its current progress for this window;
- Codex VS Code has completed the useful branch-reconciliation batches that fit safely;
- the latest intended production-affecting `main` changes, if any, are actually deployed.

If only documentation/control-plane commits remain ahead of deployed product SHA, do not force a deploy merely for SHA cosmetic parity.

Recommended setting: **Terra / Low or Medium / Fast OFF**.

Prompt:

```text
Run final ShelterPawtners production acceptance against:
https://shelterpawtners.com

Read docs/AI-EXECUTION-PLAN-2026-09-12.md and the latest AI handoff before testing.

Use the currently accepted deployed product runtime.
Do not start new development.

If current main is ahead of production only by documentation/control-plane commits, record the mismatch but do not treat it as a runtime failure.
If current main contains production-affecting changes that are not deployed, treat that as a release blocker and identify the ignored-build/deployment cause.

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
2. accepted production SHA
3. whether any SHA difference is product-affecting or docs/control-plane-only
4. hosted DB status
5. HTTPS status
6. Google OAuth status
7. Meta status
8. branch reconciliation status
9. production smoke result
10. remaining Codex work
11. remaining Claude work
12. remaining owner/provider gates
13. status of Vercel ignored-build behavior and whether it must be resolved before the next production-affecting deployment

Then provide:
ADVISOR HANDOFF PROMPT

This must be the final self-contained prompt for ChatGPT advisor. Include only proven current state, unresolved defects/gates, responsible owner for each, and the recommended next order. Do not repeat resolved history.

Then stop.
```

## Bring final result to ChatGPT

Always bring the final Work **ADVISOR HANDOFF PROMPT** back to ChatGPT. ChatGPT performs the cross-agent final review and recommends what should go to Claude next, what Codex can still finish, and what remains an owner/provider gate.

---

# Required ADVISOR HANDOFF PROMPT format

For significant Work/Codex checkpoints, finish with a section named exactly:

`ADVISOR HANDOFF PROMPT`

It must be directly pasteable into the ShelterPawtners ChatGPT project conversation and include:
- task attempted;
- verified facts/evidence;
- changes actually made;
- commits/PR/SHA where applicable;
- tests/results;
- current blocker or uncertainty;
- risk level;
- recommended next action;
- exact decision requested from ChatGPT, if any.

Do not make the owner translate raw technical logs into a handoff.

## Bring results to ChatGPT immediately when

- production and intended product SHAs disagree in a production-affecting way;
- hosted DB migrations differ from accepted source;
- HTTPS/TLS fails;
- Google OAuth is partial/broken;
- identity duplication is possible;
- a production migration/config change is proposed;
- a historical branch appears valuable but conflicts with newer code;
- Codex and Claude would touch the same files;
- RLS/security is involved;
- an agent proposes changing architecture;
- an agent wants Sol/High for a difficult problem;
- a merge/port decision is uncertain.

## Do not interrupt the agents merely because

- a routine test passed;
- a clearly obsolete docs branch was classified;
- a simple isolated commit succeeded;
- the next reconciliation batch is straightforward;
- Work is proceeding normally through an agreed checklist.

---

# Concurrency rules

It is appropriate to use this ChatGPT project conversation while Codex/Claude are running.

Recommended pattern:
- **Claude Code** = current builder/current unfinished work.
- **Codex VS Code** = repository reconciliation/surgical fixes.
- **Codex Work** = live systems/provider/browser operator.
- **ChatGPT** = advisor/controller/reviewer.

Do not have multiple agents editing the same files simultaneously.

ChatGPT should remain advisory/read-only unless explicitly asked to take development ownership.

---

# Stop condition

The sprint is complete when the remaining work consists only of:
- Claude's intentionally paused/current-development items;
- owner login/2FA actions;
- legal approval;
- OD-003/OD-004/commercial-policy decisions;
- provider-review constraints;
- clearly documented future/non-launch work.

At that point, preserve the handoff and stop adding scope.
