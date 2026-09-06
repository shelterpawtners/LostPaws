import {
  StrictMode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  Menu,
  MessageCircle,
  Music2,
  PawPrint,
  Search,
  ShieldCheck,
  Store,
  UserRound,
  X,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { accountRegistrationPath, legacyRegistrationTarget } from "./domain";
import { googleAuthEnabled, supabase as db } from "./lib/supabase";
import {
  roleLabels as phaseOneRoleLabels,
  type UserRole,
} from "./types/personas";
import "./styles.css";
type Kind = "guardian" | "shelter" | "petbiz" | "rave_vendor";
const choices: { kind: Kind; title: string; copy: string }[] = [
  {
    kind: "guardian",
    title: "Pet Guardian",
    copy: "Create a Pet Passport, request adoption confirmation, and find useful savings.",
  },
  {
    kind: "shelter",
    title: "Shelter or Rescue",
    copy: "Create a free organization profile and help pets carry their history forward.",
  },
  {
    kind: "petbiz",
    title: "Pet Business",
    copy: "List services and publish offers for pets and guardians.",
  },
  {
    kind: "rave_vendor",
    title: "RAVE Shelter Vendor",
    copy: "Share products and deals through the Rescue and Adoption Vendor Ecosystem.",
  },
];
const icons = {
  guardian: PawPrint,
  shelter: HeartHandshake,
  petbiz: Store,
  rave_vendor: Music2,
};
type AuthState = { session: Session | null; loading: boolean };
const AuthContext = createContext<AuthState>({ session: null, loading: true });
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    loading: true,
  });
  useEffect(() => {
    if (!db) {
      setState({ session: null, loading: false });
      return;
    }
    db.auth
      .getSession()
      .then(({ data }) => setState({ session: data.session, loading: false }));
    const { data } = db.auth.onAuthStateChange((_event, session) =>
      setState({ session, loading: false }),
    );
    return () => data.subscription.unsubscribe();
  }, []);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
