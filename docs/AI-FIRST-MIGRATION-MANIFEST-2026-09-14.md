# AI-First Documentation Migration Manifest — Phases 2-8

Status: **VERIFIED MANIFEST — execution not yet authorized.** Companion document to [`AI-FIRST-ARCHITECTURE-REVIEW-2026-09-14.md`](AI-FIRST-ARCHITECTURE-REVIEW-2026-09-14.md) and its verification addendum. Phase 1 (the classifier fix, drift check, and `docs/phases/PHASE-2.md` header correction) is already merged — see PR #172. Everything below is planned, verified against current `main`, and gated on a separate ChatGPT + owner go-ahead before any file moves.

Target end state: **8-10 files directly under `docs/`** (the authority chain plus a small number of tool-required files), everything else moved to a domain subtree or `docs/archive/**`.

## How to read this manifest

Each row states, per the owner's exact requested fields:

- **Current path**
- **Classification**: `KEEP_ROOT`, `MOVE`, `MERGE`, `ARCHIVE`, or `DELETE`
- **Destination / canonical replacement** (combined — the destination *is* the canonical replacement in every row below)
- **Unique content to preserve** (what must survive the move, if anything beyond the file itself)
- **Inbound references + scripts/workflows/tools affected** (combined — every reference found by a fresh `rg`/`grep` sweep this session)
- **Validation required** (beyond the standard per-phase validation stated once at the top of each phase)

Principle applied throughout, per the owner's explicit preference: **CONSOLIDATE → ARCHIVE → DELETE**, not "move everything into folders." A file only gets a bare `MOVE` when it is current, canonical, and has no overlapping sibling to consolidate into first.

Standard validation for every phase (stated once, not repeated per row): fresh branch from `main`; `rg` sweep confirms zero unresolved inbound reference to any changed path; `npm run check` green; `AGENTS.md` → `docs/AI-CONTROLLER.md` still leads to one obvious authority; no `src/`, `supabase/`, or deployment-config file touched.

---

## Phase 2 — Decision-log consolidation

Creates `docs/DECISIONS.md`. Four sources, one destination.

| Current path | Classification | Destination | Unique content to preserve | Inbound refs / scripts affected | Validation |
|---|---|---|---|---|---|
| `docs/AUTONOMOUS-DECISIONS.md` | MERGE | `docs/DECISIONS.md` | AD-001..AD-005 entries verbatim (architecture decisions: Google sign-in gating, active-role-as-interface-context, protected routes, hosted-preview-before-production, locked private audit store) | No inbound references found this session | Confirm all 5 AD- entries appear in `docs/DECISIONS.md` with original dates/status intact |
| `docs/DECISION-LOG.md` | MERGE | `docs/DECISIONS.md` | Phase 1 decision entries (272 lines — read the full file during the merge PR, not summarized here, to avoid transcription loss) | `docs/AUTONOMOUS-EXECUTION-POLICY.md`, `docs/OWNER-DECISION-BACKLOG.md`, `docs/phases/PHASE-2.md`, `docs/phases/PHASE-3.md`, several `docs/prompts/*`, `docs/REPOSITORY-INFORMATION-ARCHITECTURE-PLAN.md`, `docs/ROADMAP.md`, root `README.md` (its own hand-written doc index) | Update root `README.md`'s "Documentation" list in the same PR; update `scripts/set-active-phase.ps1`'s generated template (it names `docs/DECISION-LOG.md`) |
| `docs/OWNER-DECISION-BACKLOG.md` | MERGE | `docs/DECISIONS.md` | OD-001 (resolved), OD-002/003/004 (BLOCKING, still open) — preserve exact status/category/resolution fields | `docs/AI-OPERATING-PROTOCOL.md`, `docs/AUTONOMOUS-EXECUTION-POLICY.md`, `docs/OPEN-ITEMS-2026-09-12.md`, `docs/engineering/AGENT-OPERATIONS.md`, `docs/product/README.md` | OD-002/003/004 must remain clearly `BLOCKING` in the merged doc — these are live owner gates, not history |
| `docs/OWNER-REVIEW-DRAFTS-2026-09-12.md` (section 3 only) | MERGE (partial) | `docs/DECISIONS.md` (as a new open item) | The LLC/business-entity verification checklist and the unresolved "what exact legal entity name" question — confirmed not duplicated anywhere else in the repo | No inbound references found this session | Confirm with owner whether this question has been resolved out-of-band since 2026-09-12 before merging it in as still-open |

