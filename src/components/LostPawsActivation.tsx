import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { EventSpotlight } from "./events/EventSpotlight";
import { lostPawsVendorRoute } from "../lib/lostpaws-vendor-route";
import { supabase as db } from "../lib/supabase";
import "./LostPawsActivation.css";

/**
 * LostPaws (/lostpaws) is the campaign for the Lost Lands and Excision
 * community. It keeps the poster-style artwork hero that makes it a campaign
 * rather than a product page, while the wording was cut to match the /rave
 * treatment: say the point once, then send people where they are going.
 */
function hasVendorOrganization(data: unknown[]) {
  return data.some((membership) => {
    const organization = (
      membership as {
        organizations?: { organization_type?: string } | null;
      }
    ).organizations;
    return (
      organization?.organization_type === "pet_business" ||
      organization?.organization_type === "rave_vendor"
    );
  });
}

export function LostPawsActivation({
  session,
  authLoading,
}: {
  session: Session | null;
  authLoading: boolean;
}) {
  const base = import.meta.env.BASE_URL;
  const [vendorOrganization, setVendorOrganization] = useState<boolean | null>(
    null,
  );
  useEffect(() => {
    if (!session) {
      setVendorOrganization(false);
      return;
    }
    if (!db) {
      setVendorOrganization(false);
      return;
    }
    setVendorOrganization(null);
    void db
      .from("organization_memberships")
      .select("organizations(organization_type)")
      .eq("user_id", session.user.id)
      .eq("status", "active")
      .then(({ data }) =>
        setVendorOrganization(hasVendorOrganization(data || [])),
      );
  }, [session]);

  const vendorRoute = lostPawsVendorRoute({
    signedIn: Boolean(session),
    hasVendorOrganization: vendorOrganization === true,
  });
  const vendorCta =
    authLoading || (session && vendorOrganization === null) ? (
      <span className="lpButton lpSecondary" aria-live="polite">
        Checking vendor access…
      </span>
    ) : (
      <Link className="lpButton lpSecondary" to={vendorRoute}>
        {vendorOrganization ? "Manage vendor offers" : "Join as a vendor"}
      </Link>
    );
  const hero = `${base}Lost Paws Logos/LostPaws Logo/lostpaws-hero-16x9.webp`;
  const heroFallback = `${base}Lost Paws Logos/LostPaws Logo/lostpaws-hero-16x9.png`;
  const logo = `${base}Lost Paws Logos/LostPaws Logo/lostpaws-logo.webp`;
  const logoFallback = `${base}Lost Paws Logos/LostPaws Logo/LostPaws Logo.png`;

  return (
    <div className="lpPage">
      <section className="lpHero" aria-labelledby="lp-title">
        <div className="lpHeroMedia">
          <picture>
            <source srcSet={hero} type="image/webp" />
            <img
              src={heroFallback}
              alt="LostPaws artwork for the Lost Lands community"
              width={1672}
              height={941}
            />
          </picture>
        </div>
        <div className="lpWrap lpHeroContent">
          <p className="lpKicker">A RAVE Shelter initiative for Lost Lands</p>
          <h1 id="lp-title">Discover vendors that support shelter adoption.</h1>
          <p className="lpLead">
            Meet festival vendors, Etsy sellers, artists, makers, and
            independent businesses that support shelter adoption.
          </p>
          <div className="lpActions">
            <Link className="lpButton lpPrimary" to="/marketplace?channel=rave">
              Browse vendor offers
            </Link>
            {vendorCta}
          </div>
          <Link
            className="lpTextLink lpHeroTextLink"
            to="/register?type=guardian"
          >
            Have a pet? Start a free Digital Pet Passport
          </Link>
        </div>
      </section>

      <section className="lpBeats" aria-label="How LostPaws works">
        <div className="lpWrap lpBeatsRow">
          <div className="lpBeat">
            <span>01</span>
            <h2>Discover festival-ready offers</h2>
          </div>
          <div className="lpBeat">
            <span>02</span>
            <h2>Meet independent creators</h2>
          </div>
          <div className="lpBeat">
            <span>03</span>
            <h2>Support shelter adoption together</h2>
          </div>
        </div>
      </section>

      <EventSpotlight match="Lost Lands" heading="Lost Lands activation" />

      <section className="lpDoors" aria-labelledby="lp-doors-title">
        <div className="lpWrap">
          <h2 id="lp-doors-title" className="lpSectionTitle">
            Pick your lane
          </h2>
          <div className="lpGrid">
            <article className="lpCard">
              <span>Headbangers</span>
              <h3>Browse vendor offers</h3>
              <Link to="/marketplace?channel=rave">Browse RAVE offers</Link>
            </article>
            <article className="lpCard lpCardVendor">
              <span>Vendors and creators</span>
              <h3>Share your work with the community</h3>
              {authLoading || (session && vendorOrganization === null) ? (
                <span aria-live="polite">Checking vendor access…</span>
              ) : (
                <Link to={vendorRoute}>
                  {vendorOrganization
                    ? "Manage vendor offers"
                    : "Join as a vendor"}
                </Link>
              )}
            </article>
            <article className="lpCard lpCardShelter">
              <span>Shelters and rescues</span>
              <h3>It is free for you</h3>
              <Link to="/register?type=shelter">Register a shelter</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="lpMovement" aria-labelledby="lp-movement-title">
        <div className="lpWrap lpMovementGrid">
          <div>
            <p className="lpKicker">Where this sits</p>
            <h2 id="lp-movement-title">
              LostPaws is for Lost Lands. RAVE Shelter is the platform behind
              it.
            </h2>
            <p>
              Other festivals get their own activations, not the LostPaws name.
            </p>
          </div>
          <Link className="lpTextLink" to="/rave">
            See the full RAVE Shelter mission
          </Link>
        </div>
      </section>

      <section className="lpLegal" aria-label="LostPaws independence statement">
        <div className="lpWrap">
          <picture>
            <source srcSet={logo} type="image/webp" />
            <img className="lpFooterLogo" src={logoFallback} alt="LostPaws" />
          </picture>
          <p>
            LostPaws is an independent ShelterPawtners initiative. It is not
            affiliated with, sponsored by, endorsed by, or an official program
            of Lost Lands, Excision, or their affiliates.
          </p>
          <p>
            Savings and vendor contributions apply only where an offer's current
            terms support them. No tax-deductibility is implied.
          </p>
        </div>
      </section>
    </div>
  );
}
