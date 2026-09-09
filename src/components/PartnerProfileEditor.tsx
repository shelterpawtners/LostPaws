import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase as db } from "../lib/supabase";
import {
  isHttpUrl,
  partnerBusinessModels,
  partnerDayNames,
  partnerSocialPlatforms,
} from "../lib/partner-profile";

type Org = { id: string; public_name: string };
type Hours = { opens_at: string; closes_at: string; is_closed: boolean };
const blankHours = () =>
  partnerDayNames.map(() => ({
    opens_at: "09:00",
    closes_at: "17:00",
    is_closed: true,
  }));

export function PartnerProfileEditor({ session }: { session: Session | null }) {
  const selectionKey = session
    ? `partner-profile:selected-org:${session.user.id}`
    : "";
  const [orgs, setOrgs] = useState<Org[]>([]),
    [categories, setCategories] = useState<{ id: string; label: string }[]>([]),
    [id, setId] = useState(""),
    [status, setStatus] = useState(""),
    [saving, setSaving] = useState(false);
  const [loadingSetup, setLoadingSetup] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [description, setDescription] = useState(""),
    [about, setAbout] = useState(""),
    [model, setModel] = useState("physical"),
    [website, setWebsite] = useState(""),
    [email, setEmail] = useState(""),
    [phone, setPhone] = useState(""),
    [booking, setBooking] = useState(""),
    [order, setOrder] = useState(""),
    [serviceArea, setServiceArea] = useState(""),
    [species, setSpecies] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]),
    [socials, setSocials] = useState<Record<string, string>>({}),
    [hours, setHours] = useState<Hours[]>(blankHours()),
    [locations, setLocations] = useState<string[]>([]);
  const [primaryName, setPrimaryName] = useState(""),
    [primaryEmail, setPrimaryEmail] = useState(""),
    [primaryPhone, setPrimaryPhone] = useState(""),
    [opsName, setOpsName] = useState(""),
    [opsEmail, setOpsEmail] = useState(""),
    [opsPhone, setOpsPhone] = useState("");
  useEffect(() => {
    if (!db || !session) return;
    let cancelled = false;
    setLoadingSetup(true);
    void Promise.all([
      db
        .from("organization_memberships")
        .select("organization_id, organizations(id,public_name)")
        .eq("user_id", session.user.id)
        .eq("status", "active"),
      db
        .from("partner_categories")
        .select("id,label")
        .eq("is_active", true)
        .order("sort_order"),
    ])
      .then(([m, c]) => {
        if (cancelled) return;
        const next = (m.data || [])
          .map((r: any) => r.organizations)
          .filter(Boolean)
          .sort((a: Org, b: Org) => a.id.localeCompare(b.id)) as Org[];
        const storedOrgId = selectionKey
          ? localStorage.getItem(selectionKey)
          : null;
        const selectedOrgId = next.some((org) => org.id === storedOrgId)
          ? storedOrgId || ""
          : next[0]?.id || "";
        setOrgs(next);
        setId(selectedOrgId);
        setCategories((c.data || []) as any);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingSetup(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectionKey, session]);
  useEffect(() => {
    if (!selectionKey || !id) return;
    localStorage.setItem(selectionKey, id);
  }, [id, selectionKey]);
  useEffect(() => {
    if (!db || !id) return;
    let cancelled = false;
    setLoadingProfile(true);
    void Promise.all([
      db
        .from("organization_partner_profiles")
        .select("*")
        .eq("organization_id", id)
        .maybeSingle(),
      db
        .from("organizations")
        .select("website_url,public_email,public_phone")
        .eq("id", id)
        .maybeSingle(),
      db
        .from("organization_categories")
        .select("category_id")
        .eq("organization_id", id),
      db
        .from("organization_social_links")
        .select("platform,url")
        .eq("organization_id", id),
      db
        .from("organization_business_hours")
        .select("*")
        .eq("organization_id", id),
      db
        .from("organization_locations")
        .select("city,state_province,location_type")
        .eq("organization_id", id),
      db
        .from("organization_private_contacts")
        .select("*")
        .eq("organization_id", id)
        .maybeSingle(),
    ])
      .then(([p, o, c, s, h, l, contacts]) => {
        if (cancelled) return;
        const profile: any = p.data || {},
          org: any = o.data || {},
          contact: any = contacts.data || {};
        setDescription(profile.public_description || "");
        setAbout(profile.public_about || "");
        setModel(profile.business_model || "physical");
        setStatus(profile.publication_status || "Draft");
        setWebsite(org.website_url || "");
        setEmail(org.public_email || "");
        setPhone(org.public_phone || "");
        setBooking(profile.public_booking_url || "");
        setOrder(profile.public_order_url || "");
        setServiceArea(profile.public_service_area || "");
        setSpecies((profile.species_served || []).join(", "));
        setSelectedCategories((c.data || []).map((x: any) => x.category_id));
        setSocials(
          Object.fromEntries(
            (s.data || []).map((x: any) => [x.platform, x.url]),
          ),
        );
        const next = blankHours();
        (h.data || []).forEach(
          (x: any) =>
            (next[x.day_of_week] = {
              opens_at: x.opens_at?.slice(0, 5) || "09:00",
              closes_at: x.closes_at?.slice(0, 5) || "17:00",
              is_closed: x.is_closed,
            }),
        );
        setHours(next);
        setLocations(
          (l.data || []).map((x: any) =>
            [x.city, x.state_province, x.location_type]
              .filter(Boolean)
              .join(", "),
          ),
        );
        setPrimaryName(contact.primary_contact_name || "");
        setPrimaryEmail(contact.primary_contact_email || "");
        setPrimaryPhone(contact.primary_contact_phone || "");
        setOpsName(contact.operational_contact_name || "");
        setOpsEmail(contact.operational_contact_email || "");
        setOpsPhone(contact.operational_contact_phone || "");
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingProfile(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);
  const toggle = (categoryId: string) =>
    setSelectedCategories((v) =>
      v.includes(categoryId)
        ? v.filter((x) => x !== categoryId)
        : [...v, categoryId],
    );
  async function save(publish = false, unpublish = false) {
    if (!db || !id || saving || loadingProfile) return;
    const invalidSocial = Object.values(socials).some((url) => {
      if (!url.trim()) return false;
      return !isHttpUrl(url);
    });
    if (invalidSocial)
      return setStatus(
        "Social links must be complete http:// or https:// URLs.",
      );
    setSaving(true);
    setStatus("Saving…");
    const profile = await db.from("organization_partner_profiles").upsert(
      {
        organization_id: id,
        public_description: description || null,
        public_about: about || null,
        business_model: model,
        public_booking_url: booking || null,
        public_order_url: order || null,
        public_service_area: serviceArea || null,
        species_served: species
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        ...(unpublish ? { publication_status: "unpublished" } : {}),
      },
      { onConflict: "organization_id" },
    );
    const org = await db
      .from("organizations")
      .update({
        website_url: website || null,
        public_email: email || null,
        public_phone: phone || null,
      })
      .eq("id", id);
    const contacts = await db.from("organization_private_contacts").upsert(
      {
        organization_id: id,
        primary_contact_name: primaryName || null,
        primary_contact_email: primaryEmail || null,
        primary_contact_phone: primaryPhone || null,
        operational_contact_name: opsName || null,
        operational_contact_email: opsEmail || null,
        operational_contact_phone: opsPhone || null,
      },
      { onConflict: "organization_id" },
    );
    const initial = [profile, org, contacts].find((x: any) => x.error) as any;
    if (initial?.error) {
      setSaving(false);
      return setStatus(initial.error.message);
    }
    const clear = await Promise.all([
      db.from("organization_categories").delete().eq("organization_id", id),
      db.from("organization_social_links").delete().eq("organization_id", id),
      db.from("organization_business_hours").delete().eq("organization_id", id),
    ]);
    const clearError = clear.find((x: any) => x.error) as any;
    if (clearError?.error) {
      setSaving(false);
      return setStatus(clearError.error.message);
    }
    const socialRows = Object.entries(socials)
      .filter(([, url]) => url.trim())
      .map(([platform, url]) => ({
        organization_id: id,
        platform,
        url: url.trim(),
      }));
    const writes = await Promise.all([
      selectedCategories.length
        ? db.from("organization_categories").insert(
            selectedCategories.map((category_id) => ({
              organization_id: id,
              category_id,
            })),
          )
        : Promise.resolve({ error: null }),
      socialRows.length
        ? db.from("organization_social_links").insert(socialRows)
        : Promise.resolve({ error: null }),
      db.from("organization_business_hours").insert(
        hours.map((value, day_of_week) => ({
          organization_id: id,
          day_of_week,
          opens_at: value.is_closed ? null : value.opens_at,
          closes_at: value.is_closed ? null : value.closes_at,
          is_closed: value.is_closed,
        })),
      ),
    ]);
    const writeError = writes.find((x: any) => x.error) as any;
    if (writeError?.error) {
      setSaving(false);
      return setStatus(writeError.error.message);
    }
    if (publish) {
      const { error } = await db.rpc("publish_partner_profile", {
        p_organization_id: id,
      });
      setStatus(
        error
          ? error.message
          : "Published. Your listing is now visible in the directory.",
      );
    } else
      setStatus(
        unpublish
          ? "Unpublished. Your profile is no longer publicly listed."
          : "Saved as a private draft.",
      );
    setSaving(false);
  }
  const field = (
    label: string,
    value: string,
    set: (v: string) => void,
    type = "text",
  ) => (
    <label>
      {label}
      <input type={type} value={value} onChange={(e) => set(e.target.value)} />
    </label>
  );
  return (
    <section className="section shell formPage">
      <span className="eyebrow">Partner profile</span>
      <h1>Make your business easy to understand.</h1>
      <p className="lead">
        Your public profile helps guardians find you. Internal contacts stay
        private and are never shown in the directory.
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
        {loadingProfile && (
          <p role="status" aria-live="polite">
            Loading saved profile details…
          </p>
        )}
        <fieldset disabled={saving || loadingProfile || loadingSetup || !id}>
          <div className="fields">
            <label>
              Public description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label>
              About your business
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </label>
            {field("Public website", website, setWebsite, "url")}
            {field("Public email", email, setEmail, "email")}
            {field("Public phone", phone, setPhone, "tel")}
            {field("Booking URL", booking, setBooking, "url")}
            {field("Order or ecommerce URL", order, setOrder, "url")}
            {field("Service area", serviceArea, setServiceArea)}
            <label>
              How customers are served
              <select value={model} onChange={(e) => setModel(e.target.value)}>
                {partnerBusinessModels.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            {field("Species served (comma separated)", species, setSpecies)}
          </div>
          <h2>Categories</h2>
          <div className="relationshipOptions">
            {categories.map((c) => (
              <label key={c.id}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c.id)}
                  onChange={() => toggle(c.id)}
                />
                {c.label}
              </label>
            ))}
          </div>
          <h2>Social links</h2>
          <div className="fields">
            {partnerSocialPlatforms.map((platform) =>
              field(
                `${platform} URL`,
                socials[platform] || "",
                (url) => setSocials((all) => ({ ...all, [platform]: url })),
                "url",
              ),
            )}
          </div>
          <h2>Business hours</h2>
          <div className="fields">
            {partnerDayNames.map((day, i) => (
              <fieldset key={day}>
                <legend>{day}</legend>
                <label>
                  <input
                    type="checkbox"
                    checked={hours[i].is_closed}
                    onChange={(e) =>
                      setHours((all) =>
                        all.map((h, n) =>
                          n === i ? { ...h, is_closed: e.target.checked } : h,
                        ),
                      )
                    }
                  />
                  Closed
                </label>
                {!hours[i].is_closed && (
                  <>
                    <input
                      aria-label={`${day} opening time`}
                      type="time"
                      value={hours[i].opens_at}
                      onChange={(e) =>
                        setHours((all) =>
                          all.map((h, n) =>
                            n === i ? { ...h, opens_at: e.target.value } : h,
                          ),
                        )
                      }
                    />
                    <input
                      aria-label={`${day} closing time`}
                      type="time"
                      value={hours[i].closes_at}
                      onChange={(e) =>
                        setHours((all) =>
                          all.map((h, n) =>
                            n === i ? { ...h, closes_at: e.target.value } : h,
                          ),
                        )
                      }
                    />
                  </>
                )}
              </fieldset>
            ))}
          </div>
          <h2>Locations and service context</h2>
          <p>
            {locations.length
              ? locations.join(" · ")
              : "No saved locations. An online, national, mobile, or service-area model can publish without a street address."}
          </p>
          <h2>Private contacts</h2>
          <p className="lead">
            Only organization owners and administrators can access these
            contacts.
          </p>
          <div className="fields">
            {field("Primary contact name", primaryName, setPrimaryName)}
            {field(
              "Primary contact email",
              primaryEmail,
              setPrimaryEmail,
              "email",
            )}
            {field(
              "Primary contact phone",
              primaryPhone,
              setPrimaryPhone,
              "tel",
            )}
            {field("Operational/redemption contact name", opsName, setOpsName)}
            {field(
              "Operational/redemption email",
              opsEmail,
              setOpsEmail,
              "email",
            )}
            {field(
              "Operational/redemption phone",
              opsPhone,
              setOpsPhone,
              "tel",
            )}
          </div>
          <div className="actions">
            <button className="btn quiet" onClick={() => save(false)}>
              Save draft
            </button>
            <button className="btn" onClick={() => save(true)}>
              Publish profile
            </button>
            <button className="textButton" onClick={() => save(false, true)}>
              Unpublish profile
            </button>
          </div>
        </fieldset>
        <p
          role="status"
          aria-live="polite"
          data-testid="partner-profile-save-status"
        >
          {status}
        </p>
      </div>
    </section>
  );
}
