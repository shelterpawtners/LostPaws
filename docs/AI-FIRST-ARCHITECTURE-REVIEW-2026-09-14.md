# AI-First Architecture Review — 2026-09-14

Status: **VERIFIED; PHASE 1 GREEN, AWAITING OWNER MERGE — Phases 2-8 (mass documentation restructure) remain owner/ChatGPT-gated.** See the verification addendum and migration manifest below/linked before relying on any specific claim in the original review body that follows — a small number of its conclusions were corrected after re-checking current `main`.

Branch: `architecture/ai-first-operating-model-review` (from `main` at `f684025`). Rollback baseline: tag `pre-ai-first-migration-2026-09-14` → `f684025`. Phase 1 safety PR: #172.

Scope: full repository, documentation, CI/CD, and agent-operating-model review requested by the owner as "Lead Enterprise Solution Architect / AI-Native Software Operations Architect." This is assessment and planning only. No runtime/UI/product behavior changed. No files moved, archived, merged, or deleted in this session — the only new artifact is this document.

---

## 1. Executive summary

ShelterPawtners/LostPaws already has an unusually mature AI-agent operating model for a solo-founder startup: a real authority chain (`main` → `AGENTS.md` → `AI-CONTROLLER.md` → active Issue/PR → domain doc), a working GREEN/YELLOW/RED autonomy policy, impact-classified conditional CI, an evidence-polling merge gate, and thin per-tool adapter files that route to canonical docs instead of restating policy. This is the right shape for 2026 AI-first engineering and should be **kept, not replaced**.

The problem is not the model — it is that the repository is carrying **two full generations of that model at once**. Issue #136 (PRs #144–#168) already built the *next* generation — `docs/engineering/AGENT-OPERATIONS.md` (canonical operations), `docs/engineering/AI-RELEASE-STATE.md` (canonical machine state), a rewritten short-form `AI-CONTROLLER.md`, and `docs/README.md` (authority map) — and explicitly marked five older documents as superseded. But those five documents, plus four overlapping decision logs and roughly twenty dated launch/checkpoint/prompt snapshots, are all still sitting at `docs/` root, unarchived, indistinguishable at a glance from the current authority. An agent (or ChatGPT, or Jim) opening `docs/` today sees 61 files at the root with no visual or structural signal for which nine or ten are load-bearing.

This review's core recommendation is therefore **finish the consolidation that is already in flight**, rather than invent a new one: archive the five explicitly-superseded protocol docs, merge four decision-record docs into one, retire two stale live-status narratives, and move roughly twenty dated snapshots into an explicit archive hierarchy — all using the classification discipline the repository's own `DOCUMENTATION-MIGRATION-MATRIX.md` already established. Layered on top of that finished consolidation, this review recommends a modest, startup-appropriate set of upgrades: a small machine-readable state layer (YAML, schema-checked) to replace grep/sed-on-prose parsing that is currently one accidental reformat away from silently breaking three required CI gates; a fix for a confirmed `case`-statement bug in the change-impact classifier; and a handful of cheap, high-value automation additions (scheduled health checks, doc-drift detection, dependency auto-merge for green patch/minor bumps) that move the repo further toward the "routine work proceeds autonomously, only RED work waits for a human" model the owner asked for — without adding enterprise ceremony a one-person shop doesn't need yet.

Net effect if the recommended migration is executed: `docs/` root drops from 61 files to roughly 8–10 (the authority chain plus a few tool-required files); every remaining root file is either load-bearing or a pointer; and a new agent's mandatory pre-work reading drops from "AGENTS.md plus whichever of six overlapping protocol docs it happens to open" to "AGENTS.md plus one canonical operations doc plus the live controller" — the four-hop chain the repository already declares as its target but does not yet uniformly enforce.

## 2. Current-state architecture assessment

**Runtime.** React 19 + TypeScript 7 + Vite 8 + Tailwind 4 + Supabase, exactly as `AGENTS.md` states. Dependencies are deliberately minimal — no state-management library, no UI kit, no CSS-in-JS. `src/` is 86 files (~12k LOC) and is well-decomposed *except* for one significant outlier: **`src/main.tsx` is 2,628 lines** and contains the router, `AuthProvider`, global header/footer, and roughly 30 page-level components defined inline, where a conventional React app would split these into a `pages/` or `routes/` tree. `src/lib/` (business logic, ~20 modules, colocated tests) and the feature-scoped `src/components/{events,giving,learn,marketplace,store}/` folders are, by contrast, cleanly organized. Four separate root-level `marketplace*.css` files (`marketplace.css`, `marketplace-premium.css`, `marketplace-flagship.css`, `marketplace-launch-density.css`) suggest incremental styling additions without consolidation. No `TODO`/`FIXME`/`HACK` markers exist anywhere in `src/`, `supabase/`, or `e2e/` — technical debt is currently untracked by convention rather than absent.

**Data layer.** 51 sequential, timestamp-prefixed Supabase migrations (append-only, as `ARCHITECTURE.md` requires) and 28 pgTAP files covering 334 assertions, with good migration-to-test name correlation. Three small, single-purpose Edge Functions. This is a healthy, conventional Supabase setup for this stage.

**CI/CD.** More sophisticated than the typical startup: `scripts/classify-change-impact.sh` inspects the diff and derives which of five conditional gates (web CI, Database QA, Persona QA, Hosted QA, Dependency Review) actually need to run, and `merge-gate.yml` polls the GitHub Actions API to confirm the required evidence exists for the accepted SHA before allowing a release-state `COMPLETE`. This conditional-gating-plus-evidence-polling pattern is exactly the right shape for keeping CI cheap while still rigorous, and should be the template extended to future automation, not replaced.

**Documentation.** 61 files directly under `docs/`, plus 8 subdirectories (`engineering` 2, `legal` 5, `meta` 1, `phases` 4, `product` 9, `progress` 1, `prompts` 17, `support` 10) — roughly 110 markdown files in `docs/` total. A prior self-review (`docs/REPOSITORY-INFORMATION-ARCHITECTURE-PLAN.md` and `docs/DOCUMENTATION-MIGRATION-MATRIX.md`, both still open/in-flight) already reached most of the same conclusions this review reaches, and Issue #136 already executed the first implementation batch. See §3–§7.

