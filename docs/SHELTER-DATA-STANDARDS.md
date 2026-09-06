# Shelter data standards

External shelter records map into `pets`, `pet_external_identifiers`, and append-only `pet_lifecycle_events`. `source_systems` identifies the origin; `import_jobs` records each batch and its totals. Source identifiers are retained so imports are idempotent and traceable.

| External concept      | ShelterPawtners target                     |
| --------------------- | ------------------------------------------ |
| Animal record         | `pets`                                     |
| Source animal ID      | `pet_external_identifiers`                 |
| Intake/outcome record | `pet_lifecycle_events`                     |
| Shelter or rescue     | `organizations`                            |
| Import batch          | `import_jobs`                              |
| Source confidence     | `provenance_types` and verification status |

Initial canonical events cover intake, transfer, adoption, return, other live outcomes, euthanasia, death, and loss in care. Each maps to a Shelter Animals Count-style reporting category through reference data rather than application conditionals.

Rules:

- Never overwrite historical events because a later source differs.
- Preserve source system, external record ID, provenance, and verification state.
- Record rejects without discarding successful rows.
- Mark demo imports explicitly and exclude them from metrics and communications.
- Treat aggregate benchmarks as research data until license and intended use are confirmed.
- Keep full microchip values private by default.
