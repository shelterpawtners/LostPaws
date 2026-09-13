# Documentation Consolidation Master Plan

Status: PROPOSED / PLAN ONLY — DO NOT EXECUTE WHILE ACTIVE OVERNIGHT IMPLEMENTATION IS RUNNING

Owner intent: reduce context cost, stale/conflicting instructions, navigation friction, and documentation maintenance overhead for humans and AI agents while preserving durable product/security/legal/architecture knowledge.

This plan is intentionally isolated on `docs/documentation-consolidation-plan` so it does not interfere with the active Claude/Work overnight sprint.

---

## Executive conclusion

The repository has reached the point where documentation volume and duplication are causing **real operational cost**, not merely visual clutter.

The problem is not that Markdown files are inherently expensive. Files that are never read cost almost nothing at model runtime. The cost appears when agents are instructed to read broad sets of overlapping documents, search across them, reconcile conflicting versions, or repeatedly update several status documents for the same checkpoint.

Current symptoms include:

- multiple files describing the same live project state;
- historical progress/checkpoint documents still sitting beside current authority;
- tool-specific instruction files repeating project policy;
- dated task prompts retained after completion;
- overlapping AI operating/governance documents;
- launch, QA, branch, and phase narratives spread across many files;
- stale instructions that contradict newer owner decisions;
- extra CI/prettier churn from frequently edited coordination documents;
- increased likelihood that an agent retrieves an older statement and reintroduces superseded behavior.

The desired end state is **fewer authoritative documents, explicit ownership per topic, a tiny default agent read set, and Git history serving as the archive instead of the active working tree**.

---

## Evidence that the current structure is already harmful

### 1. Live-state duplication is stale in different ways

`docs/CURRENT-WORK.md` still describes Track 2 as awaiting merge and Track 3 as not started, even though those checkpoints have already advanced substantially. The same file also contains older accepted SHAs and deployment descriptions.

At the same time, `docs/AI-HANDOFF.md` has a newer top checkpoint but retains long historical Track 1/2/3 narratives and superseded execution rules below it.

`docs/AI-CONTROLLER.md` was created specifically to solve this problem, but it is already growing toward another long status document and still points agents at several overlapping control-plane files.

**Effect:** agents spend context and reasoning on determining which status paragraph wins instead of executing work.

### 2. Merge/autonomy instructions conflict

`AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, and `docs/AI-OPERATING-PROTOCOL.md` repeat merge/autonomy policy. Several still state that merges require explicit owner authorization, while the current handoff records a standing Claude merge authorization for the active work.

**Effect:** an agent can correctly follow one repository instruction and still contradict the owner's newer operating decision.

### 3. Default startup context is too broad

Current instructions often direct agents to read combinations of:

- `AGENTS.md`;
- active Issue/PR;
- `AI-HANDOFF.md`;
- `CURRENT-WORK.md`;
- `AI-TOOLING-AND-DESIGN-ROADMAP.md`;
- `AUTONOMOUS-EXECUTION-POLICY.md`;
- `DEV-LOOP-V2.md`;
- cost/testing governance;
- relevant product/architecture/security/design docs.

This can easily become tens of thousands of tokens before task-specific code is even inspected.

**Effect:** higher model cost, slower starts, more opportunity for irrelevant historical material to influence decisions, and smaller remaining context for actual implementation.

### 4. `docs/prompts/` has become an archive instead of an active task surface

The folder contains many completed Phase 2 checkpoint prompts and resolved blocker prompts alongside the two current task briefs.

**Effect:** agents searching for the current execution brief encounter old task contracts that should now exist only in Git history.

### 5. Completed phases and launch checkpoints remain in the active documentation surface

There are numerous Phase 1/2 execution/progress/QA files, launch checkpoint files, LL4/LL5/LL6 files, branch-cleanup reports, dated strategic plans, and site-review snapshots.

These records are valuable historically, but not as first-class current context.

**Effect:** search/retrieval noise and false authority.

---

## Design principles for the new documentation system

1. **One topic, one authority.** A fact or rule should have one canonical home.
2. **Dynamic state has one home.** Current status, blockers, active lanes, and next actions live only in `docs/AI-CONTROLLER.md`.
3. **Git is the archive.** Completed task briefs, checkpoint reports, and obsolete plans do not need to remain in the active tree merely to preserve history.
4. **Tool-specific instruction files are adapters, not policy stores.** `CLAUDE.md` and Copilot instructions should point to common authority instead of restating it.
5. **Default agent context is intentionally tiny.** Read only the universal rules, live controller, active task, and one relevant domain document.
6. **High-stakes knowledge stays explicit.** Security, legal, privacy, financial, data, and architecture rules are not deleted merely to reduce file count.
7. **Proposals have a lifecycle.** A proposal is active only while unresolved. Once accepted/rejected, its durable result is merged into the canonical domain document and the proposal is removed from the active tree.
8. **No dated status docs at the docs root.** Dates belong in Git history or inside a canonical log, except where a dated audit artifact is intentionally retained.
9. **Index, do not duplicate.** `docs/README.md` becomes the map of authority and tells agents what not to load.
10. **Measure the improvement.** Track default-read file count and approximate bytes/tokens before and after consolidation.

---

## Target repository documentation structure

```text
/
├─ README.md
├─ AGENTS.md                         # short universal rules only
├─ CLAUDE.md                         # thin Claude adapter/pointer
├─ .github/
│  ├─ copilot-instructions.md        # thin Copilot adapter/pointer
│  ├─ instructions/                  # path-specific technical rules only
│  ├─ agents/                        # specialist agent definitions
│  └─ skills/                        # reusable specialist skills
└─ docs/
   ├─ README.md                      # documentation map + authority hierarchy
   ├─ AI-CONTROLLER.md               # ONLY live status/lanes/blockers/next actions
   ├─ DECISIONS.md                   # OPEN owner decisions + durable decided items
   │
   ├─ product/
   │  ├─ PRODUCT.md                  # vision, personas, business model, core requirements
   │  ├─ MARKETPLACE.md
   │  ├─ PASSPORT.md
   │  ├─ RAVE-SHELTER.md
   │  └─ GIVING.md
   │
   ├─ engineering/
   │  ├─ ARCHITECTURE.md
   │  ├─ SECURITY.md
   │  ├─ DATA.md
   │  ├─ TESTING-RELEASE.md
   │  └─ AGENT-OPERATIONS.md         # consolidated AI/autonomy/dev-loop rules
   │
   ├─ operations/
   │  ├─ LAUNCH-RUNBOOK.md
   │  ├─ PROVIDERS.md                # Google/Meta/Vercel/Supabase operational state/rules
   │  └─ support/
   │     ├─ SUPPORT-OPERATIONS.md
   │     └─ runbooks/                 # only genuinely distinct support procedures
   │
   ├─ brand/
   │  ├─ BRAND.md
   │  └─ campaigns/
   │     ├─ LOSTPAWS.md
   │     └─ SEVEN-STARS.md
   │
   ├─ roadmap/
   │  ├─ ROADMAP.md
   │  ├─ PHASE-3.md
   │  ├─ PHASE-4.md
   │  └─ PHASE-5.md
   │
   ├─ tasks/
   │  ├─ active/                     # only currently active multi-step task briefs
   │  └─ templates/
   │     └─ TASK-BRIEF.md
   │
   └─ legal/                         # intentionally separate/high-stakes
      ├─ PRIVACY.md or draft
      ├─ TERMS.md or draft
      ├─ DATA-DELETION.md or draft
      └─ REVIEW-CHECKLIST.md
