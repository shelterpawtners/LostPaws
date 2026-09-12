/**
 * One reusable Learn/Help content source (plan section 13), rather than seven
 * disconnected page architectures. Articles render through a single component,
 * so adding a topic is a data change.
 *
 * Content rules that must hold for anything added here: describe planned
 * capability as planned, never state a savings figure, donation amount, or
 * partnership as fact, and never imply tax deductibility. See
 * docs/CONTENT-STANDARDS.md.
 */

export type LearnAudience =
  "Guardians" | "Vendors and businesses" | "Shelters and rescues" | "Everyone";

export type LearnArticle = {
  slug: string;
  title: string;
  audience: LearnAudience;
  summary: string;
  steps: { heading: string; body: string }[];
  related: string[];
  cta?: { label: string; to: string };
  lastUpdated: string;
};

export const learnArticles: LearnArticle[] = [
  {
    slug: "passport",
    title: "The Certified Shelter Pet Passport",
    audience: "Guardians",
    summary:
      "What the Passport is, how a shelter adoption gets confirmed, and what it unlocks over your pet's life.",
    steps: [
      {
        heading: "Create your pet's record",
        body: "Add your pet with the details you have. Identity, care history, and your adoption story live in one place that stays private by default.",
      },
      {
        heading: "Ask your shelter to confirm the adoption",
        body: "You start a confirmation request and we contact the organization you name. Until a shelter responds, your pet is shown as self-reported rather than shelter-confirmed.",
      },
      {
        heading: "Use participating offers as they come online",
        body: "Verified shelter adoption is what some participating offers use to determine eligibility. Each offer shows its own terms, and the provider controls them.",
      },
    ],
    related: ["marketplace", "savings"],
    cta: { label: "Start your pet's Passport", to: "/register?type=guardian" },
    lastUpdated: "2026-09-12",
  },
  {
    slug: "marketplace",
    title: "How the two marketplaces work",
    audience: "Everyone",
    summary:
      "One platform, two storefronts: pet offers for Guardians and RAVE offers for the festival community.",
    steps: [
      {
        heading: "Choose what you are shopping for",
        body: "Pet Offers covers pet products, services, and pet events. RAVE Offers covers festival gear, apparel, art, creators, and event-related offers. You can also show everything.",
      },
      {
        heading: "Read the offer, not just the headline",
        body: "Every listing names the organization responsible for it and shows eligibility and current terms before you act. Offers that serve both audiences appear in both views.",
      },
      {
        heading: "Report anything inaccurate",
        body: "Listings that are misleading, unsupported, or out of date can be withheld or removed under platform rules. Use the report option on a listing.",
      },
    ],
    related: ["passport", "vendors"],
    cta: { label: "Browse the marketplace", to: "/marketplace" },
    lastUpdated: "2026-09-12",
  },
  {
    slug: "vendors",
    title: "Joining as a vendor or business",
    audience: "Vendors and businesses",
    summary:
      "A free profile, a published offer, and the discovery that comes with being part of the mission.",
    steps: [
      {
        heading: "Create a free profile",
        body: "Register your business, describe what you offer, and set your service area. Pet businesses are not shown festival concepts unless they choose that audience.",
      },
      {
        heading: "Publish an offer you control",
        body: "You write the terms, eligibility, and timing, and you can edit or unpublish at any time. We do not promise you traffic, sales, or placement.",
      },
      {
        heading: "Decide whether to pursue Hero Vendor recognition",
        body: "Businesses that commit a share of eligible participating sales to shelter support can qualify for RAVE Shelter Hero Vendor recognition. Standard vendors are welcome and lose nothing by not participating.",
      },
    ],
    related: ["listing-an-offer", "hero-vendor", "events"],
    cta: { label: "Join as a vendor", to: "/register?type=rave_vendor" },
    lastUpdated: "2026-09-12",
  },
  {
    slug: "shelters",
    title: "For shelters and rescues",
    audience: "Shelters and rescues",
    summary:
      "ShelterPawtners is free for shelters. Here is what confirming an adoption does for your adopters.",
    steps: [
      {
        heading: "Register your organization",
        body: "Create an organization profile with the contact details your adopters and partners need. Registered is shown as registered, never as verified.",
      },
      {
        heading: "Confirm adoptions when adopters ask",
        body: "A confirmation request arrives as a secure, single-purpose link. It opens only that request, never the adopter's account or private Passport.",
      },
      {
        heading: "Help adoption history travel with the pet",
        body: "A confirmed adoption lets the pet carry verified history forward, which is what participating offers can use for eligibility.",
      },
    ],
    related: ["passport", "events"],
    cta: { label: "Register a shelter", to: "/register?type=shelter" },
    lastUpdated: "2026-09-12",
  },
  {
    slug: "events",
    title: "Events, markets, and festivals",
    audience: "Everyone",
    summary:
      "Adoption events, pet-friendly gatherings, festivals, and vendor markets share one events system.",
    steps: [
      {
        heading: "One events model, two audiences",
        body: "An event is classified for pet audiences, human audiences, or both, so an adoption day and a music festival can live in the same system without mixing up who sees what.",
      },
      {
        heading: "Businesses say how they are taking part",
        body: "A business can be attending, vending, hosting, or available for hire at an event. A business controls its own participation; an event host cannot list someone else's business without them.",
      },
      {
        heading: "Find events that fit",
        body: "Pet-friendly details, location or online format, and dates are part of the event record so you can tell whether it is worth your trip.",
      },
    ],
    related: ["marketplace", "vendors"],
    lastUpdated: "2026-09-12",
  },
  {
    slug: "savings",
    title: "Understanding savings over a pet's life",
    audience: "Guardians",
    summary:
      "How small, repeated savings can add up, and why we show you a calculator instead of a promise.",
    steps: [
      {
        heading: "Why we do not publish an average",
        body: "We have not completed the research needed to state what a typical household saves, so we do not claim one. Instead you can enter your own numbers and see what they imply.",
      },
      {
        heading: "Estimates are not outcomes",
        body: "Anything the calculator shows is an illustration built from the figures you entered. It is not a guarantee, an offer, or a record of money saved.",
      },
      {
        heading: "Realized savings are tracked separately",
        body: "When you actually use a participating offer, that is recorded as realized activity. Projections and realized activity are deliberately never combined into one number.",
      },
    ],
    related: ["passport", "giving"],
    cta: { label: "Open the savings explorer", to: "/learn/savings-explorer" },
    lastUpdated: "2026-09-12",
  },
  {
    slug: "giving",
    title: "Where support goes",
    audience: "Everyone",
    summary:
      "How business-funded shelter support is meant to work, why a third party will handle the money, and what is not built yet.",
    steps: [
      {
        heading: "Business-funded support, by default",
        body: "The model asks participating businesses, not Guardians, to direct a share of eligible sales to shelter support. Guardian accounts are free and stay free. Guardians and businesses can also choose to add an extra gift on top of a transaction — that is optional on both sides, never required.",
      },
      {
        heading: "We do not hold or move the money ourselves",
        body: "ShelterPawtners is planning to route every actual donation through a qualified third-party giving processor rather than taking custody of funds directly. That processor, not ShelterPawtners, will be the one confirming a recipient's nonprofit status and issuing any tax receipt. Which processor, and the exact mechanics, is a decision still being finalized before any real money moves.",
      },
      {
        heading: "Pledged is not the same as delivered",
        body: "A commitment a business has made is shown as a commitment. Money that has actually moved through the processor is shown separately, once that integration exists. We will never describe a pledge as a completed donation.",
      },
      {
        heading: "Tax treatment is between you and your advisor",
        body: "We are not a tax authority, and this platform does not give tax advice. Whether a contribution is deductible depends on the recipient's status, who the legal donor is, and current tax law. We will surface whatever documentation the processor provides, and nothing more, until that design is reviewed.",
      },
      {
        heading: "What is not built yet",
        body: "Automated money movement, Guardian-directed giving, per-account giving totals, and annual reporting are planned, not live. We will not show a donation total until there is a real, processor-confirmed transaction behind it.",
      },
    ],
    related: ["hero-vendor", "savings", "redemption"],
    lastUpdated: "2026-09-12",
  },
  {
    slug: "listing-an-offer",
    title: "Listing an offer, step by step",
    audience: "Vendors and businesses",
    summary:
      "What to have ready, what each field means, and why we ask before using an image from your site.",
    steps: [
      {
        heading: "Have your details ready",
        body: "A clear title, a one-sentence summary, the terms (what a customer actually gets), and how long the offer runs. Vague terms get flagged before publishing, not after a customer complains.",
      },
      {
        heading: "Paste a link, and we will try to save you typing",
        body: "If you give us a link to the offer on your own site, we can propose a title, description, and photo pulled from that page's public preview information — the same data Slack or iMessage use to show a link preview. Nothing is used until you confirm you have the right to use that image; if you say no, or the page has none, you upload your own.",
      },
      {
        heading: "Pick a category and an audience",
        body: "Category is a real tag shown on your listing, not decoration — use one that actually describes what you sell. Audience is Pet, Human (RAVE), or Both, and controls which storefront shows your offer.",
      },
      {
        heading: "Decide on Hero Vendor now or later",
        body: "Committing 5% or more of eligible sales to a shelter is optional and can be added at any time — it is not required to publish a standard offer.",
      },
      {
        heading: "Publish, then keep it current",
        body: "You can edit or unpublish at any time. An offer with stale terms or an expired end date is what erodes trust fastest, for you and for the marketplace.",
      },
    ],
    related: ["vendors", "hero-vendor", "redemption"],
    cta: { label: "Create a business profile", to: "/register?type=petbiz" },
    lastUpdated: "2026-09-12",
  },
  {
    slug: "redemption",
    title: "How redemption works",
    audience: "Everyone",
    summary:
      "What happens between a Guardian claiming an offer and a business confirming it, for both sides.",
    steps: [
      {
        heading: "Claiming reserves it, it does not use it",
        body: "A Guardian claims an offer and gets a private code. Claiming is not the same as redeeming — for a limited-inventory offer, claiming holds a spot; the business still confirms the actual redemption.",
      },
      {
        heading: "The business confirms at the point of service",
        body: "The business enters or scans the Guardian's code to confirm redemption. Confirmation is final; a business can reverse one with a stated reason, which is recorded, not silently erased.",
      },
      {
        heading: "Both sides can see the same status",
        body: "Claimed, redeemed, or reversed is visible to the Guardian and the business, so neither side is guessing what happened.",
      },
      {
        heading: "Cross-account access is denied, not just hidden",
        body: "A different business cannot validate or confirm another business's redemption codes, and this is enforced at the database level, not only in what the screen shows.",
      },
    ],
    related: ["listing-an-offer", "giving"],
    lastUpdated: "2026-09-12",
  },
  {
    slug: "hero-vendor",
    title: "RAVE Shelter Hero Vendor",
    audience: "Vendors and businesses",
    summary:
      "Recognition for businesses committing 5% or more of eligible participating sales to shelter support.",
    steps: [
      {
        heading: "The commitment",
        body: "Hero Vendor recognition is for businesses committing at least 5% of eligible participating sales to a qualified shelter or rescue of their choice.",
      },
      {
        heading: "What recognition includes",
        body: "A Hero badge, a dedicated discovery filter, enhanced placement, feature opportunities, and impact visibility once reporting exists. Recognition is subject to marketplace quality rules.",
      },
      {
        heading: "Standard vendors keep everything else",
        body: "Registration, listings, offers, events, and a public profile are free either way. Hero recognition is an incentive, never a gate on participating.",
      },
    ],
    related: ["vendors", "giving"],
    cta: { label: "See the Hero Vendor program", to: "/hero-vendor" },
    lastUpdated: "2026-09-12",
  },
];

