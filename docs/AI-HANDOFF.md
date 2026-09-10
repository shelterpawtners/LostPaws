# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Post-Lost-Lands-MVP data architecture expansion
CURRENT_CHECKPOINT: Data Architecture Slice 2 / Issue #51 — Guardian Deal Moments
NEXT_CHECKPOINT: Issue #51 acceptance and merge
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: LOCAL_HEAD

## Completed predecessor

Issue #49 / PR #50 — **multi-photo Pet Passport + Guardian activity timeline** is complete and merged to `main` at `3f346cbc2a16f9c68d76a644fb4c7f18e0f125f9` after CI, Database QA, Persona QA, Hosted QA, Dependency Review, and Merge Gate all passed on final head `f3464c532650e00b47c3ac09a60464919b6c4372`.

The shipped Passport rule is a hard maximum of **five active Passport photos per pet**, with safe remove/replace storage cleanup. The stable accepted test branch remains available for owner testing at `https://lost-paws-git-data-architecture-p-046c08-jims-projects-acec6bcb.vercel.app/`.

## Active task

Issue #51 — **Guardian Deal Moments: redemption photo posts in activity timeline**

Branch: `data-architecture/deal-moments`

### Product contract

- Offer/redemption photos are activity content, not Passport-gallery slots.
- First release supports one optional active Deal Moment image per claim plus a short optional caption.
- Posting is never required for claim or redemption success.
- CTA language should encourage authentic pet/use content such as “Show us your pet enjoying the deal.”
- Deal Moments are private to the Guardian who owns the claim in this release.
- Pending/Redeemed/Reversed/etc. continues to come from canonical claim/redemption records.
- No OD-003 savings totals or invented verified-savings language.

### Architecture decisions for this slice

- Extend `pet_media` rather than create a second unrelated media store.
- Add an explicit media context so `passport` and `deal_moment` records have different authorization/counting semantics.
- Existing pet media backfills/defaults to `passport`.
- Add optional claim linkage for Deal Moments; require Deal Moment claim ownership and matching pet association.
- Keep the five-photo trigger scoped only to active `passport` images.
- Keep Passport gallery/select/reorder/primary operations scoped only to `passport` media.
- One active Deal Moment per claim is enforced at the database boundary; replacement archives/removes the previous object rather than accumulating active images.
- Use a separate private `deal-moments` storage bucket so active co-guardianship access to Passport photos cannot expose another Guardian’s private Deal Moment bytes.
- Deal Moment object paths are Guardian-owned and claim-scoped; read/upload/delete policies verify claim ownership.
- Client-optimize Deal Moment uploads to WebP, max 1600px longest edge and approximately <=1 MB where practical before upload.

## Shared-dev policy

Do not apply the Issue #51 DDL migration to shared dev until the new local Database QA/reset/pgTAP tests are green. Once green, apply the additive migration and verify bucket/policies/index/RPC behavior before hosted acceptance.

## Acceptance

1. DB/RLS proof: unrelated Guardian cannot read/create/update/remove another Guardian’s Deal Moment.
2. DB proof: one active Deal Moment per claim and Deal Moments do not consume the five Passport-photo slots.
3. Storage proof: `deal-moments` remains private and owner/claim scoped.
4. Browser regression: Guardian claim -> timeline Pending -> add/replace Deal Moment -> Partner confirms -> same item Redeemed with moment preserved.
5. Remove operation archives metadata and cleans up Guardian-owned storage bytes.
6. Existing Passport gallery, claim/redemption, Marketplace, auth, Admin, Persona, and Hosted regressions remain green.
7. Mobile layout and accessibility remain acceptable.

## Existing external gates preserved

Still owner/external gated: paid upgrades, final `shelterpawtners.com` web-domain cutover, final Terms/Privacy publication, Microsoft 365 mail DNS changes, OD-003 customer-facing verified-savings rules, OD-004 settlement/money movement, destructive production-data cleanup, and live Meta credentials/import/share behavior.

## Next safe action

Implement the additive Deal Moment schema/RLS/storage boundary and pgTAP proof first; run local Database QA; then wire the Guardian timeline UI and browser regression. Continue autonomously until a genuine remaining owner/external gate.
