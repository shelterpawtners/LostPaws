# ShelterPawtners Decisions

Canonical durable-decision and open-owner-gate record for ShelterPawtners/LostPaws. Consolidates `docs/OWNER-DECISION-BACKLOG.md`, `docs/DECISION-LOG.md`, `docs/AUTONOMOUS-DECISIONS.md`, and the still-open legal-entity item from `docs/OWNER-REVIEW-DRAFTS-2026-09-12.md` into one place, per the AI-first architecture migration (see `docs/AI-FIRST-MIGRATION-MANIFEST-2026-09-14.md`, Phase 2). IDs, dates, statuses, and resolutions are preserved exactly as recorded in their source documents; nothing here has been reworded or reinterpreted.

`docs/AI-CONTROLLER.md` remains the live human-status authority. This file is the durable-decision and open-gate record; it does not carry current blocker/next-action narrative.

## How to use this file

- **OD- entries** are product-owner gates: `BLOCKING` (a RED decision or explicit phase gate an agent must not cross without resolution) or `PROVISIONAL` (a reversible YELLOW choice an agent made and recorded so Jim can revisit it later), or `RESOLVED`.
- **D- entries** are the canonical architecture/implementation decision log — durable choices with product, security, sequencing, or financial-meaning consequences.
- **AD- entries** are autonomous decisions an agent made without asking first, kept for traceability and review.
- New entries in any series use the next unused number in that series and should never silently overwrite a prior entry — mark the old one `Revised`/`Reversed`/`RESOLVED` and reference its replacement.
- Never record secrets, private customer data, credentials, or production keys in this file.

---

## Open owner/business gates (OD-)

### OD-001 — Phase 2 Checkpoint 5 authorization

Status: RESOLVED
Category: PRODUCT
Introduced by: ChatGPT
Date: 2026-09-08
Review by: Before beginning Phase 2 Checkpoint 5

Question:
May agents begin Phase 2 Checkpoint 5 under the autonomous execution policy?

Provisional assumption:
N/A. Existing product-owner instruction required authorization before starting Checkpoint 5.

Why safe to defer:
The gate remained blocking until explicit product-owner authorization.

Affected areas:
Phase 2 roadmap/progression only.

Resolution:
APPROVED 2026-09-08. Jim explicitly authorized autonomous completion of the remainder of Phase 2 under the repository's autonomous execution policy (now canonically `docs/engineering/AGENT-OPERATIONS.md`). Agents may advance checkpoint-to-checkpoint through the remaining Phase 2 work without seeking routine approval, but all RED gates, production restrictions, no-auto-merge policy, and the Phase 3 gate remain in force.

### OD-002 — Phase 3 authorization

Status: BLOCKING
Category: PRODUCT
Introduced by: ChatGPT
Date: 2026-09-08
Review by: Before beginning Phase 3

Question:
May agents begin Phase 3 under the autonomous execution policy?

Provisional assumption:
N/A. Existing product-owner instruction explicitly requires authorization before starting Phase 3.

Why safe to defer:
Agents can complete and validate all authorized Phase 2 work first. They must stop before Phase 3.

Affected areas:
Phase 3 roadmap/progression only.

Resolution:
PENDING

### OD-003 — Customer-facing verified-savings standard

Status: BLOCKING
Category: FINANCIAL
Introduced by: ChatGPT architecture acceptance review
Date: 2026-09-08
Review by: Before enabling any customer-facing `verified savings` total or verified lifetime-savings reporting

Question:
What evidence and calculation rules qualify a redemption value as customer-facing `verified savings`, including reference-value sources, Partner-entered values, receipts/order evidence, bundles/free items, refunds, corrections, reversals, and lifetime-total treatment?

Provisional assumption:
N/A for customer-facing verified totals. The system may preserve raw/reference/paid amounts, provenance, candidate savings, relationship classification, and append-only correction history, but must not label those values verified.

Why safe to defer:
The provider-/rule-independent CP5 foundation and later Phase 2 work can proceed without making a financial claim to Guardians. This blocks only verified-savings labeling/calculation behavior that depends on the approved standard.

Affected areas:
Guardian/Partner savings labels and totals, reporting, dashboards, exports, analytics, and any derived verified-savings read model.

