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
  useParams,
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
  Tag,
  UserRound,
  X,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { accountRegistrationPath, legacyRegistrationTarget } from "./domain";
import {
  adminSupabase,
  getActingSupabase,
  googleAuthEnabled,
  supabase as db,
} from "./lib/supabase";
import {
  hasOrganizationMatchSignal,
  organizationMatchSummary,
} from "./lib/organization-matching";
import {
  roleLabels as phaseOneRoleLabels,
  type UserRole,
} from "./types/personas";
import "./styles.css";
import { PartnerDirectory } from "./components/PartnerDirectory";
import { PartnerProfileEditor } from "./components/PartnerProfileEditor";
import { PublicPartnerProfile } from "./components/PublicPartnerProfile";
import { OfferManager } from "./components/OfferManager";
import { OfferMarketplace } from "./components/OfferMarketplace";
import { RedemptionFlow } from "./components/RedemptionFlow";
import {
  AdminQaMode,
  AdminQaNavLink,
  QaBanner,
} from "./components/AdminQaMode";
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
    if (!adminSupabase) {
      setState({ session: null, loading: false });
      return;
    }
    const persistedClient = adminSupabase;
    const refresh = () => {
      (getActingSupabase() || persistedClient).auth
        .getSession()
        .then(({ data }) =>
          setState({ session: data.session, loading: false }),
        );
    };
    refresh();
    window.addEventListener("sp-qa-changed", refresh);
    const { data } = persistedClient.auth.onAuthStateChange(() => {
      if (!getActingSupabase()) refresh();
    });
    return () => {
      window.removeEventListener("sp-qa-changed", refresh);
      data.subscription.unsubscribe();
    };
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
        <nav
          id="primary-navigation"
          className={o ? "open" : ""}
          aria-label="Primary navigation"
        >
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/rave">RAVE Shelter</Link>
          <Link to="/register">Join</Link>
          {session && <AdminQaNavLink />}
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
      <QaBanner />
      <main id="main" className="min-h-screen" tabIndex={-1}>
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
        <p role="status" aria-live="polite" aria-atomic="true">
          {status}
        </p>
      </form>
    </div>
  );
}
type PartnerKind = "petbiz" | "rave_vendor";
type PartnerForm = {
  name: string;
  legalName: string;
  website: string;
  phone: string;
  email: string;
  instagram: string;
  relationship: "independent" | "corporate_child" | "franchise";
  parentId: string;
  street: string;
  city: string;
  state: string;
  postal: string;
  additionalLocations: {
    street: string;
    city: string;
    state: string;
    postal: string;
  }[];
};
type OrganizationCandidate = {
  organization_id: string;
  public_name: string;
  city: string | null;
  state_province: string | null;
  match_score: number;
  match_reasons: string[];
};
const emptyPartnerForm: PartnerForm = {
  name: "",
  legalName: "",
  website: "",
  phone: "",
  email: "",
  instagram: "",
  relationship: "independent",
  parentId: "",
  street: "",
  city: "",
  state: "",
  postal: "",
  additionalLocations: [],
};
function PartnerOrganizationOnboarding({ kind }: { kind: PartnerKind }) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<PartnerForm>(emptyPartnerForm);
  const [matches, setMatches] = useState<OrganizationCandidate[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [parents, setParents] = useState<{ id: string; public_name: string }[]>(
    [],
  );
  const [draftId, setDraftId] = useState("");
  const [status, setStatus] = useState("");
  const [reviewedMatches, setReviewedMatches] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const choice = choices.find((item) => item.kind === kind)!;
  const update = (key: keyof PartnerForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setReviewedMatches(false);
  };
  async function saveDraft() {
    if (!db || !session) return "";
    const { data, error } = await db
      .from("organization_onboarding_drafts")
      .upsert(
        {
          created_by: session.user.id,
          partner_kind: kind,
          form_data: form,
        },
        { onConflict: "created_by" },
      )
      .select("id")
      .single();
    if (error || !data) {
      setStatus(error?.message || "Unable to save this private draft.");
      return "";
    }
    setDraftId(data.id);
    return data.id;
  }
  useEffect(() => {
    if (!db || !session) return;
    db.from("organizations")
      .select("id, public_name")
      .eq("created_by", session.user.id)
      .order("public_name")
      .then(({ data }) => setParents(data || []));
    db.from("organization_onboarding_drafts")
      .select("id, form_data")
      .eq("created_by", session.user.id)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!data) return;
        setDraftId(data.id);
        if (data.form_data && Object.keys(data.form_data).length)
          setForm((current) => ({
            ...current,
            ...(data.form_data as PartnerForm),
          }));
        const { data: priorDismissals } = await db!
          .from("organization_candidate_dismissals")
          .select("organization_id")
          .eq("draft_id", data.id);
        setDismissed(
          (priorDismissals || []).map((item) => item.organization_id),
        );
      });
  }, [session]);
  useEffect(() => {
    if (!db || !session) return;
    const hasSignals = hasOrganizationMatchSignal({
      publicName: form.name,
      legalName: form.legalName,
      website: form.website,
      phone: form.phone,
      street: form.street,
    });
    if (!hasSignals) return setMatches([]);
    const timer = window.setTimeout(async () => {
      const { data, error } = await db!.rpc("partner_organization_candidates", {
        p_public_name: form.name || null,
        p_legal_name: form.legalName || null,
        p_website_url: form.website || null,
        p_phone: form.phone || null,
        p_street: form.street || null,
        p_city: form.city || null,
        p_state_province: form.state || null,
      });
      if (error) return setStatus(error.message);
      setMatches((data || []) as OrganizationCandidate[]);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [
    form.name,
    form.legalName,
    form.website,
    form.phone,
    form.street,
    form.city,
    form.state,
    session,
  ]);
  async function request(
    candidate: OrganizationCandidate,
    type: "membership" | "ownership_claim",
  ) {
    if (!db || !session) return;
    const id = await saveDraft();
    if (!id) return;
    const { error } = await db.from("organization_access_requests").insert({
      organization_id: candidate.organization_id,
      requester_id: session.user.id,
      request_type: type,
      requester_snapshot: form,
      reason:
        type === "membership"
          ? "Requested during partner onboarding."
          : "Ownership claim submitted during partner onboarding.",
    });
    setStatus(
      error
        ? error.code === "23505"
          ? "That request is already pending."
          : error.message
        : type === "membership"
          ? "Access request submitted. The organization can review it."
          : "Ownership claim submitted for platform review.",
    );
  }
  async function dismiss(candidate: OrganizationCandidate) {
    if (!db || !session) return;
    const id = draftId || (await saveDraft());
    if (!id) return;
    const { error } = await db.from("organization_candidate_dismissals").upsert(
      {
        draft_id: id,
        organization_id: candidate.organization_id,
        dismissed_by: session.user.id,
      },
      { onConflict: "draft_id,organization_id" },
    );
    if (error) return setStatus(error.message);
    setDismissed((current) => [...current, candidate.organization_id]);
    setStatus("Marked as not my business. Your entry remains saved privately.");
  }
  async function createOrganization() {
    if (!db || !session || submitting) return;
    if (!form.name.trim())
      return setStatus("Enter the public business name first.");
    const visibleMatches = matches.filter(
      (item) => !dismissed.includes(item.organization_id),
    );
    if (visibleMatches.length && !reviewedMatches) {
      setReviewedMatches(true);
      return setStatus(
        "Review the possible matches first. If this is genuinely separate, choose Create a separate business again.",
      );
    }
    const id = draftId || (await saveDraft());
    if (!id) return;
    setSubmitting(true);
    setStatus("Creating your organization…");
    const { error } = await db.rpc("create_partner_organization", {
      p_partner_kind: kind,
      p_form: form,
      p_draft_id: id,
    });
    if (error) {
      setSubmitting(false);
      return setStatus(error.message);
    }
    setStatus(
      "Organization created. You can request related access separately when needed.",
    );
    window.setTimeout(() => navigate("/dashboard"), 700);
  }
  const visibleMatches = matches.filter(
    (item) => !dismissed.includes(item.organization_id),
  );
  return (
    <Page>
      <section className="section shell partnerOnboarding">
        <span className="eyebrow">{choice.title} setup</span>
        <h1>Start with your business details.</h1>
        <p className="lead">
          A name alone never proves control. We use the details you provide to
          surface possible organizations, then let you request the right access
          or create a genuinely separate business.
        </p>
        <div className="partnerOnboardingGrid">
          <form
            className="detail"
            onSubmit={(event) => {
              event.preventDefault();
              createOrganization();
            }}
          >
            <div className="panel">
              <h2>Business details</h2>
              <div className="fields">
                <label>
                  Public business name
                  <input
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    required
                    autoComplete="organization"
                  />
                </label>
                <label>
                  Legal name or DBA
                  <input
                    value={form.legalName}
                    onChange={(event) =>
                      update("legalName", event.target.value)
                    }
                  />
                </label>
                <label>
                  Website
                  <input
                    type="url"
                    value={form.website}
                    onChange={(event) => update("website", event.target.value)}
                    placeholder="https://"
                  />
                </label>
                <label>
                  Business phone
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                  />
                </label>
                <label>
                  Contact email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                  />
                </label>
                <label>
                  Instagram
                  <input
                    value={form.instagram}
                    onChange={(event) =>
                      update("instagram", event.target.value)
                    }
                    placeholder="@username"
                  />
                </label>
              </div>
            </div>
            <div className="panel">
              <h2>Primary location</h2>
              <p>
                Use a physical location when you have one. Add every location
                you manage now, or continue with an online-only business.
              </p>
              <div className="fields">
                <label>
                  Street address
                  <input
                    value={form.street}
                    onChange={(event) => update("street", event.target.value)}
                    autoComplete="street-address"
                  />
                </label>
                <label>
                  City
                  <input
                    value={form.city}
                    onChange={(event) => update("city", event.target.value)}
                    autoComplete="address-level2"
                  />
                </label>
                <label>
                  State
                  <input
                    value={form.state}
                    onChange={(event) => update("state", event.target.value)}
                    autoComplete="address-level1"
                  />
                </label>
                <label>
                  Postal code
                  <input
                    value={form.postal}
                    onChange={(event) => update("postal", event.target.value)}
                    autoComplete="postal-code"
                  />
                </label>
              </div>
              {form.additionalLocations.map((location, index) => (
                <div className="fields inset" key={index}>
                  <label>
                    Additional street address
                    <input
                      value={location.street}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          additionalLocations: current.additionalLocations.map(
                            (item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, street: event.target.value }
                                : item,
                          ),
                        }))
                      }
                    />
                  </label>
                  <label>
                    Additional city
                    <input
                      value={location.city}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          additionalLocations: current.additionalLocations.map(
                            (item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, city: event.target.value }
                                : item,
                          ),
                        }))
                      }
                    />
                  </label>
                  <label>
                    Additional state
                    <input
                      value={location.state}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          additionalLocations: current.additionalLocations.map(
                            (item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, state: event.target.value }
                                : item,
                          ),
                        }))
                      }
                    />
                  </label>
                  <label>
                    Additional postal code
                    <input
                      value={location.postal}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          additionalLocations: current.additionalLocations.map(
                            (item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, postal: event.target.value }
                                : item,
                          ),
                        }))
                      }
                    />
                  </label>
                </div>
              ))}
              <button
                type="button"
                className="textButton"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    additionalLocations: [
                      ...current.additionalLocations,
                      { street: "", city: "", state: "", postal: "" },
                    ],
                  }))
                }
              >
                Add another location
              </button>
            </div>
            <div className="panel">
              <h2>How is this business related?</h2>
              <div className="relationshipOptions">
                <label>
                  <input
                    type="radio"
                    checked={form.relationship === "independent"}
                    onChange={() => update("relationship", "independent")}
                  />
                  Independent business
                </label>
                <label>
                  <input
                    type="radio"
                    checked={form.relationship === "corporate_child"}
                    onChange={() => update("relationship", "corporate_child")}
                  />
                  A location or child of an organization I already manage
                </label>
                <label>
                  <input
                    type="radio"
                    checked={form.relationship === "franchise"}
                    onChange={() => update("relationship", "franchise")}
                  />
                  An independent franchise or brand relationship
                </label>
              </div>
              {form.relationship !== "independent" && (
                <label className="relationshipSelect">
                  {form.relationship === "corporate_child"
                    ? "Organization you manage"
                    : "Brand or organization to relate"}
                  <select
                    value={form.parentId}
                    onChange={(event) => update("parentId", event.target.value)}
                  >
                    <option value="">Choose after reviewing matches</option>
                    {form.relationship === "corporate_child"
                      ? parents.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.public_name}
                          </option>
                        ))
                      : visibleMatches.map((item) => (
                          <option
                            key={item.organization_id}
                            value={item.organization_id}
                          >
                            {item.public_name}
                            {item.city ? ` — ${item.city}` : ""}
                          </option>
                        ))}
                  </select>
                </label>
              )}
            </div>
            <button className="btn" disabled={submitting}>
              {submitting
                ? "Creating your business…"
                : "Create a separate business"}
            </button>
            <p role="status" aria-live="polite" aria-atomic="true">
              {status}
            </p>
          </form>
          <aside
            className="matchPanel"
            aria-label="Possible organization matches"
          >
            <span className="eyebrow">Assisted matching</span>
            <h2>Possible matches</h2>
            <p aria-live="polite">
              {visibleMatches.length
                ? "Review these before creating a new business."
                : "Add a name plus a website, phone, or location to check for possible matches."}
            </p>
            {visibleMatches.map((candidate) => (
              <article className="candidate" key={candidate.organization_id}>
                <h3>{candidate.public_name}</h3>
                {(candidate.city || candidate.state_province) && (
                  <p>
                    {[candidate.city, candidate.state_province]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
                <small>
                  {organizationMatchSummary(candidate.match_reasons)}
                </small>
                <div className="candidateActions">
                  <button
                    type="button"
                    className="btn quiet"
                    onClick={() => request(candidate, "membership")}
                  >
                    Request access
                  </button>
                  <button
                    type="button"
                    className="textButton"
                    onClick={() => request(candidate, "ownership_claim")}
                  >
                    Claim review
                  </button>
                  <button
                    type="button"
                    className="textButton"
                    onClick={() => dismiss(candidate)}
                  >
                    Not my business
                  </button>
                </div>
              </article>
            ))}
          </aside>
        </div>
      </section>
    </Page>
  );
}
function Onboard() {
  const k = useLocation().pathname.split("/").pop() as Kind;
  if (k === "petbiz" || k === "rave_vendor")
    return <PartnerOrganizationOnboarding kind={k} />;
  return <StandardOnboard kind={k} />;
}
function StandardOnboard({ kind: k }: { kind: "guardian" | "shelter" }) {
  const c = choices.find((x) => x.kind === k) || choices[0];
  const navigate = useNavigate();
  const [adopted, setAdopted] = useState(false),
    [status, setStatus] = useState(""),
    [saving, setSaving] = useState(false);
  const [guardianSubmissionId] = useState(() => crypto.randomUUID());
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!db) return setStatus("Development connection is unavailable.");
    const f = new FormData(e.currentTarget);
    if (saving) return;
    setSaving(true);
    setStatus("Saving…");
    let user;
    try {
      const { data, error } = await db.auth.getUser();
      if (error) throw error;
      user = data.user;
    } catch {
      setSaving(false);
      return setStatus(
        "Unable to verify your session. Check your connection and try again.",
      );
    }
    if (!user) {
      setSaving(false);
      return setStatus("Please sign in before saving.");
    }
    if (k === "guardian") {
      const { error } = await db.rpc("save_guardian_onboarding_pet", {
        p_submission_id: guardianSubmissionId,
        p_name: String(f.get("name") || ""),
        p_species: String(f.get("species") || ""),
        p_adopted: adopted,
        p_shelter_name: adopted ? String(f.get("shelter_name") || "") : null,
        p_shelter_email: adopted
          ? String(f.get("shelter_email") || "") || null
          : null,
        p_shelter_phone: adopted
          ? String(f.get("shelter_phone") || "") || null
          : null,
        p_shelter_social: adopted
          ? String(f.get("shelter_social") || "") || null
          : null,
        p_adoption_date: adopted
          ? String(f.get("adoption_date") || "") || null
          : null,
        p_adoption_name: adopted
          ? String(f.get("adoption_name") || "") || null
          : null,
      });
      if (error) {
        setSaving(false);
        return setStatus(`Unable to save your pet. ${error.message}`);
      }
      setStatus(
        adopted
          ? "Pet saved. Adoption confirmation is submitted."
          : "Pet Passport started.",
      );
      window.setTimeout(() => navigate("/dashboard"), 700);
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
    if (error || !org) {
      setSaving(false);
      return setStatus(error?.message || "Unable to save organization.");
    }
    const { error: mError } = await db.from("organization_memberships").insert({
      organization_id: org.id,
      user_id: user.id,
      role: "owner",
    });
    if (mError) {
      setSaving(false);
      return setStatus(mError.message);
    }
    setStatus(
      k === "shelter"
        ? "Shelter registration submitted."
        : "Organization and listing saved.",
    );
    window.setTimeout(() => navigate("/dashboard"), 700);
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
          <button className="btn" disabled={saving}>
            {saving ? "Saving…" : "Save and continue"}
          </button>
          <p role="status" aria-live="polite" aria-atomic="true">
            {status}
          </p>
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
        <OfferMarketplace />
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
            <p role="status" aria-live="polite" aria-atomic="true">
              {status}
            </p>
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
          <p role="status" aria-live="polite" aria-atomic="true">
            {status}
          </p>
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
          <p role="status" aria-live="polite" aria-atomic="true">
            {status}
          </p>
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
type GuardianPet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  adopted_self_reported: boolean | null;
};
function Dashboard() {
  const { session } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState("");
  const [pets, setPets] = useState<GuardianPet[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);
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
  useEffect(() => {
    if (!db || !session) return;
    setPetsLoading(true);
    db.from("guardianships")
      .select("pets(id,name,species,breed,adopted_self_reported)")
      .eq("guardian_id", session.user.id)
      .eq("status", "active")
      .is("ended_at", null)
      .then(({ data, error }) => {
        setPetsLoading(false);
        if (error) return setStatus(error.message);
        setPets(
          (data || []).flatMap((row) => {
            const pet = row.pets as GuardianPet | GuardianPet[] | null;
            return Array.isArray(pet) ? pet : pet ? [pet] : [];
          }),
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
    navigate("/", { replace: true });
    await db?.auth.signOut();
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
              ? pets.length
                ? "Your pets"
                : "Your pet journey starts here"
              : kind === "shelter"
                ? "Build your shelter presence"
                : "Manage your organization"}
          </h2>
          {kind === "guardian" && pets.length > 0 && (
            <div className="guardianPets" aria-label="Your pets">
              {pets.map((pet) => (
                <Link
                  className="petTile"
                  to={`/pets/${pet.id}`}
                  key={pet.id}
                  aria-label={`Open ${pet.name}`}
                >
                  <PawPrint />
                  <div>
                    <b>{pet.name}</b>
                    <p>
                      {pet.species}
                      {pet.breed ? ` · ${pet.breed}` : ""}
                    </p>
                  </div>
                  <ArrowRight />
                </Link>
              ))}
            </div>
          )}
          <div className="nextCards">
            {kind !== "guardian" || (!petsLoading && pets.length === 0) ? (
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
            ) : null}
            {kind === "guardian" && pets.length > 0 && (
              <Link className="next" to="/pets/new">
                <PawPrint />
                <div>
                  <b>Add another pet</b>
                  <p>
                    Create a separate Passport for another pet in your care.
                  </p>
                </div>
                <ArrowRight />
              </Link>
            )}
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
            {kind === "petbiz" && (
              <Link className="next" to="/partner/offers">
                <Tag />
                <div>
                  <b>Manage offers</b>
                  <p>Create, preview, publish, pause, and version offers.</p>
                </div>
                <ArrowRight />
              </Link>
            )}
          </div>
          <p role="status" aria-live="polite" aria-atomic="true">
            {status}
          </p>
        </div>
      </section>
    </Page>
  );
}
function GuardianPetDetail() {
  const { session } = useAuth();
  const { petId } = useParams();
  const [pet, setPet] = useState<GuardianPet | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (!db || !session || !petId) return;
    db.from("guardianships")
      .select("pets(id,name,species,breed,adopted_self_reported)")
      .eq("guardian_id", session.user.id)
      .eq("pet_id", petId)
      .eq("status", "active")
      .is("ended_at", null)
      .maybeSingle()
      .then(({ data, error }) => {
        setLoading(false);
        if (error) return setStatus(error.message);
        const related = data?.pets as GuardianPet | GuardianPet[] | null;
        setPet(Array.isArray(related) ? related[0] || null : related || null);
      });
  }, [petId, session]);
  return (
    <Page>
      <section className="section shell narrow petDetail">
        <Link to="/dashboard">← Back to your pets</Link>
        {loading ? (
          <p role="status">Loading pet…</p>
        ) : pet ? (
          <div className="panel">
            <span className="eyebrow">Digital Pet Passport</span>
            <h1>{pet.name}</h1>
            <dl>
              <div>
                <dt>Species</dt>
                <dd>{pet.species}</dd>
              </div>
              {pet.breed && (
                <div>
                  <dt>Breed</dt>
                  <dd>{pet.breed}</dd>
                </div>
              )}
              <div>
                <dt>Adoption status</dt>
                <dd>
                  {pet.adopted_self_reported
                    ? "Guardian reported adopted"
                    : "Not reported as adopted"}
                </dd>
              </div>
            </dl>
            <p>
              More Passport details and editing tools are planned for the
              Guardian and Shelter Passport phase.
            </p>
          </div>
        ) : (
          <div className="panel">
            <h1>Pet unavailable</h1>
            <p>This pet is not available under your active guardianships.</p>
          </div>
        )}
        <p role="status" aria-live="polite">
          {status}
        </p>
      </section>
    </Page>
  );
}
function PartnerProfileRoute() {
  const { session } = useAuth();
  return (
    <Page>
      <PartnerProfileEditor session={session} />
    </Page>
  );
}
function PartnerOffersRoute() {
  const { session } = useAuth();
  return (
    <Page>
      <OfferManager session={session} />
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
      <Route
        path="/partners/:id"
        element={
          <Page>
            <PublicPartnerProfile />
          </Page>
        }
      />
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
        path="/admin-qa"
        element={
          <Protected>
            <Page>
              <AdminQaMode />
            </Page>
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
      <Route
        path="/pets/:petId"
        element={
          <Protected>
            <GuardianPetDetail />
          </Protected>
        }
      />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route
        path="/offers/:offerId"
        element={
          <Page>
            <OfferMarketplace />
          </Page>
        }
      />
      <Route
        path="/partner/offers"
        element={
          <Protected>
            <PartnerOffersRoute />
          </Protected>
        }
      />
      <Route
        path="/redeem"
        element={
          <Protected>
            <Page>
              <RedemptionFlow />
            </Page>
          </Protected>
        }
      />
      <Route
        path="/redeem/:code"
        element={
          <Protected>
            <Page>
              <RedemptionFlow />
            </Page>
          </Protected>
        }
      />
      <Route
        path="/business"
        element={
          <Protected>
            <PartnerProfileRoute />
          </Protected>
        }
      />
      <Route
        path="/directory"
        element={
          <Page>
            <PartnerDirectory />
          </Page>
        }
      />
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
