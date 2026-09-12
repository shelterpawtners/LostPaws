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

Deno.serve(async (request) => {
  if (request.method === "OPTIONS")
    return new Response("ok", { headers: cors });
  if (Deno.env.get("QA_MODE_ENABLED") !== "true")
    return json({ error: "QA mode is disabled." }, 404);
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer "))
    return json({ error: "Unauthorized" }, 401);
  const url = Deno.env.get("SUPABASE_URL")!;
  const service = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const {
    data: { user: actor },
  } = await service.auth.getUser(authorization.slice(7));
  if (!actor) return json({ error: "Unauthorized" }, 401);
  const { data: admin } = await service
    .from("user_roles")
    .select("user_id")
    .eq("user_id", actor.id)
    .eq("role_code", "platform_admin")
    .is("revoked_at", null)
    .maybeSingle();
  if (!admin) return json({ error: "Forbidden" }, 403);
  const { target_user_id, reason, action = "start" } = await request.json();
  if (action === "stop") {
    await service
      .schema("private")
      .from("audit_events")
      .insert({
        actor_id: actor.id,
        action: "admin_qa_session",
        target_type: "auth_user",
        outcome: "stopped",
        context: { environment: "qa", reason: reason || null },
      });
    return json({ stopped: true });
  }
  const { data: target, error } =
    await service.auth.admin.getUserById(target_user_id);
  if (error || !target.user?.email?.endsWith("@example.invalid"))
    return json({ error: "QA target is not allowed." }, 403);
  const { data: link, error: linkError } =
    await service.auth.admin.generateLink({
      type: "magiclink",
      email: target.user.email,
    });
  if (linkError || !link.properties?.hashed_token)
    return json({ error: "Unable to issue QA session." }, 500);
  await service
    .schema("private")
    .from("audit_events")
    .insert({
      actor_id: actor.id,
      action: "admin_qa_session",
      target_type: "auth_user",
      target_id: target.user.id,
      outcome: action === "switch" ? "switched" : "started",
      context: { environment: "qa", reason: reason || null },
    });
  return json({
    email: target.user.email,
    token_hash: link.properties.hashed_token,
    user: {
      id: target.user.id,
      display_name: target.user.user_metadata.full_name || target.user.email,
    },
  });
});
