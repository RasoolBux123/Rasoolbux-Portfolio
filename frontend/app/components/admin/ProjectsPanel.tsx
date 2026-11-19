"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "../../lib/adminApi";
import ProjectForm from "./ProjectForm";
import type { Project } from "../../lib/types";

export default function ProjectsPanel({ onChanged }: { onChanged: () => void }) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [adding, setAdding] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null); // delete needs a 2nd click
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setProjects(await api<Project[]>("/projects"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: number) {
    try {
      await api(`/projects/${id}`, { method: "DELETE" });
      setProjects((list) => list?.filter((p) => p.id !== id) ?? null); // update UI instantly
      setConfirmId(null);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  function saved() {
    setAdding(false);
    setEditing(null);
    load();
    onChanged();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-gray-400">These appear on your public portfolio.</p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold"
        >
          <Plus size={16} /> Add project
        </motion.button>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {!projects && !error && <p className="text-gray-500">Loading...</p>}
      {projects?.length === 0 && (
        <p className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-gray-400">No projects yet. Add your first one.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <AnimatePresence>
          {projects?.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="overflow-hidden rounded-2xl border border-white/15 bg-white/5"
            >
              <div className="h-2" style={{ background: `linear-gradient(90deg, ${p.colors[0]}, ${p.colors[1]})` }} />
              <div className="p-5">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-400">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setEditing(p)} className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10">
                    <Pencil size={13} /> Edit
                  </button>
                  {confirmId === p.id ? (
                    <>
                      <button onClick={() => remove(p.id)} className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-semibold hover:bg-red-500">
                        Yes, delete
                      </button>
                      <button onClick={() => setConfirmId(null)} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmId(p.id)} className="flex items-center gap-1.5 rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">
                      <Trash2 size={13} /> Delete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(adding || editing) && <ProjectForm key={editing?.id ?? "new"} project={editing} onClose={() => { setAdding(false); setEditing(null); }} onSaved={saved} />}
      </AnimatePresence>
    </div>
  );
}