import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { supabase as db } from "../lib/supabase";

type Partner = {
  organization_id: string;
  business_name: string;
  description: string;
  city: string | null;
  state: string | null;
  business_model: string;
  participation_state: string;
};

export function PartnerDirectory() {
  const [items, setItems] = useState<Partner[]>([]);
  const [state, setState] = useState("");
  const [mode, setMode] = useState("");
  useEffect(() => {
    if (!db) return;
    db.rpc("public_partner_directory", {
      p_state: state || null,
      p_mode: mode || null,
    }).then(({ data }) => setItems((data || []) as Partner[]));
  }, [state, mode]);
  return (
    <section className="section shell">
      <span className="eyebrow">Partner directory</span>
      <h1>Find businesses supporting pets and people.</h1>
      <p className="lead">
        Browse local, online, national, and RAVE community Partners. A listing
        is not an endorsement or verification.
      </p>
      <div className="filters">
        <label>
          State{" "}
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="MI"
          />
        </label>
        <label>
          Business model{" "}
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="">All</option>
            <option value="physical">Physical location</option>
            <option value="online">Online</option>
            <option value="mobile">Mobile</option>
            <option value="service_area">Service area</option>
            <option value="national">National</option>
          </select>
        </label>
      </div>
      <div className="cards">
        {items.map((item) => (
          <Link
            className="card"
            key={item.organization_id}
            to={`/partners/${item.organization_id}`}
          >
            <Search />
            <h2>{item.business_name}</h2>
            <p>{item.description}</p>
            <small>
              {item.city && item.state ? `${item.city}, ${item.state} · ` : ""}
              {item.business_model.replaceAll("_", " ")} ·{" "}
              {item.participation_state}
            </small>
          </Link>
        ))}
      </div>
      {!items.length && (
        <div className="panel">
          <p>No published Partners match these filters yet.</p>
        </div>
      )}
    </section>
  );
}
