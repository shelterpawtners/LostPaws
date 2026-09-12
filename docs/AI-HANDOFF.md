# AI Handoff

STATUS: BLOCKED_ON_OWNER_CONSOLE_ACCESS_FOR_DOMAIN_AUTH_CUTOVER
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: ShelterPawtners.com owner-authorized cutover; release/deployment verified, awaiting account-controlled domain/auth configuration
NEXT_CHECKPOINT: Attach apex/www in Vercel, change only SiteGround web DNS, then configure Supabase/Google and smoke-test the apex domain
OWNER_DECISION_REQUIRED: YES_FOR_ACCOUNT_CONSOLE_ACCESS_OR_AUTHENTICATED_SESSION
SAFE_TO_CONTINUE: NO
ACCEPTED_PRODUCT_SHA: 45a87c3ff1bac1d3f35172386e8a4c3f5fb54d06
ACCEPTANCE_RUNTIME: GITHUB_PAGES_PUBLIC_RELEASE_MATRIX_GREEN_AND_VERCEL_PRODUCTION_READY

## Domain cutover attempt — 2026-09-12

The owner authorized the final `shelterpawtners.com` cutover. The release check is complete:

- `origin/main`: `cf6475db44a1f005369c9657b3ebd21b46b53774`.
- Latest successful Vercel production deployment: `dpl_F3dLB7Fd6jUWv582xjbL1fCqWSd6` (`READY`), main SHA `7de02351227f793de7ad7fcc0b4e5361f5844cdc`.
- The three commits between that successful deployment and current main alter only GitHub Pages workflows and this cutover runbook, not the deployed client bundle.
- No domain, SiteGround DNS, Microsoft 365 mail DNS, Supabase Auth URL, Google OAuth, Facebook/Instagram, legal route, or production data setting changed during the attempt.

The immediate blocker is authenticated administrator access: the connected Vercel capability is read/deployment-only; the locally available Vercel CLI is logged out; the Supabase capability has no hosted Auth URL Configuration write; and SiteGround/Google Cloud have no connected administrator integration. Do not guess Vercel DNS records or change SiteGround before the Vercel domains are actually attached. Resume from `docs/CUTOVER-SHELTERPAWTNERS-COM.md` when an authorized console session is available.

## Read first

- `docs/CURRENT-WORK.md`
- `docs/AI-OPERATING-PROTOCOL.md`
- this file
- active GitHub issues before creating new work

GitHub `main` is the only release-candidate source of truth. Do not restart branch reconciliation, wholesale-merge historical branches, or reopen accepted Lost Lands slices without regression evidence.

## Current public product direction

### LostPaws + RAVE Shelter

Issue #100 / PR #102 are the controlling owner direction.

There is now one coherent public mission experience:

- `/rave` → unified RAVE Shelter mission page;
- `/lostpaws` → same mission page, with LostPaws as the music-community activation;
- `/rave-shelter` → canonical redirect to `/rave`;
- Home → one LostPaws × RAVE Shelter story plus RAVE Marketplace path;
- Raver/Guardian → RAVE Marketplace and optional Guardian registration;
- Vendor/PetBiz → RAVE Vendor registration;
- Shelter/Rescue → Shelter registration.

The old generic LostPaws FoundationPage, standalone `public/lostpaws.html`, and Vercel LostPaws static rewrites are retired. Issue #58, Issue #96, and PR #97 are superseded. Do not revive the separate-page architecture absent a new owner decision or regression evidence.

Core message direction:

- Music + community + shelter pets.
- Shop useful products, merch, and services from participating RAVE Shelter partners.
- Partner participation helps create shelter support.
- Future giving tools may let Guardians pass eligible savings forward.
- Do not imply a live tax-deductible donation workflow where it does not yet exist.

Approved brand artwork remains locked. Do not generatively redraw the owner-approved LostPaws hero or RAVE Shelter logo in product code.

## Auth/email state

Completed and accepted:

- Resend free tier;
- `auth.shelterpawtners.com` transactional-email DNS;
- Microsoft 365 inbound/human-mail DNS intentionally unchanged;
- Supabase custom SMTP `ShelterPawtners <noreply@auth.shelterpawtners.com>`;
- hosted Supabase Site URL;
- real Guardian signup/confirmation through Supabase + Resend.

### Password recovery

PR #94 completed source/test readiness:

- forgot-password entry;
- base-aware reset redirect;
- `/reset-password`;
- browser-scoped `PASSWORD_RECOVERY` session gating;
- password update;
- sign-out before returning to login;
- safe invalid/expired/reused/missing-session messaging.

Still required: real hosted lifecycle acceptance using an actual inbox/account. Do not claim this gate is complete from source tests alone.

