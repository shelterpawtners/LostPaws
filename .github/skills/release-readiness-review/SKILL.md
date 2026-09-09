---
name: release-readiness-review
description: "Run a broad ShelterPawtners pre-release review across product value, critical routes, responsive UX, accessibility, auth/persona flows, browser errors, security evidence, and production-hosting readiness. Use before domain cutover or major public release."
---

# Release Readiness Review

Use this skill before ShelterPawtners domain cutover or a major public release. This is broader than feature acceptance.

## Goal

Answer: **Would we be comfortable putting real Guardians, shelters, and PetBiz users on this exact build?**

## Review areas

### 1. Product/value

- Marketplace communicates compelling and truthful value.
- Primary Guardian and PetBiz journeys are understandable without internal product knowledge.
- Empty/demo/placeholder content does not create false production claims.
- Critical calls to action are clear.

### 2. Public routes

Verify relevant public entry points, including homepage, registration, login/recovery, Marketplace, offer/partner details, RAVE landing, and legacy QR destinations.

### 3. Persona/auth flows

Validate critical Guardian/PetBiz/shelter/admin boundaries using existing persona tests and targeted human-style review. Preserve RLS and authorization expectations.

### 4. Responsive + visual quality

Use the `responsive-visual-qa` skill. Review representative phone/tablet/desktop widths and critical interaction states.

### 5. Accessibility

- keyboard completion of critical flows;
- visible/logical focus;
- labels/errors/status communication;
- WCAG 2.2 AA contrast/non-text expectations;
- reduced-motion behavior where motion exists;
- axe/automated checks where configured.

### 6. Browser/runtime quality

- no unexplained console errors on critical routes;
- no failed critical network requests;
- no broken images/assets/routes;
- loading/error/retry states behave intentionally.

### 7. Deterministic engineering evidence

Review applicable CI, unit/build, Playwright, database/RLS, dependency, and CodeQL results. Do not waive a legitimate failing gate merely because the UI appears correct.

### 8. Hosting/release

- exact accepted commit identified;
- Vercel production deployment is READY and main-backed;
- production alias responds successfully;
- environment variables/config are correct for the intended environment;
- domain/DNS changes remain separately owner-authorized.

## Severity

Classify findings:

- **P0 blocker:** security/data-loss/auth failure or unusable critical journey.
- **P1 blocker:** major functional/accessibility/value defect that should stop public cutover.
- **P2 important:** visible quality/usability defect that should be fixed before broad promotion when practical.
- **P3 follow-up:** polish/optimization that does not block MVP release.

## Output

Provide:

- exact build/commit reviewed;
- routes/personas/viewports tested;
- deterministic evidence reviewed;
- P0–P3 findings;
- final verdict: `BLOCKED`, `READY_WITH_P2_FOLLOWUPS`, or `READY_FOR_OWNER_CUTOVER_DECISION`.

Never perform DNS/domain cutover as part of the review unless separately authorized.
