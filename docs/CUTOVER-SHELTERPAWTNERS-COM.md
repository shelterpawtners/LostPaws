# ShelterPawtners.com MVP Cutover

Status: owner-authorized soft-launch cutover. Legal/privacy routes remain unpublished until separately approved.

## Cutover attempt — 2026-09-12

Verified before any production configuration change:

- `origin/main` is `cf6475db44a1f005369c9657b3ebd21b46b53774`.
- The most recent successful Vercel **production** deployment is `dpl_F3dLB7Fd6jUWv582xjbL1fCqWSd6`, `READY`, from main SHA `7de02351227f793de7ad7fcc0b4e5361f5844cdc`.
- The commits after that deployment change only GitHub Pages workflow flags and this runbook; the deployed application bundle is unchanged.
- The Vercel project currently has only its two Vercel-owned domains. No custom-domain, DNS, Supabase Auth, Google OAuth, or SiteGround change was made in this attempt.

Current blocker: the connected Vercel integration is read/deployment-only and the local Vercel CLI has no authenticated account, so it cannot attach custom domains or display this project's authoritative DNS challenge. The connected Supabase integration does not expose hosted Auth URL Configuration writes, and no connected Google Cloud or SiteGround administrator is available. These are account-security/console actions, not an application defect.

When authenticated console access is available, perform the remaining configuration in the order in this runbook, then complete the production smoke checklist. Keep all Microsoft 365 mail records and the Meta/legal publication gates unchanged.

## Release source

- Repository: `shelterpawtners/LostPaws`
- Release branch: `main`
- Vercel project: `lost-paws`
- Current production deployment must correspond to current `main` and be `READY` before DNS changes.

## Public scope for cutover

Publish the accepted MVP application at:

- `https://shelterpawtners.com`
- `https://www.shelterpawtners.com` (redirect to apex preferred)

Keep Facebook/Instagram auth disabled until Meta configuration/review is ready.
Keep Privacy, Terms, and Data Deletion routes unpublished until owner/legal approval.

## Vercel domain configuration

Add `shelterpawtners.com` to the `lost-paws` Vercel project as the production custom domain.
Add `www.shelterpawtners.com` and redirect it to the apex domain.

For externally managed DNS, Vercel's documented default records are:

- apex `@` A -> `76.76.21.21`
- `www` CNAME -> `cname.vercel-dns-0.com`

Use the exact records Vercel displays for this project if they differ from the defaults.
Do not alter Microsoft 365 MX/SPF/DKIM/DMARC records.

## Auth configuration after/before DNS cutover

Supabase project: `jukmlmryykcnjtpblbja`

Set/confirm Auth Site URL:

`https://shelterpawtners.com`

Allow redirect URLs needed for production, including:

- `https://shelterpawtners.com/**`
- retain `https://shelterpawtners.github.io/LostPaws/**` during transition/rollback

Google OAuth web client:

- add Authorized JavaScript origin: `https://shelterpawtners.com`
- retain the Supabase callback URI: `https://jukmlmryykcnjtpblbja.supabase.co/auth/v1/callback`

Do not expose OAuth client secrets in GitHub or chat.

## Immediate post-cutover smoke

Verify on the apex production domain:

- `/`
- `/marketplace`
- `/rave`
- `/lostpaws`
- `/login`
- Guardian registration
- Google login and return to the apex domain
- logout / login
- mobile navigation
- password recovery request and return path when email delivery is available

## Rollback

If the production domain has a blocking regression, restore the previous DNS/web target while leaving the Vercel deployment intact for investigation. Do not rewrite history or force-push `main`.
