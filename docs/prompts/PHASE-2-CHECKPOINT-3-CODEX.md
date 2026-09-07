# Codex Work Prompt — Phase 2 Checkpoint 3

## Offer Engine

Phase 2 is active. Checkpoints 1 and 2 are accepted. Execute only Checkpoint 3 from `docs/PHASE-2-EXECUTION-PLAN.md`.

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
- `docs/CONTENT-STANDARDS.md`
- `docs/MARKETPLACE-RESEARCH.md`
- `docs/phases/PHASE-2.md`
- `docs/PHASE-2-EXECUTION-PLAN.md`
- accepted Checkpoint 1 and Checkpoint 2 progress/QA docs
- current offer, claim, eligibility, category, organization, location, RLS, audit, and economic schema/migrations
- current automated tests

Do not copy code, CSS, HTML, components, or architecture from Core or RaveShelter.

Do not begin Checkpoint 4 claims/redemptions or later work except minimal schema/navigation scaffolding strictly required by Checkpoint 3.

## Objective

Deliver a maintainable Partner offer engine so an authorized Partner can create and manage multiple offers safely while public users can see only current, truthful, eligible, published offer terms.

The engine must preserve exact historical terms for later claims/redemptions. Editing an offer must not rewrite the version that a later claim/redemption references.

## Business rules

Follow these approved rules:

- An organization can have multiple offers.
- Offer history is immutable/versioned. Claims/redemptions must later reference the exact offer version.
- Partners may self-publish eligible offers subject to platform moderation/suspension/removal.
- Offer publication does not imply ShelterPawtners endorsement, exclusivity, sponsorship, or verification unless the data explicitly supports that claim.
- Do not fabricate discounts, retail values, redemption counts, inventory, impact, partners, or savings.
- Claim expiration defaults to 30 days unless an authorized Partner configures a different supported value.
- Offers may support future scheduling and expiration.
- Optional inventory/first-N mechanics and per-user/per-pet limits must be concurrency-safe if implemented.
- All-pet offers and shelter-pet-enhanced offers must remain distinct and truthfully labeled.
- Michigan/Metro Detroit is a go-to-market focus, not a geographic architecture restriction.
- Public/general offers, Partner offers, community offers, and internal/reference offers must remain correctly classified. Hidden/internal/reference records must not leak into ordinary public marketplace results.
- Do not create lottery/sweepstakes mechanics in this checkpoint.
- Do not implement commercial payment settlement.

## Required offer lifecycle

Support at minimum:

- draft;
- published/current;
- scheduled/future;
- paused;
- expired;
- archived.

Use the existing schema/lifecycle model where possible rather than inventing parallel state concepts.

## Required Partner capabilities

Authorized organization members should be able to:

1. create an offer;
2. edit draft/current offer terms through a new immutable version rather than rewriting historical terms;
3. preview before publication;
4. publish when minimum-safe publication requirements are satisfied;
5. pause and resume where valid;
6. archive without deleting history;
7. duplicate an existing offer into a new draft;
8. schedule an offer for a future start;
9. define expiration/end date where applicable;
10. manage more than one active or future offer;
11. see basic offer status/history in the Partner UI.

Do not expose raw database concepts to ordinary Partner users.

## Offer terms / fields

Use existing Phase 1 offer/version structures where possible. Support the fields necessary for the approved Phase 2 behavior, including where applicable:

- title;
- short/public description;
- longer terms/details;
- offer classification/source type;
- eligibility type;
- all-pet vs shelter-pet-enhanced distinction;
- eligible organization locations;
- online eligibility;
- start date/time;
- end/expiration date/time;
- configurable claim-expiration window with 30-day default;
- optional inventory quantity;
- optional per-user limit;
- optional per-pet limit;
- optional first-N mechanic where this is simply finite inventory/eligibility, not lottery/sweepstakes;
- public redemption/usage instructions that do not yet implement the Checkpoint 4 redemption workflow;
- disclosure/source/conditions fields needed for truthful marketplace display;
- publication/moderation state;
- immutable version number/reference.

Do not force financial/savings fields that belong to Checkpoint 5 into a verified meaning. If current schema includes reference/list values, preserve them without exposing unapproved "verified savings" totals.

## Public marketplace behavior

Extend the public marketplace/directory experience enough for Checkpoint 3 to present active published offers truthfully.

At minimum:

- public offer detail route/page;
- Partner profile can surface its currently active published offers;
- directory/marketplace can indicate active-offer presence where supported;
- scheduled, paused, archived, expired, suspended, internal/reference, or otherwise non-public offers must not appear as ordinary active public offers;
- public UI must show key conditions/eligibility and avoid misleading exclusivity or endorsement language.

Do not build claim/redeem buttons that create real claims yet. A disabled/informational CTA or bounded placeholder is acceptable if needed for navigation, but do not fake functionality.

## Versioning requirements

This is a hard requirement.

- Never update historical published offer terms in place when those terms may later be referenced by claims/redemptions.
- A material edit creates a new immutable version/current-version pointer or follows the existing equivalent architecture.
- Old versions remain readable to authorized/reporting paths and must not become the public current version.
- Duplicating an offer creates a new offer/draft, not a new version of the original unless the existing architecture explicitly defines otherwise.
- Version history must preserve timestamps/provenance.

## Inventory/concurrency requirements

If inventory/first-N quantity is included:

