# LL-4 Production Auth + Email Readiness

Status: hosted email confirmation acceptance partially complete; recovery/OAuth acceptance remains

Issue: #40

## Production contract

- Keep Microsoft 365 as the human/business mailbox system. Do not change its MX/SPF/DKIM/DMARC records as part of this slice.
- Send Supabase Auth transactional mail from the dedicated subdomain `auth.shelterpawtners.com` using `noreply@auth.shelterpawtners.com`.
- Use Resend free tier only. Do not purchase or upgrade a paid plan.
- Keep email confirmation enabled for production users.
- Keep confirmation and recovery redirects constrained to approved ShelterPawtners application origins. Do not use wildcard production origins.
- Preserve email/password and Google sign-in. Persona selection must survive OAuth through the existing onboarding path.
- Do not commit SMTP passwords, Resend API keys, Google OAuth client secrets, Supabase access tokens, or service-role keys.

## Current application behavior already present

The React client already:

- passes a fixed same-origin onboarding path as `emailRedirectTo` during signup;
- passes a fixed same-origin onboarding path as the Google OAuth `redirectTo`;
- exposes `/forgot-password` and calls `resetPasswordForEmail` with a fixed same-origin `/reset-password` redirect;
- exposes `/reset-password` and changes the password through `auth.updateUser`;
- gates the Google button behind `VITE_GOOGLE_AUTH_ENABLED`.

## Approved production URL configuration

Target final Site URL after the separately gated web cutover:

- `https://shelterpawtners.com`

Required final redirect paths:

- `https://shelterpawtners.com/onboarding/guardian`
- `https://shelterpawtners.com/onboarding/shelter`
- `https://shelterpawtners.com/onboarding/petbiz`
- `https://shelterpawtners.com/onboarding/rave_vendor`
- `https://shelterpawtners.com/reset-password`

For pre-cutover hosted QA, use the exact active Vercel production/QA origin with the same paths. Do not add an unrestricted `https://*.vercel.app/**` or broad production-origin wildcard.

### Hosted owner checkpoint — 2026-09-10

The hosted Supabase Site URL is now:

- `https://lost-paws-one.vercel.app`

The broad Vercel production wildcard was replaced with the exact pre-cutover application paths:

- `https://lost-paws-one.vercel.app/onboarding/guardian`
- `https://lost-paws-one.vercel.app/onboarding/shelter`
- `https://lost-paws-one.vercel.app/onboarding/petbiz`
- `https://lost-paws-one.vercel.app/onboarding/rave_vendor`
- `https://lost-paws-one.vercel.app/reset-password`

Local development may retain `http://localhost:3000/**` while development remains active.

## Resend DNS boundary

Completed on the free tier for MVP acceptance preparation:

- sending domain `auth.shelterpawtners.com` is verified in Resend;
- required DKIM TXT and sending CNAME records are verified;
- Resend Receiving remains disabled;
- Microsoft 365 apex mail DNS was not intentionally changed.

Keep tracking disabled for Auth email links because link rewriting can break confirmation/recovery URLs.

## Supabase custom SMTP and hosted Auth settings

Hosted Supabase Auth custom SMTP is enabled and saved using Resend SMTP with:

- From address: `noreply@auth.shelterpawtners.com`
- Sender name: `ShelterPawtners`
- SMTP credentials: stored only in provider configuration; never commit them.

Hosted Auth settings were visually verified on 2026-09-10:

- new user signup enabled;
- confirm email enabled;
- email provider enabled;
- anonymous sign-in disabled;
- manual linking disabled;
- leaked-password protection unavailable on the free plan and intentionally not purchased.

Minimum password length should remain at least 8 characters for the launch contract.

## Live acceptance evidence — 2026-09-10

Owner completed a real Guardian registration against the hosted app using an external inbox. Evidence reported in the controller conversation:

- signup succeeded;
- confirmation email was delivered through the configured Supabase/Resend path;
- confirmation link worked;
- confirmation returned the Guardian to the expected Pet Basics/onboarding flow.

This is sufficient to close the first Guardian confirmation-path acceptance items. Do not reopen Resend/domain/SMTP setup unless a later delivery regression appears.

## Email templates

Use short authentication-only copy. Avoid marketing content and excess links. Repository reference templates live in:

- `supabase/templates/confirmation.html`
- `supabase/templates/recovery.html`

The hosted project template should continue to use Supabase's `{{ .ConfirmationURL }}` so the Auth server performs the confirmation/recovery action and enforces the configured redirect allowlist.

## Google OAuth

For production Google login:

1. Use the existing Supabase Google provider flow.
2. In Google Cloud, set the authorized redirect URI to the exact Supabase callback URI shown by the project's Google provider configuration.
3. Store client ID/secret only in Supabase/provider configuration.
4. Enable `VITE_GOOGLE_AUTH_ENABLED=true` only on a deployment where the provider is correctly configured.
5. Validate all four persona entry paths and ensure existing-account login does not create duplicate application profiles/organizations.

## Leaked-password protection

Supabase currently exposes leaked-password protection only on a paid plan. The project guardrail forbids paid upgrades, so this is intentionally not enabled during the MVP free-tier sprint. Keep the minimum password length at least 8 characters and record leaked-password protection as a post-MVP security upgrade candidate.

## Live acceptance checklist

Do not mark LL-4 fully complete until all available items are evidenced:

- [x] Resend free-tier account/domain available.
- [x] `auth.shelterpawtners.com` verified using only Resend subdomain DNS records.
- [x] Supabase custom SMTP enabled with Resend credentials.
- [x] Production email confirmations enabled/verified in hosted Auth settings.
- [x] Site URL and redirect allowlist narrowed to the exact approved pre-cutover hosted origin/paths.
- [x] Safe Guardian test signup receives an external confirmation email.
- [x] Guardian confirmation link returns to the correct onboarding/Pet Basics path.
- [ ] Safe test password recovery receives an external recovery email.
- [ ] Recovery link reaches `/reset-password`, password update succeeds, and the new password signs in.
- [ ] Invalid/expired recovery link fails safely.
- [ ] Google OAuth provider configured and live flow tested if Google console credentials are accessible.
- [ ] Guardian, Shelter, PetBiz, and RAVE persona continuity verified under final hosted Auth settings.
- [ ] Existing Passport, Marketplace, shelter verification, RLS, Persona QA, Hosted QA, CI, and Merge Gate regressions remain green after post-MVP UX changes.

## External capability boundary

The connected tooling can inspect GitHub and repository state, but currently exposed provider tooling does not provide direct writes to hosted Supabase Auth provider settings, Google Developer Console, or Meta Developer Console.

Remaining external-console actions:

1. verify/install the hosted confirmation and recovery templates if they differ from repository references;
2. perform safe live password-recovery acceptance including invalid/expired-link behavior;
3. configure Google provider credentials/callback in Google Cloud/Supabase when console access is available;
4. configure Facebook provider credentials/callback in Meta/Supabase when console access is available;
5. run remaining persona/OAuth acceptance without creating duplicate profile/organization records.

These actions do not block independent launch UX engineering, regression verification, legal-draft preparation, or cutover planning.
