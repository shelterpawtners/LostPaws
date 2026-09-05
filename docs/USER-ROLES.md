# User roles and permissions

## Model

A user may hold multiple roles across organizations and personal contexts. Roles are scoped permissions, not a single exclusive account type. Organizations support multiple members. Membership in one organization must not grant access to another organization's data or a guardian's private records.

The following defines intended authority boundaries, not a final permission matrix or schema. Sensitive actions require server-side authorization and RLS as specified in [Security and privacy](SECURITY-AND-PRIVACY.md).

| Role | Intended scope | Boundary |
| --- | --- | --- |
| Guardian | Manage their profile and pets under active guardianship; control selective sharing; accept authorized transfers. | Cannot self-assert shelter verification or alter historical provenance as if authored by another party. |
| Shelter or rescue member | Assigned organization work, potentially including pet records while in care and adoption operations. | Membership alone does not grant every shelter action; verification and transfer initiation need explicit permissions. |
| Shelter administrator | Manage shelter membership and authorized organizational workflows. | Administration does not confer unrestricted access to post-transfer private guardian information. |
| Business partner | Assigned offer and participation work within a business organization. | No access to private Passport or guardian data merely because a person views or redeems an offer. |
| Business administrator | Manage business members, offer administration, and participation permissions. | Cannot grant platform-wide roles or bypass eligibility rules. |
| Veterinary or care provider | Access selected pet history and contribute within current authorization; eventual Passport creation. | No default access to all pets, permanent access from a past visit, or ability to overwrite other sources' provenance. |
| Platform administrator | Restricted operational and support capabilities. | No routine unrestricted browsing of sensitive records; privileged actions need purpose, least privilege, and auditability. |
| Future research or reporting user | Approved aggregate insights and reports. | No guardian personally identifiable information; no raw private-record access by default. |

Prospective adopters, sponsors, brands, event vendors, community organizations, and public visitors are product audiences. Do not invent new privileged roles for them until the relevant workflow requires one. Anonymous access is limited to deliberately public information.

## Organization and resource scope

Evaluate the authenticated person, active organization membership, permitted action, resource relationship, current guardianship, and explicit sharing authorization together. A multi-role user should have clear context when acting personally or for an organization. Revoked membership must stop future organizational access.

Guardian control after adoption and shelter retention of appropriate historical records are compatible only when record access is separated. Historical authorship is not a continuing authorization grant. A provider contribution likewise does not establish permanent access.

## Decisions before implementation

Define the smallest permission set for each phase before building its workflows. Human decisions needed for co-guardianship, organization verification, delegated authority, provider authorization, and support access are tracked in [Roadmap](ROADMAP.md). Do not silently turn these unresolved policies into default broad access.
