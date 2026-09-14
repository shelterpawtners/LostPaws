---
description: Route ShelterPawtners/LostPaws work to the repository's canonical product, security, brand, marketplace, and engineering guidance, so a Claude Code session reads only the domain document a task actually needs.
---

# LostPaws context router

`CLAUDE.md` and `AGENTS.md` already give the current authority chain, guardrails, autonomy, and validation rules -- read those first. Do not repeat or override them here.

Load only the context required for the task:

| Task                     | Canonical context                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Brand/UI                 | `docs/design/BRAND-DESIGN-SYSTEM.md`, `docs/design/CONTENT-STANDARDS.md`                                               |
| Feature/product behavior | `docs/product/PRODUCT-REQUIREMENTS.md`, `docs/product/USER-ROLES.md`, active phase spec under `docs/product/roadmap/` |
| Marketplace/savings      | `docs/product/PRODUCT-REQUIREMENTS.md`, `docs/product/MARKETPLACE-RESEARCH.md`, `docs/design/CONTENT-STANDARDS.md`     |
| Database/auth/RLS        | `docs/engineering/ARCHITECTURE.md`, `docs/security/SECURITY-AND-PRIVACY.md`, `docs/product/USER-ROLES.md`              |
| Shelter/transfer         | product requirements + roles + architecture + security/privacy                                                        |
| Planning/phase           | `docs/AI-CONTROLLER.md`, active GitHub Issue/PR, and relevant roadmap/domain document                                  |
| Support/incident         | `docs/support/*` (triage severity, escalation, and the relevant runbook)                                               |
| Decisions/open gates     | `docs/DECISIONS.md`                                                                                                    |
| Technical debt           | `docs/engineering/TECHNICAL-DEBT.md`                                                                                   |

For active implementation also read the GitHub Issue/PR and
`docs/engineering/AI-RELEASE-STATE.md` when completion/acceptance state is
needed.

Keep Care, Savings, and Community connected; preserve guardianship vs provenance vs verification; never imply unverified providers are ShelterPawtners partners; preserve marketplace source/freshness/disclosure requirements.

Use canonical documents as the source of detailed rules. Link to them rather than duplicating large instruction blocks. `docs/archive/**` is historical evidence only -- never load it for routine work, only when explicitly investigating history.

This mirrors `.agents/skills/shelterpawtners/SKILL.md` (the equivalent router for Codex) and `.github/skills/*/SKILL.md` (Copilot's design/QA skill packs). Keep all three in sync when a canonical path changes.
