# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Phase 3 — Lost Lands MVP
CURRENT_CHECKPOINT: LL-5 / Issue #41 — Meta social login
NEXT_CHECKPOINT: LL-6 — final regression, mobile/browser acceptance, launch readiness, and cutover prep
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: cdf827fc255bf446a9eb61bbb647ce7d1d03f2da
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: MAIN

## Active task

Issue #41 — **LL-5: Meta social login — Facebook + Instagram-safe path**

Agent: ChatGPT / GitHub operator

Branch: `phase3/meta-social-login`

## Owner authorization

The owner has authorized autonomous continuation through the Lost Lands MVP and standing merge authorization for green engineering PRs until revoked. After a completed or externally blocked slice, immediately advance to the next authorized independent slice.

Protected gates remain: no paid upgrades, no destructive production-data changes, no Microsoft 365 mail DNS changes, no OD-003 customer-facing verified-savings rule invention, no OD-004 money movement/settlement decisions, no publication of final unreviewed Terms/Privacy, and no final `shelterpawtners.com` production web-domain DNS/custom-domain cutover.

## Completed launch slices

- LL-1 Guardian Digital Pet Passport merged via PR #37 at `0ae4b4d86f8f1083343d8e23357d64268ccce06c`.
- LL-2 Premium Marketplace merged via PR #42 at `08bd137ea79b951e540b3f0c2909a4ea5adc82fc`.
- LL-3 Shelter adoption verification merged via PR #43 at `33447725649cc91cfeb1e388b06092e086558321` after full required acceptance.
- LL-4 provider-independent production Auth/email readiness merged via PR #44 at `cdf827fc255bf446a9eb61bbb647ce7d1d03f2da` after CI, Hosted QA, Database QA, Persona QA, Dependency Review, and Merge Gate all passed. Live Resend SMTP, hosted Auth URL/provider configuration, and inbox click-through remain an external-console prerequisite documented in `docs/LL4-AUTH-EMAIL-READINESS.md`.

## LL-5 verified platform facts

Current provider documentation was checked on 2026-09-10.

- Supabase has a first-class Facebook Auth provider using `signInWithOAuth({ provider: "facebook" })`; the standard flow requires usable email permission.
- Supabase does not have Instagram as a built-in Auth provider, though current Supabase supports custom OAuth2/OIDC providers.
- Meta's current Instagram API with Instagram Login is designed for Instagram professional accounts (Business/Creator), not universal consumer Instagram accounts. Its current base scope is `instagram_business_basic`.
- The retired Instagram Basic Display API must not be used.

Product-safe MVP decision under Issue #41: ship Facebook as the truthful Meta social-login path; do not advertise a universal Instagram login. Preserve Instagram profile/handle as optional profile data. A future professional-account Instagram connection may be designed for PetBiz/RAVE use cases if needed.

## LL-5 work completed on active branch

- Added `docs/LL5-META-SOCIAL-AUTH.md` with the verified Facebook/Instagram capability contract, minimal permissions, external prerequisites, and acceptance checklist.
- Added `VITE_FACEBOOK_AUTH_ENABLED=false` to `.env.example`.
- Added `facebookAuthEnabled` feature-flag export to `src/lib/supabase.ts` without enabling any unconfigured provider or exposing secrets.

## Security review note

A current Supabase security-advisor pass reports the existing private audit/token tables as RLS-with-no-policy and several established public/authenticated `SECURITY DEFINER` RPCs. The private-table result matches the intentionally locked private schema design. The RPC warnings require contract-specific review before any change; do not mechanically revoke or convert them because they back existing tested Marketplace/onboarding operations. Leaked-password protection is also reported disabled, but current Supabase documentation marks that feature Pro-only and paid upgrades are prohibited for this MVP.

## Current external capability boundary

Live LL-4 and LL-5 provider acceptance requires external console/browser access not exposed by the current connectors: Resend account/DNS/SMTP setup, Supabase hosted Auth configuration writes, Google provider credentials, and Meta developer app/provider credentials.

## Next safe action

Open the LL-5 preparation PR and run normal acceptance. Continue implementation only where it can be safely integrated without secrets; do not create a misleading Instagram button. If Facebook UI integration cannot be completed with the available repository-editing surface, keep the feature flag disabled, document the exact remaining wiring step, and move into LL-6 independent regression/release-readiness work rather than idling.
