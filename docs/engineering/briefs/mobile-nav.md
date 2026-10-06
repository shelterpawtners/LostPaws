# Brief A - Mobile single-column Dashboard (account/role pages)

Branch worktree owner: Claude Code. Repo rules: AGENTS.md, .github/instructions/frontend.instructions.md.

## Goal

`Dashboard()` in src/main.tsx currently renders `.dashboardGrid` = `<aside class="rolePanel">` (280px left sidebar of roles) + `.dashboardMain`. Replace with a SINGLE column at every width: a top section/role switcher, then content full width.

## Requirements

- New reusable `src/components/AccountSectionNav.tsx` (+ styles in src/account-nav.css imported by it). Props: items [{id,label,icon?}], activeId, onSelect, optional `footer` node (for "Add another role"), `label` (aria-label).
- Mobile (<640px): compact "menu" disclosure button showing the current item with a chevron; opens an in-flow list (not an overlay trap), closes on select/Escape, aria-expanded/controls. >=640px: horizontal scrollable tab row (scroll-snap), active item clearly marked, `aria-current`.
- 44px min touch targets, visible focus, prefers-reduced-motion respected, no horizontal page overflow at 320px.
- Dashboard: use it for roles; move "Add another role" into the nav footer. Remove the `.rolePanel` two-column rules in src/styles.css for Dashboard (keep other uses of .rolePanel/.role intact; grep first).
- Do NOT touch src/components/OfferManager.tsx (another agent owns it) or e2e/**.
- Do not invent any product facts/copy beyond labels already present.

## Done when

`npm run check` and `npm run build` pass; no existing unit test weakened.