Resolution:
PENDING

### OD-004 — Charitable giving provider / production money movement

Status: BLOCKING
Category: FINANCIAL
Introduced by: ChatGPT architecture acceptance review
Date: 2026-09-08
Review by: Before provider-dependent charitable money movement or production settlement integration in Phase 2 Checkpoint 6

Question:
Which giving/settlement provider and production flow should ShelterPawtners use for charitable contributions after current provider research and review?

Provisional assumption:
N/A for production money movement. CP6 may implement provider-agnostic participation/reputation states, contribution commitments, accrual semantics, externally verified settled-contribution evidence, audit history, and permission-safe reporting using existing Phase 1 foundations.

Why safe to defer:
The provider-agnostic domain model can be made truthful and testable without collecting/routing production funds. Provider-specific APIs, settlement, receipts, webhooks, batching, and real money movement remain isolated behind this gate.

Affected areas:
Giving-provider integration, donation settlement, receipts, reconciliation, production payment/fund movement, and provider-specific webhooks.

Resolution:
PENDING

### OD-005 — Legal operating entity name and formation status

Status: BLOCKING
Category: LEGAL
Introduced by: ChatGPT (drafted while owner was away)
Date: 2026-09-12
Review by: Before Meta business verification, banking, vendor contracts, tax records, or any legal page that names an operating entity

Question:
What exact legal entity name should Meta and the ShelterPawtners website ultimately identify as the operator/controller of the current application — is ShelterPawtners itself the legal LLC name, or does a separate LLC own/operate the ShelterPawtners brand? Has a Michigan LLC formation and EIN actually been completed, or is this still a preparatory checklist?

Provisional assumption:
N/A. This is a real-world legal/business-formation fact, not an engineering decision an agent can provisionalize. **As of the last verification of this record, ShelterPawtners LLC has not been confirmed as formally created** — this entry preserves the original preparatory checklist (state LLC formation, EIN, verification packet, normalizing public/company records) drafted 2026-09-12 in `docs/OWNER-REVIEW-DRAFTS-2026-09-12.md`, and nothing found in the repository during the 2026-09-14 architecture-migration review shows it has since been completed. Do not represent formation as complete in any product surface, legal page, or business record until the owner confirms it explicitly.

Why safe to defer:
Engineering, Meta app-review readiness work (other than final submission), and the current architecture/documentation migration can all proceed without this being resolved. Meta stays disabled and no legal page asserts a specific operating entity in the meantime.

Affected areas:
Meta Business/Developer verification, legal pages (`docs/legal/*`), banking, vendor/business contracts, tax records, and any future giving-provider agreement (also gated separately by OD-004).

Resolution:
PENDING. Recommended sequence when the owner is ready to resolve this (from the original draft): confirm the legal operating entity name; form/confirm the Michigan LLC through the official State of Michigan/LARA process; obtain/confirm an EIN through the official IRS process; assemble a verification packet (Articles of Organization, EIN confirmation, legal name/address/phone, domain, owner/authorized-representative information); then normalize the name/address/contact information everywhere it appears (Meta settings, website legal pages, Supabase/project business records, vendor onboarding, future banking/payment/giving-provider records) before Meta submission. A qualified attorney/CPA should review the intended structure (separate mission entity vs. technology/platform entity) before formal filings multiply.

---

## Architecture and implementation decisions (D-)

This is the canonical review list for implementation choices and explicit user-approved project decisions that affect product behavior, architecture, trust, sequencing, or financial meaning. Newer explicit user decisions supersede older choices. Historical decisions remain recorded even when later superseded.

### D-001 — Additive reconciliation

- **Status:** Approved and active
- **Decision:** Preserve both existing profiles and all prototype objects while expanding the schema additively.
- **Reason:** Jim explicitly approved profile preservation and prohibited destructive reconciliation.
- **Consequence:** Compatibility objects remain until a later approved cleanup.

### D-002 — Locked private security stores

- **Status:** Approved and active
- **Decision:** Enable RLS on private audit/token tables, create no browser policies, and revoke browser privileges.
- **Reason:** Audit evidence and opaque token digests must be server-controlled.
- **Consequence:** Future access requires narrowly scoped trusted endpoints.

