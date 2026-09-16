import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
} from "lucide-react";
import {
  formatStorePrice,
  isRequestable,
  storeAvailabilityLabels,
  storeCategories,
  storeMissionStatement,
  storeProductFromRecord,
  storeProducts,
  type StoreCategory,
} from "../../store/catalog";
import { supabase as db } from "../../lib/supabase";
import "./Store.css";

type CategoryFilter = StoreCategory | "all";

function productInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function StorePage() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [catalog, setCatalog] = useState(storeProducts);

  useEffect(() => {
    if (!db) return;
    let cancelled = false;

    void db
      .from("store_products")
      .select(
        "id,slug,name,short_description,description,image_url,price_minor,currency,category,brand,availability,featured,promo_badge,support_percent,support_statement",
      )
      .eq("status", "active")
      .order("sort_order")
      .then(({ data, error }) => {
        // Keep the committed catalog as a truthful offline/rollout fallback.
        // A partially applied environment must not present an empty Store.
        if (cancelled || error || !data?.length) return;
        setCatalog(data.map(storeProductFromRecord));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const products = useMemo(() => {
    const filtered =
      category === "all"
        ? catalog
        : catalog.filter((product) => product.category === category);
    return [...filtered].sort(
      (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
    );
  }, [catalog, category]);

  return (
    <div className="stPage">
      <section className="stHero">
        <div className="stWrap">
          <span className="stEyebrow">
            <ShoppingBag aria-hidden="true" /> Store
          </span>
          <h1>First-party Shelter Pawtners and LostPaws products.</h1>
          <p className="stLead">
            Stickers, apparel, and merch designed by Shelter Pawtners and the
            LostPaws and RAVE Shelter initiatives. This is a first-party
            storefront, not a third-party Marketplace listing — checkout is not
            live yet, but items marked "Available to request" below can be
            requested directly right now.
          </p>
        </div>
      </section>

      <section className="stBody">
        <div className="stWrap">
          <div
            className="stFilters"
            role="group"
            aria-label="Filter products by category"
          >
            <button
              type="button"
              className={category === "all" ? "active" : ""}
              aria-pressed={category === "all"}
              onClick={() => setCategory("all")}
            >
              All products
            </button>
            {storeCategories.map((option) => (
              <button
                type="button"
                key={option.value}
                className={category === option.value ? "active" : ""}
                aria-pressed={category === option.value}
                onClick={() => setCategory(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {products.length === 0 ? (
            <p className="stEmpty">No products in this category yet.</p>
          ) : (
            <ul className="stGrid">
              {products.map((product) => {
                const requestable = isRequestable(product);
                return (
                  <li className="stCard" key={product.slug}>
                    <Link
                      className="stCardLink"
                      to={`/store/${product.slug}`}
                      aria-label={`${product.name}, ${formatStorePrice(product)}${requestable ? ", available to request" : ""}`}
                    >
                      <div className="stCardVisual">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt="" loading="lazy" />
                        ) : (
                          <span aria-hidden="true">
                            {productInitials(product.name)}
                          </span>
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
                        {requestable && (
                          <span className="stBadge stBadgeRequestable">
                            <CheckCircle2 aria-hidden="true" /> Request
                            available
                          </span>
                        )}
                      </div>
                      <div className="stCardBody">
                        <span className="stCardBrand">{product.brand}</span>
                        <h2>{product.name}</h2>
                        <p>{product.shortDescription}</p>
                        <div className="stCardMeta">
                          <span className="stPrice">
                            {formatStorePrice(product)}
                          </span>
                          <span
                            className={
                              requestable
                                ? "stAvailability stAvailabilityRequestable"
                                : "stAvailability"
                            }
                          >
                            {requestable ? (
                              <CheckCircle2 aria-hidden="true" />
                            ) : (
                              <Clock aria-hidden="true" />
                            )}{" "}
                            {requestable
                              ? "Available to request"
                              : storeAvailabilityLabels[product.availability]}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <section className="stMission" aria-labelledby="store-mission">
            <h2 id="store-mission">Support behind every product</h2>
            <p>{storeMissionStatement}</p>
          </section>

          <p className="stComingSoonNote">
            <ShieldCheck aria-hidden="true" />
            <span>
              Checkout is not available yet. Every product above shows a price
              for reference, but purchases cannot be completed on this
              storefront until payment processing launches. Items marked
              "Available to request" can still be requested directly today —
              open the product to fill out a short form.
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
