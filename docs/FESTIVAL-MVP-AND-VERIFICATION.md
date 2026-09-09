# Festival MVP and adoption verification

## Approved RAVE Shelter identity

**RAVE Shelter** means **Rescue and Adoption Vendor Ecosystem**.

Approved tagline:

> Deals for ravers. Support for shelter pets.

## Purpose and deadline

This document defines the urgent MVP direction for festival outreach approximately ten days after September 5, 2026. It preserves the broader ShelterPawtners roadmap while identifying the smallest reliable experience needed for QR-card distribution, account capture, partner participation, marketplace discovery, and automated shelter confirmation.

LostPaws and Rave Shelter may speak directly to rave and festival communities and the values commonly described as peace, love, unity, and respect. They are independent ShelterPawtners initiatives. Presence at Lost Lands or another event does not imply sponsorship, endorsement, or formal affiliation.

## Festival-critical journey

The festival release should prioritize:

1. A visitor scans a campaign-specific QR code.
2. A fast, mobile-first landing page explains LostPaws, Rave Shelter, and the ShelterPawtners mission.
3. The visitor creates an account or begins the appropriate registration path.
4. The campaign source is recorded without collecting unnecessary location or behavioral data.
5. A guardian can set up a pet or browse savings.
6. A shelter can register its organization.
7. A partner can register, describe services, and publish an offer.
8. The ShelterPawtners team can see registrations, verification requests, offers, timestamps, reports, and operational status in a dashboard.

The release should degrade safely. A failed email or incomplete optional profile must not discard a completed account registration.

## Marketplace channel model

Use one offer foundation with explicit audience and channel classification.

| Channel                             | Intended audience               | Typical content                                                                                                                                                                |
| ----------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ShelterPawtners marketplace         | Guardians and adopters          | Pet products, pet services, veterinary savings, medication, care, training, boarding, and adoption support                                                                     |
| LostPaws / Rave Shelter marketplace | Ravers and festival communities | Human apparel, accessories, art, food, wellness, festival preparation, music-community services, and other lawful attendee-focused products or offers that support the mission |
| Shared or community                 | More than one audience          | Offers with accurate terms that legitimately serve both groups                                                                                                                 |

Rave Shelter content does not need to be pet-related. It must still be lawful, accurately described, suitable for the platform, and connected to a real participating business or community offer. The experience may use a dedicated branded page and filters while sharing the same underlying offer administration and reporting concepts.

## MVP partner publication

Authenticated partners may publish services and offers without preapproval during the MVP. This is an explicit speed decision, not a claim that moderation is unnecessary.

Required controls:

- partner identity and organization attribution;
- created, updated, published, and expiration timestamps;
- audience, channel, category, eligibility, exclusions, and terms;
- edit and unpublish controls for the submitting organization;
- report-listing function for users;
- platform ability to suspend or remove an organization, service, or offer;
- audit history for publication and material edits;
- internal dashboard showing new and recently changed content;
- truthful organization status so “registered” is not displayed as “verified”;
- rate limits, input validation, safe links, and prohibited-content rules;
- no automatic “exclusive,” adoption-qualified, sponsored, or affiliate label without the facts that support it.

Automated risk checks, duplicate detection, link checks, and fairness monitoring can be added after the festival release. High-risk categories may still be blocked or held even when ordinary listings publish immediately.

## Guardian-initiated adoption verification

When creating or editing a pet, the guardian should be asked whether the pet was adopted. If yes, the guardian may start a shelter-confirmation request.

### Guardian-supplied information

Collect the minimum useful contact and matching information:

- shelter or rescue name;
- shelter location or website when known;
- shelter contact name when known;
- shelter email as the preferred MVP delivery channel;
- shelter phone number;
- shelter public social profile or other contact method when useful;
- pet name at adoption and current name;
- approximate adoption date when known;
- guardian name and the minimum contact information needed for matching;
- optional adoption or intake identifiers;
- guardian consent to contact the named organization and share the submitted verification details.

The platform should warn the guardian that incorrect contact information can delay verification. Public web or social information supplied by a guardian is a lead, not proof of the shelter's identity.

### Status flow

Recommended high-level states:

1. Draft
2. Submitted
3. Delivery pending
4. Sent
5. Viewed
6. Confirmed
7. Unable to confirm
8. More information requested
9. Delivery failed
10. Expired or canceled

The pet may be described by the guardian as adopted while the request is pending, but the platform must not display shelter-confirmed adoption until a valid confirmation completes.

## Shelter confirmation link

The MVP should send an email containing a secure, single-purpose link. The link opens only the confirmation request, not the guardian's account or the full private Passport.

The shelter responder can:

- confirm or decline that the organization handled the adoption;
- enter or correct the adoption date;
- provide their name, title or relationship to the shelter, and organization contact information;
- add a short shelter report or relevant history;
- optionally upload adoption documentation;
- optionally identify known medical, medication, vaccination, behavior, or care information;
- request that the guardian or ShelterPawtners provide more information;
- attest that the submitted information is accurate to the best of their knowledge.

