# ShelterPawtners + RAVE Shelter Dual Marketplace Execution Plan

Status: **OWNER-DIRECTED PRODUCT PLAN — implementation pending**  
Date: 2026-09-12  
Repository: `shelterpawtners/LostPaws`

This document is the controlling product plan for the next ShelterPawtners / RAVE Shelter marketplace and campaign sprint. It supersedes earlier interpretations where `/rave` and `/lostpaws` were treated as interchangeable or where LostPaws was described as a generic activation for the full festival community.

## 1. Product hierarchy

### ShelterPawtners

ShelterPawtners is the parent platform and pet/adoption ecosystem.

Core mission:

- reward people for adopting from shelters;
- issue a **Certified Shelter Pet Passport** for verified shelter pets;
- use the Passport to unlock lifetime savings for pet Guardians;
- lower the lifetime cost of pet ownership rather than adding new fees to pet owners;
- create new demand and customer relationships for participating businesses;
- create new funding pathways for shelters through participating business contributions and user-directed support;
- track savings, contributions, and impact in a transparent way.

**Pet Guardians remain free.** ShelterPawtners is designed to reduce pet ownership costs, never add a subscription cost to Guardians.

### RAVE Shelter

RAVE Shelter is the human/festival-facing marketplace and community program powered by ShelterPawtners.

Consumer-facing name:

**RAVE Shelter — Rewarding Adoption with Vendor Exclusives**

Primary brand line:

> **Rave with purpose. Shop with impact.**

This line should be visually prominent at the top of the RAVE Shelter experience and remain central to the narrative.

RAVE Shelter connects ravers, festival-goers, creators, vendors, indie makers, small businesses, and shelter supporters around a simple exchange:

1. ShelterPawtners brings potential customers and discovery opportunities to participating businesses.
2. Businesses provide useful offers, products, services, inventory previews, or event participation.
3. Businesses that contribute meaningfully to shelters receive enhanced recognition and promotion.
4. The stronger the business performs through the platform, the greater the potential shelter impact.

The platform should communicate this as a **win-win growth model**, not as a guilt-based donation ask.

### LostPaws

LostPaws is **not** the generic RAVE Shelter activation brand.

LostPaws is reserved for **Lost Lands and other Excision-related festivals/headlining shows that are owned, run, or majority-associated with Excision**.

LostPaws should be represented as an independent ShelterPawtners / RAVE Shelter community initiative and must never imply official affiliation, sponsorship, endorsement, or authorization by Lost Lands, Excision, or related entities unless that relationship is actually established.

Future RAVE Shelter activations can be event-specific without using the LostPaws name, for example:

- RAVE Shelter — Electric Forest Activation
- RAVE Shelter — [Festival/Event] Activation

City names such as Detroit, Denver, or Chicago may later become community/social tags, but city-by-city activation products are **not an MVP requirement**.

## 2. Soft-launch demand message

The immediate soft-launch goal is to prove demand from Guardians and businesses.

### Guardian promise

- Pet Guardian accounts are always free.
- The product exists to make pet ownership more affordable.
- Guardians may choose when and whether they can afford to contribute additional support.
- The user should be able to see where supported money is directed when the underlying transaction and reporting capability exists.

### Founding business-partner promise

Owner-directed launch offer:

> **Any Business Partner registered before January 1, 2027 will retain a free account and will never be charged a future subscription fee for that founding account.**

This statement must be treated as a formal commercial commitment. Before final public publication, implementation should confirm the exact account scope, transferability, abuse protections, and whether optional paid add-ons could exist later without violating the promise.

The conversion message should be strong:

> **RIGHT NOW, WE NEED YOU TO SIGN UP AND SHOW DEMAND.**

The page should explain that early registration helps demonstrate the community and business demand required to grow vendor participation, marketplace inventory, shelter relationships, and future impact.

## 3. Two marketplace front ends, one shared platform

Do not build two independent commerce stacks.

Build one shared marketplace/data model exposed through two branded storefronts.

### A. ShelterPawtners Marketplace

Audience:

