# ShelterPawtners Phase 4 Work Prompt

## Impact + Giving + Financial Intelligence

Status: planning document; inactive until Phase 4 is explicitly activated after Phase 3 approval.

Execute Phase 4: Impact + Giving + Financial Intelligence for `shelterpawtners/LostPaws`.

Phases 1–3 must be approved first.

Read all project instructions, docs, schema, migrations, security rules, prior decision logs, and current tests.

Work continuously. Plan briefly, implement, test, review, fix, document, commit.

---

# PHASE 4 OBJECTIVE

Turn ShelterPawtners transaction, pet, shelter, Partner, and adoption data into measurable value for every major persona while creating an accounting-grade foundation for giving, reporting, grant programs, and future nonprofit operations.

Deliver persona-specific dashboards for:

- Guardians
- Partners
- Shelters/rescues
- Platform administrators

Implement giving safely through a provider abstraction rather than treating the ShelterPawtners LLC as a charitable recipient.

---

# 1. GUARDIAN VALUE DASHBOARD

Show real metrics such as:

- total savings
- savings this year
- lifetime savings
- utilized offers
- participating Partners used
- verified-shelter-pet benefits used
- donation intents accrued
- actual settled donations
- preferred verified shelter
- impact stories/events where supported

Example:

"Ruby has saved your family $842.17 through ShelterPawtners."

Only show calculated actual data.

Use U.S. accounting formatting.

---

# 2. PARTNER VALUE DASHBOARD

Show:

- profile completion
- active offers
- claims
- utilized/redemptions
- new customers
- existing customers
- attributed transaction value
- savings delivered to Guardians
- donation commitments accrued
- settled contributions
- Shelter Preferred performance
- referral/share conversion where available

Example:

"ShelterPawtners brought your business 31 new customers representing $4,870.00 in attributed purchases."

Do not overstate attribution certainty.

---

# 3. SHELTER ALUMNI IMPACT DASHBOARD

Roll up outcomes based on pets whose origin shelter is that organization.

Metrics may include:

- pets represented in ShelterPawtners
- adopted pets
- Passport activations
- transfer claim rate
- alumni Guardians active
- alumni redemptions
- total Guardian savings
- Partner benefits used
- donations directed to shelter
- donations directed elsewhere by alumni
- verified shelter-pet benefits
- community-service participation
- aggregate post-adoption engagement

Shelter sees aggregated impact without receiving unrestricted Guardian private information.

Support parent/child organization rollups where authorized.

---

# 4. ADMIN IMPACT DASHBOARD

Show platform-level operational and mission metrics such as:

- Guardians
- pets
- verified shelter pets
- shelters
- Partners
- offers
- claims
- redemptions
- savings delivered
- attributed Partner transaction value
- donation intents
- settled donations
- allocations
- transfer activation
- demo vs real data
- Partner participation states
- Shelter Preferred performance

Keep demo/test data excluded by default.

---

# 5. METRIC DEFINITIONS

Create documented metric definitions.

Avoid ambiguous metrics such as "impact" without formula.

For each important metric document:

- name
- definition
- numerator/denominator where applicable
- date dimension
- inclusion/exclusion
- demo-data behavior
- source tables/events
- privacy level

Create:
`docs/METRICS-AND-IMPACT-DEFINITIONS.md`

---

# 6. IMMUTABLE FINANCIAL / ECONOMIC REPORTING

Use the append-oriented economic ledger.

Build reporting from historical event lines rather than current offer values.

Support:

- retail value
- paid amount
- discount amount
- tax
- tip
- fees
- refunds
- reversals
- adjustments
- donation intent
- settled donation
- Partner contribution
- allocation
- grant-related events later

Never rewrite historical transactions because current terms changed.

---

# 7. DONATION INTENT / ACCRUAL

Implement Guardian and Partner donation-intent workflows.

Guardian example:

"Set aside $2.00 of this savings toward my preferred shelter."

Partner example:

"$1.00 per completed redemption."

Donation intent is not a settled charitable donation.

Use clear UI language:

- intended
- pledged
- accrued
- ready to donate
- settled

Do not label unsent/uncaptured amounts as tax-deductible donations.

---

# 8. PREFERRED SHELTER RECIPIENT

Allow Guardian to select a preferred donation recipient from verified eligible shelters/charitable recipients.

Requirements:

- recipient must be a verified ShelterPawtners shelter/rescue relationship
- charitable eligibility remains separate
- Guardian may change future preference
- historical allocations do not change retroactively
- origin shelter remains separately tracked
- default/recommendation logic must be transparent

Do not automatically route money merely because a pet originated from one shelter unless the Guardian/Partner/program rules explicitly authorize that.

---

# 9. GIVING PROVIDER ABSTRACTION

Use Phase 1 `giving_providers`.

