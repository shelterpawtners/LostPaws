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
- the production build passed with the advisory that the main minified JavaScript chunk is 514.82 kB; this is logged as non-blocking optimization work and does not affect the corrected journey;
- local Chromium emitted a non-blocking GPU `debug.log`; the generated artifact is now ignored and did not affect browser results;
- no remote Supabase database was changed, Checkpoint 5 was not started, and no decision-required defect remains.

## Guardian dashboard multi-pet blocker QA

GitHub Issue #4 was confirmed as a blocking UX defect: the Guardian dashboard rendered a static `Set up your pet` card without loading the user's saved pets. The corrected dashboard queries only active, non-ended guardianships through the authenticated browser and existing RLS policies, renders every related pet as an individually selectable card, and separates `Add another pet` from existing-pet management. A minimum read-only `/pets/:petId` route displays only a pet returned through that Guardian's active relationship and does not enter create-new onboarding.

Validation evidence:

- clean local reset replayed all 19 migrations in filename order and applied `supabase/seed.sql`;
- all 5 pgTAP files / 80 assertions passed;
- focused Chromium Guardian dashboard coverage passed 3/3, including two pets, empty state, cross-Guardian isolation, a 390×844 responsive viewport with no horizontal overflow, and keyboard activation of an existing pet;
- the combined Guardian registration/dashboard, seeded persona isolation, and offer/claim/redemption run passed 24/24, including recoverable session-verification failure;
- the saved-pet registration regression proves the newly created pet appears after dashboard navigation, `Set up your pet` is absent, `Add another pet` remains distinct, and pet selection opens `/pets/:petId` rather than onboarding;
- no database migration or authorization-policy change was needed for Issue #4, no remote Supabase database was changed, and Checkpoint 5 was not started.

Copilot's first review recommended a non-future migration filename, explicit missing-environment failures in browser tests, lazy submission-ID initialization, and recovery from a thrown session-verification request. All findings were treated as routine pre-merge blockers, corrected, and covered by the final validation run.
