# QA test accounts

Admin QA Mode provides access to deterministic `@example.invalid` demo personas and fresh test accounts. It is available only when both the QA preview UI flag and the development Edge Function guard are enabled.

## Seeded personas

- Guardian A — `guardian-a@example.invalid` — Demo Pet A
- Guardian B — `guardian-b@example.invalid` — Demo Pet B
- Partner Admin — `partner-admin@example.invalid` — Demo PetBiz A
- Partner B — `partner-b@example.invalid` — Demo PetBiz B
- Shelter Admin — `shelter-admin@example.invalid` — Demo Shelter B
- RAVE Vendor — `rave-vendor@example.invalid` — Demo RAVE Vendor

These users are for QA only. Their credentials are not rendered, copied, or returned by the Admin QA user interface.

## Fresh accounts

An authorized platform administrator may create a confirmed Guardian, Shelter, Pet Business, or RAVE Vendor QA account from `/admin-qa`. The server generates a unique reserved-domain address, confirms only that created account, and immediately issues a one-time temporary acting-session exchange. Normal public signup confirmation behavior is unchanged.

## Security boundary

The browser's ordinary persisted Supabase session remains the admin session. The selected persona is held in a second non-persisted client so application queries use that user's real JWT and RLS context. Return to Admin destroys the acting client and restores the already-existing admin session. Creation, start, switch, and stop events are written to the private audit store.
