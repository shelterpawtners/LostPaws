# LostPaws

LostPaws is the new application repository for the ShelterPawtners business and its LostPaws initiative. It intentionally began as a clean implementation. No Core or RaveShelter application code or architecture is carried forward.

## Current state

MVP implementation was authorized on September 6, 2026. The repository now contains a React and TypeScript application plus a committed Supabase migration applied to `shelterpawtners-dev`.

The current implementation includes responsive public pages, permanent QR entry routing, four account-entry choices, email authentication, session-aware protected routes, sign-out, password recovery, a multi-role dashboard, role-specific onboarding, Passport Lite and adoption-confirmation intake, pet and RAVE marketplace channels, and protected data foundations for organization connections, offer comments, and direct conversations. Google sign-in remains disabled until provider credentials and approved redirect URLs are configured. Nothing has been deployed to the public ShelterPawtners domain.

## Planned capabilities

ShelterPawtners connects **Care, Savings, and Community** to support shelter pet adoption and long-term outcomes. The guardian-first MVP is planned to combine a limited Digital Pet Passport with an authenticated savings marketplace. After login, guardians should be encouraged to set up their pet while retaining the option to browse trustworthy public savings immediately.

Later work will add shelter verification and auditable guardianship transfers, private and adoption-qualified offers, partner redemptions and savings measurement, LostPaws community programs, authorized care contributions, and privacy-conscious insights.

LostPaws connects music festival and electronic music communities to this mission as an independent program. Naming a festival or artist does not establish affiliation.

## Development setup

Clone the repository, copy `.env.example` to `.env.local`, and supply the development Supabase URL and publishable key. Never commit secret or service-role credentials.

```bash
npm install
npm run dev
npm test
npm run build
```

Development work is limited to `shelterpawtners-dev`. Production connection, project creation, DNS changes, and deployment require explicit user instruction.

## Architecture

The frontend uses React, TypeScript, and Vite with a small custom CSS design system. Supabase provides PostgreSQL, authentication, storage, RLS, and APIs. Edge Functions will be added only for privileged workflows such as external adoption confirmation and email delivery. See [Architecture](docs/ARCHITECTURE.md) and [Security and privacy](docs/SECURITY-AND-PRIVACY.md).

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