- pet Guardians;
- adopters;
- shelters/rescues;
- pet product/service businesses.

Default content:

- pet food;
- toys;
- collars/leashes;
- grooming;
- veterinary/wellness services where appropriate;
- pet accessories;
- boarding/daycare/training;
- adoption/pet events;
- other pet-relevant products and services.

Visual identity:

- ShelterPawtners branding;
- warm, trustworthy, animal-centric;
- no festival/rave language shown by default to ordinary pet businesses or pet Guardians.

Primary benefit:

> **Adopt. Unlock lifetime savings. Make pet ownership more affordable.**

### B. RAVE Shelter Marketplace

Audience:

- ravers;
- festival-goers;
- festival vendors;
- artists/creatives;
- indie makers;
- Etsy-style sellers;
- service providers relevant to music/festival communities.

Default content:

- apparel;
- festival outfits;
- hydration gear;
- bags;
- accessories;
- art;
- LED/light-up items;
- festival services;
- creator/vendor inventory previews;
- relevant human/event products and services.

Visual identity:

- RAVE Shelter branding;
- neon, energetic, event-driven;
- top-line message: **Rave with purpose. Shop with impact.**

## 4. Audience/category model

Recommended offer audience dimension:

- `pet`
- `human_rave`
- `both`

The customer-facing terms should remain simple:

- **Pet Offers**
- **RAVE Offers**

A standard pet business should not need to see festival concepts unless they explicitly choose to participate in that audience.

A RAVE vendor should not be forced through pet-specific fields that do not apply.

Businesses that legitimately serve both audiences can opt into both.

## 5. Events as a first-class model

Add a shared **Events** concept rather than creating separate pet-event and rave-event systems.

Recommended high-level event audience/type:

- `pet`
- `human`
- `both`

Recommended category examples:

### Pet events

- Adoption Event
- Rescue Fundraiser
- Pet Expo
- Vaccine/Wellness Clinic
- Training Event
- Pet-Friendly Community Event
- Dog/Cat Social Event

### Human events

- Music Festival
- Concert / Headlining Show
- Art / Maker Market
- Vendor Market
- Community Event
- Conference / Expo

### Cross-audience attributes

Events should support filters/attributes such as:

- pet friendly;
- dogs allowed;
- cats allowed where relevant;
- vendor opportunity;
- service-provider opportunity / for hire;
- business attending;
- business vending;
- business performing/providing services;
- shelter/rescue participating;
- online / physical / hybrid;
- date/time;
- location / service area;
- related activation/campaign tag.

Example:

- Audience: `pet`
- Category: `Adoption Event`

or:

- Audience: `human`
- Category: `Music Festival`
- Event: `Lost Lands Music Festival`
- Business role: `Vendor`

This gives ordinary businesses access to useful events without forcing rave-specific language into their onboarding.

## 6. Marketplace selector modal

Keep the entry decision extremely simple.

Prompt:

**What are you shopping for?**

Options:

### Pet Offers

Pet products, services, adoption-related savings, and pet events.

### RAVE Offers

Festival gear, apparel, accessories, creators, vendors, and event-related offers.

Optional:

- `Show Everything`
- `Remember my choice`

Filtering contract:

- Pet Offers -> `audience IN ('pet','both')`
- RAVE Offers -> `audience IN ('human_rave','both')`
- Show Everything -> all eligible published offers

Do not add unnecessary multi-step filtering when the audience choice already determines the primary experience.

## 7. Certified Shelter Pet Passport value story

The marketplace must make the financial value of adoption tangible.

Future UX should show illustrative savings scenarios for:

- 1 month;
- 1 year;
- typical pet lifetime / 15-year scenario;
- household with multiple adopted pets where appropriate.

The savings model must be based on explicit assumptions and clearly labeled estimates. Do not invent savings claims.

A separate analysis task should establish:

- reasonable monthly pet-spend baskets;
- participating discount assumptions;
- frequency of offer use;
- adoption/pet lifetime assumptions;
- low/base/high savings scenarios;
- potential business contribution / shelter-support scenarios;
- national and eventually international scaling scenarios.

