# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Hosted shared QA hardening / Issue #6
NEXT_CHECKPOINT: Continue remaining Phase 2 work from the approved roadmap after hosted QA acceptance
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES

This file is the shared baton between ChatGPT, Codex, Copilot, GitHub Actions, and human review.

## Rules

- The agent that completes a meaningful task must update this file before declaring the task complete.
- Keep this file current; do not append an unbounded transcript.
- GitHub Issues define the task contract. Pull requests/commits contain implementation. This file summarizes the latest handoff state.
- Never store passwords, tokens, service-role keys, private customer data, or other secrets here.
- If a material product/legal/privacy/security/financial decision is unresolved, record it as `OPEN DECISION` and reference `docs/DECISION-LOG.md` and/or `docs/OWNER-DECISION-BACKLOG.md`.
- Jim explicitly authorized autonomous completion of the remainder of Phase 2 on 2026-09-08 under `docs/AUTONOMOUS-EXECUTION-POLICY.md`.
- Phase 3 remains explicitly unauthorized. Do not begin Phase 3 without a new owner authorization.
- Do not auto-merge pull requests. Production/DNS, paid infrastructure, legal/privacy/security posture, and real financial behavior remain RED gates.

## Current handoff

Updated by: ChatGPT acceptance / build orchestration
Branch: `qa/guardian-registration-personas`
Last completed product task: GitHub Issue #11 — Partner Marketplace golden path + Partner profile persistence blocker
Issue #11 status: ACCEPTED and CLOSED
Acceptance SHA: `c774634bb7cf38e1cf8042183141be58f64c2da0`
Acceptance evidence: Persona QA run #51 (`34210680064`) passed.

### Completed

- Issue / task: #11 Partner Marketplace golden path and Partner profile persistence blocker.
- Agent: GitHub Copilot + ChatGPT acceptance.
- Branch: `qa/guardian-registration-personas`.
- Root-cause implementation SHA: `9ca86f3a46321988009a07dbf9ba6a9885e5ffa8`.
- Accepted branch SHA: `c774634bb7cf38e1cf8042183141be58f64c2da0`.
- Root cause: Partner profile editor allowed editing before async profile load completed, so late-loading server data could overwrite freshly typed values before save; organization selection also needed deterministic persistence across reload.
- What changed:
  - Partner organization selection is deterministic and persisted per signed-in user.
  - Partner profile loading is cancellation-safe and blocks edits until loaded.
  - Save is guarded while profile loading is active.
  - Playwright asserts same organization plus `Public description` and `Public email` survive reload.
  - Publish-profile selector uses exact matching without weakening persistence coverage.
  - Persona QA no longer uses deprecated Node-20-based `supabase/setup-cli@v1`; pinned Supabase CLI is invoked through npm.
- Tests run + results:
  - Lightweight CI on accepted branch SHA: PASS.
  - Persona QA run #51: PASS.
  - pgTAP: 84/84 PASS.
  - Playwright: 24/24 PASS.
- Open defects:
  - None blocking Issue #11 acceptance.

### Current authorized task

Issue #6 — make hosted shared QA the normal acceptance environment.

Target operating model:

1. GitHub remains the source of truth/control plane.
2. Lightweight CI remains automatic on active PR work.
3. Disposable Supabase + pgTAP remains a deterministic lower-level database/RLS regression gate, not Jim's normal QA workflow.
4. Existing shared `shelterpawtners-dev` Supabase is the persistent non-production QA backend.
5. Existing Vercel hosted QA is the normal browser acceptance surface.
6. Hosted smoke/golden-path checks should become the primary automated acceptance layer where configuration supports them.
7. GitHub event-driven orchestration handles failed acceptance runs and can delegate safe fixes to Copilot.
8. ChatGPT's hourly LostPaws Build Watch is the supervisory safety net and may accept/advance already-authorized Phase 2 tasks.
9. No production DNS/Supabase changes and no paid infrastructure without owner approval.
10. No auto-merge.

### Product-owner authorization

- OD-001 / remainder of Phase 2: APPROVED 2026-09-08.
- Agents may continue checkpoint-to-checkpoint through remaining Phase 2 work without routine approval.
- Phase 3: BLOCKED pending explicit owner authorization.

### Current strategic findings

- `pets.created_by` must become provenance-only before shelter-created Passport transfer/handoff work because creator-based ongoing access is not appropriate for future lifecycle ownership.
- Co-guardian support requires a primary-controller/acceptance policy before UI expansion.
- Adoption verification should be implemented later as a secure send/respond/token/audit vertical slice.
- Shelter onboarding should gain duplicate/claim protections comparable to Partner organization onboarding.
- Broad full-site Issue #5 QA remains staged behind the major MVP vertical slices rather than blocking active delivery.

### Human action required

None for the remainder of Phase 2 unless an agent reaches a RED decision, hard technical blocker, paid-infrastructure requirement, production/DNS boundary, or Phase 3 boundary.
