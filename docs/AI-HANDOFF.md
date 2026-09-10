# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Pre-cutover Launch Readiness
CURRENT_CHECKPOINT: Issue #32 / PR #33 — Workstream A demo/QA isolation
NEXT_CHECKPOINT: Pass Database QA, then validate/apply the accepted schema chain to shared dev before continuing launch merchandising/resource publication.
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

Current implementation code SHA: `bfc60b1e935a80aa2ad2dc2eef37b869997e790a`

## Current objective

Complete the pre-cutover launch-readiness work without changing production DNS, beginning Phase 3, adding paid infrastructure, or making unresolved savings/giving product decisions.

The first implementation checkpoint is Workstream A: preserve QA/demo data for authenticated testing while preventing it from appearing on anonymous/public Marketplace and partner-directory surfaces.

## Work completed in this checkpoint

Commit `bfc60b1e935a80aa2ad2dc2eef37b869997e790a` adds `20260910030000_launch_demo_public_isolation.sql` and regression coverage.

Implemented behavior:

- backfill offers owned by demo organizations to `offers.is_demo=true` without deleting QA data;
- add a private trigger so future offers created under demo organizations inherit demo state;
- exclude demo offers and offers owned by demo organizations from `public_active_offers()`;
- exclude demo organizations from `public_partner_directory()`;
- return `null` from direct public partner-profile lookup for demo organizations, preventing guessed public URLs from bypassing directory filtering;
- preserve authenticated/Admin access to the underlying demo records for QA;
- update existing offer/profile pgTAP expectations to reflect the public-demo boundary;
- add dedicated launch isolation pgTAP coverage proving demo data is hidden and non-demo data remains public.

No production DNS/custom-domain action and no Phase 3 work was performed.

## Validation state

On code SHA `bfc60b1e935a80aa2ad2dc2eef37b869997e790a`:

- Vercel preview deployment: success.
- Hosted QA: success.
- CI: success.
- Dependency Review: success.
- Persona QA: success.
- CodeQL: success.
- Database QA: still running at the time this handoff was updated; its `database` job had reached local Supabase startup and had not reported a test failure.
- Merge Gate initially failed because this file still incorrectly reported the already-completed Issue #5 checkpoint as the active `COMPLETE` handoff. That was control-plane drift, not a product/test failure. This handoff now correctly reports Issue #32 as `IN_PROGRESS`, so Merge Gate should remain informational until the active checkpoint reaches acceptance.

## Shared-development database drift found

The connected `shelterpawtners-dev` Supabase project is behind canonical `main` on the accepted CP6 database migrations. Direct inspection found the CP6 contribution/impact tables and helper functions absent even though those migrations are present in GitHub `main`.

This matters because the new launch-isolation migration deliberately builds on the canonical CP6 function boundary. Do **not** apply the new launch migration directly to shared dev until the missing accepted CP6 migrations are reconciled in canonical order.

This is an environment/schema-drift blocker for hosted schema rollout, not a reason to weaken the new migration or its regression tests.

## Unresolved items in Issue #32

After Workstream A is accepted and shared dev is aligned:

1. verify launch-safe real adoption resource candidates immediately before publication and load only sourced, non-misleading records;
2. improve launch merchandising/Marketplace content without inventing partnerships or discounts;
3. confirm signup/email readiness, including production SMTP/custom-mail requirements within the no-paid-infrastructure guardrail;
4. run final pre-cutover release review;
5. stop at the explicit owner authorization gate before any `shelterpawtners.com` / `www.shelterpawtners.com` DNS or custom-domain change.

## Guardrails

Still owner-gated/deferred:

- production-domain/DNS/custom-domain routing;
- Microsoft 365 mail DNS changes;
- Phase 3 feature development;
- `OD-003` verified-savings customer-facing rules/totals;
- `OD-004` production giving provider/settlement;
- paid infrastructure unless separately approved;
- destructive cleanup of QA records or material privacy/security/financial/legal changes.

## Recommended next action

1. Finish Database QA for the current PR head and fix any real regression without weakening tests.
2. Re-run/confirm Merge Gate with this active handoff state.
3. Reconcile the missing accepted CP6 migrations into shared dev in canonical order, then apply the launch-isolation migration and verify zero demo leakage while preserving QA records.
4. Update this handoff to `READY_FOR_ACCEPTANCE` only after deterministic and shared-dev evidence is green.
