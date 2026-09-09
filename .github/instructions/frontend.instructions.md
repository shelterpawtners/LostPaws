---
applyTo: "src/**"
---

# Frontend instructions

- Preserve accessibility, keyboard behavior, mobile-first layouts, and existing role/organization isolation.
- Browser code may use only the Supabase public/publishable client configuration; never service-role credentials.
- Prefer existing shared presentation/validation helpers before adding duplicate logic.
- Changes to shared routing, auth/session, `src/main.tsx`, or common data clients are cross-cutting: expect broader relevant browser acceptance.
- Keep financial/savings values in integer minor units until presentation formatting.
- Do not introduce a new UI framework or state-management dependency for a bounded feature without a demonstrated need.
