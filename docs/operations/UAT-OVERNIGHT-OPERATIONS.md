# UAT Overnight Operations

Status: CANONICAL (sprint-scoped)
Owner: Repository operations
Created: 2026-09-15
Sprint window: post-MVP UAT pass (Issue #183), 2026-09-15 overnight autonomous execution

This document adds only the rules specific to the current UAT sprint. It does
not restate `AGENTS.md` or `docs/engineering/AGENT-OPERATIONS.md` — read both
first. Where this document is silent, those two govern.

## Primary mission

The single business objective that outranks all other UAT work this sprint:

> Perfect the **QR → `/lostpaws` → Pet Guardian signup/onboarding** journey and
> the **QR → `/lostpaws` → Raver Vendor signup/onboarding** journey.

A QR code scan is a phone, in a low-attention environment, on one chance to
make a first impression. Every prioritization call below exists to serve
those two funnels. Work outside them is valid but subordinate.

## Source of truth for work items

Issue #183 ("UAT: Post-MVP batch tracking") is the raw, classified UAT
record — 45 items (UAT-1..UAT-45) across 4 batches, already clustered
(Cluster A..K) and root-caused. It is the traceability anchor: every
GitHub Issue opened for this sprint must link back to the UAT-N item(s) it
covers. Do not re-litigate classification already done there; do re-rank by
funnel impact per this document.

`.github/agent-ops/uat-queue.yaml` is the durable, machine-readable backlog
derived from #183, re-prioritized for the funnel mission. It is what agents
actually read to decide what to work on next.

`.github/agent-ops/uat-run-state.yaml` is live execution state (claims,
in-progress branches, last-updated timestamps). It changes constantly and is
not meant to be human prose — treat it as a lock/ledger file, not a report.

## Priority tiers

- **P0** — Directly breaks or blocks the Guardian or Vendor funnel today
  (confirmed bug, dead end, or broken first impression on the QR landing
  itself). Fix before anything else.
- **P1** — Materially improves the Guardian/Vendor funnel (clarity, trust,
  mobile usability, sign-up friction) or is a zero-risk, high-visibility
  first-impression fix (stale brand assets, awkward copy on `/lostpaws`).
- **P2** — Real value, but not on the funnel critical path (sitewide design
  system pass, non-blocking clarifications, professional-site Tier-1 items).
- **P3** — Deferred: needs an owner/product decision first, needs an asset
  that doesn't exist yet (real product photography), is its own larger
  feature slice, or is explicitly sequenced later by the owner (Cluster K /
  Batch 4's "professional site" checklist below Tier 1).

Re-rank within a tier by: implementation effort (cheap first) and regression
risk (safe first) — never let a P2/P3 item jump ahead of a ready P0/P1 item
because it's easier.

## Claude / Codex division of responsibility

No native mechanism in this repository lets Claude dispatch Codex or lets
Codex be triggered by a GitHub event (verified 2026-09-15: no GitHub App
installation, no repository webhooks, no Codex-aware workflow in
`.github/workflows/`). GitHub itself — Issues, branches, PRs, and the queue
YAML — is the coordination bus. Each agent independently polls it; neither
agent blocks on the other.

**Claude owns:**

- `/lostpaws` funnel architecture and copy decisions bounded by `AGENTS.md`'s
  no-fabrication rule.
- Auth/navigation integration (`src/main.tsx` — `Signup()`, `Login()`,
  `Cards()`, nav) — high-collision file, single-owner only.
- Ambiguous or cross-cutting UX calls that need judgment against `AGENTS.md`
  product invariants.
- Coordination: queue upkeep, issue triage, merge execution, staging
  verification.

**Codex owns (well-bounded, low-collision):**

- Isolated UI components not in `src/main.tsx`.
- Mobile/responsive corrections.
- Accessibility fixes (focus order, aria labels, contrast).
- Isolated form/validation logic that doesn't touch shared auth components.
- Deterministic, reproducible bugs with a clear fix.
- Regression tests (Playwright specs) for anything either agent fixes.

If a queue item's `owner` is `unassigned`, either agent may claim it — but
respect the collision hints (below) before claiming.

## Branch, worktree, and issue conventions

- One GitHub Issue per work packet (a cluster or a single high-value UAT
  item), each listing every UAT-N item it resolves.
- One short-lived branch per Issue, branched from current `main`:
  `fix/uat-<issue-number>-<slug>` (bug/functional) or
  `chore/uat-<issue-number>-<slug>` (content/asset/design-system only).
- One PR per branch, referencing the Issue (`Closes #NNN`) and listing the
  UAT-N item(s) covered in the PR description.
- `uat/post-mvp` is retired as an implementation branch as of this sprint —
  its one pending commit is already merged to `main` via PR #185. All new
  work branches from `main`, not from `uat/post-mvp`. This supersedes the
  branch note in Issue #183's body.
- Do not use worktrees unless two agents must edit the same repository
  checkout concurrently on unrelated branches; normal branch-switching is
  sufficient for sequential single-checkout work.

## Collision prevention

- `src/main.tsx` is the highest-collision file in the repository (nav, all
  four signup/login flows, footer, admin menu). Only Claude claims tasks
  that touch it. Codex must not open a PR touching `src/main.tsx` this
  sprint without first checking `uat-run-state.yaml` for an active claim.
- Before claiming a queue item, check `uat-run-state.yaml` for another
  agent's active claim on the same files (the queue lists
  `conflict_files` per item) and check open PRs for the same paths.
- If two items touch the same file, sequence them (one PR merges before the
  next branches) rather than parallelizing.
- Claim a task by writing your agent name and timestamp into
  `uat-run-state.yaml` before branching. Release the claim (move it to
  `completed` or remove it) as the last step after merge, not before.

## Test / CI requirements

Governed by `docs/engineering/AGENT-OPERATIONS.md`'s deterministic validation
routing — do not duplicate that table here. Sprint-specific addition: any
fix touching the Guardian or Vendor signup/onboarding path must include or
update a Playwright regression spec covering the fixed behavior before the
PR is considered done, even for a one-line copy fix, if a spec already
exists for that page; do not block a P0 bug fix on writing a spec from
scratch if none exists — file a P2 follow-up instead.

## Progressive merge policy

Merge each bounded, green PR as soon as it is ready — do not batch multiple
UAT fixes into one PR, and do not hold a finished, validated fix until
morning. Refresh `main` after every merge before claiming or continuing the
next task, since another agent may have merged in the meantime.

## Staging / live verification requirement

After merging a PR that touches the Guardian or Vendor funnel
(`/lostpaws`, `Signup()`, `Login()`, `PartnerOrganizationOnboarding()`,
nav, or any of the assets in `public/brand/`), verify the AI Ops
GitHub Pages staging health surfaced by Issue #182's work before claiming
the next task. A merge without a subsequent health check is not done.

## RED escalation boundaries

Everything in `docs/engineering/AGENT-OPERATIONS.md`'s RED section applies
unchanged. Sprint-specific RED triggers to stop narrowly on rather than
assume:

- Rewriting wording documented in `docs/design/BRAND-DESIGN-SYSTEM.md` /
  `CONTENT-STANDARDS.md` without a recorded owner decision. (The RAVE
  Shelter tagline itself was previously RED here per UAT-20's flag; the
  owner approved the "Shop" -> "Browse" replacement on 2026-09-15 on
  issue #201, so that specific rewrite is no longer blocked — this
  boundary now applies to any _other_ undocumented brand-wording change.)
- Any change implying a savings figure, donation amount, partnership, or
  verification claim that isn't already substantiated in the repository.
- Any change to email/auth infrastructure (SPF/DKIM/DMARC, Resend
  configuration) — diagnose and document, do not reconfigure production
  mail infrastructure without owner sign-off.

Finish safely separable work, record the exact blocker in the Issue and in
`uat-run-state.yaml`, and move to the next ready item — never idle on a RED
item.

## Handoff / claim / release protocol

1. Refresh `main`.
2. Read `.github/agent-ops/uat-queue.yaml` and `uat-run-state.yaml`.
3. Pick the highest-priority item where `status: ready`, `owner` is your
   agent or `unassigned`, and no unresolved `conflict_files` collision
   exists with another agent's active claim.
4. Claim it in `uat-run-state.yaml` (agent name, item id, branch name,
   timestamp) and commit that state update alone, or as the first commit
   on the new branch.
5. Branch, implement, test.
6. Open the PR, wait for CI, merge when green and owner-authorized (or
   under standing merge authorization for bounded, non-destructive PRs).
7. Verify staging/live health if the funnel was touched.
8. Update the queue item's `status` to `done` (or `blocked`/`deferred` with
   a reason) and update the linked Issue with the result.
