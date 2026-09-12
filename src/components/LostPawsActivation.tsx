import { Link } from "react-router-dom";
import "./LostPawsActivation.css";

export function LostPawsActivation() {
  const base = import.meta.env.BASE_URL;
  // WebP re-encodes of the original art: 2.1 MB -> 164 KB and
  // 2.6 MB -> 209 KB, with the PNG originals kept as fallbacks.
  const hero = `${base}brand/lostpaws-hero-16x9.webp`;
  const heroFallback = `${base}brand/lostpaws-hero-16x9.png`;
  const logo = `${base}brand/lostpaws-logo.webp`;
  const logoFallback = `${base}brand/LostPaws Logo.png`;
  const raveLogo = `${base}brand/rave-shelter-logo-static-v2.png`;

  return (
    <div className="lpPage">
      <section className="lpHero" aria-labelledby="lp-title">
        <div className="lpHeroMedia">
          <picture>
            <source srcSet={hero} type="image/webp" />
            <img
              src={heroFallback}
              alt="LostPaws music-community artwork"
              width={1672}
              height={941}
            />
          </picture>
        </div>
        <div className="lpWrap lpHeroContent">
          <p className="lpKicker">A RAVE Shelter initiative for Lost Lands</p>
          <picture>
            <source srcSet={logo} type="image/webp" />
            <img className="lpLogo" src={logoFallback} alt="LostPaws" />
          </picture>
          <h1 id="lp-title">
            Bring the mission into the Lost Lands community.
          </h1>
          <p className="lpLead">
            LostPaws is the RAVE Shelter community initiative built for Lost
            Lands and the Excision festival family: connecting useful offers,
            independent vendors, pet people, and shelters through intentional
            purchases that can create more value and measurable support.
          </p>
          <div className="lpActions">
            <Link className="lpButton lpPrimary" to="/marketplace?channel=rave">
              Shop participating offers
            </Link>
            <Link
              className="lpButton lpSecondary"
              to="/register?type=rave_vendor"
            >
              Join as a vendor or creator
            </Link>
          </div>
          <p className="lpDemandCta">
            Right now, we need you to sign up and show demand — every
            registration helps grow vendor participation, marketplace inventory,
            and shelter support.
          </p>
        </div>
      </section>

      <section className="lpIntro" aria-labelledby="lp-why-title">
        <div className="lpWrap lpSplit">
          <div>
            <p className="lpKicker">Why LostPaws exists</p>
            <h2 id="lp-why-title">
              Use community energy for something that lasts.
            </h2>
          </div>
          <div className="lpCopy">
            <p>
              The Lost Lands and Excision community already discovers artists,
              makers, merch, food, services, and causes through each other.
              LostPaws gives that same discovery behavior a practical path
              toward shelter impact.
            </p>
            <p>
              LostPaws is a distinct RAVE Shelter community initiative reserved
              for the Lost Lands / Excision festival family. It is not an
              official program of, or affiliated with, Lost Lands, Excision, or
              their affiliates. Other festivals and events get their own RAVE
              Shelter activations rather than the LostPaws name.
            </p>
          </div>
        </div>
      </section>

      <section className="lpBenefits" aria-labelledby="lp-benefits-title">
        <div className="lpWrap">
          <p className="lpKicker">Three ways the activation creates value</p>
          <h2 id="lp-benefits-title">
            Ravers save. Businesses connect. Shelters gain support.
          </h2>
          <div className="lpGrid">
            <article className="lpCard">
              <span>For ravers + pet people</span>
              <h3>Find useful deals with a reason behind them.</h3>
              <p>
                Discover participating offers, save where the offer terms allow,
                and choose businesses that want their community presence to do
                more for shelter pets.
              </p>
              <Link to="/marketplace?channel=rave">Browse RAVE offers</Link>
            </article>
            <article className="lpCard">
              <span>For vendors + creatives</span>
              <h3>Turn discovery into deeper community relationships.</h3>
              <p>
                Publish compelling offers, introduce your work to pet-loving
                festival communities, and build a visible record of meaningful
                participation and shelter support.
              </p>
              <Link to="/register?type=rave_vendor">Join RAVE Shelter</Link>
            </article>
            <article className="lpCard">
              <span>For shelters + rescues</span>
              <h3>Gain more pathways to resources and relationships.</h3>
              <p>
                RAVE Shelter connects adoption, pet identity, community offers,
                and partner support so shelters can benefit from coordinated
                participation rather than isolated campaigns.
              </p>
              <Link to="/register?type=shelter">Register a shelter</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="lpMovement" aria-labelledby="lp-movement-title">
        <div className="lpWrap lpMovementGrid">
          <div className="lpRaveLogoPanel">
            <img src={raveLogo} alt="RAVE Shelter" />
            <p>Rewarding Adoption with Vendor Exclusives</p>
          </div>
          <div>
            <p className="lpKicker">The bigger movement</p>
            <h2 id="lp-movement-title">
              LostPaws is the Lost Lands community. RAVE Shelter is the
              ecosystem.
            </h2>
            <p>
              RAVE Shelter — Rewarding Adoption with Vendor Exclusives — is the
              ongoing movement connecting Guardians, shelters, vendors, PetBiz
              partners, adoption, savings, and future giving tools across the
              whole festival and rave community. LostPaws is the dedicated piece
              of that movement built specifically for Lost Lands and the
              Excision festival family.
            </p>
            <Link className="lpTextLink" to="/rave">
              Explore the full RAVE Shelter mission
            </Link>
          </div>
        </div>
      </section>

      <section className="lpFinal" aria-labelledby="lp-final-title">
        <div className="lpWrap lpFinalInner">
          <div>
            <p className="lpKicker">PLUR with measurable impact</p>
            <h2 id="lp-final-title">Choose where your money goes.</h2>
            <p>
              Save with businesses that give the community real value. Together,
              ordinary purchases can build stronger relationships and more
              support for shelter pets.
            </p>
          </div>
          <Link className="lpButton lpPrimary" to="/marketplace?channel=rave">
            See participating offers
          </Link>
        </div>
      </section>

      <section className="lpLegal" aria-label="LostPaws independence statement">
        <div className="lpWrap">
          <p>
            LostPaws is an independent ShelterPawtners / RAVE Shelter initiative
            created by pet lovers in the festival community.
          </p>
          <p>
            LostPaws, RAVE Shelter, and ShelterPawtners are not affiliated with,
            sponsored by, endorsed by, or an official program of Lost Lands,
            Excision, or their affiliates.
          </p>
          <p>
            Savings and partner-support claims apply only where supported by the
            current offer terms and platform capability. No tax-deductibility is
            implied unless applicable charitable and legal requirements are met.
          </p>
        </div>
      </section>
    </div>
  );
}