Sections 1-2 of `OWNER-REVIEW-DRAFTS-2026-09-12.md` (Lost Lands event draft, Seven Star Shelters draft) are handled in Phase 6 (ARCHIVE), superseded by `SEVEN-STAR-SHELTERS-LANDING-BRIEF.md`.

---

## Phase 3 — Protocol archival

Consolidates into the already-canonical `docs/engineering/AGENT-OPERATIONS.md`, then archives the sources. All five bear an explicit "superseded" banner already; this phase makes that physical, not just textual.

| Current path | Classification | Destination | Unique content to preserve | Inbound refs / scripts affected | Validation |
|---|---|---|---|---|---|
| `docs/AI-OPERATING-PROTOCOL.md` | ARCHIVE | `docs/archive/2026-mvp/retired-protocols/` | None beyond what `AGENT-OPERATIONS.md` already states (confirmed by full re-read) | `docs/AI-HANDOFF.md` (historical narrative only), `docs/OPEN-ITEMS-2026-09-12.md`, `docs/product/AGENT-START-PROMPTS.md`, two `docs/prompts/*` files (both themselves archived in Phase 6) | `scripts/check-doc-authority-drift.sh` (Phase 1) already asserts this filename does not appear in `AGENTS.md`/`CLAUDE.md`/`docs/README.md`/`docs/AI-CONTROLLER.md` — rerun it as part of this PR's validation |
| `docs/AUTONOMOUS-EXECUTION-POLICY.md` | ARCHIVE | `docs/archive/2026-mvp/retired-protocols/` | None beyond `AGENT-OPERATIONS.md` (confirmed) | `docs/AI-OPERATING-PROTOCOL.md`, `docs/OWNER-DECISION-BACKLOG.md` (both also moving in this migration) | Same drift-check rerun |
| `docs/CHATGPT-OPERATING-PROTOCOL.md` | ARCHIVE | `docs/archive/2026-mvp/retired-protocols/` | None beyond `AGENT-OPERATIONS.md` (confirmed) | `docs/AI-TOOLING-AND-DESIGN-ROADMAP.md` (also archiving) | Same drift-check rerun |
| `docs/DEV-LOOP-V2.md` | ARCHIVE | `docs/archive/2026-mvp/retired-protocols/` | None beyond `AGENT-OPERATIONS.md` (confirmed — read in full this session, not just the header banner) | None found | Same drift-check rerun |
| `docs/AI-COST-AND-TESTING-GOVERNANCE.md` | ARCHIVE | `docs/archive/2026-mvp/retired-protocols/` | None beyond `AGENT-OPERATIONS.md` (confirmed — read in full this session) | None found | Same drift-check rerun |
| `docs/QA-AUTOMATION-POLICY.md` | MERGE, then ARCHIVE | `docs/engineering/AGENT-OPERATIONS.md` | The 14-point "never end a work cycle in an ambiguous state" communication protocol (§"Continuous next-action handoff") is genuinely unique — not present in `AGENT-OPERATIONS.md` today — and should be folded in as a short subsection before the source is archived | `docs/ISSUE-5-COVERAGE-MATRIX.md`, two `docs/prompts/*` files | Confirm the 14-point protocol reads coherently as a subsection of `AGENT-OPERATIONS.md`, not a verbatim dump |
| `docs/AI-TOOLING-AND-DESIGN-ROADMAP.md` | ARCHIVE | `docs/archive/2026-mvp/retired-plans/` | None — all three streams marked `COMPLETE` in the source itself | `docs/CHATGPT-OPERATING-PROTOCOL.md` (also archiving) | None beyond standard |

---

## Phase 4 — Stale-narrative retirement

