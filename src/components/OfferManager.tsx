import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { blankOffer, offerStatusLabel, type OfferTerms } from "../lib/offers";
import { supabase as db } from "../lib/supabase";

type Org = { id: string; public_name: string };
type Offer = {
  id: string;
  title: string;
  status: string;
  current_version_id: string;
  offer_versions: any[];
};
export function OfferManager({ session }: { session: Session | null }) {
  const [orgs, setOrgs] = useState<Org[]>([]),
    [org, setOrg] = useState(""),
    [offers, setOffers] = useState<Offer[]>([]),
    [selected, setSelected] = useState(""),
    [form, setForm] = useState<OfferTerms>(blankOffer),
    [preview, setPreview] = useState(false),
    [status, setStatus] = useState("");
  useEffect(() => {
    if (!db || !session) return;
    void db
      .from("organization_memberships")
      .select("organizations(id,public_name)")
      .eq("user_id", session.user.id)
      .eq("status", "active")
      .then(({ data }) => {
        const x = (data || []).map((r: any) => r.organizations).filter(Boolean);
        setOrgs(x);
        setOrg(x[0]?.id || "");
      });
  }, [session]);
  const load = () => {
    if (!db || !org) return;
    void db
      .from("offers")
      .select("id,title,status,current_version_id,offer_versions(*)")
      .eq("organization_id", org)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOffers((data || []) as any));
  };
  useEffect(load, [org]);
  const set = (key: keyof OfferTerms, value: string) =>
    setForm((v) => ({ ...v, [key]: value }));
  async function save() {
    if (!db || !org) return;
    const args = selected
      ? { p_offer_id: selected, p_terms: form }
      : { p_organization_id: org, p_terms: form };
    const { data, error } = await db.rpc(
      selected ? "revise_partner_offer" : "create_partner_offer",
      args as any,
    );
    setStatus(error ? error.message : "Saved as a new draft version.");
    if (!error) {
      if (!selected) setSelected(data as string);
      load();
    }
  }
  async function action(name: string, id = selected) {
    if (!db || !id) return;
    const { error } = await db.rpc(
      name === "duplicate"
        ? "duplicate_partner_offer"
        : "set_partner_offer_state",
      name === "duplicate"
        ? { p_offer_id: id }
        : { p_offer_id: id, p_action: name },
    );
    setStatus(error ? error.message : `${name} complete.`);
    load();
  }
  function edit(o: Offer) {
    setSelected(o.id);
    const v =
      o.offer_versions.find((x) => x.id === o.current_version_id) ||
      o.offer_versions[0];
    setForm({
      ...blankOffer,
      ...v,
      starts_at: v?.starts_at?.slice(0, 16) || "",
      ends_at: v?.ends_at?.slice(0, 16) || "",
      claim_window_days: String(v?.claim_window_days || 30),
      availability_limit: v?.availability_limit
        ? String(v.availability_limit)
        : "",
      per_user_limit: v?.per_user_limit ? String(v.per_user_limit) : "",
      per_pet_limit: v?.per_pet_limit ? String(v.per_pet_limit) : "",
    });
  }
  return (
    <section className="section shell formPage">
      <span className="eyebrow">Partner offers</span>
      <h1>Create clear offers without rewriting history.</h1>
      <p className="lead">
        Every saved edit becomes a new version. Advanced limits are optional.
      </p>
      <div className="dashboardGrid">
        <aside className="rolePanel">
          <h2>Your offers</h2>
          <label>
            Organization
            <select value={org} onChange={(e) => setOrg(e.target.value)}>
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.public_name}
                </option>
              ))}
            </select>
          </label>
          <button
            className="btn quiet"
            onClick={() => {
              setSelected("");
              setForm(blankOffer);
            }}
          >
            New offer
          </button>
          {offers.map((o) => (
            <button className="role" key={o.id} onClick={() => edit(o)}>
              {o.title} ·{" "}
              {offerStatusLabel(
                (
                  o.offer_versions.find((x) => x.id === o.current_version_id) ||
                  {}
                ).status || o.status,
              )}
            </button>
          ))}
        </aside>
        <div className="panel">
          <div className="fields">
            <label>
              Title
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </label>
            <label>
              Short description
              <input
                value={form.summary}
                onChange={(e) => set("summary", e.target.value)}
              />
            </label>
            <label>
              Details
              <textarea
                value={form.details}
                onChange={(e) => set("details", e.target.value)}
              />
            </label>
            <label>
              Terms and conditions
              <textarea
                value={form.terms}
                onChange={(e) => set("terms", e.target.value)}
              />
            </label>
            <label>
              How customers use it
              <textarea
                value={form.redemption_instructions}
                onChange={(e) => set("redemption_instructions", e.target.value)}
              />
            </label>
            <label>
              Eligibility
              <select
                value={form.eligibility_kind}
                onChange={(e) => set("eligibility_kind", e.target.value)}
              >
                <option value="all_pets">All pets</option>
                <option value="shelter_pet_enhanced">
                  Enhanced for eligible shelter pets
                </option>
              </select>
            </label>
            <label>
              Where it applies
              <select
                value={form.applicability}
                onChange={(e) => set("applicability", e.target.value)}
              >
                <option value="online">Online</option>
                <option value="all_organization_locations">
                  All organization locations
                </option>
                <option value="national">Nationwide</option>
              </select>
            </label>
            <label>
              Starts
              <input
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) => set("starts_at", e.target.value)}
              />
            </label>
            <label>
              Ends
              <input
                type="datetime-local"
                value={form.ends_at}
                onChange={(e) => set("ends_at", e.target.value)}
              />
            </label>
            <label>
              Claim expires after days
              <input
                type="number"
                min="1"
                max="90"
                value={form.claim_window_days}
                onChange={(e) => set("claim_window_days", e.target.value)}
              />
            </label>
            <label>
              Available quantity
              <input
                type="number"
                min="1"
                value={form.availability_limit}
                onChange={(e) => set("availability_limit", e.target.value)}
              />
            </label>
            <label>
              Per-user limit
              <input
                type="number"
                min="1"
                value={form.per_user_limit}
                onChange={(e) => set("per_user_limit", e.target.value)}
              />
            </label>
            <label>
              Per-pet limit
              <input
                type="number"
                min="1"
                value={form.per_pet_limit}
                onChange={(e) => set("per_pet_limit", e.target.value)}
              />
            </label>
            <label>
              Source URL
              <input
                type="url"
                value={form.source_url}
                onChange={(e) => set("source_url", e.target.value)}
              />
            </label>
            <label>
              Disclosure
              <textarea
                value={form.disclosure}
                onChange={(e) => set("disclosure", e.target.value)}
              />
            </label>
          </div>
          <div className="actions">
            <button className="btn quiet" onClick={save}>
              Save new version
            </button>
            <button className="btn quiet" onClick={() => setPreview((v) => !v)}>
              Preview
            </button>
            {selected && (
              <>
                <button className="btn" onClick={() => action("publish")}>
                  Publish or schedule
                </button>
                <button className="textButton" onClick={() => action("pause")}>
                  Pause
                </button>
                <button className="textButton" onClick={() => action("resume")}>
                  Resume
                </button>
                <button
                  className="textButton"
                  onClick={() => action("duplicate")}
                >
                  Duplicate
                </button>
                <button
                  className="textButton"
                  onClick={() => action("archive")}
                >
                  Archive
                </button>
              </>
            )}
          </div>
          {preview && (
            <div className="card">
              <span className="eyebrow">
                Preview · {form.eligibility_kind.replaceAll("_", " ")}
              </span>
              <h2>{form.title || "Untitled offer"}</h2>
              <p>{form.summary}</p>
              <h3>Terms</h3>
              <p>{form.terms}</p>
            </div>
          )}
          <p role="status" aria-live="polite">
            {status}
          </p>
        </div>
      </div>
    </section>
  );
}
