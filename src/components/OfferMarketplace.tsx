import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  HeartHandshake,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Store,
} from "lucide-react";
import { supabase as db } from "../lib/supabase";
import { OfferCard, type PublicOffer } from "./OfferCard";
import "../marketplace.css";
import "../marketplace-flagship.css";
import "../marketplace-premium.css";

function humanize(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function listingTypeLabel(value: string) {
  if (value === "public_program") return "Public Adoption Benefits";
  if (value === "community") return "Community Resources";
  if (value === "partner_published") return "Partner Offers";
  return humanize(value);
}

function isExternalResource(offer: PublicOffer) {
  return ["public_program", "community"].includes(offer.classification);
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
  const [loadError, setLoadError] = useState("");
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
    setLoadError("");
    setStatus("");
    void (async () => {
      try {
        const { data, error } = await db.rpc("public_active_offers", {
          p_organization_id: organizationId || null,
        });
        if (error) {
          setLoadError("Unable to load current offers. Please try again.");
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

  const listingCounts = useMemo(
    () =>
      offers.reduce<Record<string, number>>((counts, offer) => {
        counts[offer.classification] = (counts[offer.classification] || 0) + 1;
        return counts;
      }, {}),
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
        listingTypeLabel(offer.classification || ""),
        humanize(offer.eligibility_kind || ""),
        ...(offer.applicability || []).map(humanize),
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

  if (loadError)
    return (
      <div className="marketplaceEmpty marketplaceLoadError" role="alert">
        <h2>We could not load current offers.</h2>
        <p>{loadError}</p>
      </div>
    );

  if (offerId) {
    if (!offers.length)
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
        {offers.map((offer) => {
          const external = isExternalResource(offer);
          const officialUrl = offer.destination_url || offer.source_url;
          return (
            <div key={offer.offer_id}>
              <OfferCard offer={offer} detailed concept="trust" featured />
              {external ? (
                officialUrl ? (
                  <a
                    className="btn marketplaceClaimButton"
                    href={officialUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit official program <ArrowUpRight />
                  </a>
                ) : (
                  <p className="notice">
                    This public resource is listed for reference. Its official
                    destination is temporarily unavailable, so no claim action
                    is offered here.
                  </p>
                )
              ) : (
                <button
                  className="btn marketplaceClaimButton"
                  onClick={() => claimOffer(offer.offer_id)}
                >
                  Claim this offer
                </button>
              )}
            </div>
          );
        })}
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

  if (organizationId) {
    return (
      <section
        className="marketplaceEmbedded"
        aria-labelledby="provider-offers-heading"
      >
        <div className="marketplaceEmbeddedHeading">
          <span className="eyebrow">Current offers</span>
          <h2 id="provider-offers-heading">Offers from this provider</h2>
        </div>
        {!offers.length ? (
          <div className="marketplaceEmpty">
            <h3>No current offers are available from this provider.</h3>
            <p>Check back as listings are published or updated.</p>
          </div>
        ) : (
          <div className="marketplaceCardGrid marketplaceEmbeddedGrid">
            {offers.map((offer) => (
              <OfferCard key={offer.offer_id} offer={offer} concept="value" />
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section
      className={`marketplaceExperience marketplaceFlagship marketplacePremium${rave ? " marketplaceRave" : ""}`}
      data-marketplace-concept="flagship"
    >
      <div className="marketplaceHeroLayout">
        <div className="marketplaceConceptIntro marketplaceFlagshipIntro">
          <span className="eyebrow">
            {rave
              ? "RAVE Shelter marketplace view"
              : "ShelterPawtners marketplace"}
          </span>
          <h2>Useful pet-parent value, without the fine-print hunt.</h2>
          <p>
            Discover current public adoption benefits alongside offers published
            by ShelterPawtners participants. Every listing shows who provides
            it, eligibility context, and current terms before you take the next
            step.
          </p>
          <div className="marketplaceHeroActions">
            <a className="marketplaceHeroJump" href="#marketplace-results">
              Browse current value <ArrowDown />
            </a>
            <span>Based on current published Marketplace listings</span>
          </div>
        </div>

        <aside
          className="marketplaceValuePanel"
          aria-label="Current Marketplace listing overview"
        >
          <div>
            <span className="marketplaceValueEyebrow">Current marketplace</span>
            <div className="marketplaceValueTotal">
              <strong>{offers.length}</strong>
              <span>
                {offers.length === 1 ? "active listing" : "active listings"}
              </span>
            </div>
          </div>
          <div className="marketplaceValueBreakdown">
            <div>
              <BadgeCheck />
              <span>
                Public adoption benefits
                <b>{listingCounts.public_program || 0}</b>
              </span>
            </div>
            <div>
              <HeartHandshake />
              <span>
                Community resources
                <b>{listingCounts.community || 0}</b>
              </span>
            </div>
            <div>
              <Store />
              <span>
                Participant offers
                <b>{listingCounts.partner_published || 0}</b>
              </span>
            </div>
          </div>
        </aside>
      </div>

      <div className="marketplaceDiscovery">
        <label className="marketplaceSearch">
          <Search />
          <span className="srOnly">Search current offers</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search benefits, providers, terms, or location"
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
            role="group"
            aria-label="Filter offers by listing type"
          >
            <button
              type="button"
              className={classification === "all" ? "active" : ""}
              aria-pressed={classification === "all"}
              onClick={() => setClassification("all")}
            >
              All current
              <span className="marketplaceFilterCount">{offers.length}</span>
            </button>
            {classifications.map((item) => (
              <button
                type="button"
                key={item}
                className={classification === item ? "active" : ""}
                aria-pressed={classification === item}
                onClick={() => setClassification(item)}
              >
                {listingTypeLabel(item)}
                <span className="marketplaceFilterCount">
                  {listingCounts[item] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="marketplaceTrustStrip">
        <ShieldCheck />
        <div>
          <strong>Public benefits and partner offers stay distinct.</strong>
          <span>
            Public programs link to the responsible third party. ShelterPawtners
            redemption codes are reserved for offers actually published through
            this platform.
          </span>
        </div>
      </div>

      <div className="marketplaceResultsHeader" id="marketplace-results">
        <div role="status" aria-live="polite" aria-atomic="true">
          <strong>{visibleOffers.length}</strong>
          <span>
            {visibleOffers.length === 1
              ? " current listing"
              : " current listings"}
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

      {!offers.length ? (
        <div className="marketplaceEmpty">
          <h2>No current offers are available right now.</h2>
          <p>
            Check back as providers and public programs publish new listings.
          </p>
        </div>
      ) : !visibleOffers.length ? (
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
          Public adoption benefits are independently listed from official
          third-party sources and are not ShelterPawtners partnerships or
          endorsements. Provider terms control eligibility and availability.
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
