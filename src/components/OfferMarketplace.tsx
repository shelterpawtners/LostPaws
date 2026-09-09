import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { supabase as db } from "../lib/supabase";
import { OfferCard, type PublicOffer } from "./OfferCard";
import "../marketplace.css";
import "../marketplace-flagship.css";

function humanize(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function OfferMarketplace({
  organizationId,
}: {
  organizationId?: string;
}) {
  const route = useParams();
  const location = useLocation();
  const offerId = route.offerId;
  const rave = new URLSearchParams(location.search).get("channel") === "rave";
  const [offers, setOffers] = useState<PublicOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [classification, setClassification] = useState("all");
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
            (item) => !offerId || item.offer_id === offerId,
          ),
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [organizationId, offerId]);

  const classifications = useMemo(
    () =>
      Array.from(
        new Set(
          offers
            .map((offer) => offer.classification)
            .filter((value) => Boolean(value)),
        ),
      ).sort(),
    [offers],
  );

  const visibleOffers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return offers.filter((offer) => {
      if (classification !== "all" && offer.classification !== classification)
        return false;
      if (!normalized) return true;
      const searchable = [
        offer.title,
        offer.summary,
        offer.business_name,
        offer.terms,
        offer.classification,
        offer.eligibility_kind,
        ...(offer.applicability || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(normalized);
    });
  }, [offers, query, classification]);

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
      <div className="marketplaceState" role="status">
        <span className="marketplaceStatePulse" />
        Loading current offers…
      </div>
    );

  if (offerId) {
    if (!offers.length && !status)
      return (
        <section className="marketplaceDetailState">
          <h1>Offer not available</h1>
          <p>
            This offer is not currently published, has not started, or has
            ended.
          </p>
        </section>
      );

    return (
      <section className="marketplaceDetailPage">
        {offers.map((offer) => (
          <div key={offer.offer_id}>
            <OfferCard offer={offer} detailed concept="trust" featured />
            <button
              className="btn marketplaceClaimButton"
              onClick={() => claimOffer(offer.offer_id)}
            >
              Claim this offer
            </button>
          </div>
        ))}
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

  return (
    <section
      className={`marketplaceExperience marketplaceFlagship${rave ? " marketplaceRave" : ""}`}
      data-marketplace-concept="flagship"
    >
      <div className="marketplaceConceptIntro marketplaceFlagshipIntro">
        <span className="eyebrow">
          {rave ? "RAVE Shelter marketplace view" : "ShelterPawtners marketplace"}
        </span>
        <h2>Useful pet-parent value, without the fine-print hunt.</h2>
        <p>
          Scan current offers, see who provides them, and check eligibility,
          where they apply, and current terms before you claim.
        </p>
      </div>

      <div className="marketplaceDiscovery">
        <label className="marketplaceSearch">
          <Search />
          <span className="srOnly">Search current offers</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search offers, providers, terms, or where they apply"
            aria-label="Search current offers"
          />
        </label>

        <div className="marketplaceFilterArea">
          <div className="marketplaceFilterLabel">
            <SlidersHorizontal />
            <span>Listing type</span>
          </div>
          <div
            className="marketplaceFilterButtons"
            aria-label="Filter offers by listing type"
          >
            <button
              type="button"
              className={classification === "all" ? "active" : ""}
              aria-pressed={classification === "all"}
              onClick={() => setClassification("all")}
            >
              All current
            </button>
            {classifications.map((item) => (
              <button
                type="button"
                key={item}
                className={classification === item ? "active" : ""}
                aria-pressed={classification === item}
                onClick={() => setClassification(item)}
              >
                {humanize(item)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="marketplaceTrustStrip">
        <ShieldCheck />
        <div>
          <strong>Provider and eligibility context stays visible.</strong>
          <span>
            Review who provides the offer, where it applies, and current terms
            before taking the next step.
          </span>
        </div>
      </div>

      <div className="marketplaceResultsHeader">
        <div role="status" aria-live="polite" aria-atomic="true">
          <strong>{visibleOffers.length}</strong>
          <span>
            {visibleOffers.length === 1 ? " current offer" : " current offers"}
          </span>
        </div>
        {(query || classification !== "all") && (
          <button
            type="button"
            className="marketplaceClearFilters"
            onClick={() => {
              setQuery("");
              setClassification("all");
            }}
          >
            Clear search and filters
          </button>
        )}
      </div>

      {!visibleOffers.length ? (
        <div className="marketplaceEmpty">
          <Search />
          <h2>No current offers match that search.</h2>
          <p>
            Try a provider name, a broader term, or clear the listing-type
            filter.
          </p>
        </div>
      ) : (
        <div className="marketplaceCardGrid marketplaceCardGrid-value">
          {visibleOffers.map((offer) => (
            <OfferCard key={offer.offer_id} offer={offer} concept="value" />
          ))}
        </div>
      )}

      <div className="marketplaceTrustFooter">
        <ShieldCheck />
        <p>
          Listings identify the responsible provider or public source. Public
          programs are not presented as ShelterPawtners partnerships. Review
          current provider terms before claiming.
        </p>
      </div>

      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="marketplaceStatus"
      >
        {status}
      </p>
    </section>
  );
}
