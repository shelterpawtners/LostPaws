import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { supabase as db } from "../../lib/supabase";
import {
  formatEventWhen,
  formatEventWhere,
  type PublicEvent,
} from "../../lib/events";
import "./Events.css";

/**
 * A single upcoming event whose title/category/summary matches this
 * activation, for the LostPaws and Seven Star Shelters pilot integrations
 * (Issue #154). Deliberately a substring match on real event content rather
 * than a new tagging field — keeps the schema unchanged, and shows a
 * truthful "nothing scheduled yet" state instead of ever inventing one.
 */
export function EventSpotlight({
  match,
  heading,
}: {
  match: string;
  heading: string;
}) {
  const [event, setEvent] = useState<PublicEvent | null | undefined>(undefined);

  useEffect(() => {
    if (!db) {
      setEvent(null);
      return;
    }
    const client = db;
    let cancelled = false;
    void client
      .from("events")
      .select(
        "id,organization_id,audience,category,title,summary,details,service_area,is_online,starts_at,ends_at,status,published_at",
      )
      .eq("status", "active")
      .not("published_at", "is", null)
      .or(
        `title.ilike.%${match}%,category.ilike.%${match}%,summary.ilike.%${match}%`,
      )
      .order("starts_at", { ascending: true, nullsFirst: false })
      .limit(1)
      .then(({ data }) => {
        if (cancelled) return;
        setEvent((data?.[0] as PublicEvent) || null);
      });
    return () => {
      cancelled = true;
    };
  }, [match]);

  // Undefined means still loading; render nothing rather than a flash of an
  // empty state.
  if (event === undefined) return null;

  return (
    <section className="evSpotlight" aria-labelledby="event-spotlight-heading">
      <div className="evSpotlightInner">
        <span className="evEyebrow">
          <CalendarDays aria-hidden="true" /> {heading}
        </span>
        {event ? (
          <>
            <h2 id="event-spotlight-heading">
              <Link to={`/events/${event.id}`}>{event.title}</Link>
            </h2>
            <p>{event.summary}</p>
            <div className="evSpotlightMeta">
              <span>
                <CalendarDays aria-hidden="true" />{" "}
                {formatEventWhen(event.starts_at, event.ends_at)}
              </span>
              <span>
                <MapPin aria-hidden="true" />{" "}
                {formatEventWhere(event.is_online, event.service_area)}
              </span>
            </div>
            <Link className="evSpotlightLink" to={`/events/${event.id}`}>
              Event details and offers <ArrowRight aria-hidden="true" />
            </Link>
          </>
        ) : (
          <>
            <h2 id="event-spotlight-heading">No event scheduled yet</h2>
            <p>
              Check back — activation dates and event-specific offers will
              appear here once published.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