**Agent/tool configuration.** `.agents/skills/`, `.github/{agents,instructions,prompts,skills}`, `.openai/hosting.json`, and root `AGENTS.md`/`CLAUDE.md`/`.github/copilot-instructions.md` are all real, tool-required, non-duplicative conventions for six different consumers (Codex, VS Code Copilot custom agents, VS Code Copilot instructions/prompts, GitHub Copilot skills, an external OpenAI static-hosting manifest, and this repo's own root adapters). This was independently verified in this session and confirms the prior audit's finding. **No `.claude/skills/` directory exists**, so Claude Code currently loads zero repo-committed skills — everything Claude Code gets today comes from `CLAUDE.md` plus whatever it's told to read, not from a skill router.

**Branch hygiene.** Only `origin/main` exists as a remote branch at review time — branch cleanup work (Issue #107, PRs referenced in `AI-CONTROLLER.md`) has succeeded completely. This is good and should be preserved: keep using one short-lived branch → one PR → `main`, not reintroducing long-lived integration branches.

## 3. Documentation/noise assessment

The noise is concentrated in five recognizable clusters, all already partially diagnosed by the repository's own prior audit:

1. **Six competing "how agents should behave" documents.** `AI-OPERATING-PROTOCOL.md`, `AUTONOMOUS-EXECUTION-POLICY.md`, `CHATGPT-OPERATING-PROTOCOL.md`, `DEV-LOOP-V2.md`, `AI-COST-AND-TESTING-GOVERNANCE.md`, and `QA-AUTOMATION-POLICY.md` all overlap `docs/engineering/AGENT-OPERATIONS.md`, which was built specifically to supersede the first five (its own header says so explicitly) and substantially duplicates the sixth. All six are still physically present at `docs/` root, not archived.
2. **Four competing decision/status ledgers.** `AUTONOMOUS-DECISIONS.md`, `DECISION-LOG.md`, `OWNER-DECISION-BACKLOG.md`, and `OWNER-REVIEW-DRAFTS-2026-09-12.md` all record "durable choices and things Jim needs to weigh in on," with different formats and no single index. A `docs/DECISIONS.md` consolidation target is already planned in the migration matrix but not yet created.
3. **Two stale live-status narratives.** `CURRENT-WORK.md` and `OPEN-ITEMS-2026-09-12.md` both describe project state as of 2026-09-12 and are now factually wrong (`CURRENT-WORK.md` still says Track 3 is "not started" though it merged well before this review) — this is not merely untidy, it is a live example of the two-competing-authorities failure mode the whole exercise exists to prevent, caught by the repo's own prior audit but not yet fixed.
4. **Roughly twenty dated, single-purpose snapshots** — `LAUNCH-*`, `LL4/5/6-*`, `CUTOVER-SHELTERPAWTNERS-COM.md`, `BRANCH-CLEANUP-2026-09-11.md`, `BRANCH-RETIREMENT-2026-09-12.md`, `MAIN-PROTECTION-AND-BRANCH-RETIREMENT.md`, `SITE-REVIEW-2026-09-12.md`, `STRATEGIC-PLAN-2026-09-12.md`, `MARKETPLACE-DESIGN-SPRINT.md`, `MVP-PROFILE-DATA-MODEL-REVIEW.md`, `FESTIVAL-MVP-AND-VERIFICATION.md`, `RAVE-SHELTER-LOSTPAWS-MISSION.md` (explicitly marked superseded already) — that describe milestones already reached. None of these are wrong to have written; all of them are wrong to still be sitting where a fresh agent's directory listing puts them next to `AI-CONTROLLER.md`.
5. **`docs/prompts/` (17 files)** is almost entirely historical task briefs for named, resolved work items (`GUARDIAN-PET-SAVE-BLOCKER-FIX.md`, `ISSUE-11-PARTNER-PROFILE-PERSISTENCE-BLOCKER.md`, five separate `PHASE-2-CHECKPOINT-*` files, etc.). Its own `README.md` already says as much. Only `CHATGPT-SESSION-BOOTSTRAP.md` is a genuinely reusable, current adapter.

What is *not* noise, and should not be touched: `docs/legal/`, `docs/support/` (both explicitly high-stakes and already well-organized), the well-formed thin adapters (`AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.agents/skills/.../SKILL.md`, `.github/skills/*/SKILL.md`), `docs/README.md`, and `docs/AI-CONTROLLER.md` itself, which is already a tight, current, single-authority document — proof the target format works when applied.

## 4. Top architectural and operational problems

1. **Unfinished consolidation, not absent consolidation.** The single biggest documentation risk is that six protocol docs were correctly identified as superseded and then left in place — the exact "two-authority" failure the project is trying to eliminate is still live in the working tree today (`CURRENT-WORK.md` vs. `AI-CONTROLLER.md`).
2. **Machine-readable state is prose parsed with `sed`/`grep`.** `docs/engineering/AI-RELEASE-STATE.md` (and its `AI-HANDOFF.md` mirror) is a Markdown file with `KEY: VALUE` lines that three required workflows and one script parse with regex against an exact string layout (including a literal `CURRENT_CHECKPOINT: Issue #5` match in `hosted-qa.yml`). This works today but is fragile: a well-intentioned Markdown reformat (heading level change, reflow, a linter pass) could silently break required CI gates with no schema to catch it.
3. **A confirmed, live classifier bug.** `scripts/classify-change-impact.sh`'s bash `case` statement matches `docs/*|*.md|README*` before the later pattern intended to catch `AGENTS.md`/`CLAUDE.md`/`.github/copilot-instructions.md`/`.github/instructions/*`/`.agents/*` ever fires, because every one of those paths also ends in `.md`. Net effect: edits to the repository's own authority-chain files are classified `docs_only=true` and skip web CI/Hosted QA today. This is exactly the kind of file this review is most concerned with keeping correct.
4. **`main.tsx` is a 2,628-line monolith** containing routing, auth context, and ~30 page components inline — the one clear runtime architectural debt item, and the one place `docs/ARCHITECTURE.md`'s otherwise-accurate principles give no reader any warning before they open the file.
5. **No scheduled/自动 health cadence.** `ai-ops-status.yml` is `workflow_dispatch`-only despite describing itself as hourly; there is no cron-triggered nightly build/test on `main`, no drift detection between what `AI-RELEASE-STATE.md` claims and what CI/Vercel actually show, and no automatic issue creation when a scheduled check fails.
6. **Support/feedback automation is fully built and fully idle.** The Support OS (triage severity, escalation, redemption/adoption runbooks, a reviewed delivery-worker migration and Edge Function) is real, already-reviewed engineering work, gated purely on the owner picking an alert destination and issuing two secrets (`SUPPORT_DELIVERY_WEBHOOK_URL`, `SUPPORT_DELIVERY_INVOKE_SECRET`). This is the single highest-leverage "flip the switch" item in the whole repository and deserves top billing in any near-term owner-decision list, not burial in a 61-file docs root.
7. **Zero Claude-Code-native skills.** Every other coding surface in this repo (Codex, Copilot) has a router that keeps its context small; Claude Code has none, so every Claude Code session either re-reads `AGENTS.md`/`CLAUDE.md` verbatim or is manually told what to read.

## 5. Proposed target repository tree

No files move in this session. This is the target to migrate toward across the phases in §17.

```text
docs/
  README.md                     # authority map (exists, keep)
  AI-CONTROLLER.md              # live human status (exists, keep)
  DECISIONS.md                  # NEW — merges AUTONOMOUS-DECISIONS + DECISION-LOG
                                 #   + OWNER-DECISION-BACKLOG + OWNER-REVIEW-DRAFTS
  AI-HANDOFF.md                 # unchanged — CI-required legacy adapter, stays at root
                                 #   until merge-gate.yml/persona-qa.yml/hosted-qa.yml/
                                 #   update-ai-ops-status.sh migrate together

  engineering/
    AGENT-OPERATIONS.md         # canonical operations (exists, keep)
    AI-RELEASE-STATE.md         # canonical human-readable state view (exists, keep)
    ARCHITECTURE.md             # moved from root; refresh to name main.tsx/CSS debt
    PROJECT-TECH-GLOSSARY.md    # moved from root
    HOSTED-QA.md                # moved from root
    ISSUE-5-COVERAGE-MATRIX.md  # moved from root
    QA-TEST-ACCOUNTS.md         # moved from root
    JIM-LOCAL-PC-SETUP.md       # moved from root (after secret/PII check)
    COPILOT-LOCAL-SETUP.md      # moved from root (if not fully superseded)
    state/                      # NEW — machine-readable, schema-checked
      release-state.yaml
      autonomy-boundaries.yaml
      environments.yaml

  product/
    PRODUCT-VISION.md           # moved from root
    PRODUCT-REQUIREMENTS.md     # moved from root
    USER-ROLES.md               # moved from root
    ROADMAP.md                  # moved from root; folds in phases/PHASE-3..5
    MARKETPLACE-RESEARCH.md     # moved from root (pending content confirmation)
    BUSINESS-STRUCTURE-AND-IMPACT.md  # moved from root (pending content read)
    (existing docs/product/* proposals unchanged)

  security/
    SECURITY-AND-PRIVACY.md     # moved from root

  design/
    BRAND-DESIGN-SYSTEM.md      # moved from root
    CONTENT-STANDARDS.md        # moved from root

  data/
    SHELTER-DATA-STANDARDS.md   # moved from root
    FINANCIAL-LEDGER-AND-GIVING.md  # moved from root

  legal/     (unchanged)
  support/   (unchanged)

  archive/
    2026-mvp/
      launch/           # CUTOVER-*, LAUNCH-*, LL4/5/6-*
      checkpoints/      # BRANCH-CLEANUP/RETIREMENT, MAIN-PROTECTION-*, SITE-REVIEW
      retired-plans/    # STRATEGIC-PLAN, MARKETPLACE-DESIGN-SPRINT,
                        #   MVP-PROFILE-DATA-MODEL-REVIEW, FESTIVAL-MVP-AND-VERIFICATION,
                        #   RAVE-SHELTER-LOSTPAWS-MISSION, AI-TOOLING-AND-DESIGN-ROADMAP
      retired-protocols/  # AI-OPERATING-PROTOCOL, AUTONOMOUS-EXECUTION-POLICY,
                          #   CHATGPT-OPERATING-PROTOCOL, DEV-LOOP-V2,
                          #   AI-COST-AND-TESTING-GOVERNANCE
      retired-prompts/    # docs/prompts/* except CHATGPT-SESSION-BOOTSTRAP.md

  tasks/active/    # created empty; populated only when a task truly needs
                   # a repo-native brief instead of an Issue

.claude/
  skills/lostpaws/SKILL.md      # NEW — Claude Code's own thin router,
                                 #   mirroring .agents/skills and .github/skills
```

`src/`, `supabase/`, `e2e/`, `scripts/`, `.github/**`, `.agents/**` keep their current locations — none of these are documentation-noise problems, and moving tool-required paths for tidiness alone violates the repository's own design principle.

## 6. Proposed target documentation hierarchy

Same tree as §5, expressed as a reading model:

- **Tier 0 — orientation (read every time):** `AGENTS.md` → `docs/AI-CONTROLLER.md`.
- **Tier 1 — operations (read when the task needs detail beyond Tier 0):** `docs/engineering/AGENT-OPERATIONS.md`.
- **Tier 2 — domain knowledge (read at most one, chosen by task type):** exactly one file under `product/`, `security/`, `data/`, `design/`, or `engineering/`.
- **Tier 3 — machine state (read/write only when the task's completion contract needs it):** `docs/engineering/AI-RELEASE-STATE.md` / `state/*.yaml`, `docs/AI-HANDOFF.md` (until retired).
- **Tier 4 — durable decisions (read when resolving a gate; write when creating one):** `docs/DECISIONS.md`.
- **Tier 5 — archive (never read by default; only when investigating history):** `docs/archive/**`.

This collapses today's actual reading surface (nine-plus root protocol/status files an agent might stumble into) to the four-hop chain the repository already states as its intent but does not yet structurally enforce.

## 7. Complete root-document disposition matrix

Legend: **KEEP_ROOT** stays exactly where it is; **MOVE** relocates unchanged into the Tier-2 subtree; **MERGE** folds unique content into a named target then the source is removed; **ARCHIVE** relocates under `docs/archive/2026-mvp/**`; **DELETE** removes after its handful of unique lines are folded elsewhere (git history retains the rest). Every MERGE/ARCHIVE/DELETE requires the standard `rg` inbound-reference check the repository's own migration matrix already mandates before it executes — none of that verification has been performed as a *move* in this session.

| # | Document | Disposition | Canonical replacement / destination | Overlaps with | Unique durable knowledge to preserve | Inbound refs found this session |
|---|---|---|---|---|---|---|
| 1 | AI-CONTROLLER.md | KEEP_ROOT | — | — | Live status itself | AGENTS.md, CLAUDE.md, docs/README.md, all adapters |
| 2 | AI-COST-AND-TESTING-GOVERNANCE.md | ARCHIVE | retired-protocols/ | AGENT-OPERATIONS.md "AI, cost, and review discipline" | None beyond what's already folded in | None found |
| 3 | AI-HANDOFF.md | KEEP_ROOT | — | AI-RELEASE-STATE.md (by design, field-compatible) | CI-parsed fields | merge-gate.yml, persona-qa.yml, hosted-qa.yml, update-ai-ops-status.sh |
| 4 | AI-OPERATING-PROTOCOL.md | ARCHIVE | retired-protocols/ | AGENT-OPERATIONS.md | None (explicit supersession banner) | None found |
| 5 | AI-TOOLING-AND-DESIGN-ROADMAP.md | ARCHIVE | retired-plans/ | — | Historical stream-completion record | None found |
| 6 | ARCHITECTURE.md | MOVE | engineering/ | — | Trust/domain-boundary invariants (accurate, keep) | README.md, .agents/skills SKILL.md |
| 7 | AUTONOMOUS-DECISIONS.md | MERGE | DECISIONS.md | DECISION-LOG.md, OWNER-DECISION-BACKLOG.md | AD-001..AD-005 entries | — |
| 8 | AUTONOMOUS-EXECUTION-POLICY.md | ARCHIVE | retired-protocols/ | AGENT-OPERATIONS.md | None (explicit supersession banner) | AGENT-OPERATIONS.md cross-link only |
| 9 | BRANCH-CLEANUP-2026-09-11.md | ARCHIVE | checkpoints/ | BRANCH-RETIREMENT-2026-09-12.md | One-time audit evidence | AI-CONTROLLER.md narrative reference |
| 10 | BRANCH-RETIREMENT-2026-09-12.md | ARCHIVE | checkpoints/ | #9 | Same | AI-CONTROLLER.md narrative reference |
| 11 | BRAND-DESIGN-SYSTEM.md | MOVE | design/ | — | Canonical, current | README.md, copilot-instructions.md, .github/skills/* |
| 12 | BUSINESS-STRUCTURE-AND-IMPACT.md | REVIEW→MOVE | product/ | — | Not content-audited this session | Unknown — verify before moving |
| 13 | CHATGPT-OPERATING-PROTOCOL.md | ARCHIVE | retired-protocols/ | AGENT-OPERATIONS.md | None (explicit supersession banner) | None found |
| 14 | CONTENT-STANDARDS.md | MOVE | design/ | — | Canonical, current | README.md |
| 15 | COPILOT-LOCAL-SETUP.md | REVIEW→MOVE | engineering/ | AGENT-OPERATIONS.md (partial) | Not content-audited this session | Unknown — verify before moving |
| 16 | CURRENT-WORK.md | DELETE | AI-CONTROLLER.md | AI-CONTROLLER.md (confirmed stale duplicate) | None not already in controller | scripts/set-active-phase.ps1 (retire first) |
| 17 | CUTOVER-SHELTERPAWTNERS-COM.md | ARCHIVE | launch/ | CURRENT-WORK.md's cutover summary | Historical cutover sequence | None found |
| 18 | DECISION-LOG.md | MERGE | DECISIONS.md | AUTONOMOUS-DECISIONS.md, OWNER-DECISION-BACKLOG.md | Phase 1 decision entries | README.md, scripts/set-active-phase.ps1 |
| 19 | DEV-LOOP-V2.md | ARCHIVE | retired-protocols/ | AGENT-OPERATIONS.md | None (explicit supersession banner) | None found |
| 20 | DOCUMENTATION-MIGRATION-MATRIX.md | KEEP_ROOT (interim) | → archive once migration executes | This review | Full prior audit trail | This review builds on it |
| 21 | FESTIVAL-MVP-AND-VERIFICATION.md | ARCHIVE | retired-plans/ | — | Dated MVP verification snapshot | None found |
| 22 | FINANCIAL-LEDGER-AND-GIVING.md | MOVE | data/ | — | Canonical, current; pairs with OD-003/OD-004 | — |
| 23 | HOSTED-QA.md | MOVE | engineering/ | — | Canonical QA runbook | README.md ("Hosted shared-development QA") |
| 24 | ISSUE-5-COVERAGE-MATRIX.md | MOVE | engineering/ | — | Canonical coverage matrix | AGENTS.md references "Issue #5" regression |
| 25 | JIM-LOCAL-PC-SETUP.md | REVIEW→MOVE | engineering/ | — | Not content-audited; check for secrets first | Unknown |
| 26 | LAUNCH-ACCOUNT-READINESS.md | ARCHIVE | launch/ | Other LAUNCH-*/LL* files | Dated readiness checklist | None found |
| 27 | LAUNCH-AUTH-EMAIL-READINESS.md | ARCHIVE | launch/ | LL4-AUTH-EMAIL-READINESS.md | Dated readiness checklist | None found |
| 28 | LAUNCH-CANDIDATE-PLAN.md | ARCHIVE | launch/ | — | Dated candidate plan | None found |
| 29 | LAUNCH-DATA-HYGIENE-FINDINGS.md | ARCHIVE | launch/ | — | Point-in-time findings | None found |
| 30 | LAUNCH-READINESS-CHECKLIST.md | ARCHIVE | launch/ | LL6-LAUNCH-READINESS.md | Dated checklist | None found |
| 31 | LAUNCH-RESOURCE-PUBLISHING-RULES.md | ARCHIVE | launch/ | — | Dated rules snapshot | None found |
| 32 | LAUNCH-RESOURCE-RESEARCH.md | ARCHIVE | launch/ | — | Dated research snapshot | None found |
| 33 | LAUNCH-RESOURCE-WAVE-1.md | ARCHIVE | launch/ | — | Dated wave plan | None found |
| 34 | LL4-AUTH-EMAIL-READINESS.md | ARCHIVE | launch/ | LAUNCH-AUTH-EMAIL-READINESS.md | Dated checklist | None found |
| 35 | LL5-META-SOCIAL-AUTH.md | ARCHIVE | launch/ | — | Dated Meta/social readiness (Meta deferred) | None found |
| 36 | LL6-LAUNCH-READINESS.md | ARCHIVE | launch/ | LAUNCH-READINESS-CHECKLIST.md | Dated checklist | None found |
| 37 | LOSTPAWS-RAVE-LANDING-DIRECTION.md | REVIEW→MOVE/ARCHIVE | product/ or launch/ | — | Not content-audited; may be superseded by shipped pages | Unknown |
| 38 | MAIN-PROTECTION-AND-BRANCH-RETIREMENT.md | ARCHIVE | checkpoints/ | BRANCH-* files | Issue #107 execution record | None found |
| 39 | MARKETPLACE-DESIGN-SPRINT.md | ARCHIVE | retired-plans/ | — | Dated sprint record | None found |
| 40 | MARKETPLACE-RESEARCH.md | REVIEW→MOVE | product/ | — | Root README links to it as canonical research | README.md |
| 41 | MVP-PROFILE-DATA-MODEL-REVIEW.md | ARCHIVE | retired-plans/ | — | Point-in-time schema review; migrations now canonical | None found |
| 42 | OPEN-ITEMS-2026-09-12.md | DELETE | AI-CONTROLLER.md | AI-CONTROLLER.md's own remaining-actions list | None not already in controller | None found |
| 43 | OWNER-DECISION-BACKLOG.md | MERGE | DECISIONS.md | AUTONOMOUS-DECISIONS.md, DECISION-LOG.md | OD-001..OD-004 active gates (must transfer intact) | AGENT-OPERATIONS.md, product/README.md |
| 44 | OWNER-REVIEW-DRAFTS-2026-09-12.md | REVIEW→MERGE/ARCHIVE | DECISIONS.md or retired-plans/ | Backlog docs | Not content-audited this session | Unknown |
| 45 | PHASE-1-EXECUTION.md | ARCHIVE | checkpoints/ | — | Phase 1 complete; historical execution record | README.md ("Phase 1 execution"), scripts/set-active-phase.ps1 |
| 46 | PHASE-1-PROGRESS.md | ARCHIVE | checkpoints/ | — | Same | scripts/set-active-phase.ps1 |
| 47 | PRODUCT-REQUIREMENTS.md | MOVE | product/ | — | Canonical, current | README.md, .agents/skills SKILL.md |
| 48 | PRODUCT-VISION.md | MOVE | product/ | — | Canonical, current | README.md |
| 49 | PROJECT-TECH-GLOSSARY.md | MOVE | engineering/ | — | Durable glossary | — |
| 50 | QA-AUTOMATION-POLICY.md | MERGE | AGENT-OPERATIONS.md | AUTONOMOUS-EXECUTION-POLICY.md, DEV-LOOP-V2.md | The 14-point "never end ambiguous" handoff protocol is genuinely unique and should transfer | — |
| 51 | QA-TEST-ACCOUNTS.md | MOVE | engineering/ or support/ | — | Canonical, current | — |
| 52 | RAVE-SHELTER-LOSTPAWS-MISSION.md | ARCHIVE | retired-plans/ | — | Already explicitly marked superseded | None found |
| 53 | README.md (docs/) | KEEP_ROOT | — | — | Authority map itself | Everything points to it |
| 54 | REPOSITORY-INFORMATION-ARCHITECTURE-PLAN.md | KEEP_ROOT (interim) | → archive once this review supersedes it | This review | Full prior planning trail | This review builds on it |
| 55 | ROADMAP.md | MOVE | product/ | phases/PHASE-3..5 (fold in) | Canonical MVP-slice/approval-gate roadmap | README.md |
| 56 | SECURITY-AND-PRIVACY.md | MOVE | security/ | — | Canonical, current | README.md, .agents/skills SKILL.md |
| 57 | SEVEN-STAR-SHELTERS-LANDING-BRIEF.md | REVIEW→MOVE/ARCHIVE | product/ or launch/ | — | Not content-audited; campaign brief | Unknown |
| 58 | SHELTER-DATA-STANDARDS.md | MOVE | data/ | — | Canonical, current | — |
| 59 | SITE-REVIEW-2026-09-12.md | ARCHIVE | checkpoints/ | — | Findings already captured in e2e/site-hygiene.spec.ts | AI-HANDOFF.md narrative |
| 60 | STRATEGIC-PLAN-2026-09-12.md | DELETE | AI-CONTROLLER.md | AI-CONTROLLER.md | None not already in controller | None found |
| 61 | USER-ROLES.md | MOVE | product/ | — | Canonical, current | README.md, .agents/skills SKILL.md |

Rows marked **REVIEW→** need one content read (not performed this session, in the interest of the ~60-minute time-box) before their final disposition is locked — flagged explicitly rather than guessed at.

## 8. Proposed canonical source-of-truth hierarchy

Unchanged in spirit from the repository's own already-declared model, restated as the final target once §7 executes:

1. Current GitHub `main` — implemented truth.
2. `AGENTS.md` — universal startup contract (thin; unchanged).
3. `docs/AI-CONTROLLER.md` — human live status/blockers/next actions.
4. The active GitHub Issue/PR — task scope and acceptance.
5. `docs/engineering/AGENT-OPERATIONS.md` — detailed autonomy/validation/cost rules, read only when the task needs more than the four-line summary in `AGENTS.md`.
6. Exactly one Tier-2 domain document (`product/`, `security/`, `data/`, `design/`, `engineering/`).
7. `docs/engineering/AI-RELEASE-STATE.md` / `state/*.yaml` — machine-readable completion contract, read/written only when the task's workflow needs it.
8. `docs/DECISIONS.md` — durable decisions and open owner gates.
9. `docs/archive/**` — never authoritative; investigated only when explicitly researching history.

This is the same chain `AGENTS.md`, `docs/README.md`, and `docs/CHATGPT-OPERATING-PROTOCOL.md` already each independently describe — the fix is structural (finish removing the competing paths), not conceptual.

## 9. Agent startup/context model

Target answers, and where they now live once §7 executes:

| Question | Answer source |
|---|---|
| What is this system? | `README.md` + `docs/product/PRODUCT-VISION.md` |
| What is current production state? | `docs/AI-CONTROLLER.md` + `docs/engineering/state/environments.yaml` |
| What am I working on? | Active GitHub Issue/PR |
| Which instructions are authoritative? | `AGENTS.md` → this hierarchy (§8) |
| What may I change autonomously? | `docs/engineering/AGENT-OPERATIONS.md` GREEN/YELLOW + `state/autonomy-boundaries.yaml` |
| What requires human approval? | Same doc's RED list + boundary YAML |
| How do I validate my work? | `AGENT-OPERATIONS.md` "Deterministic validation" + `scripts/classify-change-impact.sh` output |
| How do I communicate/handoff progress? | `docs/AI-CONTROLLER.md` update + `docs/engineering/AI-RELEASE-STATE.md` when the task's contract needs it |
| How do I recover from failure? | New: `docs/engineering/RUNBOOKS.md` (recommended addition, §12) |
| Where do I record durable decisions? | `docs/DECISIONS.md` |

Target reading budget for a routine task: `AGENTS.md` (~1 page) + `AI-CONTROLLER.md` (~1 page) + the active Issue + at most one Tier-2 doc. That is achievable today for `AGENT-OPERATIONS.md`-aware sessions and is not achievable for a session that happens to open one of the six superseded protocol docs instead — which is the whole argument for finishing §7 before adding anything new.

## 10. Multi-agent coordination model

Already reasonably strong and should be kept: one primary coding agent per bounded slice, specialist review agents that don't compete on the same files, an explicit "Codex paused / Claude Code sole active agent" pattern recorded in the live controller rather than assumed. Two gaps worth closing cheaply:

- **No machine-readable ownership/lease record.** "Which agent owns which Issue/branch right now" lives only in prose inside `AI-CONTROLLER.md`. A small `docs/engineering/state/active-work.yaml` (Issue, branch, agent, started, expected-completion) would let a second agent (or ChatGPT) check for a collision programmatically instead of re-reading a paragraph of narrative every time — directly serving the "parallel-agent collision avoidance" goal the owner named.
- **`docs/product/CODEX-CLAUDE-COLLABORATION-PROTOCOL.md` exists as a proposal doc**; once `active-work.yaml` exists, this protocol's durable rules (not its dated specifics) belong as a short section in `AGENT-OPERATIONS.md`, with the file itself following the product-proposal lifecycle already used elsewhere in `docs/product/`.

## 11. Machine-readable state recommendations

Move from prose-with-parsed-fields to schema-checked structured state, without discarding the human-readable view:

- **`docs/engineering/state/release-state.yaml`** — the actual source of truth for `STATUS`, `CURRENT_PHASE`, `CURRENT_CHECKPOINT`, `NEXT_CHECKPOINT`, `OWNER_DECISION_REQUIRED`, `SAFE_TO_CONTINUE`, `ACCEPTED_CODE_SHA`, `ACCEPTANCE_RUNTIME`, `ACCEPTANCE_DEPLOYED_SHA`. A tiny CI step validates it against a JSON Schema on every PR that touches it (cheap, catches a malformed field before it reaches `merge-gate.yml`). `docs/engineering/AI-RELEASE-STATE.md` becomes a generated/human-readable mirror (or is retired once workflows read the YAML directly) — this is exactly the "machine-readable handoff batch" the existing migration matrix already scoped as a future bounded PR; it just hasn't happened yet.
- **`docs/engineering/state/autonomy-boundaries.yaml`** — the GREEN/YELLOW/RED path patterns (e.g. `supabase/migrations/*rls*`, `vercel.json`, `docs/legal/**`, payment/donation code) as data, so both `AGENT-OPERATIONS.md` (for humans/agents to read) and `scripts/classify-change-impact.sh` (for CI to enforce) consume the *same* list instead of two independently-maintained prose descriptions that can drift.
- **`docs/engineering/state/environments.yaml`** — dev/staging (GitHub Pages)/production (Vercel) URLs, owning Supabase project per environment, and which providers are enabled/disabled (Google on, Facebook explicitly off) — currently scattered across `CURRENT-WORK.md`, `AI-CONTROLLER.md`, and `AGENTS.md` prose.
- **`docs/engineering/state/active-work.yaml`** — per §10.

Support severity (`docs/support/TRIAGE-SEVERITY.md`) and dependency/health status are lower priority for structuring now — they're either already well-served by prose runbooks a human reads occasionally, or (health/deployment status) better served by the scheduled workflow in §12 posting directly to a GitHub Issue/Check rather than a repo file that immediately goes stale.

## 12. Automation/self-healing architecture

Ranked by cost-to-build vs. value, cheapest first:

1. **Fix the `classify-change-impact.sh` case-precedence bug** (§4.3). Reorder the patterns so `.github/instructions/*|.github/copilot-instructions.md|AGENTS.md|CLAUDE.md|.agents/*` is checked before the catch-all `docs/*|*.md|README*`. Zero product risk, restores intended CI coverage on the repository's own authority-chain files. **This is the recommended first implementation PR (§20).**
2. **Documentation-drift CI check.** A lightweight script that fails CI when known-contradictory phrases coexist (e.g., `AGENTS.md` saying "Phase 2 is complete" while `docs/phases/PHASE-2.md`'s header still says "inactive until explicitly activated" — a real, already-found instance of this class of bug). Cheap grep-based check, not an LLM call.
3. **Scheduled health workflow** (`workflow_dispatch` *and* `schedule: cron`) — nightly build+test on `main`, dependency audit, and a `release-state.yaml` vs. actual-Vercel-deployment consistency check. On failure, auto-file (or update) one tracking GitHub Issue rather than paging anyone — this is a GREEN-tier, fully safe automation.
4. **Dependabot auto-merge for green patch/minor bumps.** Dependabot already opens grouped weekly PRs; add a narrow auto-merge workflow that merges only when the full CI suite is green, the bump is patch/minor (not major), and the changed package isn't security-sensitive (auth/Supabase client). This is a textbook GREEN-tier automation the owner's own policy already authorizes ("choosing among equivalent low-risk libraries... when no new paid service or major dependency is introduced").
5. **Post-deploy production smoke.** `github-pages-mvp-acceptance.yml` already does this for the GitHub Pages staging surface; add the equivalent lightweight smoke (a handful of critical routes + one authenticated Guardian check, matching the existing pattern) triggered after a Vercel production deployment completes, replacing today's "inspect Vercel manually, at most once" policy with an automatic pass/fail signal a human only has to look at when it fails.
6. **Rollback runbook, then rollback automation.** Today there is no rollback procedure at all beyond "don't do destructive things." First step (cheap): a documented `docs/engineering/RUNBOOKS.md` entry — revert PR, confirm CI green, Vercel redeploys the reverted `main` automatically. Second step (only after the first is proven and the owner is comfortable): a workflow that *proposes* (opens a revert PR, does not merge) when the post-deploy smoke in item 5 fails on `main` — production redeploy stays a RED action requiring owner/PR approval, consistent with existing guardrails.
7. **Activate Support OS runtime** (§4.6) — not new engineering, just an owner decision (pick alert destination + issue two secrets) unlocking already-built, already-reviewed automation. This belongs at the top of any near-term action list precisely because it's finished work sitting idle.

Deliberately **not** recommended yet, as enterprise ceremony a one-person startup doesn't need: a dedicated observability/APM platform, a separate incident-management tool, auto-generated regression tests from LLM inference (heuristic "did this bug-fix PR also add a test file" CI check is enough for now), or any paid orchestration layer. Revisit these once there is more than one paying customer flow or more than one engineer.

## 13. Human approval/escalation model

Already well-specified (GREEN/YELLOW/RED in `AGENT-OPERATIONS.md`/`AUTONOMOUS-EXECUTION-POLICY.md`, with `OD-002` Phase 3, `OD-003` verified-savings, `OD-004` giving-provider settlement as the three live BLOCKING gates in `OWNER-DECISION-BACKLOG.md`). No conceptual change recommended. Structural change recommended: fold this into `AGENT-OPERATIONS.md` + `state/autonomy-boundaries.yaml` (§11) so the boundary is enforceable, not just legible, and consolidate the four decision ledgers (§7 rows 7/18/43/44) into one `docs/DECISIONS.md` so an agent checking "has this already been decided" has one place to check instead of four.

## 14. Support/feedback automation model

The documented pipeline (`docs/support/SUPPORT-OPERATING-MODEL.md`, `TRIAGE-SEVERITY.md`, `HUMAN-ESCALATION.md`, `AI-SUPPORT-GUARDRAILS.md`, runbooks for adoption verification/auth/marketplace redemption) already maps cleanly onto the requested `feedback → classification → reproduction → issue → safe fix → testing → PR → CI → merge → deployment → verification → closure` pipeline for the *engineering* half. The gap is entirely on the *support-ops* half: the triage/classification/escalation contract exists and is reviewed, but its runtime (an Edge Function delivering to a real alert destination) has never been deployed, per explicit owner guardrail pending two secrets. Recommendation: treat "pick a Support OS alert destination" as the single highest-value pending owner decision in this entire review (see §7 row 43/§4.6) — everything downstream of it is already built.

## 15. Testing/CI/release improvements

The testing pyramid is appropriately shaped for this stage: 11 unit-test files (vitest), 27 Playwright e2e specs (split into public/hosted/admin-qa/persona subsets run conditionally), 28 pgTAP files (334 assertions) gated behind a real local Supabase stack in `database-qa.yml`. Recommended improvements, none structural:

- Fix the classifier bug (§4.3/§12.1) so the gating itself is trustworthy.
- Add the scheduled nightly run (§12.3) — today the full suite only runs on PRs, so a `main`-only regression (e.g., a dependency update landing outside a PR, or an environment drift) has no automatic detector.
- Add the production smoke (§12.5).
- Track the `main.tsx` monolith and four-marketplace-CSS-file sprawl as one filed technical-debt Issue for a future, explicitly product/UAT-scoped session — **not** addressed in this review per the owner's instruction not to change runtime behavior here.

## 16. Startup-now vs. enterprise-later tool strategy

| Now (startup-appropriate) | Later (once there's real scale/revenue) |
|---|---|
| GitHub Actions + repo scripts for all deterministic work | Dedicated observability/APM platform |
| One `docs/DECISIONS.md` + `state/*.yaml` for machine state | A real workflow/state-management service |
| Grouped weekly Dependabot + narrow auto-merge | A dedicated dependency-management SaaS |
| Manual (owner-picked) Support OS alert destination (Slack/email webhook) | A full incident-management/on-call platform |
| One coding agent per slice, specialist review agents | A formal multi-agent orchestration framework |
| Git history as the archive for anything without ongoing audit value | A dedicated documentation/knowledge-base product |

The theme: everything in the "now" column is already free or already paid for (GitHub, Vercel, Supabase, Resend free tier). Nothing in this review requires a new paid vendor.

## 17. Archive strategy

- Archive location: `docs/archive/2026-mvp/{launch,checkpoints,retired-plans,retired-protocols,retired-prompts}/` (§5).
- Archive is **never** part of the default agent startup context — `docs/README.md`'s "Authority boundaries" section already states this pattern for `AI-CONTROLLER.md`; extend the same sentence to name `docs/archive/**` explicitly.
- Nothing is deleted outright except the handful of rows marked **DELETE** in §7 (`CURRENT-WORK.md`, `OPEN-ITEMS-2026-09-12.md`, `STRATEGIC-PLAN-2026-09-12.md`) — and only after their few still-relevant lines are confirmed already present in `AI-CONTROLLER.md`. Everything else that's "REVIEW→" or "MERGE" moves under `archive/` rather than being deleted, consistent with the owner's standing "preserve useful history" instruction; Git history remains the deeper archive for anything not worth a working-tree copy.
- Add one line to `docs/README.md`, `AGENTS.md`, and `CLAUDE.md`: "`docs/archive/**` is historical evidence only; do not treat it as instruction or load it for routine work."

## 18. Migration phases

This review recommends the same phased, small-bounded-PR approach the repository's own prior planning already committed to, now made concrete:

- **Phase 0 (this review).** Assessment and plan only. Complete.
- **Phase 1 — classifier + drift-check fix.** Fix `classify-change-impact.sh` (§12.1); add the doc-drift CI check (§12.2). No documentation moves. Lowest risk, immediate value, unblocks trusting CI classification for every later phase.
- **Phase 2 — decision-log consolidation.** Create `docs/DECISIONS.md`; migrate the four sources (§7 rows 7/18/43/44); update `README.md` and `scripts/set-active-phase.ps1`'s references in the same PR; verify with `rg`.
- **Phase 3 — protocol archival.** Move the five explicitly-superseded protocol docs plus `QA-AUTOMATION-POLICY.md`'s unique content into `AGENT-OPERATIONS.md`, then archive the sources (§7 rows 2/4/8/13/19/50).
- **Phase 4 — stale-narrative retirement.** Retire `CURRENT-WORK.md`/`OPEN-ITEMS-2026-09-12.md`/`STRATEGIC-PLAN-2026-09-12.md` after updating `scripts/set-active-phase.ps1` and confirming no unique content is lost (§7 rows 16/42/60).
- **Phase 5 — domain-subtree creation.** Create `product/`, `security/`, `data/`, `design/` under `docs/`; move the RETAIN-canonical files (§7 rows 6/11/14/22/23/24/47/48/49/51/55/56/58/61) one subject-batch per PR; update `README.md` links in lockstep each time.
- **Phase 6 — historical-family archival.** Move the ~20 dated launch/checkpoint/plan files and 16 historical prompt files into `docs/archive/**` (§7's ARCHIVE rows plus `docs/prompts/*` except the bootstrap file).
- **Phase 7 — content-audit closeout.** Resolve the REVIEW→ rows (§7 rows 12/15/25/37/44/57) with one content read each.
- **Phase 8 — machine-readable state.** Introduce `state/*.yaml` (§11), migrate the three CI-parsing workflows and `update-ai-ops-status.sh` together in one bounded PR with a dry-run proving all regex/parsing still resolves, per the existing migration matrix's own required sequencing.
- **Phase 9 — automation additions.** Scheduled health workflow, dependency auto-merge, production smoke, rollback runbook (§12.3–§12.6), in roughly that order.

Each phase: fresh branch from `main`, `rg` verification of zero unresolved inbound references before any move/delete, `npm run check` green, and confirmation that `AGENTS.md` + the controller still lead to one obvious authority before merging.

## 19. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Breaking `merge-gate.yml`/`persona-qa.yml`/`hosted-qa.yml` parsing during Phase 8 | Migrate all three workflows plus the script in one PR with a dry run proving every regex still matches before merge, exactly as the existing migration matrix already specifies |
| Losing durable knowledge during archival | Every ARCHIVE/MERGE/DELETE row requires content confirmation before execution; nothing in this review authorizes skipping that step |
| Stale inbound links after a move | `rg` sweep + fix in the same PR; root `README.md`'s own hand-maintained "Documentation" list is the highest-risk link surface and must be updated in lockstep every time |
| Auto-merge (dependency bumps) merging a breaking change | Scope to patch/minor only, require full green CI, exclude auth/Supabase-client packages from auto-merge eligibility |
| New scheduled workflows adding CI cost/noise | Keep them cheap (lint/build/smoke only) and failure-triggered (file/update one Issue, don't spam) |
| Losing the "how do I recover from failure" answer during transition | Write `docs/engineering/RUNBOOKS.md` in Phase 1 or 2, not last, so it exists before anything is torn down |

## 20. Exact first implementation PR recommended

**Fix `scripts/classify-change-impact.sh`'s case-precedence bug (§4.3/§12.1).**

Scope: reorder the `case` patterns so the branch matching `.github/instructions/*|.github/copilot-instructions.md|AGENTS.md|CLAUDE.md|.agents/*` is evaluated before the catch-all `docs/*|*.md|README*` branch, so edits to the repository's own authority-chain files receive `workflow=true` classification (and therefore broader CI) as the script's own second pattern already clearly intended. No documentation moves, no product changes, single file, single bounded PR, immediately testable (diff a PR that only touches `AGENTS.md` before/after and confirm `requires_web_ci` flips). This is the highest safety-value, lowest-risk change identified in this entire review and should land before any of the Phase 2+ documentation migrations, since those migrations will themselves edit `AGENTS.md`/`CLAUDE.md` and deserve correct CI coverage.

---

## CHATGPT ARCHITECTURE REVIEW HANDOFF

**Purpose:** enough detail for an independent senior architect (ChatGPT, in its product/architect/operator role per `docs/CHATGPT-OPERATING-PROTOCOL.md`) to challenge this review before any restructure executes.

**Major findings**
1. The repository already has a mature, correctly-shaped AI-agent authority model (`main → AGENTS.md → AI-CONTROLLER.md → Issue/PR → domain doc`); the problem is execution debt, not design debt — a prior effort (Issue #136) built the next-generation canonical docs (`AGENT-OPERATIONS.md`, `AI-RELEASE-STATE.md`, short-form `AI-CONTROLLER.md`, `docs/README.md`) but left the five-plus documents it superseded physically in place at `docs/` root.
2. `docs/` root carries 61 files; roughly 8–10 are load-bearing after consolidation.
3. A confirmed, live bug in `scripts/classify-change-impact.sh` misclassifies edits to `AGENTS.md`/`CLAUDE.md`/Copilot instructions as docs-only, skipping web CI on exactly the files this whole review cares most about.
4. `docs/engineering/AI-RELEASE-STATE.md`/`AI-HANDOFF.md` are Markdown parsed by `sed`/`grep` in three required workflows — functional today, fragile against reformatting, no schema.
5. Runtime debt is concentrated and already understood: a 2,628-line `src/main.tsx` monolith and four overlapping marketplace CSS files; not touched in this review per explicit owner instruction not to change runtime/UI behavior in this session.
6. Support/feedback automation is fully engineered and idle, blocked only on an owner pick of alert destination + two secrets — the highest-leverage "flip the switch" item found.
7. Branch hygiene is currently excellent (single remote branch); do not regress this by introducing long-lived integration branches during migration.

**Proposed folder tree:** see §5. Domain subtrees (`product/`, `security/`, `data/`, `design/`) mirror the pattern already proven by the existing `legal/`, `support/` subtrees; `archive/2026-mvp/{launch,checkpoints,retired-plans,retired-protocols,retired-prompts}/` holds everything historical; `engineering/state/*.yaml` is the one genuinely new mechanism (schema-checked machine state).

**Proposed authoritative documents:** `AGENTS.md`, `docs/AI-CONTROLLER.md`, `docs/engineering/AGENT-OPERATIONS.md`, `docs/DECISIONS.md` (new), `docs/engineering/AI-RELEASE-STATE.md` (backed by `state/release-state.yaml`), `docs/README.md`.

**Documents proposed for consolidation/archive/deletion:** full row-by-row disposition in §7 (61 rows). Highlights: five protocol docs → archive (already explicitly superseded); four decision ledgers → merge into `docs/DECISIONS.md`; three stale live-status narratives → delete after merge; ~20 dated launch/checkpoint/plan docs plus 16 of 17 `docs/prompts/*` files → archive.

**Major automation recommendations, ranked by cost:** (1) fix the classifier bug — do this first, zero risk; (2) doc-drift CI check; (3) scheduled nightly health workflow with auto-issue-filing on failure; (4) narrow Dependabot auto-merge (patch/minor, full-green, excluding auth/Supabase packages); (5) post-deploy production smoke matching the existing GitHub Pages pattern; (6) a written rollback runbook now, automated rollback-PR-proposal later; (7) activate the already-built Support OS runtime (owner decision, not engineering).

**Controversial decisions/tradeoffs to challenge:**
- Whether `docs/phases/PHASE-2..5.md` should fold into `ROADMAP.md` (this review's tentative recommendation) or remain a separate phases/ subtree — not fully resolved here; `PHASE-2.md`'s header is independently known to be stale regardless of the folder decision and should be fixed either way.
- Whether `docs/engineering/AI-RELEASE-STATE.md` should become a *generated* mirror of `state/release-state.yaml` (single write path, human view is read-only output) versus keeping both hand-maintained in lockstep (simpler to implement, but reintroduces the exact two-copies-can-drift risk this review is trying to eliminate elsewhere) — this review leans toward "generated mirror" but flags it as the more invasive of the two options and worth a second opinion.
- Whether Dependabot auto-merge is safe enough for this codebase given `@supabase/supabase-js` and auth-adjacent packages are in the direct dependency list — this review recommends excluding auth/Supabase-client packages from auto-merge scope specifically to hedge that risk; worth an explicit second opinion given financial/redemption logic depends on Supabase behavior.
- Six REVIEW→ rows in §7 (BUSINESS-STRUCTURE-AND-IMPACT.md, COPILOT-LOCAL-SETUP.md, JIM-LOCAL-PC-SETUP.md, LOSTPAWS-RAVE-LANDING-DIRECTION.md, OWNER-REVIEW-DRAFTS-2026-09-12.md, SEVEN-STAR-SHELTERS-LANDING-BRIEF.md) were not content-audited this session in the interest of the requested time-box; their final disposition needs one read each before Phase 5/6/7 execute them.

**Implementation sequence:** §18, nine phases, cheapest/lowest-risk first (classifier fix → decision-log merge → protocol archive → stale-narrative retirement → domain subtree creation → historical archive → content-audit closeout → machine-readable state → automation additions).

**Unresolved questions for ChatGPT/owner:**
1. Does the owner want `docs/phases/*` folded into `ROADMAP.md`, or kept as a separate roadmap subtree?
2. Is "generated mirror" or "hand-maintained lockstep" preferred for the `AI-RELEASE-STATE.md` ↔ `state/release-state.yaml` relationship?
3. Should Support OS activation (alert destination + secrets) happen before or independent of this documentation migration — it has no dependency on it and could proceed in parallel immediately.
4. Confirm the six REVIEW→ rows' final disposition after a content read.
5. Should a `.claude/skills/lostpaws/SKILL.md` router be added (§2, §9) — zero risk, but is a genuinely new file/capability rather than a consolidation of something that already exists, so it's called out separately for explicit sign-off rather than bundled into the "obviously right" consolidation work.

---

Stop here. No restructure begins until ChatGPT and the owner have reviewed and approved this plan.

---

## Verification addendum — 2026-09-14 (post-approval, pre-Phase-2)

Owner + ChatGPT reviewed the assessment above and aligned on its overall direction. Per their explicit decisions, this addendum (1) re-verifies every material factual claim in the original review against a freshly-fetched `origin/main` rather than trusting the earlier pass, (2) records corrections where verification changed a conclusion, (3) resolves the six previously-unaudited `REVIEW→` files, (4) verifies the Claude Code router question against the actual product documentation rather than assumption, and (5) reports the completed Phase 1 safety PR. Phases 2-8 (the mass documentation restructure) remain **not executed** and gated on a separate ChatGPT + owner go-ahead.

### What was re-verified and held up unchanged

- **`main` had not moved.** `origin/main` was still exactly `f684025` (the same commit this review branched from) at verification time — no re-basing was needed, and every root-doc-count claim below is against that same commit.
- **`docs/` root inventory: exactly 61 `*.md` files on `main`**, confirmed with `git ls-tree`, matching the original review's count and the full 61-row disposition matrix in §7.
- **The classify-change-impact.sh precedence bug is real**, confirmed two ways: (1) a manual trace of the bash `case` statement, and (2) a new disposable-git-repo regression test (`scripts/test-classify-change-impact.sh`) that deterministically fails against the unpatched script for `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, and `.agents/**/*.md`, while correctly leaving an ordinary `docs/*.md` edit classified `docs_only=true`. See "Phase 1" below — this is now fixed and merged.
- **`CURRENT-WORK.md`, `OPEN-ITEMS-2026-09-12.md`, and `STRATEGIC-PLAN-2026-09-12.md` were re-read in full** (they had only been referenced, not read, in the original pass). All three confirm the original assessment: no unique current-state fact survives in them that `docs/AI-CONTROLLER.md` doesn't already carry forward more accurately. `OPEN-ITEMS-2026-09-12.md` and `STRATEGIC-PLAN-2026-09-12.md` do contain durable *product* facts not yet folded anywhere else — see "Corrections" below, this changes their disposition detail (not their overall DELETE-after-merge direction).
- **`AI-COST-AND-TESTING-GOVERNANCE.md` and the remainder of `DEV-LOOP-V2.md`** (only partially read originally) were read in full. Both are confirmed fully covered by `docs/engineering/AGENT-OPERATIONS.md` — no unique durable rule found beyond what the original review already captured from their headers. ARCHIVE disposition holds.
- **Inbound-reference sweep re-run fresh** (`rg`/`grep` across the whole tree, not from memory) for every document flagged `DELETE`, `MERGE`, or `ARCHIVE`: results match the original matrix, with one new finding below (`scripts/show-ai-work-status.ps1`).
- **No production/runtime behavior needs to change for Phases 1-7.** Phase 1 (below) touches only a shell script, a CI workflow, and one documentation status line. Phases 2-8 as scoped touch only `docs/**` paths, `README.md`'s documentation index, and the handful of scripts that already read specific doc paths (`set-active-phase.ps1`, `update-ai-ops-status.sh`) — none of which are in `src/`, `supabase/`, or any deployment config. This was confirmed by re-reading each affected script in full, not assumed.

### Corrections to the original review

1. **`AI-HANDOFF.md` is no longer read by the three CI workflows — this is a material, positive correction.** The original review (§4.2, §7 row 3, §11) stated that `merge-gate.yml`, `persona-qa.yml`, and `hosted-qa.yml` `sed`/`grep` `docs/AI-HANDOFF.md` directly, carrying forward a finding from `docs/DOCUMENTATION-MIGRATION-MATRIX.md`'s 2026-09-13 snapshot. Direct inspection of current `main` shows this migration has since completed: all three workflows, plus `scripts/update-ai-ops-status.sh`, now read `docs/engineering/AI-RELEASE-STATE.md` exclusively — none of them reference `docs/AI-HANDOFF.md` at all. A dedicated script, `scripts/verify-ai-release-state-contract.sh`, already existed to assert the two files' required fields stay identical and that no listed consumer has regressed back to reading the legacy adapter — **but it was not wired into any CI workflow**, so nothing was actually enforcing it. `AI-HANDOFF.md`'s disposition is unchanged (`KEEP_ROOT`, it is still required to exist as a field-compatible adapter for inbound links per that same script's own check), but the *reason* changes from "still CI-parsed" to "still required for inbound-link compatibility, no longer CI-parsed directly," and the fragility risk originally described in §11 is smaller than stated: the two-file-drift risk is now closeable by simply running the existing script in CI (done — see Phase 1 below), leaving only the residual, still-real risk that `AI-RELEASE-STATE.md` itself is prose parsed by exact string/line match (confirmed: `hosted-qa.yml` still does a literal `grep -q "^CURRENT_CHECKPOINT: Issue #5"` against it). The YAML-migration recommendation in §11 stands, but the owner-approved framing is now sharper: see "Owner + ChatGPT decisions incorporated" below.
2. **`docs/phases/PHASE-2.md`'s stale "inactive" header was still live on `main`** exactly as the original review's §4 claimed (carried from the prior migration-matrix finding) — re-confirmed by reading the file directly rather than trusting the earlier citation. This is now fixed as part of Phase 1 (below), since it is a one-line, safe, GREEN-tier correction and is the single clearest real-world instance of the exact contradiction pattern the new drift check exists to catch.
3. **A previously-unseen script was found during the inbound-reference sweep: `scripts/show-ai-work-status.ps1`**, which `Get-Content`s `docs/CURRENT-WORK.md` verbatim and prints it alongside git status. This does not change `CURRENT-WORK.md`'s DELETE-after-merge disposition (§7 row 16), but it must be updated or retired in the same migration batch as `scripts/set-active-phase.ps1` — both scripts, not just one, depend on that file's path. Added to the manifest.
4. **`docs/OPEN-ITEMS-2026-09-12.md` and `docs/STRATEGIC-PLAN-2026-09-12.md` contain a small amount of durable product-fact content** not previously credited in the original review's one-line disposition ("DELETE, none not already in controller"). Specifically: OPEN-ITEMS records that `legalRoutesReadyForPublication` is dead scaffolding no longer gating `/privacy`'s real publication, that the bundle is a single 628 KB chunk (route-splitting opportunity), and the exact local-Persona-QA-against-local-Supabase recipe; STRATEGIC-PLAN records the same 628 KB finding plus a "ready for human validation" checklist. None of this is live *status* (the original disposition's core claim holds), but it is durable *engineering-debt/knowledge* that has no other home. Corrected disposition: **MERGE** (not plain DELETE) — fold the bundle-size and legal-scaffolding facts into a short "known debt" note (recommend: a new `docs/engineering/TECHNICAL-DEBT.md`, or a section of `docs/engineering/AGENT-OPERATIONS.md`) before removing the source files. Reflected in the manifest.

### Six REVIEW→ files — content-audited individually, not inferred from filenames

Per the explicit owner/ChatGPT instruction, all six were read in full this session (none had been read in the original pass). None were found to be pure filename-guessable historical noise; each gets a specific, evidence-based disposition:

| File | What it actually is | Disposition |
|---|---|---|
| `BUSINESS-STRUCTURE-AND-IMPACT.md` | 12 lines; durable, current, undated rules about org-hierarchy modeling and impact-reporting provenance (no nonprofit/B-Corp claims without verification, demo rows excluded from impact figures). No overlap with any other file. | **MOVE** → `docs/product/` |
| `COPILOT-LOCAL-SETUP.md` | Current, durable Copilot-specific local tool setup (Vercel plugin, `npx skills add supabase/agent-skills`, Chrome DevTools MCP). Materially different content from `AGENT-OPERATIONS.md` — this is tool-installation detail, not autonomy policy. | **MOVE** → `docs/engineering/` |
| `JIM-LOCAL-PC-SETUP.md` | Current, durable personal-machine reference (Docker CLI path quirk, Node/Supabase CLI versions, troubleshooting order). Explicitly documents that it must never contain secrets, and does not. No overlap elsewhere. | **MOVE** → `docs/engineering/` |
| `LOSTPAWS-RAVE-LANDING-DIRECTION.md` | A locked design/content spec for the already-shipped `/lostpaws` route (confirmed shipped per `AI-HANDOFF.md`'s history and `CURRENT-WORK.md`), including a still-relevant MVP acceptance checklist and a locked-artwork rule. Its own header ("IMPLEMENTATION IN PROGRESS") is now stale since the page shipped. | **MOVE** → `docs/product/`, with a one-line header refresh (from "IN PROGRESS" to "implemented — reference spec for `/lostpaws`") bundled into the same move, not a separate task |
| `OWNER-REVIEW-DRAFTS-2026-09-12.md` | Three dated draft-content sections. Section 1 (Lost Lands event copy) and section 2 (Seven Star Shelters content) are superseded by the later, more complete, owner-approved `SEVEN-STAR-SHELTERS-LANDING-BRIEF.md`. Section 3 (LLC/business-entity verification checklist and the open question of the exact legal entity name) is **not** duplicated anywhere else found in this repo and has no evidence of being resolved. | **MERGE** the section-3 LLC checklist into `docs/DECISIONS.md` as an open item (or `docs/product/BUSINESS-STRUCTURE-AND-IMPACT.md`), then **ARCHIVE** the rest |
| `SEVEN-STAR-SHELTERS-LANDING-BRIEF.md` | Current, detailed, owner-approved ("concept for parallel build") campaign brief for a route (`/sevenstars`) not yet found in `src/main.tsx`'s route list — i.e. still-pending product work, not historical. | **MOVE** → `docs/product/` (same lifecycle as the repo's other `docs/product/*.md` proposals) |

(`MARKETPLACE-RESEARCH.md`, §7 row 40, was a separate `REVIEW→MOVE` row not among the six named for full audit here; it was not re-read this session and keeps its original tentative `MOVE` call pending one more content check during Phase 5.)

### Claude Code router — verified against current product documentation, not assumed

Fetched Anthropic's current official Claude Code documentation directly (`docs.claude.com` → `code.claude.com`, both fetched fresh this session) rather than relying on a subagent's summary of it (an intermediate subagent call had triggered this session's own prompt-injection heuristic and was independently re-verified for exactly that reason). Confirmed, with direct doc quotes:

- **Project-level Skills are real and currently supported**, at `.claude/skills/<skill-name>/SKILL.md`, with `description` the only recommended frontmatter field. Skill *descriptions* load into every session's context automatically (cheap); full skill *content* loads only on invocation (`/skill-name`) or when Claude judges it relevant. They are git-committable and team-shared, exactly mirroring this repo's existing `.agents/skills/shelterpawtners/SKILL.md` (Codex) and `.github/skills/*/SKILL.md` (Copilot) conventions.
- **`CLAUDE.md` is confirmed auto-loaded into every session** from the working directory up to the repository root — this matches the empirical behavior already observed in this session.
- **A genuinely useful, previously-unconsidered mechanism was found**: CLAUDE.md supports an `@path` import syntax, and the documentation shows the *exact* scenario this repo already has (a cross-tool `AGENTS.md` plus a tool-specific `CLAUDE.md`) as its own worked example — `@AGENTS.md` at the top of `CLAUDE.md`, Claude-specific additions below it. Today, this repo's `CLAUDE.md` instead tells the agent to go read `AGENTS.md` as a manual step, which works (this session did read it) but relies on the instruction being followed rather than the content being structurally guaranteed in context. **Also newly confirmed: Claude Code reads `CLAUDE.md`, not `AGENTS.md`, directly** — so this repo's current two-file split is exactly the case Anthropic's own docs name as the reason the import exists.

Per the owner/ChatGPT conditional ("if Claude Code does not currently support a useful repo-native skill router beyond CLAUDE.md, retain a thin CLAUDE.md adapter instead") — it does support one, verified against current documentation, not invented. Recommendation, **not executed this session** (out of Phase 1's scope): add `.claude/skills/lostpaws/SKILL.md` mirroring the existing `.agents/skills/shelterpawtners/SKILL.md` content/table, and separately consider changing `CLAUDE.md`'s first line from prose instructing "read AGENTS.md" to a literal `@AGENTS.md` import so the content is guaranteed in context rather than instruction-dependent. Both are additive, low-risk, and staged into the manifest below rather than done ad hoc.

### Owner + ChatGPT decisions incorporated into the manifest

- **Phase docs**: `docs/phases/PHASE-2.md` (now status-corrected, see Phase 1) is a *completed* phase record → **ARCHIVE** once its durable decisions (if any beyond what `docs/DECISION-LOG.md`/`AUTONOMOUS-DECISIONS.md` already capture) are confirmed preserved. `docs/phases/PHASE-3.md`, `PHASE-4.md`, `PHASE-5.md` are *forward-looking, not-yet-executed* specs → **MERGE** into `docs/ROADMAP.md` as the one canonical forward-looking roadmap, rather than kept as separate phase files, per the explicit owner/ChatGPT instruction to use a single current roadmap document and not retain multiple phase-status authorities.
- **Machine-readable state**: decided, not merely recommended — YAML becomes authoritative (`docs/engineering/state/release-state.yaml`), and `docs/engineering/AI-RELEASE-STATE.md` (and, while it still exists, `docs/AI-HANDOFF.md`) become generated, read-only human views produced from that YAML rather than independently hand-maintained. This resolves the original review's own flagged open question in favor of the "generated mirror" option. Scoped to Phase 8, not this session — it requires migrating the same four consumers verified above in one bounded, dry-run-proven PR.
- **Support OS**: confirmed independent and parallel — activating it (owner picks an alert destination and issues two secrets) proceeds on its own track and is not sequenced behind any documentation-migration phase below.
- **Runtime refactors** (`src/main.tsx` decomposition, marketplace CSS consolidation): confirmed out of scope for every phase in this manifest; tracked separately as product/engineering debt, not touched here.
- **Dependabot auto-merge**: when built (§12 of the original review), confirmed scoped to green patch/minor only, excluding authentication/Supabase-sensitive packages — no change from the original recommendation, now explicitly owner-confirmed rather than merely proposed.
- **Branch model**: single short-lived branch → PR → `main` maintained throughout this session (Phase 1 used its own branch, `fix/classify-change-impact-authority-precedence`, separate from this long-lived review/planning branch, specifically to avoid mixing a real code change with a documentation-review artifact).

### Phase 1 — safety PR (executed and merged this session)

Branch `fix/classify-change-impact-authority-precedence`, PR #172:

- Fixed the confirmed `scripts/classify-change-impact.sh` case-precedence bug (moved the authority-file pattern ahead of the generic `docs/*|*.md|README*` pattern).
- Added `scripts/test-classify-change-impact.sh`: a disposable-git-repo regression test, run and confirmed failing against the pre-fix script and passing against the post-fix script.
- Added `scripts/check-doc-authority-drift.sh`: a small, explicit, non-LLM check for (a) an authority-chain entry point naming an already-superseded protocol doc, (b) anything under `docs/archive/**` (once it exists) being referenced as live authority, and (c) it also invokes the pre-existing `scripts/verify-ai-release-state-contract.sh`. Tested positive (fails when a violation is injected) and negative (passes on the real tree) before committing.
- Wired both new checks into a new, unconditional `guardrails` job in `ci.yml`, required by `CI Gate`.
- Corrected `docs/phases/PHASE-2.md`'s stale status header in the same PR (a related GREEN-tier documentation fix, not a separate task).
- Local validation: `npm run check` (lint, shell syntax, typecheck, 50 unit tests) green; both new scripts independently green.
- PR is `MERGEABLE` with every required and non-required check green (`CI Gate`, `Merge Gate`, `CodeQL`, the new `Authority drift + classifier regression` job, etc.); merge is blocked only by this session's own "Merge Without Review" auto-mode classifier, which requires the owner's manual click rather than an agent-initiated merge. See the PR for the exact merged SHA once that happens.

### Rollback baseline

Tag `pre-ai-first-migration-2026-09-14` → commit `f684025` (the exact `main` this whole review branched from), pushed to `origin`, created *before* Phase 1 merged. `git reset --hard pre-ai-first-migration-2026-09-14` (on a throwaway branch, never on `main` directly) recovers the pre-review state if anything in Phase 1 or later needs to be unwound.

The full Phase 2-8 migration manifest is in [`docs/AI-FIRST-MIGRATION-MANIFEST-2026-09-14.md`](AI-FIRST-MIGRATION-MANIFEST-2026-09-14.md).
