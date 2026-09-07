# Copilot QA Prompt — Phase 2 Checkpoint 1

## Partner Organization Foundation

Repository: `shelterpawtners/LostPaws`
Branch: `build/festival-mvp`
Checkpoint implementation commit: `c4b39564fa740285974a057645523e26b5ee583f`

Perform QA only for Phase 2 Checkpoint 1. Do not begin Checkpoint 2.

Read and follow:

- `AGENTS.md`
- `.github/copilot-instructions.md`
- relevant `.github/instructions/*`
- `docs/CURRENT-WORK.md`
- `docs/DECISION-LOG.md`
- `docs/PHASE-2-EXECUTION-PLAN.md`
- `docs/PHASE-2-CHECKPOINT-1-PROGRESS.md`
- `docs/prompts/PHASE-2-CHECKPOINT-1-CODEX.md`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY-AND-PRIVACY.md`
- `docs/USER-ROLES.md`
- `docs/phases/PHASE-2.md`
- all Checkpoint 1 migrations, tests, and implementation files

## User-approved UX rule

Partner onboarding is entry-first, not search-first:

business details form → assisted matching while details are entered → possible matches shown beside the form on desktop and accessibly on mobile → user may request access, request ownership review, dismiss a false positive, or continue creating a genuinely separate business.

Candidate matches are guidance only. They never prove representation, ownership, membership, or control.

## QA objectives

Review the implementation for correctness, security, maintainability, UX integrity, and regression risk. Focus especially on:

1. RLS and authorization bypasses.
2. Access/ownership requests accidentally granting membership or control.
3. Organization creator or membership rules leaving unintended permanent control paths.
4. Parent/child, sibling, franchise, and branded-relationship privilege leakage.
5. Candidate function exposing private organization information.
6. Candidate matching false positives/false negatives and explainability.
7. Duplicate-review records being visible or writable to ordinary users.
8. Audit events being forgeable, editable, or incomplete.
9. Draft business data privacy.
10. Destructive or irreversible duplicate/relationship behavior.
11. Race conditions or duplicate organization creation under repeated submit/double-click/concurrent actions.
12. Multiple-location ownership and RLS boundaries.
13. Mobile and accessibility behavior of form + match panel.
14. Error handling and partial-failure behavior when organization creation succeeds but membership/location/relationship/draft resolution fails.
15. Whether the large Checkpoint 1 addition to `src/main.tsx` should be decomposed now to avoid maintainability debt before Checkpoint 2 expands the application.
16. Regression against Phase 1 auth, roles, onboarding, RLS, and existing flows.

## Specific database review

Inspect:

- `supabase/migrations/20260907100000_phase_2_partner_organization_foundation.sql`
- `supabase/migrations/20260907101500_phase_2_partner_organization_touch.sql`
- `supabase/migrations/20260907103000_fix_organization_review_audit_trigger.sql`
- `supabase/tests/phase_2_checkpoint_1_rls.sql`

Confirm or challenge:

- organization draft rows are private to their creator;
- candidate dismissals are user scoped;
- candidate matching requires authentication and returns public identifying context only;
- membership and ownership requests remain pending until authorized resolution;
- ordinary users cannot approve their own access/ownership request;
- ordinary users cannot create/manage duplicate-review cases;
- corporate parent assignment requires actual management authority;
- franchise relationship creation does not grant access to the target/brand organization;
- sibling organizations inherit no access;
- audit evidence is private and append-oriented;
- creator-based organization update rules do not create an unintended authorization path after later membership/control changes.

## Required validation

Run everything possible in the available environment:

- `npm run check`
- `npm run build`
- Phase 1 existing tests
- Phase 2 Checkpoint 1 pgTAP suite
- relevant Playwright onboarding flow
- browser/mobile/accessibility review

If Docker/local Supabase or Playwright credentials are unavailable, do not pretend the gate passed. Clearly distinguish:

- PASS — executed successfully;
- CODE REVIEW PASS — inspected but not executed;
- BLOCKED — environment prevents execution;
- FAIL — defect found.

Do not weaken tests or skip security checks merely to obtain a green result.

## Fix policy

You may fix bounded Checkpoint 1 defects you identify, including tests, RLS, authorization, accessibility, error handling, or maintainability issues.

Do not expand into Partner public profiles, directory, offers, redemptions, savings, giving, or Checkpoint 2 functionality.

For any fix:

1. preserve the approved entry-first assisted-matching UX;
2. add/update tests where appropriate;
3. update checkpoint progress/decision documentation if material;
4. rerun applicable validation;
5. commit and push the QA fixes to `build/festival-mvp`.

Escalate rather than guessing only if a defect requires a material change to organization ownership/control policy, privacy/security policy, destructive data behavior, or another approved business rule.

## Completion report

Return:

1. overall QA result: PASS / CONDITIONAL PASS / FAIL;
2. findings ordered Critical / High / Medium / Low;
3. fixes made;
4. files changed;
5. RLS/security assessment;
6. franchise/parent/sibling isolation assessment;
7. candidate matching/privacy assessment;
8. draft/privacy assessment;
9. partial-failure/concurrency assessment;
10. maintainability assessment of `src/main.tsx`;
11. exact test/build/browser results;
12. tests that could not be executed and why;
13. remaining risks or OPEN DECISION items;
14. commit SHA if fixes were pushed;
15. recommendation whether Checkpoint 1 is ready for acceptance.

Do not begin Checkpoint 2.