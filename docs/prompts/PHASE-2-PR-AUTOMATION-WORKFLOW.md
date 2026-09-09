# Phase 2 PR Automation Workflow

Use this workflow for remaining Phase 2 engineering bundles.

## Source of truth

- Base branch: `build/festival-mvp`
- Do not commit implementation work directly to the base branch.
- Create a feature branch for each execution bundle.
- GitHub Copilot automatic code review is expected to run when the PR is opened against `build/festival-mvp`.

## Bundle A — Checkpoints 3 and 4

1. Start from the latest `build/festival-mvp`.
2. Create feature branch: `bundle-a-offers-redemption`.
3. Read `AGENTS.md`, `docs/CURRENT-WORK.md`, `docs/PHASE-2-CONTINUOUS-EXECUTION.md`, and the checkpoint prompts/specs referenced there.
4. Complete Checkpoint 3 Offer Engine and then Checkpoint 4 Claim + QR/Code Redemption without stopping between them unless a material product, security, privacy, legal, financial, ownership, destructive-data, paid-service, or production decision is required.
5. Run local validation available on the developer machine, including Docker/Supabase reset, pgTAP, application checks/build, and relevant authenticated Playwright/browser/mobile/accessibility flows.
6. Fix defects found during validation.
7. Commit recoverable milestones on the feature branch and push the feature branch.
8. Open a non-draft pull request from `bundle-a-offers-redemption` into `build/festival-mvp`.
9. Do not merge automatically.
10. Allow GitHub Copilot automatic code review to run on the PR.
11. Address material Copilot review findings using the lowest-cost suitable engineering agent. Prefer Copilot for small bounded fixes; use Codex for complex multi-file fixes.
12. Request one additional Copilot review only when meaningful fixes were made and re-review is needed. Do not trigger repeated reviews after trivial pushes.
13. Stop after the Checkpoint 4 redemption UX is working and the PR is clean enough for product review. Do not begin Checkpoint 5 until the redemption UX gate is approved.

## User involvement

Do not ask the user to coordinate routine engineering handoffs. Escalate only for material decisions listed above or when Checkpoint 4 redemption UX is ready for review.

## Completion report

Return:

- feature branch name;
- final feature-branch SHA;
- PR number/link;
- Copilot review status and material findings;
- test/validation results;
- environment blockers, if any;
- known limitations;
- confirmation that Checkpoint 5 was not started.
