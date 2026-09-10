import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { supabase as db } from "../lib/supabase";

type VerificationContext = {
  shelter_name: string;
  pet_name: string;
  pet_name_at_adoption: string | null;
  approximate_adoption_date: string | null;
  verification_status: string;
  token_expires_at: string | null;
};

export function AdoptionVerificationResponder() {
  const { token = "" } = useParams();
  const [context, setContext] = useState<VerificationContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [completed, setCompleted] = useState<"confirmed" | "declined" | null>(null);

  useEffect(() => {
    if (!db || !token) {
      setLoading(false);
      return;
    }
    void db
      .rpc("adoption_verification_by_token", { p_token: token })
      .then(({ data, error }) => {
        setLoading(false);
        if (error) {
          setStatus("This verification link is unavailable.");
          return;
        }
        const row = Array.isArray(data) ? data[0] : null;
        setContext((row as VerificationContext | undefined) || null);
      });
  }, [token]);

  async function respond(
    event: React.FormEvent<HTMLFormElement>,
    confirmed: boolean,
  ) {
    event.preventDefault();
    if (!db || !token || !context) return;
    const form = new FormData(event.currentTarget);
    const adoptionDate = String(form.get("adoption_date") || "") || null;
    const responderName = String(form.get("responder_name") || "") || null;
    if (confirmed && (!adoptionDate || !responderName)) {
      setStatus("Responder name and adoption date are required to confirm the adoption.");
      return;
    }
    setStatus(confirmed ? "Confirming adoption…" : "Recording response…");
    const { data, error } = await db.rpc("respond_to_adoption_verification", {
      p_token: token,
      p_confirmed: confirmed,
      p_adoption_date: adoptionDate,
      p_responder_name: responderName,
      p_responder_role: String(form.get("responder_role") || "") || null,
      p_notes: String(form.get("notes") || "") || null,
    });
    if (error || data === "unavailable") {
      setStatus("This verification link is invalid, expired, or already used.");
      return;
    }
    setCompleted(confirmed ? "confirmed" : "declined");
    setStatus("");
  }

  if (loading) {
    return (
      <section className="section shell narrow formPage">
        <div className="panel"><p role="status">Checking secure verification link…</p></div>
      </section>
    );
  }

  if (!context && !completed) {
    return (
      <section className="section shell narrow formPage">
        <div className="panel">
          <span className="eyebrow">Adoption verification</span>
          <h1>Verification link unavailable</h1>
          <p>
            This link is invalid, expired, revoked, or has already been used.
            No account or pet information has been exposed.
          </p>
        </div>
      </section>
    );
  }

  if (completed) {
    return (
      <section className="section shell narrow formPage">
        <div className="panel">
          <BadgeCheck />
          <span className="eyebrow">Response recorded</span>
          <h1>{completed === "confirmed" ? "Adoption verified" : "Response complete"}</h1>
          <p>
            Thank you. The Guardian can now see the updated verification state in
            their private Digital Pet Passport.
          </p>
          <div className="notice">
            <p>
              ShelterPawtners is free for shelters and rescues. Organizations can
              create profiles, help pets carry verified history forward, and
              participate without paying to respond to verification requests.
            </p>
          </div>
          <Link className="btn" to="/register">Explore a free shelter account</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section shell narrow formPage">
      <div className="panel">
        <div className="notice">
          <ShieldCheck />
          <p>
            Secure shelter response. No ShelterPawtners account is required, and
            this link reveals only the adoption context needed to respond.
          </p>
        </div>
        <span className="eyebrow">Adoption verification</span>
        <h1>Can {context!.shelter_name} confirm this adoption?</h1>
        <p><b>Pet:</b> {context!.pet_name_at_adoption || context!.pet_name}</p>
        {context!.approximate_adoption_date ? (
          <p><b>Guardian-provided approximate date:</b> {context!.approximate_adoption_date}</p>
        ) : null}
        {context!.token_expires_at ? (
          <p>Secure link expires {new Date(context!.token_expires_at).toLocaleDateString()}.</p>
        ) : null}
      </div>

      <form className="panel detail" onSubmit={(event) => void respond(event, true)}>
        <h2>Shelter or rescue response</h2>
        <div className="fields">
          <label>
            Your name
            <input name="responder_name" autoComplete="name" />
          </label>
          <label>
            Your role
            <input name="responder_role" placeholder="Adoption coordinator, staff member…" />
          </label>
          <label>
            Adoption date
            <input name="adoption_date" type="date" defaultValue={context!.approximate_adoption_date || ""} />
          </label>
          <label>
            Notes (optional)
            <textarea name="notes" rows={4} />
          </label>
        </div>
        <button className="btn" type="submit">Confirm this adoption</button>
        <button
          className="btn quiet"
          type="button"
          onClick={(event) => {
            const form = event.currentTarget.form;
            if (form) void respond({ preventDefault() {}, currentTarget: form } as unknown as React.FormEvent<HTMLFormElement>, false);
          }}
        >
          I cannot confirm this adoption
        </button>
        <p role="status" aria-live="polite" aria-atomic="true">{status}</p>
      </form>
    </section>
  );
}
