# Architecture and engineering direction

## Status

The development architecture is implemented in its first vertical slice. Production infrastructure remains unapproved. See [Roadmap](ROADMAP.md) for delivery boundaries.

## Preferred stack

| Layer                 | Direction                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Frontend              | React, TypeScript, Vite, accessible CSS tokens, reusable components.                         |
| Backend               | Supabase PostgreSQL, authentication, private and public storage, RLS, and APIs.              |
| Optional capabilities | Supabase Realtime where useful; Edge Functions for appropriate privileged server-side logic. |
| Development project   | `shelterpawtners-dev`, only when connection is authorized.                                   |
| Production            | Do not connect to or create a production project without explicit instruction.               |

Avoid unnecessary dependencies. Document the reason before introducing a large framework. Prefer low initial cost, fast iteration, maintainability, security, and reasonable future scale. Do not add microservices or paid infrastructure when a reliable free or inexpensive approach meets the stage's needs. Avoid shortcuts that would require a wholesale rewrite after adoption grows.

## Authentication implementation

The client subscribes to Supabase authentication state and protects dashboard and onboarding routes from anonymous access. Email and password registration, sign-in, sign-out, and password recovery are implemented. Participant roles are stored relationally and selected as an interface context; switching the active role never grants permissions by itself. Google authentication remains feature-disabled until its provider credentials and hosted redirect URLs are configured in the development project.

## Conceptual boundaries

Keep identity and access, organization membership, pet identity, Passport history, guardianship and transfers, verification, sharing, offers and redemptions, campaigns, and reporting conceptually distinct. These are domain boundaries to inform later relational design, not a mandate for separate services or tables now.

A person may act in multiple roles and organizations. A pet's identity and historical provenance must survive appropriate guardianship changes. Current access, authorship, verification, and historical record retention are different concerns and must not be collapsed into a single owner field.

Favor explicit relational models when information has meaningful relationships or reporting value. Do not default to large unstructured JSON records for memberships, transfers, eligibility, or other relational concepts. Allow modest implementation choices where their rationale is documented; the physical model will be designed during authorized database work.

## Trust boundaries

The browser is untrusted for authorization and privileged actions. Use RLS for user-accessible data and server-side validation for privileged workflows. Storage access needs corresponding policies. Service role keys must never appear in frontend code. [Security and privacy](SECURITY-AND-PRIVACY.md) defines the detailed requirements.

Transfers must coordinate claim validation, guardianship changes, permission changes, and audit recording as one consistent outcome. A failed or concurrent attempt must not leave partial control changes. Exact transaction and workflow design is deferred until implementation, with the invariant fixed here.

## Database engineering

All schema changes must be migrations committed to this repository. Avoid unmanaged production dashboard changes. Review migrations together with authorization and data handling effects. Never weaken RLS to make a feature work. Keep secrets out of source control and ensure privileged credentials remain server-side.

Auditability is required for shelter verification, pet transfers, guardianship changes, provider contributions, offer redemptions, and administrative actions. Reporting data must preserve meaningful definitions and provenance without exposing guardian personal information.

### Phase 2 Checkpoint 1 organization resolution

Partner organization resolution uses an entry-first draft record, an authenticated exact-signal candidate function, distinct access/ownership request records, typed relationship records, and platform-only duplicate review cases. Candidate results contain only public identifying context and explainable match reasons; they never represent proof of control. Corporate parent assignment is limited to a parent the creator already manages. Independent franchises remain separate organizations related through a pending typed relationship, without inheriting membership or private data.

## Implementation and validation after approval

Build small vertical changes with relevant tests and builds. Exercise authorization with different roles, organization memberships, guardianship states, and sharing scopes. Validate failure paths for transfers and redemptions, not just successful actions. Review frontend behavior in a browser according to the [design process](BRAND-DESIGN-SYSTEM.md).

Introduce actual setup and validation commands in README when they exist. Keep major technical choices here with their status, rationale, and consequences. Hosting, detailed schema, dependency versions, and privileged workflow implementation are not settled by this foundation.
