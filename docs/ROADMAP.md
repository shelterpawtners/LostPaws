# Roadmap and decision register

## Current gate

The user approved the MVP and authorized development implementation on September 6, 2026. The first working application slice is on `build/festival-mvp` and in draft pull request #1. The committed foundation migration is applied to `shelterpawtners-dev`; RLS is enabled on every exposed application table and the Supabase security advisor reports no findings.

Development implementation may continue within the approved scope. Production infrastructure, public DNS changes, merging to the live release path, and replacing the current public website still require explicit authorization.

Phases express outcome order and dependencies, not fixed release dates. Each MVP slice should be small enough for product, content, security, accessibility, and browser review before the next slice begins.

## MVP finish-line execution plan

The remaining MVP work is organized into batches that produce reviewable outcomes. A batch may begin while an external credential is pending when the work can be safely developed with a mock or disabled integration.

| Batch                                   | Outcome                                                                                                                              | Codex implementation                                                                                                                                                                                                                | Jim input or setup                                                                               | Completion gate                                                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| A: Functional account core              | A person can create one identity, select one or more participant types, sign in, recover access, and complete the correct onboarding | Complete session-aware navigation, protected routes, sign-out, recovery, profile persistence, role switching, validation, errors, and authentication tests                                                                          | Create Google OAuth application credentials and approve final redirect domains                   | Email and Google journeys pass with fresh accounts; unauthorized access is denied                                  |
| B: Guardian and adoption confirmation   | A guardian saves a Passport Lite and submits a real shelter-confirmation request                                                     | Complete pet editing, status tracking, secure token issuance, external shelter response page, confirmation or decline, 30-day expiration, day 10/20/27 reminders, guardian notifications, private evidence upload, and audit events | Select and connect the transactional-email provider; approve sender address and final email copy | Token reuse, expiry, cancellation, cross-user access, upload denial, and delivery failures are tested              |
| C: Organizations and marketplace        | Shelters build profiles; PetBiz and RAVE vendors publish real offers; visitors browse useful listings                                | Complete organization editing, membership context, offer create/edit/unpublish, pet/RAVE/shared filters, listing detail, reporting, link validation, expiration, campaign attribution, and curated seed records                     | Review the initial real listings and any partner-provided terms                                  | Cross-organization isolation passes; listings show source, classification, dates, terms, and accurate status       |
| D: Operations dashboard                 | Jim can operate the launch without database-console work                                                                             | Build admin views for signups, organizations, adoption requests, email failures, offers, edits, reports, suspension, removal, expiration, and audit events                                                                          | Confirm operational priorities and who may receive admin access                                  | Privileged actions are server-authorized, audited, reversible where appropriate, and unavailable to ordinary users |
| E: Controlled community                 | Participants can connect and ask for help without exposing Passport data                                                             | Add organization connection requests, preferred-vendor relationships, offer comments, structured contact requests, basic direct conversations, reporting, blocking, moderation, and rate limits                                     | Approve community rules and moderation language                                                  | Spam, cross-account access, blocking, reporting, and removal paths pass; no private Passport access is implied     |
| F: Release candidate and hosted preview | The full mobile journey is testable through a normal URL                                                                             | Configure non-production hosting, SPA fallback routes, environment variables, analytics events, error monitoring, accessibility fixes, browser/device tests, QR tests, backup check, rollback plan, and launch checklist            | Test the hosted preview on personal devices and approve the release candidate                    | All critical journeys pass on mobile and desktop; no broken calls to action or unsupported claims                  |
| G: Production launch                    | Printed cards and public links reach the approved MVP                                                                                | Create or authorize production Supabase, configure production secrets and OAuth redirects, deploy, validate DNS and HTTPS, run smoke tests, and monitor launch                                                                      | Explicitly authorize production deployment and DNS replacement                                   | User accepts production smoke test; support and rollback ownership are active                                      |

### Critical dependency order

