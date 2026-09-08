# AI Handoff

This file is the shared baton between ChatGPT, Codex, Copilot, GitHub Actions, and human review.

## Rules

- The agent that completes a meaningful task must update this file before declaring the task complete.
- Keep this file current; do not append an unbounded transcript.
- GitHub Issues define the task contract. Pull requests/commits contain implementation. This file summarizes the latest handoff state.
- Never store passwords, tokens, service-role keys, private customer data, or other secrets here.
- If a material product/legal/privacy/security/financial decision is unresolved, record it as `OPEN DECISION` and reference `docs/DECISION-LOG.md`.
- Do not begin Phase 2 Checkpoint 5 or Phase 3 without explicit authorization.

## Current handoff

Updated by: ChatGPT
Branch: `qa/guardian-registration-personas`
Last known completed product task: GitHub Issue #9 — MVP Profile & Data Model Review
Last reported implementation SHA: `b339628`
Coordination setup: GitHub Issue #10
Active implementation task: GitHub Issue #11 — MVP SLICE: stabilize Partner Marketplace golden path + targeted regression

### Completed

- Issue #8 Admin QA foundation and targeted hosted regression coverage implemented.
- Persona QA pgTAP harness defect corrected after CI exposed an invalid permission assertion.
- Issue #9 MVP profile/data-model review completed.
- Current schema was found sufficient for MVP foundation; no new migration required from Issue #9.
- RAVE Vendor remains a Partner-architecture classification/channel rather than a duplicate organization model.
- Repo-native AI coordination foundation added via `AI-HANDOFF.md`, `AI-OPERATING-PROTOCOL.md`, updated `CURRENT-WORK.md`, and the AI Agent Task issue template.

### Current strategic findings

- `pets.created_by` must become provenance-only before shelter-created Passport transfer/handoff work because creator-based ongoing access is not appropriate for future lifecycle ownership.
- Co-guardian support requires a primary-controller/acceptance policy before UI expansion.
- Adoption verification should be implemented later as a secure send/respond/token/audit vertical slice.
- Shelter onboarding should gain duplicate/claim protections comparable to Partner organization onboarding.
- Broad full-site Issue #5 QA is intentionally deferred until major MVP vertical slices connect.

### Active work

**Issue #11 — MVP SLICE: stabilize Partner Marketplace golden path + targeted regression**

Codex should execute Issue #11 directly from GitHub after reading:
1. `docs/CURRENT-WORK.md`
2. `docs/AI-OPERATING-PROTOCOL.md`
3. this file
4. the relevant Phase 2 Checkpoint 2/3/4 progress docs

The intended golden path is:

Partner account -> Partner profile -> create/manage offer -> publish offer -> Guardian can discover/view offer -> existing approved claim/redemption entry point remains functional.

Testing remains strategic: one strong golden-path Playwright regression plus existing relevant RLS/pgTAP checks; do not expand the broad Issue #5 audit.

### Recommended sequence after Issue #11

1. Build a small private Guardian profile-lite vertical slice.
2. Continue Pet Passport foundation only within the approved phase boundary.
3. Defer adoption verification and full transfer/handoff until explicitly authorized.

### Required completion report from any coding agent

Before finishing a task, replace/update the sections below:

- **Issue / task:**
- **Agent:**
- **Branch:**
- **Final remote SHA:**
- **What changed:**
- **Tests run + results:**
- **CI / hosted QA status:**
- **Open defects:**
- **Product-owner decisions needed:**
- **Deferred items:**
- **Recommended next action:**

### Human action required

Run Codex/Work with the short instruction:

`Execute GitHub Issue #11. Read docs/AI-OPERATING-PROTOCOL.md and docs/AI-HANDOFF.md first. Update the handoff file before you finish.`
