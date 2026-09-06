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