1. Finish the account core and establish the hosted preview environment.
2. Connect Google OAuth and transactional email independently; neither credential should be committed.
3. Complete the adoption-confirmation workflow before turning on automated outreach.
4. Load and review real marketplace records before presenting the marketplace as populated.
5. Finish the operations dashboard before partner self-publication is publicly available.
6. Add controlled community interactions only after reporting, blocking, and moderation exist.
7. Run release-candidate testing before any production or DNS change.

### MVP finish-line definition

The MVP is complete only when the two printed QR journeys, all four account types, Passport Lite, shelter confirmation, partner self-publication, marketplace filtering, operational monitoring, and controlled community interactions work against a hosted environment and pass authorization, accessibility, mobile, email, and recovery tests. A compiled interface or an applied schema alone is not the finish line.

## Product release strategy

The MVP is a multi-sided foundation with guardians as the primary product priority. It must create useful value for three participant types:

1. **Guardians** create an account, are encouraged to set up a pet, and can browse savings immediately.
2. **Shelters and rescues** register an organization and complete its account details so later verification and adoption workflows have a credible starting point.
3. **Pet businesses and service partners** register an organization, describe their services, and publish offers under monitored MVP rules.
4. **Rave Shelter partners and festival visitors** use a LostPaws-branded, human-focused marketplace channel that connects rave-community participation with the ShelterPawtners mission.

Registration is not verification. A registered shelter or partner remains unverified until an authorized review process approves it. During the MVP, authenticated partners may publish services and offers without preapproval, while ShelterPawtners monitors activity and retains suspension and removal controls. Registration alone grants no access to guardian or private Passport data.

The initial marketplace may include public offers without partner agreements when their source and classification are clear. Exclusive, sponsored, affiliate, and verified-adoption benefits require their own approvals and controls.

## ASAP MVP definition

The MVP is successful when guardians, shelters, and partners can understand their value proposition, create and access real accounts, and complete a useful first action. Guardians can begin a limited Digital Pet Passport and browse trustworthy savings. Shelters can establish an organization profile. Partners can establish a business profile and submit services and offers for review.

The MVP includes:

- premium, accessible public pages with distinct guardian, shelter, and partner value propositions;
- ShelterPawtners and LostPaws relationship explained without implying festival affiliation;
- real authentication, secure session handling, and role-aware onboarding;
- a minimal guardian profile;
- post-login guardian choice between recommended pet setup and immediate savings browsing;
- a deliberately limited guardian-created Passport for an existing or adopted pet;
- one pet photo with private storage controls if photo upload is approved for the first release;
- shelter and rescue registration with organization profile details and an explicit unverified or pending-review state;
- partner registration with organization details, service categories, service areas, and monitored self-publication of services and offers;
- a Rave Shelter marketplace channel for human, music, and festival-related products and services that support the mission;
- guardian-initiated adoption verification with shelter contact capture, secure email outreach, a 30-day response window, reminders on days 10, 20, and 27, guardian notification on day 30, status tracking, and a limited shelter confirmation link;
- a post-confirmation shelter conversion experience explaining the free shelter account, Digital Pet Passports, Shelter Report Cards, adoption support, guardian savings, and continuity of information;
- campaign-specific QR destinations and source tracking for festival card distribution;
- a curated savings marketplace with search, categories, filters, source links, classifications, conditions, expiration or ongoing status, and last-verified dates;
- an internal dashboard for verification requests, organization activity, newly published or changed offers, reports, delivery failures, correction, expiration, suspension, and removal;
- clear distinction among public offers, public programs, ShelterPawtners exclusives, verified-adoption benefits, sponsored placements, affiliate links, and community offers;
- baseline accessibility, privacy, authorization, error handling, observability, analytics definitions, moderation, and release checks.

The MVP excludes until separately approved:

