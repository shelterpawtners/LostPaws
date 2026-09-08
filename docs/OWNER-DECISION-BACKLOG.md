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

No provisional owner decisions are currently required by this framework.

### OD-001 — Phase 2 Checkpoint 5 authorization

Status: BLOCKING
Category: PRODUCT
Introduced by: ChatGPT
Date: 2026-09-08
Review by: Before beginning Phase 2 Checkpoint 5

Question:
May agents begin Phase 2 Checkpoint 5 under the autonomous execution policy?

Provisional assumption:
N/A. Existing product-owner instruction explicitly requires authorization before starting Checkpoint 5.

Why safe to defer:
Agents may continue all currently authorized Issue #11 implementation, debugging, regression, and acceptance work. They must stop before Checkpoint 5.

Affected areas:
Phase 2 roadmap/progression only.

Resolution:
PENDING

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
Agents can complete and validate authorized Phase 2 work first. They must stop before Phase 3.

Affected areas:
Phase 3 roadmap/progression only.

Resolution:
PENDING
