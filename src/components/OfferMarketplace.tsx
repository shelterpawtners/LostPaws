import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowUpRight,
  LayoutGrid,
  List,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { supabase as db } from "../lib/supabase";
import { OfferCard, type PublicOffer } from "./OfferCard";
import {
  audienceFromChannelParam,
  channelParamFromAudience,
} from "../lib/marketplace-audience";
import "../marketplace.css";
import "../marketplace-flagship.css";
import "../marketplace-premium.css";
import "../marketplace-launch-density.css";

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

type MarketplaceViewMode = "grid" | "list";

type SortKey = "ending" | "newest" | "provider" | "title";

const sortLabels: Record<SortKey, string> = {
  ending: "Ending soonest",
  newest: "Newest",
  provider: "Provider A–Z",
  title: "Title A–Z",
};

export function OfferMarketplace({
  organizationId,
}: {
  organizationId?: string;
}) {
  const route = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const offerId = route.offerId;
  const audience = audienceFromChannelParam(
    new URLSearchParams(location.search).get("channel"),
  );
  const rave = audience === "rave";
  const [offers, setOffers] = useState<PublicOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [classification, setClassification] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("ending");
  const [viewMode, setViewMode] = useState<MarketplaceViewMode>("grid");
  const [channelFilterUnavailable, setChannelFilterUnavailable] =
    useState(false);
  // Filters collapse on a phone and stay open on a larger screen. A <details>
  // hides its own content when closed, so this cannot be done in CSS alone.
  const [filtersOpen, setFiltersOpen] = useState(
    () =>
      typeof window === "undefined" ||
      !window.matchMedia?.("(max-width: 760px)").matches,
  );

  useEffect(() => {
    const narrow = window.matchMedia?.("(max-width: 760px)");
    if (!narrow) return;
    const sync = (event: MediaQueryList | MediaQueryListEvent) =>
      setFiltersOpen(!("matches" in event ? event.matches : narrow.matches));
    sync(narrow);
    narrow.addEventListener("change", sync);
    return () => narrow.removeEventListener("change", sync);
  }, []);
  const [claim, setClaim] = useState<{
    redeem_code: string;
    expires_at: string;
  } | null>(null);

  useEffect(() => {
    if (!db) return;
    const client = db;
    setLoading(true);
    setLoadError("");
    setStatus("");
    setChannelFilterUnavailable(false);
    void (async () => {
      try {
        const channel = channelParamFromAudience(audience);
        let response = await client.rpc("public_active_offers", {
          p_organization_id: organizationId || null,
          p_channel: channel,
        });

        // A deployment whose database has not yet applied the migration that
        // added p_channel rejects the call outright, because the parameter
        // itself is unknown there — so retry without it on any error, not only
        // when a channel was requested. Only say filtering is unavailable when
        // a filter was actually asked for.
        if (response.error) {
          const fallback = await client.rpc("public_active_offers", {
            p_organization_id: organizationId || null,
          });
          if (!fallback.error) {
            if (channel) setChannelFilterUnavailable(true);
            response = fallback;
          }
        }

        if (response.error) {
          setLoadError("Unable to load current offers. Please try again.");
          setOffers([]);
          return;
        }
        setOffers(
          ((response.data || []) as PublicOffer[]).filter(
            (item) => !offerId || item.offer_id === offerId,
          ),
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [organizationId, offerId, audience]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(offers.map((offer) => offer.category).filter(Boolean)),
      ).sort() as string[],
    [offers],
  );

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
      if (category !== "all" && offer.category !== category) return false;
      if (!normalized) return true;
      const searchable = [
        offer.title,
        offer.summary,
        offer.business_name,
        offer.category,
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
  }, [offers, query, classification, category]);

  const hiddenFilterCount =
    (classification !== "all" ? 1 : 0) + (category !== "all" ? 1 : 0);

  const sortedOffers = useMemo(() => {
    const list = [...visibleOffers];
    const time = (value: string | null) =>
      value ? new Date(value).getTime() : null;
    list.sort((a, b) => {
      if (sort === "provider")
        return (a.business_name || "").localeCompare(b.business_name || "");
      if (sort === "title") return (a.title || "").localeCompare(b.title || "");
      if (sort === "newest") {
        const at = time(a.starts_at) ?? 0;
        const bt = time(b.starts_at) ?? 0;
        return bt - at;
      }
      // Ending soonest, with open-ended offers last.
      const ae = time(a.ends_at);
      const be = time(b.ends_at);
      if (ae === null && be === null) return 0;
      if (ae === null) return 1;
      if (be === null) return -1;
      return ae - be;
    });
    return list;
  }, [visibleOffers, sort]);

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
      className={`marketplaceExperience marketplaceCompact marketplacePremium${rave ? " marketplaceRave" : ""}`}
      data-marketplace-concept="compact"
    >
      <div className="marketCompactHeader">
        <div className="marketCompactTitle">
          <h1>{rave ? "RAVE Shelter marketplace" : "Marketplace"}</h1>
          <span className="marketCompactCount" role="status" aria-live="polite">
            {visibleOffers.length}{" "}
            {visibleOffers.length === 1 ? "listing" : "listings"}
          </span>
        </div>
        <div
          className="marketCompactAudience"
          role="group"
          aria-label="Filter offers by audience"
        >
          <button
            type="button"
            className={audience === "all" ? "active" : ""}
            aria-pressed={audience === "all"}
            onClick={() => navigate("/marketplace")}
          >
            All
          </button>
          <button
            type="button"
            className={audience === "pet" ? "active" : ""}
            aria-pressed={audience === "pet"}
            onClick={() => navigate("/marketplace?channel=pet")}
          >
            Pet
          </button>
          <button
            type="button"
            className={audience === "rave" ? "active" : ""}
            aria-pressed={audience === "rave"}
            onClick={() => navigate("/marketplace?channel=rave")}
          >
            RAVE
          </button>
        </div>
      </div>

      {channelFilterUnavailable && (
        <p className="marketplaceFilterNotice" role="status">
          Audience filtering is not available on this deployment yet, so every
          current offer is shown.
        </p>
      )}

      <div className="marketCompactToolbar">
        <label className="marketCompactSearch">
          <Search aria-hidden="true" />
          <span className="srOnly">Search current offers</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search offers, providers, or terms"
            aria-label="Search current offers"
          />
        </label>

        <details
          className="marketplaceFilterDisclosure marketCompactFilters"
          open={filtersOpen}
          onToggle={(event) =>
            setFiltersOpen((event.target as HTMLDetailsElement).open)
          }
        >
          <summary>
            <SlidersHorizontal aria-hidden="true" />
            Filters and sort
            {hiddenFilterCount > 0 && (
              <span className="marketplaceFilterCountBadge">
                {hiddenFilterCount}
              </span>
            )}
          </summary>

          <div className="marketCompactFilterRow">
            <label className="marketCompactSelect">
              <span className="srOnly">Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">All categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="marketCompactSelect">
              <span className="srOnly">Listing type</span>
              <select
                value={classification}
                onChange={(event) => setClassification(event.target.value)}
              >
                <option value="all">All types ({offers.length})</option>
                {classifications.map((item) => (
                  <option key={item} value={item}>
                    {listingTypeLabel(item)} ({listingCounts[item] || 0})
                  </option>
                ))}
              </select>
            </label>

            <label className="marketCompactSelect">
              <span className="srOnly">Sort by</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
              >
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <div
              className="marketCompactViewToggle"
              role="group"
              aria-label="Marketplace view"
            >
              <button
                type="button"
                className={viewMode === "grid" ? "active" : ""}
                aria-pressed={viewMode === "grid"}
                aria-label="Grid view"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid />
              </button>
              <button
                type="button"
                className={viewMode === "list" ? "active" : ""}
                aria-pressed={viewMode === "list"}
                aria-label="List view"
                onClick={() => setViewMode("list")}
              >
                <List />
              </button>
            </div>

            {(query || classification !== "all" || category !== "all") && (
              <button
                type="button"
                className="marketCompactClear"
                onClick={() => {
                  setQuery("");
                  setClassification("all");
                  setCategory("all");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </details>
      </div>

      <p className="marketCompactTrustLine">
        <ShieldCheck aria-hidden="true" /> Public programs link to the
        responsible third party; ShelterPawtners redemption codes are reserved
        for offers published through this platform.
      </p>

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
        <div
          className={`marketplaceCardGrid marketplaceCardGrid-value marketplaceCardGrid-${viewMode}`}
        >
          {sortedOffers.map((offer) => (
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
