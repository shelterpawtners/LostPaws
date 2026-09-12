# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

Lost Lands MVP LL-1 through LL-6 are **accepted** and must not be reopened without regression evidence.

`main` is the only release-candidate source of truth. Do not wholesale-merge historical branches.

Current accepted product/UI baseline after Issue #125 / PR #126:

`bc14a3f6b839f4421781903c41d3c867f4bba848`

Current verified public acceptance surface:

`https://shelterpawtners.github.io/LostPaws/`

The owner-completed `shelterpawtners.com` domain/auth cutover remains live: Vercel validates the apex and `www`, SiteGround web DNS uses Vercel's exact records, Supabase Auth uses the apex while GitHub Pages remains allowed for rollback, and Google OAuth includes the apex origin. Microsoft 365 and Auth/Resend DNS remain intentionally separate. The remaining auth launch checks require real account interaction rather than more source-only work.

Vercel production was previously READY on the pre-#126 accepted release. PR #126 produced a Vercel Hobby build-rate-limit status, so do not represent Vercel production as carrying #126 until a later READY production deployment is verified. Do not purchase or upgrade Vercel merely to clear that limit.

## Recent accepted launch work

### Distinct RAVE Shelter + LostPaws experiences

Issue #125 / PR #126 supersede the earlier same-page campaign decision because the repository recorded concrete regression evidence and new owner direction.

- `/rave` is the evergreen **RAVE Shelter** ecosystem/movement experience.
- `/lostpaws` is a distinct **LostPaws** activation page for music/festival communities.
- LostPaws is explicitly presented as the first RAVE Shelter activation, not the master brand.
- `/rave-shelter` continues to canonicalize to `/rave`.
- Both routes continue into the shared RAVE Marketplace, Guardian, RAVE Vendor/PetBiz, and Shelter/Rescue ecosystem.
- Approved LostPaws and RAVE artwork is reused from the repository; do not generatively redraw locked brand assets in product code.
- LostPaws mobile art uses safe 16:9 containment rather than cropping the owner-approved hero.
- Responsive acceptance covers 320, 360, 375, 390, 412, 430px and tablet portrait in addition to the existing release matrix.
- Primary activation actions retain mobile touch targets of at least 44px.
- Strong independence/non-affiliation wording remains in place.
- No donation percentage, tax-deductibility, festival sponsorship, or endorsement is implied.

PR #126 also updated GitHub Pages MVP Acceptance so `/rave` and `/lostpaws` are tested against their separate intended contracts rather than requiring identical headings/CTAs.

Issue #100 / PR #102 remain useful history for the unified ecosystem model, but their requirement that `/rave` and `/lostpaws` render the same component is superseded by Issue #125 / PR #126. Issue #58, Issue #96, and PR #97 remain superseded historical work.

### OAuth deployment-base readiness

Issue #99 / PR #104 added `src/lib/auth-oauth.ts` and moved Google OAuth app returns to a deployment-base-aware helper.

- Root hosting returns inside `https://shelterpawtners.com/`.
- GitHub Pages returns remain inside `/LostPaws/`.
- Persona onboarding paths remain deterministic after Google signup.
- No deployment hostname is hardcoded in frontend return logic.
- The Supabase provider callback remains separate and unchanged.

Issue #98 / PR #106 added Facebook source readiness:

- existing `VITE_FACEBOOK_AUTH_ENABLED` flag controls the UI;
- Facebook is offered beside Google on Guardian, Shelter, PetBiz, RAVE Vendor signup and sign-in when enabled;
- provider is Supabase `facebook`;
- signup preserves `sp_kind` and returns to the selected persona onboarding path through the same base-aware helper;
- login returns to the current application base;
- Facebook initiation failures use a generic user-safe message;
- no universal Instagram login is advertised;
- no Meta credentials, secrets, DNS, or provider-console configuration are committed.

Live Google and Facebook provider acceptance remains external and must not be represented as complete until real account flows are tested.

## Auth/email status

Completed hosted prerequisites:

- Resend free-tier setup;
- `auth.shelterpawtners.com` transactional-email DNS;
- Microsoft 365 inbound/human-mail DNS intentionally unchanged;
- Supabase custom SMTP using `ShelterPawtners <noreply@auth.shelterpawtners.com>`;
- hosted Supabase Site URL;
- real Guardian signup/confirmation through Supabase + Resend.

