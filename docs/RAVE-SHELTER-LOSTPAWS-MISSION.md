# RAVE Shelter + LostPaws Mission Flow

Status: OWNER-DIRECTION-LOCKED / ISSUE #100

## One mission

LostPaws and RAVE Shelter are not separate programs competing for attention.

**LostPaws is the music-community activation of RAVE Shelter.**

**RAVE Shelter — Rescue and Adoption Vendor Ecosystem — is the system that connects ravers, vendors, pet people, shelters, useful offers, savings, and shelter support.**

The public story should be simple enough to understand in seconds:

> **Music. Community. Shelter pets.**
>
> RAVE Shelter brings ravers, vendors, shelters, and pet people together so the things our community already buys can do more.

## Simple value proposition

1. People shop participating RAVE Shelter vendors and PetBiz partners for products, festival gear, merch, and services they actually want.
2. Participating offers create useful savings for the community and can pair those offers with partner shelter-support commitments.
3. As the platform giving workflow comes online, Guardians/ravers can choose to pass some or all of eligible savings forward toward verified shelter support.
4. ShelterPawtners tracks the underlying participation and value so the mission can grow from many small actions into measurable community impact.

Do not describe an unsent pledge or planned giving feature as a completed charitable donation. Do not promise tax deductibility unless a real completed donation has been processed through an eligible charitable recipient and applicable requirements are met.

## Public entry points

### ShelterPawtners home

The home page should introduce one cohesive RAVE Shelter / LostPaws feature:

- LostPaws is the current music-community activation;
- RAVE Shelter is the broader mission/ecosystem;
- primary CTA: `See the RAVE Shelter mission` → `/rave`;
- secondary CTA: `Browse RAVE offers` → `/marketplace?channel=rave`.

Do not present LostPaws and RAVE Shelter as two disconnected initiatives.

### RAVE Shelter navigation

`/rave` is the canonical mission page.

### LostPaws QR / navigation

The print/merch QR remains:

`https://shelterpawtners.com/lostpaws`

`/lostpaws` must open the same mission experience as `/rave`, with the LostPaws hero/context making the campaign origin immediately clear.

The old generic FoundationPage message — `Music community energy for shelter pets` with generic `Choose how to participate` / `Preview savings` buttons — is retired and must not remain a public destination.

## Mission-page narrative

Recommended sequence:

1. **LostPaws × RAVE Shelter hero** using the approved LostPaws 16:9 artwork.
2. **Music. Community. Shelter pets.**
3. One-paragraph explanation of the purchase/savings/shelter-support model.
4. **How it works:**
   - Shop participating partners.
   - Save while partners support the mission.
   - Pass eligible savings forward when the giving workflow becomes available.
5. **Why this can matter:** aggregate many vendors, shoppers, offers, and contributions into a larger resource for shelter pets.
6. **Choose your path:** Raver/Guardian, Vendor/PetBiz, Shelter/Rescue.
7. Clear independent/non-affiliation statement.

## User paths

### Raver / pet person

First-value CTA:

`/marketplace?channel=rave`

Optional account/Passport CTA:

`/register?type=guardian`

Do not force account creation before showing public mission/value where the Marketplace permits browsing.

### Vendor / PetBiz

CTA:

`/register?type=rave_vendor`

Positioning: create a profile, publish useful offers, reach the community, and build a real track record of participation and shelter support.

### Shelter / rescue

CTA:

`/register?type=shelter`

Positioning: connect adopted pets and adopters to the broader ShelterPawtners support ecosystem.

## Messaging rules

Use:

- `Music. Community. Shelter pets.`
- `Shop. Save. Help shelter pets.`
- `Bring more resources together. Make every purchase matter more.`
- `LostPaws is the music-community activation of RAVE Shelter.`
- `Participating offers can pair community savings with partner shelter-support commitments.`
- `Pass eligible savings forward` only with clear future/availability context until the Guardian giving workflow is live.

Avoid:

- generic `music community energy` copy;
- unsupported numerical donation percentages;
- guaranteed donation/savings totals;
- tax-deductibility claims for intents/pledges;
- language implying Lost Lands/Excision sponsorship or endorsement;
- presenting LostPaws and RAVE Shelter as separate missions.

## Canonical implementation

Issue #100 and its implementation branch supersede the separate LostPaws-page direction previously represented by PR #97.

The target implementation is a single `RaveShelterMission` experience used by both `/rave` and `/lostpaws`; `/rave-shelter` should canonicalize to `/rave`. The competing static `public/lostpaws.html` and Vercel rewrite should be retired once the React route integration is verified.

Final `shelterpawtners.com` DNS/custom-domain cutover remains separately owner-gated.
