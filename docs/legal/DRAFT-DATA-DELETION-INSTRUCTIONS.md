# Draft — User Data Deletion Instructions

Status: **pre-publication draft for owner/legal review**. Do not present this document as the final public policy or submit it to Meta until the operational workflow and legal language are approved.

## Purpose

ShelterPawtners intends to give users a clear way to request deletion of personal account data associated with the ShelterPawtners service.

## Proposed public request path

Public page target:

`https://shelterpawtners.com/data-deletion`

Proposed contact channel for MVP:

`contact@shelterpawtners.com`

Before publication, owner/legal review must confirm whether a dedicated privacy address or in-product request form should replace this general mailbox.

## Proposed user instructions

A user requesting deletion should provide enough information for ShelterPawtners to locate and verify the account without sending passwords, authentication secrets, or unnecessary sensitive information.

Suggested minimum request information:

- the email address associated with the ShelterPawtners account;
- the request type: account/data deletion;
- enough context to distinguish the account if multiple roles or organizations are associated with it.

ShelterPawtners should verify account ownership before destructive deletion or irreversible de-identification actions.

## Data categories to evaluate during a deletion request

Depending on the user's activity and approved retention rules, the request workflow may need to address:

- authentication identity and account metadata;
- Guardian profile information;
- Shelter/PetBiz/RAVE Vendor profile information;
- organization memberships and administrative relationships;
- pet profile and Digital Pet Passport information;
- pet media;
- adoption-verification requests and supporting records;
- marketplace claims/redemptions/savings records;
- community content/messages when implemented;
- support/feedback tickets and associated operational metadata;
- security/audit records.

## Retention / exception language requiring approval

The final public page should explain that some limited records may need to be retained where reasonably necessary or legally required for purposes such as:

- fraud, abuse, or security prevention;
- resolving disputes or enforcing agreements;
- financial/transaction integrity;
- legal/regulatory obligations;
- protecting other users, shelters, partners, or pets;
- approved continuity rules for historical pet/adoption records.

Do not promise that every record will always be immediately and irreversibly erased. The exact retention/de-identification rules require owner/legal approval.

## Identity-provider deletion

Deleting a ShelterPawtners account does not necessarily delete the user's Google, Facebook, Instagram, Microsoft, or other third-party account. The final page should distinguish deletion of ShelterPawtners data from revoking third-party identity-provider access.

If Facebook or Instagram login is enabled, the final workflow should include a way to remove/link-revoke the social identity from ShelterPawtners as appropriate.

## Operational requirements before publication

- [ ] Decide the approved privacy/deletion contact address or in-product form.
- [ ] Define account-ownership verification procedure.
- [ ] Define which data is deleted, de-identified, disconnected, or retained.
- [ ] Define handling for Pet Passport/adoption-history continuity.
- [ ] Define treatment of organization records when the requester is an owner/admin.
- [ ] Define treatment of redemption/financial-support records.
- [ ] Define treatment of support/security/audit records.
- [ ] Confirm whether Meta accepts the public instruction URL for the selected Facebook/Instagram use case or requires a callback.
- [ ] Confirm any response-time language with counsel/operations before promising it publicly.
- [ ] Add a request reference/confirmation mechanism if needed for Meta or applicable law.
- [ ] Owner explicitly approves publication.

## Engineering preparation

Engineering may prepare the `/data-deletion` route and request workflow before final text approval, but the live production page must not claim final legal rights, timelines, retention periods, or deletion scope until they are approved and operationally supportable.
