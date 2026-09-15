import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { blankOffer, offerStatusLabel, type OfferTerms } from "../lib/offers";
import { isSafeHttpsUrl } from "../lib/offer-media";
import { supabase as db } from "../lib/supabase";

type Org = { id: string; public_name: string };
type Offer = {
  id: string;
  title: string;
  status: string;
  current_version_id: string;
  event_id: string | null;
  destination_url: string | null;
  product_label: string | null;
  cta_label: string | null;
  image_urls: string[] | null;
  offer_versions: any[];
};
type EventOption = { id: string; title: string; starts_at: string | null };
type ProfileState =
  "draft" | "published" | "unpublished" | "suspended" | "removed";
export function OfferManager({ session }: { session: Session | null }) {
  const [orgs, setOrgs] = useState<Org[]>([]),
    [org, setOrg] = useState(""),
    [offers, setOffers] = useState<Offer[]>([]),
    [selected, setSelected] = useState(""),
    [form, setForm] = useState<OfferTerms>(blankOffer),
    [preview, setPreview] = useState(false),
    [status, setStatus] = useState(""),
    [profileState, setProfileState] = useState<ProfileState | "missing">(
      "missing",
    ),
    [events, setEvents] = useState<EventOption[]>([]),
    [orgsLoaded, setOrgsLoaded] = useState(false);
  useEffect(() => {
    if (!db) return;
    void db
      .from("events")
      .select("id,title,starts_at")
      .eq("status", "active")
      .not("published_at", "is", null)
      .order("starts_at", { ascending: true, nullsFirst: false })
      .limit(50)
      .then(({ data }) => setEvents((data as EventOption[]) || []));
  }, []);
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
        setOrgsLoaded(true);
      });
  }, [session]);
  const load = () => {
    if (!db || !org) return;
    void Promise.all([
      db
        .from("offers")
        .select(
          "id,title,status,current_version_id,event_id,destination_url,product_label,cta_label,image_urls,offer_versions:offer_versions!offer_versions_offer_id_fkey(*)",
        )
        .eq("organization_id", org)
        .order("created_at", { ascending: false }),
      db
        .from("organization_partner_profiles")
        .select("publication_status")
        .eq("organization_id", org)
        .maybeSingle(),
    ]).then(([offerResult, profileResult]) => {
      if (offerResult.error) {
        setOffers([]);
        setStatus("Unable to load your offers. Please try again.");
      } else {
        setOffers((offerResult.data || []) as any);
      }
      setProfileState(
        (profileResult.data?.publication_status as ProfileState | undefined) ||
          "missing",
      );
    });
  };
  useEffect(load, [org]);
  const set = (key: keyof OfferTerms, value: string) =>
    setForm((v) => ({ ...v, [key]: value }));
  async function save() {
    if (!db || !org) return;
    const destinationUrl = form.destination_url.trim();
    const imageUrls = form.image_urls_text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (!isSafeHttpsUrl(destinationUrl)) {
      setStatus("Product/store link must be a valid https:// URL.");
      return;
    }
    const badImage = imageUrls.find((url) => !isSafeHttpsUrl(url));
    if (badImage) {
      setStatus(
        `Every product image must be an https:// URL. Check: ${badImage}`,
      );
      return;
    }
    const terms = {
      ...form,
      destination_url: destinationUrl,
      image_urls: imageUrls,
    };
    const args = selected
      ? { p_offer_id: selected, p_terms: terms }
      : { p_organization_id: org, p_terms: terms };
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
    if (
      (name === "pause" || name === "archive") &&
      !window.confirm(
        name === "pause"
          ? "Pause this offer? Guardians won't be able to claim it until you resume it."
          : "Archive this offer? It will no longer be shown or editable as an active offer.",
      )
    )
      return;
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
      event_id: o.event_id || "",
      destination_url: o.destination_url || "",
      product_label: o.product_label || "",
      cta_label: o.cta_label || "",
      image_urls_text: (o.image_urls || []).join("\n"),
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
  if (orgsLoaded && orgs.length === 0) {
    return (
      <section className="section shell formPage">
        <span className="eyebrow">Partner offers</span>
        <h1>Finish setting up your business first.</h1>
        <p className="lead">
          Offers belong to a business account, and you don't have one yet.
          Complete onboarding, then come back here to create your first offer.
        </p>
        <div className="actions">
          <Link className="btn" to="/onboarding/rave_vendor">
            Complete RAVE vendor setup
          </Link>
          <Link className="btn quiet" to="/onboarding/petbiz">
            Complete pet business setup
          </Link>
        </div>
      </section>
    );
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
          <div className="notice" data-testid="marketplace-profile-state">
            <b>Marketplace profile:</b> {profileState.replaceAll("_", " ")}.
            {profileState === "published"
              ? " Your public business profile is visible to Guardians."
              : " Publish your Partner profile so Guardians can learn about your business alongside its offers."}
          </div>
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
              <span>
                Eligibility
                <span
                  className="fieldHelp"
                  role="img"
                  aria-label="Eligibility help: choose enhanced only when the offer has a separate benefit for eligible shelter pets."
                  title="Choose enhanced only when the offer has a separate benefit for eligible shelter pets."
                >
                  ?
                </span>
              </span>
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
              <span>
                Where it applies
                <span
                  className="fieldHelp"
                  role="img"
                  aria-label="Where it applies help: choose where a Guardian can use this offer."
                  title="Choose where a Guardian can use this offer."
                >
                  ?
                </span>
              </span>
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
              Product / store link (Etsy or your own store, https only)
              <input
                type="url"
                placeholder="https://www.etsy.com/listing/..."
                value={form.destination_url}
                onChange={(e) => set("destination_url", e.target.value)}
              />
            </label>
            <label>
              Product label override (optional)
              <input
                placeholder="Defaults to the offer title above"
                value={form.product_label}
                onChange={(e) => set("product_label", e.target.value)}
              />
            </label>
            <label>
              Call-to-action button text (optional)
              <input
                placeholder="Defaults to “Shop on Etsy” or “Visit vendor store”"
                value={form.cta_label}
                onChange={(e) => set("cta_label", e.target.value)}
              />
            </label>
            <label className="fields-wide">
              Product images (one https:// URL per line)
              <textarea
                placeholder={
                  "https://images.example.com/photo-1.jpg\nhttps://images.example.com/photo-2.jpg"
                }
                value={form.image_urls_text}
                onChange={(e) => set("image_urls_text", e.target.value)}
              />
            </label>
            <label>
              Attach to an event (optional)
              <select
                value={form.event_id}
                onChange={(e) => set("event_id", e.target.value)}
              >
                <option value="">No specific event</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                    {ev.starts_at
                      ? ` — ${new Date(ev.starts_at).toLocaleDateString()}`
                      : ""}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>
                Disclosure
                <span
                  className="fieldHelp"
                  role="img"
                  aria-label="Disclosure help: add any material condition a Guardian should know before using the offer."
                  title="Add any material condition a Guardian should know before using the offer."
                >
                  ?
                </span>
              </span>
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
          <p className="formStatus" role="status" aria-live="polite">
            {status}
          </p>
        </div>
      </div>
    </section>
  );
}
