# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: Complete Checkpoint 5 pre-decision engineering scope, then stop only at the verified-savings RED rule gate if customer-facing verified totals would be enabled
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
- Phase 2 Checkpoint 5 is authorized to begin. Implement the provider-/rule-independent engineering scope autonomously.
- Do not expose customer-facing values as `verified savings` until the calculation/evidence rule is explicitly approved; that remains a RED financial/product decision.
- Phase 3 remains explicitly unauthorized. Do not begin Phase 3 without a new owner authorization.
- Do not auto-merge pull requests. Production/DNS, paid infrastructure, legal/privacy/security posture, and real financial behavior remain RED gates.

## Current handoff

Updated by: ChatGPT orchestration
Branch: `qa/guardian-registration-personas`

### Accepted prior work

- Issue #11 Partner Marketplace golden path: ACCEPTED and CLOSED.
- Issue #6 Hosted shared QA hardening: COMPLETE and accepted by green hosted QA.
- Issue #6 final remote SHA: `e7de111bad77bb3a9c5367ba859cdcda041df973`.
- Hosted QA push run #47 (`34218533561`): PASS.
- Hosted QA PR run #48 (`34218538905`): PASS.
- Feature branch CI run #151 (`34218538966`): PASS.

### Current authorized task

Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution.

Authorized engineering scope before the customer-facing verified-savings rule gate:

- capture normal/list/reference value when applicable;
- capture amount actually paid when applicable;
- preserve currency and integer minor units;
- compute candidate savings without labeling it verified;
- preserve source/evidence/provenance fields needed to determine confidence;
- automatically classify first-known vs returning ShelterPawtners Partner relationship from non-demo confirmed redemptions;
- optional Partner attestation (`new to business` / `existing customer` / `unknown`) stored independently from ShelterPawtners relationship history;
- adjustments/reversals compatible with the append-only accounting model;
- targeted unit/database/RLS/Playwright coverage for math, provenance, classification, and reversals.

Hard boundary inside Checkpoint 5:

- Do not expose candidate/estimated savings as customer-facing `verified savings` until the owner approves the calculation/evidence standard.
- Do not infer `new to business` from ShelterPawtners history alone.
- If implementation reaches the point where a verified-savings rule is required, complete all safely separable work, record the decision as BLOCKING, update this handoff, and stop narrowly.

### Current strategic findings

- `pets.created_by` must become provenance-only before shelter-created Passport transfer/handoff work because creator-based ongoing access is not appropriate for future lifecycle ownership.
- Co-guardian support requires a primary-controller/acceptance policy before UI expansion.
- Adoption verification should be implemented later as a secure send/respond/token/audit vertical slice.
- Shelter onboarding should gain duplicate/claim protections comparable to Partner organization onboarding.
- Broad full-site Issue #5 QA remains staged behind the major MVP vertical slices rather than blocking active delivery.

### Human action required

None right now. Continue Checkpoint 5 pre-decision engineering autonomously. Escalate only if the verified-savings rule gate or another RED decision is reached.
