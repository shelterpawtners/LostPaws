# ShelterPawtners Phase 5 Work Prompt

## Integrations + Marketplace + Production Launch

Status: planning document; inactive until Phase 5 is explicitly activated after Phase 4 approval.

Execute Phase 5: Integrations + Marketplace + Production Launch for `shelterpawtners/LostPaws`.

Phases 1–4 must be approved first.

Read all repository guidance, docs, migrations, security standards, decision logs, integration documentation, and test suites.

This phase is the final MVP launch phase. Plan briefly, execute continuously, test, review, harden, document, and commit.

Do not activate paid production services without explicit approval.

---

# PHASE 5 OBJECTIVE

Turn the completed ShelterPawtners MVP into a production-ready, secure, scalable application by completing:

- production authentication providers
- email
- Meta/Instagram integrations
- commercial marketplace payment architecture
- Stripe Connect planning/implementation
- advanced shelter connectors
- provider/hardware integration framework
- RAVE Shelter / LostPaws launch experiences
- production environments
- security hardening
- analytics
- SEO
- accessibility
- monitoring
- launch testing
- demo/showcase workflow

---

# 1. GOOGLE OAUTH

Complete Google OAuth if not already finished.

Use current official Supabase + Google guidance.

Required:

- Google Cloud project/app configuration
- OAuth consent
- redirect URIs
- Supabase provider configuration
- development URL
- production URL
- test accounts
- account-linking behavior
- error states

Do not commit client secrets.

If human console action is required, provide exact step-by-step instructions and continue other work while waiting.

---

# 2. META / INSTAGRAM STRATEGY

Implement a realistic Meta/Instagram integration based on current official capabilities.

Do not assume ordinary personal Instagram accounts have the same API access as Professional accounts.

Support two concepts:

### Guardian pet social link

Any Guardian can link:

- pet Instagram URL/handle
- other social links

### Authorized Instagram Professional integration

For eligible Creator/Business accounts:

- OAuth/account connection
- permitted profile/media capabilities
- approved insights/features where useful
- Partner business integration
- future pet-creator integration

Do not scrape Instagram.

Do not promise bulk personal-photo import if official APIs do not support it.

Document current limitations.

---

# 3. PET MEDIA / SOCIAL EXPERIENCE

Where permitted:

- link pet Instagram
- show authorized social link
- allow Guardian to selectively reference/import permitted media
- preserve source attribution
- never make external media public without Guardian intent

Manual upload remains supported.

---

# 4. PRODUCTION TRANSACTIONAL EMAIL

Finalize transactional email.

Preferred launch provider should be the lowest-cost practical option previously approved.

If using Resend:

- verify domain
- configure DNS
- sender addresses
- API key via secure secrets
- templates
- bounce/error handling
- rate limits
- transfer reminders
- verification messages
- Partner/admin notifications

Keep provider abstraction so Azure Communication Services or another provider can replace it later.

Provide human step-by-step DNS/account instructions when required.

---

# 5. COMMERCIAL MARKETPLACE PAYMENTS

Commercial Partner transactions are distinct from charitable giving.

Implement/prepare marketplace purchases such as:

- product purchase
- service booking payment
- reservation/deposit
- refund
- payout to Partner
- ShelterPawtners commission/platform fee where approved

Use Stripe Connect as the preferred architecture unless fresh evaluation identifies a material reason not to.

Do not route charitable giving through Stripe Connect merely because commercial payments use Stripe.

---

# 6. STRIPE CONNECT EVALUATION

Before production setup, verify current:

- Connect pricing
- account models
- onboarding
- KYC responsibilities
- platform fee models
- payouts
- refunds
- disputes
- tax reporting responsibilities
- marketplace terms
- availability in target geography
- security requirements

Document:
`docs/STRIPE-CONNECT-MARKETPLACE.md`

Compare:

- Stripe-controlled pricing / connected-account model
- ShelterPawtners-controlled pricing model

