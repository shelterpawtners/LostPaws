# Phase 2 Checkpoint 1 — QA Review

**Result:** Conditional pass — bounded defects were corrected. Checkpoint 2 remains inactive pending product acceptance.

## Findings and disposition

| Priority | Finding                                                                                                                                                                | Disposition                                                                                                                                                                                            |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| High     | Browser onboarding wrote an organization, membership, locations, relationship, and draft outcome in separate requests. A mid-flow failure could leave incomplete data. | Fixed with `public.create_partner_organization`, an RLS-respecting atomic transaction; the UI now calls it once and disables repeat submission.                                                        |
| High     | `created_by` could remain an organization-edit authority after a membership was revoked.                                                                               | Fixed: organization editing now requires active owner/administrator membership. Initial owner bootstrap is limited to a previously uninitialized organization and uses a non-recursive private helper. |
| High     | The candidate-match security-definer RPC remained executable by the anonymous role through a default Supabase grant.                                                   | Fixed: anonymous and PUBLIC execution are explicitly revoked; only `authenticated` retains execution.                                                                                                  |
| Medium   | `src/main.tsx` contains a large Partner onboarding component.                                                                                                          | Accepted for this bounded checkpoint; no behavior-changing refactor during QA. Extract the flow and API adapter before Checkpoint 2 materially expands Partner UI.                                     |
| Low      | Local pgTAP and authenticated Playwright execution cannot run in this environment because Docker/Supabase CLI and local publishable-key configuration are unavailable. | Blocked externally; strengthened suites are committed and Phase 1's completed local validation remains recorded.                                                                                       |

## Required-review evidence

| Area                                     | Result                          | Evidence                                                                                                                                                                   |
| ---------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Draft privacy and candidate dismissals   | Code review pass                | Own-row RLS and user-scoped dismissal policies in `20260907100000_phase_2_partner_organization_foundation.sql`.                                                            |
| Candidate privacy                        | Pass on schema inspection       | `partner_organization_candidates` returns public identifying context and matching reasons only; anonymous execution is revoked and only `authenticated` retains execution. |
| Requests and duplicate review            | Code review pass                | Requests are pending records, not memberships; duplicate cases are platform-only and audited.                                                                              |
| Parent, franchise, and sibling isolation | Code review pass                | Parent assignment uses manager authority; franchise links are pending relationships without target membership.                                                             |
| Audit protection                         | Code review pass                | Private append-only audit trigger and Phase 2 pgTAP assertion.                                                                                                             |
| Partial failure / repeat submit          | Pass on development transaction | Atomic RPC created the organization, owner membership, and two locations together; UI disables repeat submission.                                                          |
| Revoked creator control                  | Pass on schema inspection       | Effective `org_edit` policy uses `private.can_manage_org`; membership bootstrap is non-recursive and limited to the first owner.                                           |
| Mobile and accessibility                 | Code review pass; E2E blocked   | Responsive form structure, semantic labels, live status, and keyboard controls inspected; Playwright case skips without local Supabase credentials.                        |
| Phase 1 regression                       | Pass                            | `npm run check` passed all nine unit tests; production build passed.                                                                                                       |

## Validation status

- **PASS:** `npm run check` — Prettier, TypeScript, and 9 unit tests.
- **PASS:** `npm run build` — Vite production build.
- **PASS:** development-project transaction — atomic organization creation produced one owner membership and two locations, then rolled back.
- **BLOCKED:** `supabase db reset` and pgTAP execution — no Docker or Supabase CLI in this Work environment.
- **BLOCKED:** authenticated Phase 2 Playwright path — `e2e/phase-2-partner-onboarding.spec.ts` is present but skipped without local Supabase URL and publishable key.

## Remaining limits

- No dedicated administrator request-resolution or duplicate-review UI is included in Checkpoint 1.
- No public Partner profiles, offers, redemptions, savings, or giving work was started.
- Membership revocation is represented by the retained `revoked` membership state; routine revocation must not delete that record.
