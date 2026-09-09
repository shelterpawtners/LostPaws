# Phase 2 Checkpoint 2 — Final Completion Prompt

Checkpoint 2 is not yet accepted.

Current remote baseline:

`b151e86b3d9c3b3154b3771468c17c0d7f5011be`

Do not restart or redesign completed work. Do not begin Checkpoint 3.

The prior completion/QA pass fixed the public profile-details privacy boundary, but it did not finish all required Checkpoint 2 editor and validation scope. Complete only the remaining items below and preserve all accepted Checkpoint 1 behavior plus existing Checkpoint 2 migrations/routes.

## Required remaining implementation

### 1. Finish authenticated Partner profile editing

The `/business` Partner editor must let an authorized organization owner/administrator/publisher manage the approved Checkpoint 2 public profile fields that already exist in the model, including where applicable:

- public description;
- public about;
- business model;
- public website;
- public email;
- public phone;
- booking URL;
- order/ecommerce URL;
- service area;
- categories;
- species served;
- social links;
- business hours;
- existing location/service-area context;
- private primary contact;
- private operational/redemption contact.

Do not expose private contacts publicly.

Do not add logo upload unless a safe existing storage workflow already exists; logo remains an approved deferral.

### 2. Complete directory filters already supported by the RPC

Expose practical UI filters for the already-supported public directory query inputs:

- category;
- city;
- state;
- business model;
- species.

Do not add advanced geospatial search.

### 3. Complete publish/unpublish behavior

Authorized Partners must be able to:

- save draft;
- publish when server-side minimum requirements pass;
- unpublish without deleting history.

Suspended/removed states remain platform-admin controlled.

### 4. Finish Partner UI maintainability refactor

The accepted Checkpoint 1 onboarding flow must not remain a growing monolith in `src/main.tsx` if Checkpoint 2/3 expansion would compound it.

Extract the Partner onboarding/profile boundary enough that:

- `src/main.tsx` remains primarily route/app composition;
- Partner onboarding/profile components and data calls are isolated into maintainable modules;
- accepted Checkpoint 1 behavior remains unchanged.

Do not perform unrelated refactoring.

### 5. Add the missing Checkpoint 2 automated tests

Add committed automated coverage for at least:

- Partner A cannot edit Partner B profile/private contacts;
- revoked former creator cannot edit profile/private contacts;
- public users cannot read private contacts;
- unpublished profile is absent from public RPCs;
- suspended profile is absent from public RPCs;
- removed profile is absent from public RPCs;
- minimum publication requirements are enforced server-side;
- online/national/service-area Partner can publish without fake street address;
- invalid social-link protocol/value is rejected;
- public profile-details RPC excludes private-contact fields;
- unpublish removes the listing from public RPCs without deleting the profile;
- Checkpoint 1 tests remain intact;
- `npm run check` passes;
- `npm run build` passes.

If Docker/Supabase CLI or authenticated Playwright credentials are unavailable in Work, commit the required pgTAP/Playwright coverage and record execution as environment-blocked. Do not omit the tests simply because they cannot run there.

### 6. Browser/mobile/accessibility review

Review the actual rendered behavior for:

- `/business`;
- `/directory`;
- `/partners/:id`;
- preserved Partner onboarding.

Where the Work browser can run, exercise desktop and mobile widths and fix bounded defects. If authenticated browser execution is blocked by environment credentials, record that accurately.

## Security requirements

- Preserve RLS.
- Do not make SECURITY DEFINER functions executable by roles beyond what is required.
- Public RPCs must use explicit allowlists and published-state checks.
- Private contact tables must remain inaccessible to anon and unrelated authenticated users.
- Publication/unpublication/moderation must be enforced server-side, not UI-only.
- Revoked memberships must not retain edit authority.

## Documentation

Update `docs/PHASE-2-CHECKPOINT-2-PROGRESS.md` so required Checkpoint 2 features are no longer described as deferred if they are part of this prompt.

Allowed remaining deferrals:

- logo upload/storage workflow;
- dedicated admin moderation UI if the server-side moderation foundation exists and later admin UI is already assigned to Checkpoint 7;
- live offer indicators because offer implementation belongs to Checkpoint 3;
- environment-blocked execution of committed local pgTAP/Playwright tests.

Do not defer required profile editing, directory filters, unpublish, maintainability refactor, or committed automated tests.

Update `docs/CURRENT-WORK.md` only after the above is complete.

## Completion

Before declaring success:

1. finish the remaining code;
2. run all tests available in the environment;
3. fix bounded defects;
4. update evidence/docs;
5. commit and push to `build/festival-mvp` using the connected GitHub integration if normal HTTPS push credentials are unavailable;
6. confirm the remote branch SHA;
7. do not begin Checkpoint 3.

Return a completion report with:

- files changed;
- remaining features completed;
- tests added and tests actually executed;
- environment-blocked validations;
- security/privacy review result;
- mobile/accessibility review result;
- known limitations;
- final remote commit SHA.
