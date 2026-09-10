import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { BadgeCheck, Clock3, Send } from "lucide-react";
import { supabase as db } from "../lib/supabase";

type Verification = {
  id: string;
  shelter_name: string;
  shelter_contact_name: string | null;
  shelter_email: string | null;
  shelter_phone: string | null;
  shelter_website_or_social: string | null;
  approximate_adoption_date: string | null;
  response_adoption_date: string | null;
  responder_name: string | null;
  responder_role: string | null;
  status: string;
  token_expires_at: string | null;
  reminder_count: number;
};

const openStates = new Set([
  "draft",
  "submitted",
  "delivery_pending",
  "sent",
  "viewed",
  "more_information_requested",
]);

const statusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  delivery_pending: "Preparing outreach",
  sent: "Sent to shelter",
  viewed: "Viewed by shelter",
  more_information_requested: "More information requested",
  confirmed: "Verified",
  declined: "Unable to verify",
  delivery_failed: "Delivery failed",
  expired: "Verification link expired",
  canceled: "Canceled",
};

export function GuardianAdoptionVerification({
  session,
  petId,
  petName,
  canEdit,
}: {
  session: Session | null;
  petId: string;
  petName: string;
  canEdit: boolean;
}) {
  const [verification, setVerification] = useState<Verification | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    if (!db || !session || !petId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await db
      .from("adoption_verification_requests")
      .select(
        "id,shelter_name,shelter_contact_name,shelter_email,shelter_phone,shelter_website_or_social,approximate_adoption_date,response_adoption_date,responder_name,responder_role,status,token_expires_at,reminder_count",
      )
      .eq("pet_id", petId)
      .eq("requested_by", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setLoading(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    setVerification((data as Verification | null) || null);
  }, [petId, session]);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !session || !canEdit || saving) return;
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setStatus("Submitting shelter verification request…");
    const { error } = await db.rpc("request_adoption_verification", {
      p_pet_id: petId,
      p_shelter_name: String(form.get("shelter_name") || ""),
      p_shelter_contact_name: String(form.get("shelter_contact_name") || "") || null,
      p_shelter_email: String(form.get("shelter_email") || "") || null,
      p_shelter_phone: String(form.get("shelter_phone") || "") || null,
      p_shelter_website_or_social:
        String(form.get("shelter_website_or_social") || "") || null,
      p_pet_name_at_adoption:
        String(form.get("pet_name_at_adoption") || "") || null,
      p_approximate_adoption_date:
        String(form.get("approximate_adoption_date") || "") || null,
    });
    setSaving(false);
    if (error) {
      setStatus(`Unable to submit verification. ${error.message}`);
      return;
    }
    setStatus("Verification submitted. Shelter outreach will use the secure responder link.");
    await load();
  }

  const isOpen = verification ? openStates.has(verification.status) : false;
  const canStart = canEdit && (!verification || !isOpen) && verification?.status !== "confirmed";

  return (
    <section className="panel detail" aria-labelledby="adoption-verification-heading">
      <span className="eyebrow">Adoption verification</span>
      <h2 id="adoption-verification-heading">Shelter-confirmed adoption</h2>
      <p>
        Ask the shelter or rescue to confirm the adoption through a private,
        expiring link. The responder does not need a ShelterPawtners account.
      </p>

      {loading ? (
        <p role="status">Loading adoption verification…</p>
      ) : verification?.status === "confirmed" ? (
        <div className="notice">
          <BadgeCheck />
          <div>
            <b>Verified by {verification.shelter_name}</b>
            <p>
              Adoption date: {verification.response_adoption_date || "Confirmed"}
              {verification.responder_name
                ? ` · ${verification.responder_name}${verification.responder_role ? `, ${verification.responder_role}` : ""}`
                : ""}
            </p>
          </div>
        </div>
      ) : isOpen && verification ? (
        <div className="notice">
          <Clock3 />
          <div>
            <b>{statusLabels[verification.status] || verification.status}</b>
            <p>
              {verification.shelter_name}. We keep the raw responder link out of
              your Passport and send it only through the outreach service.
            </p>
            {verification.token_expires_at ? (
              <p>
                Secure link expires {new Date(verification.token_expires_at).toLocaleDateString()}.
              </p>
            ) : null}
          </div>
        </div>
      ) : verification ? (
        <div className="notice">
          <Clock3 />
          <div>
            <b>{statusLabels[verification.status] || verification.status}</b>
            <p>
              The previous request is no longer active. You can submit a new
              request if the shelter contact information should be tried again.
            </p>
          </div>
        </div>
      ) : null}

      {canStart ? (
        <form onSubmit={submit} className="fields">
          <label>
            Shelter or rescue name
            <input name="shelter_name" required />
          </label>
          <label>
            Contact name
            <input name="shelter_contact_name" />
          </label>
          <label>
            Shelter email
            <input name="shelter_email" type="email" />
          </label>
          <label>
            Shelter phone
            <input name="shelter_phone" type="tel" />
          </label>
          <label>
            Website or social profile
            <input name="shelter_website_or_social" type="url" />
          </label>
          <label>
            Pet name at adoption
            <input name="pet_name_at_adoption" defaultValue={petName} />
          </label>
          <label>
            Approximate adoption date
            <input name="approximate_adoption_date" type="date" />
          </label>
          <label className="checkRow">
            <input name="contact_consent" type="checkbox" required />
            I authorize ShelterPawtners to contact this shelter or rescue about
            this adoption.
          </label>
          <button className="btn" disabled={saving}>
            <Send /> {saving ? "Submitting…" : "Request shelter verification"}
          </button>
        </form>
      ) : !canEdit && !verification ? (
        <p>Primary Guardian authority is required to start verification.</p>
      ) : null}

      <p role="status" aria-live="polite" aria-atomic="true">
        {status}
      </p>
    </section>
  );
}