| Current path | Classification | Destination | Unique content to preserve | Inbound refs / scripts affected | Validation |
|---|---|---|---|---|---|
| `docs/CURRENT-WORK.md` | DELETE | `docs/AI-CONTROLLER.md` (already supersedes it) | None — confirmed stale (still describes Track 3 as "not started" though merged) | `AGENTS.md`, `CLAUDE.md`, `docs/AI-CONTROLLER.md`, `docs/AI-HANDOFF.md`, `docs/AI-OPERATING-PROTOCOL.md`, `docs/AUTONOMOUS-EXECUTION-POLICY.md`, `docs/CHATGPT-OPERATING-PROTOCOL.md`, `docs/OPEN-ITEMS-2026-09-12.md`, `docs/product/AGENT-START-PROMPTS.md`, six `docs/prompts/*` files, `docs/REPOSITORY-INFORMATION-ARCHITECTURE-PLAN.md`, root `README-AI-WORKFLOW-SETUP.md`, **`scripts/set-active-phase.ps1`** (writes to this path), **`scripts/show-ai-work-status.ps1`** (reads this path — found fresh this session, not in the original review) | Retire or repoint both PowerShell scripts *before* deleting the file, in the same PR — `show-ai-work-status.ps1` needs a new target (recommend: point it at `docs/AI-CONTROLLER.md` plus git status/log, same as today) or explicit retirement with a message telling the caller to read the controller directly |
| `docs/OPEN-ITEMS-2026-09-12.md` | MERGE, then DELETE | New short `docs/engineering/TECHNICAL-DEBT.md` (or a section of `AGENT-OPERATIONS.md`) for the durable facts; `docs/AI-CONTROLLER.md` for anything still live | The 628 KB single-bundle-chunk finding, the `legalRoutesReadyForPublication` dead-scaffolding finding, and the local Persona-QA-against-local-Supabase recipe — **corrected from the original review's plain-DELETE call**, see verification addendum | `docs/AI-HANDOFF.md`, `docs/prompts/VERCEL-MARKETPLACE-FOOTER-SPRINT.md` | Confirm the 628 KB and dead-scaffolding facts are still true on current `main` before merging them in as current debt (they were true as of 2026-09-12; a fresh build/grep check takes minutes) |
| `docs/STRATEGIC-PLAN-2026-09-12.md` | MERGE, then DELETE | Same `TECHNICAL-DEBT.md` target as above; `docs/AI-CONTROLLER.md` for anything still live | The same 628 KB bundle finding (duplicate of the above — merge once, not twice) plus the "what ready-for-human-validation means" checklist, which may still be useful as a release-readiness reference | None found | Same freshness check as above |

---

## Phase 5 — Domain-subtree creation and moves

Creates `docs/product/`, `docs/security/`, `docs/data/`, `docs/design/` (extending the pattern already proven by the existing `docs/legal/` and `docs/support/`), and populates `docs/engineering/` further. Migrate in subject-batches (one PR per row-group below), not all at once, per the owner's standing branch-hygiene preference.

### 5a — `docs/engineering/`

| Current path | Classification | Destination | Unique content to preserve | Inbound refs / scripts affected | Validation |
|---|---|---|---|---|---|
| `docs/ARCHITECTURE.md` | MOVE | `docs/engineering/ARCHITECTURE.md` | All of it — accurate at the principle level (confirmed against actual `src/`/`supabase/` structure this session) but should gain one paragraph naming the `src/main.tsx` monolith and CSS-file sprawl as known debt, since it currently gives no reader any warning | Root `README.md`, `.agents/skills/shelterpawtners/SKILL.md` | Update both references in the same PR |
| `docs/HOSTED-QA.md` | MOVE | `docs/engineering/HOSTED-QA.md` | All of it | Root `README.md` ("Hosted shared-development QA") | Update reference |
| `docs/ISSUE-5-COVERAGE-MATRIX.md` | MOVE | `docs/engineering/ISSUE-5-COVERAGE-MATRIX.md` | All of it | `AGENTS.md`'s "Issue #5" regression reference (by concept, not literal path) | None beyond standard |
| `docs/QA-TEST-ACCOUNTS.md` | MOVE | `docs/engineering/QA-TEST-ACCOUNTS.md` | All of it | None found | None beyond standard |
| `docs/PROJECT-TECH-GLOSSARY.md` | MOVE | `docs/engineering/PROJECT-TECH-GLOSSARY.md` | All of it | None found | None beyond standard |
| `docs/COPILOT-LOCAL-SETUP.md` | MOVE | `docs/engineering/COPILOT-LOCAL-SETUP.md` | All of it (content-audited this session, confirmed unique) | None found | None beyond standard |
| `docs/JIM-LOCAL-PC-SETUP.md` | MOVE | `docs/engineering/JIM-LOCAL-PC-SETUP.md` | All of it (content-audited this session, confirmed no secrets present) | None found | Re-confirm no secrets at move time (quick grep), matching the file's own stated rule |

