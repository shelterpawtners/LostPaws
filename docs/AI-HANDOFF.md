# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Pre-cutover Launch Readiness
CURRENT_CHECKPOINT: Issue #32 / PR #33 — signup/auth/recovery readiness
NEXT_CHECKPOINT: Validate normal gates and production email/domain prerequisites, then final pre-cutover human review
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: PR_PREVIEW

## Active task

Issue #32 — **Pre-cutover launch candidate: demo isolation, real adoption resources, signup/email readiness**

Agent: ChatGPT / GitHub operator

Branch: `launch/pre-cutover-readiness`

PR: #33

Current auth/recovery implementation head before this handoff refresh: `f020cb5e78075d350dfe56fccc39c4513bbc3ef9`

## Completed launch-readiness work

### Demo/QA isolation

- `20260910030000_launch_demo_public_isolation.sql` is applied in shared dev.
- Shared dev retains 72 demo/QA offers for authenticated/Admin testing while anonymous/public surfaces exclude them.
- Public Marketplace/directory/profile RPCs exclude demo data.

### Shared-dev CP6 + RPC boundary alignment

- Accepted CP6 migrations are aligned in shared dev.
- `20260910031500_launch_rpc_execute_boundary.sql` is applied.
- Anonymous execution is denied for the nine state-changing offer/redemption RPCs while deliberate read-only public RPCs remain available.

### Public-program Marketplace boundary + Wave 1

- `20260910033000_launch_public_program_boundary.sql` is applied.
- Public/community resources cannot create ShelterPawtners claim/redemption tokens.
- Marketplace UI routes external public benefits to official sources and labels them separately from participant offers.
- Five source-backed `public_program` listings are live in shared dev: PetSmart Adoption Kit, Adopt a Pet Shelter Plus, PetPartners 30-Day Coverage, Trupanion Adoption Day coverage, and BISSELL Empty the Shelters Fall 2026.
- Shared dev currently has 77 total offer rows = 72 retained demo rows + 5 public-program rows; the anonymous Marketplace returns only the 5 real public programs.
- Source-only organizations do not appear in the Partner Directory.

### Signup/auth/recovery readiness implemented

- Email/password signup sets `emailRedirectTo` to `/onboarding/{persona}` so Guardian, Shelter, PetBiz, and RAVE Vendor users return to the onboarding route they selected after confirmation.
- Four-persona Playwright regression coverage inspects the actual Supabase signup `redirect_to` contract.
- Forgot-password already targets `${location.origin}/reset-password`; dedicated launch regression coverage now verifies the actual recovery request `redirect_to` contract.
- `/reset-password` now checks application auth state before presenting a password update form. A manual, expired, invalid, or already-consumed unauthenticated recovery URL shows `Recovery link unavailable` and links back to `/forgot-password` instead of presenting a misleading active password form.
- Existing authenticated password update still uses Supabase `updateUser({ password })`.
- Both temporary one-shot workflows used for the narrow auth changes removed themselves after committing; no temporary auth patch workflow remains in the branch.
- Automation-authored commits can cause downstream GitHub workflow `action_required` states, so this direct handoff commit intentionally retriggers the standard PR gates under the repository actor.

## Last fully green validation checkpoint

Before the recovery-state addition, the persona-preserving confirmation redirect was revalidated successfully in Persona QA, Hosted QA, Database QA, Dependency Review, and Merge Gate; the general CI lane had not yet completed when the next recovery hardening change was started.

The active branch Marketplace preview remains:

`https://lost-paws-git-launch-pre-cutover-135ab9-jims-projects-acec6bcb.vercel.app/marketplace`

## Advisor state

Security advisor findings remaining are unchanged launch-hardening items rather than regressions introduced by the Marketplace work:

- intentionally locked private tables with RLS and no public policies;
- four intentional anonymous read-only `SECURITY DEFINER` discovery RPCs;
- authenticated application RPCs with existing authorization checks;
- leaked-password protection disabled.

Performance advisor still reports broader optimization items including unindexed foreign keys, unused indexes in the low-traffic dev environment, and multiple permissive policies. Do not expand Issue #32 into a wholesale RLS/index rewrite without evidence of a launch blocker.

## Remaining Issue #32 work

1. Revalidate all standard gates on the auth/recovery implementation and prove the new recovery regression runs in an appropriate QA lane.
2. Determine production-suitable custom SMTP/auth email requirements. Supabase default SMTP is development-only/restricted; do not purchase infrastructure or alter Microsoft 365/DNS without owner authorization.
3. Prepare final-domain Auth site/redirect URL requirements but apply them only after owner authorization for the production-domain gate; then verify email confirmation and password reset end-to-end.
4. Complete final desktop/tablet/phone review with real launch content and no demo/example.invalid leakage.
5. Reverify time-sensitive third-party public-program claims immediately before cutover.
6. Keep the two nearly empty `Shelter Pawtners` test organization shells non-destructively reviewed; do not delete without a reason.
7. Stop before production DNS/custom-domain routing and present the owner gate when all pre-cutover items that can be completed autonomously are green.

## Guardrails

Still owner-gated/deferred:

- production-domain/DNS/custom-domain routing;
- Microsoft 365 mail DNS changes;
- Phase 3 feature development;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` production giving provider/settlement;
- paid infrastructure unless separately approved;
- destructive cleanup or material privacy/security/financial/legal changes.

## Recommended next action

Continue directly through deterministic auth/recovery validation, SMTP/domain prerequisite analysis, and final browser review. Keep PR #33 open and `STATUS: IN_PROGRESS` until Issue #32 reaches the explicit domain/cutover owner gate.
