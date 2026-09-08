---
applyTo: "e2e/**"
---

# E2E instructions

- Protect business-critical golden paths; do not broaden selectors until they can match the wrong state.
- Prefer roles, accessible names, scoped status/alert regions, or explicit stable test ids over broad text locators.
- Preserve real persistence, authorization, replay/idempotency, and cross-role assertions.
- A failing valid regression is a product/test-contract signal; do not weaken it merely to make CI green.
- Hosted QA is checkpoint acceptance, not an every-commit browser loop.
- Persona browser QA runs only when persona-sensitive impact exists and the handoff reaches `READY_FOR_ACCEPTANCE`.
