# Roadmap and decision register

## Current gate

The documentation foundation and development-service discovery are the current deliverables. GitHub access and read-only access to the empty `shelterpawtners-dev` Supabase project have been confirmed. No application capabilities are complete.

Do not scaffold the application, install packages, design or apply a database schema, configure authentication, or create migrations until the user explicitly approves the MVP scope and authorizes implementation. Do not connect to or create a production project without explicit instruction.

Phases express outcome order and dependencies, not fixed release dates. Each MVP slice should be small enough for product, content, security, accessibility, and browser review before the next slice begins.

## Product release strategy

The MVP is a multi-sided foundation with guardians as the primary product priority. It must create useful value for three participant types:

1. **Guardians** create an account, are encouraged to set up a pet, and can browse savings immediately.
2. **Shelters and rescues** register an organization and complete its account details so later verification and adoption workflows have a credible starting point.
3. **Pet businesses and service partners** register an organization, describe their services, and submit offers for ShelterPawtners review.

Registration is not verification. A registered shelter or partner remains unverified until an authorized review process approves it. Partner-submitted services and offers remain drafts or pending review until ShelterPawtners publishes them. Registration alone grants no access to guardian or private Passport data.

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
- partner registration with organization details, service categories, service areas, and draft or pending-review offer submission;
- a curated savings marketplace with search, categories, filters, source links, classifications, conditions, expiration or ongoing status, and last-verified dates;
- internal human review for organization verification, offer publication, correction, expiration, and removal;
- clear distinction among public offers, public programs, ShelterPawtners exclusives, verified-adoption benefits, sponsored placements, affiliate links, and community offers;
- baseline accessibility, privacy, authorization, error handling, observability, analytics definitions, moderation, and release checks.

The MVP excludes until separately approved:

- completed shelter verification rules or automated verification;
- shelter-created pet records, adoption records, and Passport transfer;
- direct self-publication of partner offers;
- self-attested access to verified-adoption benefits;
- exclusive offer claims without agreements;
- financial impact or savings totals without defined calculations;
- public Passport sharing by default;
- veterinary contributions or medical authority claims;
- festival affiliation claims;
- automated scraping or auto-publication of third-party promotions;
- research or AI use of private Passport data.

## MVP delivery slices and review gates

| Slice | User outcome | Main work | Review gate |
| --- | --- | --- | --- |
| M0: Decisions and design foundation | The team agrees on exactly what the MVP promises | Confirm brand assets, front-door naming, launch jurisdiction, age and consent assumptions, onboarding paths, minimum registration fields, minimum Passport fields, privacy defaults, marketplace classification, initial source set, success measures, and deployment approach | User approves the MVP brief, wireframes, copy direction, organization boundaries, and protected data decisions before implementation |
| M1: Public experience | Visitors understand ShelterPawtners, LostPaws, Care, Savings, Community, and the next action for guardians, shelters, or partners | Information architecture, homepage, how it works, savings preview, shelter registration entry, partner registration entry, about or mission, privacy and terms placeholders with appropriate legal review flags, responsive design, accessibility | Browser review on desktop and mobile; every claim and call to action matches reality |
| M2: Authentication and role-aware entry | Guardians, shelters, and partners can create accounts, sign in, sign out, recover access, and reach the correct onboarding path | Supabase Auth, secure sessions, minimal personal profile, participant-type selection, organization creation boundary, protected routes, error and recovery states | Authentication, role, and cross-organization denial tests; no private data leakage; user approves onboarding |
| M3: Passport Lite | A guardian can set up and manage the minimum useful pet profile | Approved launch fields, one active guardian policy, optional photo if approved, edit flow, privacy defaults, deletion and correction behavior appropriate to MVP | Field-by-field review, RLS denial tests, storage-policy tests, browser and accessibility review |
| M4: Marketplace Discovery | A guardian can browse trustworthy savings even before completing a pet profile | Curated public catalog, offer classification, categories, search, filters, details, source and freshness display, outbound navigation, issue reporting, internal curation | Seed offers reverified; stale and expired behavior tested; no false partnership or savings claims |
| M5: Shelter and Partner Registration | Shelters and partners can complete organization profiles; partners can submit services and offers without publishing them directly | Organization onboarding, contact and location or service-area details, service categories, offer drafts, submission status, internal review queue, correction and resubmission | Cross-organization isolation, least-privilege tests, moderation review, truthful verification and publication states |
| M6: MVP hardening and launch | All three onboarding journeys are reliable enough for controlled release | Cross-device QA, accessibility review, security and performance advisors, analytics with defined events, monitoring, backup and recovery expectations, content and review operations, launch checklist | User accepts a release candidate; production project and deployment require separate authorization |

