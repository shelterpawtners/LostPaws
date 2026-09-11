# Auth and Account Support Runbook

Status: MVP support guidance for Issue #56

## Scope

Use this runbook for sign-in, confirmation, password recovery, configured OAuth providers and persona-continuity problems.

## Safe first checks

1. Confirm the affected route and app release.
2. Determine whether the user is using email/password, Google, Facebook or another actually enabled provider.
3. Distinguish signup confirmation, ordinary sign-in and password recovery.
4. Check whether the reported email/action was expected to be delivered through the configured transactional-email path.
5. Ask for non-sensitive error text and approximate timestamp when useful.

Never ask a user to send a password, one-time code, access token, refresh token, cookie or OAuth secret.

## Email confirmation

A valid signup should use the approved Supabase Auth + Resend flow. If confirmation delivery fails, investigate provider/delivery evidence without changing Microsoft 365 human-mail DNS or disabling confirmation globally.

Do not mark an account confirmed manually merely to bypass a production issue unless a separately authorized admin workflow explicitly allows that action.

## Password recovery

Validate the full contract when investigating recovery:

- request accepted without leaking account-existence information beyond approved behavior;
- recovery email delivered through the configured transactional path;
- callback lands on the approved `/reset-password` route;
- token/session is valid only as intended;
- password update succeeds;
- new password signs in;
- invalid/expired/reused links fail safely.

A real password-recovery acceptance remains a launch gate until tested with a safe external account.

## OAuth

Only claim providers that are actually configured. Google and supported Facebook Login require live provider-console configuration and callback acceptance before enabling user-facing flags.

Do not present a generic consumer Instagram login unless a supported production provider/flow exists.

## Persona continuity

Authentication should not create duplicate application profiles/organizations merely because a user returns through a different approved auth method. If identity linking/authority is ambiguous, escalate rather than automatically merging accounts.

## Escalate

Escalate immediately for:

- suspected account takeover;
- recovery sent to an unexpected recipient;
- cross-account data exposure;
- duplicate identities where merging could alter ownership/organization authority;
- widespread sign-in failure;
- any proposal to weaken auth/security controls to restore access.
