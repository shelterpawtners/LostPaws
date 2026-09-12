# AI Handoff

STATUS: READY_FOR_REAL_AUTH_AND_PRODUCTION_ACCEPTANCE
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Issue #125 / PR #126 accepted; RAVE Shelter and LostPaws are now distinct public experiences and the full PR acceptance matrix is green
NEXT_CHECKPOINT: verify current production deployment, then complete real password-recovery/Google/mobile Guardian acceptance when a safe account/browser session is available
OWNER_DECISION_REQUIRED: YES_FOR_REAL_ACCOUNT_INTERACTION_AND_REMAINING_EXTERNAL_GATES
SAFE_TO_CONTINUE: YES
ACCEPTED_PRODUCT_SHA: bc14a3f6b839f4421781903c41d3c867f4bba848
ACCEPTANCE_RUNTIME: GITHUB_PAGES_PR_RELEASE_MATRIX_GREEN; VERCEL_PRODUCTION_FRESHNESS_REQUIRES_RECHECK_AFTER_HOBBY_RATE_LIMIT

## Read first

- `docs/CURRENT-WORK.md`
- `docs/AI-OPERATING-PROTOCOL.md`
- this file
- active GitHub issues before creating new work

GitHub `main` is the only release-candidate source of truth. Do not restart branch reconciliation, wholesale-merge historical branches, or reopen accepted Lost Lands slices without regression evidence.

## Current public product direction

### RAVE Shelter + LostPaws

Issue #125 / PR #126 are the controlling direction for the public campaign architecture. They explicitly supersede the earlier same-component requirement from Issue #100 / PR #102 because the repository recorded regression evidence and new owner direction.

- `/rave` → evergreen **RAVE Shelter** ecosystem/movement page.
- `/lostpaws` → distinct **LostPaws** music/festival-community activation page.
- LostPaws is explicitly the first RAVE Shelter activation, not the master brand.
- `/rave-shelter` → canonical redirect to `/rave`.
- Both experiences route into the shared RAVE Marketplace, Guardian, RAVE Vendor/PetBiz, and Shelter/Rescue ecosystem.
- LostPaws mobile hero uses the approved 16:9 artwork with safe containment rather than destructive cropping.
- Responsive acceptance covers 320/360/375/390/412/430px plus tablet portrait, and the broader GitHub Pages release matrix still covers mobile/tablet/desktop launch routes.
- Primary activation actions remain at least 44px touch targets.
- Strong non-affiliation wording remains in place.
- Do not imply festival affiliation/sponsorship, unsupported donation percentages, or live tax-deductibility.

The old generic LostPaws FoundationPage, standalone `public/lostpaws.html`, and old Vercel static rewrites remain retired. Issue #58, Issue #96, and PR #97 remain superseded history. Approved brand artwork is locked; do not generatively redraw the owner-approved LostPaws hero or RAVE Shelter logo in product code.

## Domain/runtime state

The owner previously completed the authorized web/auth domain configuration:

- Vercel validates `shelterpawtners.com` and `www.shelterpawtners.com`; apex is canonical.
- SiteGround web records were changed only to the exact Vercel-provided web records.
- Microsoft 365 mail DNS and Auth/Resend transactional-email DNS remain intentionally separate.
- Supabase Auth Site URL uses the apex and GitHub Pages remains allowed for rollback/testing.
- Google OAuth includes the apex origin and retains the Supabase callback.
- Facebook/Instagram remains disabled publicly until Meta acceptance.
- Privacy, Terms, and Data Deletion remain unpublished as final legal content.

PR #126 passed CI, Hosted QA, Persona QA, Database QA, Dependency Review, Merge Gate, and GitHub Pages MVP Acceptance before merge. A Vercel Hobby build-rate-limit status was attached to the PR, so do not claim Vercel production contains `bc14a3f6...` until a later READY production deployment is independently verified. Do not purchase/upgrade Vercel solely to clear capacity.

## Auth/email state

Completed and accepted prerequisites:

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

Still required: real hosted lifecycle acceptance with an actual inbox/account, including new-password login and Guardian persona/profile continuity. Do not claim this gate complete from source tests alone.

### Google OAuth

Issue #99 / PR #104 are complete in source. `src/lib/auth-oauth.ts` provides deployment-base-aware return URLs for apex hosting and GitHub Pages.

