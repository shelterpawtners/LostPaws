import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase as db } from "../lib/supabase";

type ProfileLite = {
  full_name: string;
  phone: string;
  instagram_handle: string;
};

const emptyProfile: ProfileLite = {
  full_name: "",
  phone: "",
  instagram_handle: "",
};

export function GuardianProfileLite({ session }: { session: Session | null }) {
  const [profile, setProfile] = useState<ProfileLite>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!db || !session) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void db
      .from("profiles")
      .select("full_name,phone,instagram_handle")
      .eq("id", session.user.id)
      .single()
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) {
          setStatus(error?.message || "Unable to load your private profile.");
          return;
        }
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          instagram_handle: data.instagram_handle || "",
        });
      });
  }, [session]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !session || saving) return;
    if (!profile.full_name.trim()) {
      setStatus("Enter your name before saving.");
      return;
    }
    setSaving(true);
    setStatus("Saving your private profile…");
    const { error } = await db
      .from("profiles")
      .update({
        full_name: profile.full_name.trim(),
        phone: profile.phone.trim() || null,
        instagram_handle: profile.instagram_handle.trim() || null,
      })
      .eq("id", session.user.id);
    setSaving(false);
    setStatus(error ? error.message : "Private profile saved.");
  }

  return (
    <section className="panel" aria-labelledby="guardian-profile-heading">
      <span className="eyebrow">Private profile</span>
      <h3 id="guardian-profile-heading">Your Guardian details</h3>
      <p>
        These account details help support your ShelterPawtners experience. They
        are not published on your pet Passport or Marketplace profile.
      </p>
      {loading ? (
        <p role="status">Loading your profile…</p>
      ) : (
        <form className="detail" onSubmit={save}>
          <div className="fields">
            <label>
              Full name
              <input
                value={profile.full_name}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    full_name: event.target.value,
                  }))
                }
                autoComplete="name"
                required
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                value={profile.phone}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                autoComplete="tel"
              />
            </label>
            <label>
              Instagram
              <input
                value={profile.instagram_handle}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    instagram_handle: event.target.value,
                  }))
                }
                placeholder="@username"
              />
            </label>
          </div>
          <button className="btn quiet" disabled={saving}>
            {saving ? "Saving…" : "Save private profile"}
          </button>
          <p role="status" aria-live="polite" aria-atomic="true">
            {status}
          </p>
        </form>
      )}
    </section>
  );
}
