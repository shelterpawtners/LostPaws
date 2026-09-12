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

- Hosted Supabase is current for the two already-merged PR #131 Track 2 migrations.
- `public.events` and `public.event_participants` exist with RLS enabled.
- Channel-aware `public_active_offers(uuid, public.market_channel)` exists.
- Live production is `https://shelterpawtners.com`.
- HTTPS/TLS is healthy.
- Production `VITE_GOOGLE_AUTH_ENABLED=true` is live.

### Deployment automation

The prior manual Vercel ignored-build toggle is retired as the normal operating pattern.

`scripts/vercel-ignore-build.sh` supports explicit commit-message controls:

- `[deploy]` => force a Vercel build;
- `[skip deploy]` => explicitly skip when intentionally safe;
- otherwise the existing change-impact classifier decides automatically.

Agents should use the Git-driven trigger rather than asking the owner to repeatedly change Vercel settings.

### Google OAuth

Status: **PASS**.

Work verified live production Google OAuth end to end:

- enabled live entry;
- Google authorization;
- Supabase callback;
- HTTPS apex return;
- sign-out;
- re-login;
- stable one-user / one-profile / one-Google-identity counts;
- no duplicate identity/profile/persona behavior observed.

### Meta/Facebook

Status: **EXTERNALLY BLOCKED / CORRECTLY DISABLED**.

- Source integration uses provider `facebook` and the same deployment-base-aware OAuth return helper.
- Production keeps Facebook disabled through `VITE_FACEBOOK_AUTH_ENABLED !== "true"`.
- Live UI remains `Facebook sign-in coming soon`.
- Real provider-console callback and identity-continuity acceptance require authorized Meta/provider access.
- Do not enable Facebook publicly until callback + account-continuity acceptance passes.

### Public smoke

Work passed `/`, `/marketplace`, `/lostpaws`, `/rave`, and `/events` with expected headings and no application console errors.

### Seven Star Shelters — new parallel product lane

Owner approved a second RAVE Shelter festival activation:

**Seven Star Shelters — Spread Shelter Love**

Authoritative brief:

`docs/SEVEN-STAR-SHELTERS-LANDING-BRIEF.md`

This should be built as a normal React route in the existing Vite app, not a standalone unmanaged HTML page.

Recommended route:

`/sevenstars`

The brief includes:

- mission/copy;
- Seven Stars / GRiZ / GRiZMAS research-grounded links;
- no-affiliation guardrails;
- early engagement CTAs;
- vendor + marketplace reuse;
- design direction based on the approved Seven Star Shelters visual concept;
- explicit direction to reduce obvious AI-generated visual artifacts.

### Historical branches

Retained historical branches still require reconciliation. Do not wholesale merge them.

### Claude ownership

Claude resumes its own paused current-development/design work when available. Codex must not overwrite Claude-owned work.

---

## NEXT ACTIONS

### Lane A — Codex Work: launch readiness

Stay in the existing **Launch Readiness Work tab**.

Recommended setting:

- Model: Terra
- Reasoning: Medium
- Fast: OFF

On next sync:

1. Treat Google OAuth as accepted and do not retest unless production changes touch auth.
2. Treat Meta as externally blocked and leave Facebook disabled.
3. Do not wait on Meta. Move to the next independent launch-readiness work.
4. Run the remaining final production acceptance from `docs/AI-EXECUTION-PLAN-2026-09-12.md` that is still relevant after the already-passed public smoke.
5. Specifically verify the currently deployed production SHA, whether any newer `main` delta is product-affecting, and whether Vercel is now following the Git-driven deployment policy normally.
6. Record any remaining true release blockers, owner/provider gates, or production-affecting source changes.
7. Update this controller and continue autonomously through routine PASS checkpoints.

Do not stop merely because Meta provider access is unavailable.

### Lane B — Seven Star Shelters: parallel repository build

This is independent of the launch-provider lane and can proceed in parallel on a separate branch.

Owner-approved goal:

Create an early production-capable `/sevenstars` page so promotion, vendor recruitment, and community engagement can begin before the festival.

Read first:

- `docs/SEVEN-STAR-SHELTERS-LANDING-BRIEF.md`
- `docs/AI-CONTROLLER.md`
- current `/lostpaws` and `/rave` implementations

Implementation guidance:

