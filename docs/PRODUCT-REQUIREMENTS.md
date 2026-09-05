# Product requirements

## Status and scope

All capabilities here are planned. [Roadmap](ROADMAP.md) defines sequencing, and explicit MVP approval is required before implementation. These requirements define behavior without prescribing a database schema. Permissions are further defined in [User roles](USER-ROLES.md) and [Security and privacy](SECURITY-AND-PRIVACY.md).

## Participant registration and account entry

The MVP supports account entry for guardians, shelters or rescues, and pet businesses or service partners. A person may eventually participate in more than one capacity. Participant selection is onboarding context, not a permanent single-role label.

Registration, organization verification, offer approval, and publication are separate states. Creating an account or organization must not automatically confer verified status, privileged permissions, public endorsement, or access to private guardian and Passport data.

## Guardian entry and post-login home

The guardian experience is the primary product priority. After account creation or login, the product should present two clear paths:

1. **Set up your pet**, displayed as the recommended primary action.
2. **Browse savings**, available immediately so the account provides value even before a Passport is complete.

The home should explain why pet setup is useful without blocking generally available savings behind unnecessary data collection. It should show setup progress and truthful capability status. Personalization must use only approved data and must not imply that a guardian or pet qualifies for shelter-verified benefits.

Acceptance expectations:

- A new guardian understands the two paths without onboarding instructions.
- Pet setup is encouraged but not coercive.
- A guardian can browse public marketplace entries without completing unrelated Passport fields.
- Signed-in state, errors, recovery, and sign-out behavior are clear.
- Calls to action lead only to working destinations.

## Shelter and rescue registration

A shelter or rescue representative should be able to create a personal account, establish or request access to an organization profile, and populate the minimum information needed for a credible organizational presence and later verification.

Candidate MVP organization information includes:

- legal and public-facing organization names;
- organization type;
- primary contact name, role, email, and phone;
- website and public social links;
- physical address and service area;
- public description and mission;
- adoption or public contact information;
- logo and selected public imagery if upload scope is approved;
- nonprofit or registration information when voluntarily supplied;
- requested membership and administrator relationship;
- registration, review, correction, and verification status.

Shelter registration does not require shelter verification to be completed in the first release. An unverified organization must be clearly labeled internally and wherever status is relevant. Registration alone does not authorize shelter-created Passports, adoption verification, transfers, access to guardian records, or unrestricted invitation of organization members.

Acceptance expectations:

- Duplicate organization claims are detected or routed for review rather than silently creating competing verified identities.
- A representative cannot approve their own organization verification.
- Public and internal-only fields are distinguishable.
- A shelter can save progress and correct a returned submission.
- Status language distinguishes draft, submitted, under review, changes requested, approved for account use, verified when later supported, suspended, and rejected as applicable.
- Organization membership and verification remain separate concepts.

## Partner registration, services, and offers

A pet business or service partner representative should be able to create a personal account, establish or request access to a business organization, complete its profile, describe pet-related services, and submit offers for ShelterPawtners review.

Candidate MVP partner information includes:

- legal and public-facing business names;
- business type and service categories;
- primary contact name, role, email, and phone;
- website, booking, and public social links;
- physical locations, online availability, and service areas;
- species served;
- description, logo, and selected imagery if upload scope is approved;
- services offered, delivery method, pricing context when supplied, and geographic availability;
- offer title, summary, benefit, eligibility, exclusions, redemption instructions, start and expiration dates, locations, and source or supporting terms;
- requested classification, including public, ShelterPawtners exclusive, verified-adoption, sponsored, affiliate, or community offer;
- draft, submission, review, correction, approval, publication, expiration, suspension, and rejection status.

Partners may save drafts and publish services and offers directly during the MVP. Publication must record the organization, responsible account, timestamps, audience, channel, terms, and material edits. ShelterPawtners must have dashboard visibility plus suspension and removal controls. Self-publication does not create verified, exclusive, sponsored, affiliate, or adoption-qualified status, prove a formal partnership, or authorize use of another organization's trademarks.

Acceptance expectations:

