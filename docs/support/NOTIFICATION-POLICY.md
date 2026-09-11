# Support Notification Policy

Status: MVP notification policy for Issue #56

## Principle

Use the quietest channel that still gets the user or owner the action they need. Routine internal workflow changes should not generate email noise.

## User notifications

### In-app by default

Use in-app ticket/status messaging for:

- acknowledgement and reference number;
- triaged/investigating status;
- requests for ordinary non-sensitive reproduction details;
- routine progress updates;
- resolved/closed status when no immediate external action is required.

### Email when useful

Email may be used for:

- account/authentication recovery;
- an action the user must take outside the current session;
- important resolution of a blocking issue;
- high-severity incident communication;
- time-sensitive adoption/verification support where email is already the approved workflow;
- later user-selected support notification preferences.

Do not email for every internal event such as severity recalculation, duplicate grouping or assignment.

## Owner notifications

Immediate owner alert is reserved for P0/P1 or another human-review-required condition. Group duplicate reports for the same incident to avoid alert storms.

Daily owner digest should include:

- unresolved P0/P1 items;
- new reproducible bugs;
- repeated/duplicate clusters;
- reopened issues;
- aging tickets;
- items waiting on owner decisions;
- top repeated product/UI feedback themes.

After launch, a weekly product-feedback digest may summarize lower-severity trends and suggestions.

## Aging

Unresolved items remain visible across digests. Do not reset their age or treat them as new each day. Escalation thresholds may become stricter as a ticket ages or repeat frequency increases.

## Security/privacy notices

Mandatory account/security/privacy communications remain separate from optional marketing/product notification preferences. Do not allow a general notification opt-out to suppress notices required for account security or legal/privacy obligations.

## Delivery failure

A failed email does not close a ticket. Preserve in-app status and surface delivery failure internally when user action depends on that email.
