# Issue #11 Partner Profile Persistence Blocker

## Symptom

Persona QA run #39 fails in `e2e/phase-2-offer-redemption.spec.ts` after Partner profile draft save and browser reload.

Expected `Public description`:

`A focused Playwright Partner profile for the marketplace golden path.`

Received after reload: empty string.

## Evidence

- CI run #111 passes.
- Persona QA pgTAP passes 84/84.
- Persona browser suite reaches 20 passing tests before this failure.
- Failure occurs in Partner profile persistence portion of the golden path.

## Required investigation

Determine whether:

1. `organization_partner_profiles` upsert is not persisting `public_description`,
2. save reports success before all required writes actually succeed,
3. reload selects a different Partner organization membership because organization ordering is not deterministic,
4. profile reload query is racing or reading the wrong row,
5. or the Playwright test is making an invalid assumption.

Fix the actual root cause. Do not weaken the persistence assertion merely to make the test green.

## Acceptance

The Partner Admin flow must preserve the saved public description across a browser reload on `/business`, keep the same organization selected, and reload the required draft fields correctly.

Then continue the existing profile publish, offer publish, Guardian discovery, claim, and redemption golden path.

Run relevant local checks where available and rely on Persona QA CI for provisioned Supabase/Chromium execution.

Do not begin Checkpoint 5 or Phase 3.
