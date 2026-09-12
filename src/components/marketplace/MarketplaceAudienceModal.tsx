import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MARKETPLACE_AUDIENCE_STORAGE_KEY,
  type MarketplaceAudience,
} from "../../lib/marketplace-audience";
import "./MarketplaceAudienceModal.css";

function readStoredAudience(): MarketplaceAudience | null {
  try {
    const stored = window.localStorage.getItem(
      MARKETPLACE_AUDIENCE_STORAGE_KEY,
    );
    if (stored === "pet" || stored === "rave" || stored === "all")
      return stored;
  } catch {
    // Storage can be unavailable (private browsing, blocked site data); fall
    // through to showing the picker instead of failing.
  }
  return null;
}

function storeAudience(audience: MarketplaceAudience) {
  try {
    window.localStorage.setItem(MARKETPLACE_AUDIENCE_STORAGE_KEY, audience);
  } catch {
    // Non-fatal: the choice just won't persist across visits.
  }
}

/**
 * The "what are you shopping for?" first-visit picker (plan section 6).
 * Shown only when the visitor arrived at /marketplace with no explicit
 * ?channel= param and no remembered choice — a direct link like
 * /marketplace?channel=rave always skips this and is respected as-is.
 */
export function MarketplaceAudienceModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const [remember, setRemember] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasExplicitChannel = new URLSearchParams(location.search).has(
      "channel",
    );
    if (hasExplicitChannel) {
      setVisible(false);
      return;
    }
    const remembered = readStoredAudience();
    if (remembered && remembered !== "all") {
      navigate(`/marketplace?channel=${remembered}`, { replace: true });
      setVisible(false);
      return;
    }
    setVisible(!remembered);
    // Only re-evaluate when the visitor navigates to a new /marketplace URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  function choose(audience: MarketplaceAudience) {
    if (remember) storeAudience(audience);
    setVisible(false);
    if (audience === "all") {
      navigate("/marketplace", { replace: true });
    } else {
      navigate(`/marketplace?channel=${audience}`, { replace: true });
    }
  }

  if (!visible) return null;

  return (
    <div className="maModalOverlay">
      <div
        className="maModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ma-modal-title"
      >
        <h2 id="ma-modal-title">What are you shopping for?</h2>
        <div className="maModalOptions">
          <button
            type="button"
            className="maModalOption"
            onClick={() => choose("pet")}
          >
            <strong>Pet Offers</strong>
            <span>
              Pet products, services, adoption-related savings, and pet events.
            </span>
          </button>
          <button
            type="button"
            className="maModalOption maModalOptionRave"
            onClick={() => choose("rave")}
          >
            <strong>RAVE Offers</strong>
            <span>
              Festival gear, apparel, accessories, creators, vendors, and
              event-related offers.
            </span>
          </button>
        </div>
        <div className="maModalFooter">
          <label className="maModalRemember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            Remember my choice
          </label>
          <button
            type="button"
            className="maModalShowAll"
            onClick={() => choose("all")}
          >
            Show everything
          </button>
        </div>
      </div>
    </div>
  );
}
