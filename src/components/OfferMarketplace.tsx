import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { supabase as db } from "../lib/supabase";
import {
  OfferCard,
  type MarketplaceConcept,
  type PublicOffer,
} from "./OfferCard";
import "../marketplace.css";

const concepts: {
  id: MarketplaceConcept;
  label: string;
  title: string;
  copy: string;
}[] = [
  {
    id: "value",
    label: "A · Value feed",
    title: "Scan the value. Check the terms. Choose what fits.",
    copy: "A commerce-forward direction built for quick offer comparison and decisive browsing.",
  },
  {
    id: "trust",
    label: "B · Local + trust",
    title: "Useful offers, with the provider and context up front.",
    copy: "A more premium direction that emphasizes PetBiz identity, applicability, and listing trust.",
  },
  {
    id: "curated",
    label: "C · Curated hub",
    title: "A calmer home for practical pet-parent value.",
    copy: "An editorial direction that feels more like a Guardian benefit destination than a dense deals grid.",
  },
];

function humanize(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function selectedConcept(search: string): MarketplaceConcept {
  const value = new URLSearchParams(search).get("concept");
  return value === "trust" || value === "curated" ? value : "value";
}

export function OfferMarketplace({
  organizationId,
}: {
  organizationId?: string;
}) {
  const route = useParams();
  const location = useLocation();
  const offerId = route.offerId;
  const concept = selectedConcept(location.search);
  const conceptInfo =
    concepts.find((item) => item.id === concept) || concepts[0];
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
      className={`marketplaceExperience marketplaceConcept-${concept}${rave ? " marketplaceRave" : ""}`}
      data-marketplace-concept={concept}
    >
      <div
        className="marketplacePrototypeBar"
        aria-label="Marketplace concept previews"
      >
        <div>
          <span className="marketplacePrototypeLabel">Sprint preview</span>
          <strong>Compare three directions</strong>
        </div>
        <div
          role="navigation"
          aria-label="Marketplace concepts"
          className="marketplaceConceptNav"
        >
          {concepts.map((item) => {
            const params = new URLSearchParams(location.search);
            params.set("concept", item.id);
            return (
              <Link
                key={item.id}
                to={`${location.pathname}?${params.toString()}`}
                className={item.id === concept ? "active" : ""}
                aria-current={item.id === concept ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="marketplaceConceptIntro">
        <span className="eyebrow">
          {rave
            ? "RAVE Shelter channel preview"
            : "Marketplace design direction"}
        </span>
        <h2>{conceptInfo.title}</h2>
        <p>{conceptInfo.copy}</p>
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
              onClick={() => setClassification("all")}
            >
              All current
            </button>
            {classifications.map((item) => (
              <button
                type="button"
                key={item}
                className={classification === item ? "active" : ""}
                onClick={() => setClassification(item)}
              >
                {humanize(item)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="marketplaceResultsHeader">
        <div>
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
      ) : concept === "trust" ? (
        <div className="marketplaceTrustLayout">
          <aside className="marketplaceTrustRail">
            <ShieldCheck />
            <span className="eyebrow">Know what you are looking at</span>
            <h2>Trust comes from clear context.</h2>
            <p>
              Every listing keeps the provider, eligibility, listing type, and
              current terms context close to the offer instead of burying it in
              fine print.
            </p>
            <ul>
              <li>Provider identity stays visible.</li>
              <li>Eligibility is shown before the detail page.</li>
              <li>Source and full terms remain available when provided.</li>
            </ul>
          </aside>
          <div className="marketplaceTrustResults">
            {visibleOffers.map((offer) => (
              <OfferCard key={offer.offer_id} offer={offer} concept="trust" />
            ))}
          </div>
        </div>
      ) : concept === "curated" ? (
        <div className="marketplaceCuratedLayout">
          <div className="marketplaceCuratedLead">
            {visibleOffers.slice(0, 2).map((offer) => (
              <OfferCard
                key={offer.offer_id}
                offer={offer}
                concept="curated"
                featured
              />
            ))}
          </div>
          {visibleOffers.length > 2 && (
            <>
              <div className="marketplaceSectionHeading">
                <span className="eyebrow">More to explore</span>
                <h2>Keep browsing current offers.</h2>
              </div>
              <div className="marketplaceCardGrid marketplaceCardGrid-curated">
                {visibleOffers.slice(2).map((offer) => (
                  <OfferCard
                    key={offer.offer_id}
                    offer={offer}
                    concept="curated"
                  />
                ))}
              </div>
            </>
          )}
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
          Public programs are not presented as ShelterPawtners partnerships.
          Partner-published offers identify the responsible organization and can
          be reported or suspended. Review provider terms for current
          requirements.
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
