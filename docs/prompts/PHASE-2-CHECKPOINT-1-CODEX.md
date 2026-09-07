# Codex Work Prompt — Phase 2 Checkpoint 1

## Partner Organization Foundation

Phase 2 is active. Execute only Checkpoint 1 from `docs/PHASE-2-EXECUTION-PLAN.md`.

Repository: `shelterpawtners/LostPaws`
Branch: `build/festival-mvp`
Development Supabase project: `shelterpawtners-dev`

Read before changing anything:

- `AGENTS.md`
- `.agents/skills/shelterpawtners/SKILL.md`
- `README.md`
- `docs/CURRENT-WORK.md`
- `docs/ROADMAP.md`
- `docs/DECISION-LOG.md`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY-AND-PRIVACY.md`
- `docs/USER-ROLES.md`
- `docs/phases/PHASE-2.md`
- `docs/PHASE-2-EXECUTION-PLAN.md`
- current Supabase migrations/schema
- current automated tests

Do not copy code, CSS, HTML, components, or architecture from Core or RaveShelter.

Do not begin Checkpoint 2 or later work except minimal supporting scaffolding required for Checkpoint 1.

## Objective

Deliver the Partner organization foundation so a real Partner user can:

1. enter the Partner onboarding path;
2. search for likely existing organizations before creating one;
3. request membership/access where an organization already exists;
4. request ownership/claim review without receiving automatic control;
5. create a genuinely new organization when appropriate;
6. create or relate child/franchise organizations where appropriate;
7. support one organization with multiple locations;
8. support corporate parent/child structures;
9. support independently owned franchises/brand relationships without sharing private control;
10. preserve duplicate/claim review and audit foundations for platform administrators.

## Business rules

Follow these user-approved rules exactly:

- Business name alone is never proof of control.
- Search before create.
- Existing organizations cannot be casually claimed.
- Membership/access and ownership/claim are distinct concepts.
- Platform administrators control disputed ownership and duplicate merge/deprecation actions.
- Same or similar business names may represent separate businesses.
- One organization may manage several locations.
- Corporate chains may use parent/child organization relationships.
- An independently owned franchise may be a separate organization linked by `franchise_of`, `branded_as`, or the appropriate existing extensible relationship without inheriting account control, private contacts, redemption data, financial data, or administration.
- Matching may consider public/display name, legal/DBA name, website/domain, phone, address, city/state, parent brand, and known locations/relationships.
- Historical references must not be destroyed by duplicate/deprecation workflows.

## Implementation requirements

Use the existing Phase 1 CRM-style organization, membership, location, relationship, role, RLS, and audit foundations wherever possible.

Implement the smallest maintainable vertical slice that satisfies this checkpoint. Prefer additive migrations if schema changes are needed.

At minimum include:

- Partner role-aware onboarding entry.
- Organization discovery/search interface and query logic.
- Candidate matching presentation that does not imply ownership.
- Request-membership/access workflow.
- Request-ownership/claim-review workflow.
- New organization creation flow.
- Multi-location handling.
- Parent/child and independent franchise/brand relationship handling.
- Admin-visible pending claim/duplicate-review foundation sufficient for later admin UI expansion.
- reason/status/audit data needed to understand pending, approved, declined, deprecated, or otherwise resolved organization-control actions.
- server-side/RLS enforcement for all privileged changes.

## Explicit non-goals

Do not implement in this checkpoint:

- full Partner public profiles;
- Partner directory;
- offers;
- claims/redemptions;
- verified savings;
- Partner impact/giving;
- provider integrations;
- production deployment or DNS;
- destructive cleanup of Phase 1 compatibility objects.

## Required tests

Automate at minimum:

1. Partner A cannot edit Partner B.
2. Partner A cannot gain access to an organization by knowing its name.
3. A membership/access request does not grant membership before authorization.
4. A claim/ownership request does not grant owner/admin control before authorization.
5. Independent franchises sharing a brand do not inherit access to each other.
6. Corporate parent/child relationships do not automatically grant sibling access.
7. One authorized organization member can work with that organization’s multiple locations according to current permissions.
8. A genuinely separate business with a similar name can remain a separate organization.
9. Admin claim/duplicate resolution actions preserve audit history.
10. Demo identities and records remain isolated.
11. Existing Phase 1 pgTAP/RLS tests continue to pass.
12. `npm run check` passes.
13. `npm run build` passes.
14. Relevant Playwright flows pass.

Add missing database/RLS and E2E tests rather than relying only on UI behavior.

## UX requirements

- Mobile-first organization discovery and selection.
- Clearly distinguish:
  - existing organization,
  - request access,
  - request ownership review,
  - create new business,
  - separate location/child/franchise scenarios.
- Do not use language that implies ShelterPawtners has verified a business when it has not.
- Preserve keyboard access, focus, contrast, field-level errors, and touch targets.

## Decision policy

Do not stop for routine implementation choices.

Escalate only if a decision materially affects organization ownership/control policy, destructive data handling, privacy/security, paid services/credentials, or conflicts with approved product rules.

For routine matching heuristics or UI implementation choices, make a reasonable choice, test it, and record meaningful rationale in `docs/DECISION-LOG.md`.

## Completion workflow

Before declaring Checkpoint 1 complete:

1. inspect current schema and existing organization objects;
2. implement in small reviewable changes;
3. run all required database/RLS/unit/E2E/build checks;
4. review desktop and mobile flows in a browser;
5. fix defects found;
6. update applicable canonical docs;
7. update `docs/CURRENT-WORK.md` with Checkpoint 1 status but do not activate Checkpoint 2 automatically;
8. commit and push a clean checkpoint;
9. provide a completion report.

## Completion report

Report:

- files changed;
- migrations/schema changes;
- organization matching/discovery approach;
- membership request behavior;
- ownership/claim-review behavior;
- multi-location behavior;
- corporate chain behavior;
- independent franchise/brand behavior;
- duplicate/deprecation foundation;
- RLS/security behavior;
- test results;
- browser/mobile/accessibility review;
- meaningful autonomous decisions;
- known limitations;
- any OPEN DECISION;
- commit SHA and remote branch state.

Do not begin Checkpoint 2 until the checkpoint has been reviewed and accepted.
