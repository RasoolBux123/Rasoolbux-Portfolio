"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import { api, uploadFile } from "../../lib/adminApi";
import { assetUrl } from "../../lib/config";
import ImageUpload from "./ImageUpload";
import type { Profile } from "../../lib/types";

export default function MediaPanel() {
  const [data, setData] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const [cvError, setCvError] = useState("");
  
  const cvInput = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      setData(await api<Profile>("/portfolio"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function pickCv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setCvError("");
    if (file.type !== "application/pdf") return setCvError("CV must be a PDF file");
    if (file.size > 4 * 1024 * 1024) return setCvError("PDF is too large (max 4 MB)");

    setCvBusy(true);
    try {
      await uploadFile("cv", file);
      await load();
    } catch (err) {
      setCvError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setCvBusy(false);
    }
  }

  async function removeCv() {
    setCvBusy(true);
    setCvError("");
    try {
      await api("/files/cv", { method: "DELETE" });
      await load();
    } catch (err) {
      setCvError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setCvBusy(false);
    }
  }

  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!data) return <p className="text-gray-500">Loading...</p>;

  const uploadedPhoto = data.photoUrl.startsWith("/api/") ? data.photoUrl : "";
  const uploadedCv = data.resumeUrl.startsWith("/api/");

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/15 bg-white/5 p-5">
        <h2 className="font-semibold">Profile photo</h2>
        <p className="mb-4 mt-1 text-sm text-gray-400">Shown in the hero section. Big photos are shrunk automatically.</p>
        <ImageUpload fileKey="photo" current={uploadedPhoto} fallback={data.photoUrl} maxWidth={1000} round />
      </section>

      <section className="rounded-2xl border border-white/15 bg-white/5 p-5">
        <h2 className="font-semibold">CV / Resume</h2>
        <p className="mb-4 mt-1 text-sm text-gray-400">The "Download CV" button and the chatbot use this PDF.</p>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={assetUrl(data.resumeUrl)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
          >
            <FileText size={16} /> {uploadedCv ? "Open uploaded CV" : "Open current CV (default file)"}
          </a>

          <input ref={cvInput} type="file" accept="application/pdf" onChange={pickCv} className="hidden" />
          <button
            type="button"
            disabled={cvBusy}
            onClick={() => cvInput.current?.click()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {cvBusy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploadedCv ? "Replace CV" : "Upload CV"}
          </button>

          {uploadedCv && (
            <button
              type="button"
              disabled={cvBusy}
              onClick={removeCv}
              className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm text-red-300 hover:bg-white/10 disabled:opacity-60"
            >
              <Trash2 size={16} /> Remove (use default)
            </button>
          )}
        </div>
        {cvError && <p className="mt-3 text-xs text-red-400">{cvError}</p>}
      </section>

      <p className="text-xs text-gray-500">Project pictures are changed inside Projects: open a project with Edit.</p>
    </div>
  );
}