### D-003 — Normalized role bridge

- **Status:** Active
- **Decision:** Retain `participant_roles` for compatibility while making `user_roles` and `role_definitions` the new authorization model.
- **Reason:** One identity may hold several roles; privileged assignment must be auditable.
- **Consequence:** Signup assigns only a nonprivileged starting role.

### D-004 — Reference data over rigid enums

- **Status:** Active
- **Decision:** Use controlled tables for organization types, relationships, categories, lifecycle events, provenance, and source systems.
- **Reason:** These vocabularies must expand without migrations.

### D-005 — Immutable commercial terms

- **Status:** Active
- **Decision:** Separate durable offers from versioned terms; claims and redemptions reference the exact version.
- **Reason:** Editing a live offer must not rewrite history.

### D-006 — Accounting event model

- **Status:** Active
- **Decision:** Store integer minor units and append-oriented event lines; corrections are new events.
- **Reason:** Floating-point amounts and silent edits are unsafe.

### D-007 — Reserved demo identities

- **Status:** Active
- **Decision:** Seed deterministic personas only with `example.invalid` addresses and demo markers.
- **Reason:** Demo data must never contact real people or resemble real partnerships.

### D-008 — Migration creation fallback

- **Status:** Active
- **Decision:** Create the migration file directly after the environment blocked the CLI file-creation call, then apply the exact committed SQL through Supabase migration tooling.
- **Reason:** Work could continue safely without an unmanaged dashboard change.
- **Consequence:** Future environments should return to `supabase migration new` and `db pull` when available.

### D-009 — V2 RAVE Shelter asset family

- **Status:** Active
- **Decision:** Use the approved V2 animated GIF for normal RAVE Shelter presentation, the V2 static PNG for reduced-motion preference, and retain the V2 SVG as the scalable source asset.
- **Reason:** This honors the approved logo motion while providing a stable accessible fallback.
- **Consequence:** The prior RAVE asset remains untouched for historical compatibility but is no longer used by the RAVE landing page.

### D-010 — Organization creator ownership

- **Status:** Active
- **Decision:** Assign the person who creates an organization the normalized `owner` membership role.
- **Reason:** It establishes explicit accountability and supports future multi-member administration without treating every creator as a generic administrator.
- **Consequence:** Additional organization staff will be invited or assigned through later authorized administration flows.

### D-011 — Advisory-led foreign-key indexes

- **Status:** Active
- **Decision:** Add the missing covering indexes reported by the Supabase performance advisor, then re-query the catalog for remaining Phase 1 foreign keys.
- **Reason:** Foreign-key enforcement and lifecycle reporting should remain performant as festival signups grow.
- **Consequence:** Remaining early-stage advisor notices concern unused indexes and deliberate overlapping RLS read policies, not absent foreign-key coverage.

### D-012 — No substitute platform administrator

- **Status:** Active
- **Decision:** Do not grant `platform_admin` until the intended `jim@shelterpawtners.com` identity has actually signed into Supabase.
- **Reason:** Privileged access must attach to a verified real identity, never a guessed or temporary account.
- **Consequence:** The post-build setup action is to sign in once, then perform the documented explicit bootstrap assignment.

### D-013 — Frozen five-phase program structure

- **Status:** User-approved and active
- **Decision:** The canonical delivery sequence is: (1) Platform + Data Foundation, (2) Partner Marketplace MVP, (3) Guardian + Shelter Passport MVP, (4) Impact + Giving + Financial Intelligence, and (5) Integrations + Marketplace + Production Launch.
- **Reason:** The user explicitly froze this phase structure after reconciling older ShelterPawtners plans.
- **Consequence:** Older Phase 2-10 numbering and earlier festival-MVP sequencing are superseded as execution authority. Useful ideas may remain as backlog or acceptance references only.

### D-014 — Monitored Partner self-publication

- **Status:** User-approved; applies to Phase 2
- **Decision:** Partners may create and publish a basic public profile and eligible offers without manual ShelterPawtners preapproval once minimum safe publication requirements are met. Publication remains subject to moderation, suspension, correction, and removal.
- **Reason:** Lower onboarding friction is important for early marketplace growth while platform controls preserve trust.
- **Consequence:** Registration and publication do not imply business licensing, quality verification, charitable status, or ShelterPawtners endorsement.