- use database-enforced concurrency-safe reservation/claim preparation compatible with Checkpoint 4;
- do not rely on browser counts;
- do not oversubscribe under concurrent access;
- because Checkpoint 4 is not active, establish only the safe offer/inventory foundation needed for later claims, not the claim itself.

If existing schema already supports this correctly, preserve and validate it rather than redesigning it.

## Security/RLS requirements

At minimum:

- Partner A cannot create/edit/publish/pause/archive offers for Partner B;
- revoked former organization members cannot edit offers;
- public can read only public/current eligible offer data intended for marketplace exposure;
- internal/reference/demo/private fields remain hidden;
- public RPCs must use explicit allowlists if SECURITY DEFINER is needed;
- no service-role credentials in frontend;
- publication/moderation must be server/RLS enforced;
- admin moderation remains privileged and auditable;
- version history cannot be silently deleted/reassigned by normal Partner users.

## Required automated validation

Add database/RLS/unit/E2E coverage appropriate to the implementation. At minimum cover:

1. Partner A cannot manage Partner B offers.
2. revoked member cannot manage offers.
3. multiple offers for one organization work.
4. published version history survives a material edit.
5. old version remains unchanged after a new version becomes current.
6. draft/scheduled/paused/expired/archived/internal/reference offers are excluded from ordinary active-public results as appropriate.
7. future start/end timestamps are enforced.
8. default claim-expiration setting is 30 days where no override is supplied.
9. invalid start/end ranges are rejected.
10. location/online eligibility is preserved correctly.
11. all-pet and shelter-pet-enhanced eligibility remain distinguishable.
12. duplicate creates a new offer/draft without rewriting the original.
13. optional finite inventory/first-N foundation cannot oversubscribe if implemented.
14. public offer RPC/page exposes only approved public fields.
15. Checkpoint 1 and Checkpoint 2 RLS/security tests remain intact.
16. `npm run check` passes.
17. `npm run build` passes.
18. relevant Playwright Partner/public offer flows run where environment permits; if blocked, record the environment limitation explicitly and commit the test coverage rather than omitting it.

Do not weaken existing tests to make this checkpoint pass.

## UX requirements

- Mobile-first Partner offer editing.
- Make creating a basic offer fast for a small business owner.
- Separate basic fields from advanced limits/scheduling/eligibility so the first experience is not overwhelming.
- Show current state clearly: Draft, Scheduled, Published, Paused, Expired, Archived.
- Clearly explain shelter-pet-enhanced eligibility without implying that ordinary non-shelter pets are adopted/verified.
- Preview should resemble public presentation closely enough to catch wording/eligibility mistakes.
- Use accessible forms, headings, validation, keyboard flow, touch targets, focus, contrast, and status messaging.
- Public offer page must show conditions and expiration clearly.

## Maintainability requirements

Checkpoint 2 deliberately extracted Partner presentation helpers. Continue that direction:

- do not place the offer engine as another large monolithic block in `src/main.tsx`;
- create focused offer components/modules and a clear data/API layer where useful;
- preserve accepted Partner organization/profile behavior;
- prefer reusable status/eligibility/version presentation helpers rather than duplicating literals across editor/public UI.

## Explicit non-goals

Do not implement in Checkpoint 3:

- claim creation;
- redemption confirmation;
- QR codes/scanning;
- verified savings calculations;
- first-known/returning customer attribution;
- giving/contribution settlement;
- payment processing;
- lottery/sweepstakes;
- production deployment or DNS;
- Phase 3 Guardian/Shelter Passport work.

## Decision policy

Do not stop for routine engineering/UI choices.

Escalate only if a decision materially affects:

- financial/legal meaning of an offer;
- eligibility promises not already approved;
- exclusivity/sponsorship/affiliate claims;
- destructive history/version behavior;
- privacy/security boundaries;
- paid services/credentials;
- production deployment;
- a business rule conflict that cannot be safely deferred.

For normal component structure, default limits, status presentation, version labels, date/time UI, and routine filtering choices, choose a reasonable maintainable approach, test it, and record meaningful rationale when appropriate.

## Completion workflow

Before declaring Checkpoint 3 complete:

1. inspect the existing offer/version/eligibility schema and tests before creating new structures;
2. implement the smallest maintainable vertical slice that satisfies the full checkpoint;
3. use committed migrations for schema changes;
4. run applicable database/RLS/unit/build/E2E tests;
5. review Partner editor/preview and public offer pages on mobile and desktop;
6. fix defects found;
7. update canonical docs and create `docs/PHASE-2-CHECKPOINT-3-PROGRESS.md`;
8. update `docs/CURRENT-WORK.md` to Checkpoint 3 complete pending review, but do not activate Checkpoint 4 automatically;
9. commit and push all Checkpoint 3 work to `build/festival-mvp` using the connected GitHub integration if ordinary HTTPS credentials are unavailable;
10. provide a completion report.

## Completion report

Report:

- files changed;
- migrations/schema changes;
- offer/version model used;
- lifecycle/status behavior;
- publication/moderation behavior;
- eligibility model;
- scheduling/expiration behavior;
- inventory/limits behavior;
- duplicate behavior;
- public offer/marketplace behavior;
- RLS/security behavior;
- tests and build results;
- browser/mobile/accessibility review;
- meaningful autonomous decisions;
- known limitations;
- environment-blocked validations;
- any OPEN DECISION;
- final remote SHA.

Do not begin Checkpoint 4 until Checkpoint 3 has been reviewed and accepted.