Outputs should distinguish:

1. Guardian savings;
2. participating business revenue generated;
3. business-funded shelter support;
4. optional Guardian-directed support;
5. projected vs realized impact.

Do not imply projected funds have already been donated.

## 8. Visual explainer system

Do not use emoji-based pseudo-icons such as `🏠 → 🐕`.

Explainer tiles should use a coherent branded visual system:

- custom SVG icons;
- professionally designed simple line/filled illustrations;
- approved brand artwork;
- AI-generated visual assets only when they match the approved visual direction and are reviewed before use.

Recommended five concepts:

1. **Adopt + Verify** — adopt from a shelter and verify the adoption.
2. **Certified Shelter Pet Passport** — receive the pet's lasting verified Passport.
3. **Unlock Lifetime Savings** — access participating offers throughout the pet's life.
4. **Shop With Impact** — choose businesses creating real community value and shelter support.
5. **Choose + Track Impact** — direct eligible support to a shelter and track realized activity once the financial/reporting workflow supports it.

The exact visuals can differ between ShelterPawtners and RAVE Shelter while preserving the same system logic.

## 9. RAVE Shelter Hero Vendor program

This should be a major feature, not a minor badge.

Working program name:

**RAVE Shelter Hero Vendor**

Core idea:

> We provide a free platform for discovery, customer acquisition, offers, inventory previews, event visibility, and repeat relationships. We ask businesses that are able to do so to use a portion of their margin to support a qualified shelter/nonprofit of their choice.

### Hero threshold

Owner direction: vendors committing **5% or more** of eligible participating sales to shelter support qualify for Hero recognition.

Before automated money movement launches, define clearly what `eligible participating sales` means and how commitments/refunds are handled.

### Hero recognition should be meaningful

Hero Vendors should receive, subject to marketplace-quality rules:

- distinctive Hero badge;
- dedicated Hero filter;
- enhanced placement;
- featured vendor/profile opportunities;
- campaign highlights;
- impact/shelter-support visibility;
- potential social/community recognition;
- annual impact summary when reporting capability exists.

The platform should actively celebrate businesses that materially support the mission.

### Standard vendors remain welcome

A vendor does not need to qualify as a Hero Vendor to participate.

Standard vendors can still:

- register for free;
- list eligible products/services;
- publish offers;
- preview festival/event inventory;
- list events;
- indicate where they will vend or provide services;
- build a profile and customer following.

Hero recognition creates an incentive to contribute without blocking marketplace growth.

## 10. Business value proposition

Do not lead vendor messaging with a donation request.

Lead with business outcomes:

> **Make a great first impression — fast. Reach people already looking for what you sell. Build loyalty by giving them a reason to support you again.**

ShelterPawtners / RAVE Shelter should help participating businesses:

- reach potential new customers;
- target relevant pet or rave audiences;
- publish compelling offers;
- preview event inventory;
- advertise event attendance;
- create repeat customer relationships;
- demonstrate visible community impact;
- simplify tracking/reporting of qualifying contributions once the financial workflow is implemented.

The growth flywheel:

**help partners sell more -> create more eligible contribution volume -> generate more shelter support -> strengthen community trust -> help partners sell more.**

## 11. Shelter impact story

The emotional mission should remain visible without overstating financial capabilities.

Owner-directed story:

> This is a passion project, a technology-for-good project, and a personal project. Nobody should lose their dog because they cannot afford care, and no dog or cat should die simply because a shelter had no room or resources.

Public copy can express this mission in a polished form while avoiding claims that the platform can guarantee medical funding or shelter outcomes.

The point of the system is to create **new, scalable resources** by aligning consumer savings, business growth, and shelter support.

## 12. Transparency and trust

A core user trust objective is to improve visibility into where support goes.

The product direction is to let users:

- choose an eligible shelter when supported by the transaction model;
- see realized contribution/support history;
- distinguish planned/pledged/projected support from completed money movement;
- see the businesses involved;
- eventually receive useful annual reporting.

