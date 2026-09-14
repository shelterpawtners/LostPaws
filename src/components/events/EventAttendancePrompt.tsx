import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { CalendarDays } from "lucide-react";
import { supabase as db } from "../../lib/supabase";
import "./Events.css";

type NearestEvent = { id: string; title: string };

const dismissedKey = (eventId: string) =>
  `sp_event_prompt_dismissed_${eventId}`;

/**
 * A lightweight, dismissible "are you attending?" nudge for the single
 * nearest upcoming Guardian-relevant event (Issue #154 #9). Never blocks any
 * flow: it renders nothing when there is no event, the guardian already
 * responded, or they previously dismissed it for that event.
 */
export function EventAttendancePrompt({
  session,
}: {
  session: Session | null;
}) {
  const [event, setEvent] = useState<NearestEvent | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!db || !session) return;
    const client = db;
    let cancelled = false;
    void (async () => {
      const { data: nearest } = await client
        .from("events")
        .select("id,title")
        .eq("status", "active")
        .not("published_at", "is", null)
        .in("audience", ["pet", "both"])
        .order("starts_at", { ascending: true, nullsFirst: false })
        .limit(1)
        .maybeSingle();
      if (cancelled || !nearest) return;
      if (localStorage.getItem(dismissedKey(nearest.id))) return;
      const { data: mine } = await client
        .from("event_attendees")
        .select("status")
        .eq("event_id", nearest.id)
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (cancelled || mine) return;
      setEvent(nearest as NearestEvent);
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  async function respond(attending: boolean) {
    if (!db || !session || !event) return;
    localStorage.setItem(dismissedKey(event.id), "1");
    if (attending) {
      const { error } = await db
        .from("event_attendees")
        .upsert(
          { event_id: event.id, user_id: session.user.id, status: "attending" },
          { onConflict: "event_id,user_id" },
        );
      if (error) {
        setStatus(error.message);
        return;
      }
    }
    setEvent(null);
  }

  if (!event) return null;

  return (
    <div className="evAttendPrompt" role="status">
      <CalendarDays aria-hidden="true" />
      <div>
        <p>
          Are you attending{" "}
          <Link to={`/events/${event.id}`}>{event.title}</Link>?
        </p>
        <div className="evAttendPromptActions">
          <button
            type="button"
            className="btn quiet"
            onClick={() => void respond(true)}
          >
            I'm attending
          </button>
          <button
            type="button"
            className="textButton"
            onClick={() => void respond(false)}
          >
            Not this time
          </button>
        </div>
        {status && <p className="evAttendPromptStatus">{status}</p>}
      </div>
    </div>
  );
}
