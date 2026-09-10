import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import {
  BadgeCheck,
  Clock3,
  RotateCcw,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { supabase as db } from "../lib/supabase";
import { DealMomentEditor } from "./DealMomentEditor";
import "../guardian-social.css";

type GuardianActivity = {
  feed_id: string;
  item_type: string;
  claim_id: string;
  offer_id: string;
  pet_id: string | null;
  pet_name: string | null;
  business_name: string | null;
  offer_title: string;
  activity_status: string;
  claimed_at: string;
  redeemed_at: string | null;
  activity_at: string;
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  redeemed: "Redeemed",
  reversed: "Reversed",
  disputed: "Disputed",
  cancelled: "Cancelled",
  expired: "Expired",
};

function TimelineIcon({ status }: { status: string }) {
  if (status === "redeemed") return <BadgeCheck />;
  if (status === "reversed") return <RotateCcw />;
  if (status === "disputed") return <TriangleAlert />;
  return <Clock3 />;
}

function formatActivityDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function GuardianActivityTimeline({
  session,
}: {
  session: Session | null;
}) {
  const [items, setItems] = useState<GuardianActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const refresh = useCallback(async () => {
    if (!db || !session) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await db.rpc("guardian_activity_feed", {
      p_limit: 25,
    });
    setLoading(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    setItems((data || []) as GuardianActivity[]);
  }, [session]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <section
      className="panel guardianTimeline"
      aria-labelledby="guardian-activity-heading"
    >
      <div className="guardianTimelineHeader">
        <div>
          <span className="eyebrow">Your activity</span>
          <h3 id="guardian-activity-heading">Savings activity timeline</h3>
          <p>
            Follow offers you claimed and see when a participating business
            marks them redeemed. This private timeline uses the transaction
            record as its source of truth.
          </p>
        </div>
        <div className="guardianTimelinePrivacy">
          <ShieldCheck /> Private to your account
        </div>
      </div>

      {loading ? (
        <p role="status">Loading your activity…</p>
      ) : items.length ? (
        <ol className="guardianTimelineList">
          {items.map((item) => (
            <li className="guardianTimelineItem" key={item.feed_id}>
              <span
                className={`guardianTimelineDot status-${item.activity_status}`}
                aria-hidden="true"
              >
                <TimelineIcon status={item.activity_status} />
              </span>
              <div className="guardianTimelineContent">
                <div className="guardianTimelineMeta">
                  <span
                    className={`activityBadge status-${item.activity_status}`}
                  >
                    {statusLabels[item.activity_status] || item.activity_status}
                  </span>
                  <time dateTime={item.activity_at}>
                    {formatActivityDate(item.activity_at)}
                  </time>
                </div>
                <h4>{item.offer_title}</h4>
                <p>
                  {item.business_name || "Participating provider"}
                  {item.pet_name ? ` · for ${item.pet_name}` : ""}
                </p>
                <small>
                  {item.activity_status === "redeemed" && item.redeemed_at
                    ? `Redeemed ${formatActivityDate(item.redeemed_at)}`
                    : `Claimed ${formatActivityDate(item.claimed_at)}`}
                </small>
                <Link to={`/offers/${item.offer_id}`}>View offer details</Link>
                {item.pet_id && (
                  <DealMomentEditor
                    session={session}
                    claimId={item.claim_id}
                    petName={item.pet_name}
                  />
                )}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="guardianTimelineEmpty">
          <Clock3 />
          <div>
            <b>Your claimed offers will appear here.</b>
            <p>
              Browse the Marketplace, claim an eligible Partner offer, and this
              timeline will track its status automatically.
            </p>
            <Link to="/marketplace">Browse Marketplace</Link>
          </div>
        </div>
      )}
      <p role="status" aria-live="polite" aria-atomic="true">
        {status}
      </p>
    </section>
  );
}
