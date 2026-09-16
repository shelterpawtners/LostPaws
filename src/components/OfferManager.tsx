import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import {
  blankOffer,
  defaultRaveEventId,
  offerStatusLabel,
  type OfferTerms,
} from "../lib/offers";
import { isSafeHttpsUrl } from "../lib/offer-media";
import {
  resolveDefaultOrgId,
  selectedOrgStorageKey,
} from "../lib/organization-selection";
import { supabase as db } from "../lib/supabase";
import { LoadingState } from "./LoadingState";
import { MediaUpload } from "./MediaUpload";

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
  image_path: string | null;
  channel: "pet" | "rave";
  offer_versions: any[];
};
type EventOption = { id: string; title: string; starts_at: string | null };
type ProfileState =
  "draft" | "published" | "unpublished" | "suspended" | "removed";

/**
 * Builds (or updates) the local Offer entry for a just-saved draft/revision
 * without waiting on a server reload. Issue #250: a vendor whose save
 * succeeded but whose subsequent list reload failed (e.g. a stale schema
 * cache, a transient read error) saw their offer vanish from the sidebar
 * entirely, indistinguishable from the save itself having failed. The RPC
 * response already carries everything needed to render the row correctly,
 * so the sidebar no longer depends on a second round-trip succeeding.
 */
function applyOptimisticSave(
  current: Offer[],
  offerId: string,
  versionId: string,
  terms: OfferTerms,
  destinationUrl: string,
  imageUrls: string[],
): Offer[] {
  const version = {
    id: versionId,
    status: "draft",
    title: terms.title,
    summary: terms.summary,
    details: terms.details,
    terms: terms.terms,
    eligibility_kind: terms.eligibility_kind,
    starts_at: terms.starts_at ? `${terms.starts_at}:00` : null,
    ends_at: terms.ends_at ? `${terms.ends_at}:00` : null,
    claim_window_days: Number(terms.claim_window_days) || 30,
    availability_limit: terms.availability_limit
      ? Number(terms.availability_limit)
      : null,
    per_user_limit: terms.per_user_limit ? Number(terms.per_user_limit) : null,
    per_pet_limit: terms.per_pet_limit ? Number(terms.per_pet_limit) : null,
    redemption_instructions: terms.redemption_instructions,
    source_url: terms.source_url,
    disclosure: terms.disclosure,
  };
  const base: Offer = {
    id: offerId,
    title: terms.title,
    status: "draft",
    current_version_id: versionId,
    event_id: terms.event_id || null,
    destination_url: destinationUrl || null,
    product_label: terms.product_label || null,
    cta_label: terms.cta_label || null,
    image_urls: imageUrls,
    image_path: terms.image_path || null,
    channel: terms.channel,
    offer_versions: [version],
  };
  const existingIndex = current.findIndex((o) => o.id === offerId);
  if (existingIndex === -1) return [base, ...current];
  const updated = [...current];
  updated[existingIndex] = {
    ...base,
    // revise_partner_offer does not touch offers.status server-side --
    // only the new version starts as "draft". Publishing/pausing an
    // already-live offer's status happens separately via action().
    status: current[existingIndex].status,
    offer_versions: [...current[existingIndex].offer_versions, version],
  };
  return updated;
}

/** Optimistically reflects a publish/pause/resume/archive result locally,
 * same reasoning as applyOptimisticSave: the action already told us the new
 * state, so the sidebar shouldn't have to wait on (or fail because of) a
 * follow-up reload to show it. */
