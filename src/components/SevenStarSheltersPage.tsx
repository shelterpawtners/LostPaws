import { Link } from "react-router-dom";
import "./SevenStarSheltersPage.css";

const pillars = [
  ["Inclusion", "Every pet deserves belonging."],
  ["Sovereign Self", "Empower adopters with useful tools and knowledge."],
  ["Sharing", "Share savings, resources, and support."],
  ["Leave No Trace", "Care for the spaces and communities we share."],
  ["Curiosity", "Learn better ways to care, adopt, and help."],
  ["Kula / Unified Heart", "Community support becomes shelter support."],
  ["Bunga / Wild Abandon", "Celebrate loudly; love generously."],
];

const communityLinks = [
  {
    title: "12 Days of GRiZMAS",
    copy: "Learn about the annual Detroit community-giving program and its youth music and creative-arts impact.",
    href: "https://www.12daysofgrizmas.com/",
  },
  {
    title: "Seven Stars & the Seven Pillars",
    copy: "Explore the festival and the values that inspired our Shelter Love translation.",
    href: "https://www.sevenstarsfest.com/seven-pillars",
  },
  {
    title: "GRiZ official",
    copy: "Find official music, community, and store information directly from GRiZ.",
    href: "https://www.mynameisgriz.com/",
  },
  {
    title: "It Gets Better Project",
    copy: "Learn about a nonprofit supporting LGBTQ+ youth.",
    href: "https://itgetsbetter.org/",
  },
];

