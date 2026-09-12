import { Link, useLocation } from "react-router-dom";
import { LostPawsActivation } from "./LostPawsActivation";
import "./RaveShelterMission.css";

export function RaveShelterMission() {
  const location = useLocation();
  if (location.pathname === "/lostpaws") return <LostPawsActivation />;

  const base = import.meta.env.BASE_URL;
  const lostPawsHero = `${base}brand/lostpaws-hero-16x9.webp`;
  const lostPawsHeroFallback = `${base}brand/lostpaws-hero-16x9.png`;
  const raveLogo = `${base}brand/rave-shelter-logo-static-v2.png`;

  return (
    <div className="rsmPage">
      <section className="rsmHero" aria-labelledby="rsm-title">
        <div className="rsmHeroArt">
          <picture>
            <source srcSet={lostPawsHero} type="image/webp" />
            <img
              src={lostPawsHeroFallback}
              alt="LostPaws — a RAVE Shelter initiative for Lost Lands"
              width={1672}
              height={941}
            />
          </picture>
          <div className="rsmHeroFade" aria-hidden="true" />
        </div>
        <div className="rsmWrap rsmHeroCopy">
          <p className="rsmTagline">Rave with purpose. Shop with impact.</p>
          <p className="rsmEyebrow">RAVE Shelter</p>
          <h1 id="rsm-title">
            Music. Community. <span>Shelter pets.</span>
          </h1>
          <p className="rsmLead">
            RAVE Shelter — Rewarding Adoption with Vendor Exclusives — is an
            ongoing movement bringing ravers, festival vendors, creators, and
            pet people together so everyday purchasing choices can do more for
            shelter pets.
          </p>
          <div className="rsmActions">
            <Link
              className="rsmButton rsmPrimary"
              to="/marketplace?channel=rave"
            >
              Shop RAVE Shelter offers
            </Link>
            <Link
              className="rsmButton rsmSecondary"
              to="/register?type=rave_vendor"
            >
              Join as a vendor
            </Link>
          </div>
          <p className="rsmDemandCta">
            Right now, we need you to sign up and show demand — every
            registration helps grow vendor participation, marketplace inventory,
            and shelter support.
          </p>
        </div>
      </section>

      <section className="rsmMission" aria-labelledby="rsm-mission-title">
        <div className="rsmWrap rsmMissionGrid">
          <div>
            <p className="rsmEyebrow">The mission is simple</p>
            <h2 id="rsm-mission-title">
              Turn everyday purchases into more help for shelter pets.
            </h2>
          </div>
          <div className="rsmMissionCopy">
            <p>
              Shop participating RAVE Shelter partners for useful products,
              festival gear, merch, and services. Participating offers create
              savings for the community while partner contributions help build
              shelter support.
            </p>
            <p>
              As our giving tools come online, ravers and Guardians will also be
              able to pass some or all of eligible savings forward to support
              shelters they care about.
            </p>
            <p className="rsmMissionPunch">
              Bring more resources together. Make every purchase matter more.
            </p>
          </div>
        </div>
      </section>

      <section className="rsmHow" aria-labelledby="rsm-how-title">
        <div className="rsmWrap">
          <div className="rsmSectionHead">
            <p className="rsmEyebrow">How it works</p>
            <h2 id="rsm-how-title">Shop. Save. Give more.</h2>
            <p>
              No complicated program to understand. The community already shops.
              We connect that activity to businesses willing to help shelter
              pets.
            </p>
          </div>
          <div className="rsmSteps">
            <article className="rsmStep">
              <span className="rsmStepNumber">01</span>
              <h3>Shop participating partners</h3>
              <p>
                Discover RAVE Shelter offers from vendors and PetBiz partners
                serving the music and pet communities.
              </p>
            </article>
            <article className="rsmStep">
              <span className="rsmStepNumber">02</span>
              <h3>Save while partners give</h3>
              <p>
                Use participating offers and savings while partner contribution
                commitments help create measurable shelter support.
              </p>
            </article>
            <article className="rsmStep rsmStepGive">
              <span className="rsmStepNumber">03</span>
              <div className="rsmComingSoon">Giving tools coming next</div>
              <h3>Pass your savings forward</h3>
              <p>
                Our giving roadmap lets Guardians choose to direct eligible
                savings toward verified shelter support instead of keeping every
                dollar themselves.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="rsmImpact" aria-labelledby="rsm-impact-title">
        <div className="rsmWrap rsmImpactGrid">
          <div className="rsmLogoPanel">
            <img src={raveLogo} alt="RAVE Shelter" />
            <p>Rewarding Adoption with Vendor Exclusives</p>
          </div>
          <div>
            <p className="rsmEyebrow">Why RAVE Shelter exists</p>
            <h2 id="rsm-impact-title">
              A lot of small choices can become a much bigger resource for
              shelters.
            </h2>
            <p>
              One vendor offer is helpful. One shopper choosing to give back is
              meaningful. Thousands of purchases, participating businesses, and
              pet lovers moving in the same direction can become something much
              larger.
            </p>
            <p>
              RAVE Shelter is the broader ecosystem that connects offers,
              vendors, shelters, adoption, and the ShelterPawtners platform for
              the whole festival and rave community. LostPaws is a distinct RAVE
              Shelter community initiative built specifically for the Lost Lands
              / Excision festival family.
            </p>
          </div>
        </div>
      </section>

      <section className="rsmChoose" aria-labelledby="rsm-choose-title">
        <div className="rsmWrap">
          <div className="rsmSectionHead">
            <p className="rsmEyebrow">Choose your path</p>
            <h2 id="rsm-choose-title">How do you want to help?</h2>
          </div>
          <div className="rsmPathGrid">
            <article className="rsmPathCard rsmRaverCard">
              <span>Ravers + pet people</span>
              <h3>Shop the mission</h3>
              <p>
                Start with current RAVE Shelter offers. Save with participating
                partners and see how the community can turn value into impact.
              </p>
              <div className="rsmCardActions">
                <Link
                  className="rsmButton rsmPrimary"
                  to="/marketplace?channel=rave"
                >
                  Browse RAVE offers
                </Link>
                <Link className="rsmTextLink" to="/register?type=guardian">
                  Create a Guardian account
                </Link>
              </div>
            </article>

            <article className="rsmPathCard rsmVendorCard">
              <span>Vendors + PetBiz</span>
              <h3>Put your business behind the mission</h3>
              <p>
                Create a profile, publish useful offers, reach the community,
                and build a track record of real participation and shelter
                support.
              </p>
              <div className="rsmCardActions">
                <Link
                  className="rsmButton rsmPink"
                  to="/register?type=rave_vendor"
                >
                  Join RAVE Shelter
                </Link>
                <Link className="rsmTextLink" to="/hero-vendor">
                  Hero Vendor program
                </Link>
              </div>
            </article>

            <article className="rsmPathCard rsmShelterCard">
              <span>Shelters + rescues</span>
              <h3>Connect your adopters to more support</h3>
              <p>
                Join ShelterPawtners and help adopted pets carry their history,
                community, and future support forward.
              </p>
              <div className="rsmCardActions">
                <Link
                  className="rsmButton rsmYellow"
                  to="/register?type=shelter"
                >
                  Register a shelter
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="rsmFinalCta" aria-labelledby="rsm-final-title">
        <div className="rsmWrap rsmFinalInner">
          <div>
            <p className="rsmEyebrow">Take the mission into communities</p>
            <h2 id="rsm-final-title">
              Buy something useful. Save some money. Help shelter pets.
            </h2>
            <p>
              LostPaws is the RAVE Shelter community initiative built for Lost
              Lands and the Excision festival family. Other festivals and events
              get their own RAVE Shelter activations without borrowing the
              LostPaws name.
            </p>
            <Link className="rsmTextLink" to="/lostpaws">
              Explore LostPaws — the Lost Lands / Excision community
            </Link>
          </div>
          <Link className="rsmButton rsmPrimary" to="/marketplace?channel=rave">
            See current offers
          </Link>
        </div>
      </section>

      <section
        className="rsmLegal"
        aria-label="RAVE Shelter independence statement"
      >
        <div className="rsmWrap">
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
            Savings, partner commitments, and future giving features are shown
            only where supported by current offer terms and platform capability.
            No tax-deductibility is implied unless a completed donation is
            processed through an eligible charitable recipient and applicable
            requirements are met.
          </p>
        </div>
      </section>
    </div>
  );
}
