"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { api } from "../../lib/adminApi";
import SaveButton, { type SaveState } from "./SaveButton";
import type { Profile } from "../../lib/types";

// the items are edited as one comma-separated text: "Next.js, React, TypeScript"
type Group = { group: string; items: string };

const inputCls =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-indigo-400 focus:bg-white/10";

const chips = (text: string) => text.split(",").map((s) => s.trim()).filter(Boolean);

function move<T>(list: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const copy = [...list];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

export default function SkillsPanel() {
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    api<Profile>("/portfolio").then((d) => setGroups(d.skills.map((s) => ({ group: s.group, items: s.items.join(", ") }))));
  }, []);

  async function save() {
    setState("saving");
    setError("");
    try {
      await api("/skills", { method: "PUT", body: JSON.stringify(groups) });
      setState("saved");
      setTimeout(() => setState("idle"), 2000);
    } catch (e) {
      setState("error");
      setError(e instanceof Error ? e.message : "Save failed");
    }
  }

  const update = (i: number, patch: Partial<Group>) => setGroups((l) => l?.map((x, k) => (k === i ? { ...x, ...patch } : x)) ?? null);

  if (!groups) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">Each group becomes a card in your Skills section.</p>
        <button
          onClick={() => setGroups((l) => [...(l ?? []), { group: "", items: "" }])}
          className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10"
        >
          <Plus size={14} /> Add group
        </button>
      </div>

      {groups.length === 0 && <p className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-gray-400">No skill groups. The Skills section will show an empty message.</p>}

      <AnimatePresence initial={false}>
        {groups.map((g, i) => (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 md:grid-cols-[1fr_auto]"
          >
            <div className="space-y-3">
              <input className={inputCls} placeholder="Group name (Frontend, Backend...)" value={g.group} onChange={(e) => update(i, { group: e.target.value })} maxLength={40} />
              <input className={inputCls} placeholder="Skills, separated by commas" value={g.items} onChange={(e) => update(i, { items: e.target.value })} />
              <div className="flex flex-wrap gap-1.5">
                {chips(g.items).map((c, k) => (
                  <span key={k} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-gray-300">{c}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-1 md:flex-col">
              <button aria-label="Move up" onClick={() => setGroups((l) => (l ? move(l, i, -1) : l))} className="rounded-lg border border-white/15 p-2 hover:bg-white/10"><ArrowUp size={14} /></button>
              <button aria-label="Move down" onClick={() => setGroups((l) => (l ? move(l, i, 1) : l))} className="rounded-lg border border-white/15 p-2 hover:bg-white/10"><ArrowDown size={14} /></button>
              <button aria-label="Remove" onClick={() => setGroups((l) => l?.filter((_, k) => k !== i) ?? null)} className="rounded-lg border border-red-400/30 p-2 text-red-300 hover:bg-red-500/10"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex items-center gap-4 pt-2">
        <SaveButton state={state} onClick={save} label="Save skills" />
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    </div>
  );
}