### D-015 — Partner participation states

- **Status:** User-approved; applies to Phase 2
- **Decision:** Use the progression `Basic Partner` → `Participating Partner` → `Redemption Verified` → `Shelter Impact Partner` unless later explicitly renamed.
- **Reason:** Positive progression rewards real participation without using punitive language.
- **Consequence:** `Redemption Verified` means at least one legitimate non-demo ShelterPawtners redemption has been confirmed. `Shelter Impact Partner` requires stronger demonstrated mission participation and must not be awarded from a pledge alone.

### D-016 — Organization discovery, claims, franchises, and duplicates

- **Status:** Partially superseded by D-024
- **Decision:** Existing organizations cannot be casually claimed. Membership/access or ownership claims require a controlled workflow and administrative resolution where necessary. Platform administrators control duplicate merge/deprecation actions. The earlier mandatory search-before-create UX in this decision is superseded by D-024.
- **Reason:** Business names are not sufficient proof of control and real-world structures include chains, franchises, multi-location independents, and coincidentally similar names.
- **Consequence:** One organization may manage multiple locations. Corporate parent/child relationships may represent controlled chains. Independently owned franchises may share a brand relationship such as `franchise_of` or `branded_as` without sharing account control, private contacts, redemptions, finances, or administration. Matching should consider name, legal/DBA name, website/domain, phone, address, location, parent brand, and known organization relationships.

### D-017 — Verified savings truth standard

- **Status:** User-approved; applies to Phase 2
- **Decision:** Report dollar savings as verified only when a confirmed redemption has a defensible baseline/value comparison and actual redeemed value. Otherwise record utilization without inventing a savings amount.
- **Reason:** Savings reporting must remain trustworthy and useful for later Partner, Guardian, shelter, and impact reporting.
- **Consequence:** Detailed savings formulas remain an implementation-time discussion and must be documented before customer-facing totals are enabled.

### D-018 — Redemption automation principle

- **Status:** User-approved; applies to Phase 2
- **Decision:** Redemption must be mobile-first, extremely easy, and designed for progressive automation. The preferred MVP direction is claim or offer context → unique redeemable record/code/QR → Partner scan/open → minimal confirmation, with the system carrying as much context as possible.
- **Reason:** A workflow requiring employees to search for customers or manually re-enter transaction context will not scale operationally.
- **Consequence:** Phase 2 should establish a simple confirmation path and data model that can later support QR deep links, automated pricing/savings calculations, ecommerce attribution, POS/API connections, or other integrations without a rewrite.

### D-019 — Giving state separation and positive Partner participation

- **Status:** User-approved; applies to Phase 2 and later phases
- **Decision:** Distinguish contribution commitment, accrued impact, externally verified contribution, and settled contribution. A commitment or accrued amount must never be represented as money already donated or settled.
- **Reason:** Financial truth is required while giving should still be positioned as a positive Partner participation and customer-acquisition feature rather than only a donation request.
- **Consequence:** Partner experiences may support constructs such as a fixed amount per verified redemption, percentage-based support, recurring commitments, one-time campaigns, or designated shelter support when legally and operationally supported. Recognition and impact displays must be based on the correct state.

### D-020 — Giving provider before charitable-money implementation

- **Status:** User-approved principle; `OPEN DECISION` for provider selection (tracked as OD-004 above)
- **Decision:** Research and select an appropriate qualified fundraising, donation, payment, or charitable-intermediary service before implementing production charitable-money movement. Do not assume ShelterPawtners itself is the charitable recipient.
- **Reason:** Provider capabilities affect settlement, receipts, eligible recipients, APIs, fees, reconciliation, compliance, and reporting.
- **Consequence:** Phase 2 may build provider-agnostic data/UX foundations and support administrator-verified external contributions where appropriate. Production provider integration and accounting maturity belong to later approved phases unless an earlier bounded integration is explicitly approved.

### D-021 — Michigan-first, nationwide-capable MVP

