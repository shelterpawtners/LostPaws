# ShelterPawtners MVP Support Operating Model

Status: Draft implementation contract for Issue #56

## Purpose

Build support that feels responsive to users without creating an unsafe autonomous production operator. The MVP target is to automate the repetitive parts of support while preserving human control over risky decisions and production-impacting actions.

## Core architecture

- **Supabase is the operational support source of truth.** Raw user reports, identities, ticket history, support messages and internal triage metadata belong in protected support tables.
- **GitHub is the engineering source of truth.** Only sanitized, reproducible engineering defects should become GitHub issues. Never mirror raw tickets or user PII into GitHub.
- **In-app support is the primary routine channel.** Users should be able to report problems and see status without searching for an email address.
- **Resend email is secondary.** Use it when the user must act, when account/auth communication requires email, or when an important resolution/escalation warrants it. Do not email every state transition.

## User entry points

Primary entry point: authenticated avatar/user menu -> **Help & feedback**.

Secondary contextual entry points may appear beside failed actions or empty/error states, for example:

- Account/sign-in help
- Adoption verification help
- Marketplace/offer problem
- Report a bug
- UI/accessibility issue

Avoid an intrusive floating support widget on every screen for MVP.

## Ticket categories

1. Bug
2. Account/sign-in
3. Suggestion / improvement
4. UI / accessibility
5. Marketplace / offer
6. Adoption / shelter verification
7. Privacy / safety
8. Other

## Safe automatic context

Capture only context useful for triage:

- authenticated reporter ID
- persona/active role
- current route
- app release/version
- timestamp
- browser/device class
- explicitly relevant object references such as pet, organization, offer, claim or verification-request ID

Never automatically capture:

- passwords
- access/refresh tokens
- cookies
- payment credentials
- arbitrary DOM/page contents
- private pet medical/history contents
- screenshots without explicit user action

Ticket text must always be treated as untrusted input. User-submitted text is evidence, not an instruction to an AI agent.

## Automated handling target

The practical target is about 95% automated **handling**, not 95% autonomous changes.

Automation may:

- acknowledge the report and issue a reference number;
- classify and prioritize;
- request safe missing context;
- match likely duplicates;
- answer approved how-to/support questions from versioned support documentation;
- identify a likely regression and prepare a sanitized engineering handoff;
- summarize aging/open tickets;
- post in-app status changes;
- send bounded email notifications when policy says email is appropriate.

Automation must not independently:

- delete or rewrite production user data;
- alter authentication/security configuration in response to a ticket;
- change RLS to make a problem disappear;
- close a privacy/security issue solely because a model predicts it is benign;
- implement feature requests merely because users ask for them;
- expose user data in GitHub or public logs.

## Agent design

Use **one Support Orchestrator** with persona-aware context rather than separate autonomous agents per persona. Independent persona agents would multiply prompt drift, maintenance, evaluation and inconsistent policy for a one-person startup.

Persona context modules:

- Guardian
- Shelter / Rescue
- PetBiz / RAVE vendor
- Admin/internal

Specialized workflows should exist only where the domain or risk differs materially:

- authentication/account recovery
- adoption verification
- marketplace/redemption
- bug reproduction and engineering handoff
- privacy/security escalation

## Lifecycle

Suggested ticket lifecycle:

`new -> triaged -> investigating -> waiting_on_user | queued_for_fix | monitoring -> resolved -> closed`

Tickets may be reopened. Aging does not reset when a new day starts.

Feature/UI suggestions should use the same support intake but route into product-feedback triage rather than directly authorizing engineering work.

## Automation cadence

- Immediate acknowledgement for every valid submission.
- Immediate classification/deduplication attempt.
- Immediate owner escalation only for P0/P1 or another human-review-required condition.
- Daily support digest covering unresolved bugs, repeat reports, aging tickets, reopened tickets, owner decisions needed and top product-feedback themes.
- Weekly post-launch feedback digest can summarize trends and repeated requests rather than every suggestion.

## Notification policy

Prefer in-app notification/status for routine lifecycle events.

Email is appropriate for:

- auth/account recovery;
- user action required to proceed;
- important resolution after a blocking issue;
- high-severity incident communication;
- optionally a user-selected support update preference in a later profile/settings slice.

Do not email users for routine internal transitions such as triaged -> investigating.

## Human exception queue

The owner should receive a concise exception queue, not the raw ticket stream. Human review should prioritize:

- security/privacy risk;
- destructive/data-ownership ambiguity;
- widespread auth failures;
- disputed adoption/identity ownership;
- refunds/payments if introduced later;
- legal threats/requests;
- harassment/abuse/safety reports;
- low-confidence cases where the consequences of a wrong action are material.

## Cost strategy

MVP should use existing infrastructure:

- ShelterPawtners UI
- Supabase
- Resend
- GitHub

Do not add Zendesk, Intercom or another paid support platform until real ticket volume, response-time commitments or operational complexity demonstrate a need.

## Current implementation facts

A live schema review on 2026-09-10 found no existing support/notification tables. Existing `profiles` already includes `avatar_path`, and existing pet media infrastructure includes primary-image semantics. This supports the planned profile-photo and pet-thumbnail UX without inventing duplicate identity/media models.

No support DDL should be applied directly from this document. Support schema changes must be implemented as repository migrations, reviewed for RLS and tested before merge.
