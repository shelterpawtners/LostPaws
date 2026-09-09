# Phase 1 execution

## Objective

Phase 1 establishes a secure, reproducible foundation for people, pets, organizations, offers, economic activity, giving, imports, and later Passport workflows. It does not launch payments, donations, shelter connectors, or the complete marketplace.

## Rebuild sequence

1. Install pinned dependencies with `npm ci`.
2. Start a clean local Supabase stack with the supported CLI.
3. Run `supabase db reset` to apply repository migrations and `supabase/seed.sql`.
4. Run database tests with `supabase test db`.
5. Run `npm run check` and `npm run build`.
6. Start Vite with local values copied from `.env.example`.

No production credentials belong in Git. The browser receives only the Supabase project URL and publishable key; RLS remains the authorization boundary.

## Migration sequence

- `20260906025003_festival_mvp_foundation.sql` captures the retained festival prototype.
- `20260906085115_lock_private_audit_events_rls.sql` locks the private audit store.
- `20260906091449_phase_1_platform_data_foundation.sql` adds normalized Phase 1 structures without deleting prototype records.
- `20260906092500_phase_1_identity_bridge.sql` bridges signup and persona selection to normalized roles.
- `20260906093000_record_remote_prototype_baseline.sql` records the pre-existing remote prototype without replaying it.
- `20260906193500_phase_1_foreign_key_indexes.sql` and `20260906195000_complete_phase_1_foreign_key_indexes.sql` complete the advisory-led foreign-key index pass.

## Compatibility

Prototype columns and tables remain available during transition. New features use `user_roles`, controlled lookup tables, `offer_versions`, temporal relationships, and append-oriented economic records. Deprecated prototype objects are removed only through a separately approved migration after all consumers move.

## External configuration still required

- Enable leaked-password protection in Supabase Auth before public launch.
- Configure Google OAuth and enable its UI only after redirect URLs are verified.
- Create the first real `jim@shelterpawtners.com` Supabase user, then assign the deliberately privileged `platform_admin` role through an authorized database-administration action.
- Configure transactional email credentials in a later server-side delivery slice.