### Google OAuth

Issue #99 / PR #104 are complete in source.

`src/lib/auth-oauth.ts` provides deployment-base-aware return URLs. Google login/signup now work correctly for both future root hosting and GitHub Pages `/LostPaws/` routing without hardcoded deployment hostnames.

Still required: provider-console credentials/settings and live hosted acceptance.

### Facebook / Meta OAuth

Issue #98 / PR #106 are complete in source.

- `VITE_FACEBOOK_AUTH_ENABLED` gates the UI;
- Facebook appears beside Google on Guardian, Shelter, PetBiz, RAVE Vendor signup and on sign-in;
- provider is Supabase `facebook`;
- signup preserves persona and uses the same base-aware return helper;
- initiation failure text is generic/user-safe;
- no universal Instagram login is advertised.

Still required: Meta app/provider configuration and live acceptance. Do not request broad social permissions merely to authenticate. Do not claim Instagram consumer login exists.

Supabase external-provider callback:

`https://jukmlmryykcnjtpblbja.supabase.co/auth/v1/callback`

## Support OS / Issue #56

Supabase is the operational support source of truth. Raw support content/PII must never auto-mirror to GitHub.

Accepted foundation includes:

- authenticated Help & feedback under RLS;
- privacy-safe duplicate/triage/classification/digest/delivery contract;
- human escalation for privacy/safety/P0/P1/human-review-required cases;
- release context;
- delivery timing boundaries and aging/escalation regression;
- reviewed private delivery ledger and service-role-only claim/complete RPCs;
- provider-neutral server-side delivery worker source.

Important deployed-state correction: the reviewed PR #95 database migration has now been applied to shared dev. Anon/authenticated cannot execute the privileged delivery RPCs; `service_role` can.

Do not deploy the Support OS delivery Edge Function until an approved owner-alert destination and managed `SUPPORT_DELIVERY_WEBHOOK_URL` / `SUPPORT_DELIVERY_INVOKE_SECRET` are available. Do not invent or hardcode a transport, and do not enable ad hoc `pg_cron` / `pg_net` scheduling.

## Hosted acceptance

### GitHub Pages

Primary low-cost release-candidate acceptance environment:

`https://shelterpawtners.github.io/LostPaws/`

The public release matrix is green across the unified RAVE/LostPaws flow and the latest auth source changes.

### Vercel

The earlier Hobby-capacity freshness blocker is cleared. Vercel production is READY on the accepted product SHA.

- Accepted SHA: `45a87c3ff1bac1d3f35172386e8a4c3f5fb54d06`
- Deployment: `dpl_B4uVrWYcdc9vDpRYwa1unyzzUgxw`
- State: READY
- Target: production
- Stable alias: `https://lost-paws-one.vercel.app`

Continue minimizing unnecessary preview deployments. Do not upgrade solely for capacity.

## Remaining launch gates

1. Real password-recovery lifecycle acceptance.
2. Microsoft 365 human mailbox send/receive verification.
3. Support OS approved alert destination + managed secrets + reviewed Edge Function/runtime deployment.
4. Google provider-console setup + live login/signup/persona acceptance.
5. Facebook/Meta provider-console setup + live login/signup/persona acceptance.
6. Verify social/email auth does not create duplicate profiles/organizations and preserves persona continuity.
7. Owner/legal review of draft Terms/Privacy.
8. Final `shelterpawtners.com` production web-domain/custom-domain cutover only after separate owner authorization.

## Operating guidance

Prefer small, atomic changes with a clear completion boundary. Do not spend Codex/Work capacity on issue reconciliation, documentation, ordinary source inspection, or small isolated fixes that can be completed through GitHub tools.

When a large `src/main.tsx` edit is needed and direct line patching is unavailable, the proven safe fallback is a **temporary branch-only deterministic patch script + GitHub Actions workflow** that:

1. applies only exact expected replacements;
2. runs formatting/check/type/tests/build;
3. commits only if all checks pass;
4. is deleted from the branch before opening/merging the real PR.

Do not leave temporary integration workflows/scripts on `main`.

## Guardrails

Never:

- purchase/upgrade paid services without owner approval;
- make destructive production-data changes;
- alter Microsoft 365 mail DNS;
- decide OD-003 or OD-004;
- weaken tests or RLS;
- expose secrets;
- publish final Terms/Privacy without owner review;
- perform final `shelterpawtners.com` DNS/custom-domain cutover without separate authorization;
- auto-close/fix support cases solely from AI suggestions;
- bypass privacy/P0/P1 human escalation;
- wholesale-merge historical branches or create another long-lived release/integration branch.