function applyOptimisticStatus(
  current: Offer[],
  offerId: string,
  offerStatus: string,
  versionStatus: string,
): Offer[] {
  return current.map((o) =>
    o.id === offerId
      ? {
          ...o,
          status: offerStatus,
          offer_versions: o.offer_versions.map((v) =>
            v.id === o.current_version_id ? { ...v, status: versionStatus } : v,
          ),
        }
      : o,
  );
}
export function OfferManager({ session }: { session: Session | null }) {
  const [searchParams] = useSearchParams();
  const startsInRaveMode = searchParams.get("channel") === "rave";
  const newOffer = (): OfferTerms => ({
    ...blankOffer,
    channel: startsInRaveMode ? "rave" : "pet",
  });
  const [orgs, setOrgs] = useState<Org[]>([]),
    [org, setOrg] = useState(""),
    [offers, setOffers] = useState<Offer[]>([]),
    [selected, setSelected] = useState(""),
    [form, setForm] = useState<OfferTerms>(newOffer),
    [preview, setPreview] = useState(false),
    [status, setStatus] = useState(""),
    [profileState, setProfileState] = useState<ProfileState | "missing">(
      "missing",
    ),
    [events, setEvents] = useState<EventOption[]>([]),
    [orgsLoaded, setOrgsLoaded] = useState(false),
    [offersLoading, setOffersLoading] = useState(true),
    [loadError, setLoadError] = useState(""),
    [liveOfferId, setLiveOfferId] = useState("");
  const isRaveOffer = form.channel === "rave";
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
        setOrg(resolveDefaultOrgId(x, session.user.id));
        setOrgsLoaded(true);
      });
  }, [session]);
  useEffect(() => {
    if (
      selected ||
      form.channel !== "rave" ||
      form.event_id ||
      events.length === 0
    )
      return;
    const eventId = defaultRaveEventId(events, form.event_id);
    if (eventId) setForm((current) => ({ ...current, event_id: eventId }));
  }, [events, form.channel, form.event_id, selected]);

  useEffect(() => {
    if (!session || !org) return;
    localStorage.setItem(selectedOrgStorageKey(session.user.id), org);
  }, [session, org]);
  const load = () => {
    if (!db || !org) return;
    void Promise.all([
      db
        .from("offers")
        .select(
          "id,title,status,current_version_id,event_id,destination_url,product_label,cta_label,image_urls,image_path,channel,offer_versions:offer_versions!offer_versions_offer_id_fkey(*)",
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
        // Issue #250: never wipe an already-visible list on a reload
        // failure -- that made a successful save look like it had vanished.
        // Surface the real Postgres/PostgREST error instead of a generic
        // message so a genuine schema/permission problem is diagnosable
        // instead of indistinguishable from "you have no offers."
        setLoadError(
          offerResult.error.message ||
            "Unable to load your offers from the server.",
        );
      } else {
        setLoadError("");
        setOffers((offerResult.data || []) as any);
      }
      setProfileState(
        (profileResult.data?.publication_status as ProfileState | undefined) ||
          "missing",
      );
      setOffersLoading(false);
    });
  };
  useEffect(() => {
    // Only show the sidebar's loading spinner for the initial fetch (or a
    // switch to a different organization). save()/action() call load()
    // directly afterward to silently refresh the list -- re-arming this on
    // every refresh flashed the whole list to a spinner after every publish/
    // pause/duplicate/archive, and briefly showed two simultaneous status
    // regions (this spinner plus the action's own "complete" message).
    if (!org) return;
    setOffersLoading(true);
    setLoadError("");
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org]);
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
    if (error) {
      setStatus(error.message);
      return;
    }
    // create_partner_offer returns the new offer id; revise_partner_offer
    // returns the new version id (the offer id is already `selected`). A
    // brand-new offer has no real version id to reference yet, so a locally
    // generated one is used purely as an internal key -- it is superseded
    // the moment the reload below succeeds.
    const offerId = selected || (data as string);
    const versionId = selected ? (data as string) : crypto.randomUUID();
    // Editing an already-live offer creates a new draft version and points
    // the offer at it immediately -- the previous published version stops
    // serving right away, it does not keep running until the new one is
    // published. That is easy to miss (e.g. attaching an event to a live
    // offer looks like a small edit), so say so plainly instead of the
    // generic message every save otherwise gets.
    const wasLive = offers.find((o) => o.id === selected)?.status === "active";
    setStatus(
      wasLive
        ? "Saved as a draft revision. This offer is now unpublished -- click Publish below to make these changes (including any event link) live again."
        : "Saved as a new draft version.",
    );
    setOffers((current) =>
      applyOptimisticSave(
        current,
        offerId,
        versionId,
        form,
        destinationUrl,
        imageUrls,
      ),
    );
    if (!selected) setSelected(offerId);
    setLiveOfferId("");
    load();
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
    const { data, error } = await db.rpc(
      name === "duplicate"
        ? "duplicate_partner_offer"
        : "set_partner_offer_state",
      name === "duplicate"
        ? { p_offer_id: id }
        : { p_offer_id: id, p_action: name },
    );
    if (error) {
      setStatus(error.message);
      load();
      return;
    }
    if (name === "duplicate") {
      setStatus("Duplicate created as a new draft.");
    } else {
      // set_partner_offer_state returns the version's new status directly
      // (published/scheduled/paused/archived/expired) -- using it instead of
      // a generic "<action> complete." gives the vendor the exact rule that
      // fired (e.g. a future start date produces "scheduled", not
      // "published", per Issue #250's required publish-result clarity).
      const versionStatus = data as string;
      const offerStatus =
        versionStatus === "published" || versionStatus === "scheduled"
          ? "active"
          : versionStatus === "paused"
            ? "suspended"
            : "expired";
      setStatus(
        versionStatus === "published"
          ? "Published. Now visible in Marketplace."
          : versionStatus === "scheduled"
            ? "Scheduled -- will publish automatically at the start date."
            : `${name} complete.`,
      );
      setOffers((current) =>
        applyOptimisticStatus(current, id, offerStatus, versionStatus),
      );
      setLiveOfferId(versionStatus === "published" ? id : "");
    }
    load();
  }
  function edit(o: Offer) {
    setSelected(o.id);
    const v =
      o.offer_versions.find((x) => x.id === o.current_version_id) ||
      o.offer_versions[0];
    setLiveOfferId(
      o.status === "active" && v?.status === "published" ? o.id : "",
    );
    setForm({
      ...blankOffer,
      ...v,
      // Several offer_versions text columns are nullable in the database
      // (details, terms, redemption_instructions, source_url, disclosure),
      // so a real reload can hand back null for any of them. Every field
      // bound to a controlled text input/textarea must default to "", not
      // null -- otherwise React flips the input from controlled to
      // uncontrolled (a console warning today, an input that silently stops
      // taking keystrokes on some browsers if it recurs).
      title: v?.title || "",
      summary: v?.summary || "",
      details: v?.details || "",
      terms: v?.terms || "",
      redemption_instructions: v?.redemption_instructions || "",
      source_url: v?.source_url || "",
      disclosure: v?.disclosure || "",
      channel: o.channel || "pet",
      event_id: o.event_id || "",
      destination_url: o.destination_url || "",
      product_label: o.product_label || "",
      cta_label: o.cta_label || "",
      image_urls_text: (o.image_urls || []).join("\n"),
      image_path: o.image_path || "",
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
  if (!orgsLoaded) {
    return (
      <section className="section shell formPage">
        <LoadingState>Loading your business…</LoadingState>
      </section>
    );
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
    <section className="section shell formPage offerManagerPage">
      <span className="eyebrow">Partner offers</span>
      <h1>{selected ? "Edit your offer" : "Create a new offer"}</h1>
      <p className="lead">
        {selected
          ? "Saved edits create a new draft version. Publish again when you are ready to make it live."
          : "Choose an audience, then add the details that help customers use your offer."}
      </p>
      <div className="dashboardGrid">
        <aside className="rolePanel offerListPanel" aria-label="Your offers">
          <div className="offerListHeading">
            <div>
              <h2>Your offers</h2>
              <p>
                {offers.length === 1 ? "1 offer" : `${offers.length} offers`}
              </p>
            </div>
            <button
              className="btn quiet"
              onClick={() => {
                setSelected("");
                setLiveOfferId("");
                setForm(newOffer());
              }}
            >
              New offer
            </button>
          </div>
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
          {loadError && (
            <div className="notice" role="alert">
              <b>Your list couldn&apos;t refresh.</b> {loadError}
              {offers.length > 0 &&
                " Offers you already had loaded are still shown below and are not affected."}
              <button
                type="button"
                className="textButton"
                onClick={() => {
                  setOffersLoading(true);
                  load();
                }}
              >
                Retry
              </button>
            </div>
          )}
          {offersLoading ? (
            <LoadingState>Loading your offers…</LoadingState>
          ) : offers.length === 0 ? (
            <p className="offerEmpty">
              No offers yet. Start with a clear title and the deal you want to
              share.
            </p>
          ) : (
            offers.map((o) => (
              <button
                className={selected === o.id ? "role active" : "role"}
                key={o.id}
                onClick={() => edit(o)}
              >
                {o.title} ·{" "}
                {offerStatusLabel(
                  (
                    o.offer_versions.find(
                      (x) => x.id === o.current_version_id,
                    ) || {}
                  ).status || o.status,
                )}
              </button>
            ))
          )}
        </aside>
        <div className="panel offerEditorPanel">
          <div className="offerEditorHeading">
            <span className="eyebrow">
              {selected ? "Editing an existing offer" : "New offer"}
            </span>
            <h2>{selected ? "Offer details" : "Create your offer"}</h2>
          </div>
          <div className="fields">
            <label>
              Offer audience
              <select
                value={form.channel}
                onChange={(event) => set("channel", event.target.value)}
              >
                <option value="pet">Pet and Guardian offer</option>
                <option value="rave">Human / RAVE offer</option>
              </select>
            </label>
            {isRaveOffer && (
              <p className="fields-wide notice">
                Create a reusable offer first, then optionally feature it at an
                event. Switching back preserves the pet fields you already
                entered.
              </p>
            )}
            {isRaveOffer && (
              <p className="fields-wide formSectionHeading">Basics</p>
            )}
            <label>
              Title
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </label>
            <label>
              Deal / description
              <input
                value={form.summary}
                onChange={(e) => set("summary", e.target.value)}
              />
            </label>
            <label>
              More details (optional)
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
            {!isRaveOffer && (
              <label>
                How customers use it
                <textarea
                  value={form.redemption_instructions}
                  onChange={(e) =>
                    set("redemption_instructions", e.target.value)
                  }
                />
              </label>
            )}
            {!isRaveOffer && (
              <>
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
              </>
            )}
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
            {!isRaveOffer && (
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
            )}
            {!isRaveOffer && (
              <label>
                Available quantity
                <input
                  type="number"
                  min="1"
                  value={form.availability_limit}
                  onChange={(e) => set("availability_limit", e.target.value)}
                />
              </label>
            )}
            {!isRaveOffer && (
              <label>
                Per-user limit
                <input
                  type="number"
                  min="1"
                  value={form.per_user_limit}
                  onChange={(e) => set("per_user_limit", e.target.value)}
                />
              </label>
            )}
            {!isRaveOffer && (
              <label>
                Per-pet limit
                <input
                  type="number"
                  min="1"
                  value={form.per_pet_limit}
                  onChange={(e) => set("per_pet_limit", e.target.value)}
                />
              </label>
            )}
            {!isRaveOffer && (
              <label>
                Source URL
                <input
                  type="url"
                  value={form.source_url}
                  onChange={(e) => set("source_url", e.target.value)}
                />
              </label>
            )}
            <label>
              {isRaveOffer
                ? "Shop / website / social link (https only)"
                : "Product / store link (Etsy or your own store, https only)"}
              <input
                type="url"
                placeholder="https://www.etsy.com/listing/..."
                value={form.destination_url}
                onChange={(e) => set("destination_url", e.target.value)}
              />
            </label>
            {!isRaveOffer && (
              <label>
                Product label override (optional)
                <input
                  placeholder="Defaults to the offer title above"
                  value={form.product_label}
                  onChange={(e) => set("product_label", e.target.value)}
                />
              </label>
            )}
            {!isRaveOffer && (
              <label>
                Call-to-action button text (optional)
                <input
                  placeholder="Defaults to “Shop on Etsy” or “Visit vendor store”"
                  value={form.cta_label}
                  onChange={(e) => set("cta_label", e.target.value)}
                />
              </label>
            )}
            <label className="fields-wide">
              Cover photo
              {isRaveOffer && (
                <span className="fieldDescription">
                  Your photo attaches to this offer as soon as upload finishes.
                </span>
              )}
              <MediaUpload
                ownerId={org}
                recordId={selected}
                value={form.image_path}
                onChange={(path) => set("image_path", path)}
                onPersist={async (path) => {
                  if (!db) return "Not connected.";
                  const { error } = await db.rpc(
                    "set_partner_offer_image_path",
                    { p_offer_id: selected, p_image_path: path },
                  );
                  if (error) return error.message;
                  setOffers((current) =>
                    current.map((o) =>
                      o.id === selected ? { ...o, image_path: path } : o,
                    ),
                  );
                  return null;
                }}
              />
            </label>
            {!isRaveOffer && (
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
            )}
            <label>
              Feature this offer at an event (optional)
              {isRaveOffer && (
                <span className="fieldDescription">
                  Leave this blank to keep the offer available outside events.
                </span>
              )}
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
                {liveOfferId === selected && (
                  <Link className="btn" to={`/offers/${selected}`}>
                    View in Marketplace
                  </Link>
                )}
              </>
            )}
          </div>
          {preview && (
            <div className="card">
              <span className="eyebrow">
                Preview ·{" "}
                {isRaveOffer
                  ? "Human / RAVE"
                  : form.eligibility_kind.replaceAll("_", " ")}
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
