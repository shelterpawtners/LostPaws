# User roles and permissions

## Model

A user may hold multiple roles across organizations and personal contexts. Roles are scoped permissions, not a single exclusive account type. Organizations support multiple members. Membership in one organization must not grant access to another organization's data or a guardian's private records.

Registration, organization membership, organization verification, offer approval, and publication are separate states. A person who creates or claims an organization is not automatically a verified representative, organization administrator, authorized verifier, or marketplace publisher.

The following defines intended authority boundaries, not a final permission matrix or schema. Sensitive actions require server-side authorization and RLS as specified in [Security and privacy](SECURITY-AND-PRIVACY.md).

| Role | Intended scope | Boundary |
| --- | --- | --- |
| Guardian | Manage their profile and pets under active guardianship; control selective sharing; accept authorized transfers. | Cannot self-assert shelter verification or alter historical provenance as if authored by another party. |
| Shelter applicant | Create or claim a shelter or rescue profile and submit it for review. | Cannot approve verification, publish a verified status, create verified adoption records, or access private guardian data. |
| Shelter or rescue member | Assigned organization work, potentially including pet records while in care and adoption operations after those capabilities are approved. | Membership alone does not grant every shelter action; verification and transfer initiation need explicit permissions. |
| Shelter administrator | Manage approved shelter membership and authorized organizational workflows. | Administration does not confer unrestricted access to post-transfer private guardian information or authority to approve the organization's own verification. |
| Partner applicant | Create or claim a business profile, describe services, and draft or submit offers. | Cannot publish offers, assert exclusive or adoption-qualified status, or access private Passport and guardian data. |
| Business partner | Assigned service, offer, and participation work within an approved business organization. | No access to private Passport or guardian data merely because a person views or redeems an offer. |
| Business administrator | Manage business members, profile details, services, offer drafts, and participation permissions. | Cannot grant platform-wide roles, approve publication, or bypass eligibility rules. |
| Marketplace reviewer or publisher | Review organization information and offer submissions within explicitly assigned authority; publish, return, suspend, expire, or correct marketplace entries. | Marketplace authority does not grant access to private Passport or guardian records, and sensitive actions require auditability. |
| Veterinary or care provider | Access selected pet history and contribute within current authorization; eventual Passport creation. | No default access to all pets, permanent access from a past visit, or ability to overwrite other sources' provenance. |
| Platform administrator | Restricted operational and support capabilities. | No routine unrestricted browsing of sensitive records; privileged actions need purpose, least privilege, and auditability. |
| Future research or reporting user | Approved aggregate insights and reports. | No guardian personally identifiable information; no raw private-record access by default. |

Prospective adopters, sponsors, brands, event vendors, community organizations, and public visitors are product audiences. Do not invent new privileged roles for them until the relevant workflow requires one. Anonymous access is limited to deliberately public information.

## Organization registration and resource scope

An authenticated person may create a draft organization profile or request access to an existing organization. Duplicate or competing claims require review. The system must preserve who submitted information, who reviewed it, the resulting status, and material corrections.

Evaluate the authenticated person, active organization membership, organization status, permitted action, resource relationship, current guardianship, and explicit sharing authorization together. A multi-role user should have clear context when acting personally or for an organization. Revoked membership must stop future organizational access.

Offer authorship is not publication authority. Organization approval is not blanket approval of every service, offer, adoption claim, or member action. Shelter verification and business approval may require different evidence and review paths.

Guardian control after adoption and shelter retention of appropriate historical records are compatible only when record access is separated. Historical authorship is not a continuing authorization grant. A provider contribution likewise does not establish permanent access.

## Decisions before implementation

Define the smallest permission set for each MVP onboarding and review workflow before building it. Human decisions needed for organization claims, duplicate handling, reviewer authority, co-guardianship, organization verification, delegated authority, provider authorization, and support access are tracked in [Roadmap](ROADMAP.md). Do not silently turn unresolved policies into default broad access.
