import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, ShieldCheck, Sparkles, Tag } from "lucide-react";
import {
  findStoreProduct,
  formatStorePrice,
  isRequestable,
  storeAvailabilityLabels,
  storeMissionStatement,
  storeProductFromRecord,
  type StoreProduct,
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
  const [product, setProduct] = useState<StoreProduct | null | undefined>(
    undefined,
  );
  const [requester, setRequester] = useState({ name: "", email: "" });
  const [requestStatus, setRequestStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fallback = findStoreProduct(slug) ?? null;
    if (!slug || !db) {
      setProduct(fallback);
      return;
    }
    let cancelled = false;
    setProduct(undefined);

    void db
      .from("store_products")
      .select(
        "id,slug,name,short_description,description,image_url,price_minor,currency,category,brand,availability,featured,promo_badge,support_percent,support_statement",
      )
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        setProduct(!error && data ? storeProductFromRecord(data) : fallback);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!db) return;
    const client = db;
    let cancelled = false;

    void client.auth.getUser().then(async ({ data, error }) => {
      if (cancelled || error || !data.user) return;
      const { data: profile } = await client
        .from("profiles")
        .select("full_name")
        .eq("id", data.user.id)
        .maybeSingle();
      if (cancelled) return;
      const profileName = profile?.full_name?.trim();
      const accountName =
        typeof data.user.user_metadata.full_name === "string"
          ? data.user.user_metadata.full_name.trim()
          : "";
      setRequester((current) => ({
        name: current.name || profileName || accountName,
        email: current.email || data.user.email || "",
      }));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (product === undefined) {
    return (
      <div className="stPage">
        <section className="stBody">
          <div className="stWrap">
            <p role="status">Loading product…</p>
          </div>
        </section>
      </div>
    );
  }

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
    if (!db || !product || submitting) return;
    const requestProduct = product;
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    const { error } = await db.rpc("create_store_request", {
      p_product_id: requestProduct.id,
      p_requester_name: requester.name,
      p_requester_email: requester.email,
      p_requester_phone: form.get("phone") || null,
      p_requested_size:
        requestProduct.category === "apparel" ? form.get("size") || null : null,
      p_quantity: Number(form.get("quantity") || 1),
      p_notes: form.get("notes") || null,
    });
    setSubmitting(false);
    setRequestStatus(
      error
        ? `We could not submit your request. ${error.message}`
        : `Request received for ${requestProduct.name}. This is not a paid order; our team will follow up if the item is available.`,
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
                  <h2>Request this item</h2>
                  <p>
                    Tell us how to reach you. This is a request, not checkout or
                    a paid order.
                  </p>
                  <label>
                    Name
                    <input
                      name="name"
                      value={requester.name}
                      onChange={(event) =>
                        setRequester((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      required
                      maxLength={160}
                    />
                  </label>
                  <label>
                    Email
                    <input
                      name="email"
                      type="email"
                      value={requester.email}
                      onChange={(event) =>
                        setRequester((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      required
                      maxLength={320}
                    />
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
                  {product.category === "apparel" && (
                    <label>
                      Size (optional)
                      <input name="size" maxLength={80} />
                    </label>
                  )}
                  <label>
                    Notes (optional)
                    <textarea name="notes" />
                  </label>
                  <button className="btn" disabled={submitting}>
                    {submitting ? "Sending request…" : "Request this item"}
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
