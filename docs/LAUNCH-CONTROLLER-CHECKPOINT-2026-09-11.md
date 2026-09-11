# Launch Controller Checkpoint — 2026-09-11

This checkpoint records launch-readiness work completed directly through connected GitHub/Supabase tooling while Codex capacity was unavailable. GitHub `main` remains the release-candidate source of truth.

## Preserved merged work

- PR #94 is merged: password recovery is source/test ready. This does **not** claim live recovery-email lifecycle acceptance.
- PR #95 is merged: Support OS privacy-safe delivery runtime exists in source.

## Support OS shared-dev deployment verification

The exact reviewed PR #95 migration `20260911180000_support_delivery_runtime.sql` was applied to `shelterpawtners-dev` (`jukmlmryykcnjtpblbja`).

Verified after application:

- `private.support_delivery_attempts` exists;
- `public.claim_support_delivery_candidates(integer,integer)` exists;
- `public.complete_support_delivery_candidate(uuid,uuid,boolean,text)` exists;
- `anon` cannot execute either privileged delivery RPC;
- `authenticated` cannot execute either privileged delivery RPC;
- `service_role` can execute both privileged delivery RPCs;
- post-change Supabase security advisor introduced no Support OS delivery-RPC exposure finding.

The `support-delivery` Edge Function remains intentionally **undeployed**. Required external prerequisites remain an approved idempotent owner-alert webhook destination plus managed `SUPPORT_DELIVERY_WEBHOOK_URL` and `SUPPORT_DELIVERY_INVOKE_SECRET`. No `pg_cron`/`pg_net` or automatic scheduler was enabled.

## LostPaws canonical route

Issue #96 is the current owner direction.

Draft PR #97 (`fix/issue-96-canonical-lostpaws`) preserves a reusable React `LostPawsCampaign` component and scoped campaign CSS. It is intentionally not merged yet.

Exact remaining integration delta:

1. import `LostPawsCampaign` into `src/main.tsx`;
2. replace generic `/lostpaws` `FoundationPage` routing with `<Page><LostPawsCampaign /></Page>`;
3. remove the two Vercel `/lostpaws` -> `/lostpaws.html` rewrites and remove the competing `public/lostpaws.html` static implementation;
4. add focused desktop/mobile Home -> LostPaws and LostPaws -> Home/Marketplace/RAVE smoke coverage;
5. run gates and merge only when green.

The temporary branch patch-workflow experiment was removed and is not part of PR #97.

The canonical owner-direction document was updated on `main` to require the standard ShelterPawtners global header on `/lostpaws`. Old Issue #58 was closed as superseded so agents do not implement the obsolete no-header requirement.

## OAuth source-readiness defects discovered

### Issue #99 — deployment-base-aware OAuth app return URLs

The Supabase social-provider callback is:

`https://jukmlmryykcnjtpblbja.supabase.co/auth/v1/callback`

Do not change that callback as part of the app-routing fix.

Current Google frontend initiation uses `location.origin` for application return URLs. On GitHub Pages this drops the `/LostPaws/` app base. Issue #99 isolates the small source fix: one reusable base-aware OAuth return helper, focused tests, and existing Google signup/login integration.

### Issue #98 — Facebook frontend wiring

`src/lib/supabase.ts` already exports `facebookAuthEnabled`, and the Meta contract identifies Supabase provider `facebook`, but current frontend code does not use the flag or initiate Facebook OAuth. Issue #98 isolates that missing frontend path. Do not spend owner time in the Meta console until source readiness is complete.

## Password recovery remaining live acceptance

PR #94 deliberately leaves one real hosted lifecycle gate:

1. request a real recovery email for a safe test account;
2. open the recovery link and confirm the correct hosted `/reset-password` route;
3. update the password;
4. sign in with the new password;
5. verify reused/invalid/expired-link handling;
6. verify Guardian/profile/persona continuity and no duplicate auth/profile/org records.

Do not represent unit/source coverage as live acceptance.

## Current atomic coding queue

When constrained coding-agent capacity is available, keep these independent and small:

1. PR #97 remaining LostPaws route integration only.
2. Issue #99 OAuth base-aware return helper + Google integration only.
3. Issue #98 Facebook frontend initiation only, reusing #99 helper.

Do not combine these with Support OS, live provider-console setup, legal work, Vercel cleanup, or final domain cutover.

## Guardrails

- no paid Vercel/Supabase upgrade;
- no Microsoft 365 DNS changes;
- no final `shelterpawtners.com` web-domain cutover without separate owner authorization;
- no final Terms/Privacy publication without owner review;
- no destructive production-data changes;
- no weakening RLS/tests;
- no secrets in GitHub;
- no reopening Issue #87 or historical branch reconciliation absent regression evidence.
