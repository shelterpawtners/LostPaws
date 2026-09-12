export type EventAudience = "pet" | "human" | "both";

export type EventParticipantRole =
  "attending" | "vending" | "hosting" | "for_hire";

export type PublicEvent = {
  id: string;
  organization_id: string | null;
  audience: EventAudience;
  category: string;
  title: string;
  summary: string;
  details: string | null;
  service_area: string | null;
  is_online: boolean;
  starts_at: string | null;
  ends_at: string | null;
  status: string;
  published_at: string | null;
};

/** Audience filter as offered in the UI. */
export type EventAudienceFilter = "all" | EventAudience;

export const eventAudienceLabels: Record<EventAudience, string> = {
  pet: "Pet event",
  human: "Human event",
  both: "Everyone",
};

/** Suggested categories. Free text in the database, so this is guidance only. */
export const petEventCategories = [
  "Adoption Event",
  "Rescue Fundraiser",
  "Pet Expo",
  "Vaccine/Wellness Clinic",
  "Training Event",
  "Pet-Friendly Community Event",
];

export const humanEventCategories = [
  "Music Festival",
  "Concert / Headlining Show",
  "Art / Maker Market",
  "Vendor Market",
  "Community Event",
  "Conference / Expo",
];

export const eventParticipantRoleLabels: Record<EventParticipantRole, string> =
  {
    attending: "Attending",
    vending: "Vending",
    hosting: "Hosting",
    for_hire: "Available for hire",
  };

/**
 * Which audience values a filter should match.
 *
 * "both" events belong in every view, the same way a "shared" marketplace
 * offer appears under Pet and RAVE alike.
 */
export function audiencesFor(filter: EventAudienceFilter): EventAudience[] {
  if (filter === "all") return ["pet", "human", "both"];
  if (filter === "both") return ["both"];
  return [filter, "both"];
}

export function formatEventWhen(
  startsAt: string | null,
  endsAt: string | null,
): string {
  if (!startsAt) return "Date to be announced";
  const start = new Date(startsAt);
  if (Number.isNaN(start.getTime())) return "Date to be announced";
  const dayFormat: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const startDay = start.toLocaleDateString(undefined, dayFormat);
  if (!endsAt) return startDay;
  const end = new Date(endsAt);
  if (Number.isNaN(end.getTime())) return startDay;
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) return startDay;
  return `${startDay} — ${end.toLocaleDateString(undefined, dayFormat)}`;
}

export function formatEventWhere(
  isOnline: boolean,
  serviceArea: string | null,
): string {
  if (isOnline) return serviceArea ? `Online · ${serviceArea}` : "Online";
  return serviceArea?.trim() ? serviceArea : "Location to be announced";
}
