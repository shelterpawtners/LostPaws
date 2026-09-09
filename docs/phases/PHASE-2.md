# ShelterPawtners Phase 2 Work Prompt

## Partner Marketplace MVP - Final Approved Specification

Status: approved next-phase specification; inactive until Phase 2 is explicitly activated.

Execute Phase 2: Partner Marketplace MVP for the ShelterPawtners `LostPaws` repository.

Repository:
`shelterpawtners/LostPaws`

Development Supabase project:
`shelterpawtners-dev`

Phase 1 must be complete or substantially complete before Phase 2 begins.

Read and follow:

- `AGENTS.md`
- `.agents/skills/shelterpawtners/SKILL.md`
- `README.md`
- all existing files under `/docs`
- `docs/PHASE-1-EXECUTION.md`
- `docs/DECISION-LOG.md`
- current migrations/schema
- current automated tests

Do not redesign Phase 1 foundations without a material reason. If a schema change is needed, use repository migrations and document the decision.

Work continuously through the full approved Phase 2 scope. Do not stop after planning. Plan briefly, execute, test, visually review, fix defects, update documentation, and commit the completed work.

Do not copy implementation code from the old `Core` or `RaveShelter` repositories.

---

# PHASE 2 OBJECTIVE

Deliver a real Partner Marketplace MVP that allows pet businesses and other Partner organizations to:

1. create an account,
2. create or securely claim/join the correct organization,
3. create a public Partner profile,
4. complete the Partner profile,
5. add one or more locations/service areas,
6. create multiple simultaneous or future offers,
7. publish eligible offers,
8. receive claims,
9. validate utilization/redemption with a simple mobile-first workflow,
10. track customer attribution and verified savings,
11. track Partner donation commitments, accrued impact, and settled contributions without conflating them,
12. build reputation through real ShelterPawtners participation,
13. appear in public marketplace/search experiences,
14. support native sharing/referrals,
15. be moderated by ShelterPawtners administrators,
16. export useful Partner transaction/reporting data.

The Partner flow is a key MVP launch path. It must be usable by real businesses immediately after Phase 2 approval.

---

# 1. PARTNER SIGNUP AND ORGANIZATION DISCOVERY

Anyone may create a user account and begin the Pet Business/Partner onboarding flow.

Before creating a new organization, search existing ShelterPawtners organizations for likely matches using available internal data such as:

- business/public name
- legal/DBA name where available
- website/domain
- phone
- address
- city/state
- parent organization
- known locations

If a likely organization already exists, do not casually create a duplicate.

Provide options such as:

- request membership/access,
- ask an existing organization administrator for an invite,
- request ownership/claim review,
- create a new child/franchise organization only where appropriate,
- continue creating a distinct organization when the business is genuinely separate.

Do not allow a random user to take control of an existing business record merely because they know the business name.

Use the Phase 1 CRM-style organization hierarchy and relationship architecture.

Support realistic chain/franchise scenarios:

### Corporate chain

A parent organization may own/manage multiple locations or child organizations.

### Independent franchise

A franchise may be a separate organization linked to a parent brand using an extensible relationship such as `franchise_of` or equivalent.

### Multi-location independent business

One organization may manage multiple locations without creating separate organizations unless operational/legal separation makes that useful.

Admin must have tools to review, merge/deprecate duplicates, and preserve historical references safely.

---

# 2. PARTNER ONBOARDING FLOW

Target flow:

Public Partner landing
→ Create account / sign in
→ Select "I represent a Pet Business"
→ Search/create/claim organization
→ Business profile
→ Categories
→ Locations/service area
→ Social/contact details
→ Profile completion
→ Create first offer
→ Preview
→ Publish
→ Partner dashboard

A business should not need manual ShelterPawtners approval merely to create an account or basic public profile, subject to moderation/security rules.

---

# 3. PARTNER PROFILE DATA

Capture enough useful information during onboarding to avoid having to re-contact the Partner for basic marketplace/reporting needs.

Required or strongly encouraged fields should include, as appropriate:

- public/display business name
- legal name or DBA when relevant
- organization type
- short public description
- longer "about" description if useful
- website
- public email
- public phone
- primary private business contact
- private operational/redemption contact if different
- categories
- species served
- business model: physical / online / mobile / service-area / national
- primary location or service area
- additional locations
- booking/reservation URL if applicable
- ecommerce/order URL if applicable
- logo
- social links
- hours where useful
- redemption/support instructions
- parent/brand/franchise relationship where relevant

Keep private operational contacts separate from public profile fields.

Use expandable structures rather than creating brittle one-off columns for every future profile attribute.

---

# 4. PUBLIC PROFILE TIMING

A business may become publicly visible once minimum safe/public profile requirements are met.

Minimum public profile should include at least:

- business name
- category
- city/state or clear service area
- public description
- at least one public contact path such as website, public email, public phone, booking link, or social link

Basic profiles are public but receive lower prominence than Partners actively supporting the mission.

Avoid insulting or punitive language.

---

# 5. PARTNER PARTICIPATION / REPUTATION STATES

Use positive progression.

## Basic Partner

Public profile exists but participation is limited.

## Participating Partner

Profile is substantially complete and has at least one qualifying published offer.

## Redemption Verified

At least one legitimate, non-demo ShelterPawtners redemption has been confirmed.

This indicates a real ShelterPawtners customer successfully utilized an offer.

It must NOT imply licensing, government registration, insurance, professional quality, or other verification that ShelterPawtners has not actually performed.

## Shelter Impact Partner

This replaces the earlier "Shelter Preferred" terminology.

A Shelter Impact Partner should represent stronger demonstrated mission participation.

Eligibility requires at minimum:

1. internal ShelterPawtners review/approval,
2. at least one legitimate non-demo confirmed redemption/customer,
3. verified evidence of an actual settled shelter-support contribution/donation,
4. good-standing offer/Partner behavior.

Do not award Shelter Impact Partner status based only on a pledge or accrued donation intent.

If Phase 4 giving-provider settlement is not yet live, Phase 2 may support an administrator-verified external contribution record/reference so a Partner who donates directly to an eligible shelter can be recognized, but the record must clearly distinguish:

- commitment,
- accrued amount,
- externally verified settled contribution,
- provider-confirmed settled donation.

Preserve the evidence/reference and audit history.

---

# 6. PARTNER DONATION / IMPACT DISPLAY

Partner profiles and dashboards must be designed to showcase mission impact without overstating it.

Track and display separately:

### Donation/Contribution Commitment

Example:
"$1.00 committed per utilized ShelterPawtners redemption."

### Accrued Contribution

Amount calculated from qualifying redemptions but not yet verified as paid.

### Settled / Verified Contribution

Actual contribution confirmed as completed through:

- approved giving provider, or
- administrator-verified external evidence.

### Lifetime Settled Contributions

Total verified historical contributions.

Do not label accrued or pledged values as "donated."

Where real data exists, public Partner profiles may show meaningful verified mission metrics such as:

- verified ShelterPawtners customers/redemptions
- savings delivered
- verified shelter contributions
- lifetime verified shelter contributions

Only show data the Partner is permitted to make public and that ShelterPawtners can substantiate.

Never fabricate values.

---

# 7. PARTNER RANKING / DISCOVERY PRIORITY

Default ranking logic should favor meaningful mission participation.

Initial conceptual ordering:

1. Shelter Impact Partner
2. Redemption Verified
3. Participating Partner
4. Basic Partner

Then consider:

- user relevance
- category
- location/service area
- offer eligibility
- offer quality/availability
- profile completeness
- freshness

Paid promotion must not silently override mission labels.

Sponsored placement, if added later, must be clearly labeled.

Do not implement manipulative or opaque ranking.

---

# 8. EXCLUSIVE SHELTER-PET OFFERS

An exclusive shelter-pet offer is a benefit made specifically available to eligible ShelterPawtners users or verified shelter pets that provides additional value beyond the Partner's ordinary publicly available promotion.

A Partner may also publish offers available to all pets.

Support both.

Examples:

### Public/general pet offer

"10% off all grooming."

### Shelter-pet enhanced benefit

"Verified shelter pets receive 20% off grooming."

or

