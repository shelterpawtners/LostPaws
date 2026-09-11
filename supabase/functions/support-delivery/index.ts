import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const safeErrorCodes = new Set([
  "transport_unavailable",
  "transport_rejected",
  "transport_timeout",
  "transport_failed",
]);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function hasExpectedSecret(
  actual: string | null,
  expected: string | undefined,
) {
  if (!actual || !expected || actual.length !== expected.length) return false;
  let mismatch = 0;
  for (let index = 0; index < actual.length; index += 1) {
    mismatch |= actual.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return mismatch === 0;
}

function deliveryErrorCode(status: number | null) {
  if (status === null) return "transport_unavailable";
  if (status === 408 || status === 504) return "transport_timeout";
  if (status >= 400 && status < 500) return "transport_rejected";
  return "transport_failed";
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "Not found" }, 404);

  const invokeSecret = Deno.env.get("SUPPORT_DELIVERY_INVOKE_SECRET");
  const destination = Deno.env.get("SUPPORT_DELIVERY_WEBHOOK_URL");
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!invokeSecret || !destination || !url || !serviceRoleKey) {
    console.error(JSON.stringify({ event: "support_delivery_not_configured" }));
    return json({ error: "Support delivery is not configured." }, 503);
  }
  if (
    !hasExpectedSecret(
      request.headers.get("x-support-delivery-secret"),
      invokeSecret,
    )
  ) {
    return json({ error: "Unauthorized" }, 401);
  }

  const service = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: candidates, error: claimError } = await service.rpc(
    "claim_support_delivery_candidates",
    { p_limit: 25, p_lease_seconds: 300 },
  );
  if (claimError) {
    console.error(JSON.stringify({ event: "support_delivery_claim_failed" }));
    return json({ error: "Support delivery is temporarily unavailable." }, 503);
  }

  let delivered = 0;
  let failed = 0;
  for (const candidate of candidates ?? []) {
    // Deliberately omit ticket_id and every field absent from the accepted
    // private contract. The destination must treat this as a human review cue,
    // never a command to close, fix, or implement anything automatically.
    const payload = {
      delivery_id: candidate.delivery_id,
      reference_code: candidate.reference_code,
      category: candidate.category,
      severity: candidate.severity,
      status: candidate.status,
      classification_bucket: candidate.classification_bucket,
      notification_lane: candidate.notification_lane,
      recommended_action: candidate.recommended_action,
      human_review_required: candidate.human_review_required,
      first_due_at: candidate.first_due_at,
      age_days: candidate.age_days,
      aging_band: candidate.aging_band,
      escalation_required: candidate.escalation_required,
    };

    let errorCode: string | null = null;
    try {
      const response = await fetch(destination, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": candidate.delivery_id,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) errorCode = deliveryErrorCode(response.status);
    } catch {
      errorCode = deliveryErrorCode(null);
    }

    const safeErrorCode =
      errorCode && safeErrorCodes.has(errorCode)
        ? errorCode
        : "transport_failed";
    const { error: completeError } = await service.rpc(
      "complete_support_delivery_candidate",
      {
        p_delivery_id: candidate.delivery_id,
        p_lease_token: candidate.lease_token,
        p_delivery_succeeded: !errorCode,
        p_error_code: errorCode ? safeErrorCode : null,
      },
    );

    if (!errorCode && !completeError) delivered += 1;
    else failed += 1;
  }

  console.log(
    JSON.stringify({ event: "support_delivery_complete", delivered, failed }),
  );
  return json({ delivered, failed });
});
