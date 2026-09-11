export function oauthReturnUrl(
  origin: string,
  basePath: string,
  targetPath = "",
) {
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const normalizedTarget = targetPath.replace(/^\/+/, "");
  return new URL(`${normalizedBase}${normalizedTarget}`, origin).toString();
}
