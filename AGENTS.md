# LostPaws agent instructions

## Scope and authority

This is the new, clean application repository for ShelterPawtners and its LostPaws initiative. The user approved the MVP and authorized implementation in `shelterpawtners-dev` on September 6, 2026. Application code, committed migrations, development authentication, and development data work are authorized within the approved roadmap and security requirements.

Do not connect to or create production infrastructure, modify public DNS, or deploy over the current live site without explicit user instruction.

Do not copy code, CSS, HTML, components, or architecture from Core or RaveShelter. Do not modify another ShelterPawtners repository. Inspect a specific legacy item only when explicitly instructed; permission to inspect does not imply permission to copy.

The documents capture authoritative user requirements. Explicit subsequent user decisions supersede earlier project choices; update affected documents when a decision changes. Do not invent business requirements. Ask for clarification only when an unresolved decision creates material product, security, legal, privacy, or architectural risk. Otherwise make a reasonable implementation choice and document its rationale and tradeoffs in the relevant document.

## Read before working

Read [README.md](README.md) for current state and [.agents/skills/shelterpawtners/SKILL.md](.agents/skills/shelterpawtners/SKILL.md) for task-specific document routing. Read relevant documents before architectural changes. Each topic has a canonical home:

| Topic                                                          | Authoritative document                                                          |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Mission, ecosystem, audiences                                  | [Product vision](docs/PRODUCT-VISION.md)                                        |
| Product behavior and acceptance expectations                   | [Product requirements](docs/PRODUCT-REQUIREMENTS.md)                            |
| Marketplace research, classification, freshness                | [Marketplace research](docs/MARKETPLACE-RESEARCH.md)                            |
| Festival deadline, Rave Shelter channel, adoption verification | [Festival MVP and adoption verification](docs/FESTIVAL-MVP-AND-VERIFICATION.md) |
| Roles, organization membership, scope                          | [User roles](docs/USER-ROLES.md)                                                |
| Visual direction and design process                            | [Brand design system](docs/BRAND-DESIGN-SYSTEM.md)                              |
| Terminology, claims, customer copy                             | [Content standards](docs/CONTENT-STANDARDS.md)                                  |
| Technical direction and engineering choices                    | [Architecture](docs/ARCHITECTURE.md)                                            |
| Phasing, dependencies, unresolved decisions                    | [Roadmap](docs/ROADMAP.md)                                                      |
| Autonomous implementation decisions                            | [Phase 1 decision log](docs/DECISION-LOG.md)                                    |
| Privacy, authorization, transfer safeguards                    | [Security and privacy](docs/SECURITY-AND-PRIVACY.md)                            |

Keep detailed guidance in its canonical document and link to it elsewhere. Resolve contradictions instead of adding competing instructions. Preserve the distinction between required behavior, preferred technology, proposed implementation choices, and deferred decisions.

Record every meaningful product, design, technical, security, sequencing, or operational decision made without direct user approval in the [Phase 1 decision log](docs/DECISION-LOG.md). Add the entry in the same change that implements the decision, including rationale and consequences. Do not use the log as permission to decide matters requiring user authority.

## Engineering conduct

- Prefer small, testable changes and reusable components. Avoid unnecessary dependencies and premature enterprise complexity.
- Run relevant tests and builds before declaring implementation complete. Review frontend changes in a browser, including responsive behavior, keyboard use, focus states, and accessibility. Compilation alone is insufficient.
- Validate documentation plus the real application tests, production build, responsive interface, accessibility behavior, and relevant Supabase advisors.
- Keep database schema changes in committed migrations. Never fix authorization only in the frontend, expose credentials, commit secrets, or bypass or weaken RLS to make a feature work.
- Use only the development Supabase project, `shelterpawtners-dev`, once the specific implementation action is authorized. Production connection or creation requires explicit user instruction.
- Preserve provenance and auditability for verification, transfers, guardianship, provider contributions, marketplace entries, redemptions, and administrative actions.
- Treat marketplace source, classification, eligibility, freshness, expiration, disclosure, and human publication as product requirements. Never imply a public provider is a ShelterPawtners partner.
- Do not claim unfinished capabilities are functional. Do not fabricate statistics, partnerships, testimonials, discounts, research findings, or official affiliations.
- Follow the content and brand documents for customer-facing material. Preserve accessibility and privacy through implementation and browser review.

## Completion reporting

State what changed, what was checked, material limitations, and unresolved decisions. Keep README current state accurate. The implementation gate is lifted for the approved development MVP. Production deployment remains separately gated.
