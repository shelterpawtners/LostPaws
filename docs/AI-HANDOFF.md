# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Pre-cutover Launch Readiness
CURRENT_CHECKPOINT: Issue #32 / PR #33 — demo isolation + real public adoption benefits complete in shared dev
NEXT_CHECKPOINT: Signup/auth/email launch readiness, then final pre-cutover human review
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

Latest fully green implementation head before this documentation refresh: `b01948a5ad4a7d72481d8a6dc770b317890e7bdb`

## Current objective

Finish the launch candidate without changing production DNS, beginning Phase 3, adding paid infrastructure, destructively cleaning data, or making unresolved savings/giving product decisions.

## Completed launch-readiness work

### Demo/QA isolation

- `20260910030000_launch_demo_public_isolation.sql` is applied in shared dev.
- Existing QA offers owned by demo organizations were preserved and backfilled to `is_demo=true`.
- Future demo-owned offers automatically inherit demo state.
- Public Marketplace, public Partner Directory, and direct public partner-profile lookup exclude demo data.
- Authenticated/Admin QA access remains available.
- Shared-dev evidence after public resource publication: 77 total offers = 72 retained demo offers + 5 intentional public-program listings; public Marketplace returns only the 5 real public-program listings.

### Shared-dev CP6 alignment

The previously missing accepted CP6 migrations were applied to `shelterpawtners-dev` in canonical order before the launch migrations. The prior shared-dev schema-drift blocker is resolved.

### RPC execute boundary

`20260910031500_launch_rpc_execute_boundary.sql` is applied in shared dev.

- anonymous users cannot execute the nine state-changing offer/redemption RPCs;
- authenticated users retain the required application access;
- anonymous users retain the four intentional read-only public discovery RPCs.

### Public-program Marketplace boundary

`20260910033000_launch_public_program_boundary.sql` is applied in shared dev.

- `public_active_offers()` exposes the existing launch-content fields needed for truthful public listings: destination URL, eligibility, last-verified date, terms/source/disclosure, dates, and applicability;
- `public_program` and `community` records remain publicly browseable;
- those external records cannot create ShelterPawtners claim/redemption tokens;
- the UI labels public benefits separately and routes the user to the official third-party program rather than showing an internal Claim action;
- regression coverage proves this boundary.

### Real public adoption benefits — Wave 1

Five source-backed `public_program` listings are now loaded in shared dev, last verified September 9, 2026:

1. PetSmart Adoption Kit coupon savings;
2. Adopt a Pet Shelter Plus adopter savings;
3. PetPartners 30-day pet insurance coverage;
4. Trupanion Adoption Day 30-day coverage;
5. BISSELL Empty the Shelters — Fall 2026.

Each listing has an official source/destination, eligibility language, verification date, current terms/disclosure, and national applicability. Source-only organizations have no partner profile or membership and do not appear in the public Partner Directory. No partnership or endorsement is implied.

### Duplicate Shelter Pawtners test artifacts

Two nearly empty shared-dev organizations named `Shelter Pawtners` were reviewed. They were created about two minutes apart by the same owner and contain no partner profile, location, offer, or private-contact data. The owner indicated they were probably registration test records. No deletion was performed. Treat them as launch-hygiene/test artifacts and classify appropriately before cutover rather than destructively guessing.

## Deterministic validation

On implementation head `b01948a5ad4a7d72481d8a6dc770b317890e7bdb` all normal gates completed successfully:

- CI: success;
- Database QA: success;
- Hosted QA: success;
- Persona QA: success;
- Dependency Review: success;
- Merge Gate: success.

The temporary formatting diagnostic workflow used to obtain the repository's exact Prettier output was removed before this checkpoint.

The active branch Vercel Marketplace preview responds successfully at:

`https://lost-paws-git-launch-pre-cutover-135ab9-jims-projects-acec6bcb.vercel.app/marketplace`

## Advisor state after launch DDL

Security advisor findings remaining:

- `private.audit_events` and `private.secure_tokens` have RLS enabled with no policies; these are intentionally locked private-schema tables;
- four anonymous-executable `SECURITY DEFINER` warnings remain for the intentional read-only public discovery RPCs;
- authenticated-executable `SECURITY DEFINER` application RPCs remain and require their existing authorization checks;
- Supabase leaked-password protection is disabled and remains a launch-hardening item.

Performance advisor findings remain broader cleanup work rather than regressions from this launch slice:

- 20 unindexed foreign-key notices;
- 76 unused-index notices in the low-traffic development environment;
- 18 multiple-permissive-policy notices.

Do not claim the advisors are clean or expand Issue #32 into an unrelated wholesale RLS/index refactor unless a launch blocker is demonstrated.

## Remaining Issue #32 work

1. Validate signup/auth launch readiness for Guardian, Shelter, PetBiz, and RAVE Vendor against the current shared-dev/preview environment.
2. Resolve production-suitable Auth email delivery and final-domain redirect readiness within the existing no-paid-infrastructure/no-mail-DNS-change guardrail; identify any owner-gated requirement rather than purchasing or altering DNS autonomously.
3. Finish the launch Marketplace/public-content human review across desktop/mobile and re-check all time-sensitive third-party program links/claims immediately before cutover.
4. Review the two legacy `Shelter Pawtners` test organization shells for demo classification before production cutover; do not delete them without a reason.
5. Stop at the explicit owner authorization gate before any `shelterpawtners.com` / `www.shelterpawtners.com` DNS or custom-domain change.

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

Continue directly into signup/auth/email readiness, then perform final pre-cutover human/browser review. Keep PR #33 open and `STATUS: IN_PROGRESS` until the complete Issue #32 acceptance boundary is satisfied.