- full shelter-account verification, automated social outreach, or SMS verification outreach;
- shelter-created pet records, adoption records, and Passport transfer;
- self-attested access to verified-adoption benefits;
- exclusive offer claims without agreements;
- financial impact or savings totals without defined calculations;
- public Passport sharing by default;
- veterinary contributions or medical authority claims;
- festival affiliation claims;
- automated scraping or auto-publication of third-party promotions;
- research or AI use of private Passport data.

## MVP delivery slices and review gates

| Slice                                   | User outcome                                                                                                                      | Main work                                                                                                                                                                                                                                                                                                                                          | Review gate                                                                                                                          |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| M0: Decisions and design foundation     | The team agrees on exactly what the MVP promises                                                                                  | Apply the approved RAVE Shelter name, expansion, and tagline; confirm final brand assets, front-door naming, launch jurisdiction, age and consent assumptions, onboarding paths, minimum registration fields, minimum Passport fields, privacy defaults, marketplace classification, initial source set, success measures, and deployment approach | User approves the MVP brief, wireframes, copy direction, organization boundaries, and protected data decisions before implementation |
| M1: Public experience                   | Visitors understand ShelterPawtners, LostPaws, Care, Savings, Community, and the next action for guardians, shelters, or partners | Information architecture, homepage, how it works, savings preview, shelter registration entry, partner registration entry, about or mission, privacy and terms placeholders with appropriate legal review flags, responsive design, accessibility                                                                                                  | Browser review on desktop and mobile; every claim and call to action matches reality                                                 |
| M2: Authentication and role-aware entry | Guardians, shelters, and partners can create accounts, sign in, sign out, recover access, and reach the correct onboarding path   | Supabase Auth, secure sessions, minimal personal profile, participant-type selection, organization creation boundary, protected routes, error and recovery states                                                                                                                                                                                  | Authentication, role, and cross-organization denial tests; no private data leakage; user approves onboarding                         |
| M3: Passport Lite and Adoption Request  | A guardian can manage a minimum pet profile and start adoption verification                                                       | Approved fields, adoption question, shelter contact capture, secure email request, status tracking, one-time shelter response, optional private evidence, privacy and correction behavior                                                                                                                                                          | Field review, RLS and storage denial tests, expired and reused link tests, email delivery and failure review                         |
| M4: Marketplace Channels                | Guardians and ravers can browse the correct savings experience                                                                    | Shared offer foundation, pet and human audience classifications, ShelterPawtners marketplace, LostPaws / Rave Shelter filtered marketplace, search, filters, source and terms display, issue reporting                                                                                                                                             | Mobile review, seed data check, no false partnership or festival affiliation claims                                                  |
| M5: Shelter and Partner Registration    | Shelters and partners complete profiles; partners publish monitored services and offers                                           | Organization onboarding, service areas, audience and channel selection, immediate partner publication, edit and unpublish, reporting, internal activity dashboard, suspension controls                                                                                                                                                             | Cross-organization isolation, abuse controls, auditability, truthful organization and listing states                                 |
| M6: Festival release hardening          | The QR-card and all critical signup journeys are reliable for festival use                                                        | Campaign QR destinations, mobile and cellular QA, cross-device accessibility, end-to-end database validation, email deliverability, monitoring, Supabase advisors, rollback and support plan                                                                                                                                                       | User accepts the festival release candidate; production project and deployment require separate authorization                        |

Use [Festival MVP and adoption verification](FESTIVAL-MVP-AND-VERIFICATION.md) as the deadline-specific acceptance plan. M2 through M5 may be delivered as smaller vertical increments. Marketplace and registration interface work can proceed with reviewed fixtures before persistence models are approved. Passport, organization, verification, and transfer implementation must not force unresolved later policy decisions into the schema.

## Beyond-MVP roadmap

