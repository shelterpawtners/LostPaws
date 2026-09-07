# ShelterPawtners decision log

This is the canonical review list for implementation choices and explicit user-approved project decisions that affect product behavior, architecture, trust, sequencing, or financial meaning. Newer explicit user decisions supersede older choices. Historical decisions remain recorded even when later superseded.

## D-001 — Additive reconciliation

- **Status:** Approved and active
- **Decision:** Preserve both existing profiles and all prototype objects while expanding the schema additively.
- **Reason:** Jim explicitly approved profile preservation and prohibited destructive reconciliation.
- **Consequence:** Compatibility objects remain until a later approved cleanup.

## D-002 — Locked private security stores

- **Status:** Approved and active
- **Decision:** Enable RLS on private audit/token tables, create no browser policies, and revoke browser privileges.
- **Reason:** Audit evidence and opaque token digests must be server-controlled.
- **Consequence:** Future access requires narrowly scoped trusted endpoints.

## D-003 — Normalized role bridge

- **Status:** Active
- **Decision:** Retain `participant_roles` for compatibility while making `user_roles` and `role_definitions` the new authorization model.
- **Reason:** One identity may hold several roles; privileged assignment must be auditable.
- **Consequence:** Signup assigns only a nonprivileged starting role.

## D-004 — Reference data over rigid enums

- **Status:** Active
- **Decision:** Use controlled tables for organization types, relationships, categories, lifecycle events, provenance, and source systems.
- **Reason:** These vocabularies must expand without migrations.

## D-005 — Immutable commercial terms

- **Status:** Active
- **Decision:** Separate durable offers from versioned terms; claims and redemptions reference the exact version.
- **Reason:** Editing a live offer must not rewrite history.

## D-006 — Accounting event model

- **Status:** Active
- **Decision:** Store integer minor units and append-oriented event lines; corrections are new events.
- **Reason:** Floating-point amounts and silent edits are unsafe.

## D-007 — Reserved demo identities

- **Status:** Active
- **Decision:** Seed deterministic personas only with `example.invalid` addresses and demo markers.
- **Reason:** Demo data must never contact real people or resemble real partnerships.

## D-008 — Migration creation fallback

- **Status:** Active
- **Decision:** Create the migration file directly after the environment blocked the CLI file-creation call, then apply the exact committed SQL through Supabase migration tooling.
- **Reason:** Work could continue safely without an unmanaged dashboard change.
- **Consequence:** Future environments should return to `supabase migration new` and `db pull` when available.

## D-009 — V2 RAVE Shelter asset family

- **Status:** Active
- **Decision:** Use the approved V2 animated GIF for normal RAVE Shelter presentation, the V2 static PNG for reduced-motion preference, and retain the V2 SVG as the scalable source asset.
- **Reason:** This honors the approved logo motion while providing a stable accessible fallback.
- **Consequence:** The prior RAVE asset remains untouched for historical compatibility but is no longer used by the RAVE landing page.

## D-010 — Organization creator ownership

- **Status:** Active
- **Decision:** Assign the person who creates an organization the normalized `owner` membership role.
- **Reason:** It establishes explicit accountability and supports future multi-member administration without treating every creator as a generic administrator.
- **Consequence:** Additional organization staff will be invited or assigned through later authorized administration flows.

## D-011 — Advisory-led foreign-key indexes

- **Status:** Active
- **Decision:** Add the missing covering indexes reported by the Supabase performance advisor, then re-query the catalog for remaining Phase 1 foreign keys.
- **Reason:** Foreign-key enforcement and lifecycle reporting should remain performant as festival signups grow.
- **Consequence:** Remaining early-stage advisor notices concern unused indexes and deliberate overlapping RLS read policies, not absent foreign-key coverage.

## D-012 — No substitute platform administrator

- **Status:** Active
- **Decision:** Do not grant `platform_admin` until the intended `jim@shelterpawtners.com` identity has actually signed into Supabase.
- **Reason:** Privileged access must attach to a verified real identity, never a guessed or temporary account.
- **Consequence:** The post-build setup action is to sign in once, then perform the documented explicit bootstrap assignment.

## D-013 — Frozen five-phase program structure

- **Status:** User-approved and active
- **Decision:** The canonical delivery sequence is: (1) Platform + Data Foundation, (2) Partner Marketplace MVP, (3) Guardian + Shelter Passport MVP, (4) Impact + Giving + Financial Intelligence, and (5) Integrations + Marketplace + Production Launch.
- **Reason:** The user explicitly froze this phase structure after reconciling older ShelterPawtners plans.
- **Consequence:** Older Phase 2–10 numbering and earlier festival-MVP sequencing are superseded as execution authority. Useful ideas may remain as backlog or acceptance references only.

## D-014 — Monitored Partner self-publication