- A partner can maintain organization details without seeing another partner's drafts.
- Required offer terms and dates are validated before submission.
- Publication is available to an authenticated partner within its own organization, subject to monitoring, reporting, audit, and suspension controls.
- Changes to a published offer return through an appropriate review path when material.
- Expired or suspended offers stop appearing as active.
- Exclusive and verified-adoption classifications require evidence and approval.
- Partner registration grants no private Passport or guardian access.
- Duplicate businesses and unauthorized business claims are routed for review.

## Guardian-initiated adoption verification

When a guardian creates or edits a pet, ask whether the pet was adopted. If yes, offer a verification request that collects shelter name plus the best available email, phone, website, social profile, contact name, location, pet name at adoption, approximate adoption date, guardian matching information, and consent to contact the organization.

The MVP should use email as the automated delivery channel. The request moves through explicit statuses such as draft, submitted, delivery pending, sent, viewed, confirmed, unable to confirm, more information requested, delivery failed, expired, or canceled.

The shelter receives a secure, expiring, single-purpose link. It must open only the submitted verification request, not the guardian's full account or unrelated Passport data. The responder may confirm or decline the adoption, add or correct the adoption date, provide their name and role, add a shelter report, optionally upload adoption papers, and optionally contribute known history or medical and care information.

A successful response produces a **shelter-confirmed adoption** status with recorded scope, responder, organization contact, timestamp, delivery target, and evidence. It does not automatically create a verified shelter administrator or certify every Passport field.

Acceptance expectations:

- Guardian self-report and shelter confirmation remain visibly distinct.
- Unsent, pending, failed, expired, declined, and disputed requests do not unlock confirmed-adoption benefits.
- Tokens are one-time, expiring, cancelable, replay-resistant, rate-limited, and restricted to one request.
- Adoption papers and medical documents are private by default and stored with restrictive access.
- Verification and medical-history contributions preserve separate provenance.
- The response window lasts 30 days. Reminders are sent on days 10, 20, and 27 unless a terminal status or repeated delivery failure stops them. An unresolved request expires on day 30 and the guardian is notified.
- Delivery failures and exceptions appear in the team dashboard without making Jim the normal approval step.
- After responding, the shelter sees a concise, compelling, truthful explanation of the free ShelterPawtners shelter account, Digital Pet Passports, Shelter Report Cards, adoption support, guardian savings, continuity of information, and future insights, with an optional signup action.
- SMS and automated social outreach remain later channels unless their consent, compliance, cost, and delivery requirements are approved.

Detailed requirements are in [Festival MVP and adoption verification](FESTIVAL-MVP-AND-VERIFICATION.md).

## Digital Pet Passport

The Passport is a core platform asset associated with a pet. A shelter or rescue may create it before adoption; a guardian may create it for an existing pet, regardless of shelter origin. Authorized provider creation is a future capability. Shelter-created Passports should accumulate useful history while the animal remains in care.

Potential information includes:

| Area | Candidate information |
| --- | --- |
| Identity | Name, species, breed or mix, birth date or estimated age, sex, photos, microchip information. |
| Origin and adoption | Shelter origin, adoption history, guardianship history with appropriate privacy boundaries. |
| Health | Medical history, vaccinations, medications, allergies, provider notes, documents. |
| Behavior and daily care | Behavior, commands, training, likes, dislikes, compatibility, food information, care routines. |
| Contributions and sharing | Authorized provider contributions, selected publicly shareable fields, private guardian fields. |

This is a candidate inventory, not a requirement to collect every field at launch. Minimize collection and choose phase-specific fields before implementing them. Passport content must not imply that ShelterPawtners is a veterinarian or medical authority.

Acceptance expectations:

- A guardian can maintain a Passport for a non-shelter pet without falsely acquiring verified shelter adoption status.
- Pet history remains associated with the pet across appropriate guardianship changes, while private information is protected.
- The guardian becomes the primary controller after an accepted adoption transfer, subject to provenance and appropriate historical record retention.
- Sharing is selective and intentional. Public views never expose private information by default.
- Authored facts, estimates, verification, and system-generated content remain distinguishable.

