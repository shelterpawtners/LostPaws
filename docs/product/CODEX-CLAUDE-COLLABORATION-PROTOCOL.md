# Codex + Claude Code Collaboration Protocol

Status: active working agreement for the ShelterPawtners / LostPaws repository.

## Goal

Use multiple coding agents in parallel without duplicate implementation, merge churn, or silent conflicts.

## Core rules

1. `main` remains the only release-candidate source of truth.
2. Do not have Codex and Claude Code edit the same feature branch at the same time.
3. Each agent gets a clearly bounded short-lived branch.
4. Separate ownership by file/concern whenever possible.
5. Database migrations are sequential and owned by one agent at a time.
6. If both agents need a shared high-churn file such as `src/main.tsx`, assign routing/integration ownership to one agent and have the other build isolated components/modules.
7. Each agent must read:
   - `docs/AI-HANDOFF.md`
   - `docs/CURRENT-WORK.md`
   - `docs/AI-OPERATING-PROTOCOL.md`
   - `docs/product/DUAL-MARKETPLACE-RAVE-SHELTER-EXECUTION-PLAN.md`
   - the controlling GitHub issue for its track.
8. Each agent must update handoff/current-work notes before finishing substantial work.
9. Do not redraw or alter owner-approved brand assets.
10. Do not weaken tests, RLS, auth boundaries, or legal/financial guardrails to make a PR easier to merge.

## Recommended ownership

### Claude Code

Primary strengths for this sprint:

- RAVE Shelter and LostPaws visual composition;
- mobile-first responsive layout;
- brand asset integration;
- copy hierarchy and conversion sections;
- Learn/FAQ/Hero Vendor presentation components;
- accessibility and design polish.

Recommended Track 1 branch:

`feature/mobile-rave-lostpaws-claude`

Recommended Track 3 branch:

`feature/hero-vendor-learn-claude`

### Codex

Primary strengths for this sprint:

- schema review;
- migrations;
- RLS and database tests;
- dual-marketplace audience filtering;
- Events model;
- deterministic route/data wiring;
- Playwright/mobile regression;
- CI/lint/build fixes.

Recommended Track 2 branch:

`feature/dual-marketplace-events-codex`

## Parallel start

### Claude Code starts now on Track 1

Allowed ownership:

- RAVE Shelter presentation components/CSS;
- LostPaws presentation components/CSS;
- approved brand asset references;
- conversion CTA components;
- mobile visual QA fixes;
- page copy within the controlling plan.

Avoid unless explicitly needed:

- Supabase migrations;
- offer/event schema;
- broad marketplace query changes.

### Codex starts now on Track 2 schema review

First deliverable should be a written implementation proposal before broad code changes:

- inventory existing relevant tables/columns/RPCs;
- identify what can be reused;
- propose minimum migration for `pet` / `human_rave` / `both` audience separation;
- propose Events model or extension of existing structures;
- list RLS consequences;
- list frontend modules that would need integration;
- call out any files Claude is currently likely to touch.

Only then implement on its own branch.

## Integration sequence

1. Both agents branch from the same current `main` where possible.
2. Track 1 may merge first because mobile/branding/conversion is launch priority.
3. Before Track 2 opens final PR, update/rebase from new `main` and resolve only intentional integration conflicts.
4. Track 2 then merges with database QA and targeted marketplace regression.
5. Track 3 starts from the post-Track-2 `main` unless its work is isolated enough to proceed safely.
6. No long-lived integration branch.

## Conflict prevention

Avoid simultaneous edits to:

- `src/main.tsx`
- global CSS entry files
- shared marketplace query modules
- the same Supabase migration file
- the same test files

Prefer new isolated modules such as:

- `src/components/rave/*`
- `src/components/lostpaws/*`
- `src/components/marketplace/*`
- `src/lib/marketplace-audience.ts`
- `src/lib/events/*`

Exact paths should follow the existing repo structure rather than creating a parallel architecture unnecessarily.

## PR requirements

Each PR should state:

- controlling issue;
- exact scope;
- files/components owned;
- tests run;
- screenshots/mobile evidence where visual;
- migrations/RLS effects where database-related;
- unresolved follow-ups;
- any change to product assumptions.

If an agent discovers a product decision not covered by the controlling plan, it should stop that specific decision and document the question rather than inventing policy.
