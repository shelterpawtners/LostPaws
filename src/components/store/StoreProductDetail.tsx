import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, ShieldCheck, Sparkles, Tag } from "lucide-react";
import {
  findStoreProduct,
  formatStorePrice,
  storeAvailabilityLabels,
  storeMissionStatement,
} from "../../store/catalog";
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
