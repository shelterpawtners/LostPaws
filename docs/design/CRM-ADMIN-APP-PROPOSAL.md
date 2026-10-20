# Proposed internal CRM — ShelterPawtners Operations 360 (approval required)

**Status: DESIGN PROPOSAL ONLY — NOT AUTHORIZED TO IMPLEMENT OR DEPLOY.**
Owner decision requested: approve/modify scope, data permissions, and CRM-specific roles before work begins.
Do not combine this feature release with the October 2026 Data API compatibility fix.

## Goal and experience

An ultra-modern operations console for ShelterPawtners staff, influenced by Salesforce Lightning and Dynamics 365 Customer Service without copying either brand:
- Left rail: Home/Work Queue, **Business Accounts**, **Guardians (Contacts)**, **Pets / Passports**, **Support Cases**, **Activities**, and eventually Offers/Events.
- At-a-glance KPI tiles: open cases, overdue follow-ups, active partners, onboarding gaps. No unverifiable impact metrics.
- Dataverse-like responsive data grids: pinned/sortable/resizable columns, searchable filters, status chips, paginated server-side results, saved list views, bulk selection only where approved.
- Click record -> keyboard-accessible split-panel preview -> full record view with tabbed Summary, Relationships, Activity Timeline, Cases, Offers/Events, and Audit.
- Customer-service form: contextual record sidebar, contact preferences, status, internal note/activity, next action and due date, case assignment; autosave only where safe/explicit; dirty-state and validation messaging.
- Partner assistance: business status, memberships, contacts (where permitted), profile completion, offer/event lifecycle, verification and related cases.
- Guardian assistance: guardian profile, linked pets/passports, verification requests, open support issues, communications preference/consent; **never assume a guardian is a business**.
- Skeleton/loading/error states, WCAG-conscious contrast/focus and table keyboard UX, safe PII masking, responsive desktop/tablet layout.

## Deployment isolation (separate app, not a hidden /admin route)

**Proposed URL:** `https://crm.shelterpawtners.com`. This is a proposal, not a live DNS or deployment.
- Separate Vercel project and build entrypoint under the existing repository or a dedicated private repository after assessment; separate build artifact, environment variables, deployment permissions and release gate.
- No staff CRM navigation or staff PII JS bundle on the public `shelterpawtners.com` app.
- Merely hiding links or using a subdomain is **not security**. All requests require backend authorization; deep links, API calls, downloads and record IDs must enforce it too.
- Prefer a server-side BFF/API gateway (Vercel functions or tightly scoped Supabase Edge Functions) that validates Supabase Auth sessions, fresh staff authorization, permitted record scope, and business action. No service-role key or sensitive auth tokens in the browser bundle.
- Separate access guard such as Vercel Deployment Protection/IP/SSO **as an additional layer**, not as a substitute for backend authorization.
- Require phishing-resistant MFA where feasible; at minimum enforce MFA for staff and verify assurance level server-side. Staff provisioning/revocation is owned by a trusted CRM administrator; no user self-assignment.

## Roles and least privilege

New CRM permission grants should be independent of a user's normal Guardian/PetBiz/Shelter membership and not automatically inherited from legacy `platform_admin` or QA impersonation.

| Role          | Search/list/view                         | Case notes & tasks                   | Partner operational changes        | Staff/security administration       |
| ------------- | ---------------------------------------- | ------------------------------------ | ---------------------------------- | ----------------------------------- |
| `crm_viewer`  | approved masked columns / assigned scope | No                                   | No                                 | No                                  |
| `crm_agent`   | assigned guardians and partner cases     | assigned case notes, tasks, statuses | No                                 | No                                  |
| `crm_manager` | authorized team scope, review/escalate   | assign/triage, approve exceptions    | approved controlled workflows only | No                                  |
| `crm_admin`   | approved administrative scope            | all approved case actions            | approval-required actions          | grant/revoke roles and audit access |

Store staff roles in a server-controlled, audited authorization structure (e.g. `private.crm_staff_grants`), with MFA requirements and revocation support. Never trust user-editable `user_metadata` or display role values. Use explicit allowlisting, server-side checks on every read/write, scope restrictions by record, and audit privilege changes. No blanket `authenticated` read of contact/guardian PII.

## Reuse canonical data — no migrations of source-of-truth rows

