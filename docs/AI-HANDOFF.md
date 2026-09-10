# AI Handoff

STATUS: EXTERNAL_LAUNCH_GATE
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: Hosted Auth URL configuration + real-account acceptance
NEXT_CHECKPOINT: Supabase Site URL/redirect allowlist, then real email acceptance, Google/Facebook provider acceptance
OWNER_DECISION_REQUIRED: YES_FOR_PROVIDER_CONSOLES_AND_FINAL_CUTOVER_ONLY
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: fae7a4cf7a24117868558f7cc4b65987e6e40928
ACCEPTANCE_DEPLOYED_SHA: fae7a4cf7a24117868558f7cc4b65987e6e40928
ACCEPTANCE_RUNTIME: VERCEL_PRODUCTION

## Completed engineering

LL-1 through LL-6 remain accepted. Do not reopen them without evidence of a regression.

Issue #49 / PR #50 — multi-photo Pet Passport + Guardian activity timeline — is complete and merged.

Issue #51 / PR #52 — Guardian Deal Moments — is complete and merged to `main` at `fae7a4cf7a24117868558f7cc4b65987e6e40928`. Issue #51 is closed as completed. The accepted Deal Moment implementation keeps activity photos outside the five-photo Passport cap, private to the owning Guardian in this release, and protected by the existing database/RLS/storage acceptance contract.

## Current hosted state

Vercel still has a READY production deployment for accepted app SHA `fae7a4cf7a24117868558f7cc4b65987e6e40928` at `lost-paws-qc36f535p-jims-projects-acec6bcb.vercel.app`. A direct production root fetch returned HTTP 200 on 2026-09-10, and runtime-error inspection found no production runtime errors in the latest 24-hour window.

Later documentation-only commits produced canceled production builds; they do not replace or invalidate the READY accepted app deployment.

No paid Vercel upgrade is authorized or needed for the current checkpoint.

## Transactional email progress completed by owner

The Resend prerequisite is materially complete:

1. Free-tier Resend account/domain setup completed.
2. Sending domain `auth.shelterpawtners.com` created and verified.
3. Required Resend DNS records were added and all three reported verified:
   - DKIM TXT at `resend._domainkey.auth`
   - CNAME `rsend.auth` -> `rsend.forge.rmta.net`
   - CNAME `send.auth` -> `send.forge.rmta.net`
4. Resend Receiving remains disabled; Microsoft 365 inbound mail routing was not intentionally changed.
5. Hosted Supabase custom SMTP was enabled and saved using the verified Resend sending domain.
6. Configured sender identity is `ShelterPawtners <noreply@auth.shelterpawtners.com>`.
7. No Resend API key or SMTP secret is stored in this repository/handoff.

Do not repeat or reopen this Resend/DNS setup unless verification regresses or delivery testing produces evidence of a configuration problem.

## Active external launch gate

The remaining launch blockers are provider/account configuration and real external acceptance, not unfinished core MVP engineering:

1. Inspect current hosted Supabase Auth Site URL and redirect URLs before changing them.
2. Narrow hosted Supabase Site URL and redirect allowlist to exact approved production/acceptance origins and callback paths. Do not perform final `shelterpawtners.com` web-domain cutover as part of this step.
3. Verify hosted email-confirmation/security settings and install/review confirmation and recovery email templates as needed.
4. Execute safe real external inbox acceptance: registration, confirmation, sign-in, password recovery, invalid/expired recovery behavior, and mobile email/link rendering.
5. Verify transactional mail additions did not disturb existing Microsoft 365 human mailbox send/receive behavior.
6. Configure and live-test Google OAuth if owner credentials/provider-console access is available.
7. Configure and live-test supported Facebook Login if owner credentials/provider-console access is available. Do not present Instagram as universal Guardian authentication.
8. Verify OAuth/email flows do not create duplicate app profile/organization records.
9. Re-run integrated desktop/mobile/browser acceptance on the final configured release.
10. Present draft Terms/Privacy to the owner for review; do not publish them as final without approval.
11. Prepare but do not perform the final `shelterpawtners.com` web-domain DNS/custom-domain cutover until separately authorized.

## Connected tooling recheck

At this checkpoint:

- GitHub connection: available and authoritative for repository state.
- Vercel connection: available; accepted production deployment, direct root response, and runtime health are verifiable.
- Supabase connection: available for project/database/functions/advisors/docs, but the currently exposed connected actions do not provide hosted Auth provider/SMTP/Site-URL dashboard configuration writes.
- Resend: no direct installed/available connector found. Owner completed the required free-tier domain + SMTP setup manually.
- SiteGround/authoritative ShelterPawtners DNS: no direct installed/available connector found. Required Resend subdomain records are verified; do not alter Microsoft 365 apex mail DNS.
- Google Developer/OAuth console: no direct installed/available connector found.
- Meta/Facebook Developer console: no direct installed/available connector found.
- Browser automation: no newly installed provider-console automation surfaced in this run.
- Plugin discovery recheck surfaced Cloudflare as an installable option only. It is not the authoritative DNS provider for this project and is not required for the current checkpoint, so introducing it would add architecture rather than unblock launch readiness.

Re-check these connected capabilities on every controller run. If an authorized provider tool becomes actionable, use it immediately within standing authorization.

## Documentation refreshed this run

- `docs/LL4-AUTH-EMAIL-READINESS.md` now records the verified Resend domain/DNS and saved Supabase SMTP state, and consistently uses the actual sender `noreply@auth.shelterpawtners.com`.
- `docs/LL6-LAUNCH-READINESS.md` now marks those completed transactional-email prerequisites and records current Vercel production health evidence.

## Safe independent work while externally blocked

While provider-console work remains blocked, continue only useful non-destructive launch-readiness work such as:

- verify current production deployment health and release SHA;
- run non-destructive hosted smoke/regression checks;
- inspect Supabase security/performance advisors after schema changes;
- keep cutover/rollback and external acceptance documentation current;
- fix evidence-backed regressions only;
- review dependency PRs only when they are low-risk, green, and relevant to launch readiness;
- keep legal content in draft/review status;
- avoid speculative feature expansion before launch.

## Protected restrictions

Never purchase or upgrade paid services, make destructive production-data changes, alter Microsoft 365 mail DNS, decide OD-003 or OD-004, weaken tests/RLS, publish unapproved final Terms/Privacy, expose secrets, or perform the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover without separate owner authorization.

## Next safe action

The next manual provider-console action is hosted Supabase Auth URL Configuration: inspect the existing Site URL and Redirect URLs first, then set only the exact approved acceptance/production callback destinations. The connected Supabase tool cannot currently write those hosted Auth settings, so the controller must not invent or bypass that configuration.

In parallel, continue non-destructive Vercel/runtime/Supabase launch-health verification. Do not reopen completed LL slices, PR #50, or PR #52 absent regression evidence. Continue automatically on the next run until the owner explicitly disables the controller.
