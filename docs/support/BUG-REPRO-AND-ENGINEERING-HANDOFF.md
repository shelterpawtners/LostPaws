# Bug Reproduction and Engineering Handoff

Status: MVP support-to-GitHub contract for Issue #56

## Goal

Move reproducible product defects from support into engineering without leaking customer data or allowing support text to become operational instructions.

## Before creating a GitHub issue

Confirm as much as is safely practical:

- the behavior is a product defect rather than a how-to question;
- affected release/version and route are known;
- expected and observed behavior can be stated without PII;
- reproduction is repeatable or multiple independent reports provide credible evidence;
- severity is assigned using `TRIAGE-SEVERITY.md`;
- known duplicates are grouped;
- secrets, email addresses, names, private pet/Passport data, auth tokens and raw screenshots are excluded.

A single report can still justify urgent engineering investigation when impact is P0/P1. Reproduction certainty is not required before escalating a credible security/privacy concern.

## Sanitized GitHub issue fields

An engineering handoff should contain only what engineering needs:

- concise defect title;
- affected release/SHA when known;
- persona and app route;
- expected behavior;
- observed behavior;
- sanitized reproduction steps;
- severity and impact summary;
- approximate duplicate/report count;
- relevant non-sensitive technical identifiers only when necessary;
- acceptance criteria for a safe fix;
- tests/regressions that must remain intact.

Do not copy raw ticket messages into GitHub.

## Internal linkage

The support system may retain an internal link from the support ticket/duplicate group to the sanitized GitHub issue or PR. GitHub does not become the owner of reporter identity or private support history.

## Engineering workflow

`triaged defect -> sanitized GitHub issue -> fresh branch -> targeted tests -> PR -> required green gates -> merge -> release evidence -> support resolution`

No direct production mutation is authorized by the support ticket.

## Resolution evidence

Before telling a reporter that a code defect is fixed, support should have evidence of:

- merged fix or explicitly accepted configuration change;
- relevant tests/gates passing;
- the release/deployment containing the fix when deployment state matters;
- any required user action or workaround.

If code is merged but deployment is externally blocked, communicate that distinction rather than saying the live problem is fixed.

## Reopen policy

Reopen or create a linked regression when:

- the same behavior occurs on a release that should contain the fix;
- prior reproduction steps still fail;
- a materially related regression is discovered;
- the original resolution addressed symptoms but not the root cause.

Do not erase the original history; retain the relationship for trend analysis.
