import { Link } from "react-router-dom";

export function LostPawsCampaign() {
  const heroSrc = `${import.meta.env.BASE_URL}brand/lostpaws-hero-16x9.png`;

  return (
    <div className="lpCampaign">
      <section className="lpHero" aria-label="LostPaws">
        <img
          src={heroSrc}
          alt="LostPaws"
          width={1672}
          height={941}
        />
      </section>

      <section className="lpIntro">
        <div className="lpWrap">
          <p className="lpKicker">
            RAVE Shelter · Rescue and Adoption Vendor Ecosystem
          </p>
          <h1>
            Rave. Save. <span>Help shelter pets.</span>
          </h1>
          <p className="lpLede">
            Festival-friendly offers, local vendors, and a pet community built
            around adoption.
          </p>
          <div className="lpActions">
            <Link className="lpButton lpCyan" to="/marketplace?channel=rave">
              Find deals
            </Link>
            <Link className="lpButton lpAlt" to="/register?type=rave_vendor">
              Join as a vendor
            </Link>
          </div>
        </div>
      </section>

      <section className="lpChooser" aria-labelledby="lostpaws-choose-path">
        <div className="lpWrap">
          <div className="lpSectionHead">
            <p className="lpKicker">Choose your path</p>
            <h2 id="lostpaws-choose-path">What are you here for?</h2>
            <p>Pick one. We’ll take you straight there.</p>
          </div>
          <div className="lpGrid">
            <article className="lpCard">
              <span className="lpTag">For ravers</span>
              <h3>Find festival deals</h3>
              <p>Browse current RAVE Shelter offers from participating vendors.</p>
              <Link className="lpButton lpCyan" to="/marketplace?channel=rave">
                Browse offers
              </Link>
            </article>

            <article className="lpCard lpVendor">
              <span className="lpTag">For vendors</span>
              <h3>Get discovered</h3>
              <p>
                Create a free profile, publish an offer, and reach the festival
                community.
              </p>
              <Link className="lpButton lpPink" to="/register?type=rave_vendor">
                Join RAVE Shelter
              </Link>
            </article>

            <article className="lpCard lpPet">
              <span className="lpTag">For pet people</span>
              <h3>Start a Pet Passport</h3>
              <p>
                Join ShelterPawtners and build your pet’s digital profile and
                community.
              </p>
              <Link className="lpButton" to="/register?type=guardian">
                Create account
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="lpStrip" aria-label="RAVE Shelter information">
        <div className="lpWrap lpStripInner">
          <div>
            <strong>RAVE Shelter by ShelterPawtners</strong>
            <br />
            <span>
              Festival energy. Useful perks. A mission that lasts beyond the
              weekend.
            </span>
          </div>
          <Link className="lpButton lpAlt" to="/rave">
            Learn more
          </Link>
        </div>
      </section>

      <section className="lpLegal" aria-label="LostPaws independence statement">
        <div className="lpWrap">
          <p>
            <strong>LostPaws</strong> is an independent ShelterPawtners / RAVE
            Shelter initiative created by pet lovers in the festival community.
          </p>
          <p>
            LostPaws and ShelterPawtners are not affiliated with, sponsored by,
            endorsed by, or an official program of Lost Lands, Excision, or
            their affiliates.
          </p>
        </div>
      </section>
    </div>
  );
}
