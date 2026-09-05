# LostPaws

LostPaws is the new application repository for the ShelterPawtners business and its LostPaws initiative. It intentionally began as a clean implementation. No Core or RaveShelter application code or architecture is carried forward.

## Current state

This repository contains the project knowledge and agent instruction foundation only. The foundation awaits explicit user approval before application implementation begins.

There is no application, React scaffold, installed package set, database schema, Supabase connection, authentication flow, or deployed product in this repository. Capabilities below are plans, not completed features.

## Planned capabilities

ShelterPawtners connects **Care, Savings, and Community** to support shelter pet adoption and long-term outcomes. Digital Pet Passports will support current pets as well as adopted shelter pets. Later work will add shelter verification and auditable guardianship transfers, partner offers and savings, LostPaws community programs, authorized care contributions, and privacy-conscious insights.

LostPaws connects music festival and electronic music communities to this mission as an independent program. Naming a festival or artist does not establish affiliation.

## Development setup

For now, clone this repository and review the documents. Read [AGENTS.md](AGENTS.md) before changes. No package installation, environment configuration, database setup, or application command is required or available at this stage.

After approval and authorization to implement, document real setup, test, and build commands here as they are introduced. Do not add speculative commands or credentials. Supabase development is planned for `shelterpawtners-dev`; no connection is authorized by this foundation.

## Architecture

The preferred frontend is React, TypeScript, Vite, and Tailwind CSS. The planned backend is Supabase for PostgreSQL, authentication, storage, RLS, APIs, and selectively Realtime and Edge Functions. These are directions, not installed services. See [Architecture](docs/ARCHITECTURE.md) and [Security and privacy](docs/SECURITY-AND-PRIVACY.md).

## Documentation

- [Product vision](docs/PRODUCT-VISION.md): mission, ecosystem value, and audiences.
- [Product requirements](docs/PRODUCT-REQUIREMENTS.md): planned behavior and acceptance expectations.
- [User roles](docs/USER-ROLES.md): multiple roles and scoped organization permissions.
- [Brand design system](docs/BRAND-DESIGN-SYSTEM.md): visual principles and design workflow.
- [Content standards](docs/CONTENT-STANDARDS.md): terminology, writing, and truthful claims.
- [Architecture](docs/ARCHITECTURE.md): technical direction and engineering standards.
- [Roadmap](docs/ROADMAP.md): phases, approval gate, and human decisions.
- [Security and privacy](docs/SECURITY-AND-PRIVACY.md): data protection and authorization requirements.
- [Project skill](.agents/skills/shelterpawtners/SKILL.md): task-specific document routing for Codex.
