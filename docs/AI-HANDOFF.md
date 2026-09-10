# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Post-Lost-Lands-MVP data architecture expansion
CURRENT_CHECKPOINT: Data Architecture Slice 1 / Issue #49 — multi-photo Pet Passport + Guardian activity timeline
NEXT_CHECKPOINT: Acceptance for Issue #49, then continue approved progressive persona/Passport schema planning
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: LOCAL_HEAD

## Active task

Issue #49 — **Data Architecture Slice 1: multi-photo Pet Passport + Guardian activity timeline**

Branch: `data-architecture/pet-media-guardian-feed`

Owner approved this direction on 2026-09-10 after the expanded persona/Passport data-planning review.

## Approved scope

- Add normalized one-to-many pet media rather than expanding the legacy single-photo columns.
- Keep pet media private by default, preserve active-guardianship read authority, and require active-primary Guardian authority to manage media.
- Support multiple JPEG/PNG/WebP uploads, a deterministic primary image, and explicit ordering in the Guardian Passport UI.
- Retain source-system, external-media, permalink, provenance, capture/import timestamp, and visibility fields so future approved Meta/Facebook/Instagram and shelter/provider imports do not require another photo model.
- Add a private Guardian activity timeline to the Guardian profile/dashboard.
- Derive offer claim status directly from canonical `offer_claims` + `redemptions`; do not duplicate financial/economic truth into a social-feed ledger.
- Show truthful Pending/Redeemed/Reversed/Disputed/Cancelled/Expired states but no customer-facing savings amount while OD-003 remains unresolved.
- Protect the new behavior with pgTAP/RLS plus Playwright multi-photo and claim→redeem timeline assertions.

## Existing launch gate preserved

The previously completed LL-1 through LL-6 engineering remains accepted. External provider work is still separately pending: Resend/auth subdomain + SMTP, hosted Supabase Auth settings, Google OAuth, Meta/Facebook live credentials/testing, external inbox acceptance, owner review of draft Terms/Privacy, and separately authorized final `shelterpawtners.com` web-domain cutover.

This data-architecture slice does not authorize any paid upgrade, production web-domain cutover, Microsoft 365 mail DNS change, OD-003/OD-004 decision, destructive production-data operation, or final legal publication.

## Acceptance policy

1. Open the bounded Issue #49 PR from this branch.
2. Let CI classify/run before forcing acceptance.
3. Database QA must perform local Supabase reset/migration replay + the new pgTAP test before the migration is applied to shared dev.
4. Fix deterministic failures without weakening RLS or assertions.
5. When implementation is stable, move this handoff to `READY_FOR_ACCEPTANCE` so required Persona/Hosted/Admin gates execute.
6. Apply the migration to shared dev only after local Database QA is green; verify policies/functions after apply.
7. Merge under standing owner authorization only after the required current-head gates are green.

## Next safe action

Open the Issue #49 PR and run the first CI/Database classification cycle. Continue automatically on any deterministic defect.