export function SevenStarSheltersPage() {
  return (
    <div className="sevenStarsPage">
      <section className="sevenStarsHero" aria-labelledby="seven-stars-title">
        <div className="sevenStarsWrap sevenStarsHeroGrid">
          <div>
            <p className="sevenStarsEyebrow">RAVE Shelter presents</p>
            <p className="sevenStarsKicker" aria-hidden="true">
              ✦ ✦ ✦ ✦ ✦ ✦ ✦
            </p>
            <h1 id="seven-stars-title">Show love. Spread shelter love.</h1>
            <p className="sevenStarsLead">
              Seven Star Shelters is the next RAVE Shelter mission installment —
              connecting festival community, vendor deals, shelter support, and
              ways to amplify the good already happening around the GRiZ
              community.
            </p>
            <div className="sevenStarsActions">
              <Link
                className="sevenStarsButton sevenStarsPrimary"
                to="/register?type=guardian"
              >
                Join the movement
              </Link>
              <Link
                className="sevenStarsButton sevenStarsOutline"
                to="/register?type=rave_vendor"
              >
                Become a vendor
              </Link>
              <Link
                className="sevenStarsTextLink"
                to="/marketplace?channel=rave"
              >
                Browse RAVE offers <span aria-hidden="true">→</span>
              </Link>
            </div>
            <p className="sevenStarsDisclosure">
              Independent community activation by RAVE Shelter /
              ShelterPawtners. No official affiliation or endorsement by GRiZ,
              Seven Stars, 100x, promoters, venues, or charitable organizations
              is implied.
            </p>
          </div>
          <div className="sevenStarsPoster" aria-hidden="true">
            <div className="sevenStarsSun" />
            <div className="sevenStarsMountain sevenStarsMountainBack" />
            <div className="sevenStarsMountain sevenStarsMountainFront" />
            <span>Seven Star</span>
            <b>Shelters</b>
            <small>Spread shelter love</small>
          </div>
        </div>
      </section>

      <section className="sevenStarsIntro">
        <div className="sevenStarsWrap sevenStarsIntroGrid">
          <div>
            <p className="sevenStarsEyebrow">Why this community</p>
            <h2>Good people. Big hearts. Brighter tomorrows.</h2>
          </div>
          <p>
            GRiZ&apos;s community has long connected music with generosity,
            inclusion, creativity, and giving back. Seven Stars&apos; published
            pillars celebrate sharing, curiosity, unified heart,
            self-expression, and leaving spaces better than we found them. This
            is our independent Shelter Love translation of those values — never
            a replacement for the causes already doing the work.
          </p>
        </div>
      </section>

      <section
        className="sevenStarsPillars"
        aria-labelledby="seven-pillars-title"
      >
        <div className="sevenStarsWrap">
          <div className="sevenStarsSectionHeading">
            <div>
              <p className="sevenStarsEyebrow">Our Shelter Love translation</p>
              <h2 id="seven-pillars-title">Seven pillars. One shared heart.</h2>
            </div>
            <a
              href="https://www.sevenstarsfest.com/seven-pillars"
              target="_blank"
              rel="noreferrer"
            >
              Read the official Seven Pillars <span aria-hidden="true">↗</span>
            </a>
          </div>
          <ol className="sevenStarsPillarGrid">
            {pillars.map(([title, copy], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sevenStarsPaths" aria-labelledby="seven-paths-title">
        <div className="sevenStarsWrap">
          <p className="sevenStarsEyebrow">Meet us where you are</p>
          <h2 id="seven-paths-title">For ravers, vendors, and shelters.</h2>
          <div className="sevenStarsPathGrid">
            <article>
              <p className="sevenStarsPathTag">For ravers</p>
              <h3>Shop with purpose.</h3>
              <p>
                Discover festival-relevant offers, save money, and support
                shelter-minded businesses.
              </p>
              <Link to="/marketplace?channel=rave">
                Shop RAVE offers <span aria-hidden="true">→</span>
              </Link>
            </article>
            <article>
              <p className="sevenStarsPathTag">For vendors</p>
              <h3>Bring your good thing.</h3>
              <p>
                Reach a values-driven audience through the existing RAVE Shelter
                marketplace.
              </p>
              <Link to="/register?type=rave_vendor">
                Become a RAVE vendor <span aria-hidden="true">→</span>
              </Link>
            </article>
            <article>
              <p className="sevenStarsPathTag">For shelters</p>
              <h3>Make the mission visible.</h3>
              <p>
                Connect festival-community energy to future awareness and
                support pathways for pets in need.
              </p>
              <Link to="/register?type=shelter">
                Learn about ShelterPawtners <span aria-hidden="true">→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section
        className="sevenStarsAmplify"
        aria-labelledby="seven-amplify-title"
      >
        <div className="sevenStarsWrap">
          <p className="sevenStarsEyebrow">Amplify the love</p>
          <h2 id="seven-amplify-title">
            The love was already here. Help it travel further.
          </h2>
          <p className="sevenStarsAmplifyLead">
            These are independent, official resources — not RAVE Shelter
            partners or donation destinations. We never collect donations on
            their behalf.
          </p>
          <div className="sevenStarsCommunityGrid">
            {communityLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                <h3>
                  {link.title} <span aria-hidden="true">↗</span>
                </h3>
                <p>{link.copy}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="sevenStarsHow" aria-labelledby="seven-how-title">
        <div className="sevenStarsWrap">
          <p className="sevenStarsEyebrow">How it works</p>
          <h2 id="seven-how-title">Small actions. Shared momentum.</h2>
          <div className="sevenStarsHowGrid">
            <article>
              <span>01</span>
              <h3>Join</h3>
              <p>Sign up as a raver, Guardian, shelter, or vendor.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Shop or share</h3>
              <p>
                Discover participating offers or tell someone about the mission.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Support shelter pets</h3>
              <p>Help direct community attention toward animals in need.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="sevenStarsEarly" aria-labelledby="seven-early-title">
        <div className="sevenStarsWrap sevenStarsEarlyInner">
          <div>
            <p className="sevenStarsEyebrow">Before we get to the valley</p>
            <h2 id="seven-early-title">Help build this early.</h2>
            <p>
              Join early, tell us what vendors and deals you want to see,
              introduce a creator or business that belongs here, and help prove
              that festival communities can create lasting value for shelter
              pets.
            </p>
          </div>
          <div className="sevenStarsActions">
            <Link
              className="sevenStarsButton sevenStarsPrimary"
              to="/register?type=guardian"
            >
              Join early
            </Link>
            <Link
              className="sevenStarsButton sevenStarsOutline"
              to="/register?type=rave_vendor"
            >
              Refer a vendor
            </Link>
            <Link className="sevenStarsTextLink" to="/rave">
              Follow RAVE Shelter <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
