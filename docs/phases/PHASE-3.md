# ShelterPawtners Phase 3 Work Prompt

## Guardian + Shelter Passport MVP

Status: planning document; inactive until Phase 3 is explicitly activated after Phase 2 approval.

Execute Phase 3: Guardian + Shelter Passport MVP for `shelterpawtners/LostPaws`.

Phase 1 and Phase 2 must be approved first.

Read:

- `AGENTS.md`
- ShelterPawtners Skill
- all `/docs`
- Phase 1 and Phase 2 execution docs
- migrations/schema
- `docs/DECISION-LOG.md`
- current tests

Work continuously. Plan briefly, then implement, test, visually review, fix, document, and commit.

---

# PHASE 3 OBJECTIVE

Deliver the complete foundational pet lifecycle:

Shelter/import
→ Shelter Report Card
→ Shelter-authored/verified pet information
→ Adoption
→ secure 60-day transfer
→ Guardian account/sign-in
→ Guardian claims pet
→ same underlying record becomes the Guardian-controlled Digital Pet Passport
→ provenance/history retained

Also deliver a Guardian-first Passport path for current pet Guardians who are not using a shelter workflow.

---

# 1. GUARDIAN ONBOARDING

Implement:

- Guardian persona activation
- Guardian dashboard foundation
- create pet
- edit pet
- pet photo
- co-guardian support
- pet list
- Passport navigation
- privacy controls
- basic sharing controls

Current pet owners may create a Passport even when the pet was not shelter-adopted.

Adoption verification is a separate state/relationship.

---

# 2. SHELTER / RESCUE ONBOARDING

Implement shelter/rescue organization experience:

- organization setup
- public profile
- staff/membership permissions
- shelter pet roster
- create pet manually
- import roster
- manage Shelter Report Cards
- adoption/transfer workflow
- public shelter needs/wishlist/support links

Do not require shelters to re-enter data already available from other systems where import is possible.

---

# 3. SHELTER REPORT CARD

Create the Shelter Report Card as the pre-adoption persona/view of the same underlying pet data used by the Digital Pet Passport.

Do not create a separate duplicate pet database.

Report Card sections should be structured enough to support:

- identity
- photos
- breed/species/age
- shelter ID/external IDs
- microchip
- intake history
- medical summary
- current medications
- allergies/medical warnings
- vaccinations where available
- behavior/personality
- commands/training
- likes/dislikes
- compatibility
- care routine
- food/preferences
- notes
- adoption-ready information
- source/provenance
- shelter verification state

Use normalized structures where reporting/provenance matter.

Do not dump all Report Card content into one JSON blob.

---

# 4. DIGITAL PET PASSPORT

After Guardian claim, present the same underlying pet information as the Guardian Digital Pet Passport.

Passport must support:

- ongoing identity
- photos
- care information
- medical/care history
- shelter/adoption history
- emergency information
- Guardian-entered updates
- provenance
- privacy levels
- future provider contributions

The Guardian becomes the primary controller of post-adoption sharing/privacy.

Shelter-authored historical data remains attributed to the shelter.

---

# 5. PROVENANCE

Every meaningful Passport/Report Card entry should identify its origin where practical:

- shelter entered
- shelter verified
- Guardian entered
- provider entered
- imported
- system generated
- platform admin

Do not let a Guardian edit history in a way that makes shelter-authored information appear Guardian-authored or vice versa.

Corrections should preserve audit history.

---

# 6. PRIVACY MODEL

Implement three high-level visibility levels:

### Private

Guardian-authorized/private data only.

### Shared

Available to explicitly authorized participants/providers.

### Public/Emergency

Information the Guardian intentionally permits on a public/emergency pet page.

Nothing becomes public simply because it exists in the Passport.

Private by default.

---

# 7. EMERGENCY / LOST PET VIEW

Guardian may choose to expose useful emergency fields such as:

- pet name/photo
- species/breed
- critical allergies
- current medications
- major medical warning
- emergency care instructions
- veterinarian reference
- controlled contact method

Do not expose:

- Guardian home address
- full private medical history
- private account data
- full microchip number by default

---

# 8. MICROCHIP FOUNDATION

Capture microchip identifiers using the secure identifier model from Phase 1.

Plan for future workflow:

microchip scanner
→ chip number
→ authorized ShelterPawtners lookup
→ matching pet
→ authorized emergency/provider information

Do not attempt to make the microchip itself contain Passport data.

Do not expose the full chip number publicly.

