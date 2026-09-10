# AI Handoff

STATUS: BLOCKED
CURRENT_PHASE: Phase 3 — Lost Lands MVP engineering complete
CURRENT_CHECKPOINT: Post-LL-6 external provider acceptance / owner-gated production cutover
NEXT_CHECKPOINT: Re-check authorized provider/tool prerequisites; complete any newly actionable prerequisite; final production cutover still requires separate owner authorization
OWNER_DECISION_REQUIRED: YES
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: 0bee999152e4bc84b910dfeccf7a11074a14445b
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: MAIN

## Completed Lost Lands MVP slices

- LL-1 Guardian Digital Pet Passport merged via PR #37.
- LL-2 Premium Marketplace merged via PR #42.
- LL-3 Shelter adoption verification merged via PR #43 after full required acceptance.
- LL-4 provider-independent production Auth/email readiness merged via PR #44 after CI, Hosted QA, Database QA, Persona QA, Dependency Review, and Merge Gate passed.
- LL-5 Meta social-auth capability prep merged via PR #45 after the same required acceptance stack passed. Facebook is the truthful general Meta sign-in path; universal consumer Instagram login is not advertised.
- LL-6 final regression/launch-readiness preparation merged via PR #47 at `0bee999152e4bc84b910dfeccf7a11074a14445b` after CI, Hosted QA, Database QA, Persona QA, Dependency Review, and Merge Gate were all green on the exact PR head.

Completed LL slices must not be reopened without concrete regression evidence.

## Launch-readiness artifacts

- `docs/LL4-AUTH-EMAIL-READINESS.md` — production Auth/email/provider setup and live acceptance contract.
- `docs/LL6-LAUNCH-READINESS.md` — integrated regression, browser/mobile/accessibility, security, provider prerequisites, main-domain pre-cutover, and rollback checklist.
- `docs/legal/DRAFT-TERMS-OF-SERVICE.md` — owner/legal-review draft only; not approved for publication.
- `docs/legal/DRAFT-PRIVACY-NOTICE.md` — owner/legal-review draft only; not approved for publication.

## External launch-gate recheck — 2026-09-10

- Supabase project `shelterpawtners-dev` remains `ACTIVE_HEALTHY`.
- Current Supabase connected tooling exposes database/project/Edge Function operations and Auth documentation search, but no hosted Auth configuration writes for SMTP, Site URL/redirect allowlists, confirmation/recovery configuration, or social-provider credentials.
- No installed Resend or SiteGround DNS connector is currently available. Plugin discovery still exposes Cloudflare as installable, but the current DNS authority is not established as Cloudflare and it must not be introduced merely to bypass the actual DNS provider.
- Connected Vercel tooling remains available. Project `lost-paws` is on the Hobby plan and the latest runtime-error recheck reports no production runtime errors in the preceding 24 hours.
- Browser automation capability is installed and can navigate/test web applications. It does not by itself supply authenticated Resend, SiteGround, Google Developer, Meta Developer, or Supabase Dashboard provider-console sessions/credentials; non-interactive provider OAuth/login prompts remain an external boundary unless a reusable authorized session becomes available.
- The controller is explicitly authorized to remain active at this gate. `SAFE_TO_CONTINUE: YES` means future runs should re-check connected tooling and perform useful non-destructive launch-readiness verification. It does **not** authorize the protected production-domain cutover or any other prohibited action.

## Exact external blocker

The remaining launch work requires provider-console credentials/session access not currently exposed by connected tools:

1. Create/sign into the Resend free-tier account and verify `auth.shelterpawtners.com` using only Resend-provided subdomain DNS records; do not alter Microsoft 365 apex mail DNS.
2. Generate Resend SMTP credentials and configure Supabase Auth custom SMTP for `no-reply@auth.shelterpawtners.com`.
3. Configure the hosted Supabase Auth Site URL and exact redirect allowlist; enable/test confirmation and recovery templates.
4. Configure Google OAuth credentials/provider and run live persona/duplicate-prevention acceptance if credentials are available.
5. Configure Meta/Facebook app credentials/provider and run live Facebook sign-in acceptance. Do not add a misleading universal Instagram-login path.
6. Perform safe external inbox signup/confirmation/recovery click-through tests.
7. Review/approve the draft Terms and Privacy Notice before any final publication.
8. Separately authorize the final `shelterpawtners.com` production web-domain DNS/custom-domain cutover after the above acceptance is complete.

Leaked-password protection remains a post-MVP candidate if enabling it would require a paid Supabase tier; do not purchase or upgrade solely for it.

## Controller behavior at this gate

On each authorized continuation run:

1. Treat GitHub/main and this handoff as source of truth.
2. Re-check currently connected/installed tooling for Resend, actual DNS authority, Supabase hosted Auth configuration, Google OAuth, Meta/Facebook, Vercel, and browser automation.
3. If a newly available tool/session makes an authorized launch prerequisite actionable, complete it and record evidence here.
4. Otherwise perform only useful non-destructive verification/documentation; avoid churn and do not reopen LL-1 through LL-6 without regression evidence.
5. Keep the controller enabled until the owner explicitly disables it.

## Protected stop

Do not perform the final production `shelterpawtners.com` web-domain DNS/custom-domain cutover, publish the legal drafts as final, make OD-003/OD-004 decisions, purchase or upgrade paid services, make destructive production-data changes, or alter Microsoft 365 mail DNS without the separately required owner action/authorization.
