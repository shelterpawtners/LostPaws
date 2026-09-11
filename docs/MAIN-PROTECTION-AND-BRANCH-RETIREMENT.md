# Main Protection and Branch Retirement

## Required one-time GitHub admin actions

The repository is functionally consolidated on `main`, but GitHub still retains historical branch refs and the active branch ruleset currently targets obsolete `build/festival-mvp` instead of `main`.

### Protect `main`

Update repository branch/ruleset settings so `main` is protected against:

- deletion;
- force/non-fast-forward updates;
- direct product-code changes that bypass pull-request review;
- merging before relevant required checks are green.

The current `Copilot PR Review` ruleset targets `refs/heads/build/festival-mvp`; retire or retarget it as appropriate rather than preserving the obsolete branch as the protected branch.

### Retire historical branches

Use `docs/BRANCH-CLEANUP-2026-09-11.md` as the authoritative classification record.

Delete confirmed retirement candidates first, then remove remaining stale feature/fix/QA/docs branches in reviewed batches. Do not delete `main`.

Do not wholesale-merge any historical branch into `main`. If a future audit discovers a truly missing accepted MVP delta, branch fresh from current `main`, port only that delta, run normal checks, merge through PR, then delete the short-lived branch.

## Target repository state

- `main` is the only long-lived branch and sole release-candidate source of truth;
- zero to two short-lived active issue branches at any time;
- all product work follows `main -> bounded branch -> PR -> checks -> merge -> delete branch`;
- GitHub Pages and Vercel consume accepted `main` state rather than alternate release branches.
