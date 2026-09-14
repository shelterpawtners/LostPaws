# Agent Operations

Status: CANONICAL  
Owner: Repository operations  
Last reviewed: 2026-09-14  
Supersedes: Detailed operational authority in `AI-OPERATING-PROTOCOL.md`,
`AUTONOMOUS-EXECUTION-POLICY.md`, `CHATGPT-OPERATING-PROTOCOL.md`,
`DEV-LOOP-V2.md`, and `AI-COST-AND-TESTING-GOVERNANCE.md`. Those paths remain
as compatibility references until inbound references are migrated.

## Purpose and authority

Use this document for detailed agent autonomy, coordination, validation, cost,
and development-loop rules. For every meaningful task, first read current GitHub
`main`, `AGENTS.md`, `docs/AI-CONTROLLER.md`, the active Issue/PR, and only the
domain document needed for that task.

`AI-CONTROLLER.md` is the human live-status authority.
`AI-RELEASE-STATE.md` is the CI-required machine-readable release-state file.
`AI-HANDOFF.md` is its field-compatible legacy adapter for inbound links.

## Operating model

Use one bounded Issue → short-lived branch → focused PR → deterministic
acceptance boundary → `main`. One primary coding agent owns a code path; a
specialist may independently review but must not compete on the same files.

Default to acting when the action is safe, reversible, and in approved scope.
Merge a bounded PR when the active Issue/PR or newer owner direction authorizes
it and all required checks are green. Do not ask the owner to perform routine
repository actions that an available tool can safely complete.

## Decision boundaries

### GREEN — decide and continue

Implement, test, and continue for in-scope code structure, ordinary bug fixes,
accessibility, safe refactors, deterministic tests, ordinary error states, and
small documentation corrections. Never weaken a valid test merely to obtain a
green result.

### YELLOW — choose conservatively and record when material

Use the safest reversible option for non-final copy, optional labels, harmless
defaults, demo/QA data, or similarly reversible implementation choices. Clearly
label fictional data and do not present it as a production fact or partnership.

### RED — stop narrowly

Stop before a material product/business-model, legal, privacy, security,
financial, payment/donation, production-DNS, paid-vendor, destructive-data, RLS,
or explicit phase-gate decision unless authoritative repository evidence already
resolves it. Finish separable safe work, record the exact blocker, and update
the handoff only when its workflow/acceptance contract requires it.

Phase 3 feature development, production DNS, paid infrastructure, material RED
decisions, `OD-003`, and `OD-004` remain owner-gated. Meta/Facebook is deferred:
keep Facebook disabled and do not spend cycles on Meta until the owner reopens
that lane.

## Authentication failsafe

Open a secure connector handoff only for a concrete required action. Never ask
for secrets, tokens, passwords, or recovery codes in chat. If authentication is
unavailable or unresolved after a short attempt, stop waiting; continue every
safe read-only task, record one exact pending action, and do not reopen the same
handoff repeatedly in the same run.

## Deterministic validation

GitHub Actions and repository scripts own formatting, lint, build, tests,
migration replay, pgTAP/RLS, Playwright, dependency review, change classification,
and merge evidence. `scripts/classify-change-impact.sh` is the canonical risk
classifier; unknown paths receive broader validation.

- Documentation/instruction changes: formatting and required repository gates.
- Application/shared/workflow/dependency changes: CI, including tests and build.
- Database/RLS/RPC changes: Database QA with migration replay and pgTAP/RLS.
- Persona-sensitive or browser-impacting work: applicable Persona/Hosted QA.
- Release readiness: broader human-style/security/accessibility regression.

Run the strongest relevant available checks, fix real GREEN/YELLOW findings, and
record the exact result. A skipped heavy job is not equivalent to full acceptance.

## AI, cost, and review discipline

Use deterministic automation for repeatable work. Reserve AI for bounded
implementation, non-obvious diagnosis, architecture/security/product reasoning,
visual critique, semantic acceptance, and owner RED decisions. Do not spend AI
credits polling routine CI, formatting, rerunning deterministic checks, or
duplicating ordinary implementation work.

Use the lowest-cost capable surface: GitHub Actions for deterministic work;
ChatGPT for control-tower/product/RED reasoning; a single coding agent for a
bounded implementation; specialist review only when it adds distinct value. Do
not add paid runners, monitoring, testing, deployment, or orchestration services
without owner approval.

## Deployment and release boundaries

`main` is the production branch and receives normal Vercel production deployments.
Routine branches do not automatically receive Vercel previews. Inspect Vercel at
most once when a product-affecting current-main commit awaits deployment; do not
poll or force deployment for documentation-only changes.

GitHub Pages remains the normal staging/QA surface. Do not alter production DNS,
providers, Supabase/RLS, secrets, or data without explicit authority.

## Completion record

When the task requires release-state changes, update
`AI-RELEASE-STATE.md` and the compatible `AI-HANDOFF.md` adapter together. The
required top-level fields are:
`STATUS`, `CURRENT_PHASE`, `CURRENT_CHECKPOINT`, `NEXT_CHECKPOINT`,
`OWNER_DECISION_REQUIRED`, `SAFE_TO_CONTINUE`, and `ACCEPTED_CODE_SHA`.
Use `ACCEPTED_CODE_SHA: NONE` until deterministic acceptance exists; at
`COMPLETE`, record the accepted SHA.

Keep PRs focused, avoid unrelated accumulation, and refresh `main` before the
next safe batch.
