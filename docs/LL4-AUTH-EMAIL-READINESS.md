# LL-4 Production Auth + Email Readiness

Status: implementation/pre-cutover preparation in progress

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

These fixed same-origin paths are compatible with a narrow Supabase redirect allowlist. The hosted Auth configuration must still be changed before live acceptance.

## Approved production URL configuration

Before the final `shelterpawtners.com` web-domain cutover, configure only origins that are actually live and under owner control.

Target final Site URL after the separately gated web cutover:

- `https://shelterpawtners.com`

Required final redirect paths:

- `https://shelterpawtners.com/onboarding/guardian`
- `https://shelterpawtners.com/onboarding/shelter`
- `https://shelterpawtners.com/onboarding/petbiz`
- `https://shelterpawtners.com/onboarding/rave_vendor`
- `https://shelterpawtners.com/reset-password`

For pre-cutover hosted QA, add the exact active Vercel production/QA origin with the same paths. Remove obsolete preview origins after acceptance. Do not add an unrestricted `https://*.vercel.app/**` production wildcard.

## Resend DNS boundary

Completed on the free tier for MVP acceptance preparation:

- sending domain `auth.shelterpawtners.com` is verified in Resend;
- required DKIM TXT and sending CNAME records are verified;
- Resend Receiving remains disabled;
- Microsoft 365 apex mail DNS was not intentionally changed.

Keep tracking disabled for Auth email links because Supabase warns that link rewriting can break confirmation/recovery URLs.

## Supabase custom SMTP target

Hosted Supabase Auth custom SMTP is now enabled and saved using Resend SMTP with:

- From address: `noreply@auth.shelterpawtners.com`
- Sender name: `ShelterPawtners`
- SMTP credentials: stored only in provider configuration; never commit them.

Email confirmation and secure email-change settings still require hosted-console verification during the next Auth configuration checkpoint.

Supabase documents a default 30-auth-email-per-hour limit after custom SMTP is enabled. That is sufficient for MVP validation; do not buy capacity preemptively.

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

Supabase currently documents leaked-password protection as **Pro Plan and above**. The project guardrail forbids paid upgrades, so this is intentionally **not enabled during the MVP free-tier sprint**. Keep the application minimum password length at least 8 characters and record leaked-password protection as a post-MVP security upgrade candidate rather than silently purchasing a plan.

## Live acceptance checklist

Do not mark LL-4 complete until all available items are evidenced:

- [x] Resend free-tier account/domain available.
- [x] `auth.shelterpawtners.com` verified using only Resend subdomain DNS records.
- [x] Supabase custom SMTP enabled with Resend credentials.
- [ ] Production email confirmations enabled/verified in hosted Auth settings.
- [ ] Site URL and redirect allowlist narrowed to the exact approved hosted origins/paths.
- [ ] Safe test signup receives an external confirmation email.
- [ ] Confirmation link returns to the correct persona onboarding path.
- [ ] Safe test password recovery receives an external recovery email.
- [ ] Recovery link reaches `/reset-password`, password update succeeds, and the new password signs in.
- [ ] Invalid/expired recovery link fails safely.
- [ ] Google OAuth provider configured and live flow tested if Google console credentials are accessible.
- [ ] Guardian, Shelter, PetBiz, and RAVE persona continuity verified.
- [ ] Existing Passport, Marketplace, shelter verification, RLS, Persona QA, Hosted QA, CI, and Merge Gate regressions remain green.

## External capability boundary

The connected tooling can inspect GitHub, Vercel, and Supabase project/database state, but the currently exposed Supabase actions do not provide hosted Auth URL/provider-setting writes. Resend free-tier domain verification and SMTP setup are complete and must not be reopened unless delivery testing shows a regression.

The remaining external-console actions are:

1. inspect and configure hosted Supabase Site URL and exact redirect allowlist;
2. verify email confirmation and secure email-change settings;
3. install/verify the confirmation and recovery templates in hosted Supabase Auth;
4. perform safe live signup/confirmation/recovery inbox click-through tests;
5. configure Google provider credentials and callback in Google Cloud/Supabase when owner console access is available;
6. configure Facebook provider credentials/callback in Meta/Supabase when owner console access is available.

These external actions do not block independent LL-6 launch-health verification, documentation, or evidence-backed regression fixes.