# Vercel + Marketplace + Footer Sprint

Status: ACTIVE EXECUTION BRIEF

## Objective

Fix the Vercel deployment-classifier bug, redesign the Marketplace into a credible ecommerce-style experience, and compact the site footer. Work from current `main` and preserve existing product, security, auth, and accessibility behavior.

This brief is intended to be executed by Claude Code, Codex, or another repo-capable agent. It should be used together with:

- `docs/AI-CONTROLLER.md`
- `docs/AI-HANDOFF.md`
- `docs/AI-OPERATING-PROTOCOL.md`
- `docs/OPEN-ITEMS-2026-09-12.md`

Do not work directly on `main`. Create and use branch:

`fix/vercel-deploy-classifier`

---

## Part 1 — Fix the Vercel deployment-classifier bug

### Confirmed production symptom

Vercel cloned current `main`, ran:

`bash scripts/vercel-ignore-build.sh`

and canceled the production deployment because the script reported:

`No deployed frontend artifact change detected; skip Vercel build.`

This classification was wrong. PR #135 contained substantial deployed product changes, including marketplace UX changes, giving UI, LostPaws cleanup/rewrite, RAVE Shelter navigation changes, legal/footer work, and other frontend changes.

### Required outcome

Determine the exact root cause and fix the classifier robustly.

The deployment logic must:

- preserve `[deploy]` as an explicit force-build mechanism;
- continue skipping genuinely docs-only/control-plane-only commits where safe;
- correctly detect undeployed product changes even when one or more docs-only commits occur after a product merge;
- not rely only on the current commit's changed files if that can hide an undeployed product delta;
- avoid simply changing the system to "always deploy";
- use a reliable comparison baseline that represents what production actually has versus what current `main` contains;
- fail safe toward building when classification is ambiguous rather than silently skipping real product changes.

Reproduce the PR #135 scenario using actual Git history before changing the script.

Add regression coverage for at least:

1. product merge followed by docs-only commit => must still deploy if the product delta is not yet deployed;
2. docs-only commit with no undeployed product delta => may skip;
3. explicit `[deploy]` => must build;
4. any existing `[skip deploy]` behavior must not suppress a real undeployed product delta.

Make the smallest robust fix and document the exact root cause.

---

## Part 2 — Redesign the Marketplace into a real ecommerce-style experience

The current Marketplace still feels too much like a content/blog experience rather than a credible marketplace/store.

This requires a meaningful UX redesign, not cosmetic copy edits.

### Problems to fix

- the top hero/header is too large and consumes too much vertical space;
- there is too much explanatory copy before users reach offers;
- filters feel heavy and not streamlined;
- offer cards are not yet dominant enough;
- the page needs to scan quickly on desktop and mobile;
- Pet/RAVE audience behavior must remain intact;
- category and sort functionality should remain useful but become more compact;
- do not regress accessibility, touch targets, filtering, or current offer-channel behavior.

### Desired direction

Rework `/marketplace` so the hierarchy feels closer to a polished ecommerce storefront:

- compact marketplace title/header;
- minimal supporting copy;
- immediately visible offer count or useful status context where available;
- compact audience selector;
- streamlined filter/sort bar;
- strong card grid/list presentation;
- clear category/filter chips or controls without large stacked panels;
- useful mobile filter disclosure/drawer pattern;
- cards should emphasize vendor/business, offer title, meaningful image where available, category, offer/value terms, and clear CTA;
- reduce visual noise and excessive empty space;
- preserve brand identity while making the layout feel transactional rather than like a landing page.

Do not invent fake products, fake savings, fake vendor data, or unsupported discount claims.

Prefer existing design-system components and current marketplace data rather than adding unnecessary dependencies.

Run visual checks at minimum for:

- 390px mobile;
- tablet portrait;
- desktop;
- `/marketplace?channel=pet`;
- `/marketplace?channel=rave`;
- unfiltered marketplace behavior.

---

## Part 3 — Fix the footer sizing and spacing

The footer is too tall, oversized, and visually heavy.

Redesign it to be significantly more compact while keeping all important navigation and legal links.

### Footer goals

- reduce vertical padding substantially;
- reduce unnecessary spacing between sections;
- reduce oversized logo/text treatment;
- improve horizontal use of space on desktop;
- stack cleanly on mobile without becoming excessively tall;
- keep Privacy, Terms, Data Deletion, Support, and major navigation links easy to find;
- maintain accessible text sizes and touch targets;
- keep ShelterPawtners ownership/brand clear without turning the footer into another hero section.

The footer should feel like a professional SaaS/ecommerce footer, not a large content block.

Do not remove required legal/non-affiliation links or weaken accessibility.

---

## Execution order

Work in this order:

1. deployment-classifier diagnosis and fix;
2. marketplace redesign;
3. footer redesign;
4. regression testing;
5. controller/handoff update.

Make separate commits for:

- deployment classifier;
- marketplace redesign;
- footer redesign;
- tests/docs if needed.

Do not stop for routine design preferences. Use current product direction and make the strongest reasonable professional UX decision, then present it for owner review after implementation.

---

## Safety / guardrails

Do not touch:

- Meta/Facebook setup;
- Microsoft 365 DNS;
- production secrets;
- charitable money movement;
- OD-003 verified-savings policy;
- OD-004 payment/giving-provider implementation;
- the unrelated intermittent sign-out race.

Preserve:

- Google OAuth behavior;
- current RLS/security;
- Pet vs RAVE marketplace filtering;
- Events behavior;
- LostPaws / RAVE / Seven Star routing;
- current legal routes;
- mobile accessibility.

Do not weaken tests to make CI green.

---

## Verification

Run all relevant checks, including at minimum:

- typecheck;
- lint;
- unit tests;
- marketplace-related tests;
- public/browser tests;
- production build;
- shell/regression tests for `vercel-ignore-build.sh`;
- mobile visual checks;
- GitHub Pages build compatibility.

If Vitest discovers duplicate checkout folders or other known local-environment noise, isolate the real root suite and document the noise rather than treating it as a product failure.

---

## Finishing

When the work is complete:

- push `fix/vercel-deploy-classifier`;
- open a PR into `main`;
- ensure CI is green;
- under the owner's standing merge authorization, merge if the changes are safe and required checks pass;
- update `docs/AI-CONTROLLER.md`;
- update `docs/AI-HANDOFF.md`;
- run Prettier on controller/handoff files before committing.

Final report must include:

- exact Vercel classifier root cause;
- exact fix;
- changed files;
- marketplace UX changes;
- footer changes;
- tests run/results;
- PR number;
- merge SHA if merged;
- whether GitHub Pages reflects the new UI;
- whether production is ready for one Vercel deployment verification;
- any remaining owner decision that truly blocks progress.