- **Status:** User-approved and active
- **Decision:** Launch operations focus on Michigan, especially Metro Detroit, while the MVP supports nationwide participation from launch for online/national Partners, LostPaws/RAVE community participants, testers, and other eligible users.
- **Reason:** Local concentration makes Partner and shelter acquisition operationally manageable while nationwide participation increases feedback, community reach, and marketplace learning.
- **Consequence:** Michigan is a go-to-market focus, not an architectural restriction. Marketplace geography must support local locations/service areas, statewide/regional coverage, nationwide coverage, and online availability.

### D-022 — Make remains out of the active architecture

- **Status:** User-approved and active
- **Decision:** Make is on hold and is not part of the current LostPaws application architecture.
- **Reason:** The fresh build should use the implemented repository architecture rather than inheriting older automation ideas.
- **Consequence:** Do not introduce Make as a dependency or integration requirement unless it is explicitly re-approved later.

### D-023 — Current legal/business structure remains unasserted

- **Status:** Active; `OPEN DECISION` for future legal structure (tracked as OD-005 above)
- **Decision:** Product records and customer-facing claims must not assume ShelterPawtners is an approved nonprofit, charitable recipient, B Corp, fiscal sponsor, or official festival partner unless that status is separately established and verified.
- **Reason:** Older project ideas discussed possible nonprofit and LLC structures, but the current repository correctly treats the organization as a startup initiative.
- **Consequence:** Future legal/entity structure is a separate business decision and must not be encoded into MVP product behavior prematurely.

### D-024 — Entry-first assisted organization matching

- **Status:** User-approved; applies to Phase 2 Checkpoint 1; supersedes D-016 only where D-016 required a search-first UX
- **Decision:** Partner onboarding begins with normal business-detail entry. ShelterPawtners uses the information being entered to evaluate likely existing organization matches and surfaces those candidates as assistive guidance beside the form on desktop, with an accessible equivalent on mobile. The user is not forced to complete a separate organization search before entering business details. Before final creation of a new organization, available identifying data must still be checked for likely matches to reduce obvious duplicates.
- **Reason:** Early in the marketplace, most businesses are unlikely to have an existing record. A mandatory search-first flow adds friction before the user has provided useful data. Entry-first matching feels natural, preserves useful submitted information, and still provides a path to align with existing accounts when matches exist.
- **Consequence:** Candidate matches are suggestions only and never prove representation or grant control. A Partner can request access or ownership review from a candidate, dismiss a false-positive candidate, or continue creating a genuinely separate organization without restarting or re-entering the form. Draft/onboarding data may be preserved before final organization resolution, but the implementation must avoid creating duplicate final organization records merely because business details were captured. Matching should be conservative, explainable, extensible, and based on signals such as name, legal/DBA name, domain, phone, address, geography, parent brand, and known relationships.

### D-025 — Conservative exact-signal candidate matching

- **Status:** Active; autonomous Checkpoint 1 implementation decision
- **Decision:** Initial candidate matching uses explainable normalized exact signals only: website, phone, public name, legal/DBA name, primary street address, city, and state. Website and phone rank above names; matching returns reasons and never automatically resolves ownership, membership, or duplicates.
- **Reason:** The earliest partner dataset is small and uncertain. Exact signals reduce false-positive pressure while preserving a replaceable path for later enrichment.
- **Consequence:** Similar names can remain separate organizations. Fuzzy matching, paid enrichment, automatic merges, and any control transfer require later explicit scope and review.

### D-026 — Relationship control boundary

- **Status:** Active; autonomous Checkpoint 1 implementation decision
- **Decision:** A corporate child can name a parent only when the creator already manages that parent. An independently owned franchise instead creates a separate organization and a pending typed relationship to a surfaced brand candidate.
- **Reason:** Parent/child hierarchy is a control-bearing structure, while franchise/brand association is not proof of shared ownership.
- **Consequence:** Neither siblings nor franchises inherit memberships, private contacts, redemption data, finances, or administration. Disputed control remains a review workflow.

### D-027 — Atomic organization creation and revocable control

