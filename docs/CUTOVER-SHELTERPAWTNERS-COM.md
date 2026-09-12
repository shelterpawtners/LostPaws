# ShelterPawtners.com MVP Cutover

Status: domain/auth configuration complete; real Google and signed-in browser acceptance remains. Legal/privacy routes remain unpublished until separately approved.

## Cutover completion — 2026-09-12

Completed by the owner after release verification:

- Vercel validates both production domains, with the apex canonical.
- SiteGround web DNS uses Vercel's exact apex A record and `www` CNAME; Microsoft 365 and Auth/Resend records were preserved.
- Supabase Auth Site URL and redirect allowlist include the apex while GitHub Pages remains temporarily allowed.
- Google OAuth has the apex JavaScript origin and retains the Supabase callback.
- Vercel redeploy `dpl_EZhNzZRjfKamY8FyeTnM3njnH7JN` is READY.
- Facebook/Instagram remains disabled; Privacy, Terms, and Data Deletion are still unpublished.

Vercel confirms the apex application shell with HTTP 200. A short-lived certificate hostname-routing mismatch in this controller's cloud browser prevents its interactive Google test; this does not affect Vercel's valid-domain status. Complete the Google login/logout, Guardian registration, mobile navigation, and direct-route-refresh smoke in an ordinary browser.

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
