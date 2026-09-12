# AI execution plan — 2026-09-12

Owner-authorized coordination plan for ShelterPawtners/LostPaws launch readiness.

This is the shared operating plan for **ChatGPT advisor + Codex Work + Codex in VS Code + Claude Code**. It is intentionally checkpoint-based so the available five-hour Work/Codex allowance produces completed outcomes instead of one long unfinished task.

## Objective

Move the accepted product as close as possible to reliable live acceptance on `https://shelterpawtners.com` while:

- keeping GitHub `main` as source of truth;
- preserving Claude's current/pending work;
- using Work for live/provider systems;
- using VS Code Codex for repository-native work;
- using ChatGPT as the advisor/control tower;
- optimizing model choice for value per credit.

---

# Current verified state

## Window A1 — production foundation — COMPLETE

Verified:

- Hosted Supabase was behind Track 2 and is now current for the two already-merged PR #131 migrations:
  - `track2_events_foundation`
  - `track2_marketplace_channel_filter`
- Both are present in the hosted migration ledger.
- `public.events` and `public.event_participants` exist with RLS enabled and four policies each.
- The channel-aware `public_active_offers(uuid, public.market_channel)` RPC exists.
- No source/UI/DNS/legal changes were made during the hosted-database update.
- `shelterpawtners.com` is a READY Vercel production alias serving deployment `dpl_EVCBhJZptAZKdU2JefqcCjHww5JK` at product SHA `9c114eada2018664e96ce37b002e901523129722`.
- HTTPS is healthy: HTTP redirects to HTTPS with 308, HTTPS returns 200, HSTS is enabled, TLS verification passed, no insecure DOM resources were found, and no application browser-console warnings were observed. The only console error seen was from the cloud-browser extension.

The live `9c114e…` runtime is accepted as **product-equivalent** even though later `main` commits are ahead, because those later commits are documentation/control-plane-only.

## Window A2 — Google OAuth first attempt — BLOCKED BEFORE OAUTH INITIATION

Verified:

- Live `/login` renders a disabled button labeled **“Google sign-in coming soon.”**
- Deployed source enables Google only when `VITE_GOOGLE_AUTH_ENABLED === "true"`.
- Google authorization was therefore never initiated.
- Supabase callback, apex return, logout/re-login, and Guardian/persona duplicate-continuity testing were not reached.
- No duplicate profile, role, organization, or persona was observed; those checks are still **untested**, not passed.
- No source/UI change is currently required.

### Immediate blocker

An authenticated Vercel owner must:

1. set `VITE_GOOGLE_AUTH_ENABLED=true` for the **Production** environment of the `lost-paws` Vercel project; and
2. cause a successful production deployment containing that build-time flag.

The Vercel ignored-build behavior has therefore changed from a deferred housekeeping issue into an **immediate launch blocker**, because a build-time production configuration change now needs a real deployment.

Do not spend time deploying merely to align documentation SHAs. Resolve the ignored-build behavior only enough to permit the next required production-affecting deployment.

---

# Roles and ownership

## ChatGPT advisor

Use this project chat as the control tower. Responsibilities:

- maintain priority and cross-agent coordination;
- review Work/Codex/Claude handoffs;
- decide whether a problem belongs to Codex, Claude, owner, or provider;
- resolve ambiguous branch dispositions;
- prevent duplicate work;
- decide whether a difficult task justifies stronger reasoning/model escalation.

ChatGPT remains read-only/advisory unless the owner explicitly asks it to take development ownership.

## Codex Work

Use Work for cross-system/browser/provider tasks:

- Vercel;
- hosted Supabase;
- `shelterpawtners.com` live runtime;
- HTTPS/TLS;
- Google OAuth;
- Meta/Facebook provider investigation;
- production browser smoke.

Avoid repo source changes from Work unless a clear live blocker demands one. Hand source changes to VS Code Codex or Claude based on ownership.

## Codex in VS Code

Use VS Code Codex for repository-native work:

- Git history/diffs;
- retained-branch reconciliation;
- precise porting of useful historical deltas;
- code fixes;
- repo migrations/tests;
- commits/PRs.

Do not put Codex on Claude's active branch.

If reconciliation changes are required, create from current `main`:

`release/branch-reconciliation-codex`

## Claude Code

When Claude's allowance returns, Claude resumes the exact current work it owned before its limit was reached. Do not redirect Claude into historical branch reconciliation unless the owner changes this plan.

