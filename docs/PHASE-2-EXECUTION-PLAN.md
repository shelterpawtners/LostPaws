# Phase 2 Execution Plan — Partner Marketplace MVP

Status: planning baseline; Phase 2 implementation remains inactive until explicitly activated.

This plan converts `docs/phases/PHASE-2.md` into bounded engineering checkpoints. It does not replace the Phase 2 specification. The specification defines approved behavior; this file defines execution order, ownership, validation, and decision gates.

## Operating model

- GitHub is the source of truth/control plane.
- Codex is the primary engineer.
- Copilot is QA and a bounded engineer.
- ChatGPT Project owns business rules, UX, schemas, phase planning, review, financial rules, and prompts.
- Make is not part of the active architecture.
- Newer explicit user decisions override older planning.
- Implemented repository architecture overrides stale planning notes.
- Material ambiguity is an `OPEN DECISION`.

## Phase 2 activation rule

Do not implement Phase 2 until the user explicitly activates it after reviewing this checkpoint plan.

Once activated, work proceeds checkpoint by checkpoint. Codex should not jump ahead into later checkpoints unless a dependency makes a small supporting change necessary and the reason is documented.

Each checkpoint follows this cycle:

1. Read current canonical docs and relevant schema/tests.
2. Plan the bounded change.
3. Implement in small commits.
4. Run applicable unit, database/RLS, integration, browser, mobile, and accessibility tests.
5. Fix defects before handoff.
6. Copilot performs QA focused on security, regressions, edge cases, and test gaps.
7. ChatGPT reviews product/business-rule compliance.
8. User is asked only for material unresolved business, legal, financial, privacy, security, or critical UX decisions.
9. Accept checkpoint before expanding scope.

---

# Checkpoint 1 — Partner Organization Foundation

## Outcome

A real Partner user can enter the Partner path, discover an existing organization, safely request access/claim review, or create the correct new organization without duplicating or taking over unrelated businesses.

## Codex scope

- Partner account entry and role-aware Partner onboarding foundation.
- Organization search before create.
- Match candidates using available Phase 1 fields such as name, legal/DBA name, website/domain, phone, address, city/state, parent organization, and locations.
- Create distinct flows for:
  - join/request membership,
  - request ownership/claim review,
  - create new organization,
  - create child/franchise organization when appropriate.
- Preserve and use Phase 1 organization hierarchy, memberships, locations, and typed relationships.
- Support:
  - one organization with multiple locations,
  - corporate parent/child structures,
  - independent franchises that share a brand without sharing account control,
  - genuinely separate businesses with similar names.
- Establish bounded admin workflows for duplicate review, claim review, merge/deprecate preparation, reason codes, and audit history.
- Preserve historical references during duplicate/deprecation handling.
- Enforce RLS and server authorization for all ownership/membership actions.

## Must not do

- Do not infer account control from business name alone.
- Do not automatically merge organizations.
- Do not grant sibling/franchise access from a shared brand/parent relationship.
- Do not begin Partner profile, offer, redemption, or giving implementation except minimal scaffolding required for navigation.
- Do not change Phase 1 authorization foundations without a documented material reason.

## Automated validation

At minimum:

- Partner A cannot edit Partner B.
- Partner A cannot claim an existing organization by name alone.
- a claim/access request does not grant access until authorized.
- independent franchise records do not share private membership/control automatically.
- multi-location organization access remains scoped correctly.
- sibling organizations do not inherit access accidentally.
- duplicate/claim admin actions are audited.
- demo identities remain isolated.

## Copilot QA focus

- RLS/authorization bypasses.
- duplicate false-positive/false-negative scenarios.
- franchise and parent/child privilege leakage.
- destructive merge/deprecation risks.
- missing denial-path tests.

## User involvement

Only if implementation exposes a material dispute-evidence or ownership-proof rule that cannot be safely deferred. Routine organization matching heuristics are engineering decisions and should be documented rather than escalated.

## Acceptance gate

Organization discovery/create/claim/access works for independent, multi-location, corporate-chain, and franchise scenarios with passing isolation and audit tests.

