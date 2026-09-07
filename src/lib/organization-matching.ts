export type OrganizationMatchInput = {
  publicName?: string;
  legalName?: string;
  website?: string;
  phone?: string;
  street?: string;
};

/** Avoid background matching until the entry contains a meaningful identifier. */
export function hasOrganizationMatchSignal(input: OrganizationMatchInput) {
  return Boolean(
    (input.publicName?.trim().length && input.publicName.trim().length >= 3) ||
    (input.legalName?.trim().length && input.legalName.trim().length >= 3) ||
    input.website?.trim() ||
    (input.phone || "").replace(/\D/g, "").length >= 7 ||
    (input.street?.trim().length && input.street.trim().length >= 4),
  );
}

export function organizationMatchSummary(reasons: string[]) {
  return reasons.length
    ? reasons.join(" · ")
    : "Possible identifying details match.";
}