"All customers receive 10% off, but verified shelter pets receive an additional free nail trim."

or

"$2.00 is contributed to a verified shelter for each utilized verified-shelter-pet offer."

The platform should clearly show eligibility and the additional shelter-pet value.

A Partner may have general-pet and shelter-pet offers simultaneously.

---

# 9. MULTIPLE OFFERS PER PARTNER

Organizations must support multiple offers simultaneously.

Examples:

- current offer
- scheduled future offer
- seasonal offer
- limited inventory offer
- all-pet offer
- shelter-pet enhanced offer
- new-customer offer
- event offer
- RAVE Shelter campaign offer
- later LostPaws campaign offer

Build on Phase 1 `offers` and `offer_versions`.

Partners must be able to:

- create
- edit
- preview
- schedule
- publish
- pause
- archive
- duplicate
- expire

according to permissions.

Historical versions must remain intact.

---

# 10. OFFER TYPES / MECHANICS

Support a flexible offer-mechanic model.

At minimum support or architect cleanly for:

- percentage discount
- fixed-dollar discount
- free item
- free service
- BOGO
- bundle
- adoption starter package
- first-N claimant bonus
- limited inventory
- limited time
- new-customer only
- returning-customer benefit
- all-pet offer
- verified shelter-pet exclusive
- deeper shelter-pet tier on top of general pet offer
- shelter-specific offer
- location-specific offer
- online offer
- reservation-required offer
- pickup-required offer
- Partner-funded contribution per utilized redemption
- percentage-of-sale contribution commitment
- sponsored benefit
- custom benefit

Keep offer mechanics extensible.

---

# 11. OFFER CLAIM EXPIRATION

Default claim expiration:
30 days.

Partners must be able to configure the claim expiration while drafting the offer.

Provide sensible options such as:

- same day
- 3 days
- 7 days
- 14 days
- 30 days default
- custom duration
- until offer expiration where appropriate

Make expiration behavior clear to the Guardian before claim confirmation.

For limited inventory, a valid claim may reserve inventory until the claim expires/cancels/utilizes according to the offer rules.

Expired reserved inventory should normally return to availability unless the Partner has configured a different approved rule.

Use transaction-safe logic to avoid oversubscription.

---

# 12. RESERVATION EXPIRATION

Reservation expiration is Partner-configurable.

Default:
7 days where no better offer-specific value is provided.

Allow service-specific or pickup-specific timing.

Do not build a full calendar scheduling platform in Phase 2.

Store external appointment/booking references where useful.

---

# 13. OFFER INVENTORY

Inventory limits are optional.

Default:
unlimited.

Partners may define:

- total claim limit
- total utilization limit
- quantity available
- first-N bonus limit
- per-user limit
- per-pet limit where appropriate

Use server-side concurrency-safe validation.

---

# 14. FIRST-N / LIMITED SUPPLY OFFERS

Support concepts such as:

"First 10 claimants receive an additional BOGO benefit."

"First 25 utilized redemptions receive a free adoption starter item."

Track:

- claim limit
- utilization limit
- quantity claimed
- quantity utilized
- remaining availability
- exhausted state
- expiration

Clearly communicate whether the limit is based on claims or completed utilization.

---

# 15. SHARE / REFERRAL UNLOCKS

Build native ShelterPawtners sharing foundations.

Sharing should be available:

- from the public offer,
- after claim,
- after confirmed redemption.

Track:

- share event
- sender
- recipient/invite target where permitted
- offer
- campaign
- acceptance
- conversion
- resulting claim
- resulting redemption

Support deterministic unlock concepts such as:

"Invite 5 friends on ShelterPawtners and unlock an additional benefit."

Do not implement random lottery/sweepstakes mechanics in Phase 2.

Treat lottery/sweepstakes as a low-priority future nice-to-have requiring separate legal review.

Do not require public social-media posting.

---

# 16. SHELTER IMPACT PARTNER REVIEW

Create an administrative review workflow for Shelter Impact Partner status.

Admin must be able to:

- see eligibility evidence,
- see first qualifying redemption,
- see verified contribution evidence,
- approve,
- decline,
- request additional information,
- suspend/remove status,
- record reason,
- record internal notes,
- preserve audit history.

