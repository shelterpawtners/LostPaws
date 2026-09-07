import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase as db } from "../lib/supabase";

type Org = { id: string; public_name: string };
export function PartnerProfileEditor({ session }: { session: Session | null }) {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("physical");
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (!db || !session) return;
    db.from("organization_memberships")
      .select("organization_id, organizations(id,public_name)")
      .eq("user_id", session.user.id)
      .eq("status", "active")
      .then(({ data }) => {
        const next = (data || [])
          .map((r: any) => r.organizations)
          .filter(Boolean);
        setOrgs(next);
        setId(next[0]?.id || "");
      });
  }, [session]);
  useEffect(() => {
    if (!db || !id) return;
    db.from("organization_partner_profiles")
      .select("public_description,business_model,publication_status")
      .eq("organization_id", id)
      .maybeSingle()
      .then(({ data }) => {
        setDescription(data?.public_description || "");
        setModel(data?.business_model || "physical");
        setStatus(data?.publication_status || "Draft");
      });
  }, [id]);
  async function save(publish = false) {
    if (!db || !id) return;
    const { error } = await db.from("organization_partner_profiles").upsert(
      {
        organization_id: id,
        public_description: description,
        business_model: model,
      },
      { onConflict: "organization_id" },
    );
    if (error) return setStatus(error.message);
    if (publish) {
      const { error: e } = await db.rpc("publish_partner_profile", {
        p_organization_id: id,
      });
      setStatus(
        e
          ? e.message
          : "Published. Your listing is now visible in the directory.",
      );
    } else setStatus("Saved as a private draft.");
  }
  return (
    <section className="section shell formPage">
      <span className="eyebrow">Partner profile</span>
      <h1>Make your business easy to understand.</h1>
      <p className="lead">
        Publishing requires a business name, public description, a public
        contact path, and a location or a service/online model. Publishing is
        not an endorsement.
      </p>
      <div className="panel">
        <label>
          Organization
          <select value={id} onChange={(e) => setId(e.target.value)}>
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.public_name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Public description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          How customers are served
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="physical">Physical location</option>
            <option value="online">Online</option>
            <option value="mobile">Mobile</option>
            <option value="service_area">Service area</option>
            <option value="national">National</option>
          </select>
        </label>
        <div className="actions">
          <button className="btn quiet" onClick={() => save(false)}>
            Save draft
          </button>
          <button className="btn" onClick={() => save(true)}>
            Publish profile
          </button>
        </div>
        <p role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </section>
  );
}
