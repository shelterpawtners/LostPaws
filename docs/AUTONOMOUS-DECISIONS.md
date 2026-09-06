# Autonomous decision log

## Purpose

This is the review list for meaningful decisions Codex makes without asking Jim first. It allows each choice to be validated, questioned, changed, or traced later. User-approved requirements remain authoritative in their normal project documents.

## Rules

- Status is `Active`, `Revised`, `Reversed`, or `Needs Jim`.
- Impact is `Low`, `Medium`, or `High`.
- Record the choice, rationale, alternatives, consequences, and implementation location.
- Never silently overwrite a decision. Mark the old entry revised or reversed and link its replacement.
- Do not make decisions autonomously when they require new authority, spending, credentials, production access, sensitive policy, or a material scope expansion. Record those as `Needs Jim`.
- Skip purely mechanical edits that involve no meaningful judgment.

## Decisions

### AD-001 — Keep Google sign-in disabled until configured

- **Date:** 2026-09-06
- **Status:** Active
- **Impact:** Medium
- **Decision:** Show Google sign-in as coming soon instead of starting a provider flow that cannot complete.
- **Why:** Provider credentials and approved redirect URLs are not configured.
- **Alternatives:** Hide Google entirely; allow the button to fail.
- **Consequences:** Email authentication remains the working MVP path. Google can be enabled through configuration without redesigning the screens.
- **Implemented in:** Registration and login.

### AD-002 — Treat the active role as interface context

- **Date:** 2026-09-06
- **Status:** Active
- **Impact:** High
- **Decision:** Store the selected participant role as an interface preference while enforcing permissions through database records and row-level security.
- **Why:** One person may participate in multiple roles, but changing a menu selection must never grant access.
- **Alternatives:** Put the active role in the authentication token; require separate accounts.
- **Consequences:** Role switching is simple. Every protected action must still validate identity, membership, guardianship, and permission at the data or server layer.
- **Implemented in:** Participant dashboard and authentication architecture.

### AD-003 — Protect dashboard and onboarding routes

- **Date:** 2026-09-06
- **Status:** Active
- **Impact:** High
- **Decision:** Redirect anonymous visitors from dashboard, pet setup, and organization onboarding to sign-in.
- **Why:** These pages create or expose account-linked information.
- **Alternatives:** Allow anonymous completion and require sign-in only at submission.
- **Consequences:** Private workflows require authentication. Public landing pages and marketplace previews remain accessible.
- **Implemented in:** Frontend routing and session handling.

### AD-004 — Use a private hosted preview before public deployment

- **Date:** 2026-09-06
- **Status:** Active
- **Impact:** Medium
- **Decision:** Publish development milestones privately while leaving `shelterpawtners.com` and DNS unchanged.
- **Why:** This supports realistic review without treating development as production.
- **Alternatives:** Local review only; immediate public replacement.
- **Consequences:** Production infrastructure, public access, and DNS remain separate approval gates.
- **Implemented in:** Hosting and release process.

### AD-005 — Lock the private audit store from browser roles

- **Date:** 2026-09-06
- **Status:** Active (explicitly approved by Jim)
- **Impact:** High
- **Decision:** Enable row-level security on `private.audit_events`, define no browser-facing policies, and revoke DML privileges from `anon` and `authenticated`.
- **Why:** Audit history is security evidence and must not be readable or mutable through the browser-facing Data API. RLS is retained as defense in depth even though the `private` schema is not exposed.
- **Alternatives:** Rely only on the private schema and grants; add a client-readable audit policy.
- **Consequences:** Only trusted backend or database-owner paths can write audit records. Any future audit viewer must use a narrowly scoped server-side endpoint rather than direct client table access.
- **Implemented in:** `shelterpawtners-dev` migration `lock_private_audit_events_rls` and the foundational repository migration. Both existing development profiles were preserved unchanged.

## Entry template

### AD-XXX — Decision title

- **Date:** YYYY-MM-DD
- **Status:** Active
- **Impact:** Low, Medium, or High
- **Decision:** What was chosen.
- **Why:** Evidence and reasoning.
- **Alternatives:** Other reasonable choices.
- **Consequences:** Benefits, limitations, cost, risk, and future changes.
- **Implemented in:** Relevant feature, file, migration, or workflow.
