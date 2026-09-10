# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

MVP Design Hardening + Human Release Readiness through Issue #5 is **complete**.

Issue #32 / PR #33 — Pre-cutover Launch Readiness has completed deterministic engineering acceptance on accepted code SHA `08e0924aa1ed532f72b0c37be8d9f35dedd07d5e`.

**Current state: BLOCKED at the final owner launch gate.**

**Phase 3 remains explicitly owner-gated. Production-domain cutover remains explicitly owner-gated. PR #33 remains open and must not be merged without owner authorization.**

## Pre-cutover work completed

### Demo/QA isolation

- Shared dev preserves QA/demo data for authenticated/Admin testing.
- Demo organizations and offers are excluded from anonymous Marketplace, directory, and public-profile surfaces.
- Future offers owned by demo organizations inherit demo state automatically.
- Dedicated database and browser regressions protect the public/demo boundary.
- Raw QA/demo row counts are intentionally not treated as stable because acceptance runs may create additional demo fixtures.

### Shared-dev schema and RPC security

- Accepted CP6 migrations are aligned in shared dev.
- `20260910030000_launch_demo_public_isolation.sql` is applied.
- `20260910031500_launch_rpc_execute_boundary.sql` is applied.
- `20260910033000_launch_public_program_boundary.sql` is applied.
- `20260910045221_launch_partner_organization_idempotency.sql` is applied.
- Anonymous callers cannot execute the state-changing offer/redemption RPCs.
- Deliberate read-only public discovery RPCs remain available to anonymous visitors.

### Real launch Marketplace content

Wave 1 contains five sourced third-party `public_program` listings:

1. PetSmart Adoption Kit coupon savings.
2. Adopt a Pet Shelter Plus adopter savings.
3. PetPartners 30-day pet insurance coverage.
4. Trupanion Adoption Day 30-day coverage.
5. BISSELL Empty the Shelters — Fall 2026.

Current shared-dev public invariants:

- 5 non-demo rows returned by the anonymous Marketplace RPC;
- 0 suspicious demo/QA/test strings in intended public Marketplace discovery;
- 0 public Partner Directory leakage from source-only or demo organizations.

Public programs are labeled separately from ShelterPawtners participant offers, show provider/eligibility/source context, route to official third-party destinations, and cannot create ShelterPawtners claim/redemption tokens.

### Signup/auth/recovery readiness

- Fresh Guardian, Shelter, PetBiz, and RAVE Vendor registration/onboarding flows have isolated Persona QA coverage.
- Email/password signup preserves the selected persona through its confirmation `redirect_to` contract.
- Forgot-password targets `/reset-password` on the current application origin.
- `/reset-password` verifies auth state before presenting a password update form.
- Invalid, expired, manually opened, or already-consumed unauthenticated recovery URLs show `Recovery link unavailable` and route users back to request a new recovery email.
- Full Persona QA permanently includes `e2e/auth-recovery.spec.ts`.

### Partner onboarding duplicate prevention

- The two historical nearly-empty shared-dev organizations named `Shelter Pawtners` are `pet_business` rows created about two minutes apart by the same user. They are not linked to the current onboarding-draft/access-request/duplicate-review flow, and evidence points to the older direct PetBiz creation path.
- Current Partner organization creation is now retry-safe at the database boundary.
- Exact retries from the same resolved draft return the existing organization instead of inserting another row.
- Changed-payload reuse of a resolved draft is rejected.
- Resolved onboarding draft identity/payload cannot be rewritten or deleted.
- PetBiz/RAVE onboarding recognizes a resolved draft and routes the user to the existing business profile instead of reopening creation.
- Persona offer/redemption QA uses an isolated non-demo Partner fixture so public claim/redemption remains tested without weakening demo isolation.
- The two historical rows remain untouched because destructive cleanup is owner-gated.

### Production auth email plan

`docs/LAUNCH-AUTH-EMAIL-READINESS.md` documents the proposed production design.

- Supabase built-in SMTP remains development/testing only.
- Microsoft 365 remains the human/business mailbox system rather than an application SMTP dependency.
- Preferred MVP transactional provider is Resend using `auth.shelterpawtners.com` and `no-reply@auth.shelterpawtners.com`.
- No paid tier is currently recommended for controlled MVP traffic.
- Provider account creation, credentials, production DNS, final Supabase Site URL/redirect configuration, and real external-email testing remain owner-gated.

## Deterministic acceptance result

Accepted application/database code SHA: `08e0924aa1ed532f72b0c37be8d9f35dedd07d5e`.

All required lanes passed:

- CI — lint, shell lint, unit tests, build, CI Gate.
- Database QA — local Supabase reset/seed, full pgTAP/RLS suite, Database QA Gate.
- Hosted QA — LOCAL_HEAD golden paths, design QA, Issue #5 browser audit, Hosted QA Gate.
- Persona QA — Guardian/Shelter/PetBiz/RAVE registration, auth recovery, access isolation, Partner offer creation, Guardian claim, Partner redemption, manual/camera fallback, local Admin QA security regression, Persona QA Gate.
- Dependency Review.
- Merge Gate.

A deterministic Persona failure caused by an ambiguous Playwright organization locator was fixed by narrowing the test locator; application behavior and coverage were not weakened. The full suite then passed.

## Advisor state

Security and performance advisors were rerun after the final DDL migration.

Security:

- no new security regression introduced;
- two private RLS/no-policy INFO notices remain for intentionally locked private tables;
- four anonymous SECURITY DEFINER warnings remain for intentional read-only discovery RPCs;
- authenticated application RPC warnings remain;
- leaked-password protection remains disabled and should be enabled before public traffic if available.

Performance remains optimization work rather than a demonstrated launch blocker: 20 unindexed-foreign-key notices, 18 multiple-permissive-policy warnings, and many unused-index notices in the low-traffic dev database.

## Owner-controlled blockers

### Terms and Privacy Notice

Registration requires agreement to Terms and acknowledgement of a Privacy Notice, but there are no owner-approved policy pages/links in the repository.

Before public signup is enabled, owner-approved Terms of Service and Privacy Notice content must be supplied and linked. Automation must not invent material legal terms.

### Production auth/email/domain configuration

Final public launch requires owner authorization for:

- transactional-email provider account and credentials;
- transactional sending-subdomain DNS records;
- final Supabase Site URL, redirect allowlist, and email configuration;
- real confirmation/recovery tests to external addresses;
- Vercel custom-domain attachment;
- production web DNS cutover;
- merge of PR #33.

## Vercel/domain state

- `main` remains the Vercel Production Branch.
- `shelterpawtners.com` / `www.shelterpawtners.com` have not been attached or rerouted by this workstream.
- No production DNS changes were made.

## Current next sequence

Autonomous implementation for Issue #32 is complete. The next step is an owner decision, not additional feature work.

1. Review/approve Terms of Service and Privacy Notice content.
2. Approve transactional-email provider setup and required DNS.
3. Approve final Supabase production auth/email configuration and external validation.
4. Approve PR #33 merge and Vercel/custom-domain production cutover when ready.
5. Authorize Phase 3 separately after launch/cutover decisions.

## Guardrails still in force

Still owner-gated/deferred:

- PR #33 merge;
- production-domain/DNS/custom-domain routing;
- Microsoft 365 mail DNS changes;
- transactional-email provider account/credential/DNS activation;
- owner-approved Terms and Privacy Notice content;
- Phase 3 feature development;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` giving provider/settlement decisions;
- paid infrastructure unless separately justified and approved;
- destructive cleanup or material privacy/security/financial/legal changes.