Do not allow self-assignment.

Impact Partner is an organization-level mission status.

Specific offers may separately be featured/recommended based on offer quality.

---

# 17. FEATURED / SPONSORED VISIBILITY

Prepare architecture for:

- Featured
- Sponsored
- Shelter Impact Partner

These are distinct.

### Shelter Impact Partner

Mission/impact status.

### Featured

Editorial/promotional placement that may or may not be paid.

### Sponsored

Paid visibility.

If paid placement is later enabled, label it clearly.

Do not charge for placement in Phase 2.

---

# 18. PUBLIC PARTNER DIRECTORY

Build the first real public Partner directory.

Support useful browsing/filtering such as:

- category
- city
- state
- ZIP/postal area
- online/local/national
- species
- benefit type
- all-pet vs shelter-pet eligibility
- Participating
- Redemption Verified
- Shelter Impact Partner
- active offers

Do not require advanced geospatial search yet.

Search results should prioritize relevant mission participation and user needs.

---

# 19. PUBLIC PARTNER PROFILE

Create durable public Partner profile pages.

Show relevant public details:

- business name
- logo
- description
- categories
- species served
- website
- booking/order link
- public phone/email where supplied
- Instagram
- Facebook
- TikTok
- YouTube
- LinkedIn
- other extensible social links
- locations/service area
- business hours where useful
- participation/reputation status
- active offers
- all-pet vs shelter-pet benefits
- verified savings/impact metrics where appropriate
- verified settled shelter contributions where appropriate

All social links should be clickable and user-controlled by the Partner.

---

# 20. PUBLIC OFFER PAGE

Each public offer needs a durable route.

Display:

- Partner
- offer title
- benefit
- general-pet vs shelter-pet eligibility
- enhanced shelter-pet benefit if applicable
- locations
- timing
- claim expiration
- remaining inventory if appropriate
- claim CTA
- terms
- Shelter Impact Partner status where applicable
- Featured/Sponsored status if applicable
- share CTA

Use current offer version.

---

# 21. EXTERNAL / NATIONAL PROGRAM REFERENCE DATA

Retain the ability to seed researched national/public adoption or pet-support programs in the database for reference, comparison, reporting, future curation, and admin use.

Do NOT assume these records must be publicly published.

Default external/reference program records to internal/reference or hidden state unless an administrator explicitly publishes them.

Do not imply partnership.

Support classification such as:

- shelterpawtners_partner
- public_program
- affiliate
- sponsored
- community_submitted
- demo
- internal_reference

Store where available:

- source name
- source URL
- date last checked
- review due date
- eligibility source
- official Partner yes/no
- publication status
- hidden reason
- admin notes
- categories/tags

Admin must be able to publish/hide/archive later.

Partner, Shelter, and Admin reporting/export should be able to use relevant reference classifications where useful without making the data public.

---

# 22. DEMO PARTNER DATA

Create clearly labeled demo Partner scenarios.

Include representative demo organizations for major Partner categories such as:

- veterinary
- grooming
- training
- boarding/daycare
- walking/sitting
- pet food
- pet supplies
- technology
- community Partner
- RAVE Shelter/vendor-style example

Create a flagship `ShelterPawtners Demo Partner` demonstrating:

- parent/child or multi-location organization
- multiple offers
- all-pet offer
- enhanced shelter-pet offer
- scheduled offer
- first-N offer
- contribution-per-redemption commitment
- accrued contribution
- verified settled contribution
- Redemption Verified
- Shelter Impact Partner
- claims
- redemptions
- savings metrics
- customer-attribution metrics

All demo records must remain clearly marked and excluded from production metrics/notifications/payments.

---

# 23. OFFER → CLAIM → UTILIZED / REDEMPTION

Implement distinct lifecycle stages.

### Offer

Available opportunity.

### Claim

Guardian reserves/intends to use the offer.

### Redemption

Partner/authorized workflow confirms actual utilization.

Do not count a claim as a completed redemption.

Show clear states:

- viewed
- claimed
- reserved
- utilized
- expired
- cancelled
- no-show where applicable
- reversed where applicable

---

