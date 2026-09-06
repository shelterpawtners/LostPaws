---
applyTo: "supabase/**"
---

# ShelterPawtners Supabase Instructions

- All persistent schema changes require version-controlled migrations.
- Migrations are the database source of truth.
- Enable and test RLS on user-facing/private tables.
- Never expose or commit the service-role key, DB password, or secrets.
- Enforce privileged operations server-side.
- Financial/economic/audit history is append-oriented.
- Do not allow ordinary users to silently UPDATE/DELETE finalized financial or audit events.
- Use integer minor units plus ISO currency for money.
- Preserve organization hierarchy, membership authorization, provenance, and demo-data isolation.
- Test cross-user and cross-organization isolation.
- Never use a destructive reset/drop against shared development data without explicit human approval and a verified backup/migration path.
