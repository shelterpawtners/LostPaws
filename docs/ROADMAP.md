# Roadmap and decision register

## Current gate

The documentation foundation and development-service discovery are the current deliverables. GitHub access and read-only access to the empty `shelterpawtners-dev` Supabase project have been confirmed. No application capabilities are complete.

Do not scaffold the application, install packages, design or apply a database schema, configure authentication, or create migrations until the user explicitly approves the MVP scope and authorizes implementation. Do not connect to or create a production project without explicit instruction.

Phases express outcome order and dependencies, not fixed release dates. Each MVP slice should be small enough for product, content, security, accessibility, and browser review before the next slice begins.

## Product release strategy

The product must connect Care, Savings, and Community from the beginning while protecting the long-term model. The fastest credible MVP is a guardian-first experience with two immediate post-login paths:

1. **Set up your pet**, presented as the recommended primary action.
2. **Browse savings**, available immediately through a curated marketplace of verified public programs and offers.

This does not reduce the importance of shelter-created Passports or adoption transfer. It prevents those policy-heavy workflows from blocking useful guardian validation while they are designed correctly. The initial marketplace may include public offers without partner agreements when their source and classification are clear. Exclusive, sponsored, affiliate, and verified-adoption benefits require their own approvals and controls.

## ASAP MVP definition

The MVP is successful when a guardian can understand the mission, create and access a real account, begin a limited Digital Pet Passport, browse trustworthy savings opportunities, and understand which features are available versus planned.

The MVP includes:

- premium, accessible public pages with strong value propositions;
- ShelterPawtners and LostPaws relationship explained without implying festival affiliation;
- real authentication and secure session handling;
- a minimal guardian profile;
- post-login choice between recommended pet setup and immediate savings browsing;
- a deliberately limited guardian-created Passport for an existing or adopted pet;
- one pet photo with private storage controls if photo upload is approved for the first release;
- a curated savings marketplace with search, categories, filters, source links, classifications, conditions, expiration or ongoing status, and last-verified dates;
- an internal human curation path for publishing, verifying, expiring, and correcting marketplace entries;
- clear distinction among public offers, public programs, ShelterPawtners exclusives, verified-adoption benefits, sponsored placements, affiliate links, and community offers;
- baseline accessibility, privacy, authorization, error handling, observability, analytics definitions, and release checks.

The MVP excludes until separately approved:

- shelter verification;
- shelter-created records and adoption transfer;
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
| M0: Decisions and design foundation | The team agrees on exactly what the MVP promises | Confirm brand assets, front-door naming, launch jurisdiction, age and consent assumptions, minimum Passport fields, privacy defaults, marketplace classification, initial source set, success measures, and deployment approach | User approves the MVP brief, wireframes, copy direction, and protected data decisions before implementation |
| M1: Public experience | Visitors understand ShelterPawtners, LostPaws, Care, Savings, Community, and the next action | Information architecture, homepage, how it works, savings preview, partner interest, about or mission, privacy and terms placeholders with appropriate legal review flags, responsive design, accessibility | Browser review on desktop and mobile; every claim and call to action matches reality |
| M2: Authentication and guardian entry | A guardian can create an account, sign in, sign out, recover access, and reach a useful home | Supabase Auth, secure sessions, minimal guardian profile, post-login choice screen, protected routes, error and recovery states | Authentication and authorization tests; no private data leakage; user approves onboarding |
| M3: Passport Lite | A guardian can set up and manage the minimum useful pet profile | Approved launch fields, one active guardian policy, optional photo if approved, edit flow, privacy defaults, deletion and correction behavior appropriate to MVP | Field-by-field review, RLS denial tests, storage-policy tests, browser and accessibility review |
| M4: Marketplace Discovery | A guardian can browse trustworthy savings even before completing a pet profile | Curated public catalog, offer classification, categories, search, filters, details, source and freshness display, outbound navigation, issue reporting, internal curation | Seed offers reverified; stale and expired behavior tested; no false partnership or savings claims |
| M5: MVP hardening and launch | The guardian journey is reliable enough for controlled release | Cross-device QA, accessibility review, security and performance advisors, analytics with defined events, monitoring, backup and recovery expectations, content operations, launch checklist | User accepts a release candidate; production project and deployment require separate authorization |

M2 through M4 may be delivered as smaller vertical increments. Marketplace interface work can proceed with reviewed fixtures before its persistence model is approved. Passport and marketplace implementation must not force unresolved shelter-transfer decisions into the schema.

## Beyond-MVP roadmap

