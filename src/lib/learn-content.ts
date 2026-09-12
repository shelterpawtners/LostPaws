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
    related: ["hero-vendor", "events"],
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
      "How business-funded shelter support is meant to work, and what is not built yet.",
    steps: [
      {
        heading: "Business-funded support",
        body: "The model asks participating businesses, not Guardians, to direct a share of eligible sales to shelter support. Guardian accounts are free and stay free.",
      },
      {
        heading: "Pledged is not the same as delivered",
        body: "A commitment a business has made is shown as a commitment. Money that has actually moved is shown separately, once the financial workflow supports reporting it.",
      },
      {
        heading: "What is not built yet",
        body: "Automated money movement, Guardian-directed giving, and annual reporting are planned, not live. We will not show a donation total until there is a real transaction behind it.",
      },
    ],
    related: ["hero-vendor", "savings"],
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
];
