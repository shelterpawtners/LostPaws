# ShelterPawtners QA test accounts

<!-- prettier-ignore-start -->

Purpose: deterministic local/manual accounts plus registration guidance for automated browser tests. All seeded addresses use the reserved `example.invalid` domain and are test-only.

## Stable seeded manual accounts

- **Guardian A** — `guardian-a@example.invalid` / `Demo-only-Guardian-A!` — Guardian marketplace/claim flows; already linked to Demo Pet A.
- **Guardian B** — `guardian-b@example.invalid` / `Demo-only-Guardian-B!` — Cross-guardian isolation; already linked to Demo Pet B.
- **Pet Business Admin** — `partner-admin@example.invalid` / `Demo-only-Partner!` — Partner profile, offers, and redemption.
- **Pet Business B** — `partner-b@example.invalid` / `Demo-only-Partner-B!` — Cross-partner isolation.
- **Shelter Admin** — `shelter-admin@example.invalid` / `Demo-only-Shelter!` — Shelter registration and organization-role testing.
- **RAVE Vendor** — `rave-vendor@example.invalid` / `Demo-only-RAVE-Vendor!` — RAVE vendor onboarding, profile, and offer testing.
- **Platform Admin** — `platform-admin@example.invalid` / `Demo-only-Platform!` — Local administrative authorization testing only.

## Fresh registration accounts

Automated registration tests create unique accounts at runtime instead of relying only on seeded users. They use a reserved test address pattern such as:

- `qa-guardian-<timestamp>@example.invalid`
- `qa-shelter-<timestamp>@example.invalid`
- `qa-petbiz-<timestamp>@example.invalid`
- `qa-rave-<timestamp>@example.invalid`

Local Supabase has email confirmation disabled, so a successful registration should create a session and route immediately to the matching onboarding path.

## Required automated registration matrix

For each public registration persona:

1. Open the persona-specific registration route.
2. Create a fresh unique account.
3. Confirm the browser receives a session and reaches the correct onboarding route.
4. Confirm a normal user is not prompted prominently to add another role.
5. Confirm the account can sign out and sign back in.

Additional Guardian requirements:

1. Complete the pet-information form.
2. `Save and continue` must visibly enter a saving state.
3. Exactly one pet row is created.
4. Exactly one active primary guardianship links the authenticated user to that pet.
5. Success navigates away from onboarding to the intended current destination.
6. Retry/double-submit must not create a duplicate pet or guardianship.
7. Guardian B must not be able to read or modify Guardian A's pet through browser-authorized paths.

## Manual QA sequence for Jim

After `npx supabase db reset` and `npm run dev`:

1. Guardian: sign in as `guardian-a@example.invalid` and verify Guardian dashboard/marketplace access.
2. Guardian isolation: sign in as `guardian-b@example.invalid` and verify no access to Guardian A's pet data.
3. Partner: sign in as `partner-admin@example.invalid`, create/publish an offer, and test redemption.
4. Partner isolation: sign in as `partner-b@example.invalid` and confirm Partner A private/redemption data is not visible.
5. Shelter: sign in as `shelter-admin@example.invalid` and verify shelter-specific access remains intact.
6. RAVE Vendor: sign in as `rave-vendor@example.invalid` and verify RAVE vendor-specific onboarding/profile access.
7. Registration: create one new Guardian account through `/register?type=guardian`, complete the pet form, and verify the app advances after Save.
8. Registration: spot-check new Shelter, Pet Business, and RAVE Vendor accounts route to the matching onboarding screens.

Do not use these credentials outside local/test environments and do not convert them into real user accounts.

<!-- prettier-ignore-end -->