M2 through M5 may be delivered as smaller vertical increments. Marketplace and registration interface work can proceed with reviewed fixtures before persistence models are approved. Passport, organization, verification, and transfer implementation must not force unresolved later policy decisions into the schema.

## Beyond-MVP roadmap

| Phase | Scope | Readiness expectations |
| --- | --- | --- |
| 2: Shelter verification and adoption workflow | Verification review and evidence, scoped shelter memberships, shelter-created pets, in-care history, adoption record, secure claim and transfer, guardian activation, appropriate retained history, auditability | Approved verification evidence, authorized verifier roles, claim delivery and recipient matching, returns and disputes, private-history boundaries, denial and concurrency tests |
| 3: Partner and exclusive savings network | Partner approval, offer review and publication, exclusive and adoption-qualified offers, geography and eligibility, redemption validation, ShelterCARD and ReWards decision, savings tracking | Confirmed commercial terms, disclosures, benefit funding, server-enforced eligibility, redemption proof, fraud controls, documented savings calculations |
| 4: Marketplace scale and personalization | Broader local and national catalog, saved offers, pet-aware relevance, provider feeds, affiliate relationships, freshness automation with human approval, marketplace analytics | Approved consent and data minimization, affiliate and sponsorship disclosures, ranking rules, operational service levels, quality monitoring |
| 5: Community and LostPaws programs | Independent campaigns, participating festivals and music communities, vendors, artists, brands, incentives, fundraising or purchase-linked support where legally and contractually approved | Confirmed participant agreements, multi-event design, financial and charitable review, evidence-based impact definitions, truthful affiliation language |
| 6: Care network | Authorized veterinarian and service-provider access, scoped contributions, documents, care history, sharing and revocation, corrections and provenance | Provider eligibility and authority rules, guardian consent, correction policy, storage safeguards, access-after-revocation behavior, medical-content boundaries |
| 7: Guardian continuity and pet legacy | Co-guardianship if approved, delegated care, rehoming and non-adoption transfer, emergency sharing, lost-pet support, memorialization and legacy | Conflict and recovery policy, identity matching, sensitive history treatment, public-sharing safeguards, abuse response |
| 8: Shelter and partner operations | Dashboards, adoption support, follow-up engagement, grant and resource tools, partner reporting, campaign operations, support workflows | Defined measures, scoped operational roles, auditability, support access policy, sustainable data quality processes |
| 9: Intelligence and impact | Privacy-preserving insights, animal welfare reporting, AI assistance, matching support, aggregate research products, impact and funding analysis | Approved data-use purposes and consent, evaluation criteria, bias and safety review, aggregation and re-identification safeguards, no guardian PII in research outputs |
| 10: Platform scale and sustainability | Production hardening, cost controls, backups, disaster recovery, compliance program, incident response, data lifecycle, integration strategy, performance and operational maturity | Proven demand, approved budget, service targets, security review, retention and deletion program, documented ownership and runbooks |

## Cross-cutting workstreams

Every phase must account for the following. They are not end-of-roadmap cleanup items.

