export type OfferTerms = {
  title: string;
  summary: string;
  details: string;
  terms: string;
  category: string;
  classification: string;
  eligibility_kind: "all_pets" | "shelter_pet_enhanced";
  starts_at: string;
  ends_at: string;
  claim_window_days: string;
  availability_limit: string;
  per_user_limit: string;
  per_pet_limit: string;
  redemption_instructions: string;
  source_url: string;
  disclosure: string;
  channel: "pet" | "rave";
  applicability: "online" | "all_organization_locations" | "national";
};

export const blankOffer: OfferTerms = {
  title: "",
  summary: "",
  details: "",
  terms: "",
  category: "General",
  classification: "partner_published",
  eligibility_kind: "all_pets",
  starts_at: "",
  ends_at: "",
  claim_window_days: "30",
  availability_limit: "",
  per_user_limit: "",
  per_pet_limit: "",
  redemption_instructions: "",
  source_url: "",
  disclosure: "",
  channel: "pet",
  applicability: "online",
};

export const offerStatusLabel = (status: string) =>
  ({
    published: "Published",
    scheduled: "Scheduled",
    paused: "Paused",
    expired: "Expired",
    archived: "Archived",
    draft: "Draft",
  })[status] || status;

export const eligibilityLabel = (kind: string) =>
  kind === "shelter_pet_enhanced"
    ? "Enhanced benefit for eligible shelter pets"
    : "Available for all pets";
