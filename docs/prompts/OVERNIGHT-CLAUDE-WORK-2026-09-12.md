# Overnight Claude + Work Execution Brief — 2026-09-12

Status: ACTIVE OVERNIGHT COORDINATION BRIEF

## Purpose

Coordinate Claude Code in VS Code and ChatGPT Work overnight without duplicating effort. GitHub `main` is the source of truth.

Claude owns repository implementation. Work owns staging/production verification and release-readiness checks. Neither agent should redo the other's work.

Use this brief together with:

- `docs/AI-CONTROLLER.md`
- `docs/AI-HANDOFF.md`
- `docs/AI-OPERATING-PROTOCOL.md`
- `docs/prompts/VERCEL-MARKETPLACE-FOOTER-SPRINT.md`

---

## Shared current facts

- Meta/Facebook is intentionally deferred and non-blocking. Keep Facebook disabled.
- Google OAuth is accepted. Do not retest unless auth behavior changes.
- PR #135 is merged; Track 3 product changes are on `main`.
- GitHub Pages is the staging/preview surface at `https://shelterpawtners.github.io/LostPaws/`.
- Vercel production remains behind the newest product changes because `scripts/vercel-ignore-build.sh` incorrectly evaluates only the latest commit range and can skip a real undeployed product delta after docs/CI follow-up commits.
- Work reproduced the deployment-classifier defect: PR #135 itself classifies as build, later docs-only commits classify as skip, while comparing the last READY production SHA to current `main` shows product/deployment changes.
- Expected safe fix direction: use Vercel's `VERCEL_GIT_PREVIOUS_SHA` as the prior successful deployment baseline, fail conservatively toward build if the baseline is unavailable, and retain regression coverage for docs-only skips and product-followed-by-docs deploys.
- Do not work on the unrelated intermittent sign-out race during this sprint.

---

# Lane 1 — Claude Code in VS Code: implementation owner

Claude is the sole implementation owner for the active sprint.

## Startup

1. Sync to latest `origin/main`.
2. Confirm the working tree is clean.
3. Create/switch to `fix/vercel-deploy-classifier` from current `main` if it does not already exist; otherwise verify it is based on current `main`.
4. Do not work directly on `main`.
5. Read the shared controller/handoff/protocol and `docs/prompts/VERCEL-MARKETPLACE-FOOTER-SPRINT.md`.

## Primary execution

Execute `docs/prompts/VERCEL-MARKETPLACE-FOOTER-SPRINT.md` end to end.

For the deployment classifier, treat the Work diagnosis as strong prior evidence. Verify it against current script/history, but do not waste time broadly rediscovering the issue unless the evidence conflicts.

The fix should, if confirmed:

- compare current `HEAD` against the previous successful deployment represented by `VERCEL_GIT_PREVIOUS_SHA` rather than only `HEAD^`;
- build conservatively when the previous deployment SHA is missing or unavailable in the local clone;
- preserve explicit `[deploy]` force-build behavior;
- allow genuine docs/control-plane-only deltas to skip when production is already current;
- ensure `[skip deploy]` cannot conceal an actual undeployed product delta;
- include regression coverage for the PR #135 + docs-follow-up failure mode.

Then complete the Marketplace ecommerce-style redesign and compact footer redesign defined in the sprint brief.

## Implementation guardrails

- Make strong reversible UX decisions without stopping for routine owner preferences.
- Keep deployment logic, Marketplace UX, footer UX, and tests/docs in clear separate commits/checkpoints.
- Do not touch Meta/Facebook configuration, Microsoft 365 DNS, production secrets, OD-003, OD-004, charitable money movement, or the sign-out race.
- Preserve Google OAuth, RLS/security, Pet/RAVE filtering, Events, LostPaws/RAVE/Seven Star routing, legal routes, and accessibility.
- Do not weaken tests.
- Do not blindly merge historical branches.
- Avoid unnecessary new dependencies.

## Verification

Run all relevant checks, including typecheck, lint, unit tests, marketplace/browser tests, production build, GitHub Pages compatibility, deployment-classifier regression tests, and visual checks at mobile/tablet/desktop sizes.

## Finish

When safe and green:

1. push the branch;
2. open a PR to `main`;
3. resolve legitimate CI failures without weakening tests;
4. merge under the owner's standing authorization when required checks pass;
5. update `docs/AI-HANDOFF.md` and `docs/AI-CONTROLLER.md`;
6. format those docs before committing;
7. leave `main` clean and documented.

If an external provider or auth handoff blocks one action, do not wait indefinitely. Complete every independent repo task and record one precise pending action.

Claude final report should include exact classifier root cause/fix, tests, Marketplace/footer changes, PR/merge SHA, GitHub Pages status, and whether `main` should now trigger one normal Vercel production deployment.

---

# Lane 2 — ChatGPT Work: verification / operations owner

Work must not duplicate Claude's source implementation.

## Startup

1. Refresh current GitHub `main`.
2. Read `docs/AI-CONTROLLER.md`, `docs/AI-HANDOFF.md`, and this brief.
3. Treat any prior cached SHA/checkpoint as stale.

## Current ownership boundary

Claude owns:

- `scripts/vercel-ignore-build.sh` implementation;
- related classifier regression coverage;
- Marketplace redesign;
- footer redesign;
- source PR/CI/merge.

Work must not independently modify or reimplement those areas.

## Verification work before Claude merge

1. Verify GitHub Pages staging at `https://shelterpawtners.github.io/LostPaws/` is serving the compiled current-main app.
2. Review current staging for launch-impacting problems on `/`, `/marketplace`, `/rave`, `/lostpaws`, `/events`, `/sevenstars`, `/privacy`, `/terms`, `/data-deletion`, and `/support`.
3. Focus on broken navigation, missing assets, route-refresh failures, obvious console/network errors, mobile usability, auth-entry regression, and major visual defects. Avoid cosmetic busywork.
4. Confirm Google remains accepted and Facebook remains disabled. Do not retest Google unless auth changed.
5. Do not spend cycles on Meta.
6. Inspect Vercel once to record current production deployment SHA/state. Do not poll or force deployment.
7. Review CI/main status and distinguish real product failures from stale assertions, duplicate-checkout/Vitest noise, and provider limitations.
8. Reuse prior retained-branch analysis. Do not reopen wholesale branch reconciliation without new evidence of unique current-value work.
9. Prepare the focused production acceptance checklist for the next successful deployment.

## If Claude merges during the Work session

1. Refresh `main` once after detecting the merge.
2. Inspect the merged classifier fix and verify it addresses the proven failure mode: a product change followed by docs-only commits must still build when production is behind.
3. Make one Vercel production-state check.
4. If a new deployment becomes READY, run focused live acceptance on `https://shelterpawtners.com` covering Marketplace, footer, LostPaws, RAVE nav, Seven Star Shelters, Privacy/Terms/Data Deletion, Support, mobile, Pet/RAVE filters, Google auth entry, and direct-route refresh.
5. If deployment remains queued/canceled/rate-limited or absent, record the state once and stop checking. Do not force, redeploy repeatedly, request a paid upgrade, or spin.

## Work auth/write failsafe

The Work shell may lack GitHub push credentials. This is not a project blocker.

- Do not reopen GitHub sign-in merely to update docs.
- Continue all safe read-only verification.
- If a write is the only remaining action, report exactly what should be written; another authenticated agent can publish it.
- Never request credentials, tokens, recovery codes, or secrets.

## Owner escalation threshold

Escalate only for destructive production-data changes, ambiguous auth/RLS/security behavior, duplicate identity behavior, Microsoft 365 DNS, paid-service changes, new legal/tax/charitable claims, or a true provider action requiring the owner.

Otherwise continue autonomously.

Work final report should include current `main` SHA, Claude merge status if visible, GitHub Pages status, Vercel production state, whether production caught up, acceptance checks, genuine blockers only, and the exact next action.

---

## Overnight success condition

Best case by morning:

1. Claude has merged a safe classifier fix plus Marketplace/footer improvements.
2. GitHub Pages reflects the merged UI and passes staging checks.
3. The next normal Vercel production deployment is allowed to build from the prior successful deployment baseline.
4. Work performs one production acceptance pass if that deployment becomes READY.
5. Meta remains untouched and no agent spins on authentication or provider polling.