A confirmation should be labeled **shelter-confirmed adoption** rather than government certification or independent legal certification. The system must record what was confirmed, by whom, when, through which delivery target, and what evidence was provided.

## Verification security and privacy

The confirmation mechanism must include:

- long, random, one-time claim material stored in a non-reversible form where practical;
- expiration, cancellation, replay prevention, and request-specific scope;
- rate limits on creation, resend, response, and upload;
- no usable token in application logs, analytics, or support messages;
- minimal information in the email itself;
- an interstitial explaining ShelterPawtners before displaying submitted details;
- private storage for adoption papers and sensitive records;
- constrained file types, sizes, metadata handling, and malware-risk controls;
- separation of adoption confirmation from medical-document contribution;
- guardian visibility into status and appropriate submitted evidence;
- correction, dispute, and revocation paths;
- audit events without unnecessarily duplicating sensitive information.

A shelter responder using the link is not automatically a verified shelter account administrator. The response confirms a specific adoption request within its evidence limits. Stronger organization verification can later connect repeated responses to a verified shelter account.

## Shelter conversion after confirmation

A responder should be able to complete confirmation without creating an account. After the response is safely recorded, present a strong shelter-specific invitation that explains:

- ShelterPawtners is free for participating shelters during the MVP;
- shelters can create and maintain Digital Pet Passports and Shelter Report Cards;
- useful history can follow a pet into adoption with appropriate privacy controls;
- guardians can receive post-adoption savings and support;
- automated confirmation can reduce repetitive follow-up work;
- shelter participation can strengthen post-adoption relationships and future outcome insights;
- later capabilities may support community partners, resources, reporting, and adoption promotion.

The invitation must be truthful about what is currently available. It should offer **Create your free shelter account** and **Learn how ShelterPawtners helps shelters** without blocking the completed response.

## Email and SMS automation

Email is the recommended festival MVP channel. Supabase Edge Functions can initiate transactional email through a configured provider, and delivery results should update request status. Provider credentials must remain server-side.

Recommended automation:

- send the initial request after guardian confirmation;
- record provider message identifiers and delivery failures;
- allow limited manual resend;
- keep the request active for 30 days;
- send automated reminders on days 10, 20, and 27 when no terminal response exists;
- stop reminders after confirmation, decline, cancellation, expiration, or repeated delivery failure;
- on day 30, expire an unresolved request and notify the guardian that the shelter could not be reached or did not confirm within the verification period;
- notify the guardian when status materially changes;
- route exceptions to the team dashboard instead of making Jim the normal approval step.

SMS should follow after launch unless a compliant provider, consent language, sender registration, opt-out handling, cost controls, and delivery monitoring are ready without threatening the deadline. Social-media outreach remains a manual fallback unless an authorized platform integration exists.

## Medical and shelter history

Adoption verification can invite useful history, but confirmation and clinical history are different assertions.

- Shelter-provided information needs source, author or responder, timestamp, and confidence or verification scope.
- Uploaded adoption papers and medical records remain private by default.
- A shelter report should distinguish observed facts, estimates, behavior notes, and guardian-supplied information.
- Medical information should not be interpreted as current veterinary advice.
- The guardian controls later sharing subject to retained provenance and applicable policy.
- Structured veterinary history, provider access, and correction rules require separate design review even if the MVP accepts limited documents or notes.

## Ten-day scope priorities

### Required for card distribution

- mobile landing page and campaign QR destination;
- clear independent-brand language;
- reliable signup and authentication;
- Supabase persistence with basic operational visibility;
- guardian, shelter, and partner entry paths;
- Rave Shelter partner profile and self-published listing flow;
- filtered Rave Shelter marketplace;
- internal dashboard for signups, listings, reports, and failures;
- responsive, accessibility, security, and end-to-end testing.

### Include only if safely completed

- Guardian Passport Lite.
- Email-based adoption verification with a one-time shelter response link, 30-day response window, and defined reminders.
- Private adoption-document upload.
- Basic ShelterPawtners pet marketplace seed data.

### Defer rather than compromise the launch

- SMS verification outreach;
- automated social-media messaging;
- full shelter-account verification;
- shelter-created Passport and adoption transfer;
- complex medical history and veterinary workflows;
- savings calculations and redemption accounting;
- automatic fairness or fraud scoring;
- production claims about Lost Lands or other festival affiliation.

## Launch acceptance

Before cards are distributed:

- Test every QR code on iOS and Android using cellular connections.
- Complete guardian, shelter, partner, and shelter-responder journeys with fresh accounts.
- Confirm database writes, timestamps, status transitions, RLS denial paths, and dashboard visibility.
- Test expired and reused verification links.
- Test email delivery and failure handling on more than one major mailbox provider.
- Confirm partner edits and unpublishing, user reporting, and platform suspension.
- Review all public copy for affiliation, accuracy, grammar, and mobile readability.
- Run Supabase security and performance advisors.
- Confirm backups, error monitoring, support ownership, and a rollback or disable plan.
