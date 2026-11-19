"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { api, ApiError } from "../../lib/adminApi";
import type { Project } from "../../lib/types";

const inputCls =
  "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-indigo-400 focus:bg-white/10";

export default function ProjectForm({
  project,
  onClose,
  onSaved,
}: {
  project: Project | null; // null = adding a new project
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [tech, setTech] = useState(project?.tech.join(", ") ?? "");
  const [c1, setC1] = useState(project?.colors[0] ?? "#4f46e5");
  const [c2, setC2] = useState(project?.colors[1] ?? "#9333ea");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError("");

    const body = JSON.stringify({ title, description, tech, colors: [c1, c2] });
    try {
      if (project) await api(`/projects/${project.id}`, { method: "PUT", body });
      else await api("/projects", { method: "POST", body });
      onSaved();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fields ?? {});
        if (!err.fields) setFormError(err.message);
      }
      setSaving(false);
    }
  }

  const border = (f: string) => (errors[f] ? "border-red-400/70" : "border-white/15");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
    >
      <motion.form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        noValidate
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-3xl border border-white/15 bg-[#121933] p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{project ? "Edit project" : "Add project"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <div>
          <input className={`${inputCls} ${border("title")}`} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
          {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
        </div>

        <div>
          <textarea className={`${inputCls} resize-none ${border("description")}`} rows={3} placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} />
          {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
        </div>

        <div>
          <input className={`${inputCls} ${border("tech")}`} placeholder="Technologies, separated by commas" value={tech} onChange={(e) => setTech(e.target.value)} />
          {errors.tech && <p className="mt-1 text-xs text-red-400">{errors.tech}</p>}
        </div>

        <div>
          <p className="mb-2 text-xs text-gray-400">Card colors</p>
          <div className="flex items-center gap-3">
            <input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-white/15 bg-transparent" />
            <input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-white/15 bg-transparent" />
            <div className="h-10 flex-1 rounded-lg" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }} />
          </div>
          {errors.colors && <p className="mt-1 text-xs text-red-400">{errors.colors}</p>}
        </div>

        {formError && <p className="text-sm text-red-400">{formError}</p>}

        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="rounded-xl border border-white/15 px-5 py-2.5 text-sm hover:bg-white/10">
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={saving}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : project ? "Save changes" : "Add project"}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}