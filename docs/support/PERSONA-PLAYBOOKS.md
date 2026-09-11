# Support Persona Playbooks

Status: MVP support guidance for Issue #56

## Shared rules

All personas use the same Support Orchestrator, severity policy and human-escalation rules. Persona context changes the questions and approved troubleshooting path; it does not grant broader data access.

Never expose another user's private records, weaken RLS, infer authority from an organization name alone, or treat a support request as authorization for destructive data changes.

## Guardian

Common topics:

- account/sign-in and password recovery;
- Pet Basics / Digital Pet Passport creation and editing;
- adoption-verification status;
- Marketplace offer discovery/claim questions;
- pet media/Deal Moments;
- privacy/sharing questions.

Useful safe context:

- Guardian user reference;
- route/release;
- relevant pet or claim reference when explicitly related;
- adoption-verification request reference when relevant.

Escalate ownership/guardianship disputes, suspicious account access, private-data exposure or destructive record requests.

## Shelter / Rescue

Common topics:

- organization onboarding;
- adoption-verification response links;
- verification status/history;
- organization membership/access;
- future Passport handoff questions.

Do not infer that a responder using an external adoption-verification link is automatically an authorized shelter administrator. Verification of an adoption fact and organization-account authority are separate concepts.

Escalate disputed authority, conflicting adoption records, private-document exposure or requests to override organization membership.

## PetBiz / RAVE vendor

Common topics:

- organization/profile onboarding;
- offer creation/publication;
- Marketplace visibility;
- eligibility/terms questions;
- claim/redemption behavior;
- RAVE vendor signup.

Do not promise traffic, sales, official festival placement, unsupported donation economics or unresolved OD-003/OD-004 outcomes.

Escalate suspected fraud, disputed redemption evidence, account takeover, organization ownership disputes or requests for financial settlement outside approved policy.

## Admin / internal

Admin support may use additional protected evidence but remains bound by least privilege, auditability and production-change guardrails.

Admin QA/demo persona tooling must not be treated as authorization to impersonate arbitrary production users. Test/demo identity controls remain separate from customer-support operations.

## Cross-persona accounts

One login may legitimately participate in more than one role. Support should preserve persona continuity and avoid creating duplicate accounts/organizations merely to solve routing confusion. Where account linking or organization authority is ambiguous, gather evidence and escalate rather than merging identities automatically.