Add secure lookup architecture/tests where appropriate, but a national veterinary provider lookup workflow is not required in Phase 3.

---

# 9. PET QR

Create a permanent Pet Passport QR model.

The physical QR should resolve to a durable ShelterPawtners pet/public/emergency route using an opaque public identifier.

Guardian can change shared fields later without replacing the QR.

No private data encoded in the QR itself.

Support:

- QR display/download for Guardian
- QR regeneration/rotation if security requires
- public/emergency resolution
- revoked/disabled behavior

---

# 10. CO-GUARDIANS

Support:

- primary Guardian
- co-Guardian invitation
- co-Guardian acceptance
- removal/end of relationship
- temporal history

Define sensible permission differences.

Do not destroy historical guardianship.

---

# 11. SHELTER PET IMPORT

Build practical import capability.

MVP minimum:

- CSV upload
- column mapping
- import preview
- validation
- duplicate detection
- create/update decision
- error report
- import job history

Use canonical shelter-data model.

Imported pets should become draft Shelter Report Cards.

---

# 12. EXTERNAL ADOPTION SOURCE ADAPTER FRAMEWORK

Implement an adapter architecture for external sources.

Priority research/adapter targets:

- Petfinder
- Adopt-a-Pet
- Shelterluv
- PetPoint
- Petstablished
- Animals First
- other common shelter systems

Do not scrape prohibited systems.

Use official APIs/feeds/export mechanisms only when permitted.

For Phase 3, implement any low-risk connector that is officially available and practical, but do not block completion if third-party approval/credentials are unavailable.

Document exact connector status.

---

# 13. DUPLICATE / MATCHING LOGIC

Plan for pet matching using combinations such as:

- microchip
- shelter external ID
- source-system ID
- pet identity attributes
- adoption records

Do not automatically merge uncertain pets.

Create review state for ambiguous matches.

---

# 14. ADOPTION RECORD

Create/complete explicit adoption records.

Track:

- pet
- shelter/rescue
- adoption date
- adopter/Guardian where known
- adoption source
- external adoption ID
- verification state
- provenance
- transfer state
- origin shelter

Origin shelter should remain historically attached for future impact rollups.

---

# 15. TRANSFER WORKFLOW

Required flow:

Shelter
→ selects adopted pet
→ creates transfer
→ secure token/QR/link
→ Guardian signs in or creates account
→ Guardian claims
→ guardianship changes
→ Passport control changes
→ history/provenance persists

Transfer is open for 60 days.

Shelter retains access while transfer remains unclaimed.

After successful Guardian claim, shelter access should change according to policy:

- retain historical shelter-authored records/provenance
- retain appropriate aggregate/alumni relationship
- no unrestricted access to new Guardian-private data

---

# 16. TRANSFER SECURITY

Transfer token must be:

- opaque
- securely generated
- hashed/digested at rest where appropriate
- expiring
- revocable
- auditable
- not reusable after successful claim except where intentionally designed

Support replacement transfer when needed.

Do not expose raw sensitive adoption/Guardian information in the QR.

---

# 17. TRANSFER REMINDERS

Send reminder emails every 10 days after transfer initiation while unclaimed.

Schedule conceptually at:

- day 10
- day 20
- day 30
- day 40
- day 50
- final reminder before/around day 60 as appropriate

Stop reminders when:

- claimed
- revoked
- invalidated
- expired

Use the approved transactional email provider/configuration available at this phase.

If production email credentials are not yet ready, build/test with a safe development mode and document the external setup required.

Do not send real emails from demo data.

---

# 18. GUARDIAN CLAIM EXPERIENCE

Mobile-first.

Guardian should understand:

- what ShelterPawtners is
- which pet is being transferred
- why claiming is valuable
- Passport benefits
- savings/Partner benefits
- privacy basics

After claim, show successful transition to Passport/dashboard.

---

# 19. ADOPTION VERIFICATION REQUESTS

Support Guardian-created pets that were previously adopted but did not originate through a ShelterPawtners transfer.

Allow Guardian to request shelter verification.

System may send verification email/workflow to shelter contact.

Track:

- draft
- submitted
- sent
- viewed
- confirmed
- declined
- more information requested
- failed
- expired
- canceled

Do not automatically grant shelter-adoption status from Guardian self-report alone.

---

# 20. SHELTER SUPPORT / NEEDS PROFILE

Allow shelters to publish support information such as:

- website
- donation link
- wishlist link
- current needs
- volunteer link
- foster link
- social links
- fundraising/campaign links