---

# Model / reasoning policy

Standing default for substantial Work or Codex tasks:

- **Model: Terra**
- **Reasoning: Medium**
- **Fast mode: OFF**

Escalation ladder:

`Terra Low -> Terra Medium -> Terra High -> Sol Medium -> Sol High`

Do not climb automatically.

Use **Low** for mechanical/repetitive work such as route checks, inventories, known test reruns, and straightforward documentation.

Use **Medium** for normal judgment such as provider setup analysis, branch reconciliation, ordinary coding, and migration reasoning.

Use **High** only for a specific difficult problem such as confusing OAuth identity continuity, non-trivial merge ambiguity, RLS/security reasoning, or migration failure/root-cause analysis.

Use **Sol** only as a targeted escalation when Terra proves insufficient for a genuinely difficult problem. Do not use Sol as the default for the whole five-hour window.

Keep **Fast mode OFF** unless speed is more important than allowance efficiency for one urgent step.

| Phase | Environment | Model | Effort | Fast |
| --- | --- | --- | --- | --- |
| Vercel Google-enable/deploy blocker | Work | Terra | Medium | Off |
| Google OAuth live acceptance | Work | Terra | Medium | Off |
| Hard OAuth debugging | Work | Terra High, then Sol Medium only if needed | High / Medium | Off |
| Meta discovery | Work | Terra | Low/Medium | Off |
| Retained-branch reconciliation | VS Code Codex | Terra | Medium | Off |
| Difficult auth/RLS/security/merge case | VS Code Codex | Sol only if Terra is insufficient | Medium/High | Off |
| Routine tests/docs/inventory | VS Code Codex | Terra or lighter available model | Low/Medium | Off |
| Final production smoke | Work | Terra | Low/Medium | Off |

---

# Guardrails

- GitHub `main` remains the release-candidate source of truth.
- Do not blindly merge historical branches.
- Do not delete retained branches until useful deltas are merged or they are explicitly judged superseded/obsolete.
- Do not overwrite Claude's active/pending work.
- Do not change Microsoft 365 MX/SPF/DKIM/DMARC.
- Do not publish unapproved final legal pages.
- Do not decide OD-003 or OD-004.
- Do not invent payment/donation/tax mechanics.
- Do not buy or upgrade services without owner approval.
- Do not weaken RLS, authentication, or tests.
- Facebook remains publicly disabled until callback/account-continuity acceptance is complete.
- Never ask the owner to paste secrets into chat.
- If blocked by credentials/2FA/provider access for roughly 10–15 minutes, record the blocker and move to another independent task.

---

# Five-hour sequence and environment switches

| Window | Environment | Goal | Status |
| --- | --- | --- | --- |
| A1 | Work | Hosted Supabase + Vercel + domain + HTTPS | **COMPLETE** |
| A2a | Work | First Google acceptance attempt | **BLOCKED — flag/deploy** |
| A2b | Work | Resolve ignored-build + set production Google flag + deploy | **NEXT** |
| A2c | Work | Full live Google OAuth acceptance | After A2b |
| A3 | Work | Meta discovery / quick smoke | After Google result |
| B | VS Code Codex + Claude in parallel | Codex branch reconciliation; Claude resumes own work | After live auth checkpoints or when Claude returns |
| C | Work | Final live production acceptance | Final checkpoint |

## Explicit switching rule

Stay in the existing **Launch Readiness Work tab** through A2b/A2c/A3.

Switch **Work -> VS Code Codex** when:

- the immediate live-provider checkpoints are complete or blocked on a true owner/provider-only gate; and
- remaining useful Codex work is repository-native.

When Claude becomes available, Claude may resume its own branch/work while VS Code Codex separately handles retained-branch reconciliation.

Return **VS Code -> Work** for final live production acceptance once intended source changes have settled and the correct deployment is live.

---

# Window A2b — Work: enable Google production flag and restore deployment path — NEXT

Use the existing **Launch Readiness Work tab**.

Recommended setting: **Terra / Medium / Fast OFF**.

Prompt:

