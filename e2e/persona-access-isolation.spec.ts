import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

const url = process.env.PLAYWRIGHT_SUPABASE_URL || "";
const key = process.env.PLAYWRIGHT_SUPABASE_PUBLISHABLE_KEY || "";

function client() {
  if (!url || !key)
    throw new Error("Local Supabase test settings are missing.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const personas = [
  ["Guardian A", "guardian-a@example.invalid", "Demo-only-Guardian-A!"],
  ["Guardian B", "guardian-b@example.invalid", "Demo-only-Guardian-B!"],
  ["Pet Business Admin", "partner-admin@example.invalid", "Demo-only-Partner!"],
  ["Pet Business B", "partner-b@example.invalid", "Demo-only-Partner-B!"],
  ["Shelter Admin", "shelter-admin@example.invalid", "Demo-only-Shelter!"],
  ["RAVE Vendor", "rave-vendor@example.invalid", "Demo-only-RAVE-Vendor!"],
  ["Platform Admin", "platform-admin@example.invalid", "Demo-only-Platform!"],
] as const;

async function signedIn(email: string, password: string) {
  const db = client();
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  expect(error, `${email} should sign in`).toBeNull();
  expect(data.user?.email).toBe(email);
  return db;
}

test.describe("Seeded persona access and isolation", () => {
  for (const [name, email, password] of personas) {
    test(`${name} seeded credentials sign in`, async () => {
      const db = await signedIn(email, password);
      await db.auth.signOut();
    });
  }

  test("Guardians can access their own pet but not another Guardian's pet", async () => {
    const guardianA = await signedIn(
      "guardian-a@example.invalid",
      "Demo-only-Guardian-A!",
    );
    const guardianB = await signedIn(
      "guardian-b@example.invalid",
      "Demo-only-Guardian-B!",
    );

    const petAId = "30000000-0000-0000-0000-000000000001";
    const petBId = "30000000-0000-0000-0000-000000000002";

    const { data: ownA, error: ownAError } = await guardianA
      .from("pets")
      .select("id,name")
      .eq("id", petAId);
    expect(ownAError).toBeNull();
    expect(ownA).toHaveLength(1);

    const { data: ownB, error: ownBError } = await guardianB
      .from("pets")
      .select("id,name")
      .eq("id", petBId);
    expect(ownBError).toBeNull();
    expect(ownB).toHaveLength(1);

    const { data: foreignRead, error: foreignReadError } = await guardianB
      .from("pets")
      .select("id,name")
      .eq("id", petAId);
    expect(foreignReadError).toBeNull();
    expect(foreignRead).toEqual([]);

    const { data: foreignUpdate, error: foreignUpdateError } = await guardianB
      .from("pets")
      .update({ name: "Unauthorized change" })
      .eq("id", petAId)
      .select("id");
    expect(foreignUpdateError).toBeNull();
    expect(foreignUpdate).toEqual([]);
  });

  test("Partner B cannot alter Partner A offers or validate Partner A redemption codes", async () => {
    const partnerA = await signedIn(
      "partner-admin@example.invalid",
      "Demo-only-Partner!",
    );
    const partnerB = await signedIn(
      "partner-b@example.invalid",
      "Demo-only-Partner-B!",
    );
    const guardian = await signedIn(
      "guardian-a@example.invalid",
      "Demo-only-Guardian-A!",
    );

    const organizationA = "20000000-0000-0000-0000-000000000001";
    const offerPayload = {
      title: `Isolation offer ${Date.now()}`,
      summary: "QA-only cross-Partner isolation offer.",
      terms: "QA only.",
      eligibility_kind: "all_pets",
      claim_window_days: "30",
      per_user_limit: "1",
      redemption_instructions: "Show private code.",
      applicability: "online",
    };

    const { data: offerId, error: createError } = await partnerA.rpc(
      "create_partner_offer",
      { p_organization_id: organizationA, p_terms: offerPayload },
    );
    expect(createError).toBeNull();
    expect(typeof offerId).toBe("string");

    const { error: publishError } = await partnerA.rpc(
      "set_partner_offer_state",
      {
        p_offer_id: offerId,
        p_action: "publish",
      },
    );
    expect(publishError).toBeNull();

    const { error: reviseError } = await partnerB.rpc("revise_partner_offer", {
      p_offer_id: offerId,
      p_terms: { title: "Unauthorized edit", summary: "Must fail" },
    });
    expect(reviseError).not.toBeNull();

    const { data: claimRows, error: claimError } = await guardian.rpc(
      "claim_offer",
      { p_offer_id: offerId, p_pet_id: null },
    );
    expect(claimError).toBeNull();
    const claim = Array.isArray(claimRows) ? claimRows[0] : claimRows;
    expect(claim?.redeem_code).toBeTruthy();

    const { data: validation, error: validationError } = await partnerB.rpc(
      "validate_redemption_code",
      { p_code: claim.redeem_code },
    );
    expect(validationError).toBeNull();
    expect(validation || []).toHaveLength(0);

    const { error: confirmError } = await partnerB.rpc("confirm_redemption", {
      p_code: claim.redeem_code,
      p_notes: null,
    });
    expect(confirmError).not.toBeNull();
  });

  test("Shelter and RAVE vendor seeded organizations remain linked to their owners", async () => {
    const shelter = await signedIn(
      "shelter-admin@example.invalid",
      "Demo-only-Shelter!",
    );
    const rave = await signedIn(
      "rave-vendor@example.invalid",
      "Demo-only-RAVE-Vendor!",
    );

    const { data: shelterOrg, error: shelterError } = await shelter
      .from("organization_memberships")
      .select("organization_id,role,status")
      .eq("organization_id", "20000000-0000-0000-0000-000000000002")
      .eq("status", "active");
    expect(shelterError).toBeNull();
    expect(shelterOrg).toHaveLength(1);
    expect(shelterOrg?.[0].role).toBe("owner");

    const { data: raveOrg, error: raveError } = await rave
      .from("organization_memberships")
      .select("organization_id,role,status")
      .eq("organization_id", "20000000-0000-0000-0000-000000000004")
      .eq("status", "active");
    expect(raveError).toBeNull();
    expect(raveOrg).toHaveLength(1);
    expect(raveOrg?.[0].role).toBe("owner");
  });
});
