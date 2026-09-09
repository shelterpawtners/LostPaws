import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Store,
  Tag,
} from "lucide-react";
import { eligibilityLabel } from "../lib/offers";

export type PublicOffer = {
  offer_id: string;
  organization_id: string;
  business_name: string;
  version_id: string;
  title: string;
  summary: string;
  details: string | null;
  terms: string;
  classification: string;
  eligibility_kind: string;
  starts_at: string | null;
  ends_at: string | null;
  redemption_instructions: string;
  source_url: string | null;
  disclosure: string | null;
  applicability: string[];
};

export type MarketplaceConcept = "value" | "trust" | "curated";

function humanize(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function providerInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function applicabilityLabel(values: string[]) {
  if (!values?.length) return null;
  const readable = values.map(humanize);
  if (readable.length <= 2) return readable.join(" · ");
  return `${readable.slice(0, 2).join(" · ")} +${readable.length - 2}`;
}

export function OfferCard({
  offer,
  detailed = false,
  concept = "value",
  featured = false,
}: {
  offer: PublicOffer;
  detailed?: boolean;
  concept?: MarketplaceConcept;
  featured?: boolean;
}) {
  const where = applicabilityLabel(offer.applicability);
  const classification = humanize(offer.classification || "current offer");
  const initials = providerInitials(offer.business_name) || "SP";

  return (
    <article
      className={`offerCard marketOfferCard marketOfferCard-${concept}${featured ? " marketOfferCard-featured" : ""}`}
    >
      <div className="marketOfferVisual" aria-hidden="true">
        <span className="marketOfferMonogram">{initials}</span>
        <span className="marketOfferVisualIcon">
          <Tag />
        </span>
      </div>

      <div className="marketOfferBody">
        <div className="marketOfferBadges" aria-label="Offer context">
          <span>{eligibilityLabel(offer.eligibility_kind)}</span>
          <span>{classification}</span>
        </div>

        <div className="marketOfferProvider">
          <Store />
          <span>{offer.business_name}</span>
        </div>

        <h2>{offer.title}</h2>
        <p className="marketOfferSummary">{offer.summary}</p>

        <div className="marketOfferMeta">
          {where && (
            <span>
              <MapPin /> {where}
            </span>
          )}
          {offer.ends_at && (
            <span>
              <CalendarDays /> Ends{" "}
              {new Date(offer.ends_at).toLocaleDateString()}
            </span>
          )}
        </div>

        {detailed && offer.details && <p>{offer.details}</p>}

        {detailed && (
          <div className="marketOfferDetailSections">
            <section>
              <h3>Terms</h3>
              <p>{offer.terms}</p>
            </section>
            <section>
              <h3>How to use it</h3>
              <p>{offer.redemption_instructions}</p>
            </section>
          </div>
        )}

        {offer.disclosure && detailed && (
          <p className="notice">{offer.disclosure}</p>
        )}

        <div className="marketOfferFooter">
          {!detailed && (
            <Link className="marketOfferCta" to={`/offers/${offer.offer_id}`}>
              View offer details <ArrowUpRight />
            </Link>
          )}

          {offer.source_url && (
            <a className="marketOfferSource" href={offer.source_url}>
              Review source or current terms
            </a>
          )}
        </div>

        {detailed && (
          <p className="marketOfferTrustNote">
            <ShieldCheck /> Review the listing type and provider terms above.
            ShelterPawtners does not independently verify savings or imply
            endorsement.
          </p>
        )}
      </div>
    </article>
  );
}
