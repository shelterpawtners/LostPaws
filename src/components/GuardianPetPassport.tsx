import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { ShieldCheck } from "lucide-react";
import { supabase as db } from "../lib/supabase";
import { LoadingState } from "./LoadingState";
import { GuardianAdoptionVerification } from "./GuardianAdoptionVerification";
import { PetMediaGallery } from "./PetMediaGallery";
import "./guardian-forms.css";

type PassportPet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  birth_date: string | null;
  altered_status: string | null;
  adopted_self_reported: boolean | null;
  weight_minor: number | null;
  weight_unit: string | null;
};

type PassportForm = {
  name: string;
  species: string;
  breed: string;
  birth_date: string;
  altered_status: string;
};

type Microchip = {
  id: string;
  identifier_value: string;
  issuer_manufacturer: string | null;
  verification_status: string;
  created_at: string;
};

const emptyForm: PassportForm = {
  name: "",
  species: "",
  breed: "",
  birth_date: "",
  altered_status: "unknown",
};

function weightToText(minor: number | null) {
  return minor === null ? "" : (minor / 10).toString();
}

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

  const [weightValue, setWeightValue] = useState("");
  const [weightUnit, setWeightUnit] = useState<"lb" | "kg">("lb");
  const [weightSaving, setWeightSaving] = useState(false);
  const [weightStatus, setWeightStatus] = useState("");

  const [microchip, setMicrochip] = useState<Microchip | null>(null);
  const [microchipLoading, setMicrochipLoading] = useState(true);
  const [microchipSaving, setMicrochipSaving] = useState(false);
  const [microchipStatus, setMicrochipStatus] = useState("");

  useEffect(() => {
    if (!db || !session || !petId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void db
      .from("guardianships")
      .select(
        "relationship,pets(id,name,species,breed,birth_date,altered_status,adopted_self_reported,weight_minor,weight_unit)",
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
        setWeightValue(weightToText(current.weight_minor));
        setWeightUnit(current.weight_unit === "kg" ? "kg" : "lb");
      });
  }, [petId, session]);

  const loadMicrochip = useCallback(async () => {
    if (!db || !session || !petId) {
      setMicrochipLoading(false);
      return;
    }
    setMicrochipLoading(true);
    const { data, error } = await db
      .from("pet_identifiers")
      .select(
        "id,identifier_value,issuer_manufacturer,verification_status,created_at",
      )
      .eq("pet_id", petId)
      .eq("identifier_type", "microchip")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setMicrochipLoading(false);
    if (error) {
      setMicrochipStatus(error.message);
      return;
    }
    setMicrochip((data as Microchip | null) || null);
  }, [petId, session]);

  useEffect(() => {
    void loadMicrochip();
  }, [loadMicrochip]);

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

  async function saveWeight(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !pet || weightSaving || !canEdit) return;
    const trimmed = weightValue.trim();
    let minor: number | null = null;
    if (trimmed) {
      const parsed = Number(trimmed);
      if (!Number.isFinite(parsed) || parsed < 0) {
        setWeightStatus("Enter a weight of 0 or more.");
        return;
      }
      minor = Math.round(parsed * 10);
    }
    const unit = minor === null ? null : weightUnit;
    setWeightSaving(true);
    setWeightStatus("Saving weight…");
    const { error } = await db
      .from("pets")
      .update({ weight_minor: minor, weight_unit: unit })
      .eq("id", pet.id);
    setWeightSaving(false);
    if (error) {
      setWeightStatus(`Unable to save weight. ${error.message}`);
      return;
    }
    setPet((current) =>
      current
        ? { ...current, weight_minor: minor, weight_unit: unit }
        : current,
    );
    setWeightStatus("Weight saved.");
  }

  async function saveMicrochip(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !pet || !session || microchipSaving || !canEdit) return;
    const form = new FormData(event.currentTarget);
    const value = String(form.get("identifier_value") || "").trim();
    if (!value) {
      setMicrochipStatus("Enter the microchip number before saving.");
      return;
    }
    setMicrochipSaving(true);
    setMicrochipStatus("Saving microchip number…");
    const { data, error } = await db
      .from("pet_identifiers")
      .insert({
        pet_id: pet.id,
        identifier_type: "microchip",
        identifier_value: value,
        issuer_manufacturer:
          String(form.get("issuer_manufacturer") || "").trim() || null,
        provenance_code: "guardian_entered",
        created_by: session.user.id,
      })
      .select(
        "id,identifier_value,issuer_manufacturer,verification_status,created_at",
      )
      .single();
    setMicrochipSaving(false);
    if (error || !data) {
      setMicrochipStatus(
        error?.code === "23505"
          ? "That microchip number is already registered to a pet on ShelterPawtners."
          : error?.message || "Unable to save the microchip number.",
      );
      return;
    }
    setMicrochip(data as Microchip);
    event.currentTarget.reset();
    setMicrochipStatus("Microchip number saved.");
  }

  return (
    <section className="section shell narrow petDetail">
      <Link to="/dashboard">← Back to your pets</Link>
      {loading ? (
        <LoadingState>Loading pet Passport…</LoadingState>
      ) : pet ? (
        <>
          <div className="panel passportLead">
            <div className="passportLeadCopy">
              <span className="eyebrow">Digital Pet Passport</span>
              <h1>{pet.name}</h1>
              <p>
                Keep {pet.name}'s recognizable photos, essentials, and adoption
                story together in one private place.
              </p>
            </div>
            <div className="passportLeadMeta" aria-label="Passport status">
              <div>
                <ShieldCheck aria-hidden="true" />
                <span>Private by default</span>
              </div>
              <p>
                Available only through your active guardianship. Nothing here
                makes {pet.name}'s Passport public.
              </p>
            </div>
          </div>

          <PetMediaGallery session={session} petId={pet.id} canEdit={canEdit} />

          <form className="panel detail passportBasicsPanel" onSubmit={save}>
            <h2>Passport basics</h2>
            <div className="gfFields">
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

          <div className="gfChecklist">
            <div className="gfChecklistIntro">
              <span className="eyebrow">Optional details</span>
              <h2>Complete {pet.name}'s Passport</h2>
              <p>
                Add these whenever you have a minute. Each section saves on its
                own, so there's nothing to finish in one sitting.
              </p>
            </div>

            <details className="gfAccordion">
              <summary>
                <span className="gfAccordionTitle">Weight</span>
                <span className="gfAccordionHint">
                  {pet.weight_minor === null
                    ? "Not added yet"
                    : `${weightToText(pet.weight_minor)} ${pet.weight_unit || "lb"}`}
                </span>
              </summary>
              <div className="gfAccordionBody">
                <p>Track the weight from your pet's last vet visit.</p>
                {canEdit ? (
                  <form className="gfFields" onSubmit={saveWeight}>
                    <label>
                      Weight
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="0"
                        value={weightValue}
                        onChange={(event) => setWeightValue(event.target.value)}
                      />
                    </label>
                    <div
                      className="gfChoiceRow"
                      role="group"
                      aria-label="Weight unit"
                    >
                      <button
                        type="button"
                        className="gfChoice"
                        aria-pressed={weightUnit === "lb"}
                        onClick={() => setWeightUnit("lb")}
                      >
                        lb
                      </button>
                      <button
                        type="button"
                        className="gfChoice"
                        aria-pressed={weightUnit === "kg"}
                        onClick={() => setWeightUnit("kg")}
                      >
                        kg
                      </button>
                    </div>
                    <button className="btn quiet" disabled={weightSaving}>
                      {weightSaving ? "Saving…" : "Save weight"}
                    </button>
                    <p role="status" aria-live="polite" aria-atomic="true">
                      {weightStatus}
                    </p>
                  </form>
                ) : (
                  <p>Primary Guardian authority is required to edit weight.</p>
                )}
              </div>
            </details>

            <details className="gfAccordion">
              <summary>
                <span className="gfAccordionTitle">Microchip</span>
                <span className="gfAccordionHint">
                  {microchipLoading
                    ? "Loading…"
                    : microchip
                      ? "On file"
                      : "Not added yet"}
                </span>
              </summary>
              <div className="gfAccordionBody">
                <p>
                  Private to your Passport. Full microchip numbers are never
                  shown on {pet.name}'s public profile.
                </p>
                {microchipLoading ? (
                  <LoadingState>Loading microchip details…</LoadingState>
                ) : microchip ? (
                  <div className="notice">
                    <div>
                      <b>{microchip.identifier_value}</b>
                      <p>
                        {microchip.issuer_manufacturer
                          ? `${microchip.issuer_manufacturer} · `
                          : ""}
                        {microchip.verification_status === "verified"
                          ? "Verified"
                          : "Unverified"}
                      </p>
                    </div>
                  </div>
                ) : null}
                {canEdit ? (
                  <form className="gfFields" onSubmit={saveMicrochip}>
                    <label>
                      {microchip
                        ? "Add a corrected microchip number"
                        : "Microchip number"}
                      <input
                        name="identifier_value"
                        autoComplete="off"
                        inputMode="numeric"
                      />
                    </label>
                    <label>
                      Manufacturer or issuer (optional)
                      <input name="issuer_manufacturer" autoComplete="off" />
                    </label>
                    <button className="btn quiet" disabled={microchipSaving}>
                      {microchipSaving ? "Saving…" : "Save microchip number"}
                    </button>
                    <p role="status" aria-live="polite" aria-atomic="true">
                      {microchipStatus}
                    </p>
                  </form>
                ) : (
                  <p>
                    Primary Guardian authority is required to add a microchip.
                  </p>
                )}
              </div>
            </details>

            <details className="gfAccordion">
              <summary>
                <span className="gfAccordionTitle">Adoption verification</span>
                <span className="gfAccordionHint">
                  {pet.adopted_self_reported
                    ? "In progress or verified"
                    : "Not started"}
                </span>
              </summary>
              <div className="gfAccordionBody">
                <GuardianAdoptionVerification
                  session={session}
                  petId={pet.id}
                  petName={pet.name}
                  canEdit={canEdit}
                />
              </div>
            </details>
          </div>
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
