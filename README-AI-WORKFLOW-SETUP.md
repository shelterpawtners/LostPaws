# ShelterPawtners Shared AI Workflow Setup

This bundle makes GitHub the shared source of truth between:

- ChatGPT strategy/planning
- ChatGPT Work
- GitHub Copilot

## Install

1. Close/finish any active file edits you do not want overwritten.
2. Make a Git checkpoint first:
   `git status`
   `git add -A`
   `git commit -m "checkpoint before AI workflow structure"`
   `git push`
3. Extract this bundle into the ROOT of the local `LostPaws` repository.
4. Allow folders to merge.
5. If Windows asks whether to replace an existing file, STOP and inspect that file first. This bundle is designed mainly to add new files.
6. In VS Code Source Control, review the added files.
7. Run:
   `git status`
8. Commit:
   `git add .github docs scripts README-AI-WORKFLOW-SETUP.md`
   `git commit -m "chore: add shared AI workflow and phase specifications"`
   `git push`

## Current Phase

The included `docs/CURRENT-WORK.md` starts with Phase 1 active.

After Phase 1 is approved, run from the repo root:

`powershell -ExecutionPolicy Bypass -File .\scripts\set-active-phase.ps1 -Phase 2`

Then:

`git add docs/CURRENT-WORK.md`
`git commit -m "chore: activate phase 2"`
`git push`

Repeat with `-Phase 3`, `-Phase 4`, and `-Phase 5` only after each previous phase is approved.

## Work Prompt Going Forward

After this structure is committed, ChatGPT Work prompts can usually be short:

"Continue ShelterPawtners from the current repository state. Read AGENTS.md and docs/CURRENT-WORK.md, then execute the active phase specification. Preserve completed work, update the active progress file and docs/DECISION-LOG.md, test/fix, and checkpoint commit/push frequently. Stop only for destructive actions, credentials, paid services, or material legal/security/privacy decisions."

## Copilot Going Forward

Copilot automatically receives `.github/copilot-instructions.md` and matching path instructions in supported environments.

For bounded recurring tasks, use the reusable prompts under `.github/prompts/`.

Do not have Work and Copilot edit the same feature at the same time. Use committed checkpoints between agents.