Do not market all support as tax-deductible. Tax treatment depends on who makes the contribution, recipient eligibility, and applicable tax rules.

Do not promise automated annual tax forms until the financial/reporting design has been reviewed and implemented.

## 13. Living help / training content

Build one reusable Learn/Help system rather than seven disconnected page architectures.

Recommended routes:

- `/learn`
- `/learn/passport`
- `/learn/marketplace`
- `/learn/donations`
- `/learn/vendors`
- `/learn/shelters`
- `/learn/events`
- `/learn/tutorials`
- `/faq`

Each article should support:

- audience;
- summary;
- steps;
- screenshots/graphics;
- related topics;
- last-updated metadata;
- CTA;
- future video/tutorial embedding.

This creates living operational/product documentation without requiring a paid help-center platform at MVP.

## 14. Branding and asset hierarchy

Owner-provided repository folders currently include distinct ShelterPawtners, RAVE Shelter, and LostPaws assets.

Use brand identity intentionally:

- ShelterPawtners header/core pet marketplace -> ShelterPawtners assets;
- RAVE Shelter pages/marketplace/vendor program -> RAVE Shelter assets;
- LostPaws Excision/Lost Lands campaign pages -> LostPaws assets plus visible `A RAVE Shelter initiative/activation` relationship where appropriate.

Do not generatively redraw approved logos.

Do not normalize/rename the new asset folders in the first implementation PR unless path safety/build tooling requires it. Avoid creating churn before the visuals are integrated.

## 15. Revised three-PR implementation track

### PR Track 1 — Mobile conversion + brand/campaign correction

Suggested branch:

`feature/mobile-rave-lostpaws-conversion`

Priority: **highest / pre-launch**

Scope:

- full mobile QA on launch-critical routes;
- correct logo usage by brand;
- ensure safe padding, no horizontal overflow, readable heroes, and >=44px actions;
- make `/rave` lead with **Rave with purpose. Shop with impact.**;
- clarify RAVE Shelter = Rewarding Adoption with Vendor Exclusives;
- correct `/lostpaws` so it is specifically the Lost Lands / Excision-family campaign identity, not the generic festival activation brand;
- create clear Guardian and RAVE Vendor conversion paths;
- feature soft-launch signup/demand messaging;
- include founding-business free-account-before-2027 message only after owner confirms final commercial wording;
- preserve non-affiliation language;
- no database schema changes unless absolutely required for display behavior.

Definition of done:

- mobile conversion flows are launch-ready;
- brand hierarchy is unmistakable;
- Guardian and RAVE Vendor CTAs work end-to-end;
- LostPaws and RAVE Shelter are visually and narratively distinct;
- approved logos/assets are used correctly.

### PR Track 2 — Dual marketplace + Events data model

Suggested branch:

`feature/dual-marketplace-events`

Priority: **next**

Scope:

- establish pet vs human/rave audience classification;
- keep one marketplace engine/database;
- provide ShelterPawtners pet-focused storefront;
- provide RAVE Shelter human/festival storefront;
- implement simple marketplace audience selector/modal;
- add/extend Events as a first-class model;
- event audience/category taxonomy;
- business-event relationship (attending, vending, for hire/service, etc.);
- pet-friendly/dog-friendly attributes;
- onboarding questions that hide rave information from ordinary pet businesses unless opted in;
- targeted migrations/RLS/tests;
- preserve current offer/redemption behavior.

Important: review the existing normalized schema before adding tables. Reuse or extend existing event/location/organization structures when appropriate rather than blindly creating duplicates.

### PR Track 3 — Hero Vendor + education + impact/savings storytelling

Suggested branch:

`feature/hero-vendor-impact-learn`

Priority: **after Track 2 foundation**

Scope:

- Hero Vendor program UX;
- 5%+ Hero commitment representation with explicit eligibility definitions;
- standard-vendor vs Hero-vendor benefits;
- explainer tiles using branded visual assets/icons, not emoji;
- `/learn/*` and FAQ foundations;
- Guardian lifetime-savings explainer;
- savings calculator/scenario UX once assumptions are approved;
- transparent projected-vs-realized support language;
- soft-launch conversion sections;
- shelter impact story;
- annual reporting roadmap messaging only where capability exists.

