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
import { ctaLabelFor, isSafeHttpsUrl } from "../lib/offer-media";

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
  channel: "pet" | "rave" | "shared";
  category: string | null;
  image_url: string | null;
  destination_url: string | null;
  eligibility: string | null;
  last_verified_at: string | null;
  eligibility_kind: string;
  starts_at: string | null;
  ends_at: string | null;
  redemption_instructions: string;
  source_url: string | null;
  disclosure: string | null;
  applicability: string[];
  event_id: string | null;
  product_label: string | null;
  cta_label: string | null;
  image_urls: string[] | null;
};

export type MarketplaceConcept = "value" | "trust" | "curated";

function humanize(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function listingTypeLabel(value: string) {
  if (value === "public_program") return "Public Adoption Benefit";
  if (value === "community") return "Community Resource";
  if (value === "partner_published") return "Partner Offer";
  return humanize(value || "current offer");
}

function visualLabel(value: string) {
  if (value === "public_program") return "Official-source benefit";
  if (value === "community") return "Community resource";
  if (value === "partner_published") return "ShelterPawtners offer";
  return "Current listing";
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
  const external = ["public_program", "community"].includes(
    offer.classification,
  );
  const classification = listingTypeLabel(offer.classification);
  const initials = providerInitials(offer.business_name) || "SP";
  const providerContext = external
    ? "Official third-party source"
    : "Published by a ShelterPawtners participant";
  const primaryImage = offer.image_url || offer.image_urls?.[0] || null;
  const safeDestination =
    offer.destination_url && isSafeHttpsUrl(offer.destination_url)
      ? offer.destination_url
      : null;
  const galleryImages = (offer.image_urls || []).filter(
    (url) => url !== primaryImage && isSafeHttpsUrl(url),
  );

  return (
    <article
      className={`offerCard marketOfferCard marketOfferCard-${concept} marketOfferCard-${offer.classification || "current"}${featured ? " marketOfferCard-featured" : ""}`}
    >
      <div className="marketOfferVisual">
        {primaryImage ? (
          <img
            className="marketOfferPhoto"
            src={primaryImage}
            alt=""
            loading="lazy"
          />
        ) : (
          <span className="marketOfferMonogram" aria-hidden="true">
            {initials}
          </span>
        )}
        <span className="marketOfferVisualLabel">
          {visualLabel(offer.classification)}
        </span>
      </div>

      <div className="marketOfferBody">
        <div className="marketOfferTags" aria-label="Offer tags">
          {offer.category && (
            <span className="marketOfferTag marketOfferTagCategory">
              <Tag aria-hidden="true" /> {offer.category}
            </span>
          )}
          <span className="marketOfferTag">{classification}</span>
          {offer.channel === "rave" && (
            <span className="marketOfferTag marketOfferTagRave">RAVE</span>
          )}
        </div>

        <h2>{offer.title}</h2>

        <div className="marketOfferProvider">
          <Store />
          <span>{offer.business_name}</span>
        </div>

        <p className="marketOfferSummary">{offer.summary}</p>

        {detailed && (
          <div className="marketOfferProviderContext">{providerContext}</div>
        )}

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
          {detailed && external && offer.last_verified_at && (
            <span>
              <ShieldCheck /> Last verified{" "}
              {new Date(offer.last_verified_at).toLocaleDateString()}
            </span>
          )}
        </div>

        {detailed && offer.eligibility && (
          <div className="marketOfferEligibilityPreview">
            <span>Eligibility</span>
            <p>{offer.eligibility}</p>
          </div>
        )}

        {detailed && offer.details && <p>{offer.details}</p>}

        {detailed && galleryImages.length > 0 && (
          <div className="marketOfferGallery" aria-label="Product images">
            {galleryImages.map((url) => (
              <img key={url} src={url} alt="" loading="lazy" />
            ))}
          </div>
        )}

        {detailed && (
          <div className="marketOfferDetailSections">
            {offer.eligibility && (
              <section>
                <h3>Eligibility</h3>
                <p>{offer.eligibility}</p>
              </section>
            )}
            <section>
              <h3>Terms</h3>
              <p>{offer.terms}</p>
            </section>
            <section>
              <h3>{external ? "How to access it" : "How to use it"}</h3>
              <p>{offer.redemption_instructions}</p>
            </section>
          </div>
        )}

        {offer.disclosure && detailed && (
          <p className="notice">{offer.disclosure}</p>
        )}

        {detailed && safeDestination && !external && (
          <div className="marketOfferProductCta">
            {offer.product_label && <b>{offer.product_label}</b>}
            <a
              className="btn marketOfferShopButton"
              href={safeDestination}
              target="_blank"
              rel="noreferrer"
            >
              {offer.cta_label || ctaLabelFor(safeDestination)}{" "}
              <ArrowUpRight aria-hidden="true" />
            </a>
            <p className="marketOfferCtaNote">
              Opens the vendor's own store or listing. ShelterPawtners does not
              process this purchase or verify the vendor's price.
            </p>
          </div>
        )}

        <div className="marketOfferFooter">
          {!detailed && (
            <Link className="marketOfferCta" to={`/offers/${offer.offer_id}`}>
              {external
                ? "See benefit and eligibility"
                : "See offer and eligibility"}{" "}
              <ArrowUpRight />
            </Link>
          )}

          {offer.source_url && (
            <a
              className="marketOfferSource"
              href={offer.source_url}
              target="_blank"
              rel="noreferrer"
            >
              {external
                ? "View official source"
                : "Review source or current terms"}
            </a>
          )}
        </div>

        {detailed && (
          <p className="marketOfferTrustNote">
            <ShieldCheck />{" "}
            {external
              ? "This is a third-party public program listed from an official source. ShelterPawtners does not imply a partnership, endorsement, or independently verified savings amount."
              : "Review the listing type and provider terms above. ShelterPawtners does not independently verify savings or imply endorsement."}
          </p>
        )}
      </div>
    </article>
  );
}
