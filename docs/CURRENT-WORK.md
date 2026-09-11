# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

Lost Lands MVP LL-1 through LL-6 are **accepted** and must not be reopened without regression evidence.

`main` is the only release-candidate source of truth. Do not wholesale-merge historical branches.

Current accepted product/auth/UI baseline:

`45a87c3ff1bac1d3f35172386e8a4c3f5fb54d06`

Current verified public acceptance surface:

`https://shelterpawtners.github.io/LostPaws/`

Current Vercel production deployment is also READY on the same accepted product SHA at deployment `dpl_B4uVrWYcdc9vDpRYwa1unyzzUgxw`, with stable alias `https://lost-paws-one.vercel.app`. The earlier Hobby-capacity freshness blocker is therefore cleared. Do not purchase or upgrade Vercel merely for capacity.

Final `shelterpawtners.com` web-domain cutover remains separately owner-gated.

## Recent accepted launch work

### Unified LostPaws + RAVE Shelter mission

Issue #100 / PR #102 replaced the competing LostPaws experiences with one coherent mission flow.

- `/rave` renders the unified RAVE Shelter mission experience.
- `/lostpaws` renders the same mission experience with LostPaws as the music-community activation.
- `/rave-shelter` canonicalizes to `/rave`.
- The old generic LostPaws FoundationPage entry is removed.
- `public/lostpaws.html` and the Vercel LostPaws static rewrites are retired.
- The normal ShelterPawtners global header/footer remain present.
- Home now tells one LostPaws × RAVE Shelter story and links into the mission page and RAVE Marketplace.
- Raver/Guardian, RAVE Vendor/PetBiz, and Shelter/Rescue paths route to their intended destinations.
- Guardian give-back is described as a future giving capability, not as an already-settled charitable donation flow.
- Strong non-affiliation wording remains in place.

PR #103 updated the live GitHub Pages assertion to the new mission copy after #102 merged.

Issue #58, Issue #96, and PR #97 are superseded and must not be revived absent regression evidence.

### OAuth deployment-base readiness

Issue #99 / PR #104 added `src/lib/auth-oauth.ts` and moved Google OAuth app returns to a deployment-base-aware helper.

- Root hosting returns inside `https://shelterpawtners.com/`.
- GitHub Pages returns remain inside `/LostPaws/`.
- Persona onboarding paths remain deterministic after Google signup.
- No deployment hostname is hardcoded in frontend return logic.
- The Supabase provider callback remains separate and unchanged.

Issue #98 / PR #106 added Facebook source readiness:

- existing `VITE_FACEBOOK_AUTH_ENABLED` flag controls the UI;
- Facebook is offered beside Google on Guardian, Shelter, PetBiz, RAVE Vendor signup and sign-in;
- provider is `facebook`;
- signup preserves `sp_kind` and returns to the selected persona onboarding path through the same base-aware helper;
- login returns to the current application base;
- Facebook initiation failures use a generic user-safe message;
- no universal Instagram login is advertised;
- no Meta credentials, secrets, DNS, or provider-console configuration are committed.

Live Google and Facebook provider acceptance remains external and must not be represented as complete until provider-console credentials/settings and real account flows are tested.

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

GitHub Pages is the primary low-cost release-candidate acceptance environment. Public desktop/tablet/mobile acceptance is green for the unified mission flow and the latest auth source changes.

### Vercel

Vercel production is current with accepted product SHA `45a87c3ff1bac1d3f35172386e8a4c3f5fb54d06`.

- Deployment: `dpl_B4uVrWYcdc9vDpRYwa1unyzzUgxw`
- State: READY
- Target: production
- Stable alias: `https://lost-paws-one.vercel.app`

The prior Hobby capacity/freshness blocker is cleared. Continue to avoid unnecessary preview deployments and do not upgrade solely for capacity.

## Remaining external launch gates

1. Complete real password-recovery lifecycle acceptance.
2. Verify Microsoft 365 human mailbox send/receive.
3. Supply an approved Support OS owner-alert destination and managed secrets, then review/deploy the privileged delivery runtime.
4. Configure Google OAuth provider credentials/settings and perform real hosted acceptance.
5. Configure Meta/Facebook provider credentials/settings and perform real hosted acceptance.
6. Verify social/email auth flows preserve persona continuity and do not create duplicate profiles/organizations.
7. Complete owner/legal review of draft Terms/Privacy. Do not publish final versions without approval.
8. Prepare but do not perform final `shelterpawtners.com` web-domain/custom-domain cutover without separate owner authorization.

Supabase project callback used by external OAuth providers:

`https://jukmlmryykcnjtpblbja.supabase.co/auth/v1/callback`

## Current next sequence

1. Treat `main` as locked release-candidate source of truth.
2. Perform real password-recovery acceptance when a safe account/inbox is available.
3. Complete Google and Facebook provider-console setup only when authorized credentials/tooling are available; source readiness is already complete.
4. Advance Support OS only when its legitimate transport/secret prerequisites exist.
5. Keep legal publication and final production-domain cutover owner-gated.
6. If external lanes remain blocked, continue useful non-destructive QA, messaging/UI polish, issue reconciliation, and launch documentation rather than inventing privileged production mechanisms.

## Guardrails still in force

Never:

- purchase/upgrade paid services without owner approval;
- make destructive production-data changes;
- alter Microsoft 365 mail DNS;
- decide OD-003 or OD-004;
- weaken tests or RLS;
- publish unapproved final Terms/Privacy;
- expose secrets;
- perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate authorization;
- reopen completed Lost Lands slices or superseded LostPaws architecture without regression evidence.
