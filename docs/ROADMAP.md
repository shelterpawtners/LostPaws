# ShelterPawtners roadmap

## Canonical program structure

The delivery sequence is frozen and authoritative:

1. **Platform + Data Foundation**
2. **Partner Marketplace MVP**
3. **Guardian + Shelter Passport MVP**
4. **Impact + Giving + Financial Intelligence**
5. **Integrations + Marketplace + Production Launch**

The detailed authoritative phase specifications are:

- Phase 1: `docs/PHASE-1-EXECUTION.md` and `docs/PHASE-1-PROGRESS.md`
- Phase 2: `docs/phases/PHASE-2.md`
- Phase 3: `docs/phases/PHASE-3.md`
- Phase 4: `docs/phases/PHASE-4.md`
- Phase 5: `docs/phases/PHASE-5.md`

Newer explicit user decisions override older planning. Implemented repository architecture overrides stale architecture notes. Older festival-MVP slices, batch plans, and the former Phase 2–10 roadmap are superseded as execution authority. Their useful ideas remain reference material or backlog themes only and do not become active requirements unless explicitly re-approved.

## Current gate

Phase 1 is engineering-complete and is the approved platform/data foundation baseline.

Phase 2 is the next phase, but implementation remains inactive until the Phase 2 specification has been reconciled against the approved business-decision baseline and an execution checkpoint plan is reviewed.

Production infrastructure, public DNS changes, production deployment, and replacing the current public website remain separately gated and require explicit authorization.

## Authority and working rules

Use this precedence when documents or older project knowledge conflict:

1. newest explicit user decision;
2. implemented repository architecture, schema, migrations, and passing tests;
3. `AGENTS.md` and the canonical topic document;
4. active phase specification;
5. approved decision log and completed phase evidence;
6. research/reference documents;
7. historical festival planning and backlog;
8. older ShelterPawtners chat ideas and legacy-repository concepts.

Anything materially ambiguous in product, legal, financial, privacy, security, or architecture is an `OPEN DECISION` until resolved.

## Phase 1 — Platform + Data Foundation

**Status: engineering-complete.**

Established foundations include:

- one identity with multi-role authorization;
- CRM-style organizations, memberships, locations, hierarchy, and relationships;
- pet identity, temporal guardianship, provenance, lifecycle, and external identifiers;
- offers, immutable offer versions, eligibility, claims, and redemptions;
- secure opaque token foundations;
- economic/giving event foundations with integer minor units and append-oriented records;
- RLS and restricted private audit/token stores;
- React, TypeScript, Vite, Supabase, role-aware routing, and accessible application foundations;
- deterministic demo data and repeatable local database setup.

Validation evidence in `docs/PHASE-1-PROGRESS.md` includes two clean local resets, two 9/9 pgTAP runs, 8/8 Playwright checks, passing `npm run check`, and passing `npm run build`.

A cloud or sandbox environment being unable to run Docker, Supabase reset, or browser preview does not invalidate stronger completed local validation.

## Phase 2 — Partner Marketplace MVP

**Status: approved specification; not yet activated.**

Canonical specification: `docs/phases/PHASE-2.md`.

Primary outcome: real pet businesses and other eligible Partner organizations can join the ecosystem, create trustworthy public profiles, publish useful offers, support easy utilization/redemption, and participate in measurable shelter impact.

### Approved Phase 2 business baseline

- Partners may self-publish minimum-safe profiles and eligible offers without manual preapproval, subject to moderation, suspension, correction, and removal.
- Positive Partner states are `Basic Partner`, `Participating Partner`, `Redemption Verified`, and `Shelter Impact Partner` unless later explicitly renamed.
- Organization discovery must happen before create/claim flows.
- Same or similar business names do not imply shared ownership or account control.
- Multi-location businesses, corporate chains, independently owned franchises, and brand relationships must be modeled without collapsing separate legal/operational entities.
- Dollar savings are called verified only when a confirmed redemption supports a defensible baseline-versus-redeemed-value calculation.
- Redemption UX must be mobile-first, extremely easy, and designed for progressive automation, targeting a scan/open/confirm experience rather than manual customer search and re-entry.
- Contribution commitments, accrued impact, externally verified contributions, and settled contributions remain distinct states.
- Giving should be framed positively as measurable mission participation and Partner value, not only as a request for donations.
- A qualified giving/fundraising/payment provider must be researched before production charitable-money movement is implemented.
- Launch operations focus on Michigan and especially Metro Detroit, while the architecture and MVP support nationwide and online participation from launch, including LostPaws/RAVE community participants and testers.

### Phase 2 activation gate

Before implementation begins:

1. reconcile `docs/phases/PHASE-2.md` against `docs/DECISION-LOG.md`;
2. resolve only remaining material decisions that affect schema, trust, financial meaning, or critical UX;
3. research giving-provider options before implementing provider-dependent financial UX;
4. define savings and redemption calculations before showing customer-facing verified totals;
5. break Phase 2 into small Codex engineering checkpoints with explicit QA and acceptance gates;
6. explicitly activate Phase 2.

## Phase 3 — Guardian + Shelter Passport MVP