Do not process charitable funds directly in Phase 3.

This creates greater visibility for shelter-specific needs.

---

# 21. SHELTER DASHBOARD FOUNDATION

Provide basic operational metrics needed in Phase 3:

- pets in ShelterPawtners
- draft Report Cards
- completed Report Cards
- adoptions
- transfers pending
- transfers claimed
- verification requests
- import jobs/errors

Deep alumni impact and financial rollups are Phase 4.

---

# 22. GUARDIAN DASHBOARD FOUNDATION

Show useful real data:

- pets
- Passport completion
- shelter/adoption verification
- offers/claims from Phase 2
- savings to date if redemptions exist
- sharing/emergency QR status

Do not fabricate metrics.

Deep financial/impact dashboard is Phase 4.

---

# 23. SHELTER DATA STANDARDS

Expand `docs/SHELTER-DATA-STANDARDS.md`.

Map canonical fields/events to industry reporting concepts.

Maintain compatibility with shelter reporting data where practical.

Design post-adoption data so ShelterPawtners can later help shelters understand outcomes that traditional shelter systems may not track.

---

# 24. SECURITY / RLS

Test:

- Guardian A cannot read Guardian B private Passport
- co-Guardian sees only permitted information
- shelter cannot see unrelated pets
- shelter access changes after claim
- public QR reveals only Guardian-approved fields
- microchip full identifier is not public
- transfer tokens cannot be guessed/reused
- adoption history/provenance cannot be silently rewritten
- imports do not bypass authorization
- demo transfers do not send real email
- provider role does not automatically grant Passport access

---

# 25. ACCESSIBILITY / MOBILE

Critical flows must work on mobile:

- create pet
- view/edit Passport
- public emergency page
- QR
- shelter roster
- Report Card
- transfer
- claim
- verification request

Maintain accessible forms, focus, contrast, labels, and non-QR alternatives.

---

# 26. DOCUMENTATION

Create/update:

- `docs/PHASE-3-GUARDIAN-SHELTER-PASSPORT.md`
- `docs/PASSPORT-DATA-MODEL.md`
- `docs/ADOPTION-AND-TRANSFER.md`
- `docs/SHELTER-IMPORTS.md`
- `docs/SHELTER-DATA-STANDARDS.md`
- `docs/SECURITY-AND-PRIVACY.md`
- `docs/DECISION-LOG.md`
- roadmap/requirements

---

# 27. TESTING

Automate critical paths:

- Guardian signup → pet creation → Passport
- privacy defaults
- emergency/public share
- co-Guardian invite/accept
- shelter pet creation
- CSV import
- draft Report Card
- adoption
- 60-day transfer
- claim
- post-claim permission change
- reminder suppression after claim
- adoption verification request
- public QR privacy
- provenance persistence
- microchip privacy

---

# 28. PHASE 3 NON-GOALS

Do not complete:

- live charitable donation settlement
- Every.org production integration unless explicitly moved forward
- Stripe Connect
- full annual tax reporting
- advanced grant system
- advanced hardware integration
- advanced pet-health device ingestion
- full Instagram media import
- advanced shelter alumni dashboards
- production launch hardening

---

# 29. DEFINITION OF DONE

Required:

- Guardian can create/manage pet
- Guardian Passport works
- private/shared/public model works
- emergency public view works
- medications/allergies can be selectively public
- microchip is securely stored
- permanent pet QR works
- co-Guardian works
- shelter account/roster works
- Shelter Report Card works
- Report Card uses same underlying pet/Passport architecture
- CSV import works
- adapter framework exists
- adoption record works
- origin shelter persists
- transfer lasts 60 days
- shelter retains intended access before claim
- secure transfer QR/link works
- Guardian claim works
- shelter permissions change after claim
- reminder automation works every 10 days while unclaimed
- adoption verification request works
- shelter support/needs links work
- provenance is preserved
- security/RLS tests pass
- e2e tests pass
- mobile/browser/accessibility review complete
- docs updated
- build passes
- commit/PR created

---

# 30. COMPLETION REPORT

Provide:

1. schema/migration changes
2. Passport architecture
3. Report Card architecture
4. privacy/provenance model
5. QR implementation
6. microchip handling
7. shelter imports/connectors status
8. transfer lifecycle
9. reminder implementation
10. security tests
11. e2e/mobile/accessibility results
12. known limitations
13. external setup required
14. Definition of Done checklist
15. commit/PR
16. recommended handoff to Phase 4

Do not start Phase 4 until approved.
