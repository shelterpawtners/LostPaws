# Owner / Legal Review Checklist

Status: pre-publication review aid. This document does not approve final Terms or Privacy text.

Use this checklist with:

- `DRAFT-TERMS-OF-SERVICE.md`
- `DRAFT-PRIVACY-NOTICE.md`

The goal is to isolate the decisions that still require owner/legal judgment so engineering can prepare implementation without silently inventing policy.

## 1. Legal entity and contact identity

Decide before publication:

- exact contracting/legal entity name;
- approved mailing/business address for legal notices;
- legal/privacy contact email or process;
- whether a registered agent or other required contact must be disclosed.

Engineering must not guess these values.

## 2. Launch geography and eligibility

Confirm:

- initial launch geography;
- minimum user age;
- whether parental consent is required for any supported users;
- whether service access should be restricted by jurisdiction at MVP.

These decisions affect Terms, Privacy and account eligibility copy.

## 3. Marketplace responsibility

Review the draft allocation of responsibility among ShelterPawtners and PetBiz/RAVE providers for:

- offer terms;
- inventory/availability;
- fulfillment;
- eligibility disputes;
- provider representations;
- suspension/removal of misleading or stale listings.

Do not promise guaranteed vendor traffic, sales, official festival placement or provider performance.

## 4. Savings and shelter-support economics

Keep publication blocked on unresolved customer-facing rules that depend on:

- OD-003 verified-savings terminology/calculation;
- OD-004 donation/settlement/money-movement terms.

The existing drafts intentionally do not decide these policies.

## 5. Liability / disputes

Legal review must determine jurisdiction-appropriate language for:

- warranty/disclaimer scope;
- liability exclusions/caps and required exceptions;
- indemnity, if any, by persona;
- governing law and venue;
- arbitration/class-action approach, if any;
- required consumer-law disclosures.

Do not publish generic template language as final without review.

## 6. Privacy data-flow verification

Before final Privacy Notice publication, verify the actual enabled launch stack and data flows, including:

- Supabase hosting/database/Auth;
- Resend transactional authentication email;
- Google OAuth if enabled;
- Facebook Login if enabled;
- Vercel hosting/deployment;
- Microsoft 365 human/business email role where relevant;
- any analytics, error monitoring, maps or other vendors actually enabled at launch.

Do not list a provider merely because it is planned.

## 7. Cookies / local storage / analytics

Inventory actual production browser storage and tracking behavior:

- Supabase/Auth session storage;
- app preference/local storage;
- QA-only storage that must not be described as production analytics;
- analytics/telemetry if later enabled;
- consent/opt-out mechanisms that actually exist.

Do not promise cookie controls that are not implemented.

## 8. Retention and deletion

Define or explicitly defer with counsel the treatment of:

- account/profile data;
- Digital Pet Passport history;
- pet media;
- adoption-verification records/documents;
- support tickets/messages/events;
- security/audit logs;
- offer/claim/redemption history;
- deleted/closed accounts and legally required retention.

Account deletion must not silently destroy records that product/legal policy requires to remain for security, disputes or pet-history continuity.

## 9. User privacy rights workflow

Approve the operational path for verified requests such as:

- access;
- correction;
- deletion;
- export;
- objection/restriction where applicable.

Define identity verification, response ownership and exceptions before promising specific response periods or rights beyond applicable law.

## 10. Adoption and pet-record boundaries

Confirm final wording that:

- adoption verification confirms a limited adoption fact;
- Digital Pet Passport is informational and not a substitute for veterinary records, legal ownership documents, microchip registration or government licensing;
- shelter verification does not automatically grant shelter admin or medical authority;
- private Passport information remains permission controlled.

## 11. Support / safety disclosures

Review how final policies should describe:

- support records and diagnostic context;
- security/privacy incident handling;
- abuse/animal-safety reporting;
- automated assistance/AI, if a disclosure is legally or product-policy appropriate at launch.

Support ticket content remains protected operational data and must not auto-publish to GitHub.

## 12. Approval gate

Before publication:

- [ ] Owner has reviewed both draft documents.
- [ ] Legal/business identity values are filled with approved facts.
- [ ] Launch geography/age approach is decided.
- [ ] Actual enabled subprocessors/data flows are verified.
- [ ] Retention/deletion and privacy-request operations are implementable.
- [ ] OD-003/OD-004 dependent language remains absent or is updated only after those decisions.
- [ ] Liability/dispute language has appropriate legal review.
- [ ] Final effective date/version is inserted.
- [ ] Product links/routes and contact methods are tested.
- [ ] Owner explicitly approves publication.

Until those boxes are satisfied, repository legal documents remain **drafts for review only**.