## Provenance and shelter verification

Distinguish guardian-entered, shelter-entered, shelter-verified, provider-entered, and system-generated information. Entry by a shelter is not automatically verification; entry by a provider is not a blanket endorsement of the entire Passport. Preserve the source, author or organization, relevant timestamp, and verification scope where appropriate.

Shelters should eventually create pets, maintain records while the pet is in care, record adoption, verify shelter origin, initiate guardian transfer, and retain appropriate historical records afterward. Prior creation of a pet record must never grant continuing unrestricted access to the guardian's private information.

Acceptance expectations: verification has an identifiable scope and authorized actor; corrections preserve an audit trail; user interfaces accurately label source and verification status. The evidence and dispute rules remain human decisions in the roadmap.

## Guardianship and controlled transfer

The intended adoption sequence is:

1. The shelter creates the pet and maintains its Passport.
2. Adoption occurs and an authorized shelter member records it.
3. The system initiates a secure claim or transfer workflow.
4. The receiving guardian authenticates and claims the intended pet.
5. The system validates the claim and changes guardianship and permissions together.
6. Appropriate pet history and provenance remain intact, and an audit record captures the transition.

A transfer is a controlled workflow, not a simply editable `owner_id` field. The architecture must accommodate auditable transitions and failed or expired claims. Exact token safeguards are specified in [Security and privacy](SECURITY-AND-PRIVACY.md).

Acceptance expectations: unauthorized or reused claims cannot transfer a pet; a failed claim leaves guardianship unchanged; success removes inappropriate previous access; historical provenance remains; private former-guardian data does not automatically transfer to the new guardian. Disputed transfers and non-adoption cases need policy decisions before those paths ship.

## Rave Shelter and LostPaws marketplace

The MVP needs a distinct Rave Shelter experience within LostPaws for human, music, festival, and rave-community products and services. These offers do not need to be pet-related. They support the ShelterPawtners mission by giving community participants useful value and a practical way to participate.

Use the same underlying marketplace concepts with explicit audience and channel classification. The public experience may use different branding, navigation, categories, and filters for ShelterPawtners pet offers versus LostPaws / Rave Shelter human offers.

Acceptance expectations:

- A user can clearly tell whether an offer is for pets or people.
- Partner-created content appears in the intended channel.
- Rave Shelter language may reflect peace, love, unity, and respect without making unsupported safety, charitable, or affiliation claims.
- Lost Lands and other festival names are used only factually and never imply sponsorship or endorsement.
- The mobile journey from a festival QR card to signup and relevant offers is fast and reliable.
- Both marketplace channels preserve organization attribution, timestamps, terms, reporting, audit history, and platform suspension controls.

## Savings marketplace

The savings marketplace is an MVP guardian capability, not only a later partner-network feature. It should begin with responsibly curated public savings programs and offers, plus approved partner submissions when available. It can then expand to ShelterPawtners exclusives, verified-adoption benefits, and measurable partner participation after real agreements and controls exist.

[Marketplace research and savings strategy](MARKETPLACE-RESEARCH.md) defines the initial source map, offer classifications, and freshness process. Potential categories include veterinary services, food, medication, grooming, training, walking, sitting, boarding, daycare, supplies, insurance, transportation, photography, events, festival vendors, local businesses, and national brands.

### MVP marketplace behavior

Each entry should include, when applicable:

- provider and program or offer name;
- concise value summary written or reviewed by ShelterPawtners;
- classification as public offer, public program, ShelterPawtners exclusive, verified-adoption benefit, sponsored placement, affiliate link, or community offer;
- category and useful search terms;
- eligibility, enrollment, membership, prescription, location, purchase, or subscription requirements;
- geographic scope;
- start and expiration dates, or an explicitly ongoing status;
- direct provider source or approved partner-supplied terms;
- last-verified date;
- clear action to review current terms;
- publication, expiration, and correction status controlled through an internal curation workflow.

