# Phase 2 Checkpoint 4 progress

## Status

Implementation complete and ready for the required redemption UX review. Checkpoint 5 is not active.

## Delivered

- Authenticated Guardian claims bound to exact immutable offer versions.
- Concurrency-safe inventory and per-user/per-pet limits under a locked current version.
- A 64-character opaque redemption code; only its SHA-256 digest is stored in the locked private token table, and the code contains no Guardian or pet PII.
- Partner deep-link/open validation and manual-code fallback with concise Partner, offer, status, and expiration context.
- One `Confirm utilization` action atomically creates a distinct redemption, marks the claim utilized, consumes the token, and records protected audit/history events.
- Cross-Partner access, expired/revoked/used codes, and replay are rejected server-side.
- Append-oriented reversal/correction history preserves the original redemption.
- Camera capability detection retains manual entry when scanning is unavailable; dedicated scanner hardware is not required.

## Validation

- Full local pgTAP suite: 4 files, 72 assertions, PASS.
- Focused Chromium journey: 4/4 PASS in 9.8 seconds.
- Mobile fallback at 390×844: PASS, with no horizontal overflow and a 44px-or-larger scan control.
- `npm run check`: PASS.
- `npm run build`: PASS.

## Review flow

1. Start local Supabase and Vite with the local URL and publishable key.
2. Sign in as `partner-admin@example.invalid` / `Demo-only-Partner!` and open `/partner/offers` to create and publish.
3. Sign in as `guardian-a@example.invalid` / `Demo-only-Guardian-A!`, open `/marketplace`, view the offer, and claim it.
4. Open the generated `/redeem/{opaque-code}` link while signed in as the Partner.
5. Review the validation card and `Confirm utilization` action.

These are reserved `example.invalid` demo identities; no production credentials are used.
