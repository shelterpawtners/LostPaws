# Adoption Verification Support Runbook

Status: MVP support guidance for Issue #56

## Scope

Use this runbook for Guardian adoption-confirmation requests, shelter responder links, verification status and related support questions.

## Product boundary

Adoption verification confirms a limited adoption fact. It does not automatically establish shelter-account administration, unrestricted Pet Passport access, medical authority or a new ownership model.

## Safe troubleshooting

1. Identify the relevant verification request by protected internal reference.
2. Confirm current status and timestamps.
3. Confirm the shelter contact destination supplied for the request when authorized to view it.
4. Determine whether the issue concerns delivery, link validity, responder action, evidence/document handling or Guardian status display.
5. Preserve the existing 30-day verification-link policy and reminder behavior unless repository policy is explicitly changed.

Do not copy raw verification tokens into support messages or GitHub. Never expose uploaded adoption papers or private notes in public engineering records.

## External responder

A shelter responder may verify/decline through the approved external flow without first creating a ShelterPawtners account. That responder interaction should not silently create organization-admin authority.

If a responder later wants an organization account, route them through the normal Shelter/Rescue onboarding/claim process rather than treating the verification link as proof of admin ownership.

## Guardian communication

Show truthful states such as submitted, pending, verified, declined or unable-to-verify according to implemented product behavior. Do not tell a Guardian that a pet is officially/legally owned or medically verified merely because an adoption fact was confirmed.

## Escalate

Human review is required when:

- shelter and Guardian dispute the adoption fact;
- responder identity/authority is materially questioned;
- uploaded documents appear to expose unrelated private information;
- duplicate/conflicting verification requests could overwrite history;
- a request would require changing guardianship/ownership records;
- suspicious or abusive verification activity is detected.

## Engineering handoff

For reproducible technical defects, use the sanitized engineering-handoff contract. Include request status/release/route and safe reproduction steps, but exclude email addresses, raw tokens, documents and private pet history.
