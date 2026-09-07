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
- Supported mobile browsers use the rear camera and native `BarcodeDetector` to decode QR links or raw codes; permission denial, unsupported browsers, and scan timeout retain manual entry. Dedicated scanner hardware is not required.

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

## Guardian registration blocker QA

The PR #2 follow-up found and fixed one blocking defect: Guardian onboarding accessed the React submit event after awaiting authentication, so the form target was no longer safe to read and the screen remained on `Saving…`. The corrected handler captures values synchronously, disables repeat submission while saving, reports recoverable errors, and uses an authenticated atomic/idempotent database function for the distinct pet and guardianship writes.

Regression evidence on a clean local migration replay:

- all 19 version-controlled migrations and `supabase/seed.sql` applied successfully;
- all 5 pgTAP files / 80 assertions passed, including retry idempotency and cross-Guardian read denial;
- Guardian registration, two-click submission, exactly-one pet/guardianship verification, failure recovery, all other registration personas, all seeded persona sign-ins, Guardian isolation, cross-Partner authorization, and offer/claim/redemption passed in focused Chromium runs;
- the initial eight-worker browser batch logged a non-product local runner limitation: 6 navigation timeouts while 10 tests passed. Deterministic one-worker reruns passed and are the acceptance evidence;
- no remote Supabase database was changed, Checkpoint 5 was not started, and no decision-required defect remains.
