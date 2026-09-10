# Guardian + Marketplace Launch UX Polish

Status: ACTIVE
Issue: #53
Branch: `ux/guardian-marketplace-launch-polish`

## Owner direction

Use a hybrid consumer/dashboard experience leaning consumer-app: photo-forward, emotionally engaging and easy to scan, while still exposing the important completion/status/action information without drilling into every detail.

No Figma prerequisite. Implement directly in the working app using the existing stack and design system.

## Slice 1 — Guardian shell + account control center

1. Reduce top padding and page-title scale so useful content starts higher in the viewport.
2. Add a horizontal Guardian-area navigation pattern:
   - Overview
   - Pet Passports
   - Guardian Profile
   - Activity / ReWards
3. Replace the generic authenticated header CTA with a profile/avatar menu that becomes the single landing place for:
   - My Dashboard
   - Guardian Profile
   - Pet Passports
   - Profile Completion
   - Notifications & Reminders
   - Settings
   - Help / Getting Started
   - Sign out
4. Keep future appearance controls (Light / Dark / System) inside Settings; do not block this slice on theme implementation.
5. Ordinary Guardian-facing primary UI should not devote dashboard real estate to role-management controls.

## Slice 2 — Guided first-use + completion model

Create a lightweight, dismissible guidance layer using existing user/profile state where possible before introducing schema changes.

Candidate completion items:

### Guardian
- Add profile photo
- Complete contact details
- Confirm communication preferences

### Pet Passport
- Add primary pet photo
- Complete Pet Basics
- Add adoption details
- Complete shelter verification
- Add available care/medical basics

Requirements:
- each item links directly to the relevant edit surface;
- completed items visibly resolve or move to completed state;
- first-use tips/coach marks may be dismissed;
- include a `Don't show these tips again` control;
- preference should eventually persist per user across devices, but use an existing safe preference mechanism first if available and document any schema need before migration;
- no modal wall that blocks normal redemption, Passport or Marketplace use.

## Slice 3 — Guardian dashboard density + imagery

Target above-the-fold composition:

- Guardian identity/photo + completion summary;
- primary Pet Passport visual card with large pet image, name, adoption/verification state and next action;
- concise task/next-best-action area;
- pet thumbnail strip/cards for multi-pet households;
- compact Marketplace/ReWards/value entry point;
- recent activity / Deal Moments summary.

Detailed records remain drill-down. Use cards as concise summaries, not long forms.

## Pet communication identity rule

Do not model a required fictional email address for a pet.

Communication routing should resolve through the responsible existing relationship:
- Guardian email when a Guardian is the responsible owner/contact;
- Shelter/rescue contact before transfer/adoption when the Shelter is the responsible party.

Audit the current Pet Basics field and persistence path before any migration. Do not invent a new guardianship/ownership model.

## Slice 4 — Marketplace density

Preserve the current RPC/search/filter/source/claim/detail behavior and refactor presentation first.

1. Cut hero/header vertical footprint substantially and reduce headline size.
2. Bring inventory into the first viewport on common desktop sizes.
3. Add accessible Grid / List view controls.
4. Compact cards around a fixed scan order:
   - provider logo/mark
   - listing/source type
   - concise offer title
   - one-line benefit/value statement
   - eligibility/category/location tags
   - source/verification signal
   - primary CTA
5. Keep detailed terms on drill-in.
6. Use legally/technically appropriate logos and imagery where available; otherwise use a clean branded fallback mark.
7. Preserve truthful eligibility/source language and avoid OD-003 savings claims.

## Acceptance

- Existing LL-1 through LL-6 behavior remains closed and unchanged absent regression evidence.
- Preserve Deal Moments, profile/persona continuity, RLS and claim/redemption truth.
- No weakened tests/RLS.
- Add/update targeted desktop + mobile browser coverage for intentional navigation/layout changes.
- Validate keyboard navigation, focus states, labels and responsive behavior.
- Keep implementation in small reviewable commits/PR slices if the change set becomes large.

## Parallel owner work

Engineering proceeds on this branch while owner/provider-console work continues. Return to the owner when the next manual provider step is required (password-recovery acceptance, then Google OAuth and supported Meta/Facebook auth).
