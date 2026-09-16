import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { supabase as db } from "../lib/supabase";

const BUCKET = "event-offer-media";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Uploads a single cover photo to the event-offer-media bucket at
 * {ownerId}/{recordId}/cover.<ext>, always upserting so re-uploading
 * replaces the previous file rather than leaving orphans. ownerId is the
 * offer/event's organization_id, or for an organization-less event, the
 * current user's own id (matching events_update's own fallback rule).
 * Storage RLS enforces that only a manager of that organization, or that
 * same user for their own id, may write that path -- see
 * 20260916070000_issue_283_event_offer_media_storage.sql -- so this
 * component does not need to duplicate that authorization check, only
 * surface whatever error the policy produces.
 *
 * recordId must already exist (the offer/event must be saved at least once)
 * since the path is keyed on it; disabled until then.
 */
export function MediaUpload({
  ownerId,
  recordId,
  value,
  onChange,
}: {
  ownerId: string;
  recordId: string;
  value: string;
  onChange: (path: string) => void;
}) {
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canUpload = Boolean(db && ownerId && recordId);
  const publicUrl =
    value && db
      ? db.storage.from(BUCKET).getPublicUrl(value).data.publicUrl
      : "";

  async function handleFile(file: File | undefined) {
    if (!file || !db || !canUpload) return;
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      setStatus("Only JPEG, PNG, or WEBP images are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setStatus("Image must be 5MB or smaller.");
      return;
    }
    setUploading(true);
    setStatus("Uploading…");
    const path = `${ownerId}/${recordId}/cover.${ext}`;
    const { error } = await db.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });
    setUploading(false);
    if (error) {
      setStatus(`Could not upload that photo. ${error.message}`);
      return;
    }
    setStatus("Photo uploaded.");
    onChange(path);
  }

  return (
    <div className="mediaUpload">
      {publicUrl && (
        <img className="mediaUploadPreview" src={publicUrl} alt="" />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={!canUpload || uploading}
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      {!canUpload && (
        <p className="mediaUploadHint">Save once first, then upload a photo.</p>
      )}
      {status &&
        // role="status" only while there is something worth an
        // aria-live announcement (in progress, or an error to notice).
        // The persistent "Photo uploaded." success message drops the role
        // once uploading settles -- this component nests inside forms that
        // already carry their own role="status" save banner, and an
        // indefinitely-lingering second one made a bare
        // page.getByRole("status") ambiguous everywhere this mounts.
        (uploading || status !== "Photo uploaded." ? (
          <p className="mediaUploadStatus" role="status" aria-live="polite">
            {uploading ? <ImagePlus aria-hidden="true" /> : null} {status}
          </p>
        ) : (
          <p className="mediaUploadStatus">{status}</p>
        ))}
    </div>
  );
}