### 5b — `docs/product/`

| Current path | Classification | Destination | Unique content to preserve | Inbound refs / scripts affected | Validation |
|---|---|---|---|---|---|
| `docs/PRODUCT-VISION.md` | MOVE | `docs/product/PRODUCT-VISION.md` | All of it | Root `README.md` | Update reference |
| `docs/PRODUCT-REQUIREMENTS.md` | MOVE | `docs/product/PRODUCT-REQUIREMENTS.md` | All of it | Root `README.md`, `.agents/skills/shelterpawtners/SKILL.md` | Update both |
| `docs/USER-ROLES.md` | MOVE | `docs/product/USER-ROLES.md` | All of it | Root `README.md`, `.agents/skills/shelterpawtners/SKILL.md` | Update both |
| `docs/ROADMAP.md` | MOVE + MERGE target | `docs/product/ROADMAP.md` | All of it, plus folds in `docs/phases/PHASE-3.md`, `PHASE-4.md`, `PHASE-5.md` per the owner's "one current roadmap" decision | Root `README.md`, `docs/DECISION-LOG.md`, `docs/PHASE-1-EXECUTION.md`, `docs/PHASE-1-PROGRESS.md` | Confirm no forward-looking commitment is lost/altered in the phase-3/4/5 fold-in; this is a content-sensitive merge, do it as its own reviewed sub-step |
| `docs/BUSINESS-STRUCTURE-AND-IMPACT.md` | MOVE | `docs/product/BUSINESS-STRUCTURE-AND-IMPACT.md` | All of it (content-audited this session) | None found | None beyond standard |
| `docs/LOSTPAWS-RAVE-LANDING-DIRECTION.md` | MOVE | `docs/product/LOSTPAWS-RAVE-LANDING-DIRECTION.md` | All of it, with the stale "IMPLEMENTATION IN PROGRESS" header corrected to "implemented — reference spec" in the same PR | Issues #96/#58/#54 (GitHub, not repo-file) | Bundle the header fix with the move, not a separate PR |
| `docs/SEVEN-STAR-SHELTERS-LANDING-BRIEF.md` | MOVE | `docs/product/SEVEN-STAR-SHELTERS-LANDING-BRIEF.md` | All of it (content-audited this session, confirmed active/current) | None found | None beyond standard |
| `docs/MARKETPLACE-RESEARCH.md` | MOVE (tentative — one more content check recommended first) | `docs/product/MARKETPLACE-RESEARCH.md` | Not re-read this session; root `README.md` already treats it as canonical | Root `README.md` | Do a fresh 5-minute content read immediately before this specific move to confirm it hasn't gone stale since the original review |

### 5c — `docs/security/`, `docs/data/`, `docs/design/`

| Current path | Classification | Destination | Unique content to preserve | Inbound refs / scripts affected | Validation |
|---|---|---|---|---|---|
| `docs/SECURITY-AND-PRIVACY.md` | MOVE | `docs/security/SECURITY-AND-PRIVACY.md` | All of it | Root `README.md`, `.agents/skills/shelterpawtners/SKILL.md` | Update both |
| `docs/SHELTER-DATA-STANDARDS.md` | MOVE | `docs/data/SHELTER-DATA-STANDARDS.md` | All of it | None found | None beyond standard |
| `docs/FINANCIAL-LEDGER-AND-GIVING.md` | MOVE | `docs/data/FINANCIAL-LEDGER-AND-GIVING.md` | All of it | None found | None beyond standard |
| `docs/BRAND-DESIGN-SYSTEM.md` | MOVE | `docs/design/BRAND-DESIGN-SYSTEM.md` | All of it | Root `README.md`, `.github/copilot-instructions.md`, `.github/skills/*/SKILL.md` | Update all three |
| `docs/CONTENT-STANDARDS.md` | MOVE | `docs/design/CONTENT-STANDARDS.md` | All of it | Root `README.md` | Update reference |

### 5d — Claude Code router (additive, not a move — verified this session, not executed)

