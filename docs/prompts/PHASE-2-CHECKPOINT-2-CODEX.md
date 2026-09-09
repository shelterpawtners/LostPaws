# Codex Work Prompt — Phase 2 Checkpoint 2

## Partner Profile + Public Directory

Phase 2 is active. Checkpoint 1 is accepted. Execute only Checkpoint 2 from `docs/PHASE-2-EXECUTION-PLAN.md`.

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
- `docs/PHASE-2-CHECKPOINT-1-PROGRESS.md`
- `docs/PHASE-2-CHECKPOINT-1-QA.md`
- current Supabase migrations/schema
- current automated tests

Do not copy implementation code, CSS, HTML, components, or architecture from Core or RaveShelter.

Do not begin Checkpoint 3 or later work except minimal scaffolding required for Checkpoint 2.

## Objective

Deliver the Partner profile and public directory foundation so a real Partner can:

1. complete a useful public business profile after organization resolution;
2. keep private operational/business-contact information separate from public profile data;
3. describe categories, species served, business model, locations/service areas, online/nationwide availability, booking/order links, social links, and hours where useful;
4. understand profile completion and minimum publication requirements;
5. publish an eligible minimum-safe profile without manual ShelterPawtners preapproval;
6. remain subject to moderation, suspension, correction, and removal;
7. appear in a durable public Partner directory and Partner profile page;
8. be discoverable by useful filters without implying verification or endorsement that ShelterPawtners has not actually performed.

Michigan/Metro Detroit is the go-to-market emphasis, but the architecture and UX must support nationwide and online Partners from launch.

## Business rules

Follow these user-approved rules exactly:

- Basic Partner public self-publication is allowed once minimum safe profile requirements are met.
- Registration/publication does not imply licensing, quality approval, charitable status, government verification, or ShelterPawtners endorsement.
- Keep public contact details separate from private operational contacts.
- Minimum public profile should include at least:
  - business name;
  - category;
  - city/state or clear service area;
  - public description;
  - at least one public contact path such as website, public email, public phone, booking/order link, or social link.
- One organization may have multiple locations.
- Online/national businesses must not be forced to invent a physical local address.
- Independently owned franchises and related brands remain distinct organizations unless ownership/control actually warrants hierarchy.
- Initial Partner participation states remain `Basic Partner`, `Participating Partner`, `Redemption Verified`, and `Shelter Impact Partner`; Checkpoint 2 should display only states already legitimately supported by current data. Do not fabricate progression.
- Public ranking must not imply paid sponsorship or mission status that has not been earned.
- Sponsored/paid placement charging is not part of this checkpoint.
- No fabricated offers, savings, impact, partnerships, or statistics.

## Implementation requirements

Use the existing Checkpoint 1 organization, membership, location, relationship, RLS, and audit foundations.

Before materially expanding Partner UI, address the Checkpoint 1 QA maintainability finding: the Partner onboarding/profile UI should not continue growing as one large component in `src/main.tsx`. Extract reusable Partner onboarding/profile components and a clear data/API boundary as appropriate without changing accepted Checkpoint 1 behavior.

At minimum implement:

### Partner profile data and editing

- public/display business name;
- legal/DBA name where appropriate but do not expose private/legal data publicly unless explicitly designated public;
- short public description;
- longer about description if useful;
- website;
- public email;
- public phone;
- private primary business contact;
- private operational/redemption contact where useful;
- categories;
- species served;
- business model: physical / online / mobile / service-area / national;
- primary and additional locations;
- service areas where appropriate;
- booking/reservation URL;
- ecommerce/order URL;
- logo support only if the existing storage/privacy architecture safely supports it in this checkpoint; otherwise provide a bounded documented placeholder and do not invent a storage shortcut;
- extensible social links including Instagram, Facebook, TikTok, YouTube, LinkedIn, and future link types;
- business hours where useful;
- public/private field separation;
- profile completion state.

Prefer normalized/extensible structures where relationships/reporting are expected. Do not create brittle one-off JSON blobs for core searchable/reportable marketplace relationships unless the existing architecture specifically calls for JSON for flexible peripheral attributes.

### Publication model

- draft/unpublished state;
- minimum-safe publication validation;
- publish/unpublish where authorized;
- admin moderation/suspension/removal foundation consistent with current admin authorization architecture;
- explicit reason/status fields where records are hidden or suspended;
- no manual preapproval required for ordinary minimum-safe Basic Partner publication;
- publication state must be enforced server-side/RLS, not only in the UI.

### Public Partner directory

Build durable public routes/pages that support useful browsing/filtering by available data such as:

- category;
- city;
- state;
- ZIP/postal area where available;
- online/local/national;
- species;
- participation state where legitimate;
- active-offer presence only if current offer data can be read safely without implementing Checkpoint 3 functionality.

Do not implement advanced geospatial search yet.

### Public Partner profile

Display only public fields, including where available:

- business name;
- description/about;
- categories;
- species served;
- website;
- booking/order link;
- public phone/email;
- social links;
- locations/service area;
- hours;
- legitimate current participation/reputation state.

