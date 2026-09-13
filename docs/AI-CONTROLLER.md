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

**Simplified 2026-09-13 (issue #138).** The custom file-diff Ignored Build Step (`scripts/vercel-ignore-build.sh`) is retired, along with the `[deploy]` / `[skip deploy]` commit-message conventions it read — neither exists anymore; do not use or expect them. It was logically correct but had already caused one real stale-production incident, preview confusion, and repeated owner/agent diagnostic time, for a build cheap enough that skipping it wasn't worth the risk.

Vercel's own native `git.deploymentEnabled` config in `vercel.json` now controls this declaratively instead of custom shell logic:

```json
"git": { "deploymentEnabled": { "**": false, "main": true } }
```

See **Deployment policy** below for the resulting rule of thumb.

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

### Security headers / MVP hardening (issue #141)

**Resolved 2026-09-13 (PR #142, merge commit `6161a67`).** Production now serves `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and a minimal `Permissions-Policy`, added via `vercel.json`'s native `headers` (no custom middleware). Confirmed live via `curl -sI https://shelterpawtners.com/` post-merge. HSTS was already present as a Vercel platform default and is unchanged.

The two pre-existing `phase-1-accessibility.spec.ts` failures (mobile-menu, RAVE-logo) were root-caused to stale test expectations from already-merged product changes and fixed at the test level; both pass in CI now.

**Open item:** `www.shelterpawtners.com` still serves the site directly instead of redirecting to the apex — confirmed still true post-merge via `curl -sI https://www.shelterpawtners.com/`. This is a Vercel **dashboard-only** feature (no safe `vercel.json`/DNS equivalent for cross-domain host redirects). One-time manual action for whoever holds Vercel project access: **Settings → Domains → edit the `www` row → Redirect to → `shelterpawtners.com`**. No DNS change needed.

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

## DEPLOYMENT POLICY

- **Production (`main`) = always deploy.** Every push to `main` gets a normal Vercel production deployment. No file-diff skip logic.
- **GitHub Pages = normal QA/staging.** Unaffected by this policy; keep using it to review in-progress work.
- **Vercel previews = intentional, not automatic for routine agent work.** Feature/docs/agent branches do not automatically consume a Vercel preview deployment. If a real preview is genuinely needed for a specific branch, either temporarily add that branch to `vercel.json`'s `git.deploymentEnabled`, or deploy it manually with the Vercel CLI — do not re-introduce a custom always-on preview mechanism or a new custom deployment gate.

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

---

AGENT: CLAUDE
TIME: 2026-09-13
STATUS: PASS, MERGED
CHECKPOINT: Vercel deployment-classifier fix + Marketplace/footer compact redesign — PR #137 merged

PROVEN:

- Root-caused and fixed the Vercel classifier bug: `scripts/vercel-ignore-build.sh` compared only `HEAD^` vs `HEAD`, so PR #135 followed by docs-only commits looked docs-only forever after, even with production still behind. Now compares against `$VERCEL_GIT_PREVIOUS_SHA` and fails toward building when that's unavailable. Reproduced the failure against real git history before changing anything, and added `scripts/verify-vercel-ignore-build.sh` (a throwaway-temp-repo regression suite, wired into `npm run check` and CI) that fails 3/6 against the old script and passes 6/6 against the fix.
- Redesigned `/marketplace`: first offer card now appears at 275px desktop / 387px mobile, down from 1171px / 1387px, by replacing the hero/value-panel/stacked-filters with one compact header + toolbar. Fixed two regressions the rename caused (a stale `:has()` selector, list-view CSS scoped to a dropped class) and three it introduced (two sub-44px touch targets, a duplicate h1) before they left this branch, plus a third stale hardcoded selector this same rename broke in `github-pages-mvp-acceptance.yml`'s `public-release-matrix` job (caught by CI, not local testing — a `.yml` inline script, which my own earlier grep across `e2e/*.ts` had missed).
- Compacted the sitewide footer to one row of four columns on desktop and a 2-column mobile wrap, keeping the existing 44px link touch-target floor.
- Verified together: `npm run check`, the full public e2e suite (59 tests), 48 persona e2e tests, a normal production build, and a `GITHUB_PAGES=true` build all pass/succeed.
- PR #137 merged to `main` as squash commit `c013203`. `main` is green post-merge (CI Gate, GitHub Pages Staging) — this also incidentally fixed a pre-existing `docs/AI-CONTROLLER.md` formatting break that had been failing `main`'s CI Gate since before this branch existed (commit `588f74b` and earlier).

CHANGED:

- `scripts/vercel-ignore-build.sh`, `scripts/verify-vercel-ignore-build.sh` (new), `package.json`, `.github/workflows/ci.yml`, `.github/workflows/github-pages-mvp-acceptance.yml`, `src/components/OfferMarketplace.tsx`, `src/marketplace-launch-density.css`, `src/styles.css`, plus e2e fixups (`e2e/marketplace-premium.spec.ts`, `e2e/hosted-design-qa.spec.ts`, `e2e/hosted-qa-smoke.spec.ts`).

BLOCKERS:

- None.

RISKS_OR_UNCERTAINTY:

- This PR's own Vercel preview build showed "Canceled by Ignored Build Step" on every push despite real product changes. Could not verify from here (no Vercel dashboard access) whether preview contexts set `VERCEL_GIT_PREVIOUS_SHA` differently than production — plausible this is correct (an earlier preview in the same PR already captured the diff), but worth one check by whoever has dashboard access.
- Two `phase-1-accessibility.spec.ts` failures (mobile-menu, RAVE-logo) reproduce on a clean run but touch no file this branch changed relative to `main` — confirmed pre-existing, flagged for a future fix, not addressed here (out of scope for this sprint).
- Did not touch Meta/Facebook, Microsoft 365 DNS, secrets, money movement, or the sign-out race, per this sprint's guardrails.

NEXT_RECOMMENDED_ACTION:

- Confirm the next normal `main` push produces a real Vercel production deployment (the actual bug this sprint fixed).
- Whoever picks up `phase-1-accessibility.spec.ts`'s two pre-existing failures next: they're unrelated to this PR, reproducible on a clean run.

ADVISOR_REVIEW_REQUIRED: NO

---

AGENT: CLAUDE
TIME: 2026-09-13
STATUS: PASS, MERGED
CHECKPOINT: Vercel deployment simplification (issue #138) — PR #140 merged, resolves the open question above

PROVEN:

- The owner explicitly revised issue #138's literal direction ("let normal Git integration build every push") to something more deliberate: production `main` always deploys, but routine feature/docs/agent branches should not automatically consume a Vercel Preview deployment either — prefer Vercel's native config over another custom script.
- Retired the custom Ignored Build Step entirely: `vercel.json`'s `ignoreCommand`, `scripts/vercel-ignore-build.sh`, `scripts/verify-vercel-ignore-build.sh`, the `test:shell` npm/CI step, and the `[deploy]`/`[skip deploy]` commit-message conventions. Nothing else referenced them (confirmed with a repo-wide sweep).
- Replaced with Vercel's own native `git.deploymentEnabled` in `vercel.json`: `{"**": false, "main": true}`. Verified this exact mechanism against Vercel's current official docs before using it (not guessed) — it is fully expressible in repo config, no dashboard/provider setting needed. Used `**` rather than `*` deliberately: minimatch's `*` does not cross `/`, and this repo's branches are commonly named `prefix/name`.
- `scripts/classify-change-impact.sh` and `scripts/latest-frontend-artifact-sha.sh` untouched — confirmed six other GitHub Actions workflows depend on the former, unrelated to Vercel.
- **This resolves the open question from the entry above**: PR #140 merged as squash commit `0eeb75f`, and GitHub's commit-status API shows `Vercel: success, "Deployment has completed"` for that commit — a real production deployment, not canceled. Separately, PR #140's own CI run (on the non-`main` branch) shows no Vercel check at all, confirming previews are now correctly suppressed for routine branches rather than ambiguously "canceled."

CHANGED:

- `vercel.json`, `package.json`, `.github/workflows/ci.yml`, `docs/AI-CONTROLLER.md` (this entry + a new DEPLOYMENT POLICY section), `docs/AI-COST-AND-TESTING-GOVERNANCE.md`, `docs/DEV-LOOP-V2.md`, `docs/AI-HANDOFF.md`. Deleted `scripts/vercel-ignore-build.sh` and `scripts/verify-vercel-ignore-build.sh`.

BLOCKERS:

- None.

RISKS_OR_UNCERTAINTY:

- None identified. Did not touch DNS, Meta, Supabase auth/RLS, production data, or product UX, per this task's guardrails.

NEXT_RECOMMENDED_ACTION:

- None required. Optional cosmetic check: confirm `shelterpawtners.com` has aliased to the new deployment (DNS propagation, not a code gate).

ADVISOR_REVIEW_REQUIRED: NO

---

AGENT: CLAUDE
TIME: 2026-09-13
STATUS: PASS, MERGED
CHECKPOINT: MVP hardening (issue #141) — PR #142 merged, security headers live in production

PROVEN:

- Root-caused both named `phase-1-accessibility.spec.ts` failures to stale test expectations from already-merged, intentional product changes (not real regressions) and fixed the tests, not the product: the mobile-menu test's loose "Marketplace" locator matched an unrelated home-page CTA link containing the same substring; the RAVE-logo test still asserted the old full-lockup PNG (`.rsmLogoPanel`) that Track 2 work had already replaced with a mark-only SVG (`.rsmHeroMark img`).
- Added production security headers via `vercel.json`'s native `headers` field (no custom middleware/scripts): CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`. CSP was derived from an actual repo audit (no inline/external scripts, Google Fonts confirmed to survive the build, production Supabase origin confirmed from existing docs) and verified pre-merge against a local server replicating Vercel's documented header/rewrite/filesystem-precedence behavior, exercised in a real headless browser across 7 routes with zero CSP violations.
- Added `e2e/hosted-security-headers.spec.ts`, a `PLAYWRIGHT_HOSTED_QA`-gated check (same pattern as existing hosted-QA specs) asserting these headers on the live domain.
- Confirmed `www.shelterpawtners.com` → apex canonicalization is genuinely Vercel-dashboard-only (verified against official docs, not guessed) and documented the exact one-time manual action instead of inventing a workaround.
- PR #142 merged as squash commit `6161a67f9ed2f0e0e7ef982d9243b87ef7bb9b8c`. Verified post-merge: GitHub's commit-status API shows `Vercel: success, "Deployment has completed"`; `curl -sI https://shelterpawtners.com/` and `/marketplace` both show all five new headers live; `curl -sI https://www.shelterpawtners.com/` confirms the canonical redirect genuinely has not happened yet (still 200, no redirect), matching the documented open item.
- Posted a full checkpoint to issue #141: https://github.com/shelterpawtners/LostPaws/issues/141#issuecomment-5656038855

CHANGED:

- `e2e/phase-1-accessibility.spec.ts`, `vercel.json`, `e2e/hosted-security-headers.spec.ts` (new), this controller (CURRENT STATUS + this entry).

BLOCKERS:

- None affecting this lane. Issue #136 (owned by Work) untouched.

RISKS_OR_UNCERTAINTY:

- `www.shelterpawtners.com` canonicalization remains pending a one-time Vercel dashboard action (Settings → Domains → edit `www` row → Redirect to `shelterpawtners.com`) by whoever holds Vercel project access — not completable from repo config.
- A fully locked-down CSP (nonce/hash-based `script-src`, narrower `img-src`) remains a bounded future follow-up if the owner wants stricter policy later; current policy already improves materially on no CSP and doesn't restrict anything the app currently needs.

NEXT_RECOMMENDED_ACTION:

- Whoever holds Vercel dashboard access: complete the one `www` redirect setting above to close the last open item from issue #141.

ADVISOR_REVIEW_REQUIRED: NO
