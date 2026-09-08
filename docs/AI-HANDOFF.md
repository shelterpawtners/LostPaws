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

Updated by: Codex
Branch: `qa/guardian-registration-personas`
Last completed product task: GitHub Issue #11 — Partner Marketplace golden-path stabilization
Final implementation SHA: `d0914d950d4ceb40e261f0af5c672aa0186eed09`
Active implementation task: none

### Completed

- Issue #8 Admin QA foundation and targeted hosted regression coverage implemented.
- Persona QA pgTAP harness defect corrected after CI exposed an invalid permission assertion.
- Issue #9 MVP profile/data-model review completed; the current schema was sufficient for that foundation.
- RAVE Vendor remains a Partner-architecture classification/channel rather than a duplicate organization model.
- Issue #11 stabilizes the existing Partner Marketplace vertical slice without a migration or a new model.
- The public marketplace now has an explicit loading/error state, so a slow public-offer RPC does not briefly present a valid offer as unavailable.
- Partner Offer Manager now shows the organization’s public-profile state, making the companion profile visibility clear while offers are managed.
- The targeted Playwright golden-path regression now covers Partner public-profile draft/save/reload/publish, offer creation/publish, Guardian detail reload/claim, and the existing redemption path.

### Current strategic findings

- `pets.created_by` must become provenance-only before shelter-created Passport transfer/handoff work because creator-based ongoing access is not appropriate for future lifecycle ownership.
- Co-guardian support requires a primary-controller/acceptance policy before UI expansion.
- Adoption verification should be implemented later as a secure send/respond/token/audit vertical slice.
- Shelter onboarding should gain duplicate/claim protections comparable to Partner organization onboarding.
- Broad full-site Issue #5 QA is intentionally deferred until major MVP vertical slices connect.

### Completion report

- **Issue / task:** GitHub Issue #11 — stabilize Partner Marketplace golden path + targeted regression.
- **Agent:** Codex.
- **Branch:** `qa/guardian-registration-personas`.
- **Final remote SHA:** `d0914d950d4ceb40e261f0af5c672aa0186eed09` (implementation commit; this documentation-only handoff update follows it).
- **What changed:** Added a marketplace loading/error state; surfaced the selected Partner organization’s public-profile state in Offer Manager; expanded the existing offer/redemption Playwright journey to exercise profile draft/save/reload/publish and Guardian offer-detail reload before the established claim/redeem flow.
- **Migrations / RLS:** None. Issue #11 reuses the accepted Checkpoint 2/3/4 schema, RLS policies, public RPCs, and opaque redemption model.
- **Tests run + results:** `npm run check` PASS; `npm run build` PASS; `git diff --check` PASS. The targeted Playwright suite was attempted but is blocked in this Work environment because the required Chromium executable is unavailable; the standard Playwright install did not complete. `supabase test db` is blocked because the Supabase CLI/Docker runtime is not installed here. No application test failure was observed.
- **CI / hosted QA status:** Not run from this Work environment. The existing branch/CI configuration remains the authoritative place to run browser and database checks with its provisioned QA dependencies.
- **Open defects:** No code defect found in this slice. Environment blockers remain for local browser and database execution only.
- **Product-owner decisions needed:** None for Issue #11. The existing Checkpoint 4 redemption UX review remains the current product gate.
- **Deferred items:** Broad Issue #5 audit, Phase 2 Checkpoint 5, Phase 3, adoption verification, and full Passport transfer/handoff remain out of scope.
- **Recommended next action:** After the required Checkpoint 4 redemption UX review, implement the approved small private Guardian profile-lite vertical slice; do not begin Checkpoint 5 without explicit authorization.
