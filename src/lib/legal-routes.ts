export const legalRoutes = {
  privacy: "/privacy",
  terms: "/terms",
  dataDeletion: "/data-deletion",
} as const;

export const legalRoutesReadyForPublication = false;

export function legalRouteUrl(origin: string, path: string) {
  return new URL(path, `${origin.replace(/\/$/, "")}/`).toString();
}
