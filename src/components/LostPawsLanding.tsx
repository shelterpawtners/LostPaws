import { ArrowRight, BadgeCheck, HeartHandshake, Music2, PawPrint, Store } from "lucide-react";
import { Link } from "react-router-dom";
import "./lostpaws-landing.css";

export function LostPawsLanding() {
  return (
    <main className="lostPawsPage" id="main" tabIndex={-1}>
      <section className="lostPawsHero" aria-labelledby="lostpaws-title">
        <img
          className="lostPawsHeroArt"
          src="/lostpaws/lostpaws-hero.png"
          alt="LostPaws neon cracked-letter artwork with a heart and paw mark"
        />
        <div className="lostPawsHeroShade" aria-hidden="true" />
        <div className="lostPawsHeroCopy">
          <p className="lostPawsKicker">An independent ShelterPawtners community initiative</p>
          <h1 id="lostpaws-title" className="srOnly">LostPaws</h1>
          <a className="lostPawsJump" href="#rave-shelter">
            Enter RAVE Shelter <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="lostPawsSection lostPawsIntro" id="rave-shelter">
        <div className="lostPawsShell lostPawsIntroGrid">
          <div>
            <p className="lostPawsEyebrow">RAVE Shelter</p>
            <h2>Rescue and Adoption Vendor Ecosystem</h2>
            <p className="lostPawsStatement">Rave. Save. Help shelter pets.</p>
            <p className="lostPawsLead">
              LostPaws connects the festival community with participating vendors offering useful deals and perks while supporting the broader ShelterPawtners mission: helping shelter pets and making adoption easier to choose.
            </p>
          </div>
          <div className="lostPawsSignal" aria-label="RAVE Shelter values">
            <span><Music2 aria-hidden="true" /> Community</span>
            <span><Store aria-hidden="true" /> Useful offers</span>
            <span><HeartHandshake aria-hidden="true" /> Shelter-pet impact</span>
          </div>
        </div>
      </section>

      <section className="lostPawsSection lostPawsDark">
        <div className="lostPawsShell">
          <p className="lostPawsEyebrow">Choose your path</p>
          <div className="lostPawsPaths">
            <article className="lostPawsPath lostPawsPathPrimary">
              <span className="lostPawsPathNumber">01</span>
              <Music2 aria-hidden="true" />
              <h2>For ravers</h2>
              <p>Find current RAVE Shelter offers, discover participating vendors, and review each offer&apos;s real terms before you claim it.</p>
              <Link className="lostPawsButton" to="/marketplace?channel=rave">
                Explore RAVE offers <ArrowRight aria-hidden="true" />
              </Link>
            </article>
            <article className="lostPawsPath">
              <span className="lostPawsPathNumber">02</span>
              <PawPrint aria-hidden="true" />
              <h2>For pet guardians</h2>
              <p>Create a Digital Pet Passport and keep adoption history, identity, photos, and future care information connected in one private home.</p>
              <Link className="lostPawsButton lostPawsButtonQuiet" to="/register?type=guardian">
                Create a Pet Passport <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="lostPawsSection lostPawsVendor">
        <div className="lostPawsShell lostPawsVendorGrid">
          <div>
            <p className="lostPawsEyebrow">For vendors</p>
            <h2>Bring a deal. Meet the community. Support the mission.</h2>
            <p>
              Create a free PetBiz / RAVE Shelter vendor profile, publish a current festival or community offer, and become discoverable to people already looking for relevant products and services.
            </p>
            <Link className="lostPawsButton" to="/register?type=rave_vendor">
              Join RAVE Shelter for the festival <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ol className="lostPawsSteps">
            <li><span>1</span><div><b>Create your profile</b><small>Use the existing RAVE Shelter vendor onboarding.</small></div></li>
            <li><span>2</span><div><b>Publish an offer</b><small>Show clear terms and what the community can actually claim.</small></div></li>
            <li><span>3</span><div><b>Track real activity</b><small>Use supported redemption and impact signals without inflated claims.</small></div></li>
          </ol>
        </div>
      </section>

      <section className="lostPawsSection lostPawsQrSection">
        <div className="lostPawsShell lostPawsQrGrid">
          <div>
            <p className="lostPawsEyebrow">Keep LostPaws with you</p>
            <h2>Scan once. Come back anytime.</h2>
            <p>The QR always points to the planned canonical LostPaws destination: <strong>shelterpawtners.com/lostpaws</strong>.</p>
            <p className="lostPawsFinePrint">The QR destination is stable for stickers, cards, shirts, and event outreach. Final main-domain cutover remains separately owner-gated.</p>
          </div>
          <figure className="lostPawsQrCard">
            <img src="/lostpaws/lostpaws-qr.svg" alt="QR code for shelterpawtners.com/lostpaws" />
            <figcaption><BadgeCheck aria-hidden="true" /> Deterministically generated and decode-tested</figcaption>
          </figure>
        </div>
      </section>

      <footer className="lostPawsFooter">
        <div className="lostPawsShell">
          <p className="lostPawsFooterBrand">LostPaws × RAVE Shelter × ShelterPawtners</p>
          <p>
            LostPaws is an independent ShelterPawtners / RAVE Shelter initiative created by pet lovers in the festival community. LostPaws and ShelterPawtners are not affiliated with, sponsored by, endorsed by, or an official program of Lost Lands, Excision, or their affiliates.
          </p>
          <div className="lostPawsFooterLinks">
            <Link to="/marketplace?channel=rave">RAVE offers</Link>
            <Link to="/register?type=rave_vendor">Vendor signup</Link>
            <Link to="/register?type=guardian">Pet Guardian signup</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