- **Status:** Active; autonomous Checkpoint 1 QA remediation
- **Decision:** Partner organization creation commits the organization, first owner membership, locations, permitted pending franchise relationship, and draft resolution through one authenticated database operation. `created_by` is provenance and can bootstrap only the first owner; ongoing edit authority requires active owner or administrator membership. Revocation retains a `revoked` membership record.
- **Reason:** Separate browser writes could leave incomplete organizations after partial failure, while permanent creator authority could survive a legitimate control change.
- **Consequence:** A retry cannot create a partially initialized organization through the supported UI, and revoking a membership removes edit authority without deleting the historical membership state. A future staff-management experience must use membership status transitions rather than deleting revocation evidence.

### D-028 — Partner profile publication boundary

- **Status:** Active; autonomous Checkpoint 2 implementation decision
- **Decision:** A Partner profile is independently publishable only after server-side validation of a public description, public contact path, and either location context or an online/service model. Private operational contacts are stored separately and never returned by public profile RPCs.
- **Reason:** This permits low-friction Basic Partner publication without confusing incomplete registrations for trustworthy public listings.
- **Consequence:** Profiles remain subject to suspension/removal and publication is not a verification or endorsement claim.

### D-029 — Public profile-details allowlist

- **Status:** Active; autonomous Checkpoint 2 QA decision
- **Decision:** Public profile detail rendering uses an allowlisted RPC that requires published state and omits private-contact data.
- **Reason:** Rich public profiles must not broaden the public data surface accidentally.
- **Consequence:** Any new public field requires an explicit allowlist update and privacy review.

### D-030 — Partner-managed profile completeness without public contact leakage

- **Status:** Active; autonomous Checkpoint 2 completion decision
- **Decision:** The Partner editor manages approved public profile data and separate primary/operational contacts in one authenticated workflow. Private contacts never appear in public profile RPCs or public UI. Save preserves an already-published state; only Publish and Unpublish change listing visibility.
- **Reason:** Partners need a practical single place to maintain their listing, while the public directory must remain an intentionally narrow data surface.
- **Consequence:** Invalid social URLs are rejected before browser writes, and the server remains the final enforcement point for publication, membership, state, and public visibility.

### D-031 — Transactional immutable offer commands

- **Status:** Active; autonomous Checkpoint 3 implementation decision
- **Decision:** Partner offer creation, revision, lifecycle changes, and duplication use organization-authorized database commands. Material saves append a numbered version, and ordinary browsers cannot directly mutate offer/version records.
- **Reason:** Exact historical terms and cross-organization authorization must survive UI defects and concurrent actions.
- **Consequence:** Public consumers use an allowlisted current-active RPC; scheduled, paused, expired, archived, and historical versions do not appear in ordinary marketplace results.

### D-032 — Opaque single-use redemption capability

- **Status:** Active; autonomous Checkpoint 4 implementation decision
- **Decision:** Guardian claims return a 64-character opaque code while only its SHA-256 digest is retained privately. Partner validation and confirmation are atomic organization-scoped commands, with manual entry always available beside camera capability detection.
- **Reason:** Scan/open/confirm should carry context without exposing PII, permitting replay, or requiring dedicated hardware.
- **Consequence:** Claims remain distinct from utilization; confirmation consumes the token once, creates an exact-version redemption and audit events, and corrections append history rather than deleting the original.

### D-033 — Atomic idempotent Guardian onboarding save

- **Status:** Active; autonomous blocker remediation under the QA automation policy
- **Decision:** Guardian pet onboarding captures form data before authentication work and saves the pet plus its active primary guardianship through one authenticated database function keyed by a per-form submission UUID. The database enforces one pet per user/submission and one active instance of the same guardian-pet relationship.
- **Reason:** The former browser-only sequence could lose the React form target after an asynchronous call, leave partial data if the second write failed, and create duplicate records on retry.
- **Consequence:** A supported retry returns the same pet, pet identity remains separate from the human profile, RLS remains authoritative for reads, and the UI advances only after the atomic operation succeeds. This does not add Phase 3 Passport features or settle future co-guardian/transfer policy.

### D-034 — Active-guardianship dashboard and narrow pet detail

- **Status:** Active; user-directed Issue #4 blocker remediation
- **Decision:** The Guardian dashboard resolves every pet through the signed-in user's active, non-ended guardianships. Existing pets open a read-only current-scope detail route, while creating another pet remains a separate explicit action.
- **Reason:** A permanent static setup prompt concealed saved pets and could send an existing Guardian back through create-new onboarding.
- **Consequence:** Empty and populated Guardian states are now distinct, multiple pets remain first-class, and no full Phase 3 editing, transfer, co-guardian, lifecycle, or Passport expansion is implied.

