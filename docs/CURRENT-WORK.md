# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

MVP Design Hardening + Human Release Readiness through Issue #5 is **complete**.

The active work remains **Issue #32 / PR #33: Pre-cutover Launch Readiness** on branch `launch/pre-cutover-readiness`.

**Phase 3 remains explicitly owner-gated. Production-domain cutover remains explicitly owner-gated.**

## Pre-cutover work completed

### Demo/QA isolation

- Shared dev preserves 72 QA/demo offers for authenticated/Admin testing.
- Demo organizations and offers are excluded from anonymous Marketplace, directory, and public-profile surfaces.
- Future offers owned by demo organizations inherit demo state automatically.
- Dedicated database regressions protect the public/demo boundary.

### Shared-dev schema and RPC security

- Accepted CP6 migrations are aligned in shared dev.
- `20260910030000_launch_demo_public_isolation.sql` is applied.
- `20260910031500_launch_rpc_execute_boundary.sql` is applied.
- `20260910033000_launch_public_program_boundary.sql` is applied.
- Anonymous callers cannot execute the nine state-changing offer/redemption RPCs.
- Deliberate read-only discovery RPCs remain available to anonymous visitors.

### Real launch Marketplace content

Wave 1 contains five freshly sourced third-party `public_program` listings:

1. PetSmart Adoption Kit coupon savings.
2. Adopt a Pet Shelter Plus adopter savings.
3. PetPartners 30-day pet insurance coverage.
4. Trupanion Adoption Day 30-day coverage.
5. BISSELL Empty the Shelters — Fall 2026.

Shared-dev public-data audit:

- 77 total offer rows;
- 72 retained demo/QA offer rows;
- 5 non-demo public-program rows;
- 5 rows returned by the anonymous Marketplace RPC;
- 0 suspicious `demo`, `QA`, `Playwright`, or `example.invalid` strings in anonymous Marketplace results;
- 0 public Partner Directory rows, so neither source-only program organizations nor demo organizations leak into the directory.

Public programs are labeled separately from ShelterPawtners participant offers, show provider/eligibility/source context, route to official third-party destinations, and cannot create ShelterPawtners claim/redemption tokens.

### Signup/auth/recovery readiness

- Fresh Guardian, Shelter, PetBiz, and RAVE Vendor registration/onboarding flows have isolated Persona QA coverage.
- Email/password signup now preserves the selected persona through its confirmation `redirect_to` contract.
- Four-persona regression coverage inspects the actual Supabase signup redirect request.
- Forgot-password targets `/reset-password` on the current application origin.
- Dedicated recovery regression coverage verifies the actual Supabase recovery redirect request.
- `/reset-password` now checks auth state before presenting a password update form.
- Invalid, expired, manually opened, or already-consumed unauthenticated recovery URLs show `Recovery link unavailable` and route users back to request a fresh recovery email.
- Full Persona QA now permanently includes `e2e/auth-recovery.spec.ts`.

### Production auth email plan

`docs/LAUNCH-AUTH-EMAIL-READINESS.md` documents the proposed production design.

- Supabase built-in SMTP remains development/testing only and is not suitable for public launch.
- Microsoft 365 remains the human/business mailbox system rather than becoming an application SMTP dependency.
- Preferred MVP transactional provider is Resend using a dedicated `auth.shelterpawtners.com` sending subdomain and `no-reply@auth.shelterpawtners.com` sender.
- The current Resend free tier appears sufficient for initial controlled MVP traffic, so no paid infrastructure is recommended at launch.
- Provider account creation, credentials, and production DNS remain owner-gated.

## Current blockers that require owner-controlled launch actions

### Terms and Privacy Notice

Registration currently requires a checkbox stating agreement to the Terms and acknowledgement of the Privacy Notice, but those labels are plain text and there are no corresponding policy routes/pages in the repository.

Before public signup is enabled, the project needs owner-approved Terms of Service and Privacy Notice content and real links from registration. Engineering automation must not invent material legal terms.

### Production auth/email/domain configuration

Final public email confirmation/recovery testing requires:

- an authorized transactional-email provider account and credentials;
- the approved transactional sending-subdomain DNS records;
- final Supabase Site URL and redirect allowlist configuration;
- real email confirmation/recovery tests to non-team addresses;
- final Vercel custom-domain and web DNS cutover authorization.

These are intentionally not autonomous changes.

## Validation state

The latest exact-code acceptance has not run yet. The next repository checkpoint will switch `docs/AI-HANDOFF.md` to `READY_FOR_ACCEPTANCE` with `ACCEPTANCE_RUNTIME: LOCAL_HEAD` so the heavy Persona and Hosted browser suites run against the exact branch code.

`LOCAL_HEAD` is required because Vercel has currently rate-limited new preview builds. This is a hosting quota condition, not an application failure, and no paid bypass is recommended.

Before the latest auth/recovery additions, CI, Database QA, Hosted QA, Persona QA, Dependency Review, and Merge Gate were green. Subsequent failures observed during this slice were Markdown Prettier failures and were mechanically corrected; do not treat lightweight gate-only success as evidence that heavy browser acceptance ran.

## Vercel/domain state

- `main` remains the Vercel Production Branch.
- The Vercel project currently has only Vercel-owned domains.
- `shelterpawtners.com` / `www.shelterpawtners.com` have not been attached or rerouted.
- The older branch Marketplace preview can still be used to inspect the Wave 1 Marketplace, but it must not be represented as containing the newest auth/recovery code while Vercel preview builds are rate-limited.

## Other known launch notes

Two nearly empty non-demo organizations named `Shelter Pawtners` remain in shared dev. They were reviewed as likely registration/test artifacts and intentionally not deleted. No destructive cleanup is required for current public isolation because they do not have published directory profiles or offers.

Security advisor findings still include intentional locked private tables, deliberate anonymous read-only discovery RPCs, authenticated application RPCs, and leaked-password protection being disabled. Performance advisor still reports broader index/policy optimization opportunities. Those are tracked separately unless evidence shows a launch blocker.

## Immediate next sequence

1. Move PR #33 to `READY_FOR_ACCEPTANCE` using `LOCAL_HEAD`.
2. Verify the heavy Persona and Hosted browser jobs actually run against the exact branch head.
3. Confirm the new signup and recovery regressions run and pass.
4. Fix any genuine deterministic regression and repeat acceptance as needed.
5. When exact-code acceptance is green, update the launch checklist and handoff to the final owner gate rather than merging or changing DNS.

## Guardrails still in force

Still owner-gated/deferred:

- production-domain/DNS/custom-domain routing;
- Microsoft 365 mail DNS changes;
- transactional-email provider account/credential/DNS activation;
- owner-approved Terms and Privacy Notice content;
- Phase 3 feature development;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` giving provider/settlement decisions;
- paid infrastructure unless separately justified and approved;
- destructive cleanup or material privacy/security/financial/legal changes.

PR #33 remains open. Do not merge it until the acceptance protocol and owner gate are resolved.
