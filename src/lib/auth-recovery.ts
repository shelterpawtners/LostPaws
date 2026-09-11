export function passwordRecoveryRedirectUrl(origin: string, basePath: string) {
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return new URL(`${normalizedBase}reset-password`, origin).toString();
}

export function recoveryRequestStatus(hasError: boolean) {
  return hasError
    ? "We couldn't start a recovery request. Please wait a moment and try again."
    : "If that address has an account, a recovery email is on its way.";
}

export function passwordUpdateStatus(hasError: boolean) {
  return hasError
    ? "We couldn't update your password. Request a new recovery email and try again."
    : "Password updated. Please sign in with your new password.";
}