---

# Checkpoint 2 — Partner Profile + Public Directory

## Outcome

A Partner can complete a useful public profile and appear in a trustworthy marketplace directory while maintaining clear separation between public and private business data.

## Codex scope

- Partner profile completion UX.
- Public vs private business contact separation.
- Categories/species served/business model.
- locations and service areas.
- local, statewide/regional, nationwide, and online availability.
- booking/order URLs and social links.
- public profile minimum publication requirements.
- monitored self-publication with admin moderation/suspension/removal.
- public Partner directory and Partner profile routes.
- filters for category, geography, online/local/national, species, participation state, and active offers where supported.
- Michigan/Metro Detroit operational emphasis without making Michigan an architectural restriction.

## Must not do

- Do not imply verification, licensing, quality endorsement, or charitable status merely from registration/publication.
- Do not expose private operational contacts.
- Do not implement paid ranking or sponsored placement charging.

## Automated validation

- public sees only public fields.
- private contacts remain inaccessible publicly and cross-organization.
- minimum-publication rules are enforced consistently.
- suspended/hidden profiles disappear from public views while preserving admin/audit history.
- nationwide and online businesses can publish without fake local addresses.

## Copilot QA focus

- privacy leakage.
- publication-state bypass.
- geography edge cases.
- accessibility and mobile onboarding.
- misleading verification language.

## User involvement

Only if UX review reveals a material gap in the approved minimum publication fields or public reputation language.

## Acceptance gate

A Partner can complete and publish a minimum-safe profile, and the public directory/profile pages are mobile-accessible, truthful, and permission-safe.

---

# Checkpoint 3 — Offer Engine

## Outcome

Partners can create, version, schedule, publish, pause, archive, duplicate, expire, and manage multiple simultaneous offers using the Phase 1 offer foundation.

## Codex scope

- offer create/edit/preview/publish/pause/archive/duplicate/expire.
- immutable version history.
- all-pet and shelter-pet-enhanced eligibility.
- location/online eligibility.
- configurable claim expiration with 30-day default.
- optional reservation expiration where applicable.
- optional inventory, per-user/per-pet limits, first-N mechanics, scheduled/future offers, and expiration.
- extensible offer mechanics aligned to Phase 2 spec.
- current-version public offer page.
- truthful classifications: public/general, Partner, community, internal/reference, etc.

## Must not do

- Do not silently rewrite historical offer terms.
- Do not implement commercial payment settlement.
- Do not present an exclusive/sponsored/affiliate benefit without the correct approved classification and disclosure.

## Automated validation

- offer version history survives edits.
- claim/inventory limits cannot be bypassed client-side.
- scheduled and expired offers respect timestamps.
- concurrent limited inventory does not oversubscribe.
- cross-organization offer edits are denied.

## Copilot QA focus

- concurrency and race conditions.
- immutable history.
- eligibility bypass.
- date/time expiration edge cases.
- public classification/claim accuracy.

## User involvement

Normally none. Escalate only if a new offer mechanic changes financial/legal meaning or creates a material customer promise not already approved.

## Acceptance gate

Multiple offers and versioning work safely with accurate eligibility, availability, expiration, and public display.

---

# Checkpoint 4 — Claim + QR/Code Redemption

## Outcome

A Guardian can claim an offer and a Partner can validate utilization in a fast mobile workflow designed around scan/open/confirm, with fallback manual code entry.

## Codex scope

- distinct offer → claim → redemption lifecycle.
- claim records exact offer version.
- opaque QR/code/token generation without sensitive PII.
- Partner mobile scan flow where practical.
- manual code fallback.
- concise validation screen with preloaded Partner/offer/claim context.
- minimal transaction confirmation inputs.
- one clear confirm-utilization action.
- reservation/pickup references where useful.
- expiration/cancellation/no-show/reversal-compatible states.
- Guardian dispute and Partner correction/reversal foundation consistent with append-only Phase 1 economic rules.
- server-side validation.

## UX performance principle

