# Issue #5 — Full-site browser/persistence coverage matrix

Status: **complete — accepted at `62cba023a4946993ad44fcbd0ab4f7fdab856a52`.**

Baseline: `main` after PR #30 (`eeea59cf25435871145118eb244c16753aa3a91b`).

This matrix distinguishes **implemented user behavior** from authenticated foundation placeholders that intentionally defer complete workflows to a later approved phase. Issue #5 validates current truth; it does not invent missing Phase 3 behavior.

## Public routes

- `/` — Public home and participation entry. Covered by Issue #5 public traversal and design QA.
- `/rave`, `/rave-shelter` — RAVE Shelter landing. Covered by Issue #5 public traversal.
- `/passport` — Passport foundation page. Covered by Issue #5 public traversal.
- `/partners` — PetBiz foundation page. Covered by Issue #5 public traversal.
- `/partners/:id` — Published provider profile and current offers. Covered by Issue #5 seeded-profile traversal and Marketplace golden path.
- `/shelters` — Shelter foundation page. Covered by Issue #5 public traversal.
- `/lostpaws` — LostPaws foundation page. Covered by Issue #5 public traversal.
- `/about` — Mission/about foundation page. Covered by Issue #5 public traversal.
- `/register` and `?type=` variants — Persona account-entry forms. Covered by Issue #5 public traversal and persona-registration suite.
- `/register.html` — Legacy business-card redirect. Covered by Issue #5 alias assertion.
- `/login`, `/sign-in` — Password/OAuth sign-in and legacy alias. Covered by Issue #5 alias/traversal and auth suites.
- `/sign-up` — Legacy registration alias. Covered by Issue #5 alias assertion.
- `/forgot-password`, `/reset-password` — Account-recovery surfaces. Covered by Issue #5 public traversal and auth suite.
- `/marketplace` — Current-offer discovery/search/filter. Covered by Issue #5 public traversal plus Marketplace golden/design QA.
- `/offers/:offerId` — Offer details and claim entry. Issue #5 discovers a real offer-detail link; the Marketplace golden path covers claim behavior.
- `/directory` — Published PetBiz directory. Covered by Issue #5 public traversal.
- Unknown route — Redirects to `/`. Covered by an explicit Issue #5 assertion.

## Guardian routes and persistence

- `/dashboard` — Role-aware Guardian dashboard. Covered by Issue #5 and design QA.
- `/onboarding/guardian`, `/pets/new` — Create pet/Passport foundation. Covered by Issue #5 multi-pet and failure/retry journeys plus existing Guardian tests.
- `/pets/:petId` — Reopen an owned pet. Covered by multi-pet reopen, reload, protected-route, and fresh-context journeys.
- Guardian pet persistence — Each successful unique test submission yields one canonical pet row and one active guardianship under the Guardian's real RLS session.
- Guardian failed save — Shows a visible error, remains on onboarding, creates no partial pet row, and succeeds exactly once after retry.
- Sign out/sign back in — Session invalidation and backend-state reconstruction are covered by Issue #5 and Hosted smoke.
- Browser reload — Saved pet state reconstructs from backend data.
- Fresh browser context — Pet state reconstructs after a new login instead of depending on React-only state.

## PetBiz routes and persistence

- `/dashboard` — Role-aware PetBiz dashboard. Covered by Issue #5 and design QA.
- `/business` — Partner public-profile editor. Covered by Issue #5 profile persistence, RAVE reload, and Marketplace golden path.
- `/partner/offers` — Create, version, and publish offers. Covered by Issue #5 two-offer persistence/revisit and Marketplace golden path.
- Offer persistence — Each unique Issue #5 offer has one canonical `offers` row with version history visible through `offer_versions` under the Partner's real RLS session.
- `/redeem`, `/redeem/:code` — Validate and confirm redemption. Covered by Marketplace golden and phase-2 redemption suites.
- Claim/redemption replay and cross-partner isolation — Covered by phase-2 redemption and persona-isolation suites.

## Shelter, RAVE Vendor, and admin QA

- `/admin-qa` as Platform Admin — Restricted real-RLS persona switching. Covered by Issue #5 Shelter/RAVE traversal and `admin-qa-mode.spec.ts`.
- `/admin-qa` as non-admin — Redirects away. Covered by `admin-qa-mode.spec.ts`.
- Shelter current state — Role-aware dashboard plus approved onboarding foundation. Covered through Admin QA real-RLS impersonation and persona-isolation DB suite.
- RAVE Vendor current state — Partner dashboard/profile behavior. Covered through Admin QA real-RLS impersonation and persona-isolation DB suite.
- Admin-QA acting-session reload — Existing Admin QA regression plus Issue #5 persona traversal verify truthful acting identity across reload/navigation.

## Authenticated foundation routes

These routes are intentionally present as authenticated foundations. Issue #5 validates protection and shell coherence, but a missing later-phase workflow is not a current defect.

- `/my-pets` — Authenticated foundation; complete workflow deferred.
- `/savings` — Authenticated foundation; complete workflow deferred.
- `/community` — Authenticated foundation; complete workflow deferred.
- `/offers` — Authenticated foundation; active PetBiz offer workflow is `/partner/offers`.
- `/locations` — Authenticated foundation; complete workflow deferred.
- `/adoptions` — Authenticated foundation; complete workflow deferred.
- `/transfers` — Authenticated foundation; complete workflow deferred.
- `/administration` — Authenticated foundation only; no privileged admin data is exposed and the full admin workflow is deferred.

## Cross-cutting runtime evidence

Accepted SHA: `62cba023a4946993ad44fcbd0ab4f7fdab856a52`.

- CI, Database QA, Dependency Review, Merge Gate, Persona QA, and Hosted QA all passed.
- Hosted golden paths: 4 passed.
- Hosted design/axe/runtime QA: 3 passed.
- Dedicated Issue #5 human audit: 5 passed.
- Admin QA hosted regression: 5 passed.
- Broader legacy hosted suite: 26 passed, 7 hosted-only fresh-email registration cases skipped because those same registration paths run deterministically in the successful isolated Persona QA lane.
- Persona QA passed fresh registration, seeded persona isolation, redemption, and local Admin QA security coverage.
- Hosted design evidence artifact: `10131801820`, digest `sha256:1871c6d9a47ac0052afe29945920ae081cd7b3aa1f701740a0259b7345d4cece`.
- Acceptance runtime was `LOCAL_HEAD`: exact PR-head Vite code with the shared development Supabase backend while Vercel's free deployment quota was rate-limited.

## Blocking defects resolved by the audit

- PetBiz offer reload now uses the intended `offers` -> `offer_versions` relationship instead of an ambiguous embed.
- Partner organization matching now sends the canonical RPC argument names used by the database function.
- Shared-dev candidate-dismissal test state is reset only for the seeded QA user through authenticated RLS so repeated runs remain deterministic while dismissal persistence is still verified.
- Repeated offer/redemption tests use run-scoped unique offer titles.
- Fresh-email signup repetition is isolated to Persona QA rather than the hosted default email quota.
- Legacy selectors were aligned with the branded UI.
- Partner profile regression waits for persisted editor hydration before modifying data, preventing a test-only hydration race.

## Acceptance interpretation

A future capability is not a defect merely because its route is currently a foundation page. A blocker is broken or misleading behavior inside functionality that is already implemented/approved, incorrect persistence, authorization/RLS failure, duplicate state, false success, broken navigation, or another defect meeting `docs/QA-AUTOMATION-POLICY.md`.

Issue #5 found no remaining release-readiness blocker within the implemented MVP after the fixes above. Production-domain routing and Phase 3 remain separate owner decisions.
