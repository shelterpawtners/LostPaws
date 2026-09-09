# Issue #5 — Full-site browser/persistence coverage matrix

Status: active release-readiness audit.

Baseline: `main` after PR #30 (`eeea59cf25435871145118eb244c16753aa3a91b`).

The matrix distinguishes **implemented user behavior** from authenticated foundation placeholders that intentionally defer complete workflows to a later approved phase. Issue #5 validates current truth; it does not invent missing Phase 3 behavior.

| Surface / route | Persona | Current behavior | Automated evidence |
| --- | --- | --- | --- |
| `/` | Public | Home / participation entry | Issue #5 public traversal + design QA |
| `/rave`, `/rave-shelter` | Public | RAVE Shelter landing | Issue #5 public traversal |
| `/passport` | Public | Passport foundation page | Issue #5 public traversal |
| `/partners` | Public | PetBiz foundation page | Issue #5 public traversal |
| `/partners/:id` | Public | Published provider profile + current offers | Issue #5 seeded profile traversal + Marketplace golden path |
| `/shelters` | Public | Shelter foundation page | Issue #5 public traversal |
| `/lostpaws` | Public | LostPaws foundation page | Issue #5 public traversal |
| `/about` | Public | Mission/about foundation page | Issue #5 public traversal |
| `/register` + `?type=` variants | Public | Persona account-entry forms | Issue #5 public traversal + persona registration suite |
| `/register.html` | Public | Legacy business-card redirect | Issue #5 alias assertion |
| `/login`, `/sign-in` | Public | Password/OAuth sign-in + legacy alias | Issue #5 alias/traversal + auth suites |
| `/sign-up` | Public | Legacy registration alias | Issue #5 alias assertion |
| `/forgot-password`, `/reset-password` | Public | Account-recovery surfaces | Issue #5 public traversal + auth suite |
| `/marketplace` | Public/Guardian | Current-offer discovery/search/filter | Issue #5 public traversal + Marketplace golden/design QA |
| `/offers/:offerId` | Public/Guardian | Offer details and claim entry | Issue #5 discovers a real offer detail link + Marketplace golden path |
| `/directory` | Public | Published PetBiz directory | Issue #5 public traversal |
| unknown route | Public | Redirect to `/` | Issue #5 explicit unknown-route assertion |
| `/dashboard` | Authenticated | Role-aware dashboard | Issue #5 Guardian/PetBiz/Shelter/RAVE journeys + design QA |
| `/admin-qa` | Platform admin | Restricted real-RLS persona switching | Issue #5 Shelter/RAVE traversal + `admin-qa-mode.spec.ts` |
| `/admin-qa` | Non-admin | Redirect away | `admin-qa-mode.spec.ts` |
| `/onboarding/guardian`, `/pets/new` | Guardian | Create pet/passport foundation | Issue #5 multi-pet + failure/retry + existing Guardian tests |
| `/pets/:petId` | Guardian | Reopen owned pet details | Issue #5 multi-pet reopen/reload/fresh-context journey |
| Guardian pet persistence | Guardian | One pet + one active guardianship per successful submission | Issue #5 direct RLS-backed DB assertions |
| Guardian failed save | Guardian | Visible error; no false navigation or partial row; retry succeeds | Issue #5 intercepted RPC + direct DB assertions |
| `/business` | PetBiz / RAVE | Partner public-profile editor | Issue #5 PetBiz profile persistence + RAVE reload; Marketplace golden path |
| `/partner/offers` | PetBiz | Create/version/publish offers | Issue #5 two-offer persistence/revisit + Marketplace golden path |
| Offer persistence | PetBiz | Canonical offer row + version history | Issue #5 direct RLS-backed `offers` / `offer_versions` assertions |
| `/redeem`, `/redeem/:code` | PetBiz | Validate/confirm redemption | Marketplace golden + phase-2 redemption suite |
| Claim / redemption replay + cross-partner isolation | Guardian / PetBiz | Current security and lifecycle rules | phase-2 redemption + persona isolation suites |
| Shelter current state | Shelter | Role-aware dashboard + approved onboarding foundation | Issue #5 Admin QA real-RLS impersonation + persona isolation DB suite |
| RAVE Vendor current state | RAVE Vendor | Partner dashboard/profile behavior | Issue #5 Admin QA real-RLS impersonation + persona isolation DB suite |
| `/my-pets` | Authenticated | Authenticated foundation | route protection/current-shell coverage; complete workflow deferred |
| `/savings` | Authenticated | Authenticated foundation | route protection/current-shell coverage; complete workflow deferred |
| `/community` | Authenticated | Authenticated foundation | route protection/current-shell coverage; complete workflow deferred |
| `/offers` | Authenticated | Authenticated foundation | route protection/current-shell coverage; active PetBiz workflow is `/partner/offers` |
| `/locations` | Authenticated | Authenticated foundation | route protection/current-shell coverage; complete workflow deferred |
| `/adoptions` | Authenticated | Authenticated foundation | route protection/current-shell coverage; complete workflow deferred |
| `/transfers` | Authenticated | Authenticated foundation | route protection/current-shell coverage; complete workflow deferred |
| `/administration` | Authenticated | Authenticated foundation only; no privileged admin data exposed | route protection/current-shell coverage; full admin workflow deferred |
| sign out / sign back in | Guardian | Session invalidates then backend state reconstructs | Issue #5 + Hosted smoke |
| browser reload | Guardian / PetBiz / Admin QA personas | Saved state reconstructs from backend/session | Issue #5 + existing hosted suites |
| fresh browser context | Guardian | No reliance on React-only state | Issue #5 fresh-context sign-in + pet reopen |
| page/console/network health | Public / Guardian / PetBiz | No unexpected runtime failures | Hosted design QA + Issue #5 failure evidence on test failure |

## Acceptance interpretation

A future capability is not a defect merely because its route is currently a foundation page. A blocker is a broken or misleading behavior inside functionality that is already implemented/approved, incorrect persistence, authorization/RLS failure, duplicate state, false success, broken navigation, or another defect meeting `docs/QA-AUTOMATION-POLICY.md`.
