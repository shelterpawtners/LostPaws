import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { Camera, UserRound } from "lucide-react";
import { supabase as db } from "../lib/supabase";
import { GuardianActivityTimeline } from "./GuardianActivityTimeline";
import { GuardianGivingHistory } from "./giving/GuardianGivingHistory";
import "../guardian-profile-lite.css";

type ProfileLite = {
  full_name: string;
  phone: string;
  instagram_handle: string;
  avatar_path: string;
};

const emptyProfile: ProfileLite = {
  full_name: "",
  phone: "",
  instagram_handle: "",
  avatar_path: "",
};

const avatarTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function GuardianProfileLite({ session }: { session: Session | null }) {
  const [profile, setProfile] = useState<ProfileLite>(emptyProfile);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const client = db;
    if (!client || !session) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void client
      .from("profiles")
      .select("full_name,phone,instagram_handle,avatar_path")
      .eq("id", session.user.id)
      .single()
      .then(async ({ data, error }) => {
        setLoading(false);
        if (error || !data) {
          setStatus(error?.message || "Unable to load your private profile.");
          return;
        }
        const nextProfile = {
          full_name: data.full_name || "",
          phone: data.phone || "",
          instagram_handle: data.instagram_handle || "",
          avatar_path: data.avatar_path || "",
        };
        setProfile(nextProfile);
        if (!nextProfile.avatar_path) {
          setAvatarUrl("");
          return;
        }
        const { data: signed, error: signedError } = await client.storage
          .from("profile-avatars")
          .createSignedUrl(nextProfile.avatar_path, 3600);
        setAvatarUrl(signedError ? "" : signed?.signedUrl || "");
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

  async function uploadAvatar(files: FileList | null) {
    if (!db || !session || !files?.length || uploadingAvatar) return;
    const file = files[0];
    const extension = avatarTypes[file.type];
    if (!extension || file.size > 5 * 1024 * 1024) {
      setStatus("Use a JPEG, PNG, or WebP profile photo up to 5 MB.");
      return;
    }
    setUploadingAvatar(true);
    setStatus("Updating your profile photo…");
    const path = `${session.user.id}/avatar.${extension}`;
    const { error: uploadError } = await db.storage
      .from("profile-avatars")
      .upload(path, file, { cacheControl: "3600", upsert: true });
    if (uploadError) {
      setUploadingAvatar(false);
      setStatus(uploadError.message);
      return;
    }
    const { error: profileError } = await db
      .from("profiles")
      .update({ avatar_path: path })
      .eq("id", session.user.id);
    if (profileError) {
      setUploadingAvatar(false);
      setStatus(profileError.message);
      return;
    }
    const { data: signed, error: signedError } = await db.storage
      .from("profile-avatars")
      .createSignedUrl(path, 3600);
    setUploadingAvatar(false);
    setProfile((current) => ({ ...current, avatar_path: path }));
    setAvatarUrl(signedError ? "" : signed?.signedUrl || "");
    setStatus(
      signedError
        ? "Profile photo saved. Refresh if the preview does not appear yet."
        : "Profile photo updated.",
    );
  }

  return (
    <>
      <section className="panel" aria-labelledby="guardian-profile-heading">
        <span className="eyebrow">Private profile</span>
        <h3 id="guardian-profile-heading">Your Guardian details</h3>
        <p>
          These account details help support your ShelterPawtners experience.
          They are not published on your pet Passport or Marketplace profile.
        </p>
        {loading ? (
          <p role="status">Loading your profile…</p>
        ) : (
          <form className="detail" onSubmit={save}>
            <div className="guardianProfileIdentity">
              <div
                className="guardianProfileAvatar"
                aria-label="Guardian profile photo"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${profile.full_name || "Guardian"} profile`}
                  />
                ) : (
                  <UserRound aria-hidden="true" />
                )}
              </div>
              <label className="guardianAvatarUpload">
                <Camera aria-hidden="true" />
                <span>
                  {uploadingAvatar ? "Uploading…" : "Choose profile photo"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={uploadingAvatar}
                  onChange={(event) => void uploadAvatar(event.target.files)}
                />
              </label>
              <small>
                JPEG, PNG, or WebP up to 5 MB. Private to your account.
              </small>
            </div>
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
      <section className="panel">
        <span className="eyebrow">Support</span>
        <h3>Need help with something?</h3>
        <p>
          Report a problem, ask a question, or send an idea. Your requests are
          tracked with a reference code.
        </p>
        <Link className="btn quiet" to="/support">
          Go to Help &amp; support
        </Link>
      </section>
      <GuardianGivingHistory session={session} />
      <GuardianActivityTimeline session={session} />
    </>
  );
}
