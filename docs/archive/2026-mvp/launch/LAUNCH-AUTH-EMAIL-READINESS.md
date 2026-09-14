# Launch Auth + Email Readiness

Status: active launch-readiness checkpoint. Transactional sending infrastructure is now configured; final Auth URL/provider acceptance and main-domain cutover remain gated.

## Current application behavior

The launch branch has the application-side pieces required for standard Supabase email auth:

- email/password signup requests an email confirmation redirect back to the selected onboarding persona;
- Google OAuth retains the selected onboarding route;
- forgot-password requests a recovery redirect to `/reset-password` on the current application origin;
- `/reset-password` does not present an active password form to an unauthenticated visitor with an invalid, expired, manually opened, or consumed recovery URL;
- password updates continue through Supabase Auth rather than application-owned password storage.

## Transactional email configuration completed

As of 2026-09-10, the owner completed the free-tier Resend setup for the dedicated Auth sending subdomain:

- sending domain: `auth.shelterpawtners.com`;
- Resend domain verification: complete;
- verified DNS records include Resend DKIM plus the two Resend sending CNAME records;
- Resend Receiving: disabled;
- existing Microsoft 365 human-mail routing was not intentionally modified;
- hosted Supabase custom SMTP: enabled and saved using Resend;
- sender identity: `ShelterPawtners <noreply@auth.shelterpawtners.com>`;
- SMTP/API credentials remain outside the repository.

Do not repeat this setup unless Resend verification regresses or real delivery acceptance shows an evidence-backed problem.

## Why Microsoft 365 remains separate

ShelterPawtners uses Microsoft 365 for human-operated mailboxes. Transactional Auth email should remain separate from that system.

Supabase custom SMTP expects SMTP host, port, username, and password credentials. Microsoft is retiring Basic Authentication for Exchange Online SMTP AUTH, making Microsoft 365 Basic SMTP AUTH an avoidable near-term dependency for application authentication mail.

Official sources:

- https://techcommunity.microsoft.com/blog/exchange/updated-exchange-online-smtp-auth-basic-authentication-deprecation-timeline/4489835
- https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission

## Current MVP provider path

Resend is the active transactional provider for MVP Auth mail. It is compatible with Supabase custom SMTP and the free tier is sufficient for controlled MVP traffic. No paid upgrade is authorized or currently required.

Official sources:

- https://supabase.com/docs/guides/auth/auth-smtp
- https://resend.com/pricing

## Domain separation

Transactional sender:

- sending domain: `auth.shelterpawtners.com`
- From address: `noreply@auth.shelterpawtners.com`
- sender name: `ShelterPawtners`

This isolates authentication sending reputation/configuration from existing Microsoft 365 root-domain mail.

Do **not** replace or casually modify existing Microsoft 365 MX/SPF/DKIM/DMARC records. Any additional transactional-provider DNS changes must remain scoped to the authorized Auth subdomain.

## Required final-domain Supabase redirects

Before changing hosted Auth URL configuration, inspect and record the current Site URL and Redirect URLs. Then permit only the exact destinations required for the approved acceptance/production origins.

The application requires callback destinations corresponding to:

- `/onboarding/guardian`
- `/onboarding/shelter`
- `/onboarding/petbiz`
- `/onboarding/rave_vendor`
- `/reset-password`

The eventual production-origin forms are expected to be:

- `https://shelterpawtners.com/onboarding/guardian`
- `https://shelterpawtners.com/onboarding/shelter`
- `https://shelterpawtners.com/onboarding/petbiz`
- `https://shelterpawtners.com/onboarding/rave_vendor`
- `https://shelterpawtners.com/reset-password`

However, the final `shelterpawtners.com` web-domain/custom-domain cutover remains separately owner-gated. Do not perform that cutover merely to configure or test Auth.

Choose one canonical production hostname (`shelterpawtners.com` or `www.shelterpawtners.com`) when final cutover is authorized; redirect the other rather than treating both as independent application origins. Preview/local callback URLs should stay narrowly scoped for development and QA.

## Remaining security and acceptance work before public traffic

1. inspect current hosted Supabase Site URL and Redirect URLs;
2. narrow Site URL and redirect allowlist to exact approved acceptance/production origins and callback paths;
3. review confirmation/recovery templates and branding;
4. send real confirmation and password-recovery messages to safe non-team addresses;
5. verify delivery, confirmation routing, sign-in, recovery, invalid/expired link behavior, and mobile rendering;
6. verify Microsoft 365 human mailbox send/receive still functions normally;
7. configure and live-test Google OAuth when provider-console credentials/access are available;
8. configure and live-test supported Facebook Login when provider-console credentials/access are available;
9. verify email and OAuth paths do not create duplicate app profiles or organizations;
10. run integrated desktop/mobile/browser regression on the final configured release;
11. keep Terms/Privacy as drafts until owner review;
12. prepare rollback/cutover documentation, but do not perform final main-domain DNS/custom-domain cutover without separate authorization.

## Connected-tool limitation

The currently connected Supabase tool can inspect project/database/docs capabilities but does not expose hosted Auth SMTP/provider/Site-URL dashboard configuration writes. Resend, SiteGround authoritative DNS, Google Developer Console, and Meta Developer Console also do not currently expose connected actions to this controller.

Therefore the immediate provider-console checkpoint is manual inspection/configuration of hosted Supabase Auth URL Configuration, followed by real inbox acceptance. Independent repository, Vercel health, and non-destructive QA work should continue in parallel.