- **Status:** User-approved; applies to Phase 2
- **Decision:** Partners may create and publish a basic public profile and eligible offers without manual ShelterPawtners preapproval once minimum safe publication requirements are met. Publication remains subject to moderation, suspension, correction, and removal.
- **Reason:** Lower onboarding friction is important for early marketplace growth while platform controls preserve trust.
- **Consequence:** Registration and publication do not imply business licensing, quality verification, charitable status, or ShelterPawtners endorsement.

## D-015 — Partner participation states

- **Status:** User-approved; applies to Phase 2
- **Decision:** Use the progression `Basic Partner` → `Participating Partner` → `Redemption Verified` → `Shelter Impact Partner` unless later explicitly renamed.
- **Reason:** Positive progression rewards real participation without using punitive language.
- **Consequence:** `Redemption Verified` means at least one legitimate non-demo ShelterPawtners redemption has been confirmed. `Shelter Impact Partner` requires stronger demonstrated mission participation and must not be awarded from a pledge alone.

## D-016 — Organization discovery, claims, franchises, and duplicates

- **Status:** Partially superseded by D-024
- **Decision:** Existing organizations cannot be casually claimed. Membership/access or ownership claims require a controlled workflow and administrative resolution where necessary. Platform administrators control duplicate merge/deprecation actions. The earlier mandatory search-before-create UX in this decision is superseded by D-024.
- **Reason:** Business names are not sufficient proof of control and real-world structures include chains, franchises, multi-location independents, and coincidentally similar names.
- **Consequence:** One organization may manage multiple locations. Corporate parent/child relationships may represent controlled chains. Independently owned franchises may share a brand relationship such as `franchise_of` or `branded_as` without sharing account control, private contacts, redemptions, finances, or administration. Matching should consider name, legal/DBA name, website/domain, phone, address, location, parent brand, and known organization relationships.

## D-017 — Verified savings truth standard

- **Status:** User-approved; applies to Phase 2
- **Decision:** Report dollar savings as verified only when a confirmed redemption has a defensible baseline/value comparison and actual redeemed value. Otherwise record utilization without inventing a savings amount.
- **Reason:** Savings reporting must remain trustworthy and useful for later Partner, Guardian, shelter, and impact reporting.
- **Consequence:** Detailed savings formulas remain an implementation-time discussion and must be documented before customer-facing totals are enabled.

## D-018 — Redemption automation principle

- **Status:** User-approved; applies to Phase 2
- **Decision:** Redemption must be mobile-first, extremely easy, and designed for progressive automation. The preferred MVP direction is claim or offer context → unique redeemable record/code/QR → Partner scan/open → minimal confirmation, with the system carrying as much context as possible.
- **Reason:** A workflow requiring employees to search for customers or manually re-enter transaction context will not scale operationally.
- **Consequence:** Phase 2 should establish a simple confirmation path and data model that can later support QR deep links, automated pricing/savings calculations, ecommerce attribution, POS/API connections, or other integrations without a rewrite.

## D-019 — Giving state separation and positive Partner participation

- **Status:** User-approved; applies to Phase 2 and later phases
- **Decision:** Distinguish contribution commitment, accrued impact, externally verified contribution, and settled contribution. A commitment or accrued amount must never be represented as money already donated or settled.
- **Reason:** Financial truth is required while giving should still be positioned as a positive Partner participation and customer-acquisition feature rather than only a donation request.
- **Consequence:** Partner experiences may support constructs such as a fixed amount per verified redemption, percentage-based support, recurring commitments, one-time campaigns, or designated shelter support when legally and operationally supported. Recognition and impact displays must be based on the correct state.

## D-020 — Giving provider before charitable-money implementation

- **Status:** User-approved principle; `OPEN DECISION` for provider selection
- **Decision:** Research and select an appropriate qualified fundraising, donation, payment, or charitable-intermediary service before implementing production charitable-money movement. Do not assume ShelterPawtners itself is the charitable recipient.
- **Reason:** Provider capabilities affect settlement, receipts, eligible recipients, APIs, fees, reconciliation, compliance, and reporting.
- **Consequence:** Phase 2 may build provider-agnostic data/UX foundations and support administrator-verified external contributions where appropriate. Production provider integration and accounting maturity belong to later approved phases unless an earlier bounded integration is explicitly approved.

## D-021 — Michigan-first, nationwide-capable MVP

- **Status:** User-approved and active
- **Decision:** Launch operations focus on Michigan, especially Metro Detroit, while the MVP supports nationwide participation from launch for online/national Partners, LostPaws/RAVE community participants, testers, and other eligible users.
- **Reason:** Local concentration makes Partner and shelter acquisition operationally manageable while nationwide participation increases feedback, community reach, and marketplace learning.
- **Consequence:** Michigan is a go-to-market focus, not an architectural restriction. Marketplace geography must support local locations/service areas, statewide/regional coverage, nationwide coverage, and online availability.

## D-022 — Make remains out of the active architecture

