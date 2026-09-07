export const partnerBusinessModels = [
  ["physical", "Physical location"],
  ["online", "Online"],
  ["mobile", "Mobile"],
  ["service_area", "Service area"],
  ["national", "National"],
] as const;

export const partnerSocialPlatforms = [
  "instagram",
  "facebook",
  "tiktok",
  "youtube",
  "linkedin",
  "other",
] as const;

export const partnerDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function isHttpUrl(value: string) {
  if (!value.trim()) return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}
