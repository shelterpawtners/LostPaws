# Launch Auth + Email Readiness

Status: pre-cutover plan. No production DNS, SMTP provider, or paid infrastructure change is authorized by this document.

## Current application behavior

The launch branch now has the application-side pieces required for standard Supabase email auth:

- email/password signup requests an email confirmation redirect back to the selected onboarding persona;
- Google OAuth retains the selected onboarding route;
- forgot-password requests a recovery redirect to `/reset-password` on the current application origin;
- `/reset-password` does not present an active password form to an unauthenticated visitor with an invalid, expired, manually opened, or consumed recovery URL;
- password updates continue through Supabase Auth rather than application-owned password storage.

Final production confirmation/recovery testing cannot be completed until the production sending service and authorized final URLs are configured.

## Why the built-in Supabase mailer is not a production option

Supabase documents its built-in SMTP service as development/testing only. Without custom SMTP it restricts delivery to pre-authorized project-team addresses, is best-effort, and is currently heavily rate-limited. Public signup therefore requires custom transactional email before traffic is routed to the production domain.

Official source:

- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/deployment/going-into-prod

## Why Microsoft 365 mailbox SMTP is not the preferred dependency

ShelterPawtners already uses Microsoft 365 for human-operated mailboxes. That should remain separate from transactional Auth email.

Supabase custom SMTP expects SMTP host, port, username, and password credentials. Microsoft is retiring Basic Authentication for Exchange Online SMTP AUTH. Its January 2026 timeline says behavior remains unchanged through December 2026, then Basic SMTP AUTH becomes disabled by default for existing tenants, with OAuth as the strategic direction.

Using Microsoft 365 Basic SMTP AUTH for this launch would therefore create avoidable replacement work almost immediately and couple application availability to a human mailbox configuration.

Official sources:

- https://techcommunity.microsoft.com/blog/exchange/updated-exchange-online-smtp-auth-basic-authentication-deprecation-timeline/4489835
- https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission

## Recommended MVP path

Use a dedicated transactional provider that supports standard SMTP credentials and keep Microsoft 365 for normal business mail.

Preferred first choice: **Resend**.

Reasons:

- Supabase explicitly lists Resend as a compatible custom SMTP provider;
- standard SMTP relay is supported;
- current free tier is sufficient for initial controlled MVP traffic: 3,000 emails/month, 100 emails/day, and up to 3 domains;
- a separate sending subdomain can isolate Auth reputation/configuration from normal Microsoft 365 mail;
- moving to a paid Resend tier later is optional and should be usage-driven, not an MVP prerequisite.

Official source:

- https://resend.com/pricing

Reasonable fallback: **Brevo**, which also offers SMTP and a larger current free daily allowance. Postmark is technically strong but its free developer tier is much smaller and therefore less useful for an initial public signup flow.

Official sources:

- https://www.brevo.com/products/transactional-email/
- https://postmarkapp.com/pricing

## Proposed domain separation

Preferred transactional sender pattern:

- sending domain: `auth.shelterpawtners.com`
- From address: `no-reply@auth.shelterpawtners.com`
- sender name: `ShelterPawtners`

This keeps transactional-auth DNS and reputation separate from the existing Microsoft 365 root-domain mail configuration.

Do **not** replace or casually modify the existing Microsoft 365 MX/SPF/DKIM/DMARC records. Any required transactional-provider DNS records should be scoped to the sending subdomain where the provider supports that design.

## Required final-domain Supabase redirects

After the owner authorizes production-domain configuration, Supabase Auth must permit the exact production callback destinations used by the app, including:

- `https://shelterpawtners.com/onboarding/guardian`
- `https://shelterpawtners.com/onboarding/shelter`
- `https://shelterpawtners.com/onboarding/petbiz`
- `https://shelterpawtners.com/onboarding/rave_vendor`
- `https://shelterpawtners.com/reset-password`

Choose one canonical production hostname (`shelterpawtners.com` or `www.shelterpawtners.com`) and redirect the other to it rather than treating both as independent application origins. Align the Supabase Site URL and Google OAuth redirect configuration to that canonical hostname.

Preview/local callback URLs should remain separately scoped for development and QA rather than broadening production redirect patterns unnecessarily.

## Security configuration before public traffic

Before public launch:

1. configure the dedicated transactional SMTP provider;
2. verify its sending subdomain and required DNS authentication records;
3. configure Supabase custom SMTP sender details;
4. set the production Site URL and explicit redirect allowlist;
5. keep email confirmations enabled;
6. enable Supabase leaked-password protection if available on the selected project plan/configuration;
7. review Auth rate limits and abuse controls; add CAPTCHA if public signup abuse becomes a material risk;
8. send real confirmation and password-recovery messages to non-team addresses and verify delivery, links, onboarding routing, recovery, expiration/error behavior, and mobile rendering;
9. verify existing Microsoft 365 mail continues receiving/sending normally after any DNS addition.

## Owner gate

Creating a free transactional-provider account is an external account action and adding its DNS records changes the production domain. Those actions require the owner at the final launch gate. No paid tier is recommended for the current MVP unless real traffic exceeds the selected free limits.

Until this gate is completed, the Vercel preview and isolated/local Auth tests remain the validation environments.
