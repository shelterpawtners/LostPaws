# Phase 2 Checkpoint 2 — Completion and QA Prompt

Checkpoint 2 has been partially implemented and published at commit `78beead97cc6903d8bde14c2b0d3e455ad6f2b56` on `build/festival-mvp`.

Do not restart the checkpoint and do not begin Checkpoint 3.

Use the existing implementation as the baseline and complete only the missing Checkpoint 2 requirements plus bounded QA fixes.

Read:
- `AGENTS.md`
- `docs/CURRENT-WORK.md`
- `docs/PHASE-2-EXECUTION-PLAN.md`
- `docs/phases/PHASE-2.md`
- `docs/prompts/PHASE-2-CHECKPOINT-2-CODEX.md`
- `docs/PHASE-2-CHECKPOINT-2-PROGRESS.md`
- `docs/DECISION-LOG.md`
- current Checkpoint 2 migrations/components/tests

## Confirm and preserve completed work

Preserve:
- `organization_partner_profiles`
- `organization_private_contacts`
- `organization_social_links`
- `organization_business_hours`
- server-side publication validation
- public/private contact separation
- `/directory`
- `/partners/:id`
- `/business`
- online/national/mobile/service-area modeling
- accepted Checkpoint 1 behavior

Do not redesign these unless a defect requires a bounded correction.

## Missing/unfinished Checkpoint 2 work to complete

The current progress record states that UI maintainability and automated validation are still in progress. The original Checkpoint 2 prompt also requires functionality that is not yet fully exposed in the Partner editor.

Complete at minimum:

1. Finish the Partner UI/API refactor so Checkpoint 2 does not leave the accepted onboarding flow growing inside `src/main.tsx`. Extract the Partner onboarding/profile boundary enough that Checkpoint 3 can expand safely without another large monolithic addition.

2. Complete the authenticated Partner profile editor for the approved Checkpoint 2 profile model. Where applicable and useful, allow authorized users to manage:
   - public description/about;
   - business model;
   - public website/email/phone where owned by the organization model;
   - booking/order URLs;
   - service area;
   - categories;
   - species served;
   - social links;
   - business hours;
   - private primary contact;
   - private operational/redemption contact;
   - existing locations/service-area context.

   Do not add logo upload unless a safe existing storage workflow already supports it. A documented deferral for logo upload remains acceptable.

3. Ensure public Partner profile rendering uses the approved public fields that exist, including public links/socials/hours/location/service-area where available, while never exposing private operational contacts.

4. Ensure the public directory exposes the useful filters already supported by the underlying RPC where practical in this checkpoint, including category/city/state/business model/species. Do not build advanced geospatial search.

5. Confirm publication/unpublication behavior. Authorized Partners must be able to publish once minimum-safe requirements are satisfied and unpublish without deleting history. Suspended/removed states remain admin-controlled.

6. Add/complete automated Checkpoint 2 validation. At minimum cover:
   - Partner A cannot edit Partner B profile/private contacts;
   - revoked former creator cannot edit profile/private contacts;
   - public users cannot read private contacts;
   - unpublished/suspended/removed profiles are absent from public RPCs/pages;
   - minimum publication rules are enforced server-side;
   - nationwide/online/service-area businesses can publish without a fake street address;
   - social links are constrained to valid supported values/URLs;
   - public RPCs expose only public data;
   - Checkpoint 1 tests remain intact;
   - `npm run check` passes;
   - `npm run build` passes;
   - relevant Playwright flows run when environment credentials are available and otherwise are explicitly recorded as blocked rather than silently omitted.

7. Perform desktop/mobile/accessibility review for:
   - `/business`
   - `/directory`
   - `/partners/:id`
   - preserved Checkpoint 1 Partner onboarding

8. Fix bounded defects found during QA.

## Security review focus

Review the new public RPCs and profile RLS carefully. Pay special attention to:
- SECURITY DEFINER functions and execution grants;
- public/private data leakage;
- suspended/removed publication states;
- revoked memberships;
- cross-organization edits;
- public social/hours tables;
- server-side publication validation;
- whether public directory/profile RPCs can expose unpublished organizations or private fields.

Do not weaken RLS to make the UI work.

## Documentation

Update `docs/PHASE-2-CHECKPOINT-2-PROGRESS.md` so every Checkpoint 2 requirement is clearly one of:
- Complete
- Deferred by approved non-goal
- Blocked by environment

Do not leave required checkpoint items as "In progress" when declaring completion.

Update `docs/CURRENT-WORK.md` to `Checkpoint 2 complete pending product/QA acceptance` only after the required work and QA above are finished.

Record meaningful implementation/QA decisions in `docs/DECISION-LOG.md`.

## Completion

When finished:
- commit and push all bounded Checkpoint 2 completion/QA work to `build/festival-mvp`;
- do not begin Checkpoint 3;
- report files/migrations changed, test results, browser/mobile/accessibility results, remaining environment-blocked validations, known limitations, and final remote commit SHA.
