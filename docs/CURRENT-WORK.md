# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

MVP Design Hardening + Human Release Readiness through Issue #5 is **complete**.

The active work remains **Issue #32 / PR #33: Pre-cutover Launch Readiness** on branch `launch/pre-cutover-readiness`.

**Phase 3 remains explicitly owner-gated. Production-domain cutover remains explicitly owner-gated.**

## Active launch-readiness sequence

1. **Demo/QA isolation — complete in shared dev.** The 72 QA offers remain available for authenticated/Admin testing but are excluded from anonymous/public Marketplace and directory surfaces.
2. **Shared-dev schema alignment — complete.** Accepted CP6 migrations and the launch isolation/RPC-boundary migrations are applied in canonical order.
3. **Real adoption-resource publication — Wave 1 complete.** Five source-backed public adoption benefits are now live in shared dev.
4. **Launch merchandising/public-program boundary — complete for Wave 1.** Public third-party benefits are visually/behaviorally distinct from ShelterPawtners participant offers and route to official sources instead of internal redemption claims.
5. **Signup/email readiness — active next.** Validate public personas, hosted Auth delivery, password reset, and final-domain redirect requirements within current infrastructure constraints.
6. **Final pre-cutover review — pending.** Complete desktop/mobile human review, reverify time-sensitive program links, and stop at owner authorization before production DNS/custom-domain routing.

## Current implementation

Latest fully green implementation head before documentation refresh: `b01948a5ad4a7d72481d8a6dc770b317890e7bdb`.

Launch database boundaries now include:

- `20260910030000_launch_demo_public_isolation.sql`;
- `20260910031500_launch_rpc_execute_boundary.sql`;
- `20260910033000_launch_public_program_boundary.sql`.

Current shared-dev Marketplace evidence:

- 77 total offer rows;
- 72 retained demo/QA offer rows;
- 5 non-demo `public_program` rows;
- 5 rows returned by the anonymous/public Marketplace RPC;
- all 5 public Marketplace rows are the intentional public programs;
- 0 of the five source-only public-program organizations appear in the public Partner Directory.

Wave 1 public benefits:

1. PetSmart Adoption Kit coupon savings;
2. Adopt a Pet Shelter Plus adopter savings;
3. PetPartners 30-day pet insurance coverage;
4. Trupanion Adoption Day 30-day coverage;
5. BISSELL Empty the Shelters — Fall 2026.

The Marketplace UI labels these as public adoption benefits, shows provider/eligibility/verification context, links to the official third-party destination, and does not present them as ShelterPawtners-managed claims.

## Validation state

On implementation head `b01948a5ad4a7d72481d8a6dc770b317890e7bdb`:

- CI: green;
- Database QA: green;
- Hosted QA: green;
- Persona QA: green;
- Dependency Review: green;
- Merge Gate: green.

The active branch preview responds at:

`https://lost-paws-git-launch-pre-cutover-135ab9-jims-projects-acec6bcb.vercel.app/marketplace`

## Data hygiene note

Two nearly empty non-demo organizations named `Shelter Pawtners` exist in shared dev. They were created about two minutes apart by the same owner and contain no profile, locations, offers, or private contacts. The owner believes these were probably registration test records. They were intentionally not deleted. Treat them as test artifacts to classify before cutover unless later evidence demonstrates a registration defect.

## Advisor state

Post-DDL security advice contains no newly introduced launch regression. Remaining notices are:

- intentional locked private tables with RLS and no policies;
- four intentional anonymous read-only public `SECURITY DEFINER` discovery RPCs;
- authenticated application RPCs that retain their authorization boundaries;
- leaked-password protection currently disabled.

Performance advice still reports 20 unindexed foreign keys, 76 unused indexes, and 18 multiple-permissive-policy cases. These are tracked as broader optimization work rather than an Issue #32 launch blocker unless profiling demonstrates otherwise.

## Canonical application state

- `main` remains canonical and the Vercel Production Branch.
- Issue #5 full-site audit remains accepted at code SHA `62cba023a4946993ad44fcbd0ab4f7fdab856a52`.
- Active launch branch: `launch/pre-cutover-readiness`.
- Active PR: #33.
- `shelterpawtners.com` / `www.shelterpawtners.com` DNS remain unchanged.

## Active next work

Continue without routine owner interruption on:

1. Guardian/Shelter/PetBiz/RAVE Vendor fresh signup, confirmation/login, persistence, and password-reset readiness;
2. production-suitable Auth email delivery options and final-domain redirect configuration requirements, stopping before any paid purchase or Microsoft 365/DNS change;
3. final Marketplace/public-content browser review and source revalidation;
4. pre-cutover classification review of legacy test organization shells.

## Guardrails still in force

Still owner-gated/deferred:

- `shelterpawtners.com` / `www.shelterpawtners.com` DNS/custom-domain routing;
- Microsoft 365 mail DNS changes;
- Phase 3 feature development;
- new Marketplace/business-model rules beyond approved Issue #32 scope;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` giving provider/settlement decisions;
- paid infrastructure unless separately justified and approved;
- destructive cleanup or material privacy/security/financial/legal changes.

No DNS, custom-domain, paid-infrastructure, or Phase 3 action is authorized by this pre-cutover work.
