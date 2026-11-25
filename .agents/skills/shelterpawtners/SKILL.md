---
name: shelterpawtners
description: Route ShelterPawtners/LostPaws work to the repository's canonical product, security, brand, marketplace, and engineering guidance.
---

# ShelterPawtners context router

Read `../../../AGENTS.md` first. It contains current authority, guardrails, autonomy, validation, and AI-cost rules. Do not repeat or override those rules here.

Load only the context required for the task:

| Task                     | Canonical context                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Brand/UI                 | `docs/design/BRAND-DESIGN-SYSTEM.md`, `docs/design/CONTENT-STANDARDS.md`                                               |
| Feature/product behavior | `docs/product/PRODUCT-REQUIREMENTS.md`, `docs/product/USER-ROLES.md`, active phase spec under `docs/product/roadmap/` |
| Marketplace/savings      | `docs/product/PRODUCT-REQUIREMENTS.md`, `docs/product/MARKETPLACE-RESEARCH.md`, `docs/design/CONTENT-STANDARDS.md`     |
| Database/auth/RLS        | `docs/engineering/ARCHITECTURE.md`, `docs/security/SECURITY-AND-PRIVACY.md`, `docs/product/USER-ROLES.md`              |
| Shelter/transfer         | product requirements + roles + architecture + security/privacy                                                        |
| Planning/phase           | `docs/AI-CONTROLLER.md`, active GitHub Issue/PR, and relevant roadmap/domain document                                  |
| Revenue/donations/compliance | `docs/business/README.md`, then the one `docs/business/*` document needed                                         |
| Agent handoffs           | `docs/engineering/AGENT-BRIDGE-PROTOCOL.md`, `docs/engineering/briefs/agent-baton-handoff.md`                        |

For active implementation also read the GitHub Issue/PR and
`docs/engineering/AI-RELEASE-STATE.md` when completion/acceptance state is
needed.

Keep Care, Savings, and Community connected; preserve guardianship vs provenance vs verification; never imply unverified providers are ShelterPawtners partners; preserve marketplace source/freshness/disclosure requirements.

Use canonical documents as the source of detailed rules. Link to them rather than duplicating large instruction blocks, and treat newer owner decisions/live handoff state as superseding stale historical planning text.