Target experience: scan/open → validate → confirm. Avoid customer search and avoid re-entering context the system already knows.

## Must not do

- Do not put Guardian PII in QR payloads.
- Do not require dedicated scanner hardware.
- Do not count claims as redemptions.
- Do not weaken RLS or authorization to simplify scanning.

## Automated validation

- invalid/expired/revoked/used codes fail safely.
- cross-Partner redemption attempts fail.
- claims do not count as utilized.
- camera-denied/manual-code fallback works.
- replay/double-use is prevented where required.
- dispute/reversal preserves original event history.

## Copilot QA focus

- token security.
- replay attacks.
- mobile camera permissions and fallback.
- duplicate confirmation/race conditions.
- Guardian privacy exposure.

## User involvement

Review the end-user redemption UX after a working browser flow exists. Escalate only material friction or trust issues.

## Acceptance gate

A real Partner employee can confirm a valid redemption on a phone quickly, securely, and with minimal input.

---

# Checkpoint 5 — Verified Savings + Customer Attribution

## Outcome

ShelterPawtners can distinguish utilization from defensible verified savings and distinguish first-known ShelterPawtners relationships from claims about being new to a business.

## Required business-rule review before customer-facing verified totals

This checkpoint has a deliberate decision gate. Before exposing verified savings totals, ChatGPT and the user review the proposed calculation/evidence rules.

## Codex scope before decision gate

- capture normal/list/reference value when applicable.
- capture amount actually paid when applicable.
- preserve currency and integer minor units.
- compute candidate savings without automatically labeling it verified.
- preserve source/evidence/provenance fields needed to determine confidence.
- automatically classify first-known vs returning ShelterPawtners Partner relationship from non-demo confirmed redemptions.
- optional Partner attestation: new to business / existing customer / unknown, stored separately.
- adjustments/reversals compatible with append-only accounting model.

## Proposed review questions

- what baseline sources qualify as defensible normal value;
- whether Partner-entered retail value alone can ever create verified savings;
- when receipt/order/reference evidence is needed;
- how free-service/free-item/bundle offers map to savings;
- how reversals/refunds affect lifetime savings;
- how to label estimated vs verified values in customer-facing UX.

## Must not do

- Do not call candidate/estimated values verified before the rule is approved.
- Do not claim a user is new to a business from ShelterPawtners history alone.

## Automated validation

- exact integer-minor-unit math.
- reversals/adjustments update derived reporting correctly without deleting history.
- first-known vs returning classification excludes demo and non-confirmed claims.
- business-customer attestation stays independent.

## Copilot QA focus

- financial rounding/math.
- misleading labels.
- provenance loss.
- reversal/correction behavior.

## User involvement

**Required:** approve the verified-savings rule before customer-facing verified savings totals are enabled.

## Acceptance gate

Approved savings rules are implemented with auditable provenance and truthful customer labels.

---

# Checkpoint 6 — Partner Impact + Reputation + Giving Foundation

## Outcome

Partners receive positive mission-participation feedback while commitments, accruals, externally verified contributions, and settled contributions remain financially distinct and truthful.

## Required provider research before provider-dependent implementation

Research current providers before choosing production charitable-money movement. Compare at minimum Pledge and Every.org, and include other materially better options discovered at that time. Evaluate API capability, eligible nonprofit/shelter coverage, settlement flow, receipts, webhooks, fees, batching, designated recipients, reconciliation, startup accessibility, and future scale.

Provider selection remains an `OPEN DECISION` until reviewed.

## Codex scope that can proceed provider-agnostically

- Basic Partner → Participating Partner → Redemption Verified → Shelter Impact Partner state model.
- automatic Redemption Verified qualification from legitimate non-demo confirmed redemption, subject to any admin-review rule defined in spec.
- contribution commitments such as fixed amount per qualifying redemption, percentage-based support, recurring commitment, one-time campaign, or designated shelter support as provider-agnostic terms where legally safe.
- accrued contribution calculated separately from settlement.
- administrator-verified external settled contribution evidence/reference where approved.
- Shelter Impact Partner admin review requiring real redemption + verified settled contribution + good standing.
- public/private impact metrics only when substantiated and permissioned.
- audit trail and reason codes.

