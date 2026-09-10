# DRAFT — Privacy Notice

**Status: owner/legal review required. Not approved for publication.**

Last draft update: 2026-09-10

This is a working product/privacy draft for ShelterPawtners / RAVE Shelter and must be reviewed against the actual production data flows, vendors, jurisdictions, and legal entity before publication.

## 1. Scope

This draft describes the intended handling of personal information when people use ShelterPawtners services, including Guardian, shelter/rescue, PetBiz, provider, RAVE, Digital Pet Passport, Marketplace, adoption-verification, and community experiences.

## 2. Information we may collect

Depending on the feature and account type, the service may process:

- account and authentication information, such as name, email address, login provider, and account role;
- organization information for shelters, rescues, PetBiz partners, providers, and RAVE participants;
- pet information, including pet profile details, photos, adoption history, medical/provider notes submitted by authorized users, and Passport-related records;
- adoption-verification information, including shelter contact details, adoption date, approver information, verification status, supporting documents, and system-generated verification tokens/status metadata;
- Marketplace and offer activity, such as viewed, claimed, redeemed, expired, or limited-quantity offers and associated savings/donation tracking fields;
- communications and support information submitted to the service;
- security, device, browser, log, and diagnostic information reasonably necessary to operate and protect the service.

## 3. How information may be used

Information may be used to provide and secure accounts; maintain Digital Pet Passports; facilitate adoption verification; provide Marketplace offers and track related activity; support users and organizations; prevent abuse; troubleshoot and improve product reliability; comply with legal obligations; and produce aggregate or de-identified insights where permitted.

Research or analytics uses should not expose Guardian personally identifiable information when aggregate/de-identified data can satisfy the purpose.

## 4. Sharing

Information may be shared with:

- service providers that host, authenticate, deliver email, secure, or otherwise operate the platform;
- shelters/rescues, PetBiz partners, providers, or other participants when the user requests or authorizes a workflow that requires the disclosure;
- legal authorities or other parties where required by law or necessary to protect rights, safety, users, animals, or the service;
- a successor entity in a permitted merger, acquisition, financing, or asset transfer, subject to applicable law.

The final notice must name or categorize actual production subprocessors accurately before publication.

## 5. Authentication and email

The intended production architecture uses Supabase Auth for authentication and may use third-party identity providers such as Google and Facebook. Transactional authentication email may be delivered through Resend from a dedicated authentication subdomain. The final notice must reflect the providers actually enabled at launch.

A separate universal consumer Instagram login must not be claimed unless a supported production provider is actually implemented. Optional Instagram handles/profile information may still be supplied by users.

## 6. Digital Pet Passport privacy

Pet Passports are intended to be Guardian-controlled. Private data should remain private by default unless a user deliberately shares or a product workflow explicitly requires disclosure. Public/emergency identity should use the designed limited/opaque public representation rather than exposing internal identifiers or unrelated private account data.

## 7. Adoption-verification links

Shelter verification may use secure, time-limited external links that allow a shelter responder to confirm or decline an adoption without creating an account. Raw verification tokens should not be exposed to Guardians or treated as public identifiers. The final notice should describe retention of verification records and uploaded supporting documents once the retention policy is approved.

## 8. Cookies and similar technologies

**Owner/legal review required:** inventory the actual production cookies, local/session storage, authentication storage, analytics, and tracking technologies before publication. Do not claim opt-out mechanisms that are not implemented.

## 9. Retention

Information should be kept only as long as reasonably necessary for the purposes described, security, legal obligations, dispute resolution, and legitimate pet-history continuity. **Owner/legal review required:** define production retention/deletion periods for accounts, Passport records, verification artifacts, logs, support records, and transactional data.

## 10. Security

The service uses technical and organizational safeguards appropriate to the product, including authentication controls and database row-level security where implemented. No system can guarantee absolute security. Secrets and privileged credentials should not be stored in public repository content or client-visible code.

## 11. User choices and rights

Users may have rights to access, correct, delete, restrict, object to, or obtain a copy of personal information depending on applicable law. **Owner/legal review required:** define the verified request process, applicable jurisdictions, exceptions, response periods, and account-deletion/data-export behavior before publication.

## 12. Children

**Owner/legal review required:** establish the minimum age and parental-consent policy before launch. Do not publish a children’s privacy representation until the actual eligibility design is approved.

## 13. U.S. state / international disclosures

**Owner/legal review required:** determine which U.S. state privacy laws, GDPR/UK GDPR, or other jurisdictional requirements apply based on launch geography, business thresholds, data practices, and users. Add legally required notices only after that determination.

## 14. Changes

The final notice should explain how material changes are communicated and identify the effective date of the published version.

## 15. Contact

**Owner review required:** insert the approved legal entity name, mailing address, privacy contact method, and any required data-protection representative information.

---

## Required owner/legal decisions before publication

- Legal entity/controller identity and contact details.
- Minimum age and children’s privacy approach.
- Production subprocessor/vendor list.
- Cookie/analytics/tracking inventory and consent requirements.
- Data retention/deletion schedule.
- Account deletion, access, correction, and export workflow.
- Adoption-verification document retention.
- Marketplace transaction/savings/donation data classifications after OD-003/OD-004 decisions.
- Applicable U.S. state and international privacy regimes.
- Whether any aggregate/de-identified research program requires additional notice or opt-out rights.