- normal React/Vite route, not standalone HTML;
- reuse existing RAVE registration and `?channel=rave` marketplace flows;
- original Seven Star Shelters design system, informed by the approved visual concept;
- use clean intentional visual assets, not faux festival photography or AI-looking crowds/signage;
- link outward to verified GRiZ / Seven Stars / GRiZMAS resources;
- prominently retain independent/no-affiliation disclosure;
- do not invent partnerships, donation mechanics, or endorsement;
- ship useful early-engagement MVP before perfect visual polish.

Recommended branch if Codex owns this lane:

`feat/seven-star-shelters-landing`

Do not mix this work into the historical branch-reconciliation branch.

Before merge, require targeted route/responsive/accessibility tests and confirm no regression to `/lostpaws`, `/rave`, or the shared marketplace.

---

## AUTONOMOUS CONTINUATION RULES

Agents should not stop after routine successful substeps.

Stop for advisor/owner review only when one of these occurs:

- destructive DB/data change is proposed;
- OAuth shows duplicate identity/profile/persona behavior;
- auth/RLS/security behavior is ambiguous;
- Microsoft 365 DNS would be touched;
- legal publication is required;
- paid upgrade/purchase is proposed;
- an agent would overlap another agent's active source files;
- owner login/2FA is genuinely required;
- an external provider restriction makes an action unsafe or unclear;
- a new product claim implies sponsorship, official festival affiliation, charitable partnership, tax treatment, or guaranteed funding.

Otherwise keep moving and update this controller after material checkpoints.

---

## CHATGPT ADVISOR ROLE / PROCESS IMPROVEMENT RULE

ChatGPT advisor is the project-management/control-tower role.

On every sync it should:

1. read this controller;
2. inspect only the additional evidence needed;
3. challenge inefficient process and repeated manual handoffs;
4. prefer durable automation and parallelization over owner babysitting;
5. protect product direction, release safety, and agent ownership boundaries;
6. update this controller when next-action logic materially changes.

The owner can trigger advisor review with:

> `Sync AI controller and continue.`

Repeated manual handoffs are a process smell and should be removed when safe automation is available.

---

## MODEL / CREDIT GUARDRAIL

Default:

- Terra / Medium / Fast OFF

Use Terra Low for mechanical verification.
Use Terra High only for a specific difficult problem.
Use Sol only as targeted escalation when Terra is demonstrably insufficient for a high-value ambiguity such as auth identity continuity, RLS/security, migration failure, or non-trivial merge conflict.

Prefer small recoverable checkpoints and parallel independent lanes over one giant autonomous job.

---

## LATEST AGENT UPDATE


AGENT: WORK
TIME: 2026-09-12 23:xx UTC
STATUS: DEFERRED / NO ACTIONABLE SOURCE WORK
CHECKPOINT: Fresh GitHub-main and single normal Vercel inspection
PROVEN:
- GitHub `main` is `da24e2cb514f8702e1b10eec7a2eb51d9a6a5e0d`; it remains the source of truth.
- The controller’s prior `30536b49` reference is stale. The current main delta is control-plane/history documentation; no new source change was made in this checkpoint.
- Vercel is connected and continues to create then cancel non-product builds. The accepted production runtime remains `dpl_4x32sTRgy9f1Knvt7xcNEqD9967P` at `5baee666d3e6084a6f01494a85305db6648bb448`.
- No deployment, redeployment, environment change, provider change, or GitHub authentication handoff was attempted.
CHANGED:
- Replaced the stale checkpoint with this fresh-source status.
BLOCKERS:
- Production acceptance for product changes that have not reached a READY production deployment remains deferred until Vercel accepts a normal Git-driven product deployment.
- Meta provider-console callback and identity-continuity acceptance remain external; Facebook stays disabled.
RISKS_OR_UNCERTAINTY:
- This single Vercel inspection confirms canceled builds, but does not establish a new deployment-rate-limit reset time. Do not poll or force a deployment.
NEXT_RECOMMENDED_ACTION:
- Do not wait on or reopen GitHub sign-in. On the next user-invoked checkpoint, inspect Vercel once only if there is a product-affecting current-main commit awaiting deployment; otherwise continue independent launch-readiness work without enabling Facebook.
ADVISOR_REVIEW_REQUIRED: NO
ADVISOR_QUESTION:
- none
