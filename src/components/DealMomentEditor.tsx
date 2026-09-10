import { useCallback, useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Camera, ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { supabase as db } from "../lib/supabase";
import "../guardian-social.css";
import "../deal-moments.css";

type DealMoment = {
  id: string;
  storage_bucket: string | null;
  storage_path: string | null;
  caption: string | null;
  alt_text: string | null;
};

type UpsertResult = {
  media_id: string;
  old_storage_bucket: string | null;
  old_storage_path: string | null;
};

const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 1024 * 1024;
const MAX_EDGE = 1600;

async function canvasToWebp(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("This browser could not prepare the photo."));
      },
      "image/webp",
      quality,
    );
  });
}

async function optimizeDealMoment(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose a JPEG, PNG, or WebP photo.");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("Choose a source photo smaller than 10 MB.");
  }

  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("This browser could not prepare the photo.");
    context.drawImage(bitmap, 0, 0, width, height);

    for (const quality of [0.84, 0.76, 0.68, 0.6, 0.52]) {
      const blob = await canvasToWebp(canvas, quality);
      if (blob.size <= MAX_OUTPUT_BYTES) return blob;
    }
  } finally {
    bitmap.close();
  }

  throw new Error(
    "That photo is still larger than 1 MB after optimization. Try a simpler or smaller image.",
  );
}

export function DealMomentEditor({
  session,
  claimId,
  petName,
}: {
  session: Session | null;
  claimId: string;
  petName: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [moment, setMoment] = useState<DealMoment | null>(null);
  const [displayUrl, setDisplayUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const loadMoment = useCallback(async () => {
    if (!db || !session || !claimId) return;
    const { data, error } = await db
      .from("pet_media")
      .select("id,storage_bucket,storage_path,caption,alt_text")
      .eq("claim_id", claimId)
      .eq("media_context", "deal_moment")
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      setStatus(error.message);
      return;
    }

    const next = (data as DealMoment | null) || null;
    setMoment(next);
    setCaption(next?.caption || "");
    setDisplayUrl("");
    if (next?.storage_bucket && next.storage_path) {
      const { data: signed, error: signedError } = await db.storage
        .from(next.storage_bucket)
        .createSignedUrl(next.storage_path, 3600);
      if (!signedError) setDisplayUrl(signed?.signedUrl || "");
    }
  }, [claimId, session]);

  useEffect(() => {
    void loadMoment();
  }, [loadMoment]);

  async function save(file: File | undefined) {
    if (!db || !session || !file || busy) return;
    setBusy(true);
    setStatus("Preparing your Deal Moment…");
    let newPath = "";
    try {
      const optimized = await optimizeDealMoment(file);
      newPath = `${session.user.id}/${claimId}/${crypto.randomUUID()}.webp`;
      const { error: uploadError } = await db.storage
        .from("deal-moments")
        .upload(newPath, optimized, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: false,
        });
      if (uploadError) throw uploadError;

      const { data, error } = await db.rpc("upsert_deal_moment", {
        p_claim_id: claimId,
        p_storage_path: newPath,
        p_caption: caption.trim() || null,
        p_alt_text: `${petName || "Pet"} enjoying a claimed deal`,
      });
      if (error) throw error;

      const result = (Array.isArray(data) ? data[0] : null) as
        | UpsertResult
        | undefined;
      if (result?.old_storage_bucket && result.old_storage_path) {
        const { error: cleanupError } = await db.storage
          .from(result.old_storage_bucket)
          .remove([result.old_storage_path]);
        setStatus(
          cleanupError
            ? "Deal Moment updated. The previous stored file could not be cleaned up yet."
            : "Deal Moment updated.",
        );
      } else {
        setStatus("Deal Moment added.");
      }
      await loadMoment();
    } catch (error) {
      if (newPath) {
        await db.storage.from("deal-moments").remove([newPath]);
      }
      setStatus(
        error instanceof Error ? error.message : "Unable to save photo.",
      );
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove() {
    if (!db || !moment || busy) return;
    setBusy(true);
    setStatus("Removing Deal Moment…");
    try {
      const { data, error } = await db.rpc("archive_pet_media", {
        p_media_id: moment.id,
      });
      if (error) throw error;
      const archived = (Array.isArray(data) ? data[0] : null) as
        | { storage_bucket: string | null; storage_path: string | null }
        | undefined;
      if (archived?.storage_bucket && archived.storage_path) {
        const { error: cleanupError } = await db.storage
          .from(archived.storage_bucket)
          .remove([archived.storage_path]);
        setStatus(
          cleanupError
            ? "Deal Moment removed from your timeline. Its stored file could not be cleaned up yet."
            : "Deal Moment removed.",
        );
      } else {
        setStatus("Deal Moment removed.");
      }
      await loadMoment();
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to remove photo.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dealMoment" aria-label="Deal Moment">
      <div className="dealMomentIntro">
        <Camera aria-hidden="true" />
        <div>
          <b>
            {moment ? "Your Deal Moment" : "Show us your pet enjoying the deal"}
          </b>
          <p>
            Add one optional photo to this activity. It stays private to your
            account and does not use a Pet Passport photo slot.
          </p>
        </div>
      </div>

      {displayUrl && (
        <img
          className="dealMomentImage"
          src={displayUrl}
          alt={moment?.alt_text || `${petName || "Pet"} Deal Moment`}
        />
      )}

      <label className="dealMomentCaption">
        <span>
          Caption <small>optional · 280 characters</small>
        </span>
        <textarea
          value={caption}
          maxLength={280}
          rows={2}
          disabled={busy}
          placeholder="What made this a good moment?"
          onChange={(event) => setCaption(event.target.value)}
        />
      </label>

      <div className="dealMomentActions">
        <label className="btn quiet dealMomentUpload">
          {moment ? (
            <RefreshCw aria-hidden="true" />
          ) : (
            <ImagePlus aria-hidden="true" />
          )}
          {busy ? "Working…" : moment ? "Replace photo" : "Add Deal Moment"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            onChange={(event) => void save(event.currentTarget.files?.[0])}
          />
        </label>
        {moment && (
          <button
            type="button"
            className="textButton dealMomentRemove"
            disabled={busy}
            onClick={() => void remove()}
          >
            <Trash2 aria-hidden="true" /> Remove
          </button>
        )}
      </div>
      <p className="dealMomentStatus" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
