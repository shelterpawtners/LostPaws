import { Link } from "react-router-dom";
import "./LostPawsActivation.css";

/**
 * LostPaws (/lostpaws) is the campaign for the Lost Lands and Excision
 * community. It keeps the poster-style artwork hero that makes it a campaign
 * rather than a product page, while the wording was cut to match the /rave
 * treatment: say the point once, then send people where they are going.
 */
export function LostPawsActivation() {
  const base = import.meta.env.BASE_URL;
  const hero = `${base}brand/lostpaws-hero-16x9.webp`;
  const heroFallback = `${base}brand/lostpaws-hero-16x9.png`;
  const logo = `${base}brand/lostpaws-logo.webp`;
  const logoFallback = `${base}brand/LostPaws Logo.png`;

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
          <h1 id="lp-title">Shop the lot. Help the pack.</h1>
          <p className="lpLead">
            Gear and art from Lost Lands vendors who put part of every sale
            behind shelter pets.
          </p>
          <div className="lpActions">
            <Link className="lpButton lpPrimary" to="/marketplace?channel=rave">
              Shop participating offers
            </Link>
            <Link
              className="lpButton lpSecondary"
              to="/register?type=rave_vendor"
            >
              Join as a vendor
            </Link>
          </div>
        </div>
      </section>

      <section className="lpBeats" aria-label="How LostPaws works">
        <div className="lpWrap lpBeatsRow">
          <div className="lpBeat">
            <span>01</span>
            <h2>Buy what you were buying anyway</h2>
          </div>
          <div className="lpBeat">
            <span>02</span>
            <h2>Vendors give a share back</h2>
          </div>
          <div className="lpBeat">
            <span>03</span>
            <h2>Shelter pets get the benefit</h2>
          </div>
        </div>
      </section>

      <section className="lpDoors" aria-labelledby="lp-doors-title">
        <div className="lpWrap">
          <h2 id="lp-doors-title" className="lpSectionTitle">
            Pick your lane
          </h2>
          <div className="lpGrid">
            <article className="lpCard">
              <span>Headbangers</span>
              <h3>Find deals worth using</h3>
              <Link to="/marketplace?channel=rave">Browse RAVE offers</Link>
            </article>
            <article className="lpCard lpCardVendor">
              <span>Vendors and creators</span>
              <h3>Reach the crowd before the gates open</h3>
              <Link to="/register?type=rave_vendor">Join RAVE Shelter</Link>
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
              LostPaws is for Lost Lands. RAVE Shelter is the whole thing.
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
