# AI Handoff

STATUS: IN_PROGRESS
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: Finish Checkpoint 5 pre-decision engineering and acceptance evidence, then stop at the verified-savings RED rule gate if customer-facing verified totals would be enabled
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
- Phase 2 Checkpoint 5 is authorized. Implement the provider-/rule-independent engineering scope autonomously.
- Do not expose customer-facing values as `verified savings` until the calculation/evidence rule is explicitly approved; that remains a RED financial/product decision.
- Phase 3 remains explicitly unauthorized. Do not begin Phase 3 without a new owner authorization.
- Do not auto-merge pull requests. Production/DNS, paid infrastructure, legal/privacy/security posture, and real financial behavior remain RED gates.

## Current handoff

Updated by: ChatGPT sleep sprint
Branch: `qa/guardian-registration-personas`
Active PR: #2 (`<!-- ai-active-build-pr -->`)
Active Issue: #13

### Accepted prior work

- Issue #11 Partner Marketplace golden path: ACCEPTED and CLOSED.
- Issue #6 Hosted shared QA hardening: COMPLETE and accepted by green hosted QA.
- Phase 2 Checkpoints 1-4 remain accepted/complete per `docs/CURRENT-WORK.md`.

### Checkpoint 5 progress in this pass

Implementation commits before this handoff:

- `a64dcc24b4f771a4c472947ff8425bd7a917a465` — adds CP5 savings/attribution database foundation.
- `016fc2fb4a6a4abae2640f3ba05cfa542b352d79` — adds CP5 pgTAP coverage.
- `765808866d4e10a1b65a0bbd589d86ef92b364bd` / `496b581e61c94d99071a1355ffb3cdeb8f9fd747` — adds exact bigint candidate-savings helper and unit tests.
- `fa48bbb204886c6f3894cdf5e76e556d59a69be6` — restores heavy Persona QA to deliberate/manual execution after confirming that PR path triggers would cause repeated heavy runs on this long-lived PR.

Implemented behavior:

- preserve existing `retail_amount_minor`, `paid_amount_minor`, and `currency_code` instead of creating a duplicate money model;
- add non-customer-facing `candidate_savings_minor` generated with exact integer minor-unit math and a zero floor;
- add reference-value kind/source plus evidence reference/metadata provenance;
- add `shelterpawtners_relationship` classification (`first_known` / `returning`) derived only from prior non-demo confirmed redemptions for the same Guardian + Partner organization;
- add independent Partner customer attestation (`new_to_business` / `existing_customer` / `unknown`) without inferring business-newness from ShelterPawtners history;
- extend redemption confirmation with optional attribution while preserving existing callers via a defaulted third JSON argument;
- add append-only redemption correction delta events and retain existing reversal audit history;
- protect `redemption_events` from update/delete mutation with the existing append-only trigger function;
- add unit + pgTAP coverage for exact math, provenance, first-known/returning classification, separate Partner attestation, non-negative candidate savings, append-only adjustments, and reversal compatibility.

### Validation state

- CI run #183 for `496b581e61c94d99071a1355ffb3cdeb8f9fd747`: PASS.
- Hosted QA run #81 for the same SHA: PASS (acceptance-gated lightweight path; Checkpoint remains IN_PROGRESS).
- Persona QA run #54 (`34235351085`) was started natively to validate migration replay, pgTAP, and persona/redemption regression. It was still running during this handoff, with local Supabase startup in progress.
- A prior automatic Persona QA experiment was intentionally reverted because it caused repeated heavy executions on subsequent commits in this long-lived PR. Persona QA remains `workflow_dispatch` only.

### Vercel environment blocker

The ChatGPT Vercel connector is installed, but `list_teams` returns an empty team list. Direct protected-deployment access to `https://lost-paws-one.vercel.app/` also fails while creating a share URL with `403 Forbidden`.

This is an external Vercel OAuth/account-scope blocker, not an application or repository defect. The connector cannot currently verify team `jims-projects-acec6bcb` or project `lost-paws`. Reauthorization/reconnection to the Vercel account that owns that team/project is still required. Do not create replacement Vercel infrastructure.

### Remaining Checkpoint 5 work

- inspect Persona QA #54 result; fix any GREEN migration/test/application defects without weakening RLS/tests;
- add targeted Playwright coverage for attribution capture only if it remains provider/rule-independent and does not expose customer-facing verified totals;
- evaluate whether adjusted candidate totals need a read model/helper over append-only correction events before CP5 acceptance;
- update the active progress/decision docs for durable CP5 implementation choices;
- when implementation and deterministic validation are complete, move to `READY_FOR_ACCEPTANCE` and run the acceptance-boundary hosted gate;
- stop narrowly if a rule is required for what evidence/calculation qualifies as customer-facing `verified savings`.

### Human action required

None for GitHub/Checkpoint 5 engineering right now.

Vercel connector access remains externally blocked until its OAuth/account connection is reauthorized to the owning team. Continue independent GitHub-safe CP5 work in the meantime.
