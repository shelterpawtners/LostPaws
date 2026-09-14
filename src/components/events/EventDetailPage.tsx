import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";
import { supabase as db } from "../../lib/supabase";
import {
  eventAudienceLabels,
  eventParticipantRoleLabels,
  formatEventWhen,
  formatEventWhere,
  type EventParticipantRole,
  type PublicEvent,
} from "../../lib/events";
import { OfferMarketplace } from "../OfferMarketplace";
import "./Events.css";

type ParticipantOrg = {
  organization_id: string;
  public_name: string;
  role: EventParticipantRole;
  website_url: string | null;
  public_email: string | null;
  public_phone: string | null;
};

type AttendanceStatus = "attending" | "not_attending";

export function EventDetailPage({ session }: { session: Session | null }) {
  const { id } = useParams();
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [organizations, setOrganizations] = useState<ParticipantOrg[]>([]);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [myStatus, setMyStatus] = useState<AttendanceStatus | null>(null);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    if (!db || !id) {
      setLoading(false);
      return;
    }
    const client = db;
    setLoading(true);
    setNotFound(false);
    const { data, error } = await client
      .from("events")
      .select(
        "id,organization_id,audience,category,title,summary,details,service_area,is_online,starts_at,ends_at,status,published_at",
      )
      .eq("id", id)
      .maybeSingle();
    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setEvent(data as PublicEvent);
    const [countResult, orgsResult] = await Promise.all([
      client.rpc("event_attendance_count", { p_event_id: id }),
      client.rpc("event_participant_organizations", { p_event_id: id }),
    ]);
    setAttendeeCount(Number(countResult.data) || 0);
    setOrganizations((orgsResult.data as ParticipantOrg[]) || []);
    if (session) {
      const { data: mine } = await client
        .from("event_attendees")
        .select("status")
        .eq("event_id", id)
        .eq("user_id", session.user.id)
        .maybeSingle();
      setMyStatus((mine?.status as AttendanceStatus) || null);
    } else {
      setMyStatus(null);
    }
    setLoading(false);
  }, [id, session]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleAttendance() {
    if (!db || !session || !id || updating) return;
    setUpdating(true);
    const next: AttendanceStatus =
      myStatus === "attending" ? "not_attending" : "attending";
    const { error } = await db
      .from("event_attendees")
      .upsert(
        { event_id: id, user_id: session.user.id, status: next },
        { onConflict: "event_id,user_id" },
      );
    setUpdating(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    setMyStatus(next);
    setStatus(
      next === "attending"
        ? "You're marked as attending."
        : "You're no longer marked as attending.",
    );
    void load();
  }

  if (loading) {
    return (
      <div className="evPage">
        <section className="evBody">
          <div className="evWrap">
            <p className="evEmpty" role="status">
              Loading event…
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="evPage">
        <section className="evBody">
          <div className="evWrap">
            <h1>Event not found</h1>
            <p>
              This event may have been removed, is not yet published, or has
              ended.
            </p>
            <Link className="evBackLink" to="/events">
              <ArrowLeft aria-hidden="true" /> Back to events
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="evPage">
      <section className="evHero">
        <div className="evWrap">
          <Link className="evBackLink" to="/events">
            <ArrowLeft aria-hidden="true" /> Back to events
          </Link>
          <span className="evEyebrow">
            <CalendarDays aria-hidden="true" />{" "}
            {eventAudienceLabels[event.audience]}
          </span>
          <h1>{event.title}</h1>
          <p className="evLead">{event.summary}</p>
          <dl className="evCardMeta evDetailMeta">
            <div>
              <dt>
                <CalendarDays aria-hidden="true" /> When
              </dt>
              <dd>{formatEventWhen(event.starts_at, event.ends_at)}</dd>
            </div>
            <div>
              <dt>
                <MapPin aria-hidden="true" /> Where
              </dt>
              <dd>{formatEventWhere(event.is_online, event.service_area)}</dd>
            </div>
          </dl>
          {event.details && <p className="evDetailBody">{event.details}</p>}

          <div className="evAttendanceRow">
            <span className="evAttendanceCount">
              <Users aria-hidden="true" /> {attendeeCount}{" "}
              {attendeeCount === 1 ? "person" : "people"} attending
            </span>
            {session ? (
              <button
                type="button"
                className={`evAttendButton${myStatus === "attending" ? " active" : ""}`}
                onClick={() => void toggleAttendance()}
                disabled={updating}
                aria-pressed={myStatus === "attending"}
              >
                {myStatus === "attending" ? "I'm attending ✓" : "I'm attending"}
              </button>
            ) : (
              <Link className="btn quiet" to="/login">
                Sign in to mark attendance
              </Link>
            )}
          </div>
          <p role="status" aria-live="polite" aria-atomic="true">
            {status}
          </p>
        </div>
      </section>

      {organizations.length > 0 && (
        <section className="evBody" aria-labelledby="event-vendors-heading">
          <div className="evWrap">
            <h2 id="event-vendors-heading">Businesses at this event</h2>
            <ul className="evVendorList">
              {organizations.map((org) => (
                <li
                  className="evVendorCard"
                  key={`${org.organization_id}-${org.role}`}
                >
                  <span className="evVendorRole">
                    {eventParticipantRoleLabels[org.role]}
                  </span>
                  <Link to={`/partners/${org.organization_id}`}>
                    {org.public_name}
                  </Link>
                  <span className="evVendorContactHint">
                    Contact and booking links are on their profile.
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="evBody evOffersSection">
        <div className="evWrap">
          <OfferMarketplace eventId={event.id} />
          <p className="evFootNote">
            <Link to={`/marketplace?event=${event.id}`}>
              See all in Marketplace <ArrowUpRight aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
