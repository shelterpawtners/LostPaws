# Brief C - Update e2e for new UI + add mobile specs

Own ONLY e2e/**. Do not edit src/**.

## Context

- Dashboard no longer uses `.rolePanel`; it uses `AccountSectionNav` (src/components/AccountSectionNav.tsx): mobile <640px is a disclosure button, >=640px a tab row.
- OfferManager (src/components/OfferManager.tsx) now has: Audience/Title/Deal-description/photo in a quick form; everything else (Terms and conditions, How customers use it, Per-user limit, dates, event, etc.) inside a collapsed `<details>` "Add optional details" (summary text "Add optional details"). Buttons: "Save & publish", "Save draft", "Preview"; the old "Save new version" and "Publish or schedule" buttons were removed. Offers are picked from a top "Your offers" panel, not a left sidebar.

## Tasks

1. Update every spec using the old UI (grep e2e for "Save new version", "Publish or schedule", `.rolePanel`, and labels now inside the disclosure). Open the disclosure (click summary "Add optional details") before touching hidden fields. Map Save new version -> Save draft; Publish or schedule -> Save & publish (check src for the exact success status text). Keep assertions' intent; never weaken a valid assertion.
2. Fix hosted-design-qa.spec.ts dashboard checks to assert the new nav instead of `.rolePanel` position.
3. Add e2e/mobile-account-layout.spec.ts: at 360x740 and 390x844 for /dashboard and /partner/offers (use the same auth/mocking patterns as existing local specs; skip with test.skip when the suite needs hosted creds like sibling specs do) assert no horizontal overflow (document scrollWidth <= innerWidth), single column (nav above content), and nav menu opens/closes by keyboard.
4. Run `npx tsc --noEmit -p e2e` or the repo's typecheck/lint (`npm run check`), plus `npx playwright test --list` to ensure specs compile. Commit locally; do not push.