Password-recovery source/test readiness is complete through PR #94:

- base-aware recovery redirect;
- `/reset-password` route;
- browser-scoped `PASSWORD_RECOVERY` session gating;
- password update and forced sign-out;
- safe generic invalid/expired/reused-link messaging.

Still required: one real hosted password-recovery lifecycle covering delivery, reset link, password update, new-password login, invalid/expired/reused behavior, and Guardian persona/profile continuity.

## Active Issue #56 — Support OS

Supabase remains the operational support source of truth. Raw support content/PII must never auto-mirror to GitHub.

Accepted source/runtime foundation includes:

- authenticated Help & feedback under RLS;
- privacy-safe duplicate/triage/classification/digest/delivery contract;
- human escalation for privacy/safety/P0/P1/human-review-required cases;
- release context on tickets;
- immediate vs daily-digest boundaries;
- 24h/48h/7d aging/escalation regression;
- reviewed private delivery ledger and service-role-only claim/complete RPCs;
- provider-neutral server-side delivery worker source.

The already-reviewed PR #95 database migration has been applied to shared dev. Verification confirmed anon/authenticated cannot execute the privileged delivery RPCs and `service_role` can.

Do **not** deploy the delivery Edge Function until an approved owner-alert destination and managed `SUPPORT_DELIVERY_WEBHOOK_URL` / `SUPPORT_DELIVERY_INVOKE_SECRET` values exist. Do not invent a webhook, hardcode secrets, or enable ad hoc `pg_cron` / `pg_net` scheduling.

## Hosted runtime state

### GitHub Pages

GitHub Pages remains the primary low-cost release-candidate acceptance environment. PR #126 passed CI, Hosted QA, Persona QA, Database QA, Dependency Review, Merge Gate, and GitHub Pages MVP Acceptance before merge.

### Vercel

The last independently verified READY production deployment predates PR #126. A Vercel Hobby build-rate-limit status was attached to #126, so wait for an allowed deployment window or an already-authorized deployment path; do not upgrade solely for capacity.

## Remaining external launch gates

1. Complete real password-recovery lifecycle acceptance.
2. Verify Microsoft 365 human mailbox send/receive.
3. Supply an approved Support OS owner-alert destination and managed secrets, then review/deploy the privileged delivery runtime.
4. Perform real hosted Google OAuth login/signup/logout/persona acceptance.
5. Configure/accept Meta/Facebook provider behavior and perform real hosted login/signup/persona acceptance before enabling it publicly.
6. Verify social/email auth flows preserve persona continuity and do not create duplicate profiles/organizations.
7. Complete owner/legal review of draft Terms/Privacy/Data Deletion. Do not publish final versions without approval.
8. Verify a current Vercel production deployment containing the accepted `main` SHA before treating the production web runtime as fully current.

Supabase project callback used by external OAuth providers:

`https://jukmlmryykcnjtpblbja.supabase.co/auth/v1/callback`

## Current next sequence

1. Treat `main` as the only release-candidate source of truth.
2. Preserve Issue #125 / PR #126 as the controlling RAVE/LostPaws public architecture unless new regression evidence appears.
3. Perform real password-recovery and Google acceptance when a safe account/inbox/browser session is available.
4. Complete Facebook provider-console/live acceptance only when actionable tooling/session access exists; source readiness is already complete.
5. Advance Support OS only when its legitimate transport/secret prerequisites exist.
6. Keep final legal publication and any destructive/paid changes owner-gated.
7. If external lanes remain blocked, continue useful non-destructive QA, messaging/UI polish, issue reconciliation, and launch documentation rather than inventing privileged production mechanisms.

## Guardrails still in force

Never:

- purchase/upgrade paid services without owner approval;
- make destructive production-data changes;
- alter Microsoft 365 mail DNS;
- decide OD-003 or OD-004;
- weaken tests or RLS;
- publish unapproved final Terms/Privacy/Data Deletion language;
- expose secrets;
- auto-close/fix support cases solely from AI suggestions;
- bypass privacy/P0/P1 human escalation;
- wholesale-merge historical branches;
- reopen completed Lost Lands slices without regression evidence.
