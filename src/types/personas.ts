export type UserRole =
  | "guardian"
  | "partner_member"
  | "partner_admin"
  | "shelter_member"
  | "shelter_admin"
  | "care_provider"
  | "platform_admin";

export const roleLabels: Record<UserRole, string> = {
  guardian: "Pet Guardian",
  partner_member: "Partner member",
  partner_admin: "Partner administrator",
  shelter_member: "Shelter member",
  shelter_admin: "Shelter administrator",
  care_provider: "Care provider",
  platform_admin: "ShelterPawtners team",
};