The apex Google origin/provider prerequisites were owner-configured previously. Still required: real hosted login/signup/logout/persona acceptance with an actual Google account and confirmation that return routing lands on the apex.

### Facebook / Meta OAuth

Issue #98 / PR #106 are complete in source.

- `VITE_FACEBOOK_AUTH_ENABLED` gates the UI;
- provider is Supabase `facebook`;
- signup preserves persona and uses the same base-aware return helper;
- initiation failure text is generic/user-safe;
- no universal Instagram consumer login is advertised.

Still required: supported Meta app/provider configuration and real account acceptance before enabling Facebook publicly. Do not request broad social permissions merely to authenticate.

Supabase external-provider callback:

`https://jukmlmryykcnjtpblbja.supabase.co/auth/v1/callback`

## Support OS / Issue #56

Supabase is the operational support source of truth. Raw support content/PII must never auto-mirror to GitHub.

Accepted foundation includes authenticated Help & feedback under RLS, privacy-safe triage/delivery contracts, human escalation for privacy/safety/P0/P1/human-review-required cases, release context, aging/escalation regression, a reviewed private delivery ledger, service-role-only claim/complete RPCs, and provider-neutral server-side delivery worker source.

The reviewed PR #95 migration is applied to shared dev. Anon/authenticated cannot execute the privileged delivery RPCs; `service_role` can.

Do not deploy the Support OS delivery Edge Function until an approved owner-alert destination and managed `SUPPORT_DELIVERY_WEBHOOK_URL` / `SUPPORT_DELIVERY_INVOKE_SECRET` are available. Do not invent/hardcode a transport and do not enable ad hoc `pg_cron` / `pg_net` scheduling.

## External tooling recheck

Current connected tooling still does **not** expose an actionable Resend console, hosted Supabase Auth provider-management surface, Google OAuth console, Meta/Facebook app console, or known authoritative SiteGround DNS manager. Cloudflare is discoverable as an installable plugin, but there is no evidence ShelterPawtners DNS is hosted there; do not install/touch it speculatively.

Vercel and Supabase project/database tooling are connected, but the exposed Vercel surface does not provide arbitrary production-domain/provider-console administration and the Supabase connector does not expose hosted Auth provider settings. Browser-automation skill documentation is installed, but the `agent-browser` CLI is not present in the current runtime, so it cannot be used here to substitute for a real authenticated provider/account session.

Recheck these surfaces on later controller runs because a newly installed connector may make an external gate actionable.

## Remaining launch gates

1. Real password-recovery lifecycle acceptance.
2. Microsoft 365 human mailbox send/receive verification.
3. Support OS approved alert destination + managed secrets + reviewed privileged runtime deployment.
4. Real hosted Google login/signup/logout/persona acceptance and apex return verification.
5. Meta/Facebook provider configuration + real login/signup/persona acceptance before public enablement.
6. Verify social/email auth does not create duplicate profiles/organizations and preserves persona continuity.
7. Owner/legal review of draft Terms/Privacy/Data Deletion; do not publish final versions without approval.
8. Verify a READY production deployment containing the accepted `main` SHA before declaring the production runtime current.

## Operating guidance

Prefer small atomic changes with a clear completion boundary. Do not spend Copilot/Codex capacity on issue reconciliation, documentation, ordinary source inspection, or small isolated fixes that GitHub tools can complete directly.

When a large `src/main.tsx` edit is unavoidable and direct patching is unavailable, a temporary branch-only deterministic patch workflow is allowed only if it validates exact replacements, runs checks, commits only on success, and is removed before the real PR merges. Do not leave temporary integration workflows/scripts on `main`.

## Guardrails

Never:

- purchase/upgrade paid services without owner approval;
- make destructive production-data changes;
- alter Microsoft 365 mail DNS;
- decide OD-003 or OD-004;
- weaken tests or RLS;
- expose secrets;
- publish final Terms/Privacy/Data Deletion without owner review;
- invent provider credentials or privileged transports;
- auto-close/fix support cases solely from AI suggestions;
- bypass privacy/P0/P1 human escalation;
- wholesale-merge historical branches or create another long-lived release/integration branch;
- reopen completed Lost Lands slices without regression evidence.
