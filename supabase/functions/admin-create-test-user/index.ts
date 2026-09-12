import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, content-type, apikey, x-client-info",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
const validKinds = new Set(["guardian", "shelter", "petbiz", "rave_vendor"]);
Deno.serve(async (request) => {
  if (request.method === "OPTIONS")
    return new Response("ok", { headers: cors });
  if (Deno.env.get("QA_MODE_ENABLED") !== "true")
    return json({ error: "QA mode is disabled." }, 404);
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer "))
    return json({ error: "Unauthorized" }, 401);
  const service = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const {
    data: { user: actor },
  } = await service.auth.getUser(authorization.slice(7));
  const { data: admin } = actor
    ? await service
        .from("user_roles")
        .select("user_id")
        .eq("user_id", actor.id)
        .eq("role_code", "platform_admin")
        .is("revoked_at", null)
        .maybeSingle()
    : { data: null };
  if (!actor || !admin) return json({ error: "Forbidden" }, 403);
  const { persona_kind, display_name, test_label } = await request.json();
  if (!validKinds.has(persona_kind))
    return json({ error: "Invalid persona kind." }, 400);
  const label =
    String(test_label || persona_kind)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 24) || persona_kind;
  const email = `qa-${label}-${crypto.randomUUID().slice(0, 8)}@example.invalid`;
  const { data: created, error } = await service.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      full_name: String(display_name || `QA ${persona_kind}`),
      onboarding_type: persona_kind,
      qa_test_user: true,
    },
  });
  if (error || !created.user)
    return json({ error: error?.message || "Unable to create QA user." }, 500);
  const { data: link, error: linkError } =
    await service.auth.admin.generateLink({ type: "magiclink", email });
  if (linkError || !link.properties?.hashed_token)
    return json({ error: "Created but unable to issue QA session." }, 500);
  await service
    .schema("private")
    .from("audit_events")
    .insert({
      actor_id: actor.id,
      action: "admin_create_test_user",
      target_type: "auth_user",
      target_id: created.user.id,
      outcome: "created",
      context: {
        environment: "qa",
        persona_kind,
        test_label: test_label || null,
      },
    });
  return json({
    email,
    token_hash: link.properties.hashed_token,
    user: {
      id: created.user.id,
      display_name: created.user.user_metadata.full_name,
      persona_kind,
    },
  });
});
