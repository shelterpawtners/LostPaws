import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Star,
  Trash2,
} from "lucide-react";
import { supabase as db } from "../lib/supabase";
import "../guardian-social.css";

type PetMedia = {
  id: string;
  media_type: string;
  storage_bucket: string | null;
  storage_path: string | null;
  external_url: string | null;
  external_permalink: string | null;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  provenance_code: string;
  captured_at: string | null;
  created_at: string;
};

type DisplayMedia = PetMedia & { displayUrl: string };
type ArchivedMedia = {
  storage_bucket: string | null;
  storage_path: string | null;
};

const MAX_PASSPORT_PHOTOS = 5;
const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function PetMediaGallery({
  session,
  petId,
  canEdit,
}: {
  session: Session | null;
  petId: string;
  canEdit: boolean;
}) {
  const [media, setMedia] = useState<DisplayMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  const loadMedia = useCallback(async () => {
    if (!db || !session || !petId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await db
      .from("pet_media")
      .select(
        "id,media_type,storage_bucket,storage_path,external_url,external_permalink,caption,alt_text,sort_order,is_primary,provenance_code,captured_at,created_at",
      )
      .eq("pet_id", petId)
      .eq("media_context", "passport")
      .eq("media_type", "image")
      .eq("status", "active")
      .order("sort_order")
      .order("created_at");
    if (error) {
      setLoading(false);
      setStatus(error.message);
      return;
    }
    const resolved = await Promise.all(
      ((data || []) as PetMedia[]).map(async (item) => {
        if (item.storage_bucket && item.storage_path) {
          const { data: signed, error: signedError } = await db!.storage
            .from(item.storage_bucket)
            .createSignedUrl(item.storage_path, 3600);
          return {
            ...item,
            displayUrl: signedError ? "" : signed?.signedUrl || "",
          };
        }
        return { ...item, displayUrl: item.external_url || "" };
      }),
    );
    setMedia(resolved.filter((item) => item.displayUrl));
    setLoading(false);
  }, [petId, session]);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  const nextSortOrder = useMemo(
    () =>
      media.length ? Math.max(...media.map((item) => item.sort_order)) + 10 : 0,
    [media],
  );
  const remainingPhotoSlots = Math.max(MAX_PASSPORT_PHOTOS - media.length, 0);

  async function upload(files: FileList | null) {
    if (!db || !session || !canEdit || !files?.length || uploading) return;
    const selected = Array.from(files);
    if (remainingPhotoSlots === 0) {
      setStatus(
        "This Passport already has 5 photos. Remove one before adding another.",
      );
      return;
    }
    if (selected.length > remainingPhotoSlots) {
      setStatus(
        `You can add ${remainingPhotoSlots} more photo${remainingPhotoSlots === 1 ? "" : "s"}. A Pet Passport can keep up to 5 active photos. No files were uploaded.`,
      );
      return;
    }
    const invalid = selected.find(
      (file) => !imageExtensions[file.type] || file.size > 5 * 1024 * 1024,
    );
    if (invalid) {
      setStatus(
        "Use JPEG, PNG, or WebP images up to 5 MB each. No files were uploaded.",
      );
      return;
    }
    setUploading(true);
    setStatus(
      `Uploading ${selected.length} photo${selected.length === 1 ? "" : "s"}…`,
    );
    let order = nextSortOrder;
    let firstInsertedId = "";
    for (const file of selected) {
      const extension = imageExtensions[file.type];
      const path = `${session.user.id}/${petId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await db.storage
        .from("pet-photos")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        setUploading(false);
        setStatus(`Photo upload stopped. ${uploadError.message}`);
        await loadMedia();
        return;
      }
      const { data: inserted, error: insertError } = await db
        .from("pet_media")
        .insert({
          pet_id: petId,
          created_by: session.user.id,
          media_type: "image",
          media_context: "passport",
          storage_bucket: "pet-photos",
          storage_path: path,
          alt_text: `${file.name} — pet photo`,
          sort_order: order,
          visibility: "private",
          provenance_code: "guardian_entered",
          status: "active",
        })
        .select("id")
        .single();
      if (insertError || !inserted) {
        await db.storage.from("pet-photos").remove([path]);
        setUploading(false);
        setStatus(insertError?.message || "Unable to save photo metadata.");
        await loadMedia();
        return;
      }
      if (!firstInsertedId) firstInsertedId = inserted.id;
      order += 10;
    }
    let primaryWarning = "";
    if (!media.some((item) => item.is_primary) && firstInsertedId) {
      const { error } = await db.rpc("set_primary_pet_media", {
        p_media_id: firstInsertedId,
      });
      if (error)
        primaryWarning = ` Primary photo could not be set: ${error.message}`;
    }
    setUploading(false);
    setStatus(
      `${selected.length} photo${selected.length === 1 ? "" : "s"} added.${primaryWarning}`,
    );
    await loadMedia();
  }

  async function makePrimary(id: string) {
    if (!db || !canEdit) return;
    const { error } = await db.rpc("set_primary_pet_media", { p_media_id: id });
    setStatus(error ? error.message : "Primary photo updated.");
    if (!error) await loadMedia();
  }

  async function move(index: number, direction: -1 | 1) {
    if (!db || !canEdit) return;
    const target = index + direction;
    if (target < 0 || target >= media.length) return;
    const reordered = [...media];
    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];
    const { error } = await db.rpc("reorder_pet_media", {
      p_pet_id: petId,
      p_media_ids: reordered.map((item) => item.id),
    });
    setStatus(error ? error.message : "Photo order updated.");
    if (!error) await loadMedia();
  }

  async function removePhoto(item: DisplayMedia) {
    if (!db || !canEdit) return;
    setStatus("Removing photo…");
    const { data, error } = await db.rpc("archive_pet_media", {
      p_media_id: item.id,
    });
    if (error) {
      setStatus(error.message);
      return;
    }

    const archived = (Array.isArray(data) ? data[0] : null) as
      ArchivedMedia | undefined;
    let storageWarning = "";
    if (archived?.storage_bucket && archived.storage_path) {
      const { error: storageError } = await db.storage
        .from(archived.storage_bucket)
        .remove([archived.storage_path]);
      if (storageError) {
        storageWarning =
          " The photo is off the Passport, but its stored file could not be cleaned up yet.";
      }
    }
    setStatus(`Photo removed.${storageWarning}`);
    await loadMedia();
  }

  return (
    <section
      className="panel petMediaPanel"
      aria-labelledby="pet-photos-heading"
    >
      <div className="petMediaHeader">
        <div>
          <span className="eyebrow">Pet photos</span>
          <h2 id="pet-photos-heading">Passport gallery</h2>
          <p>
            Keep up to 5 recognizable photos with this Passport. Photos are
            private by default and can later carry source information from
            approved imports.
          </p>
        </div>
        {canEdit && (
          <label className="btn quiet petMediaUpload">
            <ImagePlus />
            {media.length >= MAX_PASSPORT_PHOTOS
              ? "5 photo limit reached"
              : uploading
                ? "Uploading…"
                : `Add photos (${remainingPhotoSlots} left)`}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={uploading || media.length >= MAX_PASSPORT_PHOTOS}
              onChange={(event) => {
                void upload(event.target.files);
                event.currentTarget.value = "";
              }}
            />
          </label>
        )}
      </div>

      {loading ? (
        <p role="status">Loading pet photos…</p>
      ) : media.length ? (
        <div className="petMediaGrid" aria-label="Pet photo gallery">
          {media.map((item, index) => (
            <article className="petMediaCard" key={item.id}>
              <div className="petMediaImageWrap">
                <img
                  src={item.displayUrl}
                  alt={item.alt_text || item.caption || "Pet photo"}
                  loading="lazy"
                />
                {item.is_primary && (
                  <span className="petMediaPrimary">
                    <Star /> Primary
                  </span>
                )}
              </div>
              {item.caption && <p>{item.caption}</p>}
              <small>
                {item.provenance_code === "external_import"
                  ? "Imported photo"
                  : item.provenance_code === "shelter_entered" ||
                      item.provenance_code === "shelter_verified"
                    ? "Shelter photo"
                    : "Guardian photo"}
              </small>
              {canEdit && (
                <div className="petMediaActions">
                  {!item.is_primary && (
                    <button
                      type="button"
                      className="textButton"
                      onClick={() => void makePrimary(item.id)}
                    >
                      Make primary
                    </button>
                  )}
                  <button
                    type="button"
                    className="iconButton"
                    onClick={() => void move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move photo ${index + 1} earlier`}
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    type="button"
                    className="iconButton"
                    onClick={() => void move(index, 1)}
                    disabled={index === media.length - 1}
                    aria-label={`Move photo ${index + 1} later`}
                  >
                    <ChevronRight />
                  </button>
                  <button
                    type="button"
                    className="iconButton"
                    onClick={() => void removePhoto(item)}
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    <Trash2 />
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="petMediaEmpty">
          <ImagePlus />
          <div>
            <b>Add the photos people recognize fastest.</b>
            <p>
              Start with a clear face or full-body photo. You can keep up to 5
              and choose the primary Passport image.
            </p>
          </div>
        </div>
      )}
      <p role="status" aria-live="polite" aria-atomic="true">
        {status}
      </p>
    </section>
  );
}
