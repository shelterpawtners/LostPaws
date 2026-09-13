# Repository Information Architecture Plan

Status: **DRAFT FOR CROSS-AGENT REVIEW — no moves/deletes authorized**

Related: Issue #136, draft PR #144

## Purpose

Create a future-proof repository structure that is easy for humans and AI agents to navigate, minimizes conflicting instructions, preserves historical decisions without letting stale notes compete with current authority, and keeps tool-required files in the exact locations expected by VS Code, Claude, Codex/OpenAI, GitHub Copilot, GitHub Actions, Vercel, Supabase, and the application runtime.

This document is the shared planning artifact for ChatGPT, Claude, Work, Copilot, and the owner. It does **not** authorize file moves, deletions, renames, or behavior changes.

## Current problem

The repository has grown quickly and now contains multiple layers of configuration and documentation:

- tool-specific hidden folders such as `.agents`, `.github/**`, `.openai`, and local `.vscode` state;
- root-level agent/adaptor files such as `AGENTS.md`, `CLAUDE.md`, and AI workflow setup docs;
- a large `docs/` tree containing live status, operating guidance, product/architecture/security/legal references, dated launch notes, progress checkpoints, and historical plans;
- overlapping subject matter across tool-specific instructions, active project docs, and historical records.

Some duplication is intentional because tools discover files by convention. Other duplication is knowledge duplication and creates context cost, stale-instruction risk, and ambiguity about authority.

## Design principles

1. **Do not move tool-required files merely for visual cleanliness.** Convention-based paths remain where their tools expect them.
2. **One canonical source per durable subject.** Tool-specific files should point to canonical knowledge instead of duplicating it.
3. **One live project-status authority.** `docs/AI-CONTROLLER.md` remains the sole live status / blocker / next-action source unless explicitly changed later.
4. **Archive history, do not let history act as instructions.** Completed plans, checkpoints, launch notes, and superseded prompts should live under an explicit archive or rely on Git history after durable content is migrated.
5. **Keep archive content out of normal agent startup context.** Agents should be told that `docs/archive/**` is historical evidence, not active instruction.
6. **Prefer shallow, obvious structures.** Avoid creating nested folder trees that look organized but make discovery harder.
7. **Preserve links and automation.** Every move requires inbound-reference analysis and validation.
8. **Separate planning from execution.** Audit first, approve target architecture second, migrate in small PRs third.

## Four repository classes

### A. Runtime / product

Examples: application source, tests, Supabase migrations/functions, package/config files, deployment configuration, public assets.

Rules:
- organized primarily by runtime/development conventions;
- never mixed with historical documentation;
- moves require build/test/deploy verification.

### B. Active tool configuration

Examples may include:
- `.github/workflows/**`
- `.github/instructions/**`
- `.github/agents/**`
- `.github/prompts/**`
- `.github/skills/**`
- `.agents/**`
- `.openai/**`
- `AGENTS.md`
- `CLAUDE.md`
- other convention-based tool entry files

Rules:
- keep exact required paths when a tool discovers them by convention;
- make these thin adapters where possible;
- point to canonical project docs rather than restating large policies;
- intentional tool-specific duplication must be documented as intentional.

### C. Canonical current knowledge

Proposed subject areas:

- `docs/AI-CONTROLLER.md` — live status only
- `docs/README.md` — documentation map / authority guide
- `docs/DECISIONS.md` — durable cross-domain decisions and unresolved owner gates
- `docs/engineering/` — agent operations, architecture, QA/development standards
- `docs/product/` — product vision, requirements, roles, roadmap
- `docs/security/` — security/privacy engineering guidance
- `docs/legal/` — legal/policy decision records and publication artifacts
- `docs/data/` — data standards / ledger / schema-domain references
- `docs/design/` — brand/content/design standards
- `docs/tasks/active/` — active task briefs only when a task truly needs a repo-native brief

Exact folders are provisional until dependency audit confirms the best target.

### D. Historical archive

Proposed pattern:

```text
docs/archive/
  2026-mvp/
    launch/
    phases/
    checkpoints/
    retired-plans/
    retired-prompts/
```

Archive rules:
- historical evidence only;
- not part of normal agent startup;
- must not override `AGENTS.md`, `docs/AI-CONTROLLER.md`, an active Issue, or canonical domain docs;
- use Git history instead of repository archive files when no ongoing audit/reference value exists.