| Phase                                         | Scope                                                                                                                                                                                                            | Readiness expectations                                                                                                                                                           |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2: Shelter verification and adoption workflow | Verification review and evidence, scoped shelter memberships, shelter-created pets, in-care history, adoption record, secure claim and transfer, guardian activation, appropriate retained history, auditability | Approved verification evidence, authorized verifier roles, claim delivery and recipient matching, returns and disputes, private-history boundaries, denial and concurrency tests |
| 3: Partner and exclusive savings network      | Partner approval, offer review and publication, exclusive and adoption-qualified offers, geography and eligibility, redemption validation, ShelterCARD and ReWards decision, savings tracking                    | Confirmed commercial terms, disclosures, benefit funding, server-enforced eligibility, redemption proof, fraud controls, documented savings calculations                         |
| 4: Marketplace scale and personalization      | Broader local and national catalog, saved offers, pet-aware relevance, provider feeds, affiliate relationships, freshness automation with human approval, marketplace analytics                                  | Approved consent and data minimization, affiliate and sponsorship disclosures, ranking rules, operational service levels, quality monitoring                                     |
| 5: Community and LostPaws programs            | Independent campaigns, participating festivals and music communities, vendors, artists, brands, incentives, fundraising or purchase-linked support where legally and contractually approved                      | Confirmed participant agreements, multi-event design, financial and charitable review, evidence-based impact definitions, truthful affiliation language                          |
| 6: Care network                               | Authorized veterinarian and service-provider access, scoped contributions, documents, care history, sharing and revocation, corrections and provenance                                                           | Provider eligibility and authority rules, guardian consent, correction policy, storage safeguards, access-after-revocation behavior, medical-content boundaries                  |
| 7: Guardian continuity and pet legacy         | Co-guardianship if approved, delegated care, rehoming and non-adoption transfer, emergency sharing, lost-pet support, memorialization and legacy                                                                 | Conflict and recovery policy, identity matching, sensitive history treatment, public-sharing safeguards, abuse response                                                          |
| 8: Shelter and partner operations             | Dashboards, adoption support, follow-up engagement, grant and resource tools, partner reporting, campaign operations, support workflows                                                                          | Defined measures, scoped operational roles, auditability, support access policy, sustainable data quality processes                                                              |
| 9: Intelligence and impact                    | Privacy-preserving insights, animal welfare reporting, AI assistance, matching support, aggregate research products, impact and funding analysis                                                                 | Approved data-use purposes and consent, evaluation criteria, bias and safety review, aggregation and re-identification safeguards, no guardian PII in research outputs           |
| 10: Platform scale and sustainability         | Production hardening, cost controls, backups, disaster recovery, compliance program, incident response, data lifecycle, integration strategy, performance and operational maturity                               | Proven demand, approved budget, service targets, security review, retention and deletion program, documented ownership and runbooks                                              |

## Cross-cutting workstreams

Every phase must account for the following. They are not end-of-roadmap cleanup items.

| Workstream                | Ongoing requirement                                                                                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product and user research | Validate guardian value first while testing shelter and partner onboarding; preserve traceable decisions                                                                    |
| Brand and content         | Premium visual system, accurate claims, strong page hooks, natural language, no em dashes in customer-facing copy                                                           |
| Accessibility             | Keyboard use, focus, contrast, semantic structure, readable forms, responsive layouts, and defined conformance target                                                       |
| Privacy and security      | Data minimization, RLS, server-side authorization, private storage, auditability, secrets management, abuse controls                                                        |
| Marketplace trust         | Source provenance, classification, eligibility, freshness, correction, disclosure, expiration, and human publication                                                        |
| Organization trust        | Separate registration, verification, membership, submission, approval, and publication states                                                                               |
| Data and analytics        | Define events and measures before collection; separate registrations, completed profiles, submissions, views, clicks, redemptions, estimated savings, and verified outcomes |
| Quality engineering       | Unit, integration, authorization, failure-path, browser, mobile, and accessibility validation appropriate to each slice                                                     |
| Operations                | Content ownership, organization and offer review, support, incident handling, backups, release checklists, monitoring, and cost review                                      |
| Legal and commercial      | Privacy and terms review, partner agreements, affiliate and sponsorship disclosure, charitable and tax claims, intellectual property                                        |
| Growth and partnerships   | Guardian acquisition, shelter onboarding, local Michigan launch, business development, community activation, national expansion                                             |
| Architecture and cost     | Low initial cost, committed migrations, pinned dependencies, maintainability, measured scaling, no premature microservices                                                  |

