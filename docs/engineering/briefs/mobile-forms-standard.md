# Mobile-first forms standard (applies to every slice)

Goal: shelterpawtners.com must be MOBILE-FIRST for data-entry. Pet guardians must populate details and pet data FAST. Businesses (esp. RAVE Shelter vendors) must sign up quickly with just the basics (company name) and then make an offer, filling the rest later.
Read AGENTS.md and .github/instructions/frontend.instructions.md first. Reuse src/components/AccountSectionNav.tsx and the Quick Offer pattern in OfferManager.tsx (already on this branch).

## Rules

1. Forms are ONE column below 1024px (raise any 700/900px breakpoints that leave 2-3 columns on tablets), content max ~640px, no left rails/side navigation anywhere.
2. Inputs font-size >=16px (no iOS zoom), 44px min touch targets, full-width primary button, sticky bottom action bar for long forms (safe-area padding), visible focus, prefers-reduced-motion respected.
3. Progressive disclosure: required minimum first; everything else in a collapsed "Add more details later" `<details>`/accordion. Never block saving on optional data. Do NOT change DB/RPC/RLS contracts or add migrations; satisfy server-required fields with honest client-side defaults only where the server demands a value, never fabricating business claims.
4. Correct input types: inputmode, autocomplete, type=email/tel/url, enterKeyHint. Inline field errors via existing FormStatus/aria patterns; keep existing label text where e2e specs rely on it (grep e2e/ for a label before renaming; update specs only for intentional UI changes and never weaken assertions).
5. No horizontal overflow at 320px; wide tables/lists become stacked cards.
6. Own ONLY the files listed in your slice. Put new styles in a new per-component .css file you create (import it from your component) unless your slice owns src/styles.css. Keep edits inside your assigned functions in src/main.tsx (other agents edit other functions in the same file concurrently - do not reformat or move unrelated code).
7. Finish: `npm run check` and `npm run build` pass, run `npx prettier --write` on touched files, commit locally with a conventional message. Do NOT push.
