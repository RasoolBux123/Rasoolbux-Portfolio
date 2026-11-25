"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api, ApiError } from "../../lib/adminApi";
import SaveButton, { type SaveState } from "./SaveButton";
import ImageUpload from "./ImageUpload";
import type { Certificate, Education, Profile } from "../../lib/types";

const inputCls =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-indigo-400 focus:bg-white/10";

// ---------- one certificate card: edit text, upload image, delete ----------
function CertCard({ cert, onSaved, onDeleted }: { cert: Certificate; onSaved: (c: Certificate) => void; onDeleted: () => void }) {
  const [title, setTitle] = useState(cert.title);
  const [issuer, setIssuer] = useState(cert.issuer);
  const [year, setYear] = useState(cert.year);
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);

  async function save() {
    setState("saving");
    setError("");
    try {
      onSaved(await api<Certificate>(`/certificates/${cert.id}`, { method: "PUT", body: JSON.stringify({ title, issuer, year }) }));
      setState("saved");
      setTimeout(() => setState("idle"), 2000);
    } catch (e) {
      setState("error");
      setError(e instanceof ApiError && e.fields ? Object.values(e.fields)[0] : e instanceof Error ? e.message : "Save failed");
    }
  }

  async function remove() {
    try {
      await api(`/certificates/${cert.id}`, { method: "DELETE" });
      onDeleted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 p-4">
      <ImageUpload fileKey={`cert-${cert.id}`} current={cert.image} maxWidth={1600} />
      <input className={inputCls} placeholder="Title (Full Stack Bootcamp)" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input className={inputCls} placeholder="Issuer (Xloop Digital)" value={issuer} onChange={(e) => setIssuer(e.target.value)} maxLength={100} />
        <input className={inputCls} placeholder="Year (2026)" value={year} onChange={(e) => setYear(e.target.value)} maxLength={20} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <SaveButton state={state} onClick={save} />
        <button
          onClick={() => (confirm ? remove() : setConfirm(true))}
          onBlur={() => setConfirm(false)}
          className="flex items-center gap-1.5 rounded-xl border border-red-400/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
        >
          <Trash2 size={14} /> {confirm ? "Click again to delete" : "Delete"}
        </button>
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    </div>
  );
}

export default function CredentialsPanel() {
  const [loaded, setLoaded] = useState(false);
  const [edu, setEdu] = useState<Education[]>([]);
  const [eduState, setEduState] = useState<SaveState>("idle");
  const [eduError, setEduError] = useState("");

  const [certs, setCerts] = useState<Certificate[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [addError, setAddError] = useState("");

  useEffect(() => {
    api<Profile>("/portfolio").then((d) => {
      setEdu(d.education ?? []);
      setCerts(d.certificates ?? []);
      setLoaded(true);
    });
  }, []);

  async function saveEdu() {
    setEduState("saving");
    setEduError("");
    try {
      await api("/education", { method: "PUT", body: JSON.stringify(edu) });
      setEduState("saved");
      setTimeout(() => setEduState("idle"), 2000);
    } catch (e) {
      setEduState("error");
      setEduError(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function addCert() {
    setAddError("");
    try {
      const c = await api<Certificate>("/certificates", { method: "POST", body: JSON.stringify({ title: newTitle, issuer: "", year: "" }) });
      setCerts((l) => [...l, c]);
      setNewTitle("");
    } catch (e) {
      setAddError(e instanceof ApiError && e.fields ? Object.values(e.fields)[0] : e instanceof Error ? e.message : "Could not add");
    }
  }

  const updateEdu = (i: number, patch: Partial<Education>) => setEdu((l) => l.map((x, k) => (k === i ? { ...x, ...patch } : x)));

  if (!loaded) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-10">
      {/* ---------- education ---------- */}
      <section className="space-y-4 rounded-3xl border border-white/15 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Education</h2>
            <p className="text-xs text-gray-400">Top entry shows first.</p>
          </div>
          <button
            onClick={() => setEdu((l) => [...l, { degree: "", school: "", period: "", detail: "" }])}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10"
          >
            <Plus size={14} /> Add entry
          </button>
        </div>

        {edu.length === 0 && <p className="text-sm text-gray-500">No entries yet.</p>}

        {edu.map((e, i) => (
          <div key={i} className="grid gap-3 rounded-2xl border border-white/10 p-4 md:grid-cols-[1fr_auto]">
            <div className="space-y-3">
              <input className={inputCls} placeholder="Degree (BS Software Engineering)" value={e.degree} onChange={(ev) => updateEdu(i, { degree: ev.target.value })} maxLength={100} />
              <input className={inputCls} placeholder="School (MUET SZAB Campus, Khairpur Mir's)" value={e.school} onChange={(ev) => updateEdu(i, { school: ev.target.value })} maxLength={100} />
              <input className={inputCls} placeholder="Period (2022 - Present)" value={e.period} onChange={(ev) => updateEdu(i, { period: ev.target.value })} maxLength={40} />
              <input className={inputCls} placeholder="Short detail (optional)" value={e.detail} onChange={(ev) => updateEdu(i, { detail: ev.target.value })} maxLength={200} />
            </div>
            <button
              aria-label="Remove"
              onClick={() => setEdu((l) => l.filter((_, k) => k !== i))}
              className="h-fit rounded-lg border border-red-400/30 p-2 text-red-300 hover:bg-red-500/10"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        <div className="flex items-center gap-4">
          <SaveButton state={eduState} onClick={saveEdu} label="Save education" />
          {eduError && <span className="text-sm text-red-400">{eduError}</span>}
        </div>
      </section>

      {/* ---------- certificates ---------- */}
      <section className="space-y-4 rounded-3xl border border-white/15 bg-white/5 p-6">
        <div>
          <h2 className="font-semibold">Certificates</h2>
          <p className="text-xs text-gray-400">Type a title and add it, then upload the certificate picture. Visitors can click it to see it big.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            className={`${inputCls} flex-1`}
            placeholder="New certificate title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCert()}
            maxLength={120}
          />
          <button onClick={addCert} className="flex items-center gap-1.5 rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10">
            <Plus size={14} /> Add certificate
          </button>
        </div>
        {addError && <p className="text-sm text-red-400">{addError}</p>}

        {certs.length === 0 && <p className="text-sm text-gray-500">No certificates yet.</p>}

        <div className="grid gap-4 lg:grid-cols-2">
          {certs.map((c) => (
            <CertCard
              key={c.id}
              cert={c}
              onSaved={(n) => setCerts((l) => l.map((x) => (x.id === n.id ? { ...x, ...n } : x)))}
              onDeleted={() => setCerts((l) => l.filter((x) => x.id !== c.id))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}