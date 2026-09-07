import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase as db } from "../lib/supabase";

type Profile = {
  business_name: string;
  description: string;
  about: string | null;
  website_url: string | null;
  public_email: string | null;
  public_phone: string | null;
  booking_url: string | null;
  order_url: string | null;
  service_area: string | null;
  business_model: string;
  participation_state: string;
  social_links: { platform: string; url: string; label: string | null }[];
  locations: {
    city: string | null;
    state: string | null;
    postal: string | null;
  }[];
  hours: {
    day: number;
    opens: string | null;
    closes: string | null;
    closed: boolean;
  }[];
};
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export function PublicPartnerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    if (!db || !id) return;
    db.rpc("public_partner_profile_details", { p_organization_id: id })
      .maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));
  }, [id]);
  if (!profile)
    return (
      <section className="section shell">
        <h1>Partner not available</h1>
        <p>This profile is not published or no longer available.</p>
        <Link className="btn" to="/directory">
          Back to directory
        </Link>
      </section>
    );
  return (
    <section className="section shell formPage">
      <span className="eyebrow">{profile.participation_state}</span>
      <h1>{profile.business_name}</h1>
      <p className="lead">{profile.description}</p>
      {profile.about && <p>{profile.about}</p>}
      <div className="panel">
        <p>
          <b>How they serve customers:</b>{" "}
          {profile.business_model.replaceAll("_", " ")}
        </p>
        {profile.service_area && (
          <p>
            <b>Service area:</b> {profile.service_area}
          </p>
        )}
        <div className="actions">
          {profile.website_url && (
            <a className="btn" href={profile.website_url}>
              Visit website
            </a>
          )}
          {profile.booking_url && (
            <a className="btn quiet" href={profile.booking_url}>
              Book or reserve
            </a>
          )}
          {profile.order_url && (
            <a className="btn quiet" href={profile.order_url}>
              Order online
            </a>
          )}
        </div>
        {profile.public_email && (
          <p>
            <a href={`mailto:${profile.public_email}`}>Email this business</a>
          </p>
        )}
        {profile.public_phone && (
          <p>
            <a href={`tel:${profile.public_phone}`}>{profile.public_phone}</a>
          </p>
        )}
        {profile.locations?.length > 0 && (
          <p>
            <b>Locations:</b>{" "}
            {profile.locations
              .map((l) =>
                [l.city, l.state, l.postal].filter(Boolean).join(", "),
              )
              .join(" · ")}
          </p>
        )}
        {profile.social_links?.length > 0 && (
          <p>
            <b>Social:</b>{" "}
            {profile.social_links.map((s) => (
              <a key={s.platform} href={s.url}>
                {s.label || s.platform}
              </a>
            ))}
          </p>
        )}
        {profile.hours?.length > 0 && (
          <p>
            <b>Hours:</b>{" "}
            {profile.hours
              .sort((a, b) => a.day - b.day)
              .map((h) =>
                h.closed
                  ? `${dayNames[h.day]}: closed`
                  : `${dayNames[h.day]}: ${h.opens?.slice(0, 5)}–${h.closes?.slice(0, 5)}`,
              )
              .join(" · ")}
          </p>
        )}
      </div>
      <p>
        Participation states describe activity in ShelterPawtners; they do not
        imply licensing, quality approval, or endorsement.
      </p>
    </section>
  );
}
