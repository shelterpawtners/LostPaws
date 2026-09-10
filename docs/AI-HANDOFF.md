# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Post-Lost-Lands-MVP data architecture expansion
CURRENT_CHECKPOINT: Data Architecture Slice 1 / Issue #49 — multi-photo Pet Passport + Guardian activity timeline
NEXT_CHECKPOINT: Issue #51 — Guardian Deal Moments tied to claim/redemption activity
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: LOCAL_HEAD

## Active task

Issue #49 — **Data Architecture Slice 1: multi-photo Pet Passport + Guardian activity timeline**

Branch: `data-architecture/pet-media-guardian-feed`
PR: #50

Owner approved this direction on 2026-09-10 and subsequently set a firm product-storage constraint: a Pet Passport may keep **up to five active photos per pet**. Guardians should later be encouraged to post separate Deal Moment photos of a pet receiving/redeeming/using an offer; those activity photos must not consume Passport-gallery slots.

Current formatted feature ancestry includes `3d6cb3ed4f49fccf7a2dca524e6dc0302dbcddfb`; this handoff commit intentionally triggers a normal GitHub acceptance cycle after the self-deleting formatter commit.

## Approved scope

- Add normalized one-to-many pet media rather than expanding the legacy single-photo columns.
- Keep pet media private by default, preserve active-guardianship read authority, and require active-primary Guardian authority to manage media.
- Enforce a **database-level maximum of five active Passport images per pet**, so UI and future imports cannot bypass the storage constraint.
- Support JPEG/PNG/WebP upload, deterministic primary image, explicit ordering, and safe remove/replace behavior that archives metadata and removes Guardian-owned storage bytes.
- Retain source-system, external-media, permalink, provenance, capture/import timestamp, and visibility fields so future approved Meta/Facebook/Instagram and shelter/provider imports do not require another photo model.
- Add a private Guardian activity timeline to the Guardian profile/dashboard.
- Derive offer claim status directly from canonical `offer_claims` + `redemptions`; do not duplicate financial/economic truth into a social-feed ledger.
- Show truthful Pending/Redeemed/Reversed/Disputed/Cancelled/Expired states but no customer-facing savings amount while OD-003 remains unresolved.
- Protect the new behavior with pgTAP/RLS plus Playwright five-photo/replace and claim→redeem timeline assertions.

## Shared-dev state

- The foundational `20260910162500_data_architecture_pet_media_guardian_feed.sql` migration passed full local Database QA and has been applied successfully to shared dev.
- The follow-up `20260910163500_limit_active_pet_photos.sql` five-photo/storage-cleanup migration is **not yet applied to shared dev**. Apply it only after the current local Database QA/reset/pgTAP cycle is green.

## Next slice already captured

Issue #51 — **Guardian Deal Moments: redemption photo posts in activity timeline**.

First bounded release: one optional, replaceable image plus short caption per claim; private by default; optimized before upload; linked to the claim/redemption timeline; independent of the five Passport-photo slots; no effect on whether redemption succeeds. Meta sharing/import and broad public-feed behavior remain later work.

## Existing launch gate preserved

The previously completed LL-1 through LL-6 engineering remains accepted. External provider work is still separately pending: Resend/auth subdomain + SMTP, hosted Supabase Auth settings, Google OAuth, Meta/Facebook live credentials/testing, external inbox acceptance, owner review of draft Terms/Privacy, and separately authorized final `shelterpawtners.com` web-domain cutover.

This data-architecture work does not authorize any paid upgrade, production web-domain cutover, Microsoft 365 mail DNS change, OD-003/OD-004 decision, destructive production-data operation, or final legal publication.

## Acceptance policy

1. Run CI plus local Database QA against the current post-format head.
2. Database QA must complete Supabase start/reset/seed + pgTAP including the five-photo cap and RLS tests.
3. Fix deterministic failures without weakening RLS or assertions.
4. Only after local Database QA is green, apply the follow-up five-photo migration to shared dev and verify the trigger/RPC/storage policy.
5. Move this handoff to `READY_FOR_ACCEPTANCE` and execute the actual Persona/Hosted browser acceptance, including the five-photo remove/replace test and claim→redeem timeline assertion.
6. Merge PR #50 under standing owner authorization only after the required current-head gates are green.
7. Close Issue #49 and continue directly into Issue #51.

## Next safe action

Complete the current CI/Database cycle, apply and verify the five-photo follow-up migration on shared dev after local DB proof, then run full browser acceptance and merge #50 if green.
