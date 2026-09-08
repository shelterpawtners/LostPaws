# AI Handoff

STATUS: BLOCKED
CURRENT_PHASE: Phase 2 — Partner Marketplace MVP
CURRENT_CHECKPOINT: Phase 2 Checkpoint 5 — Verified Savings + Customer Attribution
NEXT_CHECKPOINT: Retry deployment/Hosted QA for frontend fix `11b23ef4` when the Vercel build-rate limit clears; if green, mark the CP5 pre-decision slice COMPLETE, keep verified-savings rules owner-gated, and continue only safely separable provider-agnostic Phase 2 Checkpoint 6 work
OWNER_DECISION_REQUIRED: NO
SAFE_TO_CONTINUE: YES

This file is the shared baton between ChatGPT, Codex, Copilot, GitHub Actions, and human review.

## Rules

- GitHub Issues define task scope; code/commits contain implementation; this file records current state.
- Never store secrets/private customer data here.
- Phase 2 remainder is authorized under `docs/AUTONOMOUS-EXECUTION-POLICY.md`.
- Do not expose customer-facing `verified savings` until its evidence/calculation standard is explicitly approved.
- Phase 3, production/DNS, paid infrastructure, material RED decisions, auto-merge, destructive migrations, and destructive production actions remain owner-gated.
- Follow `docs/AI-COST-AND-TESTING-GOVERNANCE.md`: GitHub Actions is the deterministic control plane; do not spend AI credits for polling or routine green validation.

## Current handoff

Updated by: ChatGPT automation execution
Branch: `qa/guardian-registration-personas`
Active PR: #2 (`<!-- ai-active-build-pr -->`)
Active Issue: #13
Concurrency migration SHA: `882c958b804c4466b47bfe108364c45427186d1a`
Concurrency test fix SHA: `c2003df199d57d96660fd842e817a07314fd5879`
Hosted Admin QA selector fix SHA: `4614e3cef2f67378cb8cf827b364abda2a9b84e5`
Admin QA reload-state fix SHA: `11b23ef41861f0d2e26272ed588019ddaa217f94`

### Checkpoint 5 implemented scope

- Reuse `retail_amount_minor`, `paid_amount_minor`, and `currency_code`; no duplicate money model.
- Non-customer-facing `candidate_savings_minor` uses exact integer minor-unit math with zero floor.
- Reference value kind/source and evidence metadata preserve provenance.
- `shelterpawtners_relationship` derives `first_known` / `returning` only from prior non-demo confirmed Guardian + Partner redemptions.
- Partner customer attestation is independent (`new_to_business` / `existing_customer` / `unknown`); ShelterPawtners history does not imply business-newness.
- Redemption confirmation accepts optional attribution without breaking existing callers.
- Corrections are append-only delta events; reversal audit history remains compatible.
- Partner redemption UI optionally captures reference/list value, amount actually paid, currency, reference type/source, evidence reference, and Partner customer attestation while explicitly stating the values are not verified savings.
- Targeted Playwright verifies the Partner UI values persist and produce exact candidate savings.

### Concurrency/data-integrity hardening

CP5 prevents duplicate `first_known` attribution by serializing Guardian + Partner relationship classification with a transaction-scoped advisory lock and enforcing a unique partial index for confirmed non-demo `first_known` redemptions. Migration replay fails loudly rather than silently rewriting pre-existing history, and existing secure-token/RLS controls remain intact.

### Deterministic evidence and current defect cluster

- Persona QA #62 on concurrency-hardened head `c2003df199d57d96660fd842e817a07314fd5879`: PASS (local reset/seed, all pgTAP/RLS including 16 CP5 assertions, Guardian/persona/access/redemption Playwright).
- CI #211: PASS on the concurrency-hardened slice.
- CI #214 on pre-fix acceptance head `a98b5ac387892629e92c633390b99ebc21e0f3d2`: PASS.
- Hosted QA #112: FAILED in Admin QA because a generic `getByRole("status")` selector matched two legitimate live regions. Vercel exact-SHA readiness passed first. This was a GREEN test defect; `4614e3c` scoped banner assertions to the `ADMIN QA MODE` status region without weakening authorization/session coverage.
- CI #217: PASS after the selector correction.
- Hosted QA #116 on READY head `36ed211c3cf13f93221b04358a1cc140a11146a5`: FAILED later in the same Admin QA persistence test after `page.goto("/marketplace")` because no Admin QA banner appeared after the hard navigation. Six hosted tests passed; two later serial tests did not run.
- #116 classification: GREEN application state-restoration defect. `/marketplace` is wrapped in `Page` and renders `QaBanner`, but a hard navigation recreates JS module state while the acting Supabase session remains in `sessionStorage`. `QaBanner` previously checked only the in-memory acting client on mount and could miss the restored session.
- Fix `11b23ef4`: `QaBanner` restores the tab-scoped acting session itself when the in-memory acting client is absent, still listens for `sp-qa-changed`, and guards async state updates after unmount. This preserves the explicit cross-route/reload QA-session contract rather than weakening the regression test.
- CI #219 for `11b23ef4`: PASS.
- Hosted acceptance for `11b23ef4` is not yet possible because no deployment containing that frontend change has become available.

### Cost-control state

- No Copilot/Copilot review was invoked for either defect or fix.
- Diagnosis used native GitHub Actions logs and direct repository inspection.
- Persona QA remains change-aware/deliberate; no schema/RLS change was made in this defect cluster.

### Deliberate RED boundary

No effective/adjusted customer-facing savings total or lifetime verified total is introduced. Original captured values stay immutable and corrections stay append-only. The owner must approve what evidence/calculation qualifies as customer-facing `verified savings`, including corrections, refunds, reversals, bundles, free items, evidence strength, and Partner-entered values.

This RED rule does not block provider-agnostic Checkpoint 6 engineering that is independent of verified-savings totals or charitable-money provider selection. Issue #14 is prepared as the bounded CP6 contract, but implementation must not advance until the CP5 pre-decision acceptance evidence is green and recorded COMPLETE.

### Vercel blockers/state

Direct ChatGPT Vercel access remains unauthorized/incomplete: `list_teams` returns exactly `{"teams": []}`, so team `jims-projects-acec6bcb` and project `lost-paws` cannot be enumerated through the connector. This remains an OAuth/account-scope blocker.

GitHub's Vercel commit status for frontend fix `11b23ef41861f0d2e26272ed588019ddaa217f94` is `failure`, with target `https://vercel.com/jims-projects-acec6bcb?upgradeToPro=build-rate-limit`. This is an external Vercel build-rate-limit condition. Do not upgrade or alter paid infrastructure autonomously. Hosted QA #116 safely used the previously Ready frontend-impacting deployment `4de911d8884866772fdb5e8eb3c022de7b9e4541`, but that deployment predates `11b23ef4` and cannot establish acceptance for the application fix.

The narrow safe next action is to retry/check deployment and Hosted QA after the build-rate limit clears. If it clears without a paid-plan decision, no owner action is required. Choosing a paid Vercel upgrade remains RED and must not be inferred.

### Human action required

None unless immediate acceptance requires a paid Vercel plan change. The current blocker may clear on its own, so no paid-infrastructure decision is requested at this time. Verified-savings rules remain an owner decision only after the CP5 pre-decision engineering slice is accepted.