### D-035 — Shared-development preview isolation

- **Status:** Active; user-directed Issue #6 QA infrastructure
- **Decision:** Human QA uses branch-scoped Vercel Preview deployments connected only to `shelterpawtners-dev` through the project URL and publishable client key. Deterministic shared data comes from the idempotent committed seed; hosted browser tests never receive privileged Supabase credentials.
- **Reason:** Reviewers need a normal HTTPS surface without local Docker while production hosting, DNS, data, and credentials remain separately gated.
- **Consequence:** Preview success is evidence for review, not production promotion. Shared Auth rate limits make seeded identities the stable automation path; disposable hosted-test pets are clearly prefixed and administrative cleanup remains deliberate.

### D-036 — Delegated, audited test-only Admin QA sessions

- **Status:** Active; Issue #7 implementation decision
- **Decision:** QA persona switching uses a server-issued, one-time session exchange for reserved `@example.invalid` accounts. The persisted administrator session is never replaced; a separately scoped client carries the acting test user's actual Supabase JWT.
- **Reason:** This preserves real RLS fidelity without revealing passwords or server credentials, and makes return-to-admin immediate.
- **Consequence:** Server functions remain role-authorized, environment-guarded, and audited. Arbitrary production-user impersonation is explicitly unsupported.

### D-037 — Tab-scoped QA persona continuity

- **Status:** Active; Issue #8 QA remediation decision
- **Decision:** The separate acting-user client uses its own `sessionStorage` key so an active QA persona survives a page reload in the same browser tab, while the real administrator remains in the normal persisted Supabase storage key.
- **Reason:** Hosted regression and human QA both need to test navigation and refresh without silently reverting identity; a tab boundary limits this temporary delegated session to the current QA tab.
- **Consequence:** Closing the tab ends the acting-session continuity, `Return to Admin` removes the dedicated key and restores the existing admin session without credentials, and neither client overwrites the other.

### D-038 — Profile/data review locks relationship-first MVP sequencing

- **Status:** Active; Issue #9 review decision
- **Decision:** Preserve the existing normalized identity, organization, pet, guardianship, offer, and verification foundations without speculative schema expansion. Treat `created_by` as provenance rather than permanent pet authority, and activate shelter-created Passport transfer, co-guardian control, and responder-linked adoption verification only through dedicated transactional vertical slices.
- **Reason:** The necessary base relations already exist, while premature nullable fields or form edits would not solve the real access-control and provenance risks.
- **Consequence:** No migration is added for Issue #9. The documented transfer, co-guardian, organization-claim, and adoption-response gates become prerequisites for their respective future UI slices.

### D-039 — Hosted QA as default Phase 2 acceptance lane

- **Status:** Active; Issue #6 implementation decision
- **Decision:** Hosted QA now runs automatically for push events on `qa/guardian-registration-personas` and pull requests targeting `build/festival-mvp`, while Persona QA remains a manual deterministic lower-level local-Supabase/pgTAP regression gate. Hosted acceptance includes an explicit handoff-authorization guard (`SAFE_TO_CONTINUE: YES` and `OWNER_DECISION_REQUIRED: NO`) plus a practical Partner → Guardian golden-path regression that preserves the Issue #11 profile persistence check.
- **Reason:** Jim's normal acceptance workflow must use Vercel + shared `shelterpawtners-dev` instead of local Docker resets, but progression still needs explicit repository-state authorization and diagnosable automated evidence.
- **Consequence:** Hosted acceptance evidence becomes the routine signal for ongoing Phase 2 QA while maintaining non-production boundaries, seeded deterministic personas, and no privileged credential exposure in browser tests.

---

## Autonomous agent decisions (AD-)

This is the review list for meaningful decisions an agent (originally Codex) made without asking Jim first. It allows each choice to be validated, questioned, changed, or traced later. User-approved requirements remain authoritative in their normal project documents.

### AD-001 — Keep Google sign-in disabled until configured

