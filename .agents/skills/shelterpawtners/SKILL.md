---
name: shelterpawtners
description: Work on the ShelterPawtners and LostPaws product in this repository using its product rules, brand standards, role boundaries, marketplace trust rules, and engineering context. Use for project documentation, features, UI, marketing, data, savings, and shelter workflows.
---

# ShelterPawtners project workflow

Read [AGENTS.md](../../../AGENTS.md) and [README.md](../../../README.md) first to establish scope and current state. This skill routes to canonical documents; it does not grant permission to implement planned capabilities. The MVP approval gate in AGENTS.md remains binding until the user explicitly lifts it.

## Load the relevant context

Paths below are relative to this skill directory. Load the documents needed for the actual task rather than reading everything by default.

| Task | Required context |
| --- | --- |
| Brand or UI | [Brand design system](../../../docs/BRAND-DESIGN-SYSTEM.md), [Content standards](../../../docs/CONTENT-STANDARDS.md). |
| Feature | [Product requirements](../../../docs/PRODUCT-REQUIREMENTS.md), [User roles](../../../docs/USER-ROLES.md), and [Roadmap](../../../docs/ROADMAP.md) for phase boundaries. |
| Marketplace or savings | [Product requirements](../../../docs/PRODUCT-REQUIREMENTS.md), [Marketplace research](../../../docs/MARKETPLACE-RESEARCH.md), [Content standards](../../../docs/CONTENT-STANDARDS.md), and [Roadmap](../../../docs/ROADMAP.md). |
| Database or authorization | [Architecture](../../../docs/ARCHITECTURE.md), [Security and privacy](../../../docs/SECURITY-AND-PRIVACY.md), and [User roles](../../../docs/USER-ROLES.md) when permission scope is involved. |
| Marketing page | [Product vision](../../../docs/PRODUCT-VISION.md), [Brand design system](../../../docs/BRAND-DESIGN-SYSTEM.md), [Content standards](../../../docs/CONTENT-STANDARDS.md). |
| Shelter workflow or transfer | [Product requirements](../../../docs/PRODUCT-REQUIREMENTS.md), [User roles](../../../docs/USER-ROLES.md), [Architecture](../../../docs/ARCHITECTURE.md), [Security and privacy](../../../docs/SECURITY-AND-PRIVACY.md). |
| Planning or context changes | [Product vision](../../../docs/PRODUCT-VISION.md), [Roadmap](../../../docs/ROADMAP.md), and the canonical document for the affected topic. |

For mixed tasks, combine the relevant routes. Before an architectural change, read architecture and security context even if the task began as a UI request.

## Apply the context

Locate the intended behavior and distinguish a requirement from a potential future capability. Check the decision register before committing to a sensitive policy. Ask only when a material unresolved product, security, legal, privacy, or architectural risk requires human judgment; document reasonable routine choices otherwise.

Keep Care, Savings, and Community connected. Preserve the distinction between pet history, current guardianship, provenance, verification, and sharing authority. Do not turn a Passport into a public record by default or present LostPaws as an affiliated festival program without formal support.

For marketplace work, distinguish public opportunities from ShelterPawtners relationships. Require traceable sources, important conditions, freshness, expiration handling, appropriate disclosures, and human publication. A large count of stale or misleading links is not success.

For design work, follow the documented sequence from user need through browser review. For data work, follow the migration and authorization requirements. Update the canonical document when a real decision changes; link from other documents rather than duplicating its detailed rules.

Validate according to AGENTS.md and the task's actual artifacts. Report completed work accurately, including limits and remaining decisions. Never infer authorization to move from planning to application implementation.
