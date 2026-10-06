# S4 - global CSS + remaining pages: before/after notes

Verified with Playwright (`npm run test:e2e`) screenshots at 360/390/768px against the
local dev server. Screenshots were used for review only and were not committed (no
screenshot assets exist elsewhere in `docs/`).

## 1) Single-column collapse raised to <=1023px

**Before:** `.fields`, `.signup`, `.partnerOnboardingGrid`, `.passportLead`, `.cards`,
`.offers`, `.connect`, `.nextCards`, `.heroGrid` only went single-column at 700px (or
900px for `.signup`/`.cards`). Between ~701-1023px (phones in landscape and every
tablet in portrait) these rendered as cramped 2-column grids — e.g. the Register/Login
`.signup` aside+form pair, and `.fields` two-up form rows.

**After:** all nine classes collapse to one column at <=1023px via a single consolidated
media query in `src/styles.css`. Confirmed at 768px: `/register?type=guardian` and
`/login` render the signup card as one column (icon/copy aside above the form, not
beside it); `.fields` rows in Admin QA / Redemption stack too.

## 2) Marketplace/Learn "sidebar" card grids

**Before:** cards pairing a fixed-width thumbnail with body copy only stacked below
800px (marketplace.css `.marketOfferCard-trust`, `.marketOfferCard-curated`,
`.marketplaceDetailPage .marketOfferCard-featured`), below 980px
(marketplace-premium.css `.marketplaceHeroLayout`/`.marketplaceDiscovery`), or never
stacked at all (marketplace-launch-density.css list view, which only narrowed its
150-190px thumbnail column down to 92px on phones). `learnCalcLayout` in Learn.css
stacked only below 780px.

**After:** all of these now stack at <=1023px, consistent with the tablet-inclusive
rule. The launch-density list view now stacks its thumbnail above the body instead of
squeezing it into a 92px column. `SupportPage.css`'s `.supportGrid` (form + contact
aside) got the same treatment, raised from 860px to 1023px, since it's the same
sidebar shape.

## 3) Auth pages and the events add-event form

- All plain `<input>`/`<select>` elements get an explicit `font-size: 16px` (global
  rule in `styles.css`, plus matching rules in `Events.css`, `SupportPage.css`, and
  `Learn.css` for their own scoped forms) so iOS Safari never auto-zooms on focus.
- Email fields across Register/Login/ForgotPassword now carry `inputMode="email"` in
  addition to the existing `type="email"`/`autoComplete="email"`, and form fields carry
  `enterKeyHint` ("next" between fields, "go" on the field before submit).
  `PasswordField` gained an `enterKeyHint` passthrough prop for this.
- `ForgotPassword` and `ResetPassword` submit buttons were missing the `full` class
  that `Signup`/`Login` already used; they're full-width now too.
- The events add-event form (`EventsPage.tsx`/`Events.css`) is a 10-field form plus a
  photo upload, long enough on a phone to lose the submit button below the fold. Its
  submit button now lives in a `.evFormActions` wrapper that becomes a sticky,
  full-width, safe-area-padded bottom bar at <=700px; `.evFormGrid` also collapses to
  one column at <=1023px (it previously used `repeat(auto-fit, minmax(220px, 1fr))`,
  which packed 2-3 columns on a tablet).

## 4) Horizontal overflow at 320px

Found and fixed one real case: `RedemptionFlow`'s camera-scan `<video>` element had no
width rule, so the browser's default replaced-element size (300px) overflowed once the
`.panel` padding was subtracted from a 320px viewport (292px shell - 54px panel padding
= 238px available). Added a `.qrPreview` class (`width: 100%; max-width: 360px`) and
applied it to the element.

Swept the rest of the owned pages at 360/390/768 via Playwright screenshots
(login, register, forgot-password, events, support, marketplace, learn/savings-explorer)
plus the existing `e2e/uat-193-mobile-funnel.spec.ts` overflow assertions at
375/390/414/768px — all pass with no `scrollWidth > clientWidth`.

## Scope notes

- Marketing-only hero grids outside the task's explicit line list (e.g.
  `HeroVendor.css` `.hvSplit`/`.hvHeroGrid`, `Learn.css` `.learnHeroGrid`,
  `SevenStarSheltersPage.css`, `RaveShelterMission.css`, `LostPawsActivation.css` hero
  grids) were intentionally left alone — they're decorative two-column heroes, not
  forms or sidebar/rail layouts, and weren't named in the brief's task list. No
  overflow issues were found in them at 320-768px.
- `store/*` has no UI (data/logic only); nothing to change there for this slice.