Do not display private operational contacts or internal notes.

## Geography requirements

Support these cases cleanly:

- Metro Detroit physical business;
- Michigan service-area business;
- multi-location Michigan business;
- nationwide online business;
- mobile/service-area provider;
- independently owned franchise with a local location;
- RAVE/community Partner that may operate nationally or event-to-event.

Michigan is a launch focus, not a schema restriction.

## Explicit non-goals

Do not implement in this checkpoint:

- offer creation/editing/versioning mechanics;
- claims/redemptions;
- QR redemption;
- verified savings;
- customer attribution;
- contribution commitments/giving;
- Shelter Impact Partner qualification logic beyond safely displaying a pre-existing legitimate state;
- sponsored placement charging;
- production deployment or DNS;
- deep geospatial search;
- destructive organization merge logic.

## Required tests

Automate at minimum:

1. ordinary Partner can edit only organizations they actively manage.
2. revoked former creator cannot edit profile/private data.
3. public user sees only public profile fields.
4. private primary/operational contacts are not exposed by public queries/pages.
5. Partner A cannot read Partner B private profile/operational fields.
6. minimum publication requirements are enforced server-side.
7. unpublished/suspended/hidden profile is not exposed as public.
8. a Partner can unpublish their own profile when authorized without deleting history.
9. nationwide/online Partner can publish without a fake street address.
10. service-area/mobile model works without forcing a storefront.
11. multi-location public data stays attached to the correct organization.
12. independent franchise relationship does not leak brand/private control.
13. public social links are sanitized/validated as appropriate and remain user-controlled.
14. demo data remains excluded from real metrics/claims.
15. Checkpoint 1 RLS tests continue to pass.
16. Phase 1 pgTAP/RLS tests continue to pass where environment permits.
17. `npm run check` passes.
18. `npm run build` passes.
19. relevant Playwright public and authenticated profile/directory flows pass where environment permits.

Do not weaken tests to make them pass.

## UX requirements

- Mobile-first Partner profile completion.
- Keep onboarding/profile editing understandable for a small independent business owner, not a CRM administrator.
- Make required publication fields clear without overwhelming the user.
- Show profile-completion guidance positively.
- Public directory/profile should feel trustworthy, modern, clean, and consistent with ShelterPawtners brand/accessibility standards.
- Do not use status color alone to communicate meaning.
- Preserve keyboard access, focus, contrast, semantic headings/forms, error association, touch targets, and responsive behavior.
- Online/national/service-area choices should simplify the location UI rather than expose irrelevant address fields.

## Matching/onboarding preservation

Checkpoint 1 behavior is accepted and must remain intact:

- normal business-entry first;
- assisted candidate matching beside the form;
- candidate matches are guidance only;
- request access/claim review does not grant control;
- false-positive dismissal retains entered details;
- atomic organization creation;
- active membership controls ongoing edit authority;
- franchise relationships do not inherit account control.

Refactoring must preserve these behaviors and tests.

## Decision policy

Do not stop for routine implementation choices.

Escalate only if a decision materially affects:

- what public/private business data means;
- a new customer-facing verification/endorsement claim;
- organization ownership/control;
- destructive data handling;
- material privacy/security boundaries;
- paid services/credentials;
- production deployment;
- a major product conflict with approved Phase 2 rules.

For normal UI structure, category modeling, profile-completion scoring, social-link representation, and filtering implementation, choose a reasonable maintainable approach, test it, and record meaningful rationale in `docs/DECISION-LOG.md` when appropriate.

## Completion workflow

Before declaring Checkpoint 2 complete:

1. inspect current schema and accepted Checkpoint 1 implementation;
2. refactor the oversized Partner UI/API boundary where necessary before adding substantial profile functionality;
3. implement in small reviewable changes;
4. run applicable database/RLS/unit/E2E/build checks;
5. visually review desktop and mobile public directory/profile and authenticated profile-editing flows;
6. fix defects found;
7. update applicable canonical docs and create a Checkpoint 2 progress/evidence record;
8. update `docs/CURRENT-WORK.md` to show Checkpoint 2 complete pending review, but do not activate Checkpoint 3 automatically;
9. commit and push a clean checkpoint to `build/festival-mvp`;
10. provide a completion report.

## Completion report

Report:

- files changed;
- migrations/schema changes;
- Partner profile data model;
- public/private field separation;
- profile-completion logic;
- publication/unpublication/moderation behavior;
- directory/filter behavior;
- public Partner profile behavior;
- Michigan/local vs nationwide/online behavior;
- multi-location/service-area behavior;
- refactor performed to keep Partner UI maintainable;
- RLS/security behavior;
- test results;
- browser/mobile/accessibility review;
- meaningful autonomous decisions;
- known limitations;
- any OPEN DECISION;
- commit SHA and remote branch state.

Do not begin Checkpoint 3 until Checkpoint 2 has been reviewed and accepted.
