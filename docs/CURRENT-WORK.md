# Current ShelterPawtners Work

## Current stage

Phase 1 — Platform + Data Foundation is **complete**.

Phase 2 — Partner Marketplace MVP is **complete**.

MVP Design Hardening + Human Release Readiness through Issue #5 is **complete**.

The active work is now **Issue #32 / PR #33: Pre-cutover Launch Readiness** on branch `launch/pre-cutover-readiness`.

**Phase 3 remains explicitly owner-gated. Production-domain cutover remains explicitly owner-gated.**

## Active launch-readiness sequence

1. **Demo/QA isolation — in progress.** Preserve QA data but prevent demo organizations/offers from appearing on anonymous/public Marketplace or directory surfaces.
2. **Shared-dev schema alignment.** Reconcile the accepted CP6 migrations missing from the connected development Supabase project before applying the new launch-isolation migration there.
3. **Real adoption-resource publication.** Reverify candidates immediately before publication; do not invent discounts, partnerships, or unsupported claims.
4. **Launch merchandising.** Make Marketplace value visible with real/sourced content while preserving the approved product model.
5. **Signup/email readiness.** Validate production-ready auth/email behavior within current infrastructure constraints.
6. **Final pre-cutover review.** Present the result and stop at the owner authorization gate before production DNS/custom-domain routing.

## Current implementation

Commit `bfc60b1e935a80aa2ad2dc2eef37b869997e790a` implements the first launch-readiness database boundary:

- existing offers owned by demo organizations are backfilled to `is_demo=true`;
- future demo-owned offers inherit demo state automatically;
- `public_active_offers()` excludes demo offers and demo-owned offers;
- `public_partner_directory()` excludes demo organizations;
- direct public partner-profile details return no record for demo organizations;
- authenticated/Admin QA access to demo records remains intact;
- pgTAP coverage proves demo content stays private while non-demo content remains public.

## Validation state

For the first implementation code SHA:

- Vercel preview: green.
- Hosted QA: green.
- CI: green.
- Dependency Review: green.
- Persona QA: green.
- CodeQL: green.
- Database QA: running when the handoff was refreshed; no database test failure had been reported yet.
- The earlier Merge Gate failure was caused by stale `AI-HANDOFF.md` metadata still describing completed Issue #5. The handoff is now correctly `IN_PROGRESS` for Issue #32.

## Environment finding

The connected `shelterpawtners-dev` Supabase project is behind canonical GitHub `main` on the accepted CP6 migration chain. CP6 impact/contribution tables and private helper functions are absent in shared dev even though the migration files are present in `main`.

Do not bypass this by weakening the new launch migration or tests. Bring shared dev forward in canonical order after Database QA validates the PR implementation.

## Canonical application state

- `main` remains canonical and the Vercel Production Branch.
- Issue #5 full-site audit remains accepted at code SHA `62cba023a4946993ad44fcbd0ab4f7fdab856a52`.
- Active launch branch: `launch/pre-cutover-readiness`.
- Active PR: #33.
- `shelterpawtners.com` / `www.shelterpawtners.com` DNS remain unchanged.

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