| Workstream | Ongoing requirement |
| --- | --- |
| Product and user research | Validate guardian value first while testing shelter and partner onboarding; preserve traceable decisions |
| Brand and content | Premium visual system, accurate claims, strong page hooks, natural language, no em dashes in customer-facing copy |
| Accessibility | Keyboard use, focus, contrast, semantic structure, readable forms, responsive layouts, and defined conformance target |
| Privacy and security | Data minimization, RLS, server-side authorization, private storage, auditability, secrets management, abuse controls |
| Marketplace trust | Source provenance, classification, eligibility, freshness, correction, disclosure, expiration, and human publication |
| Organization trust | Separate registration, verification, membership, submission, approval, and publication states |
| Data and analytics | Define events and measures before collection; separate registrations, completed profiles, submissions, views, clicks, redemptions, estimated savings, and verified outcomes |
| Quality engineering | Unit, integration, authorization, failure-path, browser, mobile, and accessibility validation appropriate to each slice |
| Operations | Content ownership, organization and offer review, support, incident handling, backups, release checklists, monitoring, and cost review |
| Legal and commercial | Privacy and terms review, partner agreements, affiliate and sponsorship disclosure, charitable and tax claims, intellectual property |
| Growth and partnerships | Guardian acquisition, shelter onboarding, local Michigan launch, business development, community activation, national expansion |
| Architecture and cost | Low initial cost, committed migrations, pinned dependencies, maintainability, measured scaling, no premature microservices |

## Marketplace research program

[Marketplace research and savings strategy](MARKETPLACE-RESEARCH.md) defines the initial opportunity map and curation standard. Research must expand systematically across retailers, prescriptions, manufacturers, veterinary savings, grooming, training, sitting, boarding, insurance and finance, travel, local services, shelter adoption packages, and community eligibility programs.

“Complete marketplace” means responsible category coverage and a repeatable freshness process. It does not mean claiming every promotion on the internet. Initial coverage and launch geography need explicit acceptance criteria.

## Human decisions still needed

| Decision | Why it matters | Needed by |
| --- | --- | --- |
| Approve this revised three-participant MVP | Authorizes detailed design without authorizing implementation | Before M0 completion |
| Supply authoritative logo assets and confirm the public relationship between ShelterPawtners and LostPaws branding | Determines final palette and front-door messaging | M0 |
| Choose launch geography, audiences, age eligibility, consent, privacy, retention, deletion, and export expectations | Affects onboarding and data handling | M0 and M2 |
| Approve minimum shelter and partner registration fields, who reviews submissions, and what status language users see | Determines onboarding scope and trust | M0 and M5 |
| Select the minimum Passport fields and default privacy choices | Prevents overcollection and accidental disclosure | M0 and M3 |
| Decide the MVP guardianship rule, including whether co-guardianship is deferred | Changes authority and RLS | Before schema design |
| Approve MVP marketplace classifications, seed categories, freshness cadence, and whether login is required for all deal details | Determines useful scope and operations | M0 and M4 |
| Decide what registration, click, saved-offer, location, and personalization analytics may be collected | Affects consent, privacy, and measurement | Before related capabilities |
| Define shelter verification evidence, authorized verifiers, correction, and disputes | Determines verified adoption | Phase 2 |
| Define transfer matching, claims, returns, rehoming, and retained shelter history | Protects guardianship and private data | Phase 2 |
| Confirm ShelterCARD and ReWards relationship, benefit funding, lifetime terms, redemption proof, and savings calculation | Determines commercial promises | Phase 3 |
| Approve affiliate, sponsorship, ranking, and partner-submission rules | Protects marketplace trust | Before monetized placement |
| Confirm actual event and partner agreements and permitted donation or incentive models | Prevents false affiliation and financial claims | Phase 5 |
| Define provider eligibility, guardian authorization, correction, and revocation | Protects care contributions | Phase 6 |
| Approve reporting, research, AI purposes, aggregation safeguards, and impact definitions | Prevents inappropriate secondary use | Phase 9 |
| Authorize a production Supabase project and deployment plan | Separates development access from production risk | Before M6 production release |

## Routine choices agents may make

Within an authorized slice, agents may choose modest file organization, component boundaries, and low-cost implementation details when they preserve these requirements. Document material technical rationale in [Architecture](ARCHITECTURE.md). Do not settle human policy decisions by silently selecting broad access, stronger commercial claims, or additional data collection.
