# ShelterPawtners.com MVP Cutover

Status: owner-authorized soft-launch cutover. Legal/privacy routes remain unpublished until separately approved.

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
