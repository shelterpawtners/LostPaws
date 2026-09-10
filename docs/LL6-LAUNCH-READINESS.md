# LL-6 Launch Readiness

Status: pre-cutover preparation
Issue: #46

## Purpose

This document is the final Lost Lands MVP release checklist. It prepares the production launch without performing the protected `shelterpawtners.com` web-domain DNS/custom-domain cutover.

## Integrated MVP acceptance

The final candidate must preserve all previously accepted slices:

- LL-1 Guardian Digital Pet Passport vertical slice.
- LL-2 premium Marketplace and offer experience.
- LL-3 shelter adoption-verification golden path.
- LL-4 production Auth/email readiness, Google preservation path, confirmation/recovery templates, and exact redirect contract.
- LL-5 truthful Meta social-auth capability: Facebook general sign-in path, no misleading universal Instagram login.

Required repository gates on the exact release candidate head:

- [ ] CI
- [ ] Database QA
- [ ] Persona QA
- [ ] Hosted QA
- [ ] Dependency Review
- [ ] Merge Gate

Do not merge a final acceptance PR with a failed, cancelled, stale, or head-mismatched required run.

## Browser/mobile/accessibility acceptance

Validate the active hosted candidate at minimum on:

- [ ] desktop Chromium golden paths;
- [ ] mobile-width Chromium for login/onboarding, Passport, Marketplace, and shelter verification;
- [ ] keyboard navigation for primary flows;
- [ ] no serious/critical automated accessibility violations in the Hosted QA audit;
- [ ] no uncaught console errors on the golden paths;
- [ ] no horizontal overflow or inaccessible primary CTA at mobile width.

Where Safari/Firefox device/browser execution is unavailable to the current automation surface, record that explicitly as a manual acceptance item rather than claiming coverage.

## Production Auth/provider prerequisites

Before production web cutover, complete the external-console checklist from `docs/LL4-AUTH-EMAIL-READINESS.md`:

- [x] Resend free-tier sending domain `auth.shelterpawtners.com` verified.
- [x] Only Resend-provided subdomain DNS records added; Microsoft 365 apex mail DNS intentionally unchanged.
- [x] Supabase custom SMTP configured with `ShelterPawtners <noreply@auth.shelterpawtners.com>`.
- [ ] Email confirmation enabled/verified in hosted Auth settings.
- [ ] Confirmation/recovery templates installed and tested with safe accounts.
- [ ] Supabase Site URL and redirect allowlist narrowed to exact approved origins/paths.
- [ ] Google provider configured and live-tested if credentials are available.
- [ ] Facebook provider configured and live-tested if credentials are available.
- [ ] `VITE_GOOGLE_AUTH_ENABLED`/`VITE_FACEBOOK_AUTH_ENABLED` enabled only where the corresponding provider is actually configured.
- [ ] Existing account login does not create duplicate app profiles/organizations.

Leaked-password protection remains a post-MVP candidate while it requires a paid Supabase tier; do not upgrade solely to enable it.

## Security/data checks

- [ ] No API keys, SMTP passwords, OAuth secrets, service-role keys, test passwords, or customer PII committed.
- [ ] Existing private audit/token tables remain intentionally inaccessible through RLS where designed.
- [ ] SECURITY DEFINER RPCs are changed only after function-specific contract review; no blanket revocation/conversion.
- [ ] No destructive production migration is part of the cutover.
- [ ] RLS and regression assertions remain at least as strong as previously accepted.

## Legal owner-review gate

Repository drafts may be prepared for review, but they are not approved legal documents and must not be presented as final Terms or Privacy Notice until the owner reviews/approves them.

- [ ] `docs/legal/DRAFT-TERMS-OF-SERVICE.md` reviewed by owner.
- [ ] `docs/legal/DRAFT-PRIVACY-NOTICE.md` reviewed by owner.
- [ ] Any material legal/privacy policy decision is resolved before publication.

## Main-domain pre-cutover checklist

Prepare these items but do **not** perform the final production domain/DNS/custom-domain change without separate owner authorization.

1. Confirm the exact production deployment SHA and hosted URL.
2. Confirm the deployment is green on all required repository gates.
3. Confirm production environment variables point to the intended Supabase project and contain no preview-only values.
4. Confirm exact auth redirect paths are configured for the production domain.
5. Confirm transactional confirmation/recovery emails and social-provider callbacks work from safe test accounts where provider access is available.
6. Capture the current `shelterpawtners.com` DNS/custom-domain state needed for rollback.
7. Confirm Vercel/custom-domain ownership and certificate readiness without changing apex/web routing.
8. Confirm the prior public site remains recoverable until the new deployment is accepted.
9. Prepare a post-cutover smoke checklist: home, register/login, Guardian onboarding, Passport, Marketplace, shelter verification response page, password recovery, and configured social login.
10. Stop here and obtain the separately required authorization for the final web-domain cutover.

## Current hosted evidence

- Accepted application SHA remains `fae7a4cf7a24117868558f7cc4b65987e6e40928`.
- Vercel production deployment for that SHA remains `READY`.
- Production root fetch returned HTTP 200 on 2026-09-10.
- Vercel runtime error inspection found no production runtime errors in the latest 24-hour window on 2026-09-10.
- Later documentation-only production builds were cancelled and do not replace the accepted READY application deployment.

## Rollback plan

If the eventual authorized cutover fails acceptance:

1. restore the prior web-domain routing/custom-domain target using the pre-cutover values captured immediately before change;
2. do not roll back Microsoft 365 mail DNS because it is outside this web cutover;
3. leave database migrations in place unless a separately reviewed reversible migration plan exists — never improvise destructive production rollback;
4. disable newly exposed OAuth feature flags if their provider path is failing while preserving email/password login;
5. verify the previous public site and authentication entry points are reachable;
6. document the failure and exact release SHA before attempting another cutover.

## Protected stop point

LL-6 can be marked engineering-ready after the final candidate is green and the checklist/external prerequisites are documented. It must stop before the final `shelterpawtners.com` production web-domain DNS/custom-domain change unless the owner separately authorizes that exact action.
