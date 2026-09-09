# Owner Decision Backlog

## Purpose

Collect reversible product-owner preferences and true blocking decisions so coding agents can keep moving without interrupting Jim for every small choice.

Use this file with `docs/AUTONOMOUS-EXECUTION-POLICY.md`.

## Rules

- `PROVISIONAL` = a reversible YELLOW decision. Agent chooses the safest reasonable assumption, records it here, and continues.
- `BLOCKING` = a RED decision or explicit phase/checkpoint authorization gate. Agent completes safely separable work, records the blocker, updates `docs/AI-HANDOFF.md`, and stops at the narrowest boundary.
- Never record secrets, private customer data, credentials, or production keys here.
- When Jim resolves an item, move the durable result into the appropriate authoritative product/security/architecture document and/or `docs/DECISION-LOG.md`, then mark this item `RESOLVED`.
- Prefer batching multiple non-blocking decisions for one product-owner review session.

## Entry template

```markdown
### OD-XXX — <short title>

Status: PROVISIONAL | BLOCKING | RESOLVED
Category: UX | PRODUCT | SECURITY | PRIVACY | LEGAL | FINANCIAL | PRODUCTION | OTHER
Introduced by: <agent>
Date: YYYY-MM-DD
Review by: <milestone/checkpoint if applicable>

Question:
<What ultimately needs product-owner preference/approval?>

Provisional assumption:
<What the agent used to keep moving, or N/A if BLOCKING?>

Why safe to defer:
<Why this is reversible / isolated, or why it must block?>

Affected areas:
<files/features/tests>

Resolution:
<PENDING or final decision + reference>
```

## Current decisions

### OD-001 — Phase 2 Checkpoint 5 authorization

Status: RESOLVED
Category: PRODUCT
Introduced by: ChatGPT
Date: 2026-09-08
Review by: Before beginning Phase 2 Checkpoint 5

Question:
May agents begin Phase 2 Checkpoint 5 under the autonomous execution policy?

Provisional assumption:
N/A. Existing product-owner instruction required authorization before starting Checkpoint 5.

Why safe to defer:
The gate remained blocking until explicit product-owner authorization.

Affected areas:
Phase 2 roadmap/progression only.

Resolution:
APPROVED 2026-09-08. Jim explicitly authorized autonomous completion of the remainder of Phase 2 under `docs/AUTONOMOUS-EXECUTION-POLICY.md`. Agents may advance checkpoint-to-checkpoint through the remaining Phase 2 work without seeking routine approval, but all RED gates, production restrictions, no-auto-merge policy, and the Phase 3 gate remain in force.

### OD-002 — Phase 3 authorization

Status: BLOCKING
Category: PRODUCT
Introduced by: ChatGPT
Date: 2026-09-08
Review by: Before beginning Phase 3

Question:
May agents begin Phase 3 under the autonomous execution policy?

Provisional assumption:
N/A. Existing product-owner instruction explicitly requires authorization before starting Phase 3.

Why safe to defer:
Agents can complete and validate all authorized Phase 2 work first. They must stop before Phase 3.

Affected areas:
Phase 3 roadmap/progression only.

Resolution:
PENDING

### OD-003 — Customer-facing verified-savings standard

Status: BLOCKING
Category: FINANCIAL
Introduced by: ChatGPT architecture acceptance review
Date: 2026-09-08
Review by: Before enabling any customer-facing `verified savings` total or verified lifetime-savings reporting

Question:
What evidence and calculation rules qualify a redemption value as customer-facing `verified savings`, including reference-value sources, Partner-entered values, receipts/order evidence, bundles/free items, refunds, corrections, reversals, and lifetime-total treatment?

Provisional assumption:
N/A for customer-facing verified totals. The system may preserve raw/reference/paid amounts, provenance, candidate savings, relationship classification, and append-only correction history, but must not label those values verified.

Why safe to defer:
The provider-/rule-independent CP5 foundation and later Phase 2 work can proceed without making a financial claim to Guardians. This blocks only verified-savings labeling/calculation behavior that depends on the approved standard.

Affected areas:
Guardian/Partner savings labels and totals, reporting, dashboards, exports, analytics, and any derived verified-savings read model.

Resolution:
PENDING

### OD-004 — Charitable giving provider / production money movement

Status: BLOCKING
Category: FINANCIAL
Introduced by: ChatGPT architecture acceptance review
Date: 2026-09-08
Review by: Before provider-dependent charitable money movement or production settlement integration in Phase 2 Checkpoint 6

Question:
Which giving/settlement provider and production flow should ShelterPawtners use for charitable contributions after current provider research and review?

Provisional assumption:
N/A for production money movement. CP6 may implement provider-agnostic participation/reputation states, contribution commitments, accrual semantics, externally verified settled-contribution evidence, audit history, and permission-safe reporting using existing Phase 1 foundations.

Why safe to defer:
The provider-agnostic domain model can be made truthful and testable without collecting/routing production funds. Provider-specific APIs, settlement, receipts, webhooks, batching, and real money movement remain isolated behind this gate.

Affected areas:
Giving-provider integration, donation settlement, receipts, reconciliation, production payment/fund movement, and provider-specific webhooks.

Resolution:
PENDING
