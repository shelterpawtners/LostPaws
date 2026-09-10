import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { ShieldCheck } from "lucide-react";
import { supabase as db } from "../lib/supabase";

type PassportPet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  birth_date: string | null;
  altered_status: string | null;
  adopted_self_reported: boolean | null;
};

type PassportForm = {
  name: string;
  species: string;
  breed: string;
  birth_date: string;
  altered_status: string;
};

const emptyForm: PassportForm = {
  name: "",
  species: "",
  breed: "",
  birth_date: "",
  altered_status: "unknown",
};

export function GuardianPetPassport({
  session,
  petId,
}: {
  session: Session | null;
  petId: string;
}) {
  const [pet, setPet] = useState<PassportPet | null>(null);
  const [form, setForm] = useState<PassportForm>(emptyForm);
  const [relationship, setRelationship] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!db || !session || !petId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void db
      .from("guardianships")
      .select(
        "relationship,pets(id,name,species,breed,birth_date,altered_status,adopted_self_reported)",
      )
      .eq("guardian_id", session.user.id)
      .eq("pet_id", petId)
      .eq("status", "active")
      .is("ended_at", null)
      .maybeSingle()
      .then(({ data, error }) => {
        setLoading(false);
        if (error) {
          setStatus(error.message);
          return;
        }
        const related = data?.pets as PassportPet | PassportPet[] | null;
        const current = Array.isArray(related)
          ? related[0] || null
          : related || null;
        setRelationship(data?.relationship || "");
        setPet(current);
        if (!current) return;
        setForm({
          name: current.name,
          species: current.species,
          breed: current.breed || "",
          birth_date: current.birth_date || "",
          altered_status: current.altered_status || "unknown",
        });
      });
  }, [petId, session]);

  const canEdit = relationship === "primary";

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !pet || saving || !canEdit) return;
    if (!form.name.trim() || !form.species) {
      setStatus("Pet name and species are required.");
      return;
    }
    setSaving(true);
    setStatus("Saving Passport basics…");
    const values = {
      name: form.name.trim(),
      species: form.species,
      breed: form.breed.trim() || null,
      birth_date: form.birth_date || null,
      altered_status: form.altered_status || "unknown",
    };
    const { error } = await db.from("pets").update(values).eq("id", pet.id);
    setSaving(false);
    if (error) {
      setStatus(`Unable to save Passport basics. ${error.message}`);
      return;
    }
    setPet((current) => (current ? { ...current, ...values } : current));
    setStatus("Passport basics saved.");
  }

  return (
    <section className="section shell narrow petDetail">
      <Link to="/dashboard">← Back to your pets</Link>
      {loading ? (
        <p role="status">Loading pet Passport…</p>
      ) : pet ? (
        <>
          <div className="panel">
            <span className="eyebrow">Digital Pet Passport</span>
            <h1>{pet.name}</h1>
            <div className="notice">
              <ShieldCheck />
              <p>
                Private by default. This page is available through your active
                guardianship and is not a public pet profile.
              </p>
            </div>
            <p>
              Keep the core identity details current here. Shelter history, care
              records, emergency sharing, and QR controls arrive in later Phase
              3 checkpoints without replacing this pet record.
            </p>
          </div>

          <form className="panel detail" onSubmit={save}>
            <h2>Passport basics</h2>
            <div className="fields">
              <label>
                Pet name
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                  disabled={!canEdit}
                />
              </label>
              <label>
                Species
                <select
                  value={form.species}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      species: event.target.value,
                    }))
                  }
                  required
                  disabled={!canEdit}
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                Breed
                <input
                  value={form.breed}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      breed: event.target.value,
                    }))
                  }
                  disabled={!canEdit}
                />
              </label>
              <label>
                Birth date
                <input
                  type="date"
                  value={form.birth_date}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      birth_date: event.target.value,
                    }))
                  }
                  disabled={!canEdit}
                />
              </label>
              <label>
                Spay/neuter status
                <select
                  value={form.altered_status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      altered_status: event.target.value,
                    }))
                  }
                  disabled={!canEdit}
                >
                  <option value="unknown">Unknown</option>
                  <option value="unaltered">Not spayed/neutered</option>
                  <option value="spayed">Spayed</option>
                  <option value="neutered">Neutered</option>
                </select>
              </label>
            </div>
            <div className="notice">
              <p>
                <b>Adoption status:</b>{" "}
                {pet.adopted_self_reported
                  ? "Guardian reported adopted"
                  : "Not reported as adopted"}
              </p>
            </div>
            {canEdit ? (
              <button className="btn" disabled={saving}>
                {saving ? "Saving…" : "Save Passport basics"}
              </button>
            ) : (
              <p>
                This relationship is view-only in this checkpoint. Primary
                Guardian authority is required to edit Passport basics.
              </p>
            )}
            <p role="status" aria-live="polite" aria-atomic="true">
              {status}
            </p>
          </form>
        </>
      ) : (
        <div className="panel">
          <h1>Pet unavailable</h1>
          <p>This pet is not available under your active guardianships.</p>
        </div>
      )}
    </section>
  );
}