| Phase | Scope | Readiness expectations |
| --- | --- | --- |
| 2: Shelter adoption workflow | Shelter and rescue organizations, scoped memberships, shelter-created pets, in-care history, defined verification, adoption record, secure claim and transfer, guardian activation, appropriate retained history, auditability | Approved verification evidence, authorized verifier roles, claim delivery and recipient matching, returns and disputes, private-history boundaries, denial and concurrency tests |
| 3: Partner and exclusive savings network | Business organizations, partner onboarding, offer submission and review, exclusive and adoption-qualified offers, geography and eligibility, redemption validation, ShelterCARD and ReWards decision, savings tracking | Confirmed commercial terms, disclosures, benefit funding, server-enforced eligibility, redemption proof, fraud controls, documented savings calculations |
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
| Product and user research | Validate guardian value first, then shelter and partner workflows; preserve traceable decisions |
| Brand and content | Premium visual system, accurate claims, strong page hooks, natural language, no em dashes in customer-facing copy |
| Accessibility | Keyboard use, focus, contrast, semantic structure, readable forms, responsive layouts, and defined conformance target |
| Privacy and security | Data minimization, RLS, server-side authorization, private storage, auditability, secrets management, abuse controls |
| Marketplace trust | Source provenance, classification, eligibility, freshness, correction, disclosure, expiration, and human publication |
| Data and analytics | Define events and measures before collection; separate views, clicks, redemptions, estimated savings, and verified outcomes |
| Quality engineering | Unit, integration, authorization, failure-path, browser, mobile, and accessibility validation appropriate to each slice |
| Operations | Content ownership, support, incident handling, backups, release checklists, monitoring, and cost review |
| Legal and commercial | Privacy and terms review, partner agreements, affiliate and sponsorship disclosure, charitable and tax claims, intellectual property |
| Growth and partnerships | Guardian acquisition, shelter onboarding, local Michigan launch, business development, community activation, national expansion |
| Architecture and cost | Low initial cost, committed migrations, pinned dependencies, maintainability, measured scaling, no premature microservices |

## Marketplace research program

[Marketplace research and savings strategy](MARKETPLACE-RESEARCH.md) defines the initial opportunity map and curation standard. Research must expand systematically across retailers, prescriptions, manufacturers, veterinary savings, grooming, training, sitting, boarding, insurance and finance, travel, local services, shelter adoption packages, and community eligibility programs.

“Complete marketplace” means responsible category coverage and a repeatable freshness process. It does not mean claiming every promotion on the internet. Initial coverage and launch geography need explicit acceptance criteria.

## Human decisions still needed

| Decision | Why it matters | Needed by |
| --- | --- | --- |
| Approve this revised roadmap and the bounded ASAP MVP | Authorizes detailed design without authorizing implementation | Before M0 completion |
| Supply authoritative logo assets and confirm the public relationship between ShelterPawtners and LostPaws branding | Determines final palette and front-door messaging | M0 |
| Choose launch geography, audiences, age eligibility, consent, privacy, retention, deletion, and export expectations | Affects onboarding and data handling | M0 and M2 |
| Select the minimum Passport fields and default privacy choices | Prevents overcollection and accidental disclosure | M0 and M3 |
| Decide the MVP guardianship rule, including whether co-guardianship is deferred | Changes authority and RLS | Before schema design |
| Approve MVP marketplace classifications, seed categories, freshness cadence, and whether login is required for all deal details | Determines useful scope and operations | M0 and M4 |
| Decide what click analytics, saved offers, location, and personalization data may be collected | Affects consent, privacy, and measurement | Before related M4 capabilities |
| Define shelter onboarding, verification evidence, authorized verifiers, correction, and disputes | Determines verified adoption | Phase 2 |
| Define transfer matching, claims, returns, rehoming, and retained shelter history | Protects guardianship and private data | Phase 2 |
| Confirm ShelterCARD and ReWards relationship, benefit funding, lifetime terms, redemption proof, and savings calculation | Determines commercial promises | Phase 3 |
| Approve affiliate, sponsorship, ranking, and partner-submission rules | Protects marketplace trust | Before monetized placement |
| Confirm actual event and partner agreements and permitted donation or incentive models | Prevents false affiliation and financial claims | Phase 5 |
| Define provider eligibility, guardian authorization, correction, and revocation | Protects care contributions | Phase 6 |
| Approve reporting, research, AI purposes, aggregation safeguards, and impact definitions | Prevents inappropriate secondary use | Phase 9 |
| Authorize a production Supabase project and deployment plan | Separates development access from production risk | Before M5 production release |

## Routine choices agents may make

Within an authorized slice, agents may choose modest file organization, component boundaries, and low-cost implementation details when they preserve these requirements. Document material technical rationale in [Architecture](ARCHITECTURE.md). Do not settle human policy decisions by silently selecting broad access, stronger commercial claims, or additional data collection.