The MVP may use a human-curated seed catalog and monitored partner self-publication. Automated discovery, feeds, or scraping must not auto-publish entries. Public offer browsing should not require a completed Passport. Search and filters should prioritize practical usefulness over a large offer count.

Acceptance expectations:

- Users can distinguish public opportunities from ShelterPawtners relationships.
- Expired, unpublished, or materially unverified entries are not presented as active.
- Promotional amounts and terms are not hard-coded without a verification and expiration strategy.
- Broken or inaccurate entries can be reported and corrected.
- Medical and prescription savings do not imply veterinary advice.
- The source or applicable terms are accessible before a user acts on the offer.
- Sponsored or affiliate relationships are clearly disclosed.
- Marketplace ranking does not silently represent paid placement as relevance.

### Later savings capabilities

Offers may eventually vary by location, species, shelter adoption status, business category, eligibility, campaign, date, and partner. Later capabilities may include saved offers, pet-aware relevance, provider feeds, exclusive benefits, redemption validation, estimated savings, annual and lifetime savings, partner participation, and mission impact.

ShelterCARD and ReWards are related savings concepts. Lifetime access to savings and support for adopted shelter pets is a long-term goal, not an unconditional present promise.

Acceptance expectations for controlled benefits: terms and eligibility are visible and enforced on the server; expired or ineligible offers cannot be redeemed; verified adoption requirements cannot be satisfied by unverified guardian assertions; redemptions are auditable. Estimated savings must be labeled and use a documented calculation that avoids double counting. Views, outbound clicks, redemptions, and savings are distinct measures; none alone proves adoption impact. Commercial terms and measurement definitions remain open until confirmed.

## Marketplace curation and operations

A useful marketplace requires ongoing ownership. Authorized internal users should research, draft, review, publish, reverify, unpublish, expire, and correct entries. They should also monitor partner profiles, services, and self-published offers through an activity dashboard. Material changes should preserve revision history and source provenance.

Acceptance expectations:

- Publication is a deliberate human action.
- A source or approved partner-supplied terms and a verification timestamp are required.
- Time-limited promotions have expiration handling.
- Ongoing programs have a defined recheck cadence.
- User and provider corrections have an operational destination.
- Curation permissions do not grant unrelated access to guardian records.
- Offer content summarizes factual terms without copying excessive proprietary text.

## Community and LostPaws

Plan for campaigns, festival and vendor participation, community incentives, and mission impact. The program must support multiple events without assuming a particular festival affiliation. Participation types and benefits must reflect real arrangements; purchase-linked donations and adoption incentives are not automatically enabled by listing them in the vision.

Acceptance expectations: campaigns accurately identify participating organizations, terms, and dates; public affiliation claims have formal support; reported impact has traceable evidence and a defined method.

## Care and intelligence

Future authorized providers may contribute care information, support veterinary workflows, and eventually create Passports. Authorization must be scoped and revocable. Preserve contribution provenance without treating the platform as a medical authority.

Insights, reporting, AI assistance, and animal welfare intelligence are later capabilities. Each must serve a clear user need in Care, Savings, or Community. Research or insight products must not expose guardian personally identifiable information. Do not infer permission to use private records for AI or research from ordinary Passport use.

## Homepage and major pages

The first screen should answer the five visitor questions in [Product vision](PRODUCT-VISION.md), communicate ecosystem value, and provide a clear next action appropriate to guardians, shelters, and partners. Every major page needs a strong opening hook. Use credible marketing, behavioral science, social media, UX, or conversion research when it informs a real design choice; record the source and avoid invented findings or manipulative tactics.

The public experience should preview marketplace value without claiming every listed provider is a partner. Shelter and partner registration pages require distinct value propositions and accurate explanations of review status. The authenticated marketplace needs its own strong hook, clear filter hierarchy, trustworthy offer labeling, and practical next actions.

Acceptance expectations: the value is understandable without a long business explanation; the page conveys benefits beyond discounts; calls to action match functional destinations; claims and affiliations are substantiated; responsive and accessible behavior is reviewed in a browser. Follow the staged design workflow in [Brand design system](BRAND-DESIGN-SYSTEM.md).