# 24. CLAIM EXPERIENCE

Mobile-first.

A claim must record the relevant offer version.

Support:

- immediate claim
- reservation/reference details
- product pickup intent
- service appointment reference
- expiration
- cancellation

Do not require payment.

---

# 25. SIMPLE BUSINESS REDEMPTION CONFIRMATION

Business confirmation must be fast.

Preferred flow:

Guardian presents claim QR/code
→ Partner scans or enters code
→ Partner sees concise confirmation screen
→ Partner enters/confirms required transaction details
→ one clear "Confirm utilization" action
→ redemption recorded

Avoid multiple unnecessary screens.

Provide fallback manual code entry if camera scanning is unavailable.

No special scanner hardware required.

---

# 26. QR / CODE VALIDATION

Support mobile browser camera scanning where practical.

Do not place sensitive PII in QR values.

Use signed/opaque short-lived or appropriately scoped tokens.

Support:

- Guardian claim QR/code
- Partner scan/entry
- Partner offer/location QR where useful

Apply server-side validation.

---

# 27. RESERVATION / PICKUP VALIDATION

Service example:

claim
→ optional booking/reference
→ arrive
→ Partner scans/enters Guardian code
→ confirm utilization

Product example:

claim
→ reserve pickup
→ arrive
→ validate code
→ confirm utilization

Do not build a full scheduling platform.

---

# 28. REDEMPTION FINANCIAL DATA

Required when applicable:

- normal retail/list value
- amount actually paid

System calculates:

- discount/savings amount

Optional:

- quantity
- tax
- tip
- fees

Support currency, defaulting to USD for current MVP.

Frontend uses conventional U.S. accounting formatting.

Database uses integer minor units.

If entered values conflict with calculated values, preserve enough data for audit/review rather than silently changing history.

---

# 29. CUSTOMER ATTRIBUTION

Automate what ShelterPawtners can actually know.

From ShelterPawtners history:

### First known ShelterPawtners customer relationship

No earlier confirmed non-demo redemption with this Guardian and Partner organization.

### Returning ShelterPawtners customer

Earlier confirmed non-demo redemption exists.

This is NOT automatically the same as "new to the business."

If the Partner knows whether the person was already a customer outside ShelterPawtners, allow optional attestation:

- new to business
- existing business customer
- unknown

Preserve both concepts separately:

- ShelterPawtners relationship status
- business-customer attestation

Do not claim customer acquisition beyond available evidence.

---

# 30. GUARDIAN REDEMPTION DISPUTES

Guardian may dispute an incorrect redemption.

Disputes must require a factual reason and preserve evidence.

Support facts such as:

- claim ID
- redemption ID
- Partner/location
- timestamp
- offer version
- entered retail value
- amount paid
- discount
- Partner confirmer
- optional receipt/reference/evidence
- Guardian explanation
- Partner response
- admin resolution

Do not delete the original event.

If correction is needed, use reversal/adjustment records consistent with Phase 1 economic-ledger rules.

---

# 31. PARTNER REVERSALS

Partner may request/reverse an erroneous utilization when authorized.

Do not delete the original redemption.

Create:

- reversal
- refund
- adjustment
  or equivalent append-only correction event.

Record:

- reason
- actor
- timestamp
- related redemption
- resulting financial impact

---

# 32. PARTNER DASHBOARD MVP

Build a useful Partner dashboard showing real data:

- profile completion
- participation status
- Redemption Verified state
- Shelter Impact Partner state
- active offers
- scheduled offers
- drafts
- claims
- utilized/redemptions
- first-known ShelterPawtners customers
- returning ShelterPawtners customers
- optional Partner-attested new-business customers
- attributed transaction value
- savings delivered
- contribution commitment
- accrued contribution
- verified settled contribution
- lifetime verified settled contribution
- locations
- profile improvement calls to action

Never fabricate metrics.

Use demo data only in clearly labeled demo environments/accounts.

---

# 33. PARTNER MANAGEMENT

Authorized Partner members should be able to manage:

- organization profile
- categories
- locations
- social links
- booking/order links
- offers
- claims
- redemptions
- team/members where permitted
- public preview
- contribution commitments
- evidence/reference for externally settled shelter contributions where supported

