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
- Issue #87 completed the functional reconciliation and established `main` as the sole release candidate.
- No open pull requests remain at the time of this cleanup pass.
- Recent launch-critical work has been merged to `main` through PRs #94, #95, #102, #104 and #106.
- Historical branches must not be wholesale-merged merely because Git ancestry reports them as ahead/diverged; several were squash-merged or superseded.

## Recent merged branches confirmed safe to retire

- `issue-56-password-recovery-readiness` — merged via PR #94.
- `issue-56-support-delivery-runtime` — merged via PR #95.
- `ux/issue-100-unified-rave-mission` — merged via PR #102.
- `fix/issue-99-oauth-base-aware` — merged via PR #104.
- `fix/issue-98-facebook-frontend` — merged via PR #106.
- `fix/issue-96-canonical-lostpaws` — superseded by Issue #100 / PR #102.
- `issue-58-lostpaws` — superseded by Issue #100 / PR #102.

## Safe-delete candidates already documented by Issue #87

These branches were explicitly found to contain no unique accepted product delta relative to `main` or to be obsolete release branches:

- `build/festival-mvp`
- `launch/pre-cutover-readiness`
- `phase3/auth-email-readiness`
- `phase3/shelter-verification`

## Review-before-delete candidates

Do not delete or merge these wholesale until final tree/functionality review:

- `phase3/marketplace-polish` — historical branch head `6bc6af76f340604916e392173eb9b40ffbbc7987`; Issue #87 reported ancestry ahead even though accepted Marketplace functionality exists on `main`.
- `phase3/meta-social-login` — historical provider-gated candidate work; current Facebook source readiness was implemented independently on `main` via PR #106.
- `ux/guardian-marketplace-launch-polish` — historical docs-only commit ahead at the time of Issue #87.

If a genuinely missing accepted MVP delta is found, create a fresh branch from current `main` and port only that delta. Never merge the historical branch wholesale.

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
