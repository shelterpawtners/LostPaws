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
Last completed product task: GitHub Issue #9 — MVP Profile & Data Model Review
Issue #11 status: NOT ACCEPTED — targeted Persona QA exposed a Partner profile persistence blocker
Active implementation task: fix Issue #11 persistence blocker before any next slice

### Completed

- Issue #8 Admin QA foundation and targeted hosted regression coverage implemented.
- Persona QA pgTAP harness defect corrected after CI exposed an invalid permission assertion.
- Issue #9 MVP profile/data-model review completed; the current schema was sufficient for that foundation.
- RAVE Vendor remains a Partner-architecture classification/channel rather than a duplicate organization model.
- Issue #11 implementation added marketplace loading/error handling, Partner profile publication visibility in Offer Manager, and expanded the Partner -> Guardian golden-path regression.
- GitHub Actions CI run #111 passed.
- Persona QA database layer passed 84/84 pgTAP tests.

### Active blocker

Persona QA run #39 failed in `e2e/phase-2-offer-redemption.spec.ts` during the Partner profile persistence check:

Partner Admin saves a private draft with a non-empty `Public description`, receives the success message, reloads `/business`, and the saved description reloads as an empty string.

This violates Issue #11 acceptance. Do not weaken the regression assertion to make CI green. Fix the root cause.

Reference: `docs/prompts/ISSUE-11-PARTNER-PROFILE-PERSISTENCE-BLOCKER.md`.

### Current strategic findings

- `pets.created_by` must become provenance-only before shelter-created Passport transfer/handoff work because creator-based ongoing access is not appropriate for future lifecycle ownership.
- Co-guardian support requires a primary-controller/acceptance policy before UI expansion.
- Adoption verification should be implemented later as a secure send/respond/token/audit vertical slice.
- Shelter onboarding should gain duplicate/claim protections comparable to Partner organization onboarding.
- Broad full-site Issue #5 QA is intentionally deferred until major MVP vertical slices connect.

### Required completion report from coding agent

Before finishing the active blocker task, update this file with:

- **Issue / task:**
- **Agent:**
- **Branch:**
- **Final remote SHA:**
- **Root cause:**
- **What changed:**
- **Tests run + results:**
- **CI / hosted QA status:**
- **Open defects:**
- **Product-owner decisions needed:**
- **Deferred items:**
- **Recommended next action:**

### Human action required

None until the Partner profile persistence blocker is fixed and Persona QA is green.
