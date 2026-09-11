import { describe, expect, it } from "vitest";
import { oauthReturnUrl } from "./auth-oauth";

describe("OAuth return URL helper", () => {
  it("returns to the root application when root hosted", () => {
    expect(oauthReturnUrl("https://shelterpawtners.com", "/")).toBe(
      "https://shelterpawtners.com/",
    );
  });

  it("returns signup to the root-hosted persona onboarding path", () => {
    expect(
      oauthReturnUrl(
        "https://shelterpawtners.com",
        "/",
        "/onboarding/guardian",
      ),
    ).toBe("https://shelterpawtners.com/onboarding/guardian");
  });

  it("keeps login inside the GitHub Pages project base", () => {
    expect(
      oauthReturnUrl("https://shelterpawtners.github.io", "/LostPaws/"),
    ).toBe("https://shelterpawtners.github.io/LostPaws/");
  });

  it("keeps persona onboarding inside the GitHub Pages project base", () => {
    expect(
      oauthReturnUrl(
        "https://shelterpawtners.github.io",
        "/LostPaws/",
        "onboarding/rave_vendor",
      ),
    ).toBe("https://shelterpawtners.github.io/LostPaws/onboarding/rave_vendor");
  });
});