- **Status:** User-approved and active
- **Decision:** Make is on hold and is not part of the current LostPaws application architecture.
- **Reason:** The fresh build should use the implemented repository architecture rather than inheriting older automation ideas.
- **Consequence:** Do not introduce Make as a dependency or integration requirement unless it is explicitly re-approved later.

## D-023 — Current legal/business structure remains unasserted

- **Status:** Active; `OPEN DECISION` for future legal structure
- **Decision:** Product records and customer-facing claims must not assume ShelterPawtners is an approved nonprofit, charitable recipient, B Corp, fiscal sponsor, or official festival partner unless that status is separately established and verified.
- **Reason:** Older project ideas discussed possible nonprofit and LLC structures, but the current repository correctly treats the organization as a startup initiative.
- **Consequence:** Future legal/entity structure is a separate business decision and must not be encoded into MVP product behavior prematurely.

## D-024 — Entry-first assisted organization matching

- **Status:** User-approved; applies to Phase 2 Checkpoint 1; supersedes D-016 only where D-016 required a search-first UX
- **Decision:** Partner onboarding begins with normal business-detail entry. ShelterPawtners uses the information being entered to evaluate likely existing organization matches and surfaces those candidates as assistive guidance beside the form on desktop, with an accessible equivalent on mobile. The user is not forced to complete a separate organization search before entering business details. Before final creation of a new organization, available identifying data must still be checked for likely matches to reduce obvious duplicates.
- **Reason:** Early in the marketplace, most businesses are unlikely to have an existing record. A mandatory search-first flow adds friction before the user has provided useful data. Entry-first matching feels natural, preserves useful submitted information, and still provides a path to align with existing accounts when matches exist.
- **Consequence:** Candidate matches are suggestions only and never prove representation or grant control. A Partner can request access or ownership review from a candidate, dismiss a false-positive candidate, or continue creating a genuinely separate organization without restarting or re-entering the form. Draft/onboarding data may be preserved before final organization resolution, but the implementation must avoid creating duplicate final organization records merely because business details were captured. Matching should be conservative, explainable, extensible, and based on signals such as name, legal/DBA name, domain, phone, address, geography, parent brand, and known relationships.

## D-025 — Conservative exact-signal candidate matching

- **Status:** Active; autonomous Checkpoint 1 implementation decision
- **Decision:** Initial candidate matching uses explainable normalized exact signals only: website, phone, public name, legal/DBA name, primary street address, city, and state. Website and phone rank above names; matching returns reasons and never automatically resolves ownership, membership, or duplicates.
- **Reason:** The earliest partner dataset is small and uncertain. Exact signals reduce false-positive pressure while preserving a replaceable path for later enrichment.
- **Consequence:** Similar names can remain separate organizations. Fuzzy matching, paid enrichment, automatic merges, and any control transfer require later explicit scope and review.

## D-026 — Relationship control boundary

- **Status:** Active; autonomous Checkpoint 1 implementation decision
- **Decision:** A corporate child can name a parent only when the creator already manages that parent. An independently owned franchise instead creates a separate organization and a pending typed relationship to a surfaced brand candidate.
- **Reason:** Parent/child hierarchy is a control-bearing structure, while franchise/brand association is not proof of shared ownership.
- **Consequence:** Neither siblings nor franchises inherit memberships, private contacts, redemption data, finances, or administration. Disputed control remains a review workflow.

## D-027 — Atomic organization creation and revocable control

- **Status:** Active; autonomous Checkpoint 1 QA remediation
- **Decision:** Partner organization creation commits the organization, first owner membership, locations, permitted pending franchise relationship, and draft resolution through one authenticated database operation. `created_by` is provenance and can bootstrap only the first owner; ongoing edit authority requires active owner or administrator membership. Revocation retains a `revoked` membership record.
- **Reason:** Separate browser writes could leave incomplete organizations after partial failure, while permanent creator authority could survive a legitimate control change.
- **Consequence:** A retry cannot create a partially initialized organization through the supported UI, and revoking a membership removes edit authority without deleting the historical membership state. A future staff-management experience must use membership status transitions rather than deleting revocation evidence.

## D-028 — Partner profile publication boundary

- **Status:** Active; autonomous Checkpoint 2 implementation decision
- **Decision:** A Partner profile is independently publishable only after server-side validation of a public description, public contact path, and either location context or an online/service model. Private operational contacts are stored separately and never returned by public profile RPCs.
- **Reason:** This permits low-friction Basic Partner publication without confusing incomplete registrations for trustworthy public listings.
- **Consequence:** Profiles remain subject to suspension/removal and publication is not a verification or endorsement claim.

## D-029 — Public profile-details allowlist

- **Status:** Active; autonomous Checkpoint 2 QA decision
- **Decision:** Public profile detail rendering uses an allowlisted RPC that requires published state and omits private-contact data.
- **Reason:** Rich public profiles must not broaden the public data surface accidentally.
- **Consequence:** Any new public field requires an explicit allowlist update and privacy review.
