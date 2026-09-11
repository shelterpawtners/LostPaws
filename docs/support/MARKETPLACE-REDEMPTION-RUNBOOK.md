# Marketplace and Redemption Support Runbook

Status: MVP support guidance for Issue #56

## Scope

Use this runbook for offer discovery, eligibility, claim/redemption behavior, provider terms and RAVE Marketplace questions.

## Source-of-truth principles

- Provider-published offer terms, eligibility and validity determine the customer-facing offer contract for that version.
- Public/external-resource listings and partner-published offers may behave differently; support should not describe them as identical.
- Claims/redemptions must preserve the existing immutable/version-aware architecture and authorization boundaries.
- Do not invent customer-facing verified-savings, donation or settlement rules while OD-003/OD-004 remain unresolved.

## Safe troubleshooting

1. Record affected release, route and persona.
2. Identify the relevant offer/claim/redemption by protected reference when necessary.
3. Confirm whether the listing is external/public-resource or partner-published.
4. Compare the user's observed behavior with the applicable offer version and eligibility state.
5. Check whether the offer is published, active, expired, quantity-limited or otherwise unavailable according to implemented rules.
6. Distinguish display/discovery problems from claim/redemption transaction problems.

Do not change offer history or historical published terms merely to make a disputed claim appear valid.

## Provider-controlled terms

PetBiz/RAVE providers control their supported offer terms and fulfillment unless ShelterPawtners explicitly states otherwise. Support may explain the platform state but should not promise inventory, guaranteed acceptance, sales, official festival placement or provider performance.

## Savings and impact language

Do not calculate or promise unresolved "verified savings," donation allocations or settlement outcomes. Use only implemented, approved fields and labels. Escalate policy questions touching OD-003/OD-004 rather than improvising an answer.

## Suspected defects

Examples that may justify engineering handoff:

- valid published offer missing from intended Marketplace audience;
- incorrect eligibility/source label;
- claim/redeem action fails despite valid preconditions;
- duplicate redemption or broken idempotency;
- one user can access another user's private claim/redemption data;
- stale offer version displayed after a material term change.

Use sanitized GitHub handoff; raw customer identity/evidence stays in the protected support system.

## Escalate

Human review is required for suspected fraud, disputed financial obligations, privacy exposure, destructive transaction correction, partner-account authority disputes, or any proposed remediation that changes production transaction history/security controls.