Recommend the lowest-risk, lowest-cost model compatible with our business goals.

Do not activate paid production flow without approval.

---

# 7. STRIPE CONNECT IMPLEMENTATION

If approved:

Implement:

- connected Partner onboarding
- account status
- capability checks
- product/service checkout
- application/platform fee logic if approved
- payout flow
- refunds
- webhook verification
- idempotency
- dispute states
- reconciliation references
- economic-event ledger integration

Never store raw card data.

Use hosted/secure Stripe payment components.

---

# 8. COMMERCIAL VS CHARITABLE SEPARATION

Enforce:

Commercial marketplace:
Stripe Connect

Charitable giving:
Every.org/fiscal sponsor/future nonprofit provider

Do not commingle logic or labels.

Dashboard reporting may aggregate high-level impact, but accounting records remain separate.

---

# 9. RAVE SHELTER

Complete RAVE Shelter as the ShelterPawtners music/festival/community brand.

Use only approved V2 brand assets:

- `rave-shelter-logo-static-v2.png`
- `rave-shelter-logo-animated-v2.gif`
- `rave-shelter-logo-v2.svg`

Support:

- campaign landing page
- Partner/vendor offers
- campaign tags
- Guardian sharing
- mission story
- measurable impact
- clear ShelterPawtners relationship

---

# 10. LOSTPAWS

Implement LostPaws as a specific RAVE Shelter / ShelterPawtners community activation tied thematically to Lost Lands weekend.

Brand hierarchy:

ShelterPawtners
→ RAVE Shelter
→ LostPaws

Do not imply official Lost Lands partnership or endorsement unless formal documentation later exists.

Use clear language that the initiative is independent/unofficial.

Support:

- campaign page
- participating offers/vendors
- campaign-specific claims/redemptions
- shareable stories
- impact metrics
- event-period scheduling
- campaign QR
- appropriate legal/brand disclaimer

Do not use protected festival branding beyond lawful nominative/reference use.

---

# 11. ADVANCED SHELTER CONNECTORS

Expand shelter import adapters where official access is available.

Targets may include:

- Petfinder
- Adopt-a-Pet
- Shelterluv
- PetPoint
- Petstablished
- Animals First
- other major systems

Use:

- official APIs
- authorized feeds
- exports
- SFTP where appropriate
- webhooks where available

No prohibited scraping.

For unavailable providers, document:

- access path
- application requirements
- credentials needed
- technical adapter plan

---

# 12. SHELTER AUTO-ONBOARDING

Reduce shelter setup burden.

Where data permits:

- create draft organization/profile
- import roster
- create draft Report Cards
- map categories/data
- identify duplicates
- surface errors
- request shelter verification/claim of organization

Do not publicly represent an organization as a formal ShelterPawtners participant until appropriate verification/claim.

---

# 13. PROVIDER / HEALTH INTEGRATION FRAMEWORK

Create extensible framework for future:

- veterinary systems
- pet-health apps
- wearable devices
- smart collars
- trackers
- nutrition devices
- medication systems
- weight/activity/sleep metrics

Do not build speculative vendor integrations without an available API.

Use canonical event/measurement model where appropriate.

Respect Guardian consent and data minimization.

---

# 14. HARDWARE / PRODUCT PARTNER STRATEGY

Support future preferred products that can integrate with ShelterPawtners.

Architecture should permit:

- vendor/product identity
- device registration
- API credential/reference
- measurement ingestion
- Guardian authorization
- data provenance
- revocation
- integration health

Do not expose health data to Partners for advertising without explicit authorization.

---

# 15. MICROCHIP / VETERINARY LOOKUP FUTURE PATH

Advance secure microchip lookup architecture.

Explore current lawful/provider-access options for:

- scanned microchip number
- matching ShelterPawtners pet
- authorized emergency information
- authorized veterinarian/medical history access

Do not create a public microchip-number search exposing private records.

Document partnership/API requirements.

