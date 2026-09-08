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

### Completed

- Issue #8 Admin QA foundation and targeted hosted regression coverage implemented.
- Persona QA pgTAP harness defect corrected after CI exposed an invalid permission assertion.
- Issue #9 MVP profile/data-model review completed.
- Current schema was found sufficient for MVP foundation; no new migration required from Issue #9.
- RAVE Vendor remains a Partner-architecture classification/channel rather than a duplicate organization model.

### Current strategic findings

- `pets.created_by` must become provenance-only before shelter-created Passport transfer/handoff work because creator-based ongoing access is not appropriate for future lifecycle ownership.
- Co-guardian support requires a primary-controller/acceptance policy before UI expansion.
- Adoption verification should be implemented later as a secure send/respond/token/audit vertical slice.
- Shelter onboarding should gain duplicate/claim protections comparable to Partner organization onboarding.
- Broad full-site Issue #5 QA is intentionally deferred until major MVP vertical slices connect.

### Active work

`NEXT TASK TO ASSIGN`

Recommended sequence:
1. Stabilize/complete the currently active Partner Marketplace golden path with focused support/moderation visibility and one strong regression path.
2. Build a small private Guardian profile-lite vertical slice.
3. Continue Pet Passport foundation only within the approved phase boundary.
4. Defer adoption verification and full transfer/handoff until explicitly authorized.

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

None for this coordination-file setup.
