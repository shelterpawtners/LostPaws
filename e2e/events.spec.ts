import { expect, test, type Page } from "@playwright/test";

/**
 * Events had schema, RLS, and pgTAP coverage but no interface, so the feature
 * was invisible. These guard the browse surface a reviewer actually sees.
 *
 * Runs against the seeded demo events in supabase/seed.sql, so this suite
 * needs a database and belongs with Persona QA rather than the
 * credential-free test:e2e:public suite. Credential-free coverage of /events
 * (overflow, title, heading order, touch targets) lives in site-hygiene.
 */
async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe("Events", () => {
  test("lists published events with their date and place", async ({ page }) => {
    await page.goto("/events");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Adoption days, festivals, and markets/,
      }),
    ).toBeVisible();

    const adoption = page.locator(".evCard", {
      hasText: "Demo Saturday Adoption Day",
    });
    await expect(adoption).toBeVisible();
    // A real date and place, not a placeholder.
    await expect(adoption).not.toContainText("Date to be announced");
    await expect(adoption).toContainText("Detroit, MI");
  });

  test("audience filters separate pet and human events", async ({ page }) => {
    await page.goto("/events");
    const adoption = page.locator(".evCard", {
      hasText: "Demo Saturday Adoption Day",
    });
    const market = page.locator(".evCard", { hasText: "Demo Makers Market" });
    await expect(adoption).toBeVisible();
    await expect(market).toBeVisible();

    await page.getByRole("button", { name: "Pet events" }).click();
    await expect(adoption).toBeVisible();
    await expect(market).toHaveCount(0);

    await page.getByRole("button", { name: "Human events" }).click();
    await expect(market).toBeVisible();
    await expect(adoption).toHaveCount(0);
  });

  test("a cross-audience event appears under both filters", async ({
    page,
  }) => {
    const walk = "Demo Community Dog Walk";
    await page.goto("/events");
    await page.getByRole("button", { name: "Pet events" }).click();
    await expect(page.locator(".evCard", { hasText: walk })).toBeVisible();
    await page.getByRole("button", { name: "Human events" }).click();
    await expect(page.locator(".evCard", { hasText: walk })).toBeVisible();
  });

  test("signed-out visitors see no add-event control", async ({ page }) => {
    await page.goto("/events");
    await expect(
      page.getByRole("button", { name: /Add an event/ }),
    ).toHaveCount(0);
  });

  test("owner can draft, edit, publish, and reopen/manage an event", async ({
    page,
  }) => {
    await signIn(page, "guardian-a@example.invalid", "Demo-only-Guardian-A!");
    await page.goto("/events");

    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const title = `Events lifecycle check ${suffix}`;
    await page.getByRole("button", { name: /Add an event/ }).click();
    await page.getByLabel("Title").fill(title);
    await page
      .getByLabel("Summary")
      .fill("A regression check for the draft/publish lifecycle.");
    await page.getByRole("button", { name: "Save event" }).click();
    await expect(page.getByText(/Saved as a draft/)).toBeVisible();

    // Reload -- the draft must survive and remain manageable, not just
    // visible for the remainder of the current session.
    await page.reload();
    const draftItem = page.locator(".evDrafts li", { hasText: title });
    await expect(draftItem).toBeVisible();
    await expect(draftItem.getByText("Draft")).toBeVisible();
    await expect(page.locator(".evCard", { hasText: title })).toHaveCount(0);

    await draftItem.getByRole("button", { name: "Edit" }).click();
    await expect(
      page.getByRole("heading", { name: "Edit event" }),
    ).toBeVisible();
    await expect(page.getByLabel("Title")).toHaveValue(title);
    const editedTitle = `${title} edited`;
    await page.getByLabel("Title").fill(editedTitle);
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(
      page.getByText(/did not change whether the event is published/),
    ).toBeVisible();
    await expect(
      page.locator(".evDrafts li", { hasText: editedTitle }),
    ).toBeVisible();

    const draftAfterEdit = page.locator(".evDrafts li", {
      hasText: editedTitle,
    });
    await draftAfterEdit.getByRole("button", { name: "Publish" }).click();
    await expect(page.getByText(/Published\. It now appears/)).toBeVisible();
    const publishedItem = page.locator(".evDrafts li", {
      hasText: editedTitle,
    });
    await expect(publishedItem.getByText("Published")).toBeVisible();

    // Public visibility: the published event appears in the real /events
    // read path, not just the owner's own management list.
    await page.reload();
    await expect(
      page.locator(".evCard", { hasText: editedTitle }),
    ).toBeVisible();

    // Reopen/manage: a published event stays editable, and can be taken
    // back down without losing it (it must remain a manageable draft).
    const managedItem = page.locator(".evDrafts li", { hasText: editedTitle });
    await managedItem.getByRole("button", { name: "Edit" }).click();
    await expect(page.getByLabel("Title")).toHaveValue(editedTitle);
    await page.getByRole("button", { name: "Close" }).click();

    page.once("dialog", (dialog) => dialog.accept());
    await managedItem.getByRole("button", { name: "Unpublish" }).click();
    await expect(page.getByText(/Unpublished/)).toBeVisible();
    await page.reload();
    await expect(page.locator(".evCard", { hasText: editedTitle })).toHaveCount(
      0,
    );
    await expect(
      page.locator(".evDrafts li", { hasText: editedTitle }),
    ).toBeVisible();
  });

  test("a draft event can be hard-deleted, and a published event can be removed and comes off the public listing", async ({
    page,
  }) => {
    await signIn(page, "guardian-a@example.invalid", "Demo-only-Guardian-A!");
    await page.goto("/events");

    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const draftTitle = `Delete check draft ${suffix}`;
    await page.getByRole("button", { name: /Add an event/ }).click();
    await page.getByLabel("Title").fill(draftTitle);
    await page.getByLabel("Summary").fill("Draft delete regression.");
    await page.getByRole("button", { name: "Save event" }).click();
    await expect(page.getByText(/Saved as a draft/)).toBeVisible();
    await page.reload();

    const draftItem = page.locator(".evDrafts li", { hasText: draftTitle });
    await expect(draftItem).toBeVisible();
    page.once("dialog", (dialog) => dialog.accept());
    await draftItem.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText(/^Deleted\.$/)).toBeVisible();
    await expect(
      page.locator(".evDrafts li", { hasText: draftTitle }),
    ).toHaveCount(0);

    const liveTitle = `Delete check published ${suffix}`;
    await page.getByRole("button", { name: /Add an event/ }).click();
    await page.getByLabel("Title").fill(liveTitle);
    await page.getByLabel("Summary").fill("Published removal regression.");
    await page.getByRole("button", { name: "Save event" }).click();
    await expect(page.getByText(/Saved as a draft/)).toBeVisible();
    const liveDraftItem = page.locator(".evDrafts li", { hasText: liveTitle });
    await liveDraftItem.getByRole("button", { name: "Publish" }).click();
    await expect(page.getByText(/Published\. It now appears/)).toBeVisible();
    await page.reload();
    await expect(page.locator(".evCard", { hasText: liveTitle })).toBeVisible();

    // A real attendee exists now -- removal must archive (preserve that
    // attendance history), not hard-delete, unlike the untouched draft above.
    const supabaseUrl = process.env.PLAYWRIGHT_SUPABASE_URL || "";
    const supabaseKey = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY || "";
    const { createClient } = await import("@supabase/supabase-js");
    const attendeeDb = createClient(supabaseUrl, supabaseKey);
    const attendeeSignIn = await attendeeDb.auth.signInWithPassword({
      email: "guardian-b@example.invalid",
      password: "Demo-only-Guardian-B!",
    });
    expect(attendeeSignIn.error).toBeNull();
    const { data: liveEvent } = await attendeeDb
      .from("events")
      .select("id")
      .eq("title", liveTitle)
      .single();
    const { error: attendError } = await attendeeDb
      .from("event_attendees")
      .upsert({
        event_id: liveEvent!.id,
        user_id: attendeeSignIn.data.user!.id,
        status: "attending",
      });
    expect(attendError).toBeNull();
    await attendeeDb.auth.signOut();

    const publishedItem = page.locator(".evDrafts li", { hasText: liveTitle });
    page.once("dialog", (dialog) => dialog.accept());
    await publishedItem.getByRole("button", { name: "Delete/Remove" }).click();
    await expect(page.getByText(/Removed\./)).toBeVisible();
    await page.reload();
    await expect(page.locator(".evCard", { hasText: liveTitle })).toHaveCount(
      0,
    );
    // Archived, not deleted, since attendance history exists -- still
    // visible/manageable in the owner's own list, just off the public
    // Events listing.
    await expect(
      page.locator(".evDrafts li", { hasText: liveTitle }),
    ).toBeVisible();
  });

  test("an unrelated user cannot remove someone else's event", async () => {
    const supabaseUrl = process.env.PLAYWRIGHT_SUPABASE_URL || "";
    const supabaseKey = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY || "";
    test.skip(!supabaseUrl || !supabaseKey, "Local Supabase key required");
    const { createClient } = await import("@supabase/supabase-js");
    const client = createClient(supabaseUrl, supabaseKey);
    const signIn = await client.auth.signInWithPassword({
      email: "guardian-a@example.invalid",
      password: "Demo-only-Guardian-A!",
    });
    expect(signIn.error).toBeNull();
    // Demo Saturday Adoption Day, owned by Demo Shelter B -- guardian-a has
    // no membership on that organization.
    const { error } = await client.rpc("remove_event", {
      p_event_id: "40000000-0000-0000-0000-0000000000f1",
    });
    expect(error).not.toBeNull();
    expect(error!.message).toMatch(/not authorized/i);
  });
});
