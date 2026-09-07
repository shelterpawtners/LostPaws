# Guardian pet Save blocker fix

Status: Ready for Codex execution on `qa/guardian-registration-personas`.

## Context

Automated Persona QA reproduced the Guardian onboarding bug reported manually by Jim.

Observed flow:

- fresh Guardian registration succeeds
- `/onboarding/guardian` loads
- pet fields can be entered
- clicking `Save and continue` leaves the UI on `Saving...`
- no pet persistence request is sent
- no guardianship relationship request is sent
- route remains `/onboarding/guardian`

Issue: #3 `BLOCKER: Guardian onboarding Save stalls before pet persistence`.

The current failure appears consistent with accessing the React form event/currentTarget after an asynchronous auth call. Treat that as the leading hypothesis, but verify the actual code path before changing it.

## Required implementation

Keep the change narrowly scoped to the current corrective PR. Do not begin full Phase 3 Passport work and do not begin Checkpoint 5.

1. Fix Guardian pet `Save and continue` so form values are captured safely before asynchronous work.
2. Persist the pet as a separate `pets` record.
3. Persist the Guardian-to-pet relationship through the existing guardianship model; do not embed pet data in the Guardian profile.
4. Make the operation safe against duplicate clicks/retries. A retry must not create duplicate pets or duplicate active guardianships.
5. Add a real pending/saving state and disable duplicate submission while the request is in flight.
6. Preserve a visible recoverable error state when persistence fails.
7. Navigate to the approved next route only after both required persistence steps succeed. Current Persona QA expects `/dashboard`.
8. Preserve current RLS boundaries and do not weaken authorization to make tests pass.
9. Preserve the approved UX decision that adding another role is supported but not a prominent onboarding CTA.

## Required tests

Update/add automated tests so they permanently cover:

- fresh Guardian registration
- pet creation
- guardianship creation
- successful advance to `/dashboard`
- double-click/retry does not create duplicate pet or guardianship records
- Guardian A can access their pet
- Guardian B cannot read/update Guardian A pet
- all seeded persona sign-ins continue to work
- Shelter registration continues to reach onboarding
- Pet Business registration continues to reach onboarding
- RAVE Vendor registration continues to reach onboarding
- multi-role option remains de-emphasized
- existing Partner offer -> Guardian claim -> redemption path remains green
- cross-partner offer/redemption isolation remains green

## Validation required before handoff

Run and report:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- clean local `supabase db reset`
- `supabase test db`
- focused Persona QA Playwright suite
- existing offer/redemption Playwright suite

Expected database baseline remains 4 pgTAP files / 72 assertions unless this fix adds justified assertions.

## Git workflow

Work on the existing branch:

`qa/guardian-registration-personas`

and existing PR #2 into:

`build/festival-mvp`

Push commits to that branch. Do not merge the PR. Allow GitHub Actions and Copilot review to run.

## Required return report

Return:

- root cause confirmed
- files changed
- final commit SHA
- exact test results
- PR #2 status
- Copilot review status/comments if available
- blockers or non-blockers remaining

Do not stop merely because another routine bug is found. Follow `docs/QA-AUTOMATION-POLICY.md`: document it, classify it, fix blockers, log non-blockers, add regression coverage, rerun, and continue unless a genuine Jim decision is required.
