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

Status: **DEFERRED OWNER/PROVIDER ADMIN — NOT A LAUNCH BLOCKER**.

- Source integration uses provider `facebook` and the same deployment-base-aware OAuth return helper.
- Production keeps Facebook disabled through `VITE_FACEBOOK_AUTH_ENABLED !== "true"`.
- Live UI remains `Facebook sign-in coming soon`.
- Real provider-console callback and identity-continuity acceptance require authorized Meta/provider access.
- Owner has chosen to defer Meta configuration while business/legal-entity verification details are prepared.
- Do not enable Facebook publicly, do not spend Work/Codex cycles retrying Meta, and do not treat Meta as blocking unrelated launch work.
- Resume Meta only after the owner explicitly says business verification/provider access is ready.
- Future Meta/legal readiness must include a documented government/law-enforcement request process covering legal review, challenge/escalation of unlawful or overbroad requests, data minimization, and an auditable record of requests/responses/legal reasoning/actors. This is a deferred compliance item, not a current launch blocker.

### Public smoke

Work passed `/`, `/marketplace`, `/lostpaws`, `/rave`, and `/events` with expected headings and no application console errors.

### Seven Star Shelters — new parallel product lane

Owner approved a second RAVE Shelter festival activation:

**Seven Star Shelters — Spread Shelter Love**

Authoritative brief:

`docs/SEVEN-STAR-SHELTERS-LANDING-BRIEF.md`

The `/sevenstars` implementation has been merged and is source/CI accepted. Final production visual acceptance remains dependent on Vercel accepting the next normal product deployment.

### Historical branches

Retained historical branches still require reconciliation. Do not wholesale merge them.

### Claude ownership

Claude resumes its own paused current-development/design work when available. Codex must not overwrite Claude-owned work.

---

## NEXT ACTIONS

### Lane A — Codex Work: non-Meta launch readiness

Recommended setting:

- Model: Terra
- Reasoning: Low/Medium
- Fast: OFF

On next sync:

1. Treat Google OAuth as accepted; do not retest unless production auth changes.
2. Treat Meta/Facebook as intentionally deferred by the owner; leave Facebook disabled and do not spend cycles on Meta.
3. Refresh GitHub `main` before acting.
4. Inspect Vercel at most once, and only when a product-affecting current-main commit is awaiting deployment.
5. If Vercel is still rate-limited/canceling the pending product deployment, record the state once and move on; do not poll, force deploy, or request a paid upgrade.
6. Continue all independent launch-readiness work that does not depend on a fresh production deployment.
7. When a new product deployment becomes READY, run focused final production acceptance for the newly deployed delta, especially `/sevenstars`, `/privacy`, mobile behavior, and regression smoke on core routes.
8. Update this controller after material checkpoints.

### Lane B — VS Code Codex: retained-branch reconciliation

Because Meta is deferred and Vercel may be temporarily unavailable, repository-native work is now the best use of parallel engineering time.

- Start from latest `main`.
- Read `docs/BRANCH-RETIREMENT-2026-09-12.md` and relevant handoff/protocol docs.
- Process retained historical branches in batches of 3.
- Classify each as KEEP / SUPERSEDED / CONFLICTS_WITH_CURRENT_DIRECTION / OWNER_REVIEW / CLAUDE_REVIEW.
- For KEEP, port only the useful delta onto a fresh current-main branch; never blind-merge a stale branch.
- Do not delete retained branches until reviewed/authorized.
- Stop only for non-trivial auth/RLS/architecture conflicts or true owner decisions.

### Lane C — Owner admin: business verification preparation (parallel, non-blocking)

Owner will separately prepare the legal-business information needed for Meta verification. This lane must not block product/engineering work.

Before resuming Meta, establish one authoritative legal entity identity for the app and ensure the legal name, address, phone, website/domain, and tax/registration documents are consistent across Meta and supporting records.

---

## AUTH / CONNECTOR HANDOFF FAILSAFE

A connector login or authorization handoff must never leave an agent spinning indefinitely.

If GitHub, Vercel, Meta, Supabase, or another provider requires authentication that cannot be completed immediately:

1. Attempt the secure handoff only when a concrete provider action or write is actually required.
2. If the handoff is unavailable, missing the required sign-in method, or not completed promptly, stop waiting.
3. Fall back to **read-only continuation** using GitHub `main` and any already-authorized provider surfaces as the source of truth.
4. Complete every independent verification, analysis, or non-write task that remains safe.
5. Record exactly one bounded pending action, including the target system and intended write/action.
6. Do not reopen the same auth handoff repeatedly in the same run.
7. Do not claim the entire workstream is blocked when only one write is blocked.
8. If the blocked write is only a controller/handoff update, report the unpushed checkpoint in the final response and continue useful work; the next authorized agent can publish it.
9. Never ask the owner to paste passwords, OAuth tokens, secrets, or recovery codes into chat.

A Work run waiting on an inaccessible authentication UI for roughly 2–3 minutes should be treated as a failed handoff, not as active progress.

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

AGENT: CHATGPT_ADVISOR
TIME: 2026-09-12
STATUS: PASS
CHECKPOINT: Defer Meta and advance independent work
PROVEN:
- Google production OAuth remains accepted.
- Meta/Facebook cannot be completed until owner-side business/provider verification is ready.
- Meta can remain disabled without blocking unrelated product launch/readiness work.
- `/sevenstars` is merged/source-accepted and awaits production deployment acceptance.
- Vercel deployment capacity/rate limiting is a temporary external constraint and should not consume repeated polling cycles.
CHANGED:
- Meta is now explicitly deferred/non-blocking in the control plane.
- Next engineering work prioritizes independent launch acceptance and retained-branch reconciliation.
- Added a separate non-blocking owner-admin lane for business verification preparation.
BLOCKERS:
- Fresh production acceptance for newer product changes still depends on Vercel accepting a normal deployment.
RISKS_OR_UNCERTAINTY:
- Meta business verification entity/details are not yet finalized; do not resume Meta until owner explicitly reopens that lane.
NEXT_RECOMMENDED_ACTION:
- Work continues non-Meta launch readiness; VS Code Codex can process retained branches in parallel while waiting for Vercel.
ADVISOR_REVIEW_REQUIRED: NO
ADVISOR_QUESTION:
- none