| Item | Classification | Action | Notes |
|---|---|---|---|
| `.claude/skills/lostpaws/SKILL.md` | NEW (additive) | Create, mirroring `.agents/skills/shelterpawtners/SKILL.md`'s routing table | Confirmed supported by current Claude Code documentation (`.claude/skills/<name>/SKILL.md`, `description` frontmatter, auto-discovered description + on-demand full content). Genuinely new capability, not a consolidation — flagged for explicit sign-off per the original review, now unblocked by verification. |
| `CLAUDE.md` first line | NEW (additive, optional) | Consider replacing "Read the shared authority chain in this order: 1. current GitHub `main`; 2. `AGENTS.md`; ..." with a literal `@AGENTS.md` import | Confirmed supported and is Anthropic's own worked example for exactly this repo shape (cross-tool `AGENTS.md` + tool-specific `CLAUDE.md`). Guarantees the content is in context rather than instruction-dependent. Low-risk, optional, not required for the router to work. |

---

## Phase 6 — Historical archive

Everything below moves to `docs/archive/2026-mvp/{launch,checkpoints,retired-plans}/` by theme. None of these had any inbound reference found beyond each other (dated docs cross-referencing other dated docs) except where noted.

| Current path | Destination | Notes |
|---|---|---|
| `docs/CUTOVER-SHELTERPAWTNERS-COM.md` | `archive/.../launch/` | Cutover is complete per `AI-CONTROLLER.md`'s own account |
| `docs/LAUNCH-ACCOUNT-READINESS.md` | `archive/.../launch/` | |
| `docs/LAUNCH-AUTH-EMAIL-READINESS.md` | `archive/.../launch/` | Overlaps `LL4-AUTH-EMAIL-READINESS.md` |
| `docs/LAUNCH-CANDIDATE-PLAN.md` | `archive/.../launch/` | |
| `docs/LAUNCH-DATA-HYGIENE-FINDINGS.md` | `archive/.../launch/` | |
| `docs/LAUNCH-READINESS-CHECKLIST.md` | `archive/.../launch/` | Overlaps `LL6-LAUNCH-READINESS.md` |
| `docs/LAUNCH-RESOURCE-PUBLISHING-RULES.md` | `archive/.../launch/` | |
| `docs/LAUNCH-RESOURCE-RESEARCH.md` | `archive/.../launch/` | |
| `docs/LAUNCH-RESOURCE-WAVE-1.md` | `archive/.../launch/` | |
| `docs/LL4-AUTH-EMAIL-READINESS.md` | `archive/.../launch/` | |
| `docs/LL5-META-SOCIAL-AUTH.md` | `archive/.../launch/` | Meta is deferred; nothing here is live |
| `docs/LL6-LAUNCH-READINESS.md` | `archive/.../launch/` | |
| `docs/BRANCH-CLEANUP-2026-09-11.md` | `archive/.../checkpoints/` | One-time audit; branch state is now clean (verified this session: only `origin/main` remains) |
| `docs/BRANCH-RETIREMENT-2026-09-12.md` | `archive/.../checkpoints/` | Same |
| `docs/MAIN-PROTECTION-AND-BRANCH-RETIREMENT.md` | `archive/.../checkpoints/` | Issue #107 complete |
| `docs/SITE-REVIEW-2026-09-12.md` | `archive/.../checkpoints/` | Findings already captured in `e2e/site-hygiene.spec.ts` |
| `docs/PHASE-1-EXECUTION.md` | `archive/.../checkpoints/` | Referenced by root `README.md` ("Phase 1 execution") and `scripts/set-active-phase.ps1` — update both first |
| `docs/PHASE-1-PROGRESS.md` | `archive/.../checkpoints/` | Referenced by `docs/progress/README.md`, `scripts/set-active-phase.ps1` |
| `docs/phases/PHASE-2.md` | `archive/.../checkpoints/` | Phase complete (status corrected in Phase 1); confirm no decision inside it is missing from `docs/DECISIONS.md` before archiving |
| `docs/FESTIVAL-MVP-AND-VERIFICATION.md` | `archive/.../retired-plans/` | |
| `docs/MARKETPLACE-DESIGN-SPRINT.md` | `archive/.../retired-plans/` | |
| `docs/MVP-PROFILE-DATA-MODEL-REVIEW.md` | `archive/.../retired-plans/` | Migrations are canonical now |
| `docs/RAVE-SHELTER-LOSTPAWS-MISSION.md` | `archive/.../retired-plans/` | Already explicitly marked superseded |
| `docs/OWNER-REVIEW-DRAFTS-2026-09-12.md` (sections 1-2 only) | `archive/.../retired-plans/` | After section 3's LLC checklist is merged out in Phase 2 |
| `docs/prompts/*` (16 of 17 files) | `archive/2026-mvp/retired-prompts/` | Every file except `CHATGPT-SESSION-BOOTSTRAP.md`, which stays at `docs/prompts/CHATGPT-SESSION-BOOTSTRAP.md` as the one retained reusable adapter (confirmed by its own `README.md`) |
| `docs/meta/META-APP-REVIEW-READINESS.md` | `archive/.../launch/` (tentative) | Not re-read this session; Meta is explicitly deferred (Issue #119) — likely archivable, confirm with a 2-minute read before moving |

---

## Phase 7 — Content-audit closeout

**Effectively complete as of this verification pass.** All six previously-`REVIEW→` files were content-audited this session (see the architecture review's verification addendum) and have confirmed dispositions folded into Phase 5 above. Only `docs/MARKETPLACE-RESEARCH.md` (never one of the six, a separate tentative row) still wants one more content check, noted in Phase 5b.

---

## Phase 8 — Machine-readable state

Per the owner's explicit decision: **YAML becomes authoritative; Markdown becomes a generated, read-only human view.**

1. Create `docs/engineering/state/release-state.yaml` with the 7 required fields (`STATUS`, `CURRENT_PHASE`, `CURRENT_CHECKPOINT`, `NEXT_CHECKPOINT`, `OWNER_DECISION_REQUIRED`, `SAFE_TO_CONTINUE`, `ACCEPTED_CODE_SHA`) plus the 2 extended fields already in use (`ACCEPTANCE_RUNTIME`, `ACCEPTANCE_DEPLOYED_SHA`). Add a minimal JSON Schema and a CI check that validates the YAML against it on every PR that touches the file.
2. Migrate the four confirmed consumers **in the same PR**, with a dry run proving each still resolves correctly before merge:
   - `.github/workflows/merge-gate.yml` (6 `state_file=` occurrences across its steps)
   - `.github/workflows/persona-qa.yml`
   - `.github/workflows/hosted-qa.yml` (6 occurrences, including the literal `grep -q "^CURRENT_CHECKPOINT: Issue #5"` string match at line 212-213 — this exact match must keep working against however the YAML gets flattened/read, or be rewritten to read the YAML field directly)
   - `scripts/update-ai-ops-status.sh` (reads the file via the GitHub Contents API and decodes it)
3. Regenerate `docs/engineering/AI-RELEASE-STATE.md` (and, while `docs/AI-HANDOFF.md` still exists for inbound-link compatibility, that file too) as build output from the YAML — a small script, run in CI and/or as a pre-commit step, not hand-edited afterward.
4. Extend `scripts/check-doc-authority-drift.sh` (already exists from Phase 1) with one more assertion: the generated Markdown view's content must match what regenerating from the current YAML would produce — i.e. fail if someone hand-edits the generated file directly. This directly implements the owner's "must not become independently writable" requirement.
5. Re-run `scripts/verify-ai-release-state-contract.sh` (already exists, already wired into CI since Phase 1) — it should need no changes, since its job (assert the two files' required fields match) is unaffected by *how* the Markdown file is produced.

This phase is the most technically involved in the manifest and is the one place a dry-run-before-merge is non-negotiable, per the original review's risk table.

---

## Not in this manifest (confirmed out of scope, tracked separately)

- **Automation additions** (scheduled health workflow, doc-drift-check extensions beyond Phase 8's, dependency auto-merge, production smoke, rollback runbook) — these are the original review's §12 items 3-7, not documentation migration; they proceed independently once resourced, per the owner's "Support OS is independent and parallel" framing extended to automation generally.
- **Runtime refactors** (`src/main.tsx` decomposition, marketplace CSS consolidation) — explicitly out of scope per owner instruction; track as a separate product/engineering-debt issue.
- **Support OS activation** — independent, parallel, owner-decision-gated (alert destination + two secrets), not sequenced behind any phase above.
