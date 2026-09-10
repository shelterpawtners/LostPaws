# LL-5 Meta Social Auth Contract

Issue: #41

## Verified platform position — 2026-09-10

### Facebook

Supabase has a first-class `facebook` Auth provider. Current Supabase documentation requires a Meta/Facebook app, the Facebook client ID/secret in Supabase Auth, and usable email permission for the standard Supabase Facebook Auth flow. The frontend initiates this through `signInWithOAuth({ provider: "facebook" })`.

For ShelterPawtners, Facebook is therefore a valid general social-login option once the Meta app/provider credentials are configured.

### Instagram

Supabase does **not** expose Instagram as a built-in Auth provider. Supabase now supports standards-compliant custom OAuth2/OIDC providers, including up to three custom providers on the Free plan.

Meta's current **Instagram API with Instagram Login** is an OAuth flow for Instagram **professional accounts (Business and Creator)**. Its current base permission is `instagram_business_basic`. It is not a universal consumer-Instagram identity provider for every Guardian account, and the retired Instagram Basic Display API is not an acceptable fallback.

Therefore ShelterPawtners must not ship a general-purpose "Continue with Instagram" button that implies all Instagram users can authenticate. For the Lost Lands MVP:

- implement Facebook as the supported Meta social-login path;
- keep `instagram_handle` / Instagram profile information optional profile data;
- do not label Facebook login as Instagram login;
- do not request Instagram content, messaging, comment, or publishing permissions merely to authenticate;
- consider a later professional-account Instagram connection only if a real PetBiz/RAVE business use case needs it and the resulting identity/account-linking behavior is explicitly designed and tested.

This satisfies the product requirement truthfully without inventing a provider capability.

## Facebook implementation contract

- Environment feature flag: `VITE_FACEBOOK_AUTH_ENABLED`.
- Provider: `facebook`.
- Redirect target: fixed same-origin persona onboarding path, matching the existing Google pattern.
- Preserve the selected initial persona through OAuth using the same deterministic mechanism as Google.
- Existing email/password and Google login must remain functional.
- Do not commit Meta App Secret or any provider credential.
- Redirect allowlist remains exact-origin/path based; no arbitrary return URL from query parameters.
- Account-linking/duplicate-email behavior must be tested before declaring live acceptance.

## External prerequisites

The current connected tools do not expose Meta developer-console app creation/configuration or hosted Supabase Auth provider writes. Live Facebook acceptance therefore requires:

1. Meta developer account/app access;
2. Facebook Login configured for the ShelterPawtners app;
3. the exact Supabase Auth callback URL added to Meta;
4. minimum required email permission configured;
5. Facebook App ID/Secret entered into Supabase Auth;
6. live test accounts for callback, persona continuity, duplicate prevention, cancellation, and error handling.

No paid Meta service is authorized or required for this preparation.

## Acceptance

- [ ] Facebook provider UI is gated by `VITE_FACEBOOK_AUTH_ENABLED`.
- [ ] Facebook OAuth initiation uses a fixed same-origin onboarding redirect.
- [ ] Guardian/Shelter/PetBiz/RAVE initial persona survives successful OAuth.
- [ ] Existing account sign-in does not create duplicate ShelterPawtners profiles/organizations.
- [ ] OAuth cancellation/error path is understandable and safe.
- [ ] Email/password and Google regression remain green.
- [ ] Mobile login UX validated.
- [x] Instagram capability resolved truthfully: no universal Instagram login is advertised for MVP.
- [ ] Full CI/Hosted/Persona/Database/Merge Gate acceptance green.

## Sources checked

- Supabase current Facebook Auth guide.
- Supabase current Auth provider documentation.
- Supabase custom OAuth/OIDC provider documentation.
- Meta Instagram Platform current Instagram Login model and current `instagram_business_*` scope family.
