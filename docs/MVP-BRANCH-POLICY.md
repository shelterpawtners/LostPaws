# MVP Branch Policy

- `main` is the only long-lived branch and the sole MVP/release-candidate source of truth.
- New work must branch from current `main`.
- Each branch should contain one bounded issue/change.
- Merge through PR only after relevant automated checks are green.
- Delete the short-lived branch after merge.
- Do not create long-lived integration/release/QA branches.
- Do not wholesale-merge historical branches. Port any truly missing accepted delta onto a fresh branch from `main` instead.
