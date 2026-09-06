# Phase 1 decision log

This is the canonical review list for implementation choices made without requesting routine human input. User-approved requirements remain authoritative.

## D-001 — Additive reconciliation

- **Status:** Approved and active
- **Decision:** Preserve both existing profiles and all prototype objects while expanding the schema additively.
- **Reason:** Jim explicitly approved profile preservation and prohibited destructive reconciliation.
- **Consequence:** Compatibility objects remain until a later approved cleanup.

## D-002 — Locked private security stores

- **Status:** Approved and active
- **Decision:** Enable RLS on private audit/token tables, create no browser policies, and revoke browser privileges.
- **Reason:** Audit evidence and opaque token digests must be server-controlled.
- **Consequence:** Future access requires narrowly scoped trusted endpoints.

## D-003 — Normalized role bridge

- **Status:** Active
- **Decision:** Retain `participant_roles` for compatibility while making `user_roles` and `role_definitions` the new authorization model.
- **Reason:** One identity may hold several roles; privileged assignment must be auditable.
- **Consequence:** Signup assigns only a nonprivileged starting role.

## D-004 — Reference data over rigid enums

- **Status:** Active
- **Decision:** Use controlled tables for organization types, relationships, categories, lifecycle events, provenance, and source systems.
- **Reason:** These vocabularies must expand without migrations.

## D-005 — Immutable commercial terms

- **Status:** Active
- **Decision:** Separate durable offers from versioned terms; claims and redemptions reference the exact version.
- **Reason:** Editing a live offer must not rewrite history.

## D-006 — Accounting event model

- **Status:** Active
- **Decision:** Store integer minor units and append-oriented event lines; corrections are new events.
- **Reason:** Floating-point amounts and silent edits are unsafe.

## D-007 — Reserved demo identities

- **Status:** Active
- **Decision:** Seed deterministic personas only with `example.invalid` addresses and demo markers.
- **Reason:** Demo data must never contact real people or resemble real partnerships.

## D-008 — Migration creation fallback

- **Status:** Active
- **Decision:** Create the migration file directly after the environment blocked the CLI file-creation call, then apply the exact committed SQL through Supabase migration tooling.
- **Reason:** Work could continue safely without an unmanaged dashboard change.
- **Consequence:** Future environments should return to `supabase migration new` and `db pull`.

## D-009 — V2 RAVE Shelter asset family

- **Status:** Active
- **Decision:** Use the approved V2 animated GIF for normal RAVE Shelter presentation, the V2 static PNG for reduced-motion preference, and retain the V2 SVG as the scalable source asset.
- **Reason:** This honors the approved logo motion while providing a stable accessible fallback.
- **Consequence:** The prior RAVE asset remains untouched for historical compatibility but is no longer used by the RAVE landing page.

## D-010 — Organization creator ownership

- **Status:** Active
- **Decision:** Assign the person who creates an organization the normalized `owner` membership role.
- **Reason:** It establishes explicit accountability and supports future multi-member administration without treating every creator as a generic administrator.
- **Consequence:** Additional organization staff will be invited or assigned through later authorized administration flows.

## D-011 — Advisory-led foreign-key indexes

- **Status:** Active
- **Decision:** Add the missing covering indexes reported by the Supabase performance advisor, then re-query the catalog for remaining Phase 1 foreign keys.
- **Reason:** Foreign-key enforcement and lifecycle reporting should remain performant as festival signups grow.
- **Consequence:** Remaining early-stage advisor notices concern unused indexes and deliberate overlapping RLS read policies, not absent foreign-key coverage.

## D-012 — No substitute platform administrator

- **Status:** Active
- **Decision:** Do not grant `platform_admin` until the intended `jim@shelterpawtners.com` identity has actually signed into Supabase.
- **Reason:** Privileged access must attach to a verified real identity, never a guessed or temporary account.
- **Consequence:** The single post-build setup action is to sign in once, then perform the documented explicit bootstrap assignment.
