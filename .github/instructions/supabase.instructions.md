---
applyTo: "supabase/**"
---

# Supabase / RLS instructions

- Git migrations are the schema source of truth; never patch shared/prod schema manually.
- Browser callers are untrusted. Privileged transitions belong in RLS-safe SQL/RPC or Edge Functions with server-side authorization.
- Preserve append-oriented economic/audit history; corrections/reversals should not erase prior events.
- Exclude demo/test activity from real reputation, impact, savings, or giving metrics.
- Reuse existing economic/giving tables before creating a parallel ledger.
- Every migration/RLS/RPC change requires local reset/replay plus pgTAP/RLS coverage through Database QA.
- Persona-sensitive DB changes require full Persona QA at the checkpoint acceptance boundary.
- Do not use service-role credentials in client code or logs.