## Marketplace research program

[Marketplace research and savings strategy](MARKETPLACE-RESEARCH.md) defines the initial opportunity map and curation standard. Research must expand systematically across retailers, prescriptions, manufacturers, veterinary savings, grooming, training, sitting, boarding, insurance and finance, travel, local services, shelter adoption packages, and community eligibility programs.

“Complete marketplace” means responsible category coverage and a repeatable freshness process. It does not mean claiming every promotion on the internet. Initial coverage and launch geography need explicit acceptance criteria.

## Human decisions still needed

| Decision                                                                                                                                               | Why it matters                                                       | Needed by                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | ---------------------------- |
| Approve the festival-focused, multi-channel MVP                                                                                                        | Authorizes detailed design without authorizing implementation        | Before M0 completion         |
| Finalize production-ready ShelterPawtners, LostPaws, and RAVE Shelter logo variants and their public brand hierarchy                                   | Determines final palette, asset use, and front-door messaging        | M0                           |
| Choose launch geography, audiences, age eligibility, consent, privacy, retention, deletion, and export expectations                                    | Affects onboarding and data handling                                 | M0 and M2                    |
| Approve minimum shelter and partner registration fields, self-publication rules, prohibited content, monitoring ownership, and status language         | Determines onboarding scope and marketplace trust                    | M0 and M5                    |
| Approve email mailbox and transactional provider, shelter response fields, evidence upload limits, dispute handling, and final shelter conversion copy | Determines whether automated adoption confirmation can launch safely | Before M3                    |
| Select the minimum Passport fields and default privacy choices                                                                                         | Prevents overcollection and accidental disclosure                    | M0 and M3                    |
| Decide the MVP guardianship rule, including whether co-guardianship is deferred                                                                        | Changes authority and RLS                                            | Before schema design         |
| Approve MVP marketplace classifications, seed categories, freshness cadence, and whether login is required for all deal details                        | Determines useful scope and operations                               | M0 and M4                    |
| Decide what registration, click, saved-offer, location, and personalization analytics may be collected                                                 | Affects consent, privacy, and measurement                            | Before related capabilities  |
| Define shelter verification evidence, authorized verifiers, correction, and disputes                                                                   | Determines verified adoption                                         | Phase 2                      |
| Define transfer matching, claims, returns, rehoming, and retained shelter history                                                                      | Protects guardianship and private data                               | Phase 2                      |
| Confirm ShelterCARD and ReWards relationship, benefit funding, lifetime terms, redemption proof, and savings calculation                               | Determines commercial promises                                       | Phase 3                      |
| Approve affiliate, sponsorship, ranking, and partner-submission rules                                                                                  | Protects marketplace trust                                           | Before monetized placement   |
| Confirm actual event and partner agreements and permitted donation or incentive models                                                                 | Prevents false affiliation and financial claims                      | Phase 5                      |
| Define provider eligibility, guardian authorization, correction, and revocation                                                                        | Protects care contributions                                          | Phase 6                      |
| Approve reporting, research, AI purposes, aggregation safeguards, and impact definitions                                                               | Prevents inappropriate secondary use                                 | Phase 9                      |
| Authorize a production Supabase project and deployment plan                                                                                            | Separates development access from production risk                    | Before M6 production release |

## Routine choices agents may make

Within an authorized slice, agents may choose modest file organization, component boundaries, and low-cost implementation details when they preserve these requirements. Document material technical rationale in [Architecture](ARCHITECTURE.md). Do not settle human policy decisions by silently selecting broad access, stronger commercial claims, or additional data collection.
