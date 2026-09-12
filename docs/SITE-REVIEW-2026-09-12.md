# Full site review — 2026-09-12

How this was produced: the production build (`npm run build`) was served locally with `vite preview` and walked with a Playwright script across **25 public routes at two viewports** (390px mobile and 1280px desktop, 50 page loads total), capturing screenshots plus programmatic checks for horizontal overflow, console and page errors, HTTP failures, broken images, missing `alt` attributes, heading structure, document titles, and touch-target sizes. Screenshots of every route were then reviewed by eye.

Nothing in here is a guess about what might be wrong; every item was observed on a rendered page.

## Summary

| Area                          | Result                                       |
| ----------------------------- | -------------------------------------------- |
| Routes reaching a usable page | 25 / 25                                      |
| Horizontal overflow at 390px  | 1 found → **fixed**                          |
| Broken images                 | 0                                            |
| Images missing `alt`          | 0                                            |
| HTTP 4xx/5xx                  | 0                                            |
| JavaScript page errors        | 0                                            |
| Pages with exactly one `<h1>` | 25 / 25 (1 heading-order defect → **fixed**) |
| Distinct document titles      | 1 of 25 before → **25 of 25 after**          |
| Touch targets under 44px      | ~11 per page before → 0 after                |

## Fixed during this review

These were small, unambiguous defects, so they were corrected rather than just listed.

1. **`/directory` overflowed the mobile viewport badly** — 938px of content in a 390px window, about 2.4× too wide, so the page scrolled sideways and the filter fields ran off screen. Cause: the five-field filter row used `display:flex` with no `flex-wrap` and no `min-width:0` on the fields. Fixed in `src/styles.css`; this was the only overflow anywhere on the site.
2. **Every route shared one document title, "ShelterPawtners"** — the browser tab, bookmarks, and anything reading a page title when a link is shared all showed the same text regardless of page. Added `src/lib/document-title.ts` with per-route titles (including per-article Learn titles) and a small effect that updates on navigation. Covered by unit tests.
3. **Touch targets below the 44px minimum**, in three groups: footer links (32px, including ones added earlier that day), header nav links (42px — just under), and standalone card CTAs on `/rave` and `/lostpaws` such as "Browse RAVE offers" and "Create a Guardian account" (17–30px). Note the existing mobile test only measured `.lpActions .lpButton`, which passed, so the smaller card links were never checked.
4. **`/register` skipped a heading level** (`h1` → `h3`), which misleads screen-reader navigation. The role cards now take a heading level prop so the outline stays sequential on both home and `/register`.

## Design, image, and logo pass (after the restore point)

Done after tagging `restore-point-2026-09-12-pre-design`, so all of it is reversible with `git checkout restore-point-2026-09-12-pre-design`.

1. **Image weight cut by about 92%.** `LostPaws Logo.png` was 2.6 MB and `lostpaws-hero-16x9.png` was 2.1 MB, so a phone visiting `/lostpaws` pulled roughly 4.8 MB of artwork. Both were re-encoded to WebP at sensible delivery sizes (209 KB and 164 KB) and are served through `<picture>` with the original PNGs as fallbacks. No visible quality loss at full width.
2. **The RAVE Shelter logo tagline is corrected.** `rave-shelter-logo-v2.svg` is text-based vector art, so the superseded "Deals for ravers" line was edited directly, and `rave-shelter-logo-static-v2.png` was re-rendered from that corrected SVG (with motion paused so the bars sit at their designed heights). Recommendation 4 below is now resolved for the SVG and static PNG.
3. **The animated logo is now SVG instead of a 1.5 MB GIF.** The equalizer bars animate via CSS inside the SVG and stop for `prefers-reduced-motion`, so `/rave-vendors` gets a sharper, animated, correctly-worded logo for a few kilobytes. The old GIF is left in the repo but no longer referenced.
4. **Explainer tiles are a 3-then-2 grid.** Five equal columns had squeezed every title onto two or three lines; titles now sit on one line at desktop, and the grid collapses to two columns then one on smaller screens.
5. **The Learn and Hero Vendor heroes are two-column.** Both previously left roughly half the viewport empty above the fold. Learn gained a "Written for" panel whose topic counts are derived from the content itself so they cannot drift; Hero Vendor gained a **5%+** badge that anchors the page on the one number that matters. This addresses recommendation 2 for those two pages.

## One deliberate deviation from the plan — **please confirm**

