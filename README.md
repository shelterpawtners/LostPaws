# LostPaws

LostPaws is the new application repository for the ShelterPawtners business and its LostPaws initiative. It intentionally began as a clean implementation. No Core or RaveShelter application code or architecture is carried forward.

## Current state

This repository contains the project knowledge and agent instruction foundation only. GitHub access and read-only access to the empty Supabase development project, `shelterpawtners-dev`, have been confirmed. The revised MVP and implementation scope still require explicit user approval before application implementation begins.

There is no application, React scaffold, installed package set, database schema, migration, repository Supabase configuration, authentication flow, or deployed product in this repository. Capabilities below are plans, not completed features.

## Planned capabilities

ShelterPawtners connects **Care, Savings, and Community** to support shelter pet adoption and long-term outcomes. The guardian-first MVP is planned to combine a limited Digital Pet Passport with an authenticated savings marketplace. After login, guardians should be encouraged to set up their pet while retaining the option to browse trustworthy public savings immediately.

Later work will add shelter verification and auditable guardianship transfers, private and adoption-qualified offers, partner redemptions and savings measurement, LostPaws community programs, authorized care contributions, and privacy-conscious insights.

LostPaws connects music festival and electronic music communities to this mission as an independent program. Naming a festival or artist does not establish affiliation.

## Development setup

For now, clone this repository and review the documents. Read [AGENTS.md](AGENTS.md) before changes. No package installation, environment configuration, database setup, or application command is required or available at this stage.

After the MVP and implementation slice are approved, document real setup, test, and build commands here as they are introduced. Do not add speculative commands or credentials. Development work is limited to `shelterpawtners-dev` when specifically authorized. Production connection, project creation, and deployment require explicit user instruction.

## Architecture

The preferred frontend is React, TypeScript, Vite, and Tailwind CSS. The planned backend is Supabase for PostgreSQL, authentication, storage, RLS, and APIs, with Realtime and Edge Functions used selectively. These are directions, not installed services. See [Architecture](docs/ARCHITECTURE.md) and [Security and privacy](docs/SECURITY-AND-PRIVACY.md).

## Documentation

- [Product vision](docs/PRODUCT-VISION.md): mission, ecosystem value, and audiences.
- [Product requirements](docs/PRODUCT-REQUIREMENTS.md): planned behavior and acceptance expectations.
- [Marketplace research and savings strategy](docs/MARKETPLACE-RESEARCH.md): initial provider research, offer classifications, and curation standards.
- [User roles](docs/USER-ROLES.md): multiple roles and scoped organization permissions.
- [Brand design system](docs/BRAND-DESIGN-SYSTEM.md): visual principles and design workflow.
- [Content standards](docs/CONTENT-STANDARDS.md): terminology, writing, and truthful claims.
- [Architecture](docs/ARCHITECTURE.md): technical direction and engineering standards.
- [Roadmap](docs/ROADMAP.md): MVP slices, later phases, approval gates, and human decisions.
- [Security and privacy](docs/SECURITY-AND-PRIVACY.md): data protection and authorization requirements.
- [Project skill](.agents/skills/shelterpawtners/SKILL.md): task-specific document routing for Codex.