Support providers such as:

- Every.org
- fiscal sponsor
- future ShelterPawtners Foundation

Application dashboards/reporting must not depend on one provider's proprietary schema.

Use internal canonical donation transaction records plus provider IDs/statuses.

---

# 10. EVERY.ORG INVESTIGATION / INTEGRATION

Before enabling production transactions:

- verify current Every.org API/enterprise terms
- verify for-profit/enterprise usage requirements
- verify supported nonprofit eligibility
- verify fees
- verify webhook capabilities
- verify donation-link/embed options
- verify receipt ownership
- verify settlement/disbursement behavior
- verify privacy/data-sharing terms

Document findings in:
`docs/EVERYORG-INTEGRATION.md`

If terms and access are appropriate, implement the approved integration.

Desired flow:

Guardian/Partner
→ ShelterPawtners giving UX
→ qualified Every.org transaction
→ provider confirmation/webhook
→ ShelterPawtners canonical donation transaction
→ receipt/provider reference
→ allocation
→ dashboards/reporting

Do not claim ShelterPawtners LLC itself is issuing the charitable receipt.

---

# 11. CHARITABLE RECIPIENT ELIGIBILITY

Build/manage recipient eligibility.

Track:

- ShelterPawtners verification
- giving provider
- provider nonprofit ID
- 501(c)(3)/qualified status where known
- fiscal sponsor relationship
- eligibility state
- last verified date
- source
- disbursement status if available

Municipal/non-501(c)(3) shelters must not be silently treated as deductible recipients.

Support fiscal-sponsor/Friends organization relationships using organization relationships.

---

# 12. DONATION TRANSACTION METADATA

Capture useful reporting metadata while minimizing sensitive data.

Support:

- donor profile/org
- donor type
- provider
- provider transaction ID
- date/time
- amount
- currency
- tax year
- recipient
- allocation
- campaign
- related pet
- related origin shelter
- related Partner/redemption where applicable
- payment-method category if supplied by provider
- settlement state
- receipt reference
- goods/services provided indicator
- fair-market value where relevant
- refund/reversal
- provider fee if available
- platform fee if ever applicable
- notes/source
- audit provenance

Never store raw payment credentials.

---

# 13. ANNUAL GUARDIAN SUMMARY

Create a downloadable/printable annual summary concept.

Show distinct sections for:

- verified savings
- actual settled charitable donations
- donation receipt/provider references
- supported shelters/programs
- relevant transaction dates/tax year

Do not present discounts as charitable deductions.

Do not provide personalized tax advice.

Use language such as:

"Keep official charitable receipts from the listed giving provider. Tax treatment depends on your circumstances."

---

# 14. ANNUAL PARTNER SUMMARY

Show:

- attributed transactions
- attributed customer counts
- benefits/discounts delivered
- actual cash charitable contributions
- donation-provider references
- campaigns
- recipient allocations
- other Partner impact metrics

Do not automatically label customer discounts as charitable donations.

Separate:

- discounts/marketing expense data
- charitable contributions
- platform/marketplace fees
- commercial payments

---

# 15. ANNUAL SHELTER SUMMARY

Show:

- alumni pets
- Passport activations
- Guardian savings generated
- benefits used
- donations received
- grant/fund allocations if applicable
- Partner participation connected to alumni
- community support activity

Provide exportable reporting where useful.

---

# 16. TAX / ACCOUNTING SAFETY

System must distinguish:

### Savings

Economic benefit/discount.

### Commercial transaction

Purchase/service payment.

### Donation intent

Not yet a donation.

### Settled charitable contribution

Actual provider-confirmed donation.

### Grant

Separate funding event.

### Sponsorship/commercial marketing

Not automatically charitable.

Do not conflate these in UI or database.

Add appropriate disclaimers.

---

# 17. GRANT / FUND ARCHITECTURE

Build future-ready models for:

- funds
- grant programs
- grant applications
- grant awards
- disbursements
- restrictions
- impact reports

Do not run a full grant-management program unless explicitly approved.

The architecture should allow future ShelterPawtners nonprofit/foundation programs.

---

# 18. SHELTER NEEDS / FUNDING CONNECTION

Allow shelters to connect:

- current needs
- wishlist
- fundraising campaigns
- giving recipient
- future grant eligibility

Support showing these on public shelter pages/dashboards.

---

# 19. B CORP / IMPACT MEASUREMENT FOUNDATION

Create documentation/data mapping for future B Corp certification evidence.

Do not claim certification unless achieved.

Track evidence-friendly metrics such as:

- mission-aligned Partners
- economic value delivered to Guardians
- shelter support
- community participation
- responsible data/privacy practices
- stakeholder governance evidence links where appropriate
- environmental/community commitments later

Create:
`docs/B-CORP-IMPACT-READINESS.md`

