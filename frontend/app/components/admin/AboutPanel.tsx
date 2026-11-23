"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { api, ApiError } from "../../lib/adminApi";
import SaveButton, { type SaveState } from "./SaveButton";
import type { Profile } from "../../lib/types";

// tech is edited as one comma separated text box ("Next.js, FastAPI")
type Entry = { year: string; title: string; detail: string; current: boolean; tech: string };

const inputCls =
  "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-indigo-400 focus:bg-white/10";

// move item i up (-1) or down (+1)
function move<T>(list: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const copy = [...list];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

export default function AboutPanel() {
  const [loaded, setLoaded] = useState(false);
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [profileState, setProfileState] = useState<SaveState>("idle");
  const [profileError, setProfileError] = useState("");

  const [entries, setEntries] = useState<Entry[]>([]);
  const [expState, setExpState] = useState<SaveState>("idle");
  const [expError, setExpError] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nowText, setNowText] = useState("");
  useEffect(() => {
    api<Profile>("/portfolio").then((d) => {
      setRole(d.profile.role);
      setLocation(d.profile.location);
      setAbout(d.profile.about);
      setEmail(d.contact.email);
      setGithub(d.contact.github);
      setLinkedin(d.contact.linkedin);
      setWhatsapp(d.contact.whatsapp || "");
      setEntries(d.experience.map((e) => ({ year: e.year, title: e.title, detail: e.detail, current: !!e.current, tech: (e.tech ?? []).join(", ") })));
      setLoaded(true);
      setNowText(d.now?.text ?? "");
    });
  }, []);

  async function saveProfile() {
    setProfileState("saving");
    setFieldErrors({});
    setProfileError("");
    try {
      await api("/profile", { method: "PUT", body: JSON.stringify({ role, location, about, email, github, linkedin , whatsapp ,now: nowText}) });
      setProfileState("saved");
      setTimeout(() => setProfileState("idle"), 2000);
    } catch (e) {
      setProfileState("error");
      if (e instanceof ApiError) {
        setFieldErrors(e.fields ?? {});
        if (!e.fields) setProfileError(e.message);
      }
    }
  }

  async function saveExperience() {
    setExpState("saving");
    setExpError("");
    try {
      await api("/experience", { method: "PUT", body: JSON.stringify(entries) });
      setExpState("saved");
      setTimeout(() => setExpState("idle"), 2000);
    } catch (e) {
      setExpState("error");
      setExpError(e instanceof Error ? e.message : "Save failed");
    }
  }

  const update = (i: number, patch: Partial<Entry>) => setEntries((l) => l.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  const border = (f: string) => (fieldErrors[f] ? "border-red-400/70" : "border-white/15");
  const err = (f: string) => fieldErrors[f] && <p className="mt-1 text-xs text-red-400">{fieldErrors[f]}</p>;

  if (!loaded) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-10">
      {/* ---------- about + contact ---------- */}
      <section className="space-y-4 rounded-3xl border border-white/15 bg-white/5 p-6">
        <h2 className="font-semibold">About and contact details</h2>

        <div className="grid gap-4 md:grid-cols-2">
                  <div>
          <label className="mb-1 block text-xs text-gray-400">
            Right now, what are you working on? ({nowText.length}/140) — leave empty to hide the card
          </label>
          <input
            className={`${inputCls} ${border("now")}`}
            value={nowText}
            onChange={(e) => setNowText(e.target.value)}
            maxLength={140}
            placeholder="Learning DevOps and building analytics for my portfolio"
          />
          {err("now")}
        </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Role</label>
            <input className={`${inputCls} ${border("role")}`} value={role} onChange={(e) => setRole(e.target.value)} maxLength={100} />
            {err("role")}
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Location</label>
            <input className={`${inputCls} ${border("location")}`} value={location} onChange={(e) => setLocation(e.target.value)} maxLength={100} />
            {err("location")}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-400">About text ({about.length}/1000)</label>
          <textarea className={`${inputCls} resize-y ${border("about")}`} rows={5} value={about} onChange={(e) => setAbout(e.target.value)} maxLength={1000} />
          {err("about")}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Email</label>
            <input className={`${inputCls} ${border("email")}`} value={email} onChange={(e) => setEmail(e.target.value)} />
            {err("email")}
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">GitHub link</label>
            <input className={`${inputCls} ${border("github")}`} value={github} onChange={(e) => setGithub(e.target.value)} />
            {err("github")}
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">LinkedIn link</label>
            <input className={`${inputCls} ${border("linkedin")}`} value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            {err("linkedin")}
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">WhatsApp number</label>
            <input className={`${inputCls} ${border("whatsapp")}`} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            {err("whatsapp")} 
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SaveButton state={profileState} onClick={saveProfile} />
          {profileError && <span className="text-sm text-red-400">{profileError}</span>}
        </div>
      </section>

      {/* ---------- timeline ---------- */}
      <section className="space-y-4 rounded-3xl border border-white/15 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Timeline</h2>
            <p className="text-xs text-gray-400">Shown under your About text. Top entry shows first.</p>
          </div>
          <button
           onClick={() => setEntries((l) => [...l, { year: "", title: "", detail: "", current: false, tech: "" }])}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10"
          >
            <Plus size={14} /> Add entry
          </button>
        </div>

        {entries.length === 0 && <p className="text-sm text-gray-500">No entries. The timeline will be hidden on your site.</p>}

        {entries.map((e, i) => (
          <motion.div key={i} layout className="grid gap-3 rounded-2xl border border-white/10 p-4 md:grid-cols-[140px_1fr_auto]">
            <input className={`${inputCls} border-white/15`} placeholder="Label (Present, 2025...)" value={e.year} onChange={(ev) => update(i, { year: ev.target.value })} maxLength={30} />
            <div className="space-y-3">
             <input className={`${inputCls} border-white/15`} placeholder="Tech, comma separated (Next.js, FastAPI)" value={e.tech} onChange={(ev) => update(i, { tech: ev.target.value })} />
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input type="checkbox" checked={e.current} onChange={(ev) => update(i, { current: ev.target.checked })} className="h-4 w-4 accent-emerald-400" />
                This is my current job (shows the green "Current" badge)
              </label>
              <input className={`${inputCls} border-white/15`} placeholder="Title" value={e.title} onChange={(ev) => update(i, { title: ev.target.value })} maxLength={100} />
              <input className={`${inputCls} border-white/15`} placeholder="Short detail" value={e.detail} onChange={(ev) => update(i, { detail: ev.target.value })} maxLength={200} />
            </div>
            <div className="flex gap-1 md:flex-col">
              <button aria-label="Move up" onClick={() => setEntries((l) => move(l, i, -1))} className="rounded-lg border border-white/15 p-2 hover:bg-white/10"><ArrowUp size={14} /></button>
              <button aria-label="Move down" onClick={() => setEntries((l) => move(l, i, 1))} className="rounded-lg border border-white/15 p-2 hover:bg-white/10"><ArrowDown size={14} /></button>
              <button aria-label="Remove" onClick={() => setEntries((l) => l.filter((_, k) => k !== i))} className="rounded-lg border border-red-400/30 p-2 text-red-300 hover:bg-red-500/10"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}

        <div className="flex items-center gap-4">
          <SaveButton state={expState} onClick={saveExperience} label="Save timeline" />
          {expError && <span className="text-sm text-red-400">{expError}</span>}
        </div>
      </section>
    </div>
  );
}