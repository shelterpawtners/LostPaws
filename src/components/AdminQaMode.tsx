import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import {
  adminSupabase,
  clearActingSupabase,
  getActingSupabase,
  startActingSupabase,
} from "../lib/supabase";

type Persona = {
  id: string;
  email: string;
  name: string;
  role: string;
  pet?: string;
};
const seeded: Persona[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    email: "guardian-a@example.invalid",
    name: "Guardian A",
    role: "Guardian",
    pet: "Demo Pet A",
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    email: "guardian-b@example.invalid",
    name: "Guardian B",
    role: "Guardian",
    pet: "Demo Pet B",
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    email: "partner-admin@example.invalid",
    name: "Partner Admin",
    role: "Partner",
    pet: "Demo PetBiz A",
  },
  {
    id: "10000000-0000-0000-0000-000000000006",
    email: "partner-b@example.invalid",
    name: "Partner B",
    role: "Partner",
    pet: "Demo PetBiz B",
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    email: "shelter-admin@example.invalid",
    name: "Shelter Admin",
    role: "Shelter",
    pet: "Demo Shelter B",
  },
  {
    id: "10000000-0000-0000-0000-000000000007",
    email: "rave-vendor@example.invalid",
    name: "RAVE Vendor",
    role: "RAVE Vendor",
    pet: "Demo RAVE Vendor",
  },
];
export const qaEnabled = import.meta.env.VITE_ADMIN_QA_MODE_ENABLED === "true";

function personaRole(session: Session) {
  const seededPersona = seeded.find(
    (persona) => persona.email === session.user.email,
  );
  if (seededPersona) return seededPersona.role;
  const kind = String(session.user.user_metadata.onboarding_type || "");
  const labels: Record<string, string> = {
    guardian: "Guardian",
    shelter: "Shelter",
    petbiz: "Pet Business",
    rave_vendor: "RAVE Vendor",
  };
  return labels[kind] || "QA test account";
}

export function AdminQaNavLink() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (!adminSupabase || !qaEnabled) return;
    const client = adminSupabase;
    void client.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      const { data: role } = await client
        .from("user_roles")
        .select("role_code")
        .eq("user_id", data.session.user.id)
        .eq("role_code", "platform_admin")
        .is("revoked_at", null)
        .maybeSingle();
      setAllowed(Boolean(role));
    });
  }, []);
  return allowed ? <a href="/admin-qa">Admin QA</a> : null;
}

async function invoke(path: string, body: Record<string, unknown>) {
  if (!adminSupabase) throw new Error("Development connection is unavailable.");
  const { data, error } = await adminSupabase.functions.invoke(path, { body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}
export function QaBanner() {
  const [acting, setActing] = useState<Session | null>(null);
  const [returning, setReturning] = useState(false);
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const refresh = () =>
      void getActingSupabase()
        ?.auth.getSession()
        .then(({ data }) => setActing(data.session || null));
    refresh();
    window.addEventListener("sp-qa-changed", refresh);
    return () => window.removeEventListener("sp-qa-changed", refresh);
  }, []);
  async function stop() {
    setReturning(true);
    try {
      await invoke("admin-qa-session", { action: "stop" });
    } catch (error: any) {
      setNotice(
        `Returned to Admin, but the QA audit request failed: ${error.message || "try again after checking the QA function."}`,
      );
    } finally {
      clearActingSupabase();
      navigate("/dashboard", { replace: true });
    }
  }
  if (!acting && !notice) return null;
  if (!acting)
    return (
      <div className="qaBanner" role="alert">
        {notice}
        <button onClick={() => setNotice("")}>Dismiss</button>
      </div>
    );
  return (
    <div className="qaBanner" role="status" aria-live="polite">
      <b>ADMIN QA MODE</b> — Acting as{" "}
      {acting.user.user_metadata.full_name || acting.user.email} (
      {personaRole(acting)}) <a href="/admin-qa">Switch Persona</a>
      <button onClick={() => void stop()} disabled={returning}>
        {returning ? "Returning…" : "Return to Admin"}
      </button>
    </div>
  );
}
export function AdminQaMode() {
  const [adminSession, setAdminSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false),
    [status, setStatus] = useState(""),
    [name, setName] = useState(""),
    [label, setLabel] = useState(""),
    [busyAction, setBusyAction] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!adminSupabase || !qaEnabled) {
      setChecking(false);
      return;
    }
    void adminSupabase.auth.getSession().then(({ data }) => {
      setAdminSession(data.session);
      // Keep the route in its loading state while an authenticated session's
      // platform_admin role is checked. Otherwise the component can redirect
      // to /dashboard and unmount before the role query resolves.
      if (!data.session) setChecking(false);
    });
  }, []);
  useEffect(() => {
    if (!adminSupabase || !adminSession || !qaEnabled) return;
    void (async () => {
      try {
        const { data } = await adminSupabase
          .from("user_roles")
          .select("role_code")
          .eq("user_id", adminSession.user.id)
          .eq("role_code", "platform_admin")
          .is("revoked_at", null)
          .maybeSingle();
        setAllowed(Boolean(data));
      } finally {
        setChecking(false);
      }
    })();
  }, [adminSession]);
  async function act(targetId: string, reason?: string) {
    if (busyAction) return;
    try {
      setBusyAction(targetId);
      setStatus("Starting QA persona…");
      const result = await invoke("admin-qa-session", {
        target_user_id: targetId,
        reason,
        action: getActingSupabase() ? "switch" : "start",
      });
      await startActingSupabase(result.email, result.token_hash);
      setStatus(`Now acting as ${result.user.display_name}.`);
      navigate("/dashboard");
    } catch (e: any) {
      setStatus(`Unable to start QA mode. ${e.message || "Try again."}`);
    } finally {
      setBusyAction(null);
    }
  }
  async function create(kind: string) {
    if (busyAction) return;
    try {
      setBusyAction(kind);
      setStatus("Creating confirmed QA account…");
      const result = await invoke("admin-create-test-user", {
        persona_kind: kind,
        display_name: name || undefined,
        test_label: label || undefined,
      });
      await startActingSupabase(result.email, result.token_hash);
      setStatus(`Created and switched to ${result.user.display_name}.`);
      navigate(`/onboarding/${kind}`);
    } catch (e: any) {
      setStatus(`Unable to create QA account. ${e.message || "Try again."}`);
    } finally {
      setBusyAction(null);
    }
  }
  if (checking)
    return (
      <section className="section shell">
        <p>Checking Admin QA access…</p>
      </section>
    );
  if (!qaEnabled || !allowed) return <Navigate to="/dashboard" replace />;
  return (
    <section className="section shell formPage">
      <span className="eyebrow">Restricted support tool</span>
      <h1>Admin QA Mode</h1>
      <p className="lead">
        Signed in as {adminSession?.user.email}. Your admin session remains
        intact while the app uses the selected test user's real RLS identity.
      </p>
      <div className="cards">
        {seeded.map((p) => (
          <button
            type="button"
            className="card qaPersonaCard"
            key={p.id}
            onClick={() => void act(p.id)}
            disabled={Boolean(busyAction)}
            aria-busy={busyAction === p.id}
            aria-label={`Act as ${p.name}, ${p.role}${p.pet ? `, ${p.pet}` : ""}`}
          >
            <h2>{p.name}</h2>
            <p>
              {p.email}
              <br />
              {p.role}
              {p.pet ? ` · ${p.pet}` : ""}
            </p>
            <span className="btn qaPersonaCta" aria-hidden="true">
              {busyAction === p.id ? "Switching…" : "Act as"}
            </span>
          </button>
        ))}
      </div>
      <div className="panel">
        <h2>Create fresh test account</h2>
        <div className="fields">
          <label>
            Display name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Test label
            <input value={label} onChange={(e) => setLabel(e.target.value)} />
          </label>
        </div>
        <div className="actions">
          {[
            ["guardian", "Guardian"],
            ["shelter", "Shelter"],
            ["petbiz", "Pet Business"],
            ["rave_vendor", "RAVE Vendor"],
          ].map(([kind, title]) => (
            <button
              className="btn quiet"
              key={kind}
              onClick={() => void create(kind)}
              disabled={Boolean(busyAction)}
            >{`Create fresh ${title}`}</button>
          ))}
        </div>
      </div>
      <p
        role={status.startsWith("Unable") ? "alert" : "status"}
        aria-live="polite"
        aria-atomic="true"
      >
        {status}
      </p>
    </section>
  );
}
