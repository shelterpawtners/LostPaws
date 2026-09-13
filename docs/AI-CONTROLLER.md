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

### Seven Star Shelters

- `/sevenstars` is merged and source/CI accepted.
- Final production visual acceptance remains dependent on Vercel accepting the next normal product deployment.

### Claude Track 3

- PR #135 (`feature/marketplace-ux-and-giving`) is **merged**.
- Merge commit: `27c07d0697eb7f9fed99ac7c4380b064e1f42748`.
- Delivered marketplace UX/giving UI, LostPaws rewrite/cleanup, RAVE Shelter nav dropdown, Terms/Data Deletion placeholder pages/footer links, and related regression fixes.
- Claude also fixed stale hardcoded CI assertions in GitHub Pages Staging and MVP Acceptance workflows.
- A speculative sign-out-race change was correctly reverted; the unresolved race remains documented for future root-cause work.
- `main` is reported green across CI, GitHub Pages Staging, and GitHub Pages MVP Acceptance.

### Historical branches

Retained historical branches still require reconciliation. Do not wholesale merge them.

---

## NEXT ACTIONS

### Lane A — Work: non-Meta launch readiness

1. Treat Google OAuth as accepted; do not retest unless production auth changes.
2. Treat Meta/Facebook as intentionally deferred; leave Facebook disabled.
3. Refresh GitHub `main` before acting.
4. Inspect Vercel at most once, and only if a product-affecting current-main commit is awaiting deployment.
5. If Vercel is still rate-limited/canceling, record once and move on; do not poll, force deploy, or request a paid upgrade.
6. When a new product deployment becomes READY, run focused final production acceptance for `/sevenstars`, `/privacy`, `/terms`, `/data-deletion`, LostPaws, Marketplace, mobile behavior, and core-route regression smoke.
7. Continue any other independent launch-readiness checks that do not overlap active repo implementation.

### Lane B — Codex in VS Code: retained-branch reconciliation

When Codex usage is available:

- start from latest `main`;
- read `docs/BRANCH-RETIREMENT-2026-09-12.md` and current handoff/protocol docs;
- process retained historical branches in batches of 3;
- classify each as KEEP / SUPERSEDED / CONFLICTS_WITH_CURRENT_DIRECTION / OWNER_REVIEW / CLAUDE_REVIEW;
- port only useful deltas onto fresh current-main work; never blind-merge stale branches;
- do not delete retained branches without review/authorization;
- stop only for non-trivial auth/RLS/architecture conflicts or true owner decisions.

### Lane C — Owner/advisor preparation (non-blocking)

Continue drafting review-ready owner materials rather than pausing for preferences:

- Lost Lands event/activation copy and vendor QR outreach;
- Seven Star Shelters content/design refinement;
- LLC/business-verification preparation for later Meta verification;
- batch owner approvals instead of interrupting engineering flow.

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
TIME: 2026-09-12 21:xx EDT
STATUS: PASS
CHECKPOINT: Claude Track 3 merged and main green
PROVEN:
- PR #135 is merged at `27c07d0697eb7f9fed99ac7c4380b064e1f42748`.
- Track 3 marketplace/giving/LostPaws/navigation/legal-placeholder work is now on `main`.
- Claude fixed two stale hardcoded CI assertion defects and reverted a speculative sign-out-race fix rather than masking the issue.
- Owner reports `main` green across CI, GitHub Pages Staging, and GitHub Pages MVP Acceptance.
CHANGED:
- Controller advanced past Claude's PR #135 merge checkpoint.
BLOCKERS:
- Fresh production acceptance still depends on Vercel accepting a normal product deployment.
- Meta remains intentionally deferred and non-blocking.
RISKS_OR_UNCERTAINTY:
- Intermittent sign-out race remains a documented future investigation; do not paper over it with assertion/test weakening.
NEXT_RECOMMENDED_ACTION:
- Use Work only for non-Meta live/readiness checks; when Codex usage is available, start retained-branch reconciliation from latest `main`. Continue advisor-side drafting in parallel.
ADVISOR_REVIEW_REQUIRED: NO
ADVISOR_QUESTION:
- none