## Must not do

- Do not call pledges/accruals donations already made.
- Do not route production charitable funds through ShelterPawtners merely because provider integration is unfinished.
- Do not imply ShelterPawtners is itself a charitable recipient.
- Do not award Shelter Impact Partner from a pledge alone.

## Automated validation

- ordinary Partner cannot self-assign Redemption Verified or Shelter Impact Partner.
- accrued values cannot masquerade as settled values.
- external evidence approval is privileged and audited.
- demo data cannot generate real giving/payment activity.

## Copilot QA focus

- financial-state conflation.
- privilege escalation.
- public impact overstatement.
- provider-coupling that would force a rewrite.

## User involvement

**Required:** provider selection before provider-dependent charitable-money movement is implemented. User does not need to be involved in provider-agnostic state modeling.

## Acceptance gate

Reputation and giving foundations are truthful, auditable, positive for Partner participation, and provider-agnostic until a provider is approved.

---

# Checkpoint 7 — Partner Dashboard + Admin + Exports + Phase 2 Hardening

## Outcome

Partners and platform administrators can operate the Phase 2 marketplace without database-console work, and the full phase is validated for security, mobile use, accessibility, reporting, and handoff.

## Codex scope

- Partner dashboard using real non-fabricated data.
- profile completion, participation state, offers, claims, redemptions, customer classifications, transaction values, savings states, contribution states, locations, and improvement CTAs.
- admin marketplace controls for organization claims/duplicates, relationships, publication state, offers, reputation states, contribution evidence, disputes, reversals, demo/reference data, flags, and reason codes.
- taxonomy controls where required by spec.
- authorized exports for offers, claims, redemptions, transaction values, savings, customer classifications, contribution states, and reference classifications where permitted.
- final demo Partner scenarios marked and excluded from real metrics/notifications/payments.
- documentation required by Phase 2 spec.
- final RLS/security, unit, integration, Playwright, mobile, accessibility, build, and migration validation.

## Must not do

- Do not fabricate dashboard metrics.
- Do not expose another organization's private data in exports.
- Do not begin Phase 3.
- Do not deploy to production or change public DNS.

## Copilot QA focus

- authorization across dashboards/admin/exports.
- export privacy and numeric consistency.
- status manipulation.
- regression against Phase 1.
- mobile/accessibility gaps.
- missing Definition-of-Done tests.

## User involvement

Review final Phase 2 UX/business outcome and approve or reject Phase 2 completion. Production launch remains separately gated.

## Acceptance gate

Every applicable Phase 2 Definition-of-Done requirement is demonstrated with evidence; no critical security/financial/UX blocker remains; docs and migrations are current; Phase 3 remains inactive.

---

# Decision/escalation policy

Codex and Copilot should not stop for routine choices. Escalate only when a decision materially affects:

- business promises or marketplace rules;
- legal/charitable/tax meaning;
- financial calculations or customer-facing totals;
- privacy or security boundary;
- organization ownership/control;
- destructive data operations;
- paid service activation or credentials;
- critical UX where reasonable alternatives have materially different business outcomes;
- production deployment/DNS/infrastructure.

Everything else should use a reasonable implementation choice, be tested, and be recorded in the canonical decision log when meaningful.

# Current user-decision schedule

Expected required user involvement during Phase 2:

1. **Phase 2 activation:** approve this checkpoint plan and explicitly start Phase 2.
2. **Checkpoint 4 UX:** review the working scan/open/confirm redemption experience; routine refinements can proceed autonomously.
3. **Checkpoint 5:** approve the verified-savings calculation/evidence standard before verified totals are exposed.
4. **Checkpoint 6:** approve the giving provider before provider-dependent money movement is implemented.
5. **Phase 2 completion:** approve final outcome before Phase 3 begins.

Other questions should be escalated only when the material-decision policy above requires it.