---

# 16. FUTURE MICROSOFT ARCHITECTURE

Document a realistic future pathway for:

- Azure
- Power Platform
- Dataverse
- Power BI/Fabric where useful
- Azure AI
- Microsoft nonprofit/AI-for-good opportunities

Supabase remains the MVP operational backend unless a justified migration is explicitly approved.

Avoid dual-writing data merely to say Microsoft is supported.

Create:
`docs/FUTURE-MICROSOFT-ARCHITECTURE.md`

---

# 17. API / WEBHOOK PLATFORM

Formalize integrations.

Support:

- versioned API concepts
- webhook subscriptions
- signed webhooks
- idempotency
- retries
- audit events
- rate limiting
- API key/service credential management
- integration health

Do not expose broad database access directly.

---

# 18. PRODUCTION SUPABASE

Create/use a separate production Supabase project only with explicit approval.

Requirements:

- migrations applied from GitHub
- production secrets isolated
- RLS/security verified
- storage policies
- backups/recovery reviewed
- indexes/performance review
- logging/alerts
- dev and prod separation

Do not manually recreate schema in production.

---

# 19. HOSTING / DEPLOYMENT

Select and configure low-cost production hosting.

Evaluate current options such as:

- Vercel
- Cloudflare Pages
- Netlify

Choose based on:

- React/Vite support
- routing/auth
- custom domain
- preview deployments
- cost
- security headers
- deployment integration
- future scale

Do not choose merely because GitHub Pages was used historically.

---

# 20. DOMAIN / DNS

Configure:

`shelterpawtners.com`

and required subdomains if approved.

Provide exact human steps for:

- DNS
- hosting verification
- SSL
- email DNS
- OAuth redirects
- Supabase production redirects

Avoid unnecessary subdomains.

---

# 21. SECURITY HARDENING

Perform a dedicated security review.

Review:

- all RLS
- privileged functions
- service-role use
- storage policies
- OAuth
- tokens
- QR
- transfer flows
- redemptions
- financial events
- donation provider webhooks
- Stripe webhooks
- rate limits
- input validation
- CORS
- CSP/security headers
- secrets
- logs
- PII exposure
- audit logs

Run Supabase security advisors where available and remediate valid findings.

---

# 22. PRIVACY REVIEW

Ensure privacy-by-design.

Review:

- public Passport fields
- Guardian PII
- pet medical data
- shelter access
- Partner access
- provider data
- Instagram/social data
- analytics
- exports
- research/aggregate data

No Guardian PII in research/insight outputs.

Prepare launch-ready privacy documentation inputs for legal review.

---

# 23. ACCESSIBILITY

Perform WCAG-conscious production review.

Test:

- keyboard-only navigation
- focus
- forms
- dialogs
- QR fallbacks
- screen-reader semantics
- headings
- contrast
- errors
- responsive text
- motion preferences
- animated RAVE assets accessibility

Provide reduce-motion behavior for animation where appropriate.

---

# 24. SEO / SOCIAL METADATA

Implement:

- title/meta descriptions
- Open Graph
- social preview
- sitemap
- robots
- canonical URLs
- structured data where appropriate
- public Partner/shelter/offer discoverability

Do not expose private Passport routes to indexing.

---

# 25. ANALYTICS

Add privacy-conscious analytics.

Track important funnels such as:

- signup
- persona selection
- Partner onboarding
- offer publication
- offer claim
- redemption
- Guardian pet creation
- Passport completion
- shelter transfer
- claim/activation
- giving conversion
- campaign participation

Avoid sending sensitive pet medical or Guardian PII to analytics.

---

# 26. MONITORING / ERROR REPORTING

Implement practical low-cost monitoring.

Track:

- frontend errors
- API/function errors
- failed email
- failed webhook
- failed transfer
- failed redemption
- payment failure
- donation-provider failure
- import failure

Do not log sensitive secrets or full private payloads.

---

