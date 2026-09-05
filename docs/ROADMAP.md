# Roadmap and decision register

## Current gate

The documentation foundation is the current deliverable. No application capabilities are complete. Do not start implementation, scaffold React, install packages, design a Supabase schema, or connect Supabase until the user explicitly approves the context foundation and authorizes subsequent work. Approval of the foundation does not itself authorize production connection or creation.

Phases express intended order and dependencies, not release dates or automatic authorization to build every listed capability.

## Planned phases

| Phase | Scope | Readiness expectations |
| --- | --- | --- |
| 1: Foundation | Brand system, public marketing experience, real authentication, guardian profile, create and manage pets, Digital Pet Passport, photo upload, basic privacy. | Approved context and implementation scope; actual brand assets reviewed; launch Passport fields and sharing policy defined; real authentication and access controls tested; browser review complete. |
| 2: Shelter workflow | Shelter organization accounts, shelter-created pets, verification, adoption record, transfer to guardian, auditability. | Scoped memberships and verification policy; secure claim flow; historical/private data separation; transfer failure and authorization tests. |
| 3: Savings network | Business organizations, offers, search, filtering, location, eligibility, ShelterCARD / ReWards concepts, redemption and savings tracking. | Confirmed offer terms and eligibility; defined redemption validation and savings calculations; auditable partner activity. |
| 4: Community and LostPaws | Campaigns, festival participation, vendor participation, community incentives, mission impact. | Confirmed participant arrangements; independent multi-event model; evidence-based impact definitions and truthful affiliation claims. |
| 5: Care network and intelligence | Authorized provider contributions, veterinary workflows, care history, insights, reporting, useful AI assistance, animal welfare intelligence. | Defined provider authorization and correction policies; approved data-use purposes; privacy-preserving reporting and appropriate evaluation. |

Basic Passport history belongs in the early product; deeper provider and veterinary workflows are Phase 5. The long-term savings goal does not delay Phase 1 value for non-shelter pets. Engineering security and privacy are required throughout, not postponed to the last phase.

## Human decisions still needed

These are genuine product or policy decisions. They do not block documenting the foundation. Resolve each before the affected design or implementation commits the product to an answer.

| Decision | Why it matters | Needed by |
| --- | --- | --- |
| Approve this foundation and identify the first implementation slice. | Establishes authorization and a bounded initial release. | Before implementation. |
| Supply authoritative logo assets and confirm the initial public relationship between ShelterPawtners and LostPaws branding. | Determines final palette, asset use, and front-door messaging without inventing brand rules. | Phase 1 visual design. |
| Choose launch audiences and jurisdictions, any age eligibility, and required privacy/retention policies. | Affects onboarding, consent, deletion, and data handling obligations. | Phase 1 data and onboarding design. |
| Select the initial Passport fields, default sharing choices, and treatment of sensitive history across guardianship changes. | Avoids collecting or disclosing more than intended. | Phase 1 Passport design; transfer details by Phase 2. |
| Decide whether multiple active guardians are supported and how delegated control works. | Changes authority and conflict resolution. | Before guardianship modeling. |
| Define shelter onboarding, verification evidence, authorized verifiers, and correction/dispute handling. | Determines what verified adoption means and who can assert it. | Phase 2. |
| Define transfer recipient matching, disputed claims, returns, rehoming, and appropriate shelter record retention. | Prevents unauthorized control changes and inappropriate historical access. | Phase 2; earlier if included in launch. |
| Confirm ShelterCARD / ReWards relationship, benefit funding, lifetime-access terms, redemption proof, and savings calculation rules. | Determines commercial promises, eligibility, and trustworthy tracking. | Phase 3. |
| Confirm actual event/partner agreements and permitted discount, donation, or adoption-incentive models. | Prevents invented affiliations or unauthorized financial commitments. | Phase 4 or earlier public claims. |
| Define provider eligibility, guardian authorization, contribution correction, and access after revocation. | Establishes trustworthy care contributions and privacy boundaries. | Phase 5. |
| Approve reporting/research purposes, aggregation safeguards, AI uses, and impact measurement definitions. | Prevents unsupported claims and inappropriate secondary data use. | Before the relevant reporting or AI feature. |

## Routine choices agents may make

Within authorized scope, agents may choose modest file organization, component boundaries, and low-cost implementation details when they preserve these requirements. Document material technical rationale in [Architecture](ARCHITECTURE.md). Do not escalate routine choices as policy questions or settle the human decisions above by silently selecting broad access or stronger commercial claims.
