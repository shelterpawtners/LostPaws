import { Link, useLocation } from "react-router-dom";
import { LostPawsActivation } from "./LostPawsActivation";
import "./RaveShelterMission.css";

/**
 * RAVE Shelter (/rave) is the evergreen marketplace and vendor program.
 *
 * It deliberately does NOT look or read like /lostpaws. LostPaws is a
 * campaign for one festival family and leads with full-bleed artwork and
 * community feeling; this page is the system behind it, so it leads
 * typographically with the brand line, states the exchange in as few words as
 * possible, and sends each of its two audiences to one obvious next step.
 * Owner direction (2026-09-12) was to cut wording that convolutes the message.
 */
export function RaveShelterMission() {
  const location = useLocation();
  if (location.pathname === "/lostpaws") return <LostPawsActivation />;

  const base = import.meta.env.BASE_URL;
  // Mark-only lockup: the full lockup bakes in the tagline, which the h1
  // already says, so the hero would print the same sentence twice.
  const raveLogo = `${base}brand/rave-shelter-logo-mark.svg`;

  return (
    <div className="rsmPage">
      <section className="rsmHero" aria-labelledby="rsm-title">
        <div className="rsmWrap rsmHeroGrid">
          <div className="rsmHeroCopy">
            <p className="rsmEyebrow">
              RAVE Shelter — Rewarding Adoption with Vendor Exclusives
            </p>
            <h1 id="rsm-title">
              Rave with purpose. <span>Shop with impact.</span>
            </h1>
            <p className="rsmLead">
              Festival gear, art, and everyday finds from vendors who put part
              of every sale behind shelter pets.
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
          </div>
          <div className="rsmHeroMark">
            <img
              src={raveLogo}
              alt="RAVE Shelter"
              width={520}
              height={281}
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section className="rsmBeats" aria-label="How RAVE Shelter works">
        <div className="rsmWrap rsmBeatsRow">
          <div className="rsmBeat">
            <span>01</span>
            <h2>You shop</h2>
            <p>Gear you actually want, from independent vendors.</p>
          </div>
          <div className="rsmBeat">
            <span>02</span>
            <h2>You save</h2>
            <p>Participating offers, on each vendor's own terms.</p>
          </div>
          <div className="rsmBeat">
            <span>03</span>
            <h2>Shelters gain</h2>
            <p>Vendors send a share of eligible sales to a shelter.</p>
          </div>
        </div>
      </section>

      <section className="rsmDoors" aria-labelledby="rsm-doors-title">
        <div className="rsmWrap">
          <h2 id="rsm-doors-title" className="rsmSectionTitle">
            Two ways in
          </h2>
          <div className="rsmDoorGrid">
            <article className="rsmDoor">
              <p className="rsmDoorTag">Shopping</p>
              <h3>Find offers worth using</h3>
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

            <article className="rsmDoor rsmDoorVendor">
              <p className="rsmDoorTag">Selling</p>
              <h3>Reach people already looking</h3>
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
          </div>
          <p className="rsmShelterNote">
            Running a shelter or rescue? It is free.{" "}
            <Link to="/register?type=shelter">Register a shelter</Link>
          </p>
        </div>
      </section>

      <section className="rsmStraight" aria-labelledby="rsm-straight-title">
        <div className="rsmWrap rsmStraightGrid">
          <h2 id="rsm-straight-title">Straight answers</h2>
          <ul className="rsmStraightList">
            <li>
              <b>Free for shoppers and vendors.</b> No subscription to
              participate.
            </li>
            <li>
              <b>Vendors set their own offers.</b> We do not promise them
              traffic or sales.
            </li>
            <li>
              <b>Giving tools are not live yet.</b> Nothing here moves money,
              and no total is reported as donated.
            </li>
          </ul>
        </div>
      </section>

      <section className="rsmLostPaws" aria-labelledby="rsm-lostpaws-title">
        <div className="rsmWrap rsmLostPawsInner">
          <div>
            <p className="rsmEyebrow">Lost Lands community</p>
            <h2 id="rsm-lostpaws-title">
              LostPaws is our Lost Lands initiative.
            </h2>
            <p>
              Same mission, built for the Excision festival family. Other events
              get their own activations.
            </p>
          </div>
          <Link className="rsmTextLink" to="/lostpaws">
            Explore LostPaws — the Lost Lands / Excision community
          </Link>
        </div>
      </section>

      <section
        className="rsmLegal"
        aria-label="RAVE Shelter independence statement"
      >
        <div className="rsmWrap">
          <p>
            RAVE Shelter, LostPaws, and ShelterPawtners are not affiliated with,
            sponsored by, endorsed by, or official programs of Lost Lands,
            Excision, or their affiliates.
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
