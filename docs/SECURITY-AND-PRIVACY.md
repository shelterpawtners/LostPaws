# Security and privacy

## Scope

Security is part of architecture from the start. This document defines engineering requirements for future implementation, not a claim of legal compliance or deployed controls. Human policy decisions are tracked in [Roadmap](ROADMAP.md).

## Privacy by design

Collect the minimum personal information needed for a defined purpose. Separate guardian personally identifiable information from data that may later support aggregated insights. Pet records can expose guardian identity, location, contact details, or routines and therefore require careful handling even when primarily about an animal.

Public Passport views must not expose private information by default. Sharing must be intentional, scoped, and permission-based. Do not assume photos, documents, microchip details, provider notes, or adoption records are publicly safe. Review file metadata as well as visible content. Specify the launch field set and sharing choices before those views are built.

After adoption, the guardian is the primary controller of the pet account. This does not require erasing appropriate shelter history or allowing historical authorship to be rewritten. Separate retained shelter records, ongoing pet history, current guardian information, and explicitly shared material. Prior guardians' private data must not flow automatically to a new guardian.

Future research and insight products must not expose guardian personally identifiable information. Removing names alone does not prove safe aggregation; review re-identification risk before release. Retention, deletion, export, consent, and research-use policy require explicit decisions before affected workflows ship.

## Authorization and authentication

- Enforce RLS on user-accessible data. Frontend visibility checks are not authorization.
- Evaluate organization membership, permitted action, resource relationships, guardianship, and sharing scope on the server.
- Apply least privilege and role separation. Multiple roles do not confer unrestricted global access.
- Use secure authentication flows and validate authenticated identity for sensitive actions.
- Never expose service role keys to the browser or commit secrets. Do not bypass or weaken RLS to repair a feature.
- Restrict platform administrative access and audit sensitive actions. Define operational access policies before implementing support tools.
- Revoke access when membership or sharing permission ends, accounting for any time-limited file access mechanism.

### Organization claims and matching

Partner onboarding may preserve private draft business details and return possible organization candidates, but a matching name, website, phone, or address is not proof of representation. Candidate matching must be authenticated, conservative, and explainable. A request for membership or ownership review must remain pending until an authorized organization manager or platform process resolves it; it must not create a membership or transfer control as a side effect.

Parent/child and franchise relationships are not authorization grants. An independently owned franchise, sibling, or branded business must not receive the parent or brand's contacts, memberships, private records, redemption information, financial data, or administrative capabilities. Duplicate review must preserve historical references and create private audit evidence; automated merges or destructive deletion are out of scope until separately approved.

## Transfer safeguards

A transfer must use secure, hard-to-guess claim material with expiration and replay prevention. Bind the claim to the intended pet and an authorized workflow. Validate issuer authority and recipient identity before completion. Do not log usable transfer secrets or expose them to unrelated users.

The implementation must support cancellation or invalidation of pending claims as appropriate, reject expired or reused claims, and handle concurrent acceptance safely. Apply proportionate rate limiting to claim and other abuse-prone endpoints. Complete guardianship, permission, and audit changes consistently; failure must not leave partial access changes.

Preserve historical provenance. Shelter creation of a Passport is not a permanent access grant to the adopting guardian's private information. Exact claim delivery, identity matching, disputed-transfer resolution, and non-adoption transfer policies remain to be decided before those flows are built.

## External adoption confirmation links

Guardian-initiated shelter outreach creates an external trust boundary. A shelter confirmation link must be limited to one request and must never provide general access to the guardian account or Passport.

Use long random claim material, expiration, one-time completion, cancellation, replay prevention, rate limiting, and request-specific authorization. Avoid storing usable tokens where a database disclosure would make them immediately reusable. Never place usable tokens in analytics, routine application logs, support exports, or email-delivery metadata beyond what the delivery provider necessarily processes.

The email should contain minimal pet and guardian information. The linked experience should explain ShelterPawtners and the requested action before disclosing matching details. A response confirms only the stated adoption facts and supplied history. It does not automatically verify the responder's organization account or every pet record.

Adoption papers, medical documents, and shelter notes are sensitive. Store them privately, validate file type and size, restrict metadata exposure, preserve source and timestamps, and separate adoption evidence from clinical assertions. Define guardian access, correction, disputes, retention, deletion, and support access before launch.

Outbound email requires guardian consent, accurate sender identity, delivery and failure handling, restrained reminders, and abuse controls. SMS requires separate consent, opt-out, carrier, sender-registration, cost, and compliance decisions before use.

## Contributions, uploads, and privileged actions

Provider contributions require current, scoped authorization and source attribution. Distinguish permission to contribute from permission to change another contributor's historical assertions. Determine correction and revocation behavior before provider workflows ship.

Validate inputs server-side for privileged actions and enforce file access policies. Define acceptable upload types and sizes, validate content, and prevent unauthorized file reads or writes. Keep private files private; use appropriately limited access rather than public storage as a convenience. Add rate limiting where abuse risk warrants it.

Offer eligibility, adoption confirmation, transfer completion, administrative changes, and redemption recording require server-side authorization. Partner self-publication still requires organization-scoped authorization, input validation, link safety, rate limits, reporting, audit history, and platform suspension controls. Any elevated server capability must perform its own explicit checks; its credential is not a substitute for end-user authorization.

## Audit and validation

Capture attributable, time-stamped audit events for verification, transfers, guardianship changes, provider contributions, redemptions, and administrative actions. Record the relevant target and outcome without unnecessarily duplicating sensitive content. Protect audit history against unauthorized alteration and define retention before release.

Test denial as well as success: cross-organization access, former guardians, expired sharing, revoked memberships, forged claims, repeated redemptions, and unauthorized private-file access should fail appropriately. Confirm intentionally public fields do not expose private data. Applicable checks accompany each feature; this foundation contains no implemented controls to test yet.
