# AI Handoff

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Phase 3 — Lost Lands MVP
CURRENT_CHECKPOINT: LL-1 / Issue #36 — Guardian Digital Pet Passport foundation
NEXT_CHECKPOINT: LL-2 — premium Marketplace polish and end-to-end offer experience
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: LOCAL_HEAD

## Active task

Issue #36 — **PHASE 3 CP1: Guardian Passport profile-lite + guardianship-based pet editing**

Agent: ChatGPT / GitHub operator

Branch: `phase3/guardian-passport-foundation`

PR: #37

Current implementation head before this handoff update: `1a920d5a65415843d998d6bd4a0c70c6f231193b`.

## Owner authorization

On 2026-09-10 the owner explicitly authorized autonomous continuation through the remaining MVP, including merging green implementation PRs and beginning/continuing Phase 3. The main `shelterpawtners.com` production web-domain cutover remains separately gated. Paid services, destructive production-data changes, Microsoft 365 mail DNS changes, OD-003 rule invention, OD-004 settlement decisions, and final publication of unreviewed Terms/Privacy remain prohibited.

## LL-1 implementation

- Added Guardian private profile-lite editing for `profiles.full_name`, `phone`, and `instagram_handle`.
- Added editable private Digital Pet Passport basics for `name`, `species`, `breed`, `birth_date`, and `altered_status`.
- Preserved adoption self-report as read-only context in this checkpoint.
- Replaced creator-based ongoing pet UPDATE authority with active primary-guardianship authority.
- Kept `pets.created_by` as provenance only.
- Did not broaden pet read access or grant co-Guardian edit authority.
- Added focused pgTAP/RLS tests covering primary Guardian edit, unrelated Guardian denial, co-Guardian denial, historical creator denial, and self-only profile updates.
- Added focused Playwright coverage for profile persistence, Passport persistence, navigation, and cross-Guardian denial.
- Added the Passport spec to the full Persona QA suite.
- Removed the temporary wiring workflow after it completed successfully; no helper workflow remains in the branch diff.

## Acceptance state

The initial PR-triggered Persona run was gate-only because this handoff still carried the prior pre-cutover `BLOCKED` status. That gate-only green is not acceptance evidence.

This handoff deliberately switches LL-1 to `READY_FOR_ACCEPTANCE` so the required full browser Persona job, local Admin QA security regression, Database QA, CI, Hosted QA, Dependency Review, and Merge Gate can run against the actual LL-1 branch head.

Do not merge PR #37 until the required LL-1 acceptance jobs have run rather than merely skipped and all required gates are green.

## Next safe action

Run/observe deterministic LL-1 acceptance. Fix any reproducible in-scope defect without weakening tests or RLS. When all required gates pass, update this handoff to COMPLETE with the accepted SHA, merge PR #37 into `main` under the owner's standing authorization, close Issue #36 if appropriate, and immediately begin LL-2.
