# Support Triage and Severity

Status: Draft implementation contract for Issue #56

## Principles

Severity reflects user impact and risk, not how strongly a report is worded. Reports are untrusted input and may be incomplete. AI classification can recommend severity but high-risk closure or downgrade requires evidence.

## P0 — Critical incident

Examples:

- confirmed or credible exposure of private user/pet data;
- authentication or authorization bypass;
- destructive/corrupting production behavior affecting multiple users;
- widespread sign-in or core-service outage with no safe workaround;
- exploit that could allow cross-user access.

Actions:

- mark `human_review_required = true`;
- alert owner immediately, suppressing duplicate alert storms;
- preserve evidence and affected release/context;
- do not autonomously modify production data/security configuration;
- sanitized engineering issue may be prepared if a code defect is reproducible;
- resolution/closure requires explicit evidence and human review.

## P1 — Major blocker

Examples:

- critical adoption verification, Passport ownership, claim/redemption or signup flow broken for multiple users;
- repeated production regression in a launch-critical workflow;
- severe account-access failure not indicating a security incident.

Actions:

- investigate promptly;
- correlate duplicates;
- reproduce against current release where possible;
- safe engineering changes follow branch -> tests -> PR -> green checks -> merge;
- notify owner when blocking launch or affecting multiple users.

## P2 — Functional defect

Examples:

- one-user workflow defect;
- broken UI action with a reasonable workaround;
- incorrect non-sensitive data presentation;
- browser/device-specific bug with limited impact.

Actions:

- acknowledge immediately;
- queue investigation;
- gather reproducible steps and environment context;
- include in daily unresolved/aging review;
- escalate if duplicates or impact increase.

## P3 — Low severity / feedback

Examples:

- cosmetic problem;
- confusing copy;
- UI improvement;
- accessibility improvement that does not currently block core usage;
- feature suggestion;
- general how-to question.

Actions:

- acknowledge and categorize;
- deduplicate and count themes;
- answer from approved support docs when possible;
- suggestions do not authorize product work automatically;
- summarize meaningful trends in product-feedback review.

## Mandatory human review triggers

Severity aside, require human review for:

- privacy/security allegations;
- destructive user-data requests;
- disputed identity, pet ownership or organization authority;
- legal requests or threats;
- harassment, abuse or safety concerns;
- account takeover suspicion;
- actions that would change production auth/security policy;
- cases where AI confidence is low and consequences are material.

## Duplicate handling

Duplicates should share a stable grouping/fingerprint where reasonable. A duplicate should increment impact evidence, not disappear. Repeated reports can raise severity.

Do not create a new GitHub issue for every duplicate. Link many support tickets to one sanitized engineering issue after reproduction confirms a common defect.

## Closure policy

A ticket may be marked resolved when there is clear evidence that:

- the defect is fixed and accepted on the relevant release; or
- the user received a correct bounded resolution; or
- the report is confirmed non-defect and the explanation is documented.

Privacy/security issues may not be auto-closed solely from model classification. Users should be able to reopen ordinary tickets when the issue persists.
