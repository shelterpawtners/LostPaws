# LostPaws / RAVE Shelter Landing Direction

Status: OWNER-DIRECTION-LOCKED / IMPLEMENTATION IN PROGRESS
Issues: #96 (current implementation authority), #58 (superseded shell direction), #54

## Canonical destination

`https://shelterpawtners.com/lostpaws`

The QR used on LostPaws stickers, shirts, cards, signs and festival outreach must encode this exact canonical URL. Generate QR artwork deterministically and scan/decode-test it; do not use AI-generated QR imagery.

## Locked artwork rule

The owner supplied two approved LostPaws logo/artwork keepers on 2026-09-10.

- The 16:9 composition is the approved top-of-page website banner/hero.
- Treat the supplied artwork as locked master artwork.
- Do not redraw or reinterpret the LostPaws lettering, heart, paw, cracks, colors, proportions or composition with generative AI.
- The second treatment is a secondary merch/print asset once exact binary source ingestion is available.

## Page identity

`/lostpaws` is the single canonical LostPaws campaign destination inside the ShelterPawtners application.

Issue #96 records the owner's current direction and supersedes the earlier Issue #58 shell requirement: the normal ShelterPawtners global header/navigation **must remain present** on `/lostpaws` so visitors can reliably return Home and navigate Marketplace, LostPaws, RAVE Shelter, and account/sign-in areas on desktop and mobile.

- Keep the standard ShelterPawtners global header/navigation.
- Render the approved custom LostPaws campaign experience immediately below the global header.
- Keep the campaign body visually distinct from the ordinary ShelterPawtners application/dashboard experience.
- Keep ShelterPawtners ownership/relationship clear in campaign copy and the footer.
- Use deployment-independent application routes. Do not hardcode the GitHub Pages hostname, the `/LostPaws/` preview prefix, or the future production hostname into internal app navigation.
- GitHub Pages preview and the future root-domain deployment must use the same React routes so final domain cutover does not require a LostPaws navigation rewrite.

## Visual language

Aim for a human-designed, premium bass-music/festival campaign experience rather than generic generated festival art.

Use:

- dark canvas and deliberate neon accents derived from the LostPaws artwork;
- bold editorial typography and irregular but controlled vertical rhythm;
- restrained distressed/tactile treatments built in CSS or approved graphic assets;
- real application UI, real participating-vendor marks/assets where rights permit, and real shelter/pet photography as those assets become available;
- mobile-first spacing and large tap targets for QR-entry traffic.

Avoid:

- generic AI fantasy scenes, fake festival crowds, fake dinosaurs, generic laser backgrounds, or synthetic pet photography;
- copying Lost Lands code, assets, layout or protected visual identity;
- any treatment that implies the page was produced by the Lost Lands/Excision organization.

## Product story priority

The page exists to connect LostPaws traffic to **RAVE Shelter — Rescue and Adoption Vendor Ecosystem**.

Recommended first content block after the banner:

**RAVE Shelter**\
Rescue and Adoption Vendor Ecosystem

**Rave. Save. Help shelter pets.**

Explain in concise, factual language that LostPaws connects the festival community with participating vendors and current offers while supporting the broader ShelterPawtners shelter/adoption mission. Do not invent donation percentages, savings totals or OD-003 terms.

## Raver path

Primary journey:

1. Understand RAVE Shelter in a few seconds.
2. Browse current RAVE/community offers.
3. See who provides each offer and current eligibility/terms.
4. Claim supported offers through the existing Marketplace flow.
5. Optionally create a Guardian account / Digital Pet Passport.

Primary CTA target: existing RAVE-filtered Marketplace route.

Secondary CTA target: Guardian registration / Pet Passport.

## Vendor path

The consumer page should contain a visible but concise vendor acquisition path.

Suggested CTA: **Join RAVE Shelter for the festival**

Initial route: existing `rave_vendor` / PetBiz onboarding flow.

Truthful value language may describe the currently supported ability to:

- create a free business/vendor profile;
- publish current offers;
- become discoverable in the RAVE Shelter community/Marketplace;
- participate in platform-supported redemption and impact tracking where implemented.

Do not promise unsupported sponsor placement, official festival status, guaranteed traffic, donation economics, or OD-003 terms.

Issue #54 should carry the separate, deeper RAVE Shelter vendor landing page. That page should explain vendor value, participation expectations, offer setup and fast signup without adding a paid CMS requirement.

## Footer / independence

The LostPaws campaign footer must explicitly state independence. Owner-approved direction:

> LostPaws is an independent ShelterPawtners / RAVE Shelter initiative created by pet lovers in the festival community. LostPaws and ShelterPawtners are not affiliated with, sponsored by, endorsed by, or an official program of Lost Lands, Excision, or their affiliates.

Legal wording may be refined before final publication, but the non-affiliation meaning must not be weakened.

## MVP acceptance

- `/lostpaws` is the single canonical campaign route and renders the approved custom campaign experience, not the generic `FoundationPage`.
- Exact owner-supplied 16:9 artwork appears as the campaign hero.
- Standard ShelterPawtners global header/navigation remains present and functional.
- Home -> LostPaws and LostPaws -> Home/Marketplace/RAVE Shelter work on desktop and mobile.
- Internal application links remain deployment-independent on GitHub Pages and the future root-domain deployment.
- Legacy `/lostpaws.html` does not remain a competing public experience.
- RAVE Shelter purpose and raver value are immediately clear.
- Vendor signup is reachable quickly through existing onboarding.
- QR decodes exactly to `https://shelterpawtners.com/lostpaws`.
- Existing registration, Marketplace, auth, RLS and accepted LL-1 through LL-6 behavior are not weakened.
- Accessibility and targeted route/browser regression pass.
- Footer contains explicit independence/non-affiliation wording.
- Final `shelterpawtners.com` web-domain cutover remains owner-gated.
