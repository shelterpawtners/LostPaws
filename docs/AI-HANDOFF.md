# AI Handoff

STATUS: EXTERNAL_LAUNCH_GATE
CURRENT_PHASE: Lost Lands MVP launch readiness
CURRENT_CHECKPOINT: External provider configuration and real-account acceptance
NEXT_CHECKPOINT: Resend/auth subdomain + hosted Supabase Auth + Google/Facebook provider acceptance
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

Vercel has a READY production deployment for `main` SHA `fae7a4cf7a24117868558f7cc4b65987e6e40928` at the generated Vercel deployment URL. The root route returns HTTP 200 and the deployed document identifies ShelterPawtners. Vercel runtime-error inspection found no runtime errors in the latest 24-hour window at this checkpoint.

The prior Vercel preview build-rate limit is no longer an active blocker for this merged release. No paid Vercel upgrade is authorized or needed for the current checkpoint.

## Active external launch gate

The remaining launch blockers are provider/account configuration and real external acceptance, not unfinished core MVP engineering:

1. Resend free-tier sending domain `auth.shelterpawtners.com` must be created/verified.
2. Add only the Resend-provided transactional-email DNS records for the `auth.shelterpawtners.com` subdomain. Do not alter Microsoft 365 apex mail DNS.
3. Configure hosted Supabase Auth custom SMTP for the approved transactional sender and install/test confirmation and recovery templates with safe accounts.
4. Narrow hosted Supabase Site URL and redirect allowlist to exact approved production/acceptance origins and callback paths.
5. Configure and live-test Google OAuth if owner credentials/provider-console access is available.
6. Configure and live-test supported Facebook Login if owner credentials/provider-console access is available. Do not present Instagram as universal Guardian authentication.
7. Execute safe real-account external inbox acceptance: registration, confirmation, sign-in, password recovery, Google/Facebook where enabled, and verify no duplicate app profile/organization creation.
8. Re-run integrated desktop/mobile/browser acceptance on the final configured release.
9. Present draft Terms/Privacy to the owner for review; do not publish them as final without approval.
10. Prepare but do not perform the final `shelterpawtners.com` web-domain DNS/custom-domain cutover until separately authorized.

## Connected tooling recheck

At this checkpoint:

- GitHub connection: available and authoritative for repository state.
- Vercel connection: available; production deployment and runtime health are verifiable.
- Supabase connection: available for project/database/functions/advisors, but the currently exposed connected actions do not provide hosted Auth provider/SMTP dashboard configuration writes.
- Resend: no direct installed/available connector found.
- SiteGround/authoritative ShelterPawtners DNS: no direct installed/available connector found.
- Google Developer/OAuth console: no direct installed/available connector found.
- Meta/Facebook Developer console: no direct installed/available connector found.
- Cloudflare is discoverable, but it must not be introduced merely to bypass SiteGround unless ShelterPawtners DNS is intentionally delegated there under separate approved planning.
- Browser automation remains available for hosted application QA, but it does not substitute for missing authenticated owner/provider-console sessions or credentials.

Re-check these connected capabilities on every controller run. If an authorized provider tool becomes actionable, use it immediately within standing authorization.

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

Re-check provider tooling. If Resend/DNS/Auth/OAuth provider configuration is still unavailable to the controller, perform non-destructive hosted/Supabase launch-health verification and leave the exact external action required from the owner explicit. Do not reopen completed LL slices or Deal Moments absent regression evidence. Continue automatically on the next run until the owner explicitly disables the controller.
