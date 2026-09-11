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

## Safe-delete candidates already documented by Issue #87

These branches were explicitly found to contain no unique accepted product delta relative to `main` or to be obsolete release branches:

- `build/festival-mvp`
- `launch/pre-cutover-readiness`
- `phase3/auth-email-readiness`
- `phase3/shelter-verification`

Recent merged/superseded short-lived branches are also retirement candidates after final ref verification:

- `issue-56-password-recovery-readiness` — merged via PR #94
- `issue-56-support-delivery-runtime` — merged via PR #95
- `ux/issue-100-unified-rave-mission` — merged via PR #102
- `fix/issue-99-oauth-base-aware` — merged via PR #104
- `fix/issue-98-facebook-frontend` — merged via PR #106
- `fix/issue-96-canonical-lostpaws` — superseded by Issue #100 / PR #102
- `issue-58-lostpaws` — superseded by Issue #100 / PR #102

## Review-before-delete candidates

Issue #87 explicitly identified these as branches that should not be blindly merged or deleted without tree/functionality review:

- `phase3/marketplace-polish` — reported historical commits ahead even though accepted Marketplace functionality already exists on `main`.
- `phase3/meta-social-login` — historical provider-gated candidate work; current Facebook source readiness has since been implemented independently on `main` via PR #106, but retain until a final diff review confirms no separate accepted delta.
- `ux/guardian-marketplace-launch-polish` — historical docs-only commit ahead at the time of Issue #87; retain until documentation value is checked against current `main`.

## Branch-deletion limitation

The connected GitHub toolset in this ChatGPT session does not expose branch-ref deletion. Therefore this pass records the approved cleanup policy and classifications in-repo, but does not delete branch refs automatically.

Do not delete `main` or any branch in the review-before-delete set until its final comparison is documented.