function useAuth() {
  return useContext(AuthContext);
}
function Header() {
  const [o, setO] = useState(false);
  const { session } = useAuth();
  const location = useLocation();
  useEffect(() => setO(false), [location.pathname, location.search]);
  return (
    <header>
      <div className="shell head">
        <Link className="brand" to="/">
          <img src="/brand/shelterpawtners.png" alt="" />
          ShelterPawtners
        </Link>
        <button
          className="menu"
          onClick={() => setO(!o)}
          aria-expanded={o}
          aria-controls="primary-navigation"
          aria-label={o ? "Close menu" : "Open menu"}
        >
          {o ? <X /> : <Menu />}
        </button>
        <nav id="primary-navigation" className={o ? "open" : ""}>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/rave">RAVE Shelter</Link>
          <Link to="/register">Join</Link>
          <Link className="btn quiet" to={session ? "/dashboard" : "/login"}>
            {session ? "My dashboard" : "Sign in"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
function Footer() {
  return (
    <footer>
      <div className="shell foot">
        <div>
          <b>ShelterPawtners</b>
          <p>Care, savings, and community supporting shelter adoption.</p>
        </div>
        <div>
          <a href="mailto:contact@shelterpawtners.com">General questions</a>
          <a href="mailto:adoptions@shelterpawtners.com">Adoption support</a>
          <a href="mailto:petbiz@shelterpawtners.com">PetBiz and vendors</a>
        </div>
      </div>
    </footer>
  );
}
function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
function Cards() {
  return (
    <div className="cards">
      {choices.map((c) => {
        const I = icons[c.kind];
        return (
          <Link
            className="card"
            key={c.kind}
            to={accountRegistrationPath(c.kind)}
          >
            <I />
            <h3>{c.title}</h3>
            <p>{c.copy}</p>
            <b>
              Get started <ArrowRight />
            </b>
          </Link>
        );
      })}
    </div>
  );
}
function Home() {
  return (
    <Page>
      <section className="hero">
        <div className="shell heroGrid">
          <div>
            <span className="eyebrow">Built for life after adoption</span>
            <h1>Better pet care starts with a connected community.</h1>
            <p className="lead">
              Create a Digital Pet Passport, find practical savings, and connect
              with shelters and businesses helping pets thrive.
            </p>
            <div className="actions">
              <Link className="btn" to="/register?type=guardian">
                Tell us about your pet <ArrowRight />
              </Link>
              <Link className="btn quiet" to="/marketplace">
                Browse savings
              </Link>
            </div>
            <small>
              <ShieldCheck /> Private by default
            </small>
          </div>
          <div className="passport">
            <div>
              <b>Digital Pet Passport</b>
              <BadgeCheck />
            </div>
            <span className="paw">
              <PawPrint />
            </span>
            <small>Meet</small>
            <h2>Your best friend</h2>
            <p>
              One evolving home for identity, care history, and the adoption
              story.
            </p>
          </div>
        </div>
      </section>
      <section className="section shell">
        <span className="eyebrow">Choose your path</span>
        <h2>One mission. A place for everyone.</h2>
        <p className="lead">
          Start with the role that fits today. Add another role later using the
          same login.
        </p>
        <Cards />
      </section>
      <section className="dark section">
        <div className="shell">
          <span className="eyebrow">Savings with context</span>
          <h2>Useful offers for pets and people.</h2>
          <Offers />
        </div>
      </section>
      <section className="section shell connect">
        <div>
          <MessageCircle />
          <h2>Community, with boundaries.</h2>
          <p>
            Follow organizations, save preferred providers, ask questions, and
            start direct conversations. Connections never grant access to
            private Passport information.
          </p>
        </div>
        <div>
          <p>
            <BadgeCheck /> Verified relationships are labeled
          </p>
          <p>
            <ShieldCheck /> Private data remains permission controlled
          </p>
        </div>
      </section>
    </Page>
  );
}
const offerData = [
  ["For pets", "Everyday pet care savings", "Public savings preview"],
  ["For ravers", "Festival products and services", "RAVE Shelter preview"],
  ["Shared value", "Community-supported offers", "Shared community"],
];
function Offers() {
  return (
    <div className="offers">
      {offerData.map((o, i) => (
        <article className={i === 1 ? "rave" : ""} key={o[0]}>
          <em>{o[0]}</em>
          {i === 1 ? <Music2 /> : <PawPrint />}
          <small>{o[2]}</small>
          <h3>{o[1]}</h3>
          <p>
            Explore clearly labeled opportunities and review the provider’s
            current terms.
          </p>
        </article>
      ))}
    </div>
  );
}
function Rave() {
  return (
    <Page>
      <section className="raveHero">
        <div className="shell">
          <picture>
            <source
              media="(prefers-reduced-motion: reduce)"
              srcSet="/brand/rave-shelter-logo-static-v2.png"
            />
            <img
              src="/brand/rave-shelter-logo-animated-v2.gif"
              alt="RAVE Shelter"
            />
          </picture>
          <span className="eyebrow">Rescue and Adoption Vendor Ecosystem</span>
          <h1>
            Deals for ravers.
            <br />
            <i>Support for shelter pets.</i>
          </h1>
          <p>
            Festival-ready products and services from vendors joining a
            community that wants its energy to mean something beyond the dance
            floor.
          </p>
          <div className="actions">
            <Link className="btn" to="/marketplace?channel=rave">
              Find RAVE deals
            </Link>
            <Link className="btn quiet" to="/register?type=rave_vendor">
              Join as a vendor
            </Link>
          </div>
          <small>
            Independent LostPaws initiative. No festival affiliation is implied.
          </small>
        </div>
      </section>
    </Page>
  );
}
function Register() {
  const k = new URLSearchParams(useLocation().search).get(
      "type",
    ) as Kind | null,
    c = choices.find((x) => x.kind === k);
  return (
    <Page>
      <section className="section shell narrow">
        {!c ? (
          <>
            <div className="center">
              <span className="eyebrow">Create your account</span>
              <h1>How would you like to participate?</h1>
              <p>Choose a starting point. You can add another role later.</p>
            </div>
            <Cards />
          </>
        ) : (
          <Signup c={c} />
        )}
      </section>
    </Page>
  );
}
function Signup({ c }: { c: (typeof choices)[number] }) {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!db) {
      setStatus("The development connection will be added during deployment.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const { data, error } = await db.auth.signUp({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      options: { data: { full_name: fd.get("name"), onboarding_type: c.kind } },
    });
    if (error) return setStatus(error.message);
    if (data.session) navigate(`/onboarding/${c.kind}`);
    else setStatus("Check your email to confirm your account, then sign in.");
  }
  async function google() {
    if (!db)
      return setStatus(
        "The development connection will be added during deployment.",
      );
    localStorage.setItem("sp_kind", c.kind);
    const { error } = await db.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/onboarding/${c.kind}` },
    });
    if (error) setStatus(error.message);
  }
  const I = icons[c.kind];
  return (
    <div className="signup">
      <aside>
        <I />
        <span className="eyebrow">{c.title}</span>
        <h1>
          {c.kind === "guardian"
            ? "Tell us about your pet"
            : `Join as a ${c.title}`}
        </h1>
        <p>{c.copy}</p>
        <small>
          <ShieldCheck /> One login can support multiple roles.
        </small>
      </aside>
      <form onSubmit={submit}>
        <Link to="/register">← Choose another account type</Link>
        <h2>Create your free account</h2>
        <button
          className="btn quiet full"
          type="button"
          onClick={google}
          disabled={!googleAuthEnabled}
        >
          {googleAuthEnabled
            ? "Continue with Google"
            : "Google sign-in coming soon"}
        </button>
        <hr />
        <label>
          Full name
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          Email address
          <input name="email" required type="email" autoComplete="email" />
        </label>
        <label>
          Password
          <input
            name="password"
            required
            type="password"
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <label className="check">
          <input required type="checkbox" />I agree to the Terms and acknowledge
          the Privacy Notice.
        </label>
        <button className="btn full">Create account</button>
        <p aria-live="polite">{status}</p>
      </form>
    </div>
  );
}
function Onboard() {
  const k = useLocation().pathname.split("/").pop() as Kind,
    c = choices.find((x) => x.kind === k) || choices[0];
  const [adopted, setAdopted] = useState(false),
    [status, setStatus] = useState("");
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!db) return setStatus("Development connection is unavailable.");
    setStatus("Saving…");
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) return setStatus("Please sign in before saving.");
    const f = new FormData(e.currentTarget);
    if (k === "guardian") {
      const { data: pet, error } = await db
        .from("pets")
        .insert({
          created_by: user.id,
          name: f.get("name"),
          species: f.get("species"),
          adopted_self_reported: adopted,
        })
        .select("id")
        .single();
      if (error || !pet)
        return setStatus(error?.message || "Unable to save pet.");
      const { error: gError } = await db
        .from("guardianships")
        .insert({ pet_id: pet.id, guardian_id: user.id });
      if (gError) return setStatus(gError.message);
      if (adopted) {
        const { error: vError } = await db
          .from("adoption_verification_requests")
          .insert({
            pet_id: pet.id,
            requested_by: user.id,
            shelter_name: f.get("shelter_name"),
            shelter_email: f.get("shelter_email") || null,
            shelter_phone: f.get("shelter_phone") || null,
            shelter_website_or_social: f.get("shelter_social") || null,
            approximate_adoption_date: f.get("adoption_date") || null,
            pet_name_at_adoption: f.get("adoption_name") || null,
            contact_consent_at: new Date().toISOString(),
            status: "submitted",
          });
        if (vError) return setStatus(vError.message);
      }
      setStatus(
        adopted
          ? "Pet saved. Adoption confirmation is submitted."
          : "Pet Passport started.",
      );
      window.setTimeout(() => (location.href = "/dashboard"), 700);
      return;
    }
    const orgType =
      k === "shelter"
        ? "shelter"
        : k === "rave_vendor"
          ? "rave_vendor"
          : "pet_business";
    const organizationTypeCode =
      k === "shelter"
        ? "shelter"
        : k === "rave_vendor"
          ? "community_partner"
          : "pet_business";
    const { data: org, error } = await db
      .from("organizations")
      .insert({
        created_by: user.id,
        organization_type: orgType,
        organization_type_code: organizationTypeCode,
        public_name: f.get("name"),
        public_email: f.get("email") || null,
        instagram_handle: f.get("instagram") || null,
        status: k === "shelter" ? "submitted" : "active",
      })
      .select("id")
      .single();
    if (error || !org)
      return setStatus(error?.message || "Unable to save organization.");
    const { error: mError } = await db.from("organization_memberships").insert({
      organization_id: org.id,
      user_id: user.id,
      role: "owner",
    });
    if (mError) return setStatus(mError.message);
    const offer = String(f.get("offer") || "").trim();
    if (offer) {
      const { error: oError } = await db.from("offers").insert({
        organization_id: org.id,
        created_by: user.id,
        channel: k === "rave_vendor" ? "rave" : "pet",
        title: offer,
        summary: String(f.get("offer_summary") || offer),
        category: k === "rave_vendor" ? "Festival marketplace" : "Pet services",
        expires_at: f.get("expires") || null,
        status: "active",
        published_at: new Date().toISOString(),
      });
      if (oError) return setStatus(oError.message);
    }
    setStatus(
      k === "shelter"
        ? "Shelter registration submitted."
        : "Organization and listing saved.",
    );
    window.setTimeout(() => (location.href = "/dashboard"), 700);
  }
  return (
    <Page>
      <section className="section shell narrow">
        <span className="eyebrow">{c.title} setup</span>
        <h1>
          {k === "guardian"
            ? "Tell us about your pet"
            : "Tell us about your organization"}
        </h1>
        <form className="detail" onSubmit={save}>
          <div className="panel">
            <h2>{k === "guardian" ? "Pet basics" : "Organization profile"}</h2>
            <div className="fields">
              <label>
                {k === "guardian" ? "Pet name" : "Public name"}
                <input name="name" required />
              </label>
              <label>
                {k === "guardian" ? "Species" : "Organization type"}
                <select name="species" required>
                  <option value="">Select one</option>
                  <option
                    value={
                      k === "guardian"
                        ? "dog"
                        : k === "shelter"
                          ? "shelter"
                          : k === "rave_vendor"
                            ? "rave_vendor"
                            : "pet_business"
                    }
                  >
                    {k === "guardian"
                      ? "Dog"
                      : k === "shelter"
                        ? "Shelter or rescue"
                        : k === "rave_vendor"
                          ? "Festival vendor"
                          : "Pet business"}
                  </option>
                  {k === "guardian" && (
                    <>
                      <option value="cat">Cat</option>
                      <option value="other">Other</option>
                    </>
                  )}
                </select>
              </label>
              <label>
                Contact email
                <input name="email" type="email" />
              </label>
              <label>
                Instagram profile
                <input name="instagram" placeholder="@username" />
              </label>
            </div>
          </div>
          {k === "guardian" && (
            <div className="panel">
              <h2>Was this pet adopted?</h2>
              <button
                type="button"
                className="btn quiet"
                onClick={() => setAdopted(!adopted)}
              >
                {adopted
                  ? "Remove confirmation request"
                  : "Yes, request shelter confirmation"}
              </button>
              {adopted && (
                <div className="fields inset">
                  <label>
                    Shelter name
                    <input name="shelter_name" required />
                  </label>
                  <label>
                    Shelter email
                    <input name="shelter_email" type="email" />
                  </label>
                  <label>
                    Phone
                    <input name="shelter_phone" type="tel" />
                  </label>
                  <label>
                    Website or social profile
                    <input name="shelter_social" />
                  </label>
                  <label>
                    Approximate adoption date
                    <input name="adoption_date" type="date" />
                  </label>
                  <label>
                    Pet name at adoption
                    <input name="adoption_name" />
                  </label>
                  <label className="check">
                    <input required type="checkbox" />I authorize
                    ShelterPawtners to contact this shelter.
                  </label>
                </div>
              )}
            </div>
          )}
          {k !== "guardian" && k !== "shelter" && (
            <div className="panel">
              <h2>Your first listing</h2>
              <p>
                Publish once required terms are complete. Publication does not
                imply endorsement.
              </p>
              <div className="fields">
                <label>
                  Offer title
                  <input name="offer" />
                </label>
                <label>
                  Short description
                  <input name="offer_summary" />
                </label>
                <label>
                  Expiration date
                  <input name="expires" type="date" />
                </label>
              </div>
            </div>
          )}
          <button className="btn">Save and continue</button>
          <p aria-live="polite">{status}</p>
        </form>
      </section>
    </Page>
  );
}
function Marketplace() {
  const rave =
    new URLSearchParams(useLocation().search).get("channel") === "rave";
  return (
    <Page>
      <section className="market">
        <div className="shell">
          <span className="eyebrow">ShelterPawtners marketplace</span>
          <h1>Find value that fits your world.</h1>
          <div className="search">
            <Search />
            <input
              aria-label="Search marketplace"
              placeholder="Search products, services, or vendors"
            />
          </div>
        </div>
      </section>
      <section className="section shell">
        <div className="filters">
          <button>All offers</button>
          <button>Pet savings</button>
          <button className={rave ? "active" : ""}>RAVE Shelter</button>
        </div>
        <Offers />
        <div className="notice">
          <ShieldCheck />
          <p>
            Public programs are not presented as ShelterPawtners partnerships.
            Partner-published offers identify the responsible organization and
            can be reported or suspended.
          </p>
        </div>
      </section>
    </Page>
  );
}
const publicFoundations: Record<
  string,
  { eyebrow: string; title: string; copy: string }
> = {
  passport: {
    eyebrow: "Digital Pet Passport",
    title: "A private record that can grow with your pet.",
    copy: "Identity, guardianship, adoption history, and future care records stay connected without making private information public.",
  },
  partners: {
    eyebrow: "PetBiz and community partners",
    title: "Give guardians practical value after adoption.",
    copy: "Create an organization profile, locations, and offers using one account that can support multiple team members.",
  },
  shelters: {
    eyebrow: "Shelters and rescues",
    title: "Help each adoption carry trusted history forward.",
    copy: "ShelterPawtners is free for shelters. The foundation supports adoption confirmation, report cards, transfers, and future imports.",
  },
  lostpaws: {
    eyebrow: "LostPaws",
    title: "Music community energy for shelter pets.",
    copy: "An independent community activation connecting ravers and vendors with ShelterPawtners’ adoption mission.",
  },
  about: {
    eyebrow: "Care. Savings. Community.",
    title: "Built to support the full life after adoption.",
    copy: "ShelterPawtners connects guardians, shelters, providers, and businesses around better continuity of care and measurable support.",
  },
};
function FoundationPage({ name }: { name: keyof typeof publicFoundations }) {
  const page = publicFoundations[name];
  return (
    <Page>
      <section className="section shell formPage">
        <span className="eyebrow">{page.eyebrow}</span>
        <h1>{page.title}</h1>
        <p className="lead">{page.copy}</p>
        <div className="actions">
          <Link className="btn" to="/register">
            Choose how to participate
          </Link>
          <Link className="btn quiet" to="/marketplace">
            Preview savings
          </Link>
        </div>
      </section>
    </Page>
  );
}
function AppFoundation({ title, copy }: { title: string; copy: string }) {
  return (
    <Page>
      <section className="dashboardHero">
        <div className="shell dashboardTitle">
          <div>
            <span className="eyebrow">Phase 1 foundation</span>
            <h1>{title}</h1>
            <p>{copy}</p>
          </div>
        </div>
      </section>
      <section className="section shell">
        <nav className="appNav" aria-label="Account sections">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/my-pets">My Pets</Link>
          <Link to="/savings">Savings</Link>
          <Link to="/community">Community</Link>
          <Link to="/business">Business</Link>
          <Link to="/offers">Offers</Link>
          <Link to="/locations">Locations</Link>
          <Link to="/adoptions">Adoptions</Link>
          <Link to="/transfers">Transfers</Link>
          <Link to="/administration">Administration</Link>
        </nav>
        <div className="panel">
          <h2>Foundation ready</h2>
          <p>
            This route is connected to the shared authenticated shell. Its
            complete workflow belongs to a later approved phase.
          </p>
        </div>
      </section>
    </Page>
  );
}
function Login() {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!db) return setStatus("Development connection is unavailable.");
    const f = new FormData(e.currentTarget),
      { error } = await db.auth.signInWithPassword({
        email: String(f.get("email")),
        password: String(f.get("password")),
      });
    if (error) return setStatus(error.message);
    navigate("/dashboard", { replace: true });
  }
  async function google() {
    if (!db) return setStatus("Development connection is unavailable.");
    const { error } = await db.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: location.origin },
    });
    if (error) setStatus(error.message);
  }
  return (
    <Page>
      <section className="section shell narrow">
        <div className="signup">
          <aside>
            <span className="eyebrow">Welcome back</span>
            <h1>Sign in to ShelterPawtners</h1>
            <p>
              One login works across guardian, shelter, PetBiz, and RAVE Shelter
              experiences.
            </p>
          </aside>
          <form onSubmit={login}>
            <button
              className="btn quiet full"
              type="button"
              onClick={google}
              disabled={!googleAuthEnabled}
            >
              {googleAuthEnabled
                ? "Continue with Google"
                : "Google sign-in coming soon"}
            </button>
            <hr />
            <label>
              Email address
              <input name="email" required type="email" autoComplete="email" />
            </label>
            <label>
              Password
              <input
                name="password"
                required
                type="password"
                autoComplete="current-password"
              />
            </label>
            <button className="btn full">Sign in</button>
            <p aria-live="polite">{status}</p>
            <Link to="/forgot-password">Forgot your password?</Link>
            <Link to="/register">New here? Choose an account type</Link>
          </form>
        </div>
      </section>
    </Page>
  );
}
function ForgotPassword() {
  const [status, setStatus] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!db) return setStatus("Development connection is unavailable.");
    const email = String(new FormData(e.currentTarget).get("email"));
    const { error } = await db.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });
    setStatus(
      error
        ? error.message
        : "If that address has an account, a recovery email is on its way.",
    );
  }
  return (
    <Page>
      <section className="section shell formPage">
        <form className="panel" onSubmit={submit}>
          <span className="eyebrow">Account recovery</span>
          <h1>Reset your password</h1>
          <p>Enter the email used for your ShelterPawtners account.</p>
          <label>
            Email address
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <button className="btn">Send recovery email</button>
          <p aria-live="polite">{status}</p>
          <Link to="/login">Back to sign in</Link>
        </form>
      </section>
    </Page>
  );
}
function ResetPassword() {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!db) return setStatus("Development connection is unavailable.");
    const password = String(new FormData(e.currentTarget).get("password"));
    const { error } = await db.auth.updateUser({ password });
    if (error) return setStatus(error.message);
    setStatus("Password updated.");
    window.setTimeout(() => navigate("/dashboard", { replace: true }), 700);
  }
  return (
    <Page>
      <section className="section shell formPage">
        <form className="panel" onSubmit={submit}>
          <span className="eyebrow">Account recovery</span>
          <h1>Choose a new password</h1>
          <label>
            New password
            <input
              name="password"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
            />
          </label>
          <button className="btn">Update password</button>
          <p aria-live="polite">{status}</p>
        </form>
      </section>
    </Page>
  );
}
function Protected({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading)
    return (
      <Page>
        <section className="section shell">
          <p>Loading your account…</p>
        </section>
      </Page>
    );
  return session ? children : <Navigate to="/login" replace />;
}
const onboardingRole: Record<Kind, UserRole> = {
  guardian: "guardian",
  shelter: "shelter_member",
  petbiz: "partner_member",
  rave_vendor: "partner_member",
};
function Dashboard() {
  const { session } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!db || !session) return;
    db.from("user_roles")
      .select("role_code")
      .eq("user_id", session.user.id)
      .is("revoked_at", null)
      .then(({ data, error }) => {
        if (error) return setStatus(error.message);
        const list = (data || []).map((row) => row.role_code as string);
        setRoles(list);
        const saved = localStorage.getItem("sp_active_role");
        setActiveRole(
          saved && list.includes(saved) ? saved : list[0] || "guardian",
        );
      });
  }, [session]);
  function switchRole(role: string) {
    localStorage.setItem("sp_active_role", role);
    setActiveRole(role);
  }
  async function addRole(kind: Kind) {
    if (!db || !session) return;
    const { error } = await db
      .from("user_roles")
      .insert({ user_id: session.user.id, role_code: onboardingRole[kind] });
    if (error && error.code !== "23505") return setStatus(error.message);
    const role = onboardingRole[kind];
    if (!roles.includes(role)) setRoles([...roles, role]);
    switchRole(role);
    navigate(`/onboarding/${kind}`);
  }
  async function signOut() {
    await db?.auth.signOut();
    navigate("/", { replace: true });
  }
  const active = (activeRole || "guardian") as UserRole;
  const kind: Kind | "platform_admin" = active.startsWith("shelter")
    ? "shelter"
    : active.startsWith("partner")
      ? "petbiz"
      : active === "platform_admin"
        ? "platform_admin"
        : "guardian";
  const name =
    session?.user.user_metadata.full_name ||
    session?.user.email?.split("@")[0] ||
    "there";
  return (
    <Page>
      <section className="dashboardHero">
        <div className="shell dashboardTitle">
          <div>
            <span className="eyebrow">Your ShelterPawtners home</span>
            <h1>Welcome, {name}</h1>
            <p>
              Choose the role you are using today. Your login and private
              information stay the same.
            </p>
          </div>
          <button className="btn quiet" onClick={signOut}>
            Sign out
          </button>
        </div>
      </section>
      <section className="section shell dashboardGrid">
        <aside className="rolePanel">
          <h2>Your roles</h2>
          {roles.map((role) => (
            <button
              key={role}
              className={activeRole === role ? "role active" : "role"}
              onClick={() => switchRole(role)}
            >
              <UserRound />
              {phaseOneRoleLabels[role as UserRole] || role}
            </button>
          ))}
          <details>
            <summary>Add another role</summary>
            {choices
              .filter((c) => !roles.includes(onboardingRole[c.kind]))
              .map((c) => (
                <button
                  className="role"
                  key={c.kind}
                  onClick={() => addRole(c.kind)}
                >
                  {c.title}
                </button>
              ))}
          </details>
        </aside>
        <div className="dashboardMain">
          <span className="eyebrow">{phaseOneRoleLabels[active]}</span>
          <h2>
            {kind === "guardian"
              ? "Your pet journey starts here"
              : kind === "shelter"
                ? "Build your shelter presence"
                : "Manage your organization and offers"}
          </h2>
          <div className="nextCards">
            <Link
              className="next primary"
              to={kind === "guardian" ? "/pets/new" : `/onboarding/${kind}`}
            >
              <PawPrint />
              <div>
                <b>
                  {kind === "guardian"
                    ? "Set up your pet"
                    : "Complete your organization"}
                </b>
                <p>
                  {kind === "guardian"
                    ? "Start a private Digital Pet Passport and adoption story."
                    : "Add the details people need to understand your work."}
                </p>
              </div>
              <ArrowRight />
            </Link>
            <Link className="next" to="/marketplace">
              <Search />
              <div>
                <b>
                  {kind === "guardian"
                    ? "Browse savings"
                    : "View the marketplace"}
                </b>
                <p>Explore active listings in the marketplace.</p>
              </div>
              <ArrowRight />
            </Link>
          </div>
          <p aria-live="polite">{status}</p>
        </div>
      </section>
    </Page>
  );
}
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rave" element={<Rave />} />
      <Route path="/rave-shelter" element={<Rave />} />
      <Route path="/passport" element={<FoundationPage name="passport" />} />
      <Route path="/partners" element={<FoundationPage name="partners" />} />
      <Route path="/shelters" element={<FoundationPage name="shelters" />} />
      <Route path="/lostpaws" element={<FoundationPage name="lostpaws" />} />
      <Route path="/about" element={<FoundationPage name="about" />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/register.html"
        element={<Navigate to={legacyRegistrationTarget} replace />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-in" element={<Navigate to="/login" replace />} />
      <Route path="/sign-up" element={<Navigate to="/register" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/onboarding/:type"
        element={
          <Protected>
            <Onboard />
          </Protected>
        }
      />
      <Route
        path="/pets/new"
        element={
          <Protected>
            <Navigate to="/onboarding/guardian" />
          </Protected>
        }
      />
      <Route path="/marketplace" element={<Marketplace />} />
      {[
        [
          "/my-pets",
          "My Pets",
          "Manage pet identity and guardianship foundations.",
        ],
        [
          "/savings",
          "Savings",
          "Review future claims, redemptions, and tracked value.",
        ],
        [
          "/community",
          "Community",
          "Connect without granting access to private Passport data.",
        ],
        [
          "/business",
          "Business",
          "Manage organization details and memberships.",
        ],
        [
          "/offers",
          "Offers",
          "Prepare campaigns with immutable published versions.",
        ],
        [
          "/locations",
          "Locations",
          "Manage physical, online, service-area, regional, and national reach.",
        ],
        [
          "/adoptions",
          "Adoptions",
          "Prepare shelter-confirmed adoption workflows.",
        ],
        [
          "/transfers",
          "Transfers",
          "Prepare secure, expiring shelter transfer flows.",
        ],
        [
          "/administration",
          "Administration",
          "Restricted platform oversight foundation.",
        ],
      ].map(([path, title, copy]) => (
        <Route
          key={path}
          path={path}
          element={
            <Protected>
              <AppFoundation title={title} copy={copy} />
            </Protected>
          }
        />
      ))}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