**Status: frozen planning specification; inactive until Phase 2 approval.**

Canonical specification: `docs/phases/PHASE-3.md`.

Primary outcome: deliver the foundational pet lifecycle across shelter/import, shelter-authored history, adoption, secure transfer, Guardian claim, ongoing Digital Pet Passport continuity, and a Guardian-first path for pets not entering through shelters.

Do not pull Passport transfer or full shelter-created pet workflows backward into Phase 2 merely because earlier festival planning contained them.

## Phase 4 — Impact + Giving + Financial Intelligence

**Status: frozen planning specification; inactive until Phase 3 approval.**

Canonical specification: `docs/phases/PHASE-4.md`.

Primary outcome: convert trustworthy Partner, Guardian, shelter, transaction, adoption, savings, and giving data into persona-specific dashboards and an accounting-grade impact foundation.

Giving must continue to distinguish intent, accrual, external verification, settlement, allocation, and reporting. The platform must not imply ShelterPawtners is itself a charitable recipient unless that status is separately established.

## Phase 5 — Integrations + Marketplace + Production Launch

**Status: frozen planning specification; inactive until Phase 4 approval.**

Canonical specification: `docs/phases/PHASE-5.md`.

Primary outcome: complete production authentication, email, approved marketplace/payment integrations, external connectors, LostPaws/RAVE launch experiences, security hardening, analytics, SEO, accessibility, monitoring, production environments, and launch validation.

No paid production service, production Supabase project, DNS change, or public deployment should be activated without explicit approval.

## Cross-cutting requirements

These apply throughout all phases rather than being deferred cleanup:

| Workstream           | Ongoing requirement                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product and research | Preserve traceable requirements; validate user value; do not convert old ideas into requirements without approval.                                      |
| Brand and content    | Premium accessible presentation, accurate claims, no fabricated partnerships, offers, statistics, or impact.                                            |
| Accessibility        | Keyboard access, focus, contrast, semantic structure, responsive layouts, touch targets, reduced-motion behavior, and browser review.                   |
| Privacy and security | Data minimization, RLS, server authorization, private storage, auditability, secrets management, abuse controls.                                        |
| Marketplace trust    | Provenance, classifications, eligibility, conditions, freshness, expiration, disclosure, correction, reporting, and moderation.                         |
| Organization trust   | Separate registration, membership, ownership/control, verification, publication, franchise/brand relationships, and disputes.                           |
| Financial truth      | Distinguish claims, utilization, verified savings, commitments, accruals, contributions, settlements, and corrections.                                  |
| Quality engineering  | Unit, database/RLS, failure-path, browser, mobile, accessibility, and integration validation appropriate to each checkpoint.                            |
| Operations           | Admin visibility, moderation, support, incident handling, backups, monitoring, release checklists, and cost review.                                     |
| Legal/commercial     | Privacy/terms, Partner agreements, affiliate/sponsorship disclosure, charitable/tax claims, IP, and provider terms.                                     |
| Growth               | Michigan/Metro Detroit operating focus with nationwide-capable online and LostPaws/RAVE participation from launch.                                      |
| Architecture/cost    | GitHub-controlled code and migrations, low initial cost, maintainability, measured scale, and no premature microservices or unapproved Make dependency. |

## Post-MVP backlog themes

The following themes remain strategically useful but are **not active MVP requirements solely because they appeared in older plans**:

- broader marketplace personalization and provider feeds;
- affiliate and sponsorship expansion;
- advanced veterinary/provider care-network access and contributions;
- advanced shelter-system connectors and imports;
- co-guardianship, delegated care, emergency sharing, rehoming, lost-pet functions, memorialization, and pet legacy;
- grant/resource-network tooling for shelters;
- broader festival, artist, brand, and community programs;
- advanced AI matching and assistance;
- privacy-preserving animal-welfare intelligence and research products;
- national shelter/partner community-network concepts;
- tax-document generation beyond explicitly approved Phase 4 scope;
- AI-compute, sustainability, or revenue-allocation formulas such as historic proposed insight-revenue splits;
- advanced POS/ecommerce automation beyond the Phase 2 extensible redemption foundation;
- production-scale disaster recovery, compliance programs, retention/deletion automation, and service-level maturity beyond the approved launch requirements.

Backlog items can be promoted only through an explicit decision and placement into an active or future approved phase.

## Current OPEN DECISIONS

The following should remain explicit rather than being guessed during implementation:

- exact giving/fundraising/payment provider and integration timing;
- detailed verified-savings formulas and evidence rules;
- exact redemption proof levels and fraud controls beyond the approved simple/automated direction;
- minimum Partner publication fields if the Phase 2 specification and UX review expose a material gap;
- claim/dispute evidence and administrative procedures for contested organization ownership;
- detailed handling of externally verified Partner contributions before Phase 4 settlement infrastructure exists;
- final ShelterCARD/ReWards naming where a phase requires the branding decision;
- final legal/entity/nonprofit/fiscal-sponsor structure;
- commercial affiliate/sponsorship agreements and disclosures before those programs become active;
- production provider credentials, production infrastructure, DNS, and launch authorization.

`docs/DECISION-LOG.md` is the canonical record when these are resolved.