9. Release the claim in `uat-run-state.yaml`.
10. Immediately return to step 1 and claim the next item — do not idle
    because the other agent is mid-task on something unrelated.

When your work unblocks another queued item (e.g., a dependency listed in
`depends_on`), update that item's `status` to `ready` in the same commit
that completes your item, so the other agent can discover it without
waiting on a chat message.

Use Issue/PR comments only for a meaningful discovery or handoff note (a
root cause found, an assumption made, a blocker hit). Do not use comments
for routine status — that belongs in the YAML.

## Definition of DONE

A queue item is `done` only when all of the following are true:

- The linked PR is merged to `main`.
- All required CI checks passed green on the merge commit (or the merge
  was owner-authorized despite a documented, non-blocking exception).
- Any Playwright coverage required by the test/CI section above exists and
  passes.
- If the Guardian or Vendor funnel was touched, staging/live health was
  verified after merge.
- The originating UAT-N item(s) in Issue #183 are marked `DONE` (or
  `PARTIAL`/`DEFERRED` with a stated reason) in that issue.
- The queue item's claim is released in `uat-run-state.yaml`.

## Future launcher prompts

Once this operating layer exists, resuming work should not require
re-deriving any of the above. Use:

**Claude:**

> Resume ShelterPawtners autonomous UAT operations from AGENTS.md,
> docs/AI-CONTROLLER.md, docs/operations/UAT-OVERNIGHT-OPERATIONS.md, and
> .github/agent-ops/uat-queue.yaml. Pull the highest-priority ready Claude
> task and continue until blocked.

**Codex:**

> Resume ShelterPawtners autonomous UAT operations from AGENTS.md,
> docs/operations/UAT-OVERNIGHT-OPERATIONS.md, and
> .github/agent-ops/uat-queue.yaml. Pull the highest-priority ready Codex
> task and continue until blocked.

If a future session finds that Codex _can_ be natively triggered by a
GitHub event (a webhook or App gets installed), update the "Claude / Codex
division of responsibility" section above to reflect the lower-complexity
mechanism and drop the manual-launcher instruction for whichever side
becomes automatic.