Current hosted structures verified (2026-10-20; metadata only):
- **Businesses:** `public.organizations`, `organization_partner_profiles`, `organization_memberships`, `organization_private_contacts`, `organization_locations`, `offers`, `events`.
- **Guardians:** `public.profiles`, `guardianships`, `pets`, `adoption_verification_requests`, `pet_media`.
- **Service:** `public.support_tickets`, `support_ticket_messages`, `support_ticket_events`.
- **Identity:** `auth.users` is controlled by Supabase Auth. A profile UUID is not an authorization substitute; emails not stored in `profiles` must only be fetched via an approved server-side interface.

Use secure server-side **read projections/views** for grid rows, with explicit column allowlists; keep linked detailed records in canonical tables. Do not copy PII, redact/delete data, change public RLS, or extend existing public API permissions as a CRM shortcut. CRM-only `private` tables (staff grants, case assignments, activity, audit) would require a separate reviewed migration and backup strategy. If creating a new dedicated API schema, audit exposed objects and restrict grants.

## UX specification for first release

**Account grid**
- Columns: organization name, category/type, status, onboarding state, partner participation state, primary city/service area, last updated, assigned staff member.
- Filters: organization type (Shelter/Rescue/PetBiz/RAVE vendor), onboarding state, status, geography, last interaction.
- Detail: account summary, authorized contacts, membership roles, offers/events, open service cases, internal timeline and staff follow-up.
- Must distinguish public partner data from operational/private contact information.

**Guardian grid**
- Columns: display name, profile created, number of linked pets, adoption-verification status, case count, most recent interaction, assigned staff.
- Restricted PII columns (email/phone) revealed only for authorized roles and legitimate assistance use.
- Detail: contact card, guardian-linked pets/passports, verification progress, case history, notes and activities; no exposing full private pet identifiers or records unnecessarily.

**Support grid and case form**
- Columns: ticket reference, subject, status, severity, record link, owner/assignee, created/updated, SLA target (only once defined).
- Details: safe ticket body/messages by visibility, notes, contact/partner context, action timeline.
- Actions proposed only after permissions review: assign case, set status, add internal note, create follow-up and resolve/close through documented lifecycle APIs; retain existing customer-owned support messages and audit.

**Visual direction:** neutral dark left rail, clean light working canvas, restrained ShelterPawtners purple/teal highlights; compact data density, tasteful motion, soft focus/hover states, clear states and accessible contrast. Prefer enterprise readability over decorative gradients.

## Phased implementation, gates and rollback

1. **Approval / threat model / data contracts.** Approve domain, application hosting, staff roles, views, columns, permitted writes, retention/audit and MFA. Record security decisions and redaction policy. No deployment.
2. **Read-only foundation.** Separate CRM app build and staff sign-in / session checks, role matrix, audited BFF query services, account and guardian grids, drill-down summaries, private staging/test data. Negative role/cross-tenant tests. Public site stays unchanged.
3. **Customer-service workbench.** Case grid, detailed record context, task/activity schema and staff-owned notes after schema review, controlled case status transitions and assignments, audit/rollback validation.
4. **Business assistance features.** Partner profile and offer/event assistance as **approved action-specific server-side RPCs**, never arbitrary privileged table editing or direct service-role exposure. Elevated changes require confirmation/audit.
5. **Launch gate.** Privacy/security review, 2-person approval of first staff grants, MFA verified, access and revocation tests, audit search, accessibility and responsive QA, backups/restoration, Vercel preview and custom DNS cutover. Separate rollback from public web app.

**Non-goals for MVP:** export-all data, mass email, AI-driven automatic customer decisions, impersonating guardians, modifying adoption/economic history, public CRM links, cross-org mass mutations, artificial demo partner data on public surfaces.

### Acceptance criteria
- Anonymous, Guardian and ordinary business users cannot load CRM data or staff bundles requiring authentication, even with known deep links and API endpoints.
- Revoked staff permission immediately fails fresh server authorization checks; expired/missing MFA fails closed.
- Read-only Account and Guardian grids search, filter, paginate, drill down accurately and do not expose disallowed columns/rows.
- Staff case changes are validated, auditable and reversible using documented lifecycle transitions. Existing records remain intact.
- Public application and hosted data remain unchanged until independent CRM owner release authorization.

## Explicit decisions requested

1. Approve proposed CRM URL and **separate Vercel project**?
2. Confirm first cohort of trusted CRM staff and whether all must use MFA; approve the four-role model or revise it.
3. MVP priority: **Accounts + Guardians + Pet Passports + Support Cases** (recommended), or include Offers/Events write actions in initial release?
4. Approve read-only Phase 1 first, then add case notes/assignments only after the security model is verified?