# 27. PERFORMANCE

Review:

- bundle size
- image optimization
- lazy loading
- database queries
- indexes
- public directory performance
- dashboard queries
- large shelter rosters
- imports

Avoid premature expensive infrastructure.

---

# 28. PRODUCTION SEED / DEMO MODE

Preserve a safe demo capability.

Demo mode must:

- remain clearly labeled
- not send production emails
- not move real money
- not count in live metrics
- support demos/video
- be easy to reset

Do not expose administrative demo reset tools publicly.

---

# 29. DEMO / SHOWCASE STORY

Prepare a polished end-to-end demo path using demo data.

Show:

### Guardian

"Ruby has saved your family $842.17."

### Partner

"ShelterPawtners brought you 31 new customers representing $4,870.00 in attributed purchases."

### Shelter

"Pets adopted from your shelter have received $18,700.00 in verified Partner benefits."

Use obviously labeled demo data.

Build supporting flows for a future demo video.

---

# 30. LAUNCH CONTENT / TRUST

Ensure public pages explain:

- what ShelterPawtners is
- Digital Pet Passport
- Partner savings
- shelter support
- privacy
- verification labels
- giving provider role
- RAVE Shelter
- LostPaws unofficial relationship

No fake sponsors, testimonials, Partners, or metrics.

---

# 31. LEGAL / POLICY INPUTS

Prepare implementation-ready drafts/data requirements for legal review:

- Terms of Service
- Privacy Policy
- Partner Terms
- offer terms
- redemption disclaimers
- giving disclaimers
- campaign disclaimers
- LostPaws affiliation disclaimer

Do not represent automated drafts as attorney-approved.

---

# 32. PRODUCTION TEST PLAN

Run full cross-persona E2E:

Guardian
→ signup
→ pet
→ Passport
→ offer
→ claim
→ redemption
→ savings
→ giving

Partner
→ signup
→ profile
→ offers
→ redemption validation
→ dashboard

Shelter
→ organization
→ import
→ Report Card
→ adoption
→ transfer
→ Guardian claim
→ alumni impact

Admin
→ moderation
→ Preferred
→ reporting
→ demo isolation

If commercial payments are approved:
→ connected account
→ checkout
→ payout/refund test

---

# 33. PHASE 5 DEFINITION OF DONE

Do not launch until applicable approved items are complete:

- Google OAuth production-ready
- Meta/Instagram strategy implemented/documented
- pet social linking works
- production email works
- Stripe Connect evaluation complete
- approved marketplace-payment flow works
- commercial vs charitable transaction separation enforced
- RAVE Shelter production page works
- LostPaws campaign works with unofficial disclaimer
- shelter connector framework expanded
- auto-onboarding workflow improved
- provider/device integration framework documented
- microchip future integration path documented
- Microsoft future architecture documented
- API/webhook security works
- production Supabase migration-driven
- hosting/domain/SSL configured
- security review complete
- privacy review complete
- accessibility review complete
- SEO complete
- analytics privacy-reviewed
- monitoring works
- performance reviewed
- demo mode safe
- end-to-end demo story works
- production E2E tests pass
- docs updated
- final build/deploy succeeds
- launch checklist approved
- commit/PR/release details recorded

---

# 34. COMPLETION REPORT

Provide:

1. production architecture
2. OAuth setup
3. email setup
4. Instagram/Meta integration and limitations
5. Stripe Connect evaluation/implementation
6. charitable/commercial separation
7. RAVE Shelter/LostPaws implementation
8. shelter integrations
9. provider/device integration framework
10. production Supabase/hosting
11. security findings/remediation
12. privacy/accessibility results
13. SEO/analytics/monitoring
14. performance results
15. production E2E results
16. demo/showcase workflow
17. remaining legal/business actions
18. Definition of Done
19. commit/PR/release
20. launch recommendation

Do not declare production launch-ready if critical security, financial, authentication, or privacy defects remain.