```text
Continue ShelterPawtners/LostPaws launch readiness from the verified Google OAuth blocker.

Repository:
shelterpawtners/LostPaws

Read:
- docs/AI-EXECUTION-PLAN-2026-09-12.md
- docs/AI-HANDOFF.md
- docs/CURRENT-WORK.md

Verified blocker:
- live /login shows “Google sign-in coming soon”;
- deployed source requires VITE_GOOGLE_AUTH_ENABLED === "true";
- Google OAuth cannot be accepted until that Production build-time flag is enabled and a successful production deployment is created;
- Vercel ignored-build behavior is now an immediate blocker because the required environment change needs a real deployment.

For this checkpoint only:

1. Inspect the `lost-paws` Vercel Production environment configuration.
2. Set `VITE_GOOGLE_AUTH_ENABLED=true` for Production if authenticated access allows it.
3. Diagnose the existing ignored-build behavior that canceled recent `main` deployments.
4. Make the smallest safe Vercel/project configuration change needed so a required production-affecting build can deploy normally.
5. Do not change source UI/code unless there is evidence that source itself is wrong.
6. Trigger or allow one production deployment containing the enabled Google flag.
7. Verify the deployment reaches READY.
8. Verify `https://shelterpawtners.com/login` now exposes an enabled Google sign-in control.

Important:
- Do not purchase/upgrade Vercel.
- Do not alter Microsoft 365 DNS.
- Do not alter Supabase auth secrets/provider credentials in this checkpoint unless a separate proven blocker requires it.
- Do not touch Meta yet.
- Do not force extra preview/production deployments beyond what is needed to prove the flag is live.
- Do not ask the owner to paste secrets.

If owner login/2FA is required, request exactly the one action needed and continue after access is granted.

At the end report:
- VITE_GOOGLE_AUTH_ENABLED Production state;
- exact ignored-build root cause;
- exact configuration change made, if any;
- new production deployment ID + SHA;
- READY / BLOCKED state;
- whether live /login now has enabled Google sign-in;
- any remaining blocker before full OAuth acceptance.

Then provide:
ADVISOR HANDOFF PROMPT

Make it a concise self-contained prompt for ChatGPT containing only the verified deployment/configuration state, changes made, remaining blocker if any, and whether it is safe to immediately run the full Google OAuth acceptance checkpoint.

Then stop.
```

## Bring A2b back to ChatGPT

Bring the **ADVISOR HANDOFF PROMPT** back immediately if:

- Work changes the ignored-build configuration;
- a production deployment fails or is unexpectedly canceled;
- Work proposes source changes;
- a different Vercel/provider blocker appears;
- Google control is still disabled after a READY deployment.

If A2b is a clean PASS and the Google control is enabled, continue directly to A2c and bring A2b+A2c together if that saves time.

---

# Window A2c — Work: full Google OAuth live acceptance

Stay in the same **Launch Readiness Work tab**.

Recommended setting: **Terra / Medium / Fast OFF**.

Prompt:

```text
Continue from the successful Google-enable production deployment.

Read docs/AI-EXECUTION-PLAN-2026-09-12.md and the latest auth/deployment handoff.

For this checkpoint perform ONLY the complete live Google OAuth acceptance on:
https://shelterpawtners.com

Expected Supabase provider callback:
https://jukmlmryykcnjtpblbja.supabase.co/auth/v1/callback

Verify end to end:
1. Google sign-in is enabled on production.
2. OAuth initiation succeeds.
3. Google authorization succeeds.
4. Supabase callback succeeds.
5. Browser returns to the shelterpawtners.com apex over HTTPS.
6. Existing Guardian/persona continuity is preserved.
7. Logout succeeds.
8. Re-login uses the same account.
9. No duplicate profile, role, organization, or persona is created.

Do not ask the owner to paste credentials or secrets.
If interactive login/2FA requires the owner, request exactly one action and continue afterward.
Do not investigate Meta until this result is known.
Do not make unrelated source/UI changes.

At the end report:
- PASS / BLOCKED / PARTIAL;
- exact failure point if not PASS;
- evidence;
- callback/return result;
- logout/re-login result;
- persona/profile continuity result;
- duplicate-account result;
- whether any source/config change is required.

Then provide:
ADVISOR HANDOFF PROMPT

Make it a concise self-contained prompt for ChatGPT containing the verified Google OAuth outcome, exact blocker if any, any identity/persona risk, and the smallest safe next step.

Then stop.
```

## Bring A2c back to ChatGPT

Bring A2c immediately if it is BLOCKED/PARTIAL, finds identity/persona duplication risk, or proposes source/config changes.

If Google is a clean PASS, proceed to A3 Meta discovery and bring A2c+A3 together if efficient.

---

# Window A3 — Work: Meta discovery

Use the same **Launch Readiness Work tab**.

Recommended setting: **Terra / Low or Medium / Fast OFF**.

Prompt:

```text
Continue ShelterPawtners launch readiness after the Google checkpoint.

