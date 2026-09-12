import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import {
  MARKETPLACE_AUDIENCE_STORAGE_KEY,
  type MarketplaceAudience,
} from "../../lib/marketplace-audience";
import "./MarketplaceAudiencePrompt.css";

function readStoredAudience(): MarketplaceAudience | null {
  try {
    const stored = window.localStorage.getItem(
      MARKETPLACE_AUDIENCE_STORAGE_KEY,
    );
    if (stored === "pet" || stored === "rave" || stored === "all")
      return stored;
  } catch {
    // Storage can be unavailable (private browsing, blocked site data); fall
    // through to showing the prompt instead of failing.
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
 * The "what are you shopping for?" entry choice (plan section 6).
 *
 * Deliberately NOT a blocking modal, though the plan says "modal". A
 * full-screen overlay gated the marketplace — the page the soft launch most
 * needs people to reach — behind an interstitial, and it intercepted clicks on
 * the offers underneath, which broke the accepted Persona QA redemption flow.
 * The marketplace also already carries a persistent Audience filter row, so
 * this is a convenience rather than the only way to choose. It therefore
 * renders inline above the listings and can be dismissed.
 */
export function MarketplaceAudiencePrompt() {
  const location = useLocation();
  const navigate = useNavigate();
  const [remember, setRemember] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(location.search).has("channel")) {
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
    // Re-evaluate only when the visitor navigates to a different marketplace URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  function choose(audience: MarketplaceAudience) {
    if (remember) storeAudience(audience);
    setVisible(false);
    navigate(
      audience === "all" ? "/marketplace" : `/marketplace?channel=${audience}`,
      { replace: true },
    );
  }

  if (!visible) return null;

  return (
    <aside className="maPrompt" aria-labelledby="ma-prompt-title">
      <div className="maPromptHead">
        <h2 id="ma-prompt-title">What are you shopping for?</h2>
        <button
          type="button"
          className="maPromptDismiss"
          aria-label="Dismiss and show everything"
          onClick={() => setVisible(false)}
        >
          <X />
        </button>
      </div>
      <div className="maPromptOptions">
        <button
          type="button"
          className="maPromptOption"
          onClick={() => choose("pet")}
        >
          <strong>Pet Offers</strong>
          <span>
            Pet products, services, adoption-related savings, and pet events.
          </span>
        </button>
        <button
          type="button"
          className="maPromptOption maPromptOptionRave"
          onClick={() => choose("rave")}
        >
          <strong>RAVE Offers</strong>
          <span>
            Festival gear, apparel, accessories, creators, vendors, and
            event-related offers.
          </span>
        </button>
      </div>
      <div className="maPromptFooter">
        <label className="maPromptRemember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          Remember my choice
        </label>
        <button
          type="button"
          className="maPromptShowAll"
          onClick={() => choose("all")}
        >
          Show everything
        </button>
      </div>
    </aside>
  );
}