---

# 20. GAMIFICATION / CHALLENGES

Build mission-aligned gamification that encourages constructive participation.

Examples:

Guardian:

- Passport completion
- verified adoption
- savings milestones
- support-a-shelter milestones
- referral milestones

Partner:

- profile completion
- active exclusive offer
- first redemption
- 10/100 redemptions
- savings delivered
- donation commitment fulfilled
- Shelter Preferred

Shelter:

- Report Card completion
- transfer claim rate
- alumni activation
- profile completeness
- data quality

Avoid manipulative dark patterns.

Do not encourage unsafe competition around euthanasia or other sensitive animal-welfare outcomes.

---

# 21. NATIVE SHARING / STORY CARDS

Extend native sharing using verified metrics.

Examples:

"Ruby saved $28.00 today."

"Happy Paws has delivered $2,400.00 in verified ShelterPawtners savings."

"Our shelter's alumni have received $18,700.00 in Partner benefits."

Only create shareable metrics from real authorized data.

Allow user to control what is shared.

No automatic private data disclosure.

---

# 22. SHELTER REPORTING ALIGNMENT

Continue mapping ShelterPawtners data to animal-welfare reporting concepts.

Identify useful shelter metrics traditional systems may not provide, including:

- post-adoption savings
- Partner utilization
- Passport activation
- alumni engagement
- community support
- donation outcomes
- provider interactions later

Document opportunities, not unsupported claims.

---

# 23. EXPORTS

Provide useful CSV/export capability for authorized users.

Possible exports:

Guardian:

- annual transaction/savings/donation summary

Partner:

- redemptions
- attributed transactions
- contributions

Shelter:

- alumni impact
- pet/adoption reporting
- donation activity

Admin:

- operational reporting

Respect privacy and RLS.

---

# 24. SECURITY / FINANCIAL CONTROLS

Test:

- users cannot forge settled donations
- provider webhook events are authenticated/verified
- duplicate provider events are idempotent
- financial history cannot be silently edited
- refunds/reversals preserve history
- one shelter cannot see another's private data
- aggregated shelter alumni metrics do not expose Guardian PII
- preferred recipient changes do not rewrite historical allocations
- demo records cannot become real donations
- annual reports exclude non-settled intents from charitable totals

---

# 25. DOCUMENTATION

Create/update:

- `docs/PHASE-4-IMPACT-GIVING-FINANCIAL.md`
- `docs/METRICS-AND-IMPACT-DEFINITIONS.md`
- `docs/EVERYORG-INTEGRATION.md`
- `docs/ANNUAL-REPORTING.md`
- `docs/GRANTS-AND-FUNDS.md`
- `docs/B-CORP-IMPACT-READINESS.md`
- `docs/FINANCIAL-LEDGER-AND-GIVING.md`
- decision log/security/roadmap/requirements

---

# 26. TESTING

Automate:

- Guardian savings calculations
- Partner attribution
- shelter alumni rollups
- parent/child org rollups
- donation intent accrual
- conversion to settled donation
- provider webhook idempotency if integrated
- refund/reversal
- annual summary calculations
- charitable vs non-charitable separation
- demo exclusion
- preferred recipient history
- export permissions
- sharing only authorized metrics

---

# 27. PHASE 4 NON-GOALS

Do not implement unless explicitly approved:

- ShelterPawtners acting as its own 501(c)(3)
- direct custody of charitable funds by the LLC
- tax-return preparation
- legal/tax advice engine
- Stripe Connect commercial marketplace
- full hardware/device integrations
- advanced Instagram ingestion
- production launch hardening

---

# 28. DEFINITION OF DONE

Required:

- Guardian value dashboard
- Partner value dashboard
- shelter alumni dashboard
- admin impact dashboard
- documented metric definitions
- economic ledger reporting
- donation intents
- preferred shelter recipient
- giving-provider abstraction active
- Every.org investigation documented
- approved Every.org integration completed if access/terms permit
- charitable eligibility model
- settled donation ledger
- annual Guardian summary
- annual Partner summary
- annual Shelter summary
- savings/commercial/donation/grant distinctions enforced
- grant/fund schema foundation
- B Corp evidence foundation
- mission-aligned gamification
- native metric sharing
- exports
- financial security tests
- mobile/browser/accessibility review
- docs updated
- build/tests pass
- commit/PR

---

# 29. COMPLETION REPORT

Provide:

1. dashboards
2. metric definitions
3. financial calculations
4. giving architecture
5. Every.org findings/integration
6. recipient eligibility behavior
7. annual reporting
8. grant/fund foundation
9. B Corp readiness
10. security/financial test results
11. known legal/external dependencies
12. Definition of Done
13. commit/PR
14. recommended Phase 5 handoff

Do not start Phase 5 until approved.