Read docs/AI-EXECUTION-PLAN-2026-09-12.md and the latest auth handoff.

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
- assume Instagram consumer login is the same thing;
- continue Claude's current-development work.

If owner action is required, provide the exact action.
If Meta cannot progress safely, stop Meta work and use remaining checkpoint time for a quick production smoke instead.

At the end report:
- Meta status;
- exact blocker/action if any;
- proven vs untested items;
- whether any source change is actually required.

Then provide:
ADVISOR HANDOFF PROMPT

Make it a concise self-contained prompt for ChatGPT with the verified Meta state and smallest safe next step.

Then stop.
```

---

# Window B — VS Code Codex: retained-branch reconciliation

Switch to VS Code when the live-provider checkpoint is complete/blocked on a true owner-only gate, or when Claude is available and Codex can work safely in parallel on a separate repository lane.

Recommended setting: **Terra / Medium / Fast OFF**.

Prompt:

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
Do NOT edit Claude's branch or intentionally continue Claude's current/pending work.

Create from current main only if changes are needed:
release/branch-reconciliation-codex

Goal:
Reconcile historical branches intentionally retained because they contain unique unmerged content.

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
- identify files overlapping Claude's active work;
- stop if the next useful delta requires editing a file Claude is actively changing.

Then provide:
ADVISOR HANDOFF PROMPT

Make it a self-contained prompt for ChatGPT containing:
- branches reviewed;
- unique deltas;
- classifications;
- commits/tests;
- ambiguous decisions needing review;
- whether the next batch is safe.

Then stop after the batch unless the owner explicitly says to continue.
```

Use the short continuation prompt for clean batches:

`Continue with the next 3 retained branches under the same reconciliation rules. Stop for OWNER_REVIEW, CLAUDE_REVIEW, security/auth/RLS ambiguity, or overlap with Claude.`

---

# Window C — Work: final production acceptance

Return to Work after intended source/deployment work has settled.

Recommended setting: **Terra / Low or Medium / Fast OFF**.

Prompt:

```text
Run final ShelterPawtners production acceptance against:
https://shelterpawtners.com

Read docs/AI-EXECUTION-PLAN-2026-09-12.md and the latest handoff before testing.

Use the currently intended live production deployment.
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
- HTTPS/security;
- direct-route refresh;
- navigation;
- critical console/network errors;
- Pet vs RAVE marketplace filtering;
- Events;
- Guardian login/signup entry;
- RAVE Vendor signup entry;
- Google login if enabled.

Representative live viewports only:
360px
390px
430px
tablet portrait
desktop

Do not rerun every historical responsive width unless a problem is found; automated suites already cover the full matrix.

For every defect capture:
- severity P0/P1/P2/P3;
- route;
- viewport;
- reproduction;
- expected vs actual;
- evidence;
- owner: CODEX / CLAUDE / OWNER / PROVIDER.

Do not automatically modify Claude-owned current-development/visual work.

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

This must be a self-contained prompt for ChatGPT containing only proven current state, unresolved defects/gates, responsible owner for each, and the recommended next order.

Then stop.
```

---

# When to bring results back to ChatGPT

Bring an **ADVISOR HANDOFF PROMPT** immediately when:

- a production deployment/configuration change is made;
- production SHA/runtime differs unexpectedly from intended state;
- HTTPS/TLS fails;
- Google OAuth is BLOCKED/PARTIAL;
- identity/persona duplication is possible;
- a production migration/config change is proposed;
- an old branch is useful but conflicts with current architecture/direction;
- RLS/security is involved;
- Codex and Claude would touch the same files;
- an agent recommends escalating to Sol for a hard problem;
- a merge decision is ambiguous.

Routine passing tests, obvious superseded branches, and clean isolated commits do not require immediate interruption.

Always bring the final Window C handoff back to ChatGPT for cross-agent review.

---

# Stop condition

This launch-readiness sprint is complete when remaining work consists only of:

- Claude-owned current/pending development;
- owner login/2FA actions;
- legal approval;
- OD-003 / OD-004 / commercial-policy decisions;
- provider-review constraints;
- clearly documented future/non-launch work.

At that point preserve the handoff and stop adding scope.
