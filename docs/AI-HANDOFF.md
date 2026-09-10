# AI Handoff

STATUS: READY_FOR_ACCEPTANCE
CURRENT_PHASE: Pre-cutover Launch Readiness
CURRENT_CHECKPOINT: Issue #32 / PR #33 — autonomous pre-cutover acceptance
NEXT_CHECKPOINT: Run exact-code LOCAL_HEAD Persona/Hosted acceptance, fix deterministic regressions, then stop at final owner launch gate
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES
ACCEPTED_CODE_SHA: NONE
ACCEPTANCE_DEPLOYED_SHA: NONE
ACCEPTANCE_RUNTIME: LOCAL_HEAD

## Active task

Issue #32 — **Pre-cutover launch candidate: demo isolation, real adoption resources, signup/email readiness**

Agent: ChatGPT / GitHub operator

Branch: `launch/pre-cutover-readiness`

PR: #33 (acceptance)

Formatted acceptance control-plane head before this direct retrigger: `8e896f7a29d0283961e79aa1bbff7a8ef8258fc2`

## Acceptance intent

`READY_FOR_ACCEPTANCE` is being used only to run the repository's full deterministic Persona/Hosted browser suites. It is not authorization to merge PR #33, change production DNS, attach production custom domains, create external provider accounts, publish owner-unapproved legal terms, or begin Phase 3.

`ACCEPTANCE_RUNTIME: LOCAL_HEAD` is intentional because Vercel is currently build-rate-limiting new previews. Exact-code local acceptance is preferred over paying to bypass a temporary hosting quota.

## Completed launch-readiness work

### Demo/QA isolation

- `20260910030000_launch_demo_public_isolation.sql` is applied in shared dev.
- Shared dev retains 72 demo/QA offers for authenticated/Admin testing while anonymous/public surfaces exclude them.
- Public Marketplace/directory/profile RPCs exclude demo data.
- Latest public-data audit returns 5 intentional Marketplace programs, 0 suspicious demo/QA/example.invalid Marketplace strings, and 0 public Partner Directory rows.

### Shared-dev CP6 + RPC boundary alignment

- Accepted CP6 migrations are aligned in shared dev.
- `20260910031500_launch_rpc_execute_boundary.sql` is applied.
- Anonymous execution is denied for the nine state-changing offer/redemption RPCs while deliberate read-only public RPCs remain available.

### Public-program Marketplace boundary + Wave 1

- `20260910033000_launch_public_program_boundary.sql` is applied.
- Public/community resources cannot create ShelterPawtners claim/redemption tokens.
- Marketplace UI routes external public benefits to official sources and labels them separately from participant offers.
- Five source-backed `public_program` listings are live in shared dev: PetSmart Adoption Kit, Adopt a Pet Shelter Plus, PetPartners 30-Day Coverage, Trupanion Adoption Day coverage, and BISSELL Empty the Shelters Fall 2026.
- Shared dev has 77 total offer rows = 72 retained demo rows + 5 public-program rows; the anonymous Marketplace returns only the 5 real public programs.
- Source-only organizations do not appear in the Partner Directory.

### Signup/auth/recovery readiness

- Email/password signup sets `emailRedirectTo` to `/onboarding/{persona}` so Guardian, Shelter, PetBiz, and RAVE Vendor users return to the onboarding route they selected after confirmation.
- Four-persona Playwright regression coverage inspects the actual Supabase signup `redirect_to` contract.
- Forgot-password targets `${location.origin}/reset-password`; dedicated launch regression coverage verifies the actual recovery request `redirect_to` contract.
- `/reset-password` checks application auth state before presenting a password update form.
- A manual, expired, invalid, or already-consumed unauthenticated recovery URL shows `Recovery link unavailable` and links back to `/forgot-password` instead of presenting a misleading active password form.
- Existing authenticated password update continues through Supabase `updateUser({ password })`.
- Full Persona QA now permanently includes `e2e/auth-recovery.spec.ts`.

### Production auth email readiness

- `docs/LAUNCH-AUTH-EMAIL-READINESS.md` documents the pre-cutover plan.
- Supabase built-in SMTP is treated as development/testing only.
- Microsoft 365 remains the human/business mailbox system instead of becoming an application SMTP dependency.
- Preferred MVP transactional path is Resend with a dedicated `auth.shelterpawtners.com` sending subdomain and `no-reply@auth.shelterpawtners.com` sender.
- No paid tier is currently recommended for the controlled MVP.
- Provider account creation, credentials, sending-domain DNS, final Auth Site URL/redirect allowlist, and real external-email validation remain owner-controlled production actions.

### Public signup/legal finding

Registration currently requires agreement to the Terms and acknowledgement of the Privacy Notice, but those labels are not links and the repository contains no owner-approved corresponding policy pages.

Do not fabricate or silently publish material legal policy text. Owner-approved Terms of Service and Privacy Notice content are required before public signup is enabled at production cutover.

## Acceptance requirements now running

The exact-code acceptance must prove, rather than infer, that:

1. the full Persona browser job actually runs rather than only its lightweight gate;
2. `e2e/auth-recovery.spec.ts` executes and passes;
3. fresh Guardian, Shelter, PetBiz, and RAVE Vendor flows remain green;
4. offer/redemption and access-isolation regressions remain green;
5. Hosted QA uses `LOCAL_HEAD` and runs the relevant exact-code browser/design/accessibility suites rather than a stale Vercel preview;
6. normal CI, Database QA, Dependency Review, and Merge Gate remain green.

Any genuine deterministic failure returns the work to `IN_PROGRESS`, is fixed without weakening tests, and is revalidated.

## Known non-code constraints

- Vercel is currently rate-limiting new builds; this is not an application defect.
- `shelterpawtners.com` / `www.shelterpawtners.com` remain unattached to Vercel and DNS is unchanged.
- Supabase leaked-password protection remains disabled and should be enabled before public traffic if available in the selected project configuration.
- Performance advisor findings remain broader optimization work unless acceptance demonstrates a launch blocker.
- Two nearly empty `Shelter Pawtners` shared-dev organization shells remain non-destructively reviewed and are not public directory records.

## Final owner gate after deterministic acceptance

When exact-code acceptance is green, set the handoff to `BLOCKED`, `OWNER_DECISION_REQUIRED: YES`, and `SAFE_TO_CONTINUE: NO` rather than merging or changing production systems.

Remaining owner-controlled launch actions will be:

1. provide/approve Terms of Service content;
2. provide/approve Privacy Notice content;
3. authorize/create the transactional-email provider account and credentials;
4. authorize the transactional sending-subdomain DNS records;
5. authorize final Supabase production Site URL/redirect/email configuration and real external-email tests;
6. authorize Vercel custom-domain attachment and production web DNS cutover;
7. authorize Phase 3 separately after launch readiness is complete.

## Guardrails

Still owner-gated/deferred:

- production-domain/DNS/custom-domain routing;
- Microsoft 365 mail DNS changes;
- transactional-email provider account/credential/DNS activation;
- owner-approved Terms and Privacy Notice content;
- Phase 3 feature development;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` production giving provider/settlement;
- paid infrastructure unless separately approved;
- destructive cleanup or material privacy/security/financial/legal changes.

PR #33 remains open. Do not merge it during this acceptance run.
