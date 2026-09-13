import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { HandHeart } from "lucide-react";
import { supabase as db } from "../../lib/supabase";
import "./Giving.css";

type DonationIntent = {
  id: string;
  amount_minor: number;
  currency_code: string;
  status: string;
  created_at: string;
};

function formatMinor(minor: number, currency: string) {
  return (minor / 100).toLocaleString(undefined, {
    style: "currency",
    currency,
  });
}

/**
 * Read-only. donation_intents already lets a Guardian read their own rows
 * (donation_intents_own_read), so this needs no new RPC — it is a direct
 * table read the existing RLS policy already permits.
 */
export function GuardianGivingHistory({
  session,
}: {
  session: Session | null;
}) {
  const [intents, setIntents] = useState<DonationIntent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !session) {
      setLoading(false);
      return;
    }
    void (async () => {
      const { data } = await db
        .from("donation_intents")
        .select("id,amount_minor,currency_code,status,created_at")
        .eq("guardian_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(25);
      setIntents((data as DonationIntent[]) ?? []);
      setLoading(false);
    })();
  }, [session]);

  if (!session || loading) return null;

  return (
    <section className="givingPanel" aria-labelledby="guardian-giving-title">
      <h2 id="guardian-giving-title">
        <HandHeart aria-hidden="true" /> Your giving
      </h2>
      {intents.length === 0 ? (
        <p className="givingEmpty">
          Nothing to show yet. Guardian-directed giving is planned, not live —
          this fills in once that workflow exists.{" "}
          <a href="/learn/giving">How giving works</a>
        </p>
      ) : (
        <>
          <ul className="givingCommitmentList">
            {intents.map((intent) => (
              <li key={intent.id}>
                <span>
                  {formatMinor(intent.amount_minor, intent.currency_code)}
                </span>
                <em className={`givingStatus givingStatus-${intent.status}`}>
                  {intent.status}
                </em>
                <small>
                  {new Date(intent.created_at).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
          <p className="givingNotice">
            <span>
              Accrued is not the same as given. This list is pledged activity
              only, until a real transfer through a giving processor is
              confirmed. <a href="/learn/giving">How giving works</a>
            </span>
          </p>
        </>
      )}
    </section>
  );
}
