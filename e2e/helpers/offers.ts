import { expect, type Page } from "@playwright/test";

type OfferDetailGroup =
  "Dates & limits" | "Event & link" | "Terms & redemption" | "Extra images";

export const offerCard = (page: Page, title: string) =>
  page.locator(".offerPickCard").filter({ hasText: title });

export async function openYourOffers(page: Page) {
  const offers = page.locator(".offerYourOffers");
  if (!(await offers.getAttribute("open"))) {
    await offers.locator("summary").click();
  }
}

export async function pickOffer(page: Page, title: string) {
  await openYourOffers(page);
  const card = offerCard(page, title);
  await expect(card).toHaveCount(1);
  await card.click();
}

export async function openOfferDetailGroups(
  page: Page,
  groups: OfferDetailGroup[],
) {
  for (const group of groups) {
    const details = page.locator(".offerDetailGroup", {
      has: page.locator("summary", { hasText: group }),
    });
    if (!(await details.evaluate((el) => (el as HTMLDetailsElement).open))) {
      await details.locator("summary").click();
    }
  }
}
