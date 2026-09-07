# Phase 2 Checkpoint 1 — Partner Organization Foundation

Status: **ACCEPTED**. Checkpoint 1 is complete and Checkpoint 2 may proceed.

Acceptance basis:

- initial implementation commit `c4b39564fa740285974a057645523e26b5ee583f`;
- QA remediation commit `e00739c4aac487a9adfc51f36e57ebc81751ee19`;
- `npm run check` passed, including 9 unit tests;
- `npm run build` passed;
- QA corrected atomic creation, repeat submission, revocable creator authority, and anonymous RPC execution;
- connected development Supabase verification confirmed the deployed candidate RPC is unavailable to `anon` and executable by `authenticated` only;
- connected development Supabase policy inspection confirmed organization editing depends on active owner/administrator membership;
- connected development Supabase rolled-back transaction confirmed that after an authorized revocation, the former creator cannot edit the organization;
- Work development transaction confirmed atomic creation of organization, first owner membership, and multiple locations;
- product review confirmed the approved entry-first assisted-matching UX and organization-control rules are implemented.

| Requirement | Status | Evidence |
| --- | --- | --- |
| Entry-first Partner onboarding | Complete | `PartnerOrganizationOnboarding` in `src/main.tsx`; PetBiz and RAVE Shelter Vendor paths use the protected Partner flow. |
| Private, resumable submitted details | Complete | `organization_onboarding_drafts`, own-row RLS, and resolved outcome fields. |
| Conservative candidate matching | Complete | `partner_organization_candidates` is authenticated-only, scores explainable exact signals, and returns matching reasons without granting control. |
| Match actions do not grant control | Complete | `organization_access_requests` stores membership/ownership-review requests separately from memberships. |
| False-positive dismissal | Complete | User-specific candidate dismissals retain entered draft details. |
| New independent organization | Complete | `public.create_partner_organization` atomically creates organization, owner membership, locations, optional pending franchise relation, and draft resolution. |
| Multi-location support | Complete | Primary and additional locations remain organization-scoped. |
| Corporate and franchise structures | Complete | Managed-parent requirement for corporate child; pending typed relationship for independent franchise; no inherited control. |
| Claim/duplicate review and audit foundation | Complete | Pending request/review records, platform-only duplicate cases, and private audit trail. |
| Browser/mobile/accessibility implementation | Complete in code | Responsive layout, semantic labels, keyboard-operable actions, live status, and repeat-submit prevention were reviewed; dedicated authenticated Playwright execution remains environment-dependent. |
| Unit/build validation | Complete | `npm run check` and `npm run build` passed during QA. |
| Database/RLS validation | Accepted | Development transaction tests plus direct connected-Supabase permission/policy inspection and rolled-back revocation validation passed. |

## Accepted implementation decisions

- Partner onboarding starts with normal business-detail entry; matching is assistive guidance, not a search gate.
- Matching begins conservatively with explainable normalized exact signals. Fuzzy enrichment and automatic merging remain deferred.
- Existing organization candidates never prove representation or grant membership/ownership.
- Corporate hierarchy is control-bearing only when the user already manages the parent.
- Independent franchise/brand relationships do not share memberships, private contacts, redemption data, financial data, or administration.
- Organization creation is atomic.
- `created_by` is provenance, not permanent authorization; active membership governs ongoing edit authority.
- Membership revocation is retained as an auditable `revoked` record.

## Known limitations / validation debt

These are not Checkpoint 1 product blockers but must remain visible:

- No dedicated administrator request-resolution/duplicate-review UI exists yet; this is intentionally deferred to the approved later admin slice.
- Matching is exact-signal only; fuzzy matching/external enrichment is deferred.
- A clean local `supabase db reset` plus the committed Phase 2 pgTAP suite should still be rerun in a Docker-enabled environment when available.
- The authenticated Phase 2 Playwright flow should still be rerun against the seeded local Supabase environment when available.
- These deferred environment validations must be cleared no later than Phase 2 final hardening/acceptance.
