---
name: responsive-visual-qa
description: 'Validate ShelterPawtners UI changes visually and behaviorally across representative phone, tablet, and desktop sizes. Use for screenshots, responsive review, interaction-state review, overflow checks, content-density checks, and before/after visual evidence.'
---

# Responsive Visual QA

Use this skill for any material customer-facing UI change.

## Representative viewports

At minimum review near:

- phone: 390 x 844;
- tablet: 768 x 1024;
- desktop: 1440 x 1000.

Use additional widths when a layout has known breakpoint-sensitive behavior.

## Workflow

1. Capture the existing/before state when practical.
2. Capture the changed/after state at the same viewport(s).
3. Review the entire page, not only the changed component.
4. Interact with filters, menus, modals, forms, cards, and route transitions affected by the change.
5. Check keyboard navigation and visible focus.
6. Inspect loading, empty, error, selected, disabled, hover/focus, and success states where applicable.
7. Check browser console/network failures when tools permit.
8. Run relevant Playwright coverage.

## Visual checks

Flag:

- horizontal overflow;
- clipped text/images/actions;
- unreadable line lengths or tiny type;
- touch targets below practical 44px sizing;
- inconsistent card heights caused by avoidable layout errors;
- excessive whitespace that hides value;
- cramped density that prevents scanning;
- weak hierarchy;
- broken image crops/aspect ratios;
- sticky/filter/nav elements consuming too much mobile viewport;
- components that look intentional on desktop but merely compressed on mobile;
- inconsistent focus/hover/active states.

## Marketplace checks

At each viewport verify:

- offer value remains the strongest card signal;
- PetBiz identity is visible;
- supporting metadata does not overpower the headline/value;
- primary action remains obvious and reachable;
- filters/search remain usable;
- cards do not collapse into repetitive low-information tiles;
- category/featured/impact elements preserve hierarchy rather than becoming decorative clutter.

## Evidence

Record:

- tested URLs/routes;
- viewport dimensions;
- screenshot names/links when available;
- failures by severity;
- whether each issue is visual-only, usability, accessibility, functional, or content/data related.

Do not approve a UI solely because automated unit/build checks pass.
