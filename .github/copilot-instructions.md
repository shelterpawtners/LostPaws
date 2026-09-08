# ShelterPawtners Copilot Instructions

Read `AGENTS.md` first. Then read only the active task context: the GitHub Issue/PR, `docs/CURRENT-WORK.md`, `docs/AI-HANDOFF.md`, `docs/AUTONOMOUS-EXECUTION-POLICY.md`, `docs/AI-COST-AND-TESTING-GOVERNANCE.md`, and the relevant phase/security/product files.

## Current authority

- Remainder of Phase 2 is authorized.
- Phase 2 Checkpoint 5 is authorized and active when the handoff says so.
- Phase 3 is not authorized.
- No auto-merge, production/DNS changes, paid infrastructure, service-role browser credentials, RLS weakening, or material RED decisions without owner approval.

## Autonomy

- GREEN: decide and continue.
- YELLOW: make the safest reversible assumption, log it in `docs/OWNER-DECISION-BACKLOG.md`, and continue.
- RED/hard blocker: finish safely separable work, update the backlog/handoff, and stop narrowly.
- Fix related in-scope defects instead of stopping after the first failure.
- Never weaken a valid regression test just to make CI green.

## AI-credit discipline

- Treat this invocation as one bounded checkpoint/defect-cluster session.
- Work through implementation, targeted validation, and related GREEN/YELLOW fixes in this same session where practical.
- Do not request or trigger another Copilot session because a routine CI/Hosted QA run passed.
- Do not use AI for deterministic formatting, polling, status checks, test reruns, or tasks GitHub Actions/scripts can perform.
- Do not request Copilot code review on every commit. Default to one review at checkpoint acceptance only when materially useful.
- Keep context lean; do not read unrelated historical docs or explore unrelated code.

## Stack and invariants

React, TypeScript, Vite, Tailwind, Supabase. Git migrations are schema source of truth. Preserve RLS, auditability, provenance, demo-data isolation, append-oriented economic history, integer minor-unit money values, mobile-first behavior, and accessibility.

## Before completion/blockage

Run the strongest relevant tiered validation, update changed-behavior tests, update `docs/OWNER-DECISION-BACKLOG.md` only when needed, and update `docs/AI-HANDOFF.md` with final SHA, exact test/CI/Hosted QA state, defects, decision state, and next action. Never merge unless explicitly authorized.
