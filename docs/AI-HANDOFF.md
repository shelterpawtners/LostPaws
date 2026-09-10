# AI Handoff

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Post-Lost-Lands-MVP data architecture expansion
CURRENT_CHECKPOINT: Data Architecture Slice 1 / Issue #49 — multi-photo Pet Passport + Guardian activity timeline
NEXT_CHECKPOINT: Issue #51 — Guardian Deal Moments tied to claim/redemption activity
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: HOSTED_PREVIEW_AND_LOCAL_HEAD

## Active task

Issue #49 — **Data Architecture Slice 1: multi-photo Pet Passport + Guardian activity timeline**

Branch: `data-architecture/pet-media-guardian-feed`
PR: #50
Stable preview: `https://lost-paws-git-data-architecture-p-046c08-jims-projects-acec6bcb.vercel.app/`

Owner approved this direction on 2026-09-10 and subsequently set a firm product-storage constraint: a Pet Passport may keep **up to five active photos per pet**. Guardians should later be encouraged to post separate Deal Moment photos of a pet receiving/redeeming/using an offer; those activity photos must not consume Passport-gallery slots.

Current implementation includes the post-DBQA security correction that prevents the five-photo trigger from disclosing another pet's media-count state before RLS denies an unauthorized write. Persona QA explicitly includes `e2e/guardian-pet-media.spec.ts` so a gate-only success cannot be mistaken for five-photo browser acceptance.

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

- `20260910162500_data_architecture_pet_media_guardian_feed.sql` passed full local Database QA and is applied to shared dev.
- `20260910163500_limit_active_pet_photos.sql` also passed complete local Supabase reset/seed + pgTAP/RLS and is now applied successfully to shared dev.
- The five-photo trigger, archive/remove RPC, and Guardian-owned storage delete policy are therefore available to the hosted preview.

## Pre-acceptance proof

The reconciled branch ancestry passed substantive CI and database proof before promotion to acceptance:

- CI lint, shell lint, unit tests, and production build: green.
- Database QA: complete local Supabase startup, reset, seed, migration replay, and pgTAP/RLS: green.
- Dependency Review: green.
- Merge Gate: green.
- The earlier database failure was fixed at the root by preserving RLS denial before photo-cap feedback; no assertion or authorization rule was weakened.

## Next slice already captured

Issue #51 — **Guardian Deal Moments: redemption photo posts in activity timeline**.

First bounded release: one optional, replaceable image plus short caption per claim; private by default; optimized before upload; linked to the claim/redemption timeline; independent of the five Passport-photo slots; no effect on whether redemption succeeds. Meta sharing/import and broad public-feed behavior remain later work.

## Existing launch gate preserved

The previously completed LL-1 through LL-6 engineering remains accepted. External provider work is still separately pending: Resend/auth subdomain + SMTP, hosted Supabase Auth settings, Google OAuth, Meta/Facebook live credentials/testing, external inbox acceptance, owner review of draft Terms/Privacy, and separately authorized final `shelterpawtners.com` web-domain cutover.

This data-architecture work does not authorize any paid upgrade, production web-domain cutover, Microsoft 365 mail DNS change, OD-003/OD-004 decision, destructive production-data operation, or final legal publication.

## Acceptance policy

1. Execute current-head Persona QA including `e2e/guardian-pet-media.spec.ts` and claim→redeem timeline assertions.
2. Execute Hosted QA against the stable PR #50 preview and confirm the current feature build is reachable.
3. Require CI, Database QA, Persona QA, Hosted QA, Dependency Review, and Merge Gate green on the final head.
4. Remove the temporary no-op preview-build marker before merge.
5. Merge PR #50 under standing owner authorization only after all required final-head gates are green.
6. Close Issue #49 and continue directly into Issue #51.

## Next safe action

Run full current-head browser acceptance, remove the temporary preview marker, reverify the final head, merge #50 if green, then start Issue #51 without waiting for another routine approval.
