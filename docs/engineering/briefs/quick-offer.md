# Brief B - Quick Offer (minimal required fields) + mobile offer list
Owner: Claude Code. Repo rules: AGENTS.md, frontend instructions. Own ONLY src/components/OfferManager.tsx and the `.offerManagerPage` rules in src/styles.css (+ optional src/components/offer-manager.css).
## Goal
Creating an offer today shows ~25 fields at once beside a left sidebar of offers. Make drafting+publishing need minimum input, and make the page single column on mobile.
## Requirements
1. Server contract (do NOT change DB): create/revise need title+summary; publish needs title, summary, terms, redemption_instructions non-empty (set_partner_offer_state). Existing #300 RAVE behavior must keep working.
2. Default "Quick offer" view: Audience, Title, Short summary, optional photo upload (existing upload logic) and a primary "Save & publish" button (save then publish; surface any server error via the existing status region). A secondary "Save draft" stays.
3. Everything else (dates, limits, event, product link, label/CTA, extra images, details, terms, redemption instructions, disclosure, source URL) goes in a collapsed "Add optional details" disclosure (`<details>` or button with aria-expanded). Keep existing field state/names so RPC payloads are unchanged.
4. When terms / redemption_instructions are empty at publish time, fill with honest generic defaults: terms "Offer is provided by the business and subject to availability." redemption "Show this offer to the business to redeem." No fabricated discounts/claims. Mark them in the UI as editable defaults.
5. After successful publish, show a short optional checklist (photo, link, dates, limits, event) linking to the disclosure.
6. Layout: replace the left offers `aside` with a top "Your offers" control (select or compact list + "New offer" button) so the page is ONE column at all widths; full-width form; 44px targets; no horizontal overflow at 320px; keep accessible names/labels (existing tests/e2e rely on labels - keep label text for retained fields; update tests only where UI intentionally changed).
7. Do NOT touch src/main.tsx or the Dashboard.
## Done when
`npm run check` and `npm run build` pass; add/adjust unit tests only for new pure helpers.
