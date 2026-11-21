"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { api, uploadFile } from "../../lib/adminApi";
import { assetUrl } from "../../lib/config";
import { resizeImage } from "../../lib/resizeImage";

// Pick a picture -> it is shrunk in the browser -> uploaded -> preview updates.
export default function ImageUpload({
  fileKey,
  current,
  fallback,
  maxWidth = 1600,
  round = false,
  onChange,
}: {
  fileKey: string; // "photo" or "project-3"
  current: string; // uploaded image URL ("" = none uploaded yet)
  fallback?: string; // picture to preview while nothing is uploaded (e.g. the default photo)
  maxWidth?: number;
  round?: boolean;
  onChange?: () => void;
}) {
  const [url, setUrl] = useState(current);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allows choosing the same file again later
    if (!file) return;

    setError("");
    if (!file.type.startsWith("image/")) return setError("Please choose an image (JPG, PNG or WebP)");

    setBusy(true);
    try {
      let blob: Blob;
      try {
        blob = await resizeImage(file, maxWidth);
      } catch {
        throw new Error("This image format is not supported. Use JPG, PNG or WebP.");
      }
      setUrl(await uploadFile(fileKey, blob));
      onChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setError("");
    try {
      await api(`/files/${fileKey}`, { method: "DELETE" });
      setUrl("");
      onChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  const shown = url || fallback || "";

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className={`flex shrink-0 items-center justify-center overflow-hidden border border-white/15 bg-white/5 ${round ? "h-24 w-24 rounded-full" : "h-24 w-40 rounded-xl"}`}>
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={assetUrl(shown)} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="text-gray-500" />
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <input ref={inputRef} type="file" accept="image/*" onChange={pick} className="hidden" />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-60"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            {url ? "Change" : "Upload"}
          </button>
          {url && (
            <button
              type="button"
              disabled={busy}
              onClick={remove}
              className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm text-red-300 hover:bg-white/10 disabled:opacity-60"
            >
              <Trash2 size={16} /> Remove
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}