import { Link } from "react-router-dom";
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

export function OfferCard({
  offer,
  detailed = false,
}: {
  offer: PublicOffer;
  detailed?: boolean;
}) {
  return (
    <article className="card offerCard">
      <span className="eyebrow">
        {eligibilityLabel(offer.eligibility_kind)}
      </span>
      <h2>{offer.title}</h2>
      <p>{offer.summary}</p>
      {detailed && offer.details && <p>{offer.details}</p>}
      <p>
        <b>Provided by:</b> {offer.business_name}
      </p>
      {offer.ends_at && (
        <p>
          <b>Ends:</b> {new Date(offer.ends_at).toLocaleDateString()}
        </p>
      )}
      {offer.applicability?.length > 0 && (
        <p>
          <b>Where:</b> {offer.applicability.join(", ").replaceAll("_", " ")}
        </p>
      )}
      {detailed && (
        <>
          <h3>Terms</h3>
          <p>{offer.terms}</p>
          <h3>How to use it</h3>
          <p>{offer.redemption_instructions}</p>
        </>
      )}
      {offer.disclosure && <p className="notice">{offer.disclosure}</p>}
      {offer.source_url && (
        <a href={offer.source_url}>Review source or current terms</a>
      )}
      {!detailed && (
        <Link to={`/offers/${offer.offer_id}`}>View offer details</Link>
      )}
      <p>
        <small>
          Partner-published. Listing does not imply endorsement or independently
          verified savings.
        </small>
      </p>
    </article>
  );
}
