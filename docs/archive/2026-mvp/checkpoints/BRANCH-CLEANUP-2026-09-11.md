# Branch Cleanup — 2026-09-11

## Policy

`main` is the only approved MVP/release-candidate source of truth.

All future product work must follow:

1. branch from current `main`;
2. make one bounded change;
3. open a PR back to `main`;
4. require relevant CI/browser/database gates;
5. merge only when green;
6. delete the short-lived branch after merge.

Do not create another long-lived integration or release branch.

## Current confirmed state

- GitHub default branch: `main`.
- Current main head at this audit: `9507a76b9b8d102039ffa6c08253829415a48bf3`.
- Issue #87 completed the functional reconciliation and established `main` as the sole release candidate.
- No open pull requests remain at the time of this cleanup pass.
- Recent launch-critical work has been merged to `main` through PRs #94, #95, #102, #104 and #106.
- Historical branches must not be wholesale-merged merely because Git ancestry reports them as ahead/diverged; several were squash-merged or superseded.

## Confirmed retirement candidates

Recent merged/superseded work:

- `issue-56-password-recovery-readiness` — merged via PR #94.
- `issue-56-support-delivery-runtime` — merged via PR #95.
- `ux/issue-100-unified-rave-mission` — merged via PR #102.
- `fix/issue-99-oauth-base-aware` — merged via PR #104.
- `fix/issue-98-facebook-frontend` — merged via PR #106.
- `fix/issue-96-canonical-lostpaws` — superseded by Issue #100 / PR #102.
- `issue-58-lostpaws` — superseded by Issue #100 / PR #102.

Branches explicitly found by Issue #87 to have no unique accepted product delta or to be obsolete release branches:

- `build/festival-mvp`
- `launch/pre-cutover-readiness`
- `phase3/auth-email-readiness`
- `phase3/shelter-verification`

Previously review-only branches now resolved:

- `ux/guardian-marketplace-launch-polish` — only one historical docs file is ahead; no product code. Current product/docs direction is represented on `main` and in Issue #53/current controller docs. Safe to retire.
- `phase3/meta-social-login` — historical `.env`/feature-flag/config/docs prep only. Current Facebook source readiness was implemented and accepted independently on `main` through PR #106, with Google base-aware routing through PR #104. Safe to retire; do not merge the old branch.
- `phase3/marketplace-polish` — historical branch remains 11 commits ahead by ancestry but is 164 commits behind current `main`. Its Marketplace files are an earlier implementation: current `main` already contains the premium Marketplace layer and adds newer grid/list view state plus `marketplace-launch-density.css`. Safe to retire; do not merge the old branch.

## Remaining historical branches

All other old feature/fix/QA/docs branches should be treated as historical refs, not alternate sources of truth. Before deleting a batch, verify either:

- associated PR was merged;
- issue/work was superseded;
- branch is fully behind `main`; or
- current `main` contains the accepted functionality through a later implementation.

If a genuinely missing accepted MVP delta is ever found, create a fresh branch from current `main` and port only that delta. Never merge a historical branch wholesale.

## Protection correction required

Repository inspection found one active ruleset named `Copilot PR Review`, but it currently targets only `refs/heads/build/festival-mvp` and enforces deletion/non-fast-forward protection there. It does **not** protect `main`.

For the current operating model, protection should move to `main` and enforce at minimum:

- prevent deletion;
- prevent force/non-fast-forward updates;
- require changes through pull requests for product-code work;
- require the repository's relevant green checks before merge.

The connected GitHub tools in this ChatGPT session are read-only for rulesets/branch protection and do not expose branch-ref deletion. Therefore these two admin/ref operations must be performed in GitHub settings/UI/CLI, while this document remains the authoritative cleanup checklist.

## Target final branch state

- `main`
- zero to two short-lived active issue branches
- no obsolete integration/release/QA branches retained as alternate sources of truth