export function findLearnArticle(slug: string | undefined) {
  if (!slug) return undefined;
  return learnArticles.find((article) => article.slug === slug);
}

export type FaqEntry = {
  question: string;
  answer: string;
  audience: LearnAudience;
};

export const faqEntries: FaqEntry[] = [
  {
    question: "Does a Guardian account cost anything?",
    answer:
      "No. Pet Guardian accounts are free. The platform exists to lower the cost of pet ownership, so we do not add a subscription for Guardians.",
    audience: "Guardians",
  },
  {
    question: "Do I have to adopt from a shelter to use ShelterPawtners?",
    answer:
      "No. Any pet can have a Passport. Some participating offers may require a shelter-confirmed adoption for eligibility, and each offer states its own terms.",
    audience: "Guardians",
  },
  {
    question: "What does 'shelter-confirmed' actually mean?",
    answer:
      "It means the organization you named responded and confirmed it handled the adoption. It is not a government or independent legal certification, and we record who confirmed what and when.",
    audience: "Guardians",
  },
  {
    question: "How much will I save?",
    answer:
      "We do not publish a savings average, because we have not completed the research to support one. The savings explorer lets you enter your own figures and see what they imply as an illustration.",
    audience: "Guardians",
  },
  {
    question: "Is my Passport information public?",
    answer:
      "No. Passport data is private by default. Following an organization or connecting with someone never grants them access to private Passport information.",
    audience: "Guardians",
  },
  {
    question: "What does it cost a business to join?",
    answer:
      "Registration and publishing offers are free. Businesses registering before January 1, 2027 are intended to keep a free founding account with no future subscription fee for that account; final terms are still being confirmed before launch.",
    audience: "Vendors and businesses",
  },
  {
    question: "Am I required to donate to participate as a business?",
    answer:
      "No. Standard vendors can register, publish offers, list events, and build a profile without any contribution. Contributing 5% or more of eligible participating sales is what qualifies a business for Hero Vendor recognition.",
    audience: "Vendors and businesses",
  },
  {
    question: "How is 'eligible participating sales' defined?",
    answer:
      "The precise basis, including how discounts, refunds, shipping, taxes, and processor fees are treated, is still being finalized and will be documented before any automated money movement exists.",
    audience: "Vendors and businesses",
  },
  {
    question: "Are contributions tax deductible?",
    answer:
      "We do not make tax-deductibility claims. Tax treatment depends on who contributes, the recipient's eligibility, and applicable rules, so consult your own advisor.",
    audience: "Vendors and businesses",
  },
  {
    question: "Does ShelterPawtners take custody of donated funds?",
    answer:
      "Automated money movement is not live. Until the financial design is reviewed and implemented, nothing on the platform moves money on a business's or Guardian's behalf.",
    audience: "Everyone",
  },
  {
    question: "Is LostPaws affiliated with Lost Lands or Excision?",
    answer:
      "No. LostPaws is an independent community initiative for the Lost Lands and Excision festival community. It is not affiliated with, sponsored by, endorsed by, or an official program of Lost Lands, Excision, or their affiliates.",
    audience: "Everyone",
  },
  {
    question: "What is the difference between RAVE Shelter and LostPaws?",
    answer:
      "RAVE Shelter, meaning Rewarding Adoption with Vendor Exclusives, is the festival-facing marketplace and community program. LostPaws is the specific RAVE Shelter initiative built for the Lost Lands and Excision community.",
    audience: "Everyone",
  },
  {
    question: "Does it cost shelters anything?",
    answer: "No. ShelterPawtners is free for shelters and rescues.",
    audience: "Shelters and rescues",
  },
  {
    question: "Who actually handles donated money?",
    answer:
      "Not ShelterPawtners directly. The plan is to route real donations through a qualified third-party giving processor, so a specialist confirms recipient nonprofit status and issues receipts rather than us doing that ourselves. Which processor, and the exact integration, has not been finalized, and no automated money movement is live yet.",
    audience: "Vendors and businesses",
  },
  {
    question: "Will my business's giving be tax deductible?",
    answer:
      "We cannot tell you that — it depends on the recipient's status, who the legal donor is, and current tax law, and we are not a tax authority. Once the processor is selected, we will pass along whatever documentation it issues; for now, treat any tax-savings claim you see elsewhere about this program as unconfirmed and talk to your own accountant before counting on a deduction.",
    audience: "Vendors and businesses",
  },
  {
    question: "Can a Guardian or a business give more than the offer requires?",
    answer:
      "That is the intent — both sides should be able to add a discretionary gift on top of a normal transaction, separate from any Hero Vendor commitment. This is planned and not live yet; it depends on the same processor integration as the rest of real money movement.",
    audience: "Everyone",
  },
  {
    question: "How will I know how much I've actually given or received?",
    answer:
      "The goal is an account-level giving history for Guardians and businesses alike, showing pledged versus processor-confirmed amounts separately. That reporting does not exist yet; it is planned alongside the money-movement integration, not before it.",
    audience: "Everyone",
  },
  {
    question: "What is the difference between claiming and redeeming an offer?",
    answer:
      "Claiming reserves your spot on a limited offer and gives you a private code; it is not the same as using it. The business confirms the actual redemption when you show up, and that confirmation is what's final — a claim by itself can still expire or go unused.",
    audience: "Guardians",
  },
];