Respect Phase 1 organization hierarchy and permissions.

---

# 34. ADMIN MARKETPLACE CONTROLS

Admin controls must support:

- organizations
- duplicate/claim review
- parent/child/franchise relationships
- profile/public state
- participation state
- categories/tags
- locations
- offers
- external/reference programs
- publication/hidden reasons
- Featured
- Sponsored
- Redemption Verified review
- Shelter Impact Partner review
- contribution evidence
- disputes
- reversals
- demo records
- abuse/flags where practical

Admin should always be able to see why a record is not public or why a status was granted/removed.

Use reason codes plus notes.

---

# 35. ADMIN TAXONOMY CONTROLS

Admins must be able to manage categories/tags without database migrations.

Support:

- add
- rename
- activate/deactivate
- reorder
- parent category
- merge/deprecate carefully

Preserve historical associations.

---

# 36. REPORTING / EXPORT FOUNDATION

Partner accounts should be able to export useful data for business/accounting/reporting purposes.

At minimum plan/build authorized exports for:

- offers
- claims
- redemptions
- transaction values
- discounts/savings delivered
- customer relationship classifications
- contribution commitments
- accrued contributions
- verified settled contributions

Use U.S. accounting formatting in human-facing reports and consistent machine-readable numeric fields in CSV/export.

Shelter reporting is expanded in later phases, but Phase 2 structures must not block cross-persona reporting.

External/reference program data may remain internal but should be reportable/exportable where authorized.

---

# 37. SECURITY / RLS

Test at minimum:

- Partner A cannot edit Partner B
- Partner A cannot see Partner B private claim/redemption details
- public sees only public organization/offer fields
- Partner cannot access Guardian private Passport data
- Partner cannot self-assign Redemption Verified
- Partner cannot self-assign Shelter Impact Partner
- contribution commitments cannot masquerade as settled donations
- settled contribution evidence/status cannot be forged by ordinary Partner users
- offer limits cannot be bypassed client-side
- finalized financial events cannot be silently edited
- demo data cannot trigger real notifications/payments
- organization hierarchy does not accidentally grant sibling access
- claiming an existing organization requires appropriate authorization/review

Use server-side validation for privileged actions.

---

# 38. RESPONSIVE / MOBILE

Critical Partner flows must work well on a phone:

- signup
- organization search/claim/create
- profile completion
- location
- social links
- offer creation
- claim display
- QR scan/code entry
- redemption confirmation
- public directory
- public Partner page
- offer page
- basic dashboard

Test camera permissions and non-camera fallback.

---

# 39. ACCESSIBILITY

Maintain Phase 1 accessibility standards.

Ensure:

- keyboard navigation
- visible focus
- accessible forms
- accessible status/badge labels
- good contrast
- errors associated with fields
- QR fallback
- status not conveyed by color alone

---

# 40. DOCUMENTATION

Create/update:

- `docs/PHASE-2-PARTNER-MARKETPLACE.md`
- `docs/PARTNER-ORGANIZATION-CLAIMING.md`
- `docs/PARTNER-OFFER-MODEL.md`
- `docs/REDEMPTION-AND-VERIFICATION.md`
- `docs/PARTNER-IMPACT-STATUS.md`
- `docs/PARTNER-REPORTING-EXPORTS.md`
- `docs/DECISION-LOG.md`
- `docs/PRODUCT-REQUIREMENTS.md`
- `docs/ROADMAP.md`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY-AND-PRIVACY.md`

Document clearly:

- Basic Partner
- Participating Partner
- Redemption Verified
- Shelter Impact Partner
- Featured
- Sponsored
- contribution commitment
- accrued contribution
- verified settled contribution

---

# 41. TESTING

Automate critical paths including:

- Partner signup
- organization search
- duplicate prevention
- organization claim request
- multi-location/chain/franchise relationships
- organization creation
- public profile
- profile completion
- social links
- multiple offers
- all-pet offer
- shelter-pet enhanced offer
- scheduled offers
- offer versioning
- 30-day default claim expiration
- configurable expiration
- inventory limits
- first-N mechanics
- public directory
- public offer page
- claim
- reservation
- expiration/cancellation
- redemption confirmation
- mobile QR/code fallback
- automatic first-known vs returning ShelterPawtners customer classification
- optional new-to-business attestation
- financial calculation
- dispute
- reversal
- first successful redemption → Redemption Verified
- contribution commitment/accrual
- external settled contribution evidence
- Shelter Impact Partner permissions/approval
- demo exclusion
- reporting exports
- Partner-to-Partner isolation

Use Playwright for critical E2E workflows.

---

# 42. PHASE 2 NON-GOALS

Do not implement:

- random lottery/sweepstakes
- Stripe Connect
- commercial payment settlement
- live Every.org production giving
- full donation-provider automation
- full Digital Pet Passport
- full Shelter Report Card
- full shelter transfer workflow
- advanced annual tax reporting
- full grant administration
- deep Meta/Instagram API integration
- hardware integrations
- full production launch

Phase 2 may record/verify external settled shelter contribution evidence for Impact Partner recognition, but it must not pretend the ShelterPawtners LLC is itself the charitable recipient.

---

# 43. PHASE 2 DEFINITION OF DONE

Do not declare Phase 2 complete until all applicable gates are satisfied:

- Partner signup works
- organization search/duplicate prevention works
- organization claim/request access workflow works
- chain/multi-location/franchise scenarios are supported
- public Partner profile works
- richer Partner profile data is captured
- social links work
- Basic/Participating/Redemption Verified/Shelter Impact Partner architecture works
- profile completion works
- multiple offers work
- all-pet and shelter-pet enhanced offers work
- scheduled/future offers work
- offer versioning remains intact
- default 30-day claim expiration works
- Partner-configurable claim expiration works
- limited/first-N mechanics work safely
- Partner directory works
- public Partner page works
- public offer page works
- Offer → Claim → Redemption works
- business redemption confirmation is simple/mobile-friendly
- reservation/pickup reference flow works
- required financial values are captured
- savings calculation is correct
- historical customer classification is automated from ShelterPawtners data
- business-customer attestation remains separate
- Guardian dispute workflow works
- reversal/adjustment workflow works
- Redemption Verified cannot be self-assigned
- contribution commitment/accrual/settlement are distinct
- verified settled Partner contributions can be represented safely
- Shelter Impact Partner requires admin review + real redemption + verified settled contribution
- Partner dashboard shows mission/economic metrics
- admin moderation/status/reason controls work
- external/reference programs can remain hidden/internal and be exported/reported
- demo Partner data exists and is excluded from production metrics
- native share/referral event foundations work
- Partner exports work
- RLS/security tests pass
- lint/typecheck/unit/e2e tests pass
- desktop/mobile review completed
- accessibility review completed
- docs and decision log updated
- migrations committed
- final build succeeds
- commit/PR created

---

# 44. WORKING STYLE / CREDIT EFFICIENCY

Do not stop after planning.

Plan briefly and execute the entire approved Phase 2 specification.

Do not ask for human input for routine implementation decisions.

Record ordinary decisions in:
`docs/DECISION-LOG.md`

Request human input only for:

- destructive database operations
- credential requirements
- activation of paid services
- material privacy/security conflict
- legal issue
- major product conflict with this specification

Fix defects found during testing before declaring completion.

---

# 45. COMPLETION REPORT

Provide:

1. final file tree changes
2. migrations
3. database objects created/refactored
4. organization duplicate/claim architecture
5. chain/franchise/multi-location behavior
6. Partner onboarding/profile implementation
7. Partner participation/status behavior
8. offer mechanics implemented
9. claim/redemption workflow
10. QR/code validation approach
11. customer attribution logic
12. contribution commitment/accrual/settlement handling
13. Shelter Impact Partner eligibility/approval behavior
14. reporting/export functionality
15. seeded reference/demo records
16. RLS/security test results
17. unit/e2e test results
18. mobile/browser review
19. accessibility review
20. known limitations
21. external setup still required
22. status against every Phase 2 Definition of Done gate
23. commit/PR details
24. recommended handoff into Phase 3

Do not begin Phase 3 until Phase 2 is approved.
