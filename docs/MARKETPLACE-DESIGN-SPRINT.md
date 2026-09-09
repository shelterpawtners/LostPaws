# Marketplace Design Sprint

## Status

Issue #27 is the active Marketplace design-hardening sprint. This sprint is code-first and uses the existing Vercel/Playwright review loop. Figma is not a prerequisite.

## Baseline evidence

The Stream 3 desktop/phone/tablet evidence shows a functional but commercially weak Marketplace:

- cards are almost entirely text;
- four narrow desktop columns make titles and metadata difficult to scan;
- every offer carries nearly identical visual weight;
- merchant identity is buried inside body copy;
- eligibility, classification, location/applicability, expiration, terms, source, and CTA compete rather than forming a hierarchy;
- repeated disclaimer language consumes card space;
- the current search field and channel controls do not provide the discovery experience implied by their appearance;
- mobile becomes a very long wall of similar records.

The problem is not lack of decoration. It is weak information scent and weak perceived value.

## Research inputs

Current UX research and live marketplace patterns point to a consistent set of principles:

- Baymard product-list/filtering research: filters are fundamental to narrowing a catalog; applied-filter state should remain visible; list items need enough decision-making information without forcing users to open every detail page. https://baymard.com/blog/collections/product-list
- Baymard 2026 mobile research: mobile needs clear search controls and visible applied-filter state rather than hiding all context behind a filter drawer. https://baymard.com/blog/mobile-ux-ecommerce
- Baymard pet-food/care guidance: thematic filters and pet-specific attributes improve product finding in this category. https://baymard.com/audits/pet-food-and-care
- Nielsen Norman ecommerce trust research: professional presentation, reliable search, company/provider information, and the right amount of product detail materially affect credibility. https://www.nngroup.com/reports/ecommerce-ux-trust-and-credibility/
- Groupon current local-deal experience: cards make the benefit, merchant, location, requirements, and action highly scannable; browse starts with categories/location rather than an undifferentiated feed. https://www.groupon.com/local
- Groupon engineering's category-first redesign notes: moving from a generic deal feed toward category-led discovery improved information scent and made filtering more visible. https://medium.com/groupon-eng/cx90-rethinking-redesigning-and-reimplementing-the-groupon-user-experience-59a03b6c306c

ShelterPawtners should use these as principles, not copy competitor visual design.

## Guardian jobs-to-be-done

Within a few seconds, a Guardian should be able to answer:

1. **What do I get?** — title/benefit and concise summary.
2. **Who provides it?** — PetBiz/provider identity near the top of the card.
3. **Who can use it?** — eligibility shown as compact metadata.
4. **What kind of listing is it?** — existing classification translated into readable language.
5. **Where does it apply?** — existing applicability values shown clearly.
6. **Is it current?** — expiration/end date surfaced before the detail page when available.
7. **Why should I trust this listing?** — source/current-terms path and a global Marketplace disclosure rather than repetitive legal copy dominating every card.
8. **What do I do next?** — one obvious `View offer` action.

## MVP Marketplace information architecture

### 1. Marketplace hero

- ShelterPawtners Marketplace eyebrow
- existing headline: **Find value that fits your world.**
- short value statement explaining that the Marketplace gathers useful pet/guardian offers with clear provider and terms context
- prominent search

### 2. Discovery controls

For this sprint, use only data already exposed to the public Marketplace query:

- keyword search across title, summary, provider, terms, classification, eligibility, and applicability;
- dynamically generated classification filters;
- visible result count;
- existing RAVE query state can influence presentation but must not pretend to filter by channel unless the public query actually exposes channel metadata.

Do not invent categories or filters that the data cannot support yet.

### 3. Offer-card hierarchy

Order of attention:

1. visual/brand treatment generated from ShelterPawtners design language — no fabricated provider image;
2. eligibility + existing classification;
3. provider identity;
4. offer title;
5. concise summary;
6. applicability/location context and end date when present;
7. CTA;
8. source/disclosure context on the detail page or global Marketplace notice.

### 4. Detail page

Preserve current terms, redemption instructions, source link, disclosure, claim, and redemption behavior. The design sprint must not change server-side eligibility or redemption rules.

## Data boundary

`PublicOffer` currently exposes:

- offer/provider IDs;
- `business_name`;
- title, summary, details, terms;
- classification;
- eligibility kind;
- start/end timestamps;
- redemption instructions;
- source URL;
- disclosure;
- applicability.

This sprint does **not** add schema fields.

Do not fabricate or visually imply unavailable structured data such as:

- guaranteed savings amount/percentage;
- original/current price;
- provider logo/photo;
- rating or review count;
- precise distance;
- verified savings totals;
- shelter-impact totals;
- exclusive-partnership status.

Those can become future data-model/product decisions only after owner review.

## Three code-first concept directions

### A — Value-first Deal Feed

Goal: fastest scanning and strongest immediate offer hierarchy.

- bright branded visual band on each card;
- benefit/title dominates;
- provider immediately visible;
- compact eligibility/classification metadata;
- 3-column desktop / 1-column phone rather than the current dense 4-column layout;
- prominent search/filter toolbar;
- direct `View offer` CTA.

Best if ShelterPawtners wants the Marketplace to feel energetic and commerce-forward.

### B — Local + Trust Marketplace

Goal: make provider credibility and listing context the differentiator.

- darker/premium shell;
- trust/context rail explaining listing classifications and provider/source expectations;
- wider, more editorial offer rows/cards;
- provider identity and applicability emphasized before secondary copy;
- fewer items visible at once, but more confident scanning.

Best if trust and local PetBiz relationships become the core brand differentiator.

### C — Curated Guardian Savings Hub

Goal: feel more like a curated membership/value destination than a coupon grid.

- editorial introduction and larger opening offers;
- first current offers receive larger layout treatment only for visual exploration, not a fabricated ranking claim;
- remaining offers transition into a calmer grid/list;
- strongest use of ShelterPawtners iridescent visual identity and content hierarchy.

Best if the product should feel like a premium Guardian benefit hub rather than a high-density deals site.

## Prototype rule

The three concepts may be selected with a preview query parameter on the Issue #27 branch. The selector is a sprint-review device, not a committed production feature. After owner/product-critic selection, remove the prototype selector and harden the winning direction.

## Storybook trigger

Do not introduce Storybook merely to prototype these concepts. Add Storybook after the winning direction has enough reusable component/state complexity that isolated development becomes faster than reviewing through the Marketplace route.

## Acceptance for Sprint 1

- three materially different working concepts;
- keyword search and honest classification filtering using existing data;
- responsive phone + desktop behavior;
- no fabricated values or claims;
- existing offer detail/claim/redemption behavior preserved;
- Stream 3 axe/runtime/network QA applied;
- independent product/design critique before selecting a winner.
