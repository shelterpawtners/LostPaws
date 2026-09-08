import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase as db } from "../lib/supabase";
import { OfferCard, type PublicOffer } from "./OfferCard";

export function OfferMarketplace({
  organizationId,
}: {
  organizationId?: string;
}) {
  const route = useParams();
  const offerId = route.offerId;
  const [offers, setOffers] = useState<PublicOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [claim, setClaim] = useState<{
    redeem_code: string;
    expires_at: string;
  } | null>(null);
  useEffect(() => {
    if (!db) return;
    setLoading(true);
    setStatus("");
    void (async () => {
      try {
        const { data, error } = await db.rpc("public_active_offers", {
          p_organization_id: organizationId || null,
        });
        if (error) {
          setStatus("Unable to load current offers. Please try again.");
          setOffers([]);
          return;
        }
        setOffers(
          ((data || []) as PublicOffer[]).filter(
            (x) => !offerId || x.offer_id === offerId,
          ),
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [organizationId, offerId]);
  async function claimOffer(id: string) {
    if (!db) return;
    const { data: auth } = await db.auth.getSession();
    if (!auth.session)
      return setStatus("Sign in as a guardian to claim this offer.");
    const { data, error } = await db.rpc("claim_offer", {
      p_offer_id: id,
      p_pet_id: null,
    });
    if (error) return setStatus(error.message);
    setClaim((data as any[])[0]);
    setStatus(
      "Claim ready. Show the code or open the secure link at the Partner.",
    );
  }
  if (loading)
    return (
      <section className="section shell">
        <p role="status">Loading current offers…</p>
      </section>
    );
  if (!offers.length && !status)
    return (
      <section className="section shell">
        <h1>Offer not available</h1>
        <p>
          This offer is not currently published, has not started, or has ended.
        </p>
      </section>
    );
  return (
    <section className="section shell formPage">
      {!offerId && (
        <>
          <span className="eyebrow">Current offers</span>
          <h1>Useful offers with clear terms.</h1>
        </>
      )}
      <div className="cards">
        {offers.map((offer) => (
          <div key={offer.offer_id}>
            <OfferCard offer={offer} detailed={Boolean(offerId)} />
            {offerId && (
              <button
                className="btn"
                onClick={() => claimOffer(offer.offer_id)}
              >
                Claim this offer
              </button>
            )}
          </div>
        ))}
      </div>
      {claim && (
        <div className="panel redemptionCode">
          <h2>Your private redemption code</h2>
          <code>{claim.redeem_code}</code>
          <p>Expires {new Date(claim.expires_at).toLocaleString()}</p>
          <a className="btn quiet" href={`/redeem/${claim.redeem_code}`}>
            Open Partner validation link
          </a>
          <p>The opaque code contains no name, email, or pet information.</p>
        </div>
      )}
      <p role="status" aria-live="polite" aria-atomic="true">
        {status}
      </p>
    </section>
  );
}