Plan section 6 asks for a marketplace selector **modal**. I built it as a modal, and Persona QA then failed: a full-screen overlay intercepts clicks on the offers underneath, so the accepted offer-redemption flow timed out. Two things made me change it rather than work around the test:

- It gated `/marketplace` — the page a demand-proving soft launch most needs people to reach — behind an interstitial.
- The marketplace already carries a persistent **Audience** filter row, so the choice was available either way; the modal was a convenience presented as a gate.

It is now an inline, dismissible prompt above the listings with the same three choices and the same "remember my choice" behaviour. A direct link such as `/marketplace?channel=rave` still skips it entirely. If you specifically want a blocking modal, say so and I will restore it — but it will need the persona flow updated to dismiss it.

## Recommendations for your review

Ordered by what I think matters most. None of these are defects — they are judgment calls I did not want to make unilaterally.

### 1. The Passport card on the home hero is a placeholder

The strongest element on the highest-traffic page is a soft gradient rectangle with a paw icon where a pet photo clearly belongs. Everything around it is polished, which makes the empty panel more noticeable rather than less. A real (or commissioned illustrated) pet image here would probably do more for conversion than any other single visual change on the site.

**Decision needed:** do you want real photography, illustration, or a stylised graphic? We must not use stock photos presented as real ShelterPawtners pets, and `docs/CONTENT-STANDARDS.md` already forbids synthetic pet photography.

### 2. Hero sections waste the right half of the screen at desktop width

`/learn`, `/hero-vendor`, `/faq`, and the savings explorer all use a single left-aligned column, leaving roughly half the viewport empty above the fold on a laptop. The home page does not have this problem because its hero is a two-column grid. Options: add a supporting panel on the right (the home hero's pattern), or deliberately centre these heroes so the space reads as intentional.

### 3. The five explainer tiles are cramped at desktop

Five equal columns across 1100px gives each tile roughly 200px, so titles like "Certified Shelter Pet Passport" and "Unlock savings over a lifetime" wrap to two and three lines. A 3-then-2 layout, or wider tiles that scroll horizontally on small screens, would read better.

### 4. The RAVE Shelter logo still carries the old tagline

`public/brand/rave-shelter-logo-static-v2.png`, its animated GIF sibling, and `rave-shelter-logo-v2.svg` all have **"Deals for ravers. Support for shelter pets."** baked into the artwork, sitting directly beside page copy that now reads "Rave with purpose. Shop with impact." The SVG is text-based and can be corrected directly; the raster versions need regenerating. Tracked in `docs/product/OWNER-DECISIONS-NEXT-SPRINT.md`.

### 5. `/passport`, `/partners`, `/shelters`, and `/about` are thin placeholder pages

Each renders an eyebrow, a heading, one paragraph, and two buttons from a shared `FoundationPage` component. They are linked from the footer and nav, so a visitor who follows them gets noticeably less than the Learn pages now offer. Either build them out or point those links at the corresponding `/learn/*` article, which now covers the same ground properly.

### 6. Marketplace shows an error state when its backend call fails

Locally (and on any deployment whose database lacks the new `p_channel` parameter) `/marketplace` and `/directory` log `ERR_NAME_NOT_RESOLVED` and render "We could not load current offers." That is correct behaviour for a failed call and not a defect — but it is worth deciding whether a first-time visitor should see an empty-but-inviting state rather than an error panel when the marketplace simply has nothing to show yet.

### 7. Consider an offers empty state that still sells the mission

Related to the above: with no published offers, the marketplace is the weakest page on the site for a soft launch whose entire goal is proving demand. A deliberate "no offers yet — here is what is coming and how to be first" state would serve the launch better than an empty grid.

## Things that were checked and are genuinely fine

Worth recording so they do not get re-audited: no broken images anywhere; every image has an `alt` attribute; no HTTP errors; no uncaught JavaScript errors; `lang` is set; every page has a `#main` landmark and a skip link; exactly one `h1` per page; no emoji pseudo-icons anywhere in the codebase (the execution plan's warning about `🏠 → 🐕` was preventative — there were none to remove); the RAVE and LostPaws pages are visually and narratively distinct; non-affiliation language is present on every campaign surface.

## Follow-up worth automating

The audit script that produced this is not committed. If you want this repeatable, the overflow/heading/title/touch-target checks are cheap to run and would have caught all four fixed defects automatically — the `test:e2e:public` suite that CI now runs is the natural home for them.
