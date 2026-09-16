import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, ShieldCheck, Sparkles, Tag } from "lucide-react";
import {
  findStoreProduct,
  formatStorePrice,
  isRequestable,
  storeAvailabilityLabels,
  storeMissionStatement,
} from "../../store/catalog";
import { supabase as db } from "../../lib/supabase";
import "./Store.css";

function productInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function StoreProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = findStoreProduct(slug);
  const [requestStatus, setRequestStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!product) {
    return (
      <div className="stPage">
        <section className="stBody">
          <div className="stWrap">
            <h1>Product not found</h1>
            <p>
              That product is not in the Store catalog. It may have been renamed
              or retired.
            </p>
            <Link className="stBackLink" to="/store">
              <ArrowLeft aria-hidden="true" /> Back to Store
            </Link>
          </div>
        </section>
      </div>
    );
  }

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !product?.id || submitting) return;
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    const { error } = await db.rpc("create_store_request", {
      p_product_id: product.id,
      p_requester_name: form.get("name"),
      p_requester_email: form.get("email"),
      p_requester_phone: form.get("phone") || null,
      p_requested_size: null,
      p_quantity: Number(form.get("quantity") || 1),
      p_notes: form.get("notes") || null,
    });
    setSubmitting(false);
    setRequestStatus(
      error
        ? `We could not submit your request. ${error.message}`
        : "Request received. This is not a paid order; our team will follow up if the sticker is available.",
    );
    if (!error) event.currentTarget.reset();
  }

  return (
    <div className="stPage">
      <section className="stBody">
        <div className="stWrap">
          <Link className="stBackLink" to="/store">
            <ArrowLeft aria-hidden="true" /> Back to Store
          </Link>

          <article className="stDetail">
            <div className="stDetailVisual">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt="" />
              ) : (
                <span aria-hidden="true">{productInitials(product.name)}</span>
              )}
              {product.featured && (
                <span className="stBadge stBadgeFeatured">
                  <Sparkles aria-hidden="true" /> Featured
                </span>
              )}
              {product.promoBadge && (
                <span className="stBadge stBadgePromo">
                  <Tag aria-hidden="true" /> {product.promoBadge}
                </span>
              )}
            </div>

            <div className="stDetailBody">
              <span className="stCardBrand">{product.brand}</span>
              <h1>{product.name}</h1>
              <p className="stPrice">{formatStorePrice(product)}</p>
              <span className="stAvailability">
                <Clock aria-hidden="true" />{" "}
                {storeAvailabilityLabels[product.availability]}
              </span>

              <p className="stDetailDescription">
                {product.description ?? product.shortDescription}
              </p>

              <p className="stComingSoonNote">
                <ShieldCheck aria-hidden="true" />
                <span>
                  Checkout is not available yet. This price is shown for
                  reference only and cannot be purchased on this storefront
                  until payment processing launches.
                </span>
              </p>

              {isRequestable(product) && (
                <form className="stRequestForm" onSubmit={submitRequest}>
                  <h2>Request this sticker</h2>
                  <p>
                    Tell us how to reach you. This is a request, not checkout or
                    a paid order.
                  </p>
                  <label>
                    Name
                    <input name="name" required maxLength={160} />
                  </label>
                  <label>
                    Email
                    <input name="email" type="email" required maxLength={320} />
                  </label>
                  <label>
                    Phone (optional)
                    <input name="phone" type="tel" />
                  </label>
                  <label>
                    Quantity
                    <input
                      name="quantity"
                      type="number"
                      min="1"
                      max="20"
                      defaultValue="1"
                      required
                    />
                  </label>
                  <label>
                    Notes (optional)
                    <textarea name="notes" />
                  </label>
                  <button className="btn" disabled={submitting}>
                    {submitting ? "Sending request…" : "Request this sticker"}
                  </button>
                  <p role="status" aria-live="polite">
                    {requestStatus}
                  </p>
                </form>
              )}

              <section
                className="stMission"
                aria-labelledby={`store-mission-${product.slug}`}
              >
                <h2 id={`store-mission-${product.slug}`}>
                  Support behind this product
                </h2>
                <p>{product.supportStatement ?? storeMissionStatement}</p>
              </section>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
