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
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [mode, setMode] = useState("");
  const [species, setSpecies] = useState("");
  useEffect(() => {
    if (!db) return;
    db.rpc("public_partner_directory", {
      p_category: category || null,
      p_city: city || null,
      p_state: state || null,
      p_mode: mode || null,
      p_species: species || null,
    }).then(({ data }) => setItems((data || []) as Partner[]));
  }, [category, city, state, mode, species]);
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
          Category{" "}
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Grooming"
          />
        </label>
        <label>
          City{" "}
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Detroit"
          />
        </label>
        <label>
          State{" "}
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="MI"
          />
        </label>
        <label>
          Species{" "}
          <input
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="dog"
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
