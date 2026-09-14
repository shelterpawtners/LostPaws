# Documentation Authority Guide

`docs/` root holds only the four files an agent needs at the start of any
task. Everything else lives in a domain subtree or under `docs/archive/`.

## Read order for substantial work

1. current GitHub `main`;
2. `AGENTS.md` (Claude Code sessions: `CLAUDE.md`, which imports `AGENTS.md`);
3. `docs/AI-CONTROLLER.md`;
4. the active GitHub Issue/PR or task brief;
5. only the domain document needed for the task -- see the map below, or use
   a tool-specific skill router (`.claude/skills/lostpaws/SKILL.md`,
   `.agents/skills/shelterpawtners/SKILL.md`, or `.github/skills/*/SKILL.md`)
   to find it faster.

## docs/ root (authoritative, always current)

- **`README.md`** -- this file.
- **`AI-CONTROLLER.md`** -- live human status, blockers, and next actions.
- **`AI-HANDOFF.md`** -- field-compatible legacy adapter for inbound links;
  its status block is generated, not hand-edited (see Machine-readable
  state below).
- **`DECISIONS.md`** -- durable architecture/product decisions and open
  owner gates (`OD-*`, `D-*`, `AD-*`).

## Domain subtrees

| Subtree                  | Contents                                                                                                                                                                                                                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/engineering/`      | `AGENT-OPERATIONS.md` (canonical autonomy/validation/cost rules), `AI-RELEASE-STATE.md` (generated), `ARCHITECTURE.md`, `TECHNICAL-DEBT.md`, `HOSTED-QA.md`, `ISSUE-5-COVERAGE-MATRIX.md`, `QA-TEST-ACCOUNTS.md`, `PROJECT-TECH-GLOSSARY.md`, local setup notes, and `state/` (machine-readable YAML) |
| `docs/product/`          | Product vision/requirements, user roles, roadmap (`ROADMAP.md` plus detail specs under `roadmap/`), marketplace/campaign proposals                                                                                                                                                                    |
| `docs/security/`         | Security and privacy requirements                                                                                                                                                                                                                                                                     |
| `docs/data/`             | Shelter data standards, financial/giving ledger model                                                                                                                                                                                                                                                 |
| `docs/design/`           | Brand design system, content standards                                                                                                                                                                                                                                                                |
| `docs/legal/`            | Legal policy decisions and draft publication artifacts                                                                                                                                                                                                                                                |
| `docs/support/`          | Support operating model, triage, escalation, runbooks                                                                                                                                                                                                                                                 |
| `docs/meta/`             | Meta/Facebook app-review readiness (owner/legal-gated, currently deferred)                                                                                                                                                                                                                            |
| `docs/prompts/`          | `CHATGPT-SESSION-BOOTSTRAP.md` (the one retained reusable session adapter) plus its own index                                                                                                                                                                                                         |
| `docs/archive/2026-mvp/` | Historical evidence only -- see below                                                                                                                                                                                                                                                                 |

## Authority boundaries

- **Live human status:** `AI-CONTROLLER.md` is the source for current blockers, active lanes, and next actions.
- **Machine-readable release state:** `docs/engineering/state/release-state.yaml` is the single writable source of truth. `docs/engineering/AI-RELEASE-STATE.md` (CI-required) and `AI-HANDOFF.md`'s status block are generated from it by `node scripts/release-state.mjs generate` and drift-checked by `scripts/check-doc-authority-drift.sh` -- never hand-edit either generated file.
- **Task-specific contract:** the active GitHub Issue/PR takes precedence for scope and acceptance.
- **Durable knowledge:** use the relevant document from the domain-subtree map above.
- **Detailed agent operations:** [`engineering/AGENT-OPERATIONS.md`](engineering/AGENT-OPERATIONS.md) is the canonical autonomy, validation, cost, and development-loop reference.
- **Durable decisions and open gates:** [`DECISIONS.md`](DECISIONS.md).
- **Historical material:** everything under `docs/archive/2026-mvp/**` is evidence, never live instruction, and is excluded from routine agent startup context. Open it only when explicitly investigating history. `scripts/check-doc-authority-drift.sh` fails CI if an authority-chain file (`AGENTS.md`, `CLAUDE.md`, this file, `AI-CONTROLLER.md`) ever references archived material as if it were current.

## Documentation changes

Do not move, archive, or delete a document until its inbound references and unique durable knowledge have been audited. Keep tool-discovered files in their required paths (`.github/**`, `.agents/**`, `.claude/**`). Make one bounded documentation migration per pull request and validate links, formatting, workflows, and any affected scripts with `npm run check` and `scripts/check-doc-authority-drift.sh`.

The full audit and migration history behind the current structure is preserved at `docs/archive/2026-mvp/retired-plans/REPOSITORY-INFORMATION-ARCHITECTURE-PLAN.md` and `docs/archive/2026-mvp/retired-plans/DOCUMENTATION-MIGRATION-MATRIX.md` (historical; the migration they scoped is complete).
