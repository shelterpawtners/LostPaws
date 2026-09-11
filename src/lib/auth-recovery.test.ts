import { describe, expect, it } from "vitest";
import {
  passwordRecoveryRedirectUrl,
  passwordUpdateStatus,
  recoveryRequestStatus,
} from "./auth-recovery";

describe("password recovery helpers", () => {
  it("keeps the recovery redirect within a root-hosted application", () => {
    expect(passwordRecoveryRedirectUrl("https://example.com", "/")).toBe(
      "https://example.com/reset-password",
    );
  });

  it("keeps the recovery redirect within the GitHub Pages project base", () => {
    expect(
      passwordRecoveryRedirectUrl(
        "https://shelterpawtners.github.io",
        "/LostPaws/",
      ),
    ).toBe("https://shelterpawtners.github.io/LostPaws/reset-password");
  });

  it("uses non-enumerating, non-sensitive recovery errors", () => {
    expect(recoveryRequestStatus(false)).toContain(
      "If that address has an account",
    );
    expect(recoveryRequestStatus(true)).not.toContain("account");
    expect(passwordUpdateStatus(true)).not.toContain("Supabase");
  });
});
