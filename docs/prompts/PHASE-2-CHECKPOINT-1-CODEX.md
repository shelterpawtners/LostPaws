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
2. begin entering their own business details immediately without being forced through a search gate;
3. have ShelterPawtners use the entered details to surface likely existing organization matches alongside the form as assistive guidance;
4. review a likely match and request membership/access where appropriate;
5. request ownership/claim review without receiving automatic control;
6. continue creating a genuinely new organization when no candidate is correct;
7. create or relate child/franchise organizations where appropriate;
8. support one organization with multiple locations;
9. support corporate parent/child structures;
10. support independently owned franchises/brand relationships without sharing private control;
11. preserve duplicate/claim review and audit foundations for platform administrators.

## User-approved onboarding UX rule

Organization matching is **assistive, not a mandatory first step**.

The preferred experience is:

- Partner begins a normal business-information form.
- Preserve/capture what the Partner enters as appropriate to the onboarding state rather than discarding it merely because a possible match exists.
- As enough identifying fields become available, evaluate possible existing organizations using the entered data.
- Present likely matches in a secondary panel/list beside the form on desktop and an accessible equivalent on mobile.
- Candidate matches are suggestions, not proof that the Partner represents that organization.
- The Partner can inspect a candidate and choose a safe next action such as request access, request ownership/claim review, or indicate that it is not their business.
- If none match, the Partner continues the same form toward creation of a new organization without restarting onboarding or re-entering information.
- Do not create a duplicate final organization record merely because draft/onboarding data was captured. Resolve the draft/submission to the chosen existing or new organization outcome.

The matching experience should feel helpful and low-friction, especially because likely matches may be rare during early launch.

## Business rules

Follow these user-approved rules exactly:

- Business name alone is never proof of control.
- Entry-first assisted matching replaces a mandatory search-before-create UX.
- Before final creation of a new organization, available entered details must be checked for likely existing matches so obvious duplicates are not casually created.
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
- Business-details-first form flow.
- A draft/submission strategy that safely preserves entered onboarding data until it is resolved to an existing or new organization.
- Incremental organization candidate matching based on available entered fields.
- Desktop side-panel candidate presentation and accessible mobile equivalent.
- Clear match-confidence/helpful-reason presentation where practical without implying ownership or verification.
- Ability to dismiss/mark a candidate as not the Partner's business and continue the form.
- Request-membership/access workflow from a candidate.
- Request-ownership/claim-review workflow from a candidate.
- New organization creation using already-entered form data when appropriate.
- Multi-location handling.
- Parent/child and independent franchise/brand relationship handling.
- Admin-visible pending claim/duplicate-review foundation sufficient for later admin UI expansion.
- reason/status/audit data needed to understand pending, approved, declined, deprecated, or otherwise resolved organization-control actions.
- server-side/RLS enforcement for all privileged changes.

## Matching design guidance

Use conservative, explainable matching. Avoid pretending to have perfect entity resolution.

Reasonable signals may include:

- normalized public or legal/DBA name;
- website/domain;
- normalized public phone;
- street/city/state/postal information;
- parent brand;
- known location or organization relationships.

Strong unique signals such as an exact normalized domain/address combination may rank more highly than name similarity alone. Name similarity should produce suggestions, never automatic control or destructive merging.

Do not require an external paid matching service for Checkpoint 1. Keep the matching layer replaceable/extensible for future enrichment.

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
2. Entering a business name matching an existing organization does not automatically grant access or ownership.
3. Form data can produce candidate matches without forcing selection of a candidate.
4. A user can reject/dismiss a false-positive candidate and continue creating a genuinely separate organization.
5. A likely existing match is surfaced before final duplicate creation when sufficient identifying data exists.
6. A membership/access request does not grant membership before authorization.
7. A claim/ownership request does not grant owner/admin control before authorization.
8. Independent franchises sharing a brand do not inherit access to each other.
9. Corporate parent/child relationships do not automatically grant sibling access.
10. One authorized organization member can work with that organization’s multiple locations according to current permissions.
11. A genuinely separate business with a similar name can remain a separate organization.
12. Admin claim/duplicate resolution actions preserve audit history.
13. Demo identities and records remain isolated.
14. Existing Phase 1 pgTAP/RLS tests continue to pass.
15. `npm run check` passes.
16. `npm run build` passes.
17. Relevant Playwright flows pass, including entry-first form + assisted candidate matching.

Add missing database/RLS and E2E tests rather than relying only on UI behavior.

## UX requirements

- Mobile-first business entry and organization resolution.
- On desktop, prefer a primary form with a secondary candidate-match panel/list that updates as sufficient data becomes available.
- On mobile, preserve the same information and actions without forcing an unusable two-column layout; use an accessible inline section, drawer, or other tested pattern.
- Do not interrupt early form entry with aggressive modal matching.
- Do not force users to restart or re-enter business details after selecting or rejecting a candidate.
- Candidate matches should explain why they may be relevant where useful, such as same website/domain, nearby address, matching phone, similar name, or parent brand.
- Clearly distinguish:
  - possible existing organization,
  - request access,
  - request ownership review,
  - not my business,
  - continue creating new business,
  - separate location/child/franchise scenarios.
- Do not use language that implies ShelterPawtners has verified a business when it has not.
- Preserve keyboard access, focus, contrast, field-level errors, touch targets, and screen-reader clarity for dynamically updated match suggestions.

## Decision policy

Do not stop for routine implementation choices.

Escalate only if a decision materially affects organization ownership/control policy, destructive data handling, privacy/security, paid services/credentials, or conflicts with approved product rules.

For routine matching heuristics or UI implementation choices, make a reasonable conservative choice, test it, and record meaningful rationale in `docs/DECISION-LOG.md`.

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
- draft/onboarding data preservation approach;
- organization candidate-matching approach and signals;
- desktop and mobile assisted-matching UX;
- membership request behavior;
- ownership/claim-review behavior;
- false-positive/dismissal behavior;
- new-organization creation behavior;
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
