---
applyTo: "**/*.test.*,**/*.spec.*,tests/**,e2e/**"
---

# ShelterPawtners Testing Instructions

Tests should verify real behavior, permissions, and regressions.

Priorities:

- authentication/session behavior
- protected routes
- cross-user isolation
- cross-organization isolation
- RLS/security
- role permissions
- demo-data isolation
- money calculations/formatting
- append-only/reversal behavior
- critical mobile workflows
- accessibility for critical flows

Do not:

- weaken RLS to pass tests,
- bypass production security assumptions without clear test-only isolation,
- rely only on snapshots for meaningful behavior.

Prefer stable selectors and reusable fixtures for Playwright.
