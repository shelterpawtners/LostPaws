# AI Handoff

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Post-Lost-Lands-MVP data architecture expansion
CURRENT_CHECKPOINT: Data Architecture Slice 2 / Issue #51 — Guardian Deal Moments
NEXT_CHECKPOINT: Issue #51 acceptance and merge
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: LOCAL_HEAD_AND_PR_PREVIEW

## Completed predecessor

Issue #49 / PR #50 — **multi-photo Pet Passport + Guardian activity timeline** is complete and merged to `main` at `3f346cbc2a16f9c68d76a644fb4c7f18e0f125f9` after CI, Database QA, Persona QA, Hosted QA, Dependency Review, and Merge Gate all passed on final head `f3464c532650e00b47c3ac09a60464919b6c4372`.

The shipped Passport rule is a hard maximum of **five active Passport photos per pet**, with safe remove/replace storage cleanup.

## Active task

Issue #51 — **Guardian Deal Moments: redemption photo posts in activity timeline**

Branch: `data-architecture/deal-moments`
PR: #52

### Product contract

- Offer/redemption photos are activity content, not Passport-gallery slots.
- First release supports one optional active Deal Moment image per claim plus a short optional caption.
- Posting is never required for claim or redemption success.
- CTA language encourages authentic pet/use content such as “Show us your pet enjoying the deal.”
- Deal Moments are private to the Guardian who owns the claim in this release.
- Pending/Redeemed/Reversed/etc. continues to come from canonical claim/redemption records.
- No OD-003 savings totals or invented verified-savings language.

### Implemented architecture and UX

- `pet_media` now has explicit `passport` vs `deal_moment` context and optional claim linkage.
- Existing/default media remains `passport`; Deal Moments do not count toward the five-photo Passport cap.
- One active Deal Moment per claim is enforced at the database boundary.
- Deal Moment claim/pet ownership is validated without disclosing another Guardian's claim state before RLS denial.
- Passport primary/reorder/archive behavior is context-aware and excludes Deal Moments.
- Deal Moments use a separate private `deal-moments` bucket with Guardian/claim-scoped read, insert, and delete policies.
- `upsert_deal_moment` atomically archives prior metadata and returns the old object path for storage cleanup.
- Guardian activity timeline now includes an optional Deal Moment editor for pet-linked claims.
- Browser client converts JPEG/PNG/WebP source images to WebP, limits the longest edge to 1600px, and requires the optimized object to fit the 1 MB private bucket cap.
- Replace and remove flows clean up Guardian-owned object bytes; a cleanup failure never restores public access or duplicates active metadata.
- Dedicated pgTAP coverage verifies private ownership, storage policy separation, one-active-image behavior, replacement/archive provenance, and independence from the five Passport-photo slots.
- Dedicated Playwright coverage exercises claim -> Pending timeline -> add/replace Deal Moment -> Partner confirmation -> Redeemed timeline with moment preserved -> removal.
- Persona QA explicitly includes the Deal Moment browser regression.

## Shared-dev policy

Do not apply the Issue #51 migration to shared dev until current-head Database QA/reset/pgTAP is green. Once green, apply the additive migration and verify bucket/policies/index/RPC behavior before final hosted acceptance/merge.

## Acceptance

1. Require current-head CI and Database QA green without weakening assertions or RLS.
2. After DB proof is green, apply the additive Deal Moment migration to shared dev and verify its schema/storage boundary.
3. Require full Persona QA to execute the Deal Moment browser regression and existing auth/Passport/redemption/Admin regressions.
4. Require Hosted QA, Dependency Review, and Merge Gate green on the final head.
5. Fix deterministic failures at the root and rerun affected gates.
6. Mark PR #52 ready and merge under standing owner authorization only when all required final-head gates are green.
7. Close Issue #51 and continue to the next independently authorized work without reopening LL-1 through LL-6 absent regression evidence.

## Existing external launch gates preserved

LL-1 through LL-6 remain accepted. External provider/cutover work remains separately bounded: Resend/auth-subdomain SMTP and DNS, hosted Supabase Auth settings, Google OAuth credentials, Meta/Facebook live credentials/testing, external inbox acceptance, owner review of draft Terms/Privacy, and the separately authorized final `shelterpawtners.com` web-domain cutover.

This slice does not authorize paid upgrades, the final production web-domain cutover, Microsoft 365 mail DNS changes, OD-003 customer-facing verified-savings rules, OD-004 settlement/money movement, destructive production-data cleanup, or final legal publication.

## Next safe action

Run the full final-head acceptance stack for PR #52. If Database QA is green, apply and verify the additive migration in shared dev, then complete Persona/Hosted acceptance and merge #52 if all gates remain green. Continue autonomously afterward until the next genuine protected gate.
