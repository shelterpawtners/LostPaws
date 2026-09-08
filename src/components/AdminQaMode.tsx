import { useEffect, useState } from "react";
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
  useEffect(() => {
    const refresh = () =>
      void getActingSupabase()
        ?.auth.getSession()
        .then(({ data }) => setActing(data.session || null));
    refresh();
    window.addEventListener("sp-qa-changed", refresh);
    return () => window.removeEventListener("sp-qa-changed", refresh);
  }, []);
  if (!acting) return null;
  async function stop() {
    try {
      await invoke("admin-qa-session", { action: "stop" });
    } finally {
      clearActingSupabase();
    }
  }
  return (
    <div className="qaBanner" role="status">
      <b>ADMIN QA MODE</b> — Acting as{" "}
      {acting.user.user_metadata.full_name || acting.user.email} (
      {acting.user.email}) <a href="/admin-qa">Switch Persona</a>
      <button onClick={() => void stop()}>Return to Admin</button>
    </div>
  );
}
export function AdminQaMode() {
  const [adminSession, setAdminSession] = useState<Session | null>(null);
  const [allowed, setAllowed] = useState(false),
    [status, setStatus] = useState(""),
    [name, setName] = useState(""),
    [label, setLabel] = useState("");
  useEffect(() => {
    if (!adminSupabase || !qaEnabled) return;
    void adminSupabase.auth
      .getSession()
      .then(({ data }) => setAdminSession(data.session));
  }, []);
  useEffect(() => {
    if (!adminSupabase || !adminSession || !qaEnabled) return;
    adminSupabase
      .from("user_roles")
      .select("role_code")
      .eq("user_id", adminSession.user.id)
      .eq("role_code", "platform_admin")
      .is("revoked_at", null)
      .maybeSingle()
      .then(({ data }) => setAllowed(Boolean(data)));
  }, [adminSession]);
  async function act(targetId: string, reason?: string) {
    try {
      setStatus("Starting QA persona…");
      const result = await invoke("admin-qa-session", {
        target_user_id: targetId,
        reason,
        action: getActingSupabase() ? "switch" : "start",
      });
      await startActingSupabase(result.email, result.token_hash);
      setStatus(`Now acting as ${result.user.display_name}.`);
    } catch (e: any) {
      setStatus(e.message || "Unable to start QA mode.");
    }
  }
  async function create(kind: string) {
    try {
      setStatus("Creating confirmed QA account…");
      const result = await invoke("admin-create-test-user", {
        persona_kind: kind,
        display_name: name || undefined,
        test_label: label || undefined,
      });
      await startActingSupabase(result.email, result.token_hash);
      setStatus(`Created and switched to ${result.user.display_name}.`);
    } catch (e: any) {
      setStatus(e.message || "Unable to create QA account.");
    }
  }
  if (!qaEnabled || !allowed) return null;
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
          <article className="card" key={p.id}>
            <h2>{p.name}</h2>
            <p>
              {p.email}
              <br />
              {p.role}
              {p.pet ? ` · ${p.pet}` : ""}
            </p>
            <button className="btn" onClick={() => act(p.id)}>
              Act as
            </button>
          </article>
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
              onClick={() => create(kind)}
            >{`Create fresh ${title}`}</button>
          ))}
        </div>
      </div>
      <p role="status" aria-live="polite">
        {status}
      </p>
    </section>
  );
}
