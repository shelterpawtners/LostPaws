# Human Escalation

Status: MVP escalation policy for Issue #56

## Immediate escalation triggers

Escalate promptly to the owner/human reviewer when a report involves:

- suspected security or privacy exposure;
- widespread authentication outage or account takeover risk;
- destructive/corrupting data behavior;
- disputed identity, adoption authority, guardianship or ownership where an automated action could harm a person or pet record;
- legal demand, subpoena, law-enforcement request or credible threat of legal action;
- harassment, abuse, animal-safety concern or credible threat;
- financial movement/refund/settlement when introduced;
- any P0 or P1 where the proposed remediation changes production security/data controls;
- material uncertainty where a wrong action would be difficult to reverse.

## Escalation packet

Prepare a concise exception packet rather than forwarding the raw ticket firehose:

- ticket/reference ID;
- category and severity;
- affected persona/release/route;
- concise sanitized summary;
- what has been verified versus alleged;
- duplicate count or scope evidence;
- immediate safe containment already taken, if any;
- proposed next safe action;
- exact decision required from the human;
- links to protected internal evidence, not copied PII.

## Safe containment

Automation may perform only pre-authorized, reversible and non-destructive containment. Examples include suppressing duplicate alerts, pausing an automated response, or withholding an unsafe suggested action. It must not improvise production data edits, security-policy changes or account ownership transfers.

## P0/P1 communication

Avoid notification storms. Group related duplicates into one incident/escalation thread where possible. Provide meaningful updates when status materially changes rather than repeating every internal event.

## Decision recording

Material human decisions should be recorded in the appropriate protected support/audit record and, when they affect product engineering, in sanitized repository documentation or decision logs. Never place customer PII in public repository records.

## Closure

A human-escalated issue may return to routine automated handling only after the risky decision/action is resolved and the remaining work fits the normal support policy. Security/privacy incidents should not be auto-closed solely because activity stops or a model becomes confident the issue is benign.
