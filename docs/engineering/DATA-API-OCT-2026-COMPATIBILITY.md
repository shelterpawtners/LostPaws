# October 2026 Supabase Data API compatibility and shared-header regression

Status: implementation PR; review and CI acceptance required before merge or hosted migration application.
Owner request: October 20, 2026. Deadline: October 30, 2026.
Source: https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically

## Production and data-safety boundary

- The connected hosted project is `jukmlmryykcnjtpblbja`. Read-only inspection on 2026-10-20 found **62 public base tables**, all with **RLS enabled**.
- Hosted migration history already records `issue_283_offer_persistence_recovery` as version `20260916091931`. Do not push, rename, rerun, or replay the historical Issue #283 migration.
- This PR does not modify an applied SQL file or run any production DDL/DML. The new compatibility migration is additive: a safety check followed solely by `GRANT` statements. No rows, columns, policies, tables, triggers, or sequence values are modified.
- A fresh local reset may destroy **local ephemeral** data; never point it at hosted credentials. Never run `db reset --linked` or equivalent against hosted.
- Before any hosted `db push`, inspect `supabase_migrations.schema_migrations` on the target, compare all versions, take/confirm a recoverable backup, and preview SQL. Apply **only** the new migration if absent and approved. No automated production push from this PR.

## Inventory: repository migrations that CREATE public tables

All 62 hosted public tables reconcile to this known migration family; tables created in the early prototype baseline must still be verified against a *clean* local replay.

- **`20260906025003_festival_mvp_foundation.sql`**: profiles, participant_roles, organizations, organization_memberships, pets, guardianships, adoption_verification_requests, offers, organization_connections, offer_comments, conversations, conversation_participants, messages
- **`20260906091449_phase_1_platform_data_foundation.sql`**: role_definitions, user_roles, organization_types, organization_relationship_types, organization_relationships, organization_locations, partner_categories, organization_categories, provenance_types, source_systems, pet_identifiers, pet_external_identifiers, import_jobs, lifecycle_event_types, pet_lifecycle_events, offer_versions, offer_eligibility_rules, offer_locations, offer_claims, redemptions, economic_events, economic_event_lines, giving_providers, donation_recipients, donation_intents, donation_transactions, donation_allocations
- **`20260907100000_phase_2_partner_organization_foundation.sql`**: organization_onboarding_drafts, organization_candidate_dismissals, organization_access_requests, organization_duplicate_review_cases
- **`20260908090000_phase_2_checkpoint_2_partner_profiles.sql`**: organization_partner_profiles, organization_private_contacts, organization_social_links, organization_business_hours
- **`20260909100000_phase_2_offer_and_redemption_engine.sql`**: redemption_events
- **`20260909120000_phase_2_checkpoint_6_impact_reputation_giving.sql`**: partner_contribution_commitments, partner_contribution_settlement_evidence, partner_contribution_evidence_reviews, partner_good_standing_reviews
- **`20260910162500_data_architecture_pet_media_guardian_feed.sql`**: pet_media
- **`20260911002000_mvp_support_os_foundation.sql`**: support_tickets, support_ticket_messages, support_ticket_events
- **`20260912120000_track2_events_foundation.sql`**: events, event_participants
- **`20260914050000_issue_154_event_attendance_and_offer_linkage.sql`**: event_attendees
- **`20260915190000_store_products_foundation.sql`**: store_products
- **`20260915204000_store_requests_foundation.sql`**: store_requests

Some migrations contain comments about DROP TABLE or create objects in the non-API `private` schema; neither is a basis for recreating a public table. No `DROP TABLE public...` operation is introduced here.

## Compatibility patch and grants

`20261020120000_public_data_api_explicit_grants.sql` captures the **observed hosted grant envelope**, by Postgres role/table/operation, on October 20. It covers 62 public tables and the four existing public identity sequences. After the October 30 opt-in change, a fresh database replay reaches the same grant envelope without relying on implicit defaults. The safety guard fails if any public table has RLS disabled.

**This is backward-compatibility parity, not a claim that the historical grants are least-privilege.** Older defaults include broad anon DML grants for some tables; RLS currently prevents unauthorized row access. Tightening them is a separate reviewed security project with positive/negative API tests, not an incidental October 30 migration. No CRM permissions are granted by this patch.

New public tables must receive **explicit and minimal** `GRANT` statements alongside RLS/policies in their own migration (or use a documented `-- data-api-private: public.table_name` exemption). `scripts/check-data-api-grants.mjs` runs with `npm run check` to catch new tables missing that declaration. Dynamic SQL table creation requires manual review.

`supabase/config.toml` now explicitly sets `[api] auto_expose_new_tables = false` to exercise the upcoming default in local/preview environments.

## Verification gates (not yet executed by this authoring session)

1. `npm run data-api-grants:check` and `npm run check`. Confirm new schema-lint gate passes and all existing tests stay green.
2. Run **local only** `supabase db reset` after confirming local CLI project target. Fresh migrations and seed must succeed with implicit exposure disabled. Never connect this command to hosted.
3. `supabase test db` and/or the repository's pgTAP runner. Run `supabase/tests/public_data_api_explicit_grants.sql`; check the 8 assertions and all existing RLS tests.
4. Compare privilege snapshot and `pg_class.relrowsecurity` to confirm all tables have RLS, `anon` cannot directly SELECT offers/support tickets, and authenticated guardian/partner paths work. Run legitimate owner CRUD and cross-tenant negatives.
5. `npm run build`; `npx playwright test e2e/site-header-consistency.spec.ts` for desktop/mobile navigation on public core routes. Then existing hosted design/axe suite against an isolated preview; inspect browser screenshots, link colors, dropdown contrast, and responsive overflow.
6. Before production approval, ensure new migration is absent from hosted history; reconcile the historically non-matching local/cloud migration **names and versions**. Capture a recovery point, apply only once, and rerun targeted API/hosted acceptance. Record PASS/FAIL in the PR.
7. No production, DNS, Supabase RLS, or secret changes without an explicit release decision.

## Shared visual-system fix

The global header in `src/main.tsx` is assigned `siteHeader`; `src/site-header.css` scopes the dark opaque background, white navigation links, dropdown summary, focus/hover colors, and dark mobile panel to that actual shell. It does not globally style other `header` elements or change auth routes and business logic. A route-wide Playwright test verifies computed color, background, and keyboard-operable open/close controls on 12 public routes.

The base palette remains the brand-approved navy/purple/teal set. The public site is **not confirmed visually fixed in production** until the PR is merged, deployed, and browser-validated.
