# AI Handoff

STATUS: BLOCKED
CURRENT_PHASE: Pre-cutover Launch Readiness
CURRENT_CHECKPOINT: Issue #32 / PR #33 — deterministic acceptance complete
NEXT_CHECKPOINT: Owner launch decisions and production cutover authorization
OWNER_DECISION_REQUIRED: YES
SAFE_TO_CONTINUE: NO
ACCEPTED_CODE_SHA: 08e0924aa1ed532f72b0c37be8d9f35dedd07d5e
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: LOCAL_HEAD

## Active task

Issue #32 — **Pre-cutover launch candidate: demo isolation, real adoption resources, signup/email readiness**

Agent: ChatGPT / GitHub operator

Branch: `launch/pre-cutover-readiness`

PR: #33

The accepted application/database code head is `08e0924aa1ed532f72b0c37be8d9f35dedd07d5e`. PR #33 remains open and must not be merged without owner authorization.

## Deterministic acceptance result

Exact-code acceptance is complete and green.

- CI: success — lint, shell lint, unit tests, build, CI Gate.
- Database QA: success — local Supabase reset/seed, full pgTAP/RLS suite, Database QA Gate.
- Hosted QA: success — LOCAL_HEAD golden paths, design QA, Issue #5 browser audit, Hosted QA Gate.
- Persona QA: success — Guardian/Shelter/PetBiz/RAVE registration, auth recovery, access isolation, Partner offer creation, Guardian claim, Partner redemption, camera/manual fallback, local Admin QA security regression, Persona QA Gate.
- Dependency Review: success.
- Merge Gate: success.

A prior Persona run caught an ambiguous Playwright locator after the non-demo Partner fixture was introduced. The test locator was narrowed without changing application behavior or weakening coverage; the full Persona suite then passed.

## Completed launch-readiness work

### Demo/QA isolation

- `20260910030000_launch_demo_public_isolation.sql` is applied in shared dev.
- Demo organizations/offers remain available for authenticated/Admin QA but are excluded from anonymous Marketplace, Partner Directory, and public-profile discovery.
- Future offers owned by demo organizations inherit demo state.
- Shared-dev public invariant remains 5 non-demo Marketplace programs.

### RPC execution boundary

- Accepted CP6 migrations are aligned in shared dev.
- `20260910031500_launch_rpc_execute_boundary.sql` is applied.
- Anonymous execution is denied for state-changing offer/redemption RPCs.
- Four intentional read-only public discovery RPCs remain anonymous-accessible.

### Public-program Marketplace Wave 1

- `20260910033000_launch_public_program_boundary.sql` is applied.
- Five source-backed `public_program` listings are live: PetSmart Adoption Kit, Adopt a Pet Shelter Plus, PetPartners 30-Day Coverage, Trupanion Adoption Day coverage, and BISSELL Empty the Shelters Fall 2026.
- Public/community resources cannot create ShelterPawtners claim/redemption tokens.
- Source-only organizations do not appear in the Partner Directory.
- Hosted QA may create additional demo/QA rows, so total raw offer count is not a launch invariant; anonymous discovery is the invariant.

### Signup/auth/recovery readiness

- Email/password signup preserves Guardian, Shelter, PetBiz, and RAVE Vendor onboarding routes through the confirmation `redirect_to` contract.
- Forgot-password returns to `/reset-password` on the current app origin.
- Invalid/expired/manual recovery URLs do not present an active password form.
- Auth recovery is permanently included in full Persona QA.

### Partner onboarding duplicate prevention

- Two historical nearly-empty shared-dev organizations named `Shelter Pawtners` were traced to `pet_business` rows created about two minutes apart by the same user. Evidence points to the older direct PetBiz creation path; they are not linked to the current onboarding-draft/access-request/duplicate-review workflow.
- `20260910045221_launch_partner_organization_idempotency.sql` is applied in shared dev and passed full Database QA.
- Exact same-draft retries now return the existing organization.
- Reuse of a resolved draft with a different payload is rejected.
- Resolved onboarding draft identity/payload cannot be rewritten or deleted.
- PetBiz/RAVE onboarding recognizes an already-resolved draft and routes the user back to the existing business profile instead of reopening creation.
- Full Persona claim/redemption QA now uses an isolated non-demo Partner fixture while preserving the complete public redemption journey.
- No destructive cleanup of the two historical organization shells was performed.

### Advisor state after final DDL

Security advisor was rerun after the idempotency migration.

- No new security regression was introduced.
- Two private RLS/no-policy INFO notices remain for intentionally locked `private.audit_events` and `private.secure_tokens`.
- Four anonymous SECURITY DEFINER warnings remain for intentional read-only public discovery RPCs.
- Authenticated SECURITY DEFINER warnings remain for application RPCs whose internal authorization remains covered by QA.
- Supabase leaked-password protection remains disabled and should be enabled before public traffic if available in the selected project configuration.

Performance advisor remains optimization work: 20 unindexed foreign-key notices, multiple permissive-policy warnings, and many unused-index notices in the low-traffic dev database. Acceptance found no correctness blocker from those findings.

## Production auth email readiness

`docs/LAUNCH-AUTH-EMAIL-READINESS.md` contains the pre-cutover plan.

- Microsoft 365 remains the human/business mailbox system.
- Preferred MVP transactional path is Resend on `auth.shelterpawtners.com` with `no-reply@auth.shelterpawtners.com`.
- No paid tier is currently recommended for controlled MVP launch volume.
- Provider account creation, credentials, DNS, final Supabase Auth configuration, and real external-email tests remain owner-controlled.

## Public signup/legal blocker

Registration requires agreement to Terms and acknowledgement of a Privacy Notice, but the repository has no owner-approved policy pages/links.

Do not fabricate or silently publish material legal policy text. Owner-approved Terms of Service and Privacy Notice content are required before public signup is enabled.

## Final owner gate

Autonomous engineering for this checkpoint is complete. Do not continue implementation, merge PR #33, or change production systems until the owner chooses the next action.

Owner-controlled launch actions:

1. provide/approve Terms of Service content;
2. provide/approve Privacy Notice content;
3. authorize/create the transactional-email provider account and credentials;
4. authorize transactional sending-subdomain DNS records;
5. authorize final Supabase production Site URL/redirect/email configuration and real external-email validation;
6. authorize Vercel custom-domain attachment and production web DNS cutover;
7. authorize merge of PR #33 when ready;
8. authorize Phase 3 separately after launch readiness/cutover decisions.

## Guardrails

Still owner-gated/deferred:

- PR #33 merge;
- production-domain/DNS/custom-domain routing;
- Microsoft 365 mail DNS changes;
- transactional-email provider account/credential/DNS activation;
- owner-approved Terms and Privacy Notice content;
- Phase 3 feature development;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` production giving provider/settlement;
- paid infrastructure unless separately approved;
- destructive cleanup or material privacy/security/financial/legal changes.
