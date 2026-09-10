# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Phase 3 — Lost Lands MVP
CURRENT_CHECKPOINT: LL-4 / Issue #40 — production auth/email + Google OAuth readiness
NEXT_CHECKPOINT: LL-5 / Issue #41 — Meta social login
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: 33447725649cc91cfeb1e388b06092e086558321
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: MAIN

## Active task

Issue #40 — **LL-4: Production auth email + Google OAuth readiness**

Agent: ChatGPT / GitHub operator

Branch: `phase3/auth-email-readiness`

## Owner authorization

The owner has authorized autonomous continuation through the Lost Lands MVP and standing merge authorization for green engineering PRs until revoked. Do not wait for a later controller when safe work can continue; after a completed or externally blocked slice, immediately advance to the next authorized independent slice.

Protected gates remain: no paid upgrades, no destructive production-data changes, no Microsoft 365 mail DNS changes, no OD-003 customer-facing verified-savings rule invention, no OD-004 money movement/settlement decisions, no publication of final unreviewed Terms/Privacy, and no final `shelterpawtners.com` production web-domain DNS/custom-domain cutover.

## Completed launch slices

- LL-1 Guardian Digital Pet Passport merged via PR #37 at `0ae4b4d86f8f1083343d8e23357d64268ccce06c` after full required acceptance.
- LL-2 Premium Marketplace merged via PR #42 at `08bd137ea79b951e540b3f0c2909a4ea5adc82fc` after full required acceptance.
- LL-3 Shelter adoption verification merged via PR #43 at `33447725649cc91cfeb1e388b06092e086558321` after CI, Hosted QA, Database QA, Persona QA, Dependency Review, and Merge Gate all passed on exact head `7d36b54a6e36b0e31bbe5d84b283542278a5fd4b`.

## LL-4 verified platform facts

Current Supabase documentation was checked before implementation.

- Production Auth email should use custom SMTP; Resend is explicitly supported.
- A dedicated auth sending subdomain is recommended, matching the approved `auth.shelterpawtners.com` / `no-reply@auth.shelterpawtners.com` design.
- Confirmation/recovery/OAuth redirects are constrained by the hosted Auth Site URL and Redirect URL allowlist.
- Email tracking/link rewriting should remain disabled for Auth mail because it can break Supabase confirmation URLs.
- Supabase currently documents leaked-password protection as Pro-only. The owner forbids paid-plan upgrades, so that feature is intentionally deferred rather than purchased.

## LL-4 work completed on active branch

- Added `docs/LL4-AUTH-EMAIL-READINESS.md` with the production URL, Resend SMTP, Google OAuth, security, acceptance, and external-console contract.
- Added minimal authentication-only reference templates:
  - `supabase/templates/confirmation.html`
  - `supabase/templates/recovery.html`
- Confirmed the existing application already has fixed same-origin redirect paths for signup, Google OAuth, and password recovery, plus `/forgot-password` and `/reset-password` surfaces.

## Current external capability boundary

The connected Supabase tool exposes project/database/functions operations but not hosted Auth URL/SMTP/provider configuration writes. No Resend plugin is currently available. Therefore Resend account/domain creation, DNS values, SMTP credential entry, hosted Auth URL/provider configuration, and real inbox click-through validation require an external provider/browser surface unless a compatible connected capability becomes available.

This external boundary must **not** stall independent LL-5/LL-6 engineering preparation.

## Next safe action

Open the LL-4 preparation PR, run normal CI/Hosted/Persona/Database/Merge Gate acceptance, and merge when green. Continue any independent auth regression/test/documentation improvements that can be made without provider secrets. If provider console access remains unavailable, record the exact external actions from `docs/LL4-AUTH-EMAIL-READINESS.md` and immediately start LL-5 Meta social-login implementation/preparation instead of waiting.