```

The exact file names can change during execution; the important design is the authority boundary.

---

## Default agent read budget after cleanup

Every general coding/review agent should start with **at most four documents** unless the task genuinely requires more:

1. `AGENTS.md` — universal guardrails and authority rules;
2. `docs/AI-CONTROLLER.md` — current state and active lane;
3. active GitHub Issue/PR **or** one `docs/tasks/active/...` task brief;
4. one relevant canonical domain document, such as `product/MARKETPLACE.md` or `engineering/SECURITY.md`.

Everything else is retrieved only when the task points to it.

### Target sizes

- `AGENTS.md`: approximately 150–200 lines maximum, preferably less.
- `CLAUDE.md`: approximately 20–30 lines.
- `.github/copilot-instructions.md`: approximately 30–50 lines plus path pointers.
- `AI-CONTROLLER.md`: ideally 3–5 KB, never a historical diary.
- active task briefs: bounded to one sprint/task and deleted from the active tree after completion.

The goal is a **60–80% reduction in normal startup documentation context** without deleting necessary domain knowledge.

---

## Consolidation map by current documentation family

### A. AI / agent governance

Current overlapping files include:

- `AGENTS.md`;
- `CLAUDE.md`;
- `.github/copilot-instructions.md`;
- `docs/AI-OPERATING-PROTOCOL.md`;
- `docs/AUTONOMOUS-EXECUTION-POLICY.md`;
- `docs/CHATGPT-OPERATING-PROTOCOL.md`;
- `docs/DEV-LOOP-V2.md`;
- `docs/AI-COST-AND-TESTING-GOVERNANCE.md`;
- `docs/product/CODEX-CLAUDE-COLLABORATION-PROTOCOL.md`;
- portions of `AI-EXECUTION-PLAN-*`.

**Target:**

- `AGENTS.md` = universal repository guardrails + 4-document read budget + precedence rules.
- `docs/engineering/AGENT-OPERATIONS.md` = full autonomy model, model/tool guidance, branch ownership, auth failsafe, testing/cost rules.
- `CLAUDE.md` and Copilot instructions = thin tool adapters only.

**Remove after migration:** redundant operating protocol files and obsolete dated execution plans once unique durable rules are captured.

### B. Live control plane

Current files overlap heavily:

- `docs/AI-CONTROLLER.md`;
- `docs/AI-HANDOFF.md`;
- `docs/CURRENT-WORK.md`;
- `docs/OPEN-ITEMS-2026-09-12.md`;
- `docs/STRATEGIC-PLAN-2026-09-12.md`;
- portions of `OWNER-REVIEW-DRAFTS-*`.

**Target:**

- `AI-CONTROLLER.md` = live status, active agents, blockers, next actions, deployment/runtime checkpoint.
- roadmap/backlog = future work, not current status.
- decisions = owner gates, not current status.

After references are migrated, `AI-HANDOFF.md` and `CURRENT-WORK.md` should first become tiny compatibility stubs pointing at the controller, then be deleted once no active workflow depends on their paths.

### C. Decisions

Current:

- `DECISION-LOG.md`;
- `OWNER-DECISION-BACKLOG.md`;
- `AUTONOMOUS-DECISIONS.md`;
- `product/OWNER-DECISIONS-NEXT-SPRINT.md`.

**Target:** one `docs/DECISIONS.md` with:

- `OPEN` — unresolved owner decisions;
- `DECIDED` — durable approved decisions;
- `SUPERSEDED` — only where the historical relationship materially matters.

Completed low-value implementation micro-decisions can remain recoverable in Git history instead of keeping an indefinite append-only document enormous.

### D. Product definition

Current overlapping material includes:

- `PRODUCT-VISION.md`;
- `PRODUCT-REQUIREMENTS.md`;
- `USER-ROLES.md`;
- `BUSINESS-STRUCTURE-AND-IMPACT.md`;
- `FINANCIAL-LEDGER-AND-GIVING.md`;
- `MVP-PROFILE-DATA-MODEL-REVIEW.md`;
- several files under `docs/product/`.

**Target:**

- `product/PRODUCT.md` — mission, personas, business model, universal product invariants;
- `product/MARKETPLACE.md`;
- `product/PASSPORT.md`;
- `product/RAVE-SHELTER.md`;
- `product/GIVING.md`.

Schema implementation detail belongs in engineering/data, not repeated in product narratives.

### E. Marketplace research/design/proposals

Current:

- `MARKETPLACE-DESIGN-SPRINT.md`;
- `MARKETPLACE-RESEARCH.md`;
- `product/DUAL-MARKETPLACE-RAVE-SHELTER-EXECUTION-PLAN.md`;
- `product/OFFER-LINK-PREVIEW-PROPOSAL.md`;
- marketplace-related skill files.

**Target:** durable accepted behavior in `product/MARKETPLACE.md`. Research can be reduced to a short rationale/reference section or kept only when it remains genuinely useful. Temporary execution plans/proposals are removed once resolved.

Skills remain under `.github/skills/` if they are actively useful to the coding tools, but should reference the canonical marketplace doc rather than duplicate its current state.

### F. Brand and campaigns

Current:

- `BRAND-DESIGN-SYSTEM.md`;
- `CONTENT-STANDARDS.md`;
- `FESTIVAL-MVP-AND-VERIFICATION.md`;
- `LOSTPAWS-RAVE-LANDING-DIRECTION.md`;
- `RAVE-SHELTER-LOSTPAWS-MISSION.md`;
- `SEVEN-STAR-SHELTERS-LANDING-BRIEF.md`.

**Target:**

- `brand/BRAND.md` — shared visual/content standards;
- `product/RAVE-SHELTER.md` — program definition/hierarchy;
- `brand/campaigns/LOSTPAWS.md` — LostPaws campaign-specific facts, artwork rules, non-affiliation;
- `brand/campaigns/SEVEN-STARS.md` — Seven Star activation-specific direction.

Superseded campaign framing should not remain in an active neighboring file.

### G. Launch / hosting / auth readiness

Current includes many:

- `CUTOVER-SHELTERPAWTNERS-COM.md`;
- `HOSTED-QA.md`;
- `LAUNCH-*` files;
- `LL4-*`, `LL5-*`, `LL6-*`;
- `MAIN-PROTECTION-AND-BRANCH-RETIREMENT.md`;
- branch cleanup reports.

**Target:**

- `operations/LAUNCH-RUNBOOK.md` — current launch/deploy/rollback/acceptance procedure;
- `operations/PROVIDERS.md` — provider-specific operational facts and deferred Meta state;
- `engineering/TESTING-RELEASE.md` — deterministic test tiers and release gates.

Dated cutover/checkpoint reports should be summarized and removed from the active tree once no longer operationally necessary.

### H. Phase/progress files

Current includes:

- `PHASE-1-EXECUTION.md`, `PHASE-1-PROGRESS.md`;
- multiple Phase 2 checkpoint progress/QA docs;
- `PHASE-2-EXECUTION-PLAN.md`;
- `docs/phases/PHASE-2.md` through `PHASE-5.md`.

**Target:**

- Completed Phase 1/2: concise completion summary inside `roadmap/ROADMAP.md`, with exact detail recoverable from Git/PRs.
- Future Phase 3/4/5: retain only if still strategically relevant and move under `roadmap/`.

Do not make an agent read completed checkpoint diaries to understand current behavior.

### I. Task/prompt files

Current `docs/prompts/` contains many completed blocker, Phase 2, and session bootstrap prompts alongside current tasks.

**Target:**

- `docs/tasks/active/` — only tasks actively in progress;
- `docs/tasks/templates/TASK-BRIEF.md` — reusable structure;
- completed tasks removed from active tree after their outcome is represented by code/controller/domain docs.

Git history and merged PRs are the archive.

### J. Support documentation

Current support docs are comparatively well-scoped but still have overlap among operating model, guardrails, severity, escalation, and notifications.

**Target:**

- `operations/support/SUPPORT-OPERATIONS.md` — operating model + AI guardrails + severity + escalation + notification rules;
- retain separate runbooks for genuinely different procedures such as auth/account, adoption verification, marketplace redemption, and bug reproduction.

Support docs should never be in the default coding-agent read set unless support is the task.

### K. Legal / privacy

Do **not** aggressively consolidate merely to reduce file count.

Keep legal drafts and review checklist isolated because review status and publication state matter. Rename/reorganize for clarity, but do not silently blend draft and published language.

### L. `.github` instructions, agents, and skills

These files can remain because some tooling discovers them by convention.

However:

- eliminate duplicated live project state from them;
- eliminate repeated business policy where a canonical doc exists;
- keep path-specific instructions actually path-specific;
- point every tool to `AGENTS.md`, controller, active task, then relevant domain authority.

---

## File lifecycle rules going forward

Every new documentation file must be one of:

- **CANONICAL** — authoritative long-lived domain knowledge;
- **ACTIVE TASK** — temporary execution contract;
- **LEGAL DRAFT** — high-stakes review artifact;
- **REFERENCE** — intentionally retained reference that is not authority.

Suggested header:

```markdown
Status: CANONICAL | ACTIVE TASK | LEGAL DRAFT | REFERENCE
Owner: <domain/role>
Last reviewed: YYYY-MM-DD
Supersedes: <paths or NONE>
```

### Rules

- An ACTIVE TASK is removed after merge/acceptance once its durable output is captured.
- A proposal is removed after decision/implementation and its outcome is moved into canonical docs.
- A canonical file may not duplicate another canonical file's current-state section.
- Status updates do not create new dated docs; update the controller.
- Retrospective evidence should live in GitHub PRs/issues/commits or intentionally named audit records.

---

## Recommended execution sequence

### Phase 0 — tonight: plan only

**Do not perform mass moves/deletes while Claude and Work are executing the active overnight sprint.**

Reason: large documentation renames would create branch conflicts, trigger avoidable CI, alter classifier inputs, and make active agents rebase against a moving documentation tree.

This master plan is therefore isolated on its own branch.

### Phase 1 — create the authoritative inventory

After the overnight sprint settles:

1. generate a machine-readable inventory of Markdown/instruction files;
2. classify every file as `KEEP`, `MERGE`, `REPLACE_WITH_STUB`, or `DELETE_AFTER_MIGRATION`;
3. record canonical target and unique information that must survive;
4. search code/workflows/docs for path references before moving anything;
5. identify tool-discovery paths that cannot be renamed casually.

Deliverable: a doc migration matrix reviewed before destructive cleanup.

### Phase 2 — clean the control plane first

Highest ROI:

1. rewrite `AGENTS.md` to the minimal universal contract;
2. create/update `docs/README.md` as authority map;
3. shrink `AI-CONTROLLER.md` to current state only;
4. consolidate AI/autonomy/dev-loop rules into one agent-operations doc;
5. make Claude/Copilot files thin adapters;
6. transition `AI-HANDOFF.md` and `CURRENT-WORK.md` to compatibility stubs;
7. update workflows/scripts/prompts that reference old paths.

This immediately lowers agent startup cost before deeper product-doc cleanup.

### Phase 3 — consolidate product and engineering knowledge

Merge product, architecture, data, security, testing, marketplace, Passport, RAVE, and giving material into the target domain docs.

For every merge:

- preserve unique constraints;
- explicitly resolve contradictions using newer owner decisions/current code;
- do not silently invent a resolution when authority is unclear;
- record true unresolved items in `DECISIONS.md`.

### Phase 4 — launch, phase, task, and historical cleanup

After durable information is migrated:

- remove completed Phase 1/2 checkpoint docs;
- remove old launch checkpoint snapshots;
- remove completed task/prompt docs;
- remove superseded branch-cleanup narratives;
- remove stale dated strategic/status docs;
- retain Git history and PR/issue evidence as the historical record.

### Phase 5 — support/brand/legal organization

Consolidate support policy while retaining distinct runbooks. Consolidate brand/content/campaign authority. Reorganize legal files conservatively.

### Phase 6 — documentation CI/audit automation

Add a small deterministic documentation audit, not an AI review on every commit.

Potential checks:

- broken internal Markdown links;
- references to deleted/superseded authoritative paths;
- more than a small allowed number of files in `docs/tasks/active/`;
- task briefs older than a defined threshold without ACTIVE status;
- unapproved planning/status docs created directly at `docs/` root;
- required metadata header on canonical/task docs;
- `AI-CONTROLLER.md` maximum-size warning;
- tool adapter files containing forbidden duplicated live-state headings.

Do not make documentation CI so strict that harmless prose becomes a release blocker. The audit should catch structural decay, not police writing style.

---

## Proposed migration matrix — first-pass priorities

| Current family | Action | Target |
| --- | --- | --- |
| `AI-CONTROLLER.md` | KEEP + SHRINK | same path |
| `AI-HANDOFF.md` | MERGE live state, then STUB/REMOVE | `AI-CONTROLLER.md` |
| `CURRENT-WORK.md` | MERGE live state, then STUB/REMOVE | controller + roadmap |
| `OPEN-ITEMS-*` | MERGE | controller / roadmap / decisions |
| `STRATEGIC-PLAN-*` | MERGE | `roadmap/ROADMAP.md` |
| AI operating/autonomy/dev-loop docs | MERGE | `engineering/AGENT-OPERATIONS.md` |
| `CLAUDE.md` | KEEP but shrink | thin adapter |
| Copilot global instructions | KEEP but shrink | thin adapter |
| `DECISION-LOG.md` + owner/autonomous decision docs | MERGE | `DECISIONS.md` |
| PRODUCT-VISION / REQUIREMENTS / USER-ROLES | MERGE | `product/PRODUCT.md` |
| Marketplace plans/research | MERGE accepted truth | `product/MARKETPLACE.md` |
| RAVE/LostPaws mission/direction docs | MERGE | `product/RAVE-SHELTER.md` + campaign doc |
| Seven Star brief | MOVE/REFINE | `brand/campaigns/SEVEN-STARS.md` |
| Brand + content standards | MERGE | `brand/BRAND.md` |
| Launch/LL/cutover/readiness docs | MERGE | `operations/LAUNCH-RUNBOOK.md` / `PROVIDERS.md` |
| Phase 1/2 progress/checkpoint docs | SUMMARIZE then REMOVE | `roadmap/ROADMAP.md` + Git history |
| Phase 3/4/5 docs | KEEP if current, MOVE | `roadmap/` |
| completed `docs/prompts/*` | REMOVE after durable outcome captured | Git history |
| current prompt briefs | MOVE while active | `tasks/active/` |
| support policy docs | MERGE | `operations/support/SUPPORT-OPERATIONS.md` |
| support procedural runbooks | KEEP/MOVE | `operations/support/runbooks/` |
| legal drafts | KEEP, conservative rename only | `legal/` |
| Meta readiness | KEEP while deferred provider work remains | `operations/PROVIDERS.md` or provider subdoc |
| dated branch cleanup reports | SUMMARIZE then REMOVE | controller/roadmap if still actionable |

This is a planning classification, not permission to delete files without the Phase 1 path-reference and unique-content audit.

---

## Agent-context policy after migration

Launcher prompts should normally be only one or two sentences:

> Sync current `main`. Read `AGENTS.md`, `docs/AI-CONTROLLER.md`, and the active task brief/Issue. Read the relevant canonical domain doc only if the task requires it. Execute autonomously under repository guardrails.

Agents should **not** be told to read every governance, strategy, phase, handoff, and product document before acting.

### Context escalation

Read more only when triggered by the work:

- auth/RLS/security => `engineering/SECURITY.md`;
- DB/schema => `engineering/DATA.md`;
- Marketplace => `product/MARKETPLACE.md`;
- RAVE/LostPaws => `product/RAVE-SHELTER.md` + relevant campaign doc;
- launch/deployment => `operations/LAUNCH-RUNBOOK.md`;
- legal publication => `legal/*`;
- support => support operations/runbook.

---

## Expected benefits

### Model cost and speed

The repository does not incur AI cost merely because files exist. The savings come from reducing how much agents are instructed or forced to retrieve and reconcile.

Expected result:

- substantially fewer startup tokens;
- faster task initialization;
- more model context available for code/diffs/tests;
- less repeated summarization of project history.

### Correctness

The larger benefit is correctness:

- fewer contradictory instructions;
- lower chance of reviving superseded product direction;
- one clear answer to “what is current?”;
- cleaner agent handoffs;
- less stale test/copy behavior propagated from old planning docs.

### Human maintainability

- easier repo navigation;
- less uncertainty about which document to edit;
- fewer docs-only commits and formatting failures;
- cleaner pull requests;
- easier onboarding for a future human developer.

---

## Risks and protections

### Risk: losing useful history

Protection: Git already retains deleted file history. Before removal, capture durable constraints/results in canonical docs and preserve high-stakes audit/legal records deliberately.

### Risk: breaking tool instructions

Protection: inventory references first. Keep convention-sensitive paths such as `AGENTS.md`, `CLAUDE.md`, `.github/instructions`, `.github/skills`, and `.github/agents` unless tooling is confirmed not to depend on them.

### Risk: consolidation creates giant monoliths

Protection: consolidate **by domain**, not into one mega-document. The objective is a small authority graph, not one enormous README.

### Risk: mass cleanup conflicts with active development

Protection: execute only after active overnight implementation merges/settles, on a dedicated branch, in reviewable batches.

### Risk: canonical docs become stale again

Protection: lifecycle rules + docs map + lightweight structural CI + controller size/read-budget limits.

---

## Success metrics

Before merging the cleanup, measure baseline and target:

1. number of Markdown/instruction files in the active tree;
2. number and total bytes of files a normal coding agent is instructed to read at startup;
3. number of files claiming current status/next action;
4. number of decision backlogs/logs;
5. number of active task/prompt files;
6. number of broken/stale internal doc references.

Targets:

- **1** live-status file;
- **1** durable decision authority;
- **<= 4** default startup documents;
- **<= 3** active task briefs under normal circumstances;
- **60–80% reduction** in default startup documentation bytes/tokens;
- no known contradictory current-state/autonomy instructions;
- historical completed task/checkpoint documents removed from the active tree once their durable knowledge is captured.

---

## Recommendation

Proceed with consolidation, but **not as a mass cleanup tonight**.

The highest-value time is immediately after the current Claude/Work overnight sprint reaches a stable merge/production checkpoint. Then execute this plan on a dedicated documentation branch in small phases, beginning with the control plane and agent startup rules.

The first implementation PR should be deliberately narrow:

1. documentation inventory/migration matrix;
2. `docs/README.md` authority map;
3. slim `AGENTS.md` / tool adapters;
4. slim controller;
5. consolidated agent-operations doc;
6. compatibility stubs for old live-state paths.

Only after those references are proven should the second PR remove/merge historical product, launch, phase, and prompt files.

**Do not perform wholesale deletions until the migration matrix confirms every unique high-value constraint has a canonical destination.**
