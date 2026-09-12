import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Filter,
  Info,
  Megaphone,
  Sparkles,
  Store,
  TrendingUp,
} from "lucide-react";
import "./Learn.css";
import "./HeroVendor.css";

const heroBenefits = [
  { Icon: Award, label: "Hero badge on your profile and listings" },
  { Icon: Filter, label: "A dedicated Hero filter shoppers can choose" },
  { Icon: TrendingUp, label: "Enhanced placement in discovery" },
  { Icon: Megaphone, label: "Feature and campaign opportunities" },
  { Icon: Sparkles, label: "Community recognition for the commitment" },
  { Icon: BadgeCheck, label: "Impact visibility once reporting is built" },
];

const standardBenefits = [
  "Free registration and business profile",
  "Publish offers with terms you control",
  "List events and how you are taking part",
  "Appear in the marketplace and partner directory",
  "Build a following and repeat customers",
];

export function HeroVendorProgram() {
  return (
    <div className="learnPage hvPage">
      <section className="hvHero">
        <div className="learnWrap hvHeroGrid">
          <div>
            <span className="hvKicker">RAVE Shelter Hero Vendor</span>
            <h1>Sell more. Give more. Get recognized for it.</h1>
            <p className="learnLead">
              RAVE Shelter is free to join. Businesses that choose to put at
              least 5% of eligible participating sales behind a shelter or
              rescue can earn Hero Vendor recognition — and we will make sure
              the community knows who they are.
            </p>
            <div className="hvActions">
              <Link className="learnButton" to="/register?type=rave_vendor">
                Join as a vendor <ArrowRight />
              </Link>
              <Link className="hvTextLink" to="/learn/vendors">
                How vendor accounts work
              </Link>
            </div>
          </div>
          <aside className="hvHeroBadge" aria-label="Hero Vendor threshold">
            <Award aria-hidden="true" />
            <p className="hvHeroBadgeFigure">5%+</p>
            <p className="hvHeroBadgeLabel">
              of eligible participating sales, to a shelter or rescue you choose
            </p>
            <p className="hvHeroBadgeNote">
              Joining and listing stay free either way.
            </p>
          </aside>
        </div>
      </section>

      <section className="hvWhy" aria-labelledby="hv-why">
        <div className="learnWrap hvSplit">
          <div>
            <span className="hvKicker">The exchange</span>
            <h2 id="hv-why">
              We bring you customers. You decide what to do with the margin.
            </h2>
          </div>
          <div className="hvCopy">
            <p>
              Make a strong first impression, reach people already looking for
              what you sell, and give them a reason to come back. That is the
              job of the platform, and it is free.
            </p>
            <p>
              We then ask the businesses that are able to do so to send a share
              of what they earn through that participation to a qualified
              shelter or rescue of their own choosing. Nobody is required to.
            </p>
            <p className="hvFlywheel">
              More discovery, more sales, more eligible support, more shelter
              impact, stronger loyalty — and back around again.
            </p>
          </div>
        </div>
      </section>

      <section className="hvTiers" aria-labelledby="hv-tiers">
        <div className="learnWrap">
          <h2 id="hv-tiers">Standard vendor or Hero Vendor</h2>
          <div className="hvTierGrid">
            <article className="hvTierCard">
              <span className="hvTierTag">
                <Store /> Standard vendor
              </span>
              <h3>Everything you need, at no cost</h3>
              <ul>
                {standardBenefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="hvTierNote">
                No contribution required, ever. Choosing not to participate does
                not reduce anything above.
              </p>
            </article>

            <article className="hvTierCard hvTierCardHero">
              <span className="hvTierTag">
                <Award /> Hero Vendor
              </span>
              <h3>
                Everything standard includes, plus recognition for the 5%+
                commitment
              </h3>
              <ul>
                {heroBenefits.map(({ Icon, label }) => (
                  <li key={label}>
                    <Icon /> {label}
                  </li>
                ))}
              </ul>
              <p className="hvTierNote">
                Recognition is subject to marketplace quality rules, and can be
                withdrawn if listings break them.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="hvHonest" aria-labelledby="hv-honest">
        <div className="learnWrap">
          <h2 id="hv-honest">
            <Info /> What is not settled yet
          </h2>
          <p>
            We would rather tell you this before you sign up than surprise you
            later. These details are being finalized and will be documented
            before any money moves through the platform:
          </p>
          <ul className="hvHonestList">
            <li>
              The exact basis for <b>eligible participating sales</b> — how
              discounts, refunds, shipping, sales tax, and processor fees are
              treated.
            </li>
            <li>
              Which recipients qualify, and how that eligibility gets verified.
            </li>
            <li>
              Whether a business pays its chosen shelter directly or the
              platform facilitates the transfer, and on what timing.
            </li>
            <li>
              What reporting you receive, and what part of it is informational
              rather than a tax document.
            </li>
          </ul>
          <p className="hvHonestFooter">
            Until that design is reviewed and built, the platform does not move
            money, does not report totals as donated, and makes no
            tax-deductibility claims.
          </p>
        </div>
      </section>

      <section className="hvFinal" aria-labelledby="hv-final">
        <div className="learnWrap hvFinalInner">
          <div>
            <span className="hvKicker">Right now</span>
            <h2 id="hv-final">
              We need businesses to sign up and show demand.
            </h2>
            <p>
              Early registrations are what prove there is a real market here —
              which is what grows vendor participation, marketplace inventory,
              and eventually shelter support.
            </p>
          </div>
          <Link className="learnButton" to="/register?type=rave_vendor">
            Create a free vendor profile <ArrowRight />
          </Link>
        </div>
      </section>

      <section className="hvLegal" aria-label="Program independence statement">
        <div className="learnWrap">
          <p>
            RAVE Shelter and ShelterPawtners are not affiliated with, sponsored
            by, endorsed by, or official programs of Lost Lands, Excision, or
            their affiliates. Hero Vendor commitments are made by participating
            businesses; they are not a ShelterPawtners guarantee of any amount
            of shelter funding.
          </p>
        </div>
      </section>
    </div>
  );
}