## Authority model

Target default startup contract for substantial agent work:

1. current GitHub `main`
2. `AGENTS.md`
3. `docs/AI-CONTROLLER.md`
4. active GitHub Issue / task brief
5. at most one relevant canonical domain document unless additional context is genuinely required

Tool-specific adapters such as `CLAUDE.md` or Copilot instructions should add only tool-specific behavior and point back to the authority chain above.

## Audit required before any migration

Claude / local-workspace review should inspect the **entire repository**, including hidden folders, and provide evidence for:

1. Which files/folders are discovered by convention by Claude, Codex/OpenAI, Copilot, VS Code, GitHub Actions, Vercel, Supabase, or runtime tooling.
2. Which similar-looking folders are intentionally distinct versus unnecessary duplication.
3. Inbound references to every proposed move, rename, consolidation, archive, or deletion.
4. Files referenced by scripts, workflows, prompts, tests, package commands, CI, deployment config, or agent instructions.
5. Knowledge conflicts: two active-looking documents that give materially different instructions.
6. Historical files that contain unique durable decisions not yet present in canonical docs.
7. Files that can safely disappear from the working tree because Git history is sufficient.

## Proposed audit classifications

Every relevant file should receive one of:

- **KEEP — TOOL REQUIRED**
- **KEEP — CANONICAL ACTIVE**
- **CONSOLIDATE**
- **MOVE**
- **ARCHIVE**
- **DELETE AFTER MIGRATION**
- **REVIEW / UNCERTAIN**

Each non-KEEP action should include:
- target path;
- reason;
- inbound references;
- unique knowledge to preserve;
- tool/runtime risk;
- required validation.

## Migration sequence after approval

### Phase 0 — Audit only

- no file moves/deletes;
- validate tool conventions and references;
- refine PR #144 migration matrix;
- owner/ChatGPT review of target tree.

### Phase 1 — Establish canonical structure

- create `docs/README.md` authority/index;
- create only the canonical folders/files justified by the audit;
- consolidate durable knowledge into those files;
- keep compatibility pointers where required.

### Phase 2 — Thin tool adapters

- reduce duplicated policy in `AGENTS.md`, `CLAUDE.md`, Copilot instructions, skills, prompts, and other adapters where safe;
- preserve tool-specific requirements and discovery paths.

### Phase 3 — Historical archive

- move truly useful historical records into explicit archive locations;
- add archive guidance stating they are non-authoritative;
- update references.

### Phase 4 — Remove unnecessary history from working tree

- delete files only after durable knowledge and references are verified;
- rely on Git history for material that does not merit a maintained archive copy.

### Phase 5 — Verification

- validate links/references;
- run CI and relevant tests;
- verify GitHub workflows;
- verify VS Code / Claude / Codex / Copilot instruction discovery;
- verify Vercel/Supabase/runtime behavior is unchanged;
- confirm agent startup context is materially smaller and authority is obvious.

## Review questions for Claude

Claude should challenge this plan rather than merely agree with it:

1. Which proposed paths would break or weaken Claude/VS Code behavior?
2. Are `.agents`, `.github/agents`, `.github/instructions`, `.github/prompts`, `.github/skills`, and `.openai` all intentionally distinct in this repo? Which are required by actual tooling versus historical experiments?
3. Are there additional tool-specific conventions not represented here?
4. Is the proposed canonical docs taxonomy too broad, too deep, or missing an important domain?
5. Which current files are genuine conflicting duplicates versus intentional adapters?
6. Which dated documents should remain archived in-repo versus relying entirely on Git history?
7. Are any source/test/config directories currently duplicated or nested in a way that creates runtime or developer confusion?
8. What changes would make future Claude/Codex/Copilot sessions cheaper and more deterministic without losing needed context?
9. What should be changed in draft PR #144 before any migration execution begins?

## Definition of done for planning

Before migration starts, all reviewers should be able to answer:

- what each top-level folder is for;
- which files are active authority;
- which paths are tool-required;
- which files are canonical current knowledge;
- which content is historical only;
- where a future developer or agent should look first;
- how to add a new enhancement without creating another competing documentation layer.

Only after this plan and the migration matrix are reviewed and approved should file moves/deletions begin.