- **Date:** 2026-09-06
- **Status:** Active
- **Impact:** Medium
- **Decision:** Show Google sign-in as coming soon instead of starting a provider flow that cannot complete.
- **Why:** Provider credentials and approved redirect URLs are not configured.
- **Alternatives:** Hide Google entirely; allow the button to fail.
- **Consequences:** Email authentication remains the working MVP path. Google can be enabled through configuration without redesigning the screens.
- **Implemented in:** Registration and login.

### AD-002 — Treat the active role as interface context

- **Date:** 2026-09-06
- **Status:** Active
- **Impact:** High
- **Decision:** Store the selected participant role as an interface preference while enforcing permissions through database records and row-level security.
- **Why:** One person may participate in multiple roles, but changing a menu selection must never grant access.
- **Alternatives:** Put the active role in the authentication token; require separate accounts.
- **Consequences:** Role switching is simple. Every protected action must still validate identity, membership, guardianship, and permission at the data or server layer.
- **Implemented in:** Participant dashboard and authentication architecture.

### AD-003 — Protect dashboard and onboarding routes

- **Date:** 2026-09-06
- **Status:** Active
- **Impact:** High
- **Decision:** Redirect anonymous visitors from dashboard, pet setup, and organization onboarding to sign-in.
- **Why:** These pages create or expose account-linked information.
- **Alternatives:** Allow anonymous completion and require sign-in only at submission.
- **Consequences:** Private workflows require authentication. Public landing pages and marketplace previews remain accessible.
- **Implemented in:** Frontend routing and session handling.

### AD-004 — Use a private hosted preview before public deployment

- **Date:** 2026-09-06
- **Status:** Active
- **Impact:** Medium
- **Decision:** Publish development milestones privately while leaving `shelterpawtners.com` and DNS unchanged.
- **Why:** This supports realistic review without treating development as production.
- **Alternatives:** Local review only; immediate public replacement.
- **Consequences:** Production infrastructure, public access, and DNS remain separate approval gates.
- **Implemented in:** Hosting and release process.

### AD-005 — Lock the private audit store from browser roles

- **Date:** 2026-09-06
- **Status:** Active (explicitly approved by Jim)
- **Impact:** High
- **Decision:** Enable row-level security on `private.audit_events`, define no browser-facing policies, and revoke DML privileges from `anon` and `authenticated`.
- **Why:** Audit history is security evidence and must not be readable or mutable through the browser-facing Data API. RLS is retained as defense in depth even though the `private` schema is not exposed.
- **Alternatives:** Rely only on the private schema and grants; add a client-readable audit policy.
- **Consequences:** Only trusted backend or database-owner paths can write audit records. Any future audit viewer must use a narrowly scoped server-side endpoint rather than direct client table access.
- **Implemented in:** `shelterpawtners-dev` migration `lock_private_audit_events_rls` and the foundational repository migration. Both existing development profiles were preserved unchanged.

---

## Entry templates

### New OD- entry

```markdown
### OD-XXX — <short title>

Status: PROVISIONAL | BLOCKING | RESOLVED
Category: UX | PRODUCT | SECURITY | PRIVACY | LEGAL | FINANCIAL | PRODUCTION | OTHER
Introduced by: <agent>
Date: YYYY-MM-DD
Review by: <milestone/checkpoint if applicable>

Question:
<What ultimately needs product-owner preference/approval?>

Provisional assumption:
<What the agent used to keep moving, or N/A if BLOCKING?>

Why safe to defer:
<Why this is reversible / isolated, or why it must block?>

Affected areas:
<files/features/tests>

Resolution:
<PENDING or final decision + reference>
```

### New D- entry

```markdown
### D-XXX — Decision title

- **Status:** Active
- **Decision:** What was chosen.
- **Reason:** Evidence and reasoning.
- **Consequence:** Benefits, limitations, cost, risk, and future changes.
```

### New AD- entry

```markdown
### AD-XXX — Decision title

- **Date:** YYYY-MM-DD
- **Status:** Active
- **Impact:** Low, Medium, or High
- **Decision:** What was chosen.
- **Why:** Evidence and reasoning.
- **Alternatives:** Other reasonable choices.
- **Consequences:** Benefits, limitations, cost, risk, and future changes.
- **Implemented in:** Relevant feature, file, migration, or workflow.
```
