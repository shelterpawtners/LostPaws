# Guardian pet-save bugfix and multi-role UX adjustment

Status: User-approved corrective work before Phase 2 Bundle A acceptance / next bundle.

## Context

Local product review found that Guardian account registration succeeds, but the Guardian follow-up pet-information form appears to stall on `Save and continue`. The expected behavior is to persist a distinct pet record, create/maintain the authenticated guardian-to-pet relationship, provide clear success/error feedback, and move the user to the next appropriate product surface. This is a narrow corrective prerequisite for validating the Guardian → marketplace → claim → redemption journey; it must not expand into the full Phase 3 Guardian + Shelter Passport build.

## Data-model requirement

- Pet identity remains a separate relational entity from the human user/profile.
- Guardian-to-pet access/relationship remains modeled through the existing guardianship relationship rather than embedding pet fields into the user or profile record.
- The supported flow must be compatible with one guardian having multiple pets, future multiple authorized guardians, shelter-to-guardian transfers, and preservation of pet history independent of human account changes.
- Do not create duplicate pet or guardianship records on retry.

## Guardian pet-save acceptance criteria

1. Authenticated Guardian can submit the existing pet-information form.
2. Server-authorized persistence creates or updates the intended pet record in the canonical pet table.
3. The authenticated Guardian is related to that pet through the canonical guardianship model.
4. RLS prevents a Guardian from creating/modifying another Guardian's pet relationship without authorization.
5. Retry/idempotency behavior does not create duplicate pets/guardianships from a single onboarding attempt.
6. Validation and database errors are surfaced visibly; the Save button must not appear to hang silently.
7. While saving, the UI provides clear in-progress state and prevents accidental duplicate submission.
8. On success, `Save and continue` performs an explicit next action rather than remaining ambiguously on the same form. For the current testing prerequisite, route to the Guardian dashboard or marketplace according to the existing product flow; do not invent full Phase 3 Passport functionality.
9. Add focused automated coverage for successful save/link, failure feedback, authorization, retry behavior, and post-save navigation.
10. Preserve all accepted Phase 1/Phase 2 behavior and do not begin Checkpoint 5 or full Phase 3 work as part of this fix.

## User-approved multi-role UX decision

Multi-role identity remains supported in the authorization/data model, but adding another role must NOT be a prominent primary action for ordinary users.

### UX direction

- Remove/de-emphasize prominent `add role`, `choose another role`, or similar calls-to-action from ordinary post-registration/dashboard journeys where they compete with the user's primary task.
- Keep the capability discoverable through lower-priority help/account surfaces, such as an account/settings or footer help link and FAQ guidance explaining how a user can request/add another role.
- Initial registration should remain focused on the one role the person is currently joining as.
- Do not remove the underlying multi-role architecture or authorization capability.
- If a person later needs another role, the same identity should be reusable rather than forcing a second account.

## Product rationale

Most users will operate in one primary context. Prominent multi-role controls add cognitive load and distract from Guardian, Shelter, or Partner onboarding. Multi-role support is an important edge capability and should remain available without being positioned as a normal next step for everyone.

## Workflow

Implement this corrective work on a feature branch and open a non-draft PR into `build/festival-mvp` so automatic Copilot review can run. Do not merge automatically. Run local Supabase migration/RLS tests, `npm run check`, build, and focused Playwright coverage before declaring completion.
