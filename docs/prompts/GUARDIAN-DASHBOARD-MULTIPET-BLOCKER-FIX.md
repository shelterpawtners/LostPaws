# Guardian dashboard existing-pet and multi-pet blocker fix

Status: Ready for Codex execution on `qa/guardian-registration-personas` / PR #2.

## Context

Jim's manual Guardian UX review failed after the pet-save blocker was fixed.

Observed behavior:

- Guardian registration succeeds.
- `Save and continue` now persists the pet successfully.
- After reaching the Guardian main/dashboard experience, the UI still presents a generic `Set up your pet` action.
- The saved pet is not surfaced for reopening/management.
- The CTA risks sending a Guardian who already has a pet into another onboarding flow and creating a duplicate pet.

GitHub issue: #4 `BLOCKER: Guardian dashboard ignores saved pets and routes to duplicate pet setup`.

## Product direction from UX review

The Guardian experience is pet-centric and must support multiple pets over time.

Current corrective scope should establish this model without expanding into the full future Passport feature set:

- Guardian dashboard should resolve pets through active guardianships.
- Existing pets should be shown as individual selectable cards/tiles.
- Multiple active pets must all render.
- `Add another pet` must be a separate explicit action from managing existing pets.
- The empty-state `Set up your pet` experience should only render when the Guardian has no active related pets.

Future Phase 3 work may enrich pet images, detailed pet profiles, transfer/co-guardian workflows, deceased/inactive lifecycle management, and other Passport capabilities. Do not implement those beyond what is needed to make the current UX coherent.

## Required implementation

1. Inspect the current Guardian dashboard/main profile implementation and identify the source of the static `Set up your pet` state.
2. Query the authenticated Guardian's active guardianships and related active pets using the existing authorization/RLS model.
3. Render all active related pets, not only the first.
4. Each pet card/tile should show currently available key details such as name and species; use an existing photo field only if already supported safely.
5. Make each existing pet selectable and route to the narrowest currently supported existing-pet detail/edit experience. If no existing edit route exists, add the minimum current-scope pet management/detail route needed to display that pet without launching create-new onboarding.
6. Add a separate `Add another pet` action that intentionally starts a new-pet flow.
7. Show the empty-state setup CTA only when no active pet is related to the Guardian.
8. Do not weaken RLS, authorization, or guardianship semantics.
9. Do not begin Checkpoint 5 or full Phase 3.
10. Preserve the already-fixed atomic/idempotent Guardian onboarding save behavior.

## Required regression coverage

Add/update automated tests proving:

- a newly registered Guardian who saves a pet sees that same pet on the dashboard after navigation;
- the dashboard does not show the empty-state `Set up your pet` CTA when at least one active pet exists;
- a Guardian with two active pets sees both;
- existing pet selection does not route to create-new onboarding;
- `Add another pet` remains available as a distinct action;
- a Guardian with no active pets sees the empty state;
- Guardian B cannot see Guardian A pets;
- existing offer/claim/redemption tests remain green;
- existing registration/persona tests remain green.

## Validation required before handoff

Run and report:

- `npm run check`
- `npm run build`
- clean local `supabase db reset`
- `supabase test db`
- focused Guardian registration/dashboard Playwright tests
- persona access/isolation Playwright
- existing offer/redemption Playwright

Follow `docs/QA-AUTOMATION-POLICY.md`: fix routine blockers autonomously, log non-blockers, rerun tests, and continue. Do not stop merely to report a routine defect.

## Git workflow

Work on:

`qa/guardian-registration-personas`

and existing PR #2 into:

`build/festival-mvp`

Push completed corrective work to that branch. Do not merge PR #2.

## Required return report

Return:

- root cause
- files changed
- final commit SHA
- exact automated validation results
- PR #2 status
- Copilot review findings/status
- remaining blockers/non-blockers
- whether the Guardian UX is ready for Jim to retest