No automated money movement or tax-document claims without the separately reviewed financial design.

## 16. Savings and impact modeling workstream

This is important enough to run in parallel with implementation but should not block Track 1.

Deliverable:

`docs/product/PASSPORT-SAVINGS-IMPACT-MODEL.md`

Model:

- month 1;
- year 1;
- year 15;
- low/base/high scenarios;
- pet spending categories;
- expected discount utilization;
- household savings;
- business incremental sales;
- shelter-support contribution scenarios;
- aggregate scenarios at 1k / 10k / 100k / 1M participating Guardians or transactions as appropriate.

Every public number must cite the assumption behind it. Separate **illustrative potential** from actual platform performance.

## 17. Agent collaboration model — Codex + Claude Code

Do not let two agents edit the same feature branch or same high-churn files simultaneously.

### Recommended split

#### Codex — implementation / tests / schema discipline

Best ownership:

- Track 2 database/schema/RLS/migrations;
- marketplace filter logic;
- Events model;
- route/data wiring;
- deterministic tests;
- Playwright/mobile regression;
- lint/build/CI fixes;
- small focused implementation patches.

Codex branch examples:

- `feature/dual-marketplace-events-codex`
- or the shared Track 2 branch only if Claude is not touching it.

#### Claude Code — visual/content composition / page architecture

Best ownership:

- Track 1 RAVE/LostPaws page composition;
- responsive CSS/layout;
- integration of owner-provided imagery;
- messaging sections;
- conversion hierarchy;
- Track 3 Learn/Hero Vendor presentation layer;
- accessibility/content polish.

Claude branch examples:

- `feature/mobile-rave-lostpaws-claude`
- `feature/hero-vendor-learn-claude`

### Integration rule

Preferred workflow:

1. both start from the same current `main` SHA;
2. each works on a **different short-lived branch**;
3. each has clearly separated file ownership;
4. first completed PR is merged only after required QA;
5. second agent then rebases/updates from the new `main` before final PR acceptance;
6. never cherry-pick large overlapping UI commits blindly;
7. if both need `src/main.tsx`, routing changes should be assigned to one agent and the other should work in isolated components/modules;
8. migrations are sequential and owned by one agent at a time;
9. neither agent changes owner-approved brand assets;
10. both update the controlling issue/handoff with exact completed work.

### Suggested immediate parallelization

**Claude Code now:** Track 1 UI/mobile/branding/conversion on an isolated branch.

**Codex now:** review current schema and produce Track 2 implementation plan + migration proposal first; then implement only after confirming it does not conflict with Track 1 routing/UI files.

**ChatGPT/operator:** maintain the product plan, review PR boundaries, research/validate savings-impact assumptions, reconcile GitHub issues, and act as merge/QA coordinator.

This allows useful parallel work without two coding agents repeatedly rewriting the same files.

## 18. Security and launch guardrails

These remain mandatory:

- HTTPS must remain valid on the production domain;
- no mixed-content resources;
- preserve Supabase RLS;
- no secrets in browser code or GitHub;
- no destructive production data changes;
- no Microsoft 365 DNS changes;
- Facebook/Instagram remain disabled until live acceptance;
- Privacy/Terms/Data Deletion remain unpublished until owner approval;
- no unsupported donation/tax claims;
- no automatic money movement until the financial model is reviewed;
- no paid service upgrades without owner approval.

## 19. Immediate next actions

1. Owner reviews this plan.
2. Lock final public wording for the pre-2027 founding-business free-account promise.
3. Assign Track 1 to Claude Code or Codex — not both on the same files.
4. Assign Track 2 schema review to the other agent in parallel.
5. Create the savings/impact modeling document before publishing numerical impact claims.
6. Keep mobile QA and Guardian/RAVE Vendor conversion as the top launch priority.
7. Merge each track independently through PR + CI rather than developing directly on `main`.
