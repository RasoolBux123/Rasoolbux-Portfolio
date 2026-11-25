"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, GraduationCap, X } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { assetUrl } from "../lib/config";
import type { Certificate, Profile } from "../lib/types";

export default function Education({ data }: { data: Profile | null }) {
  const education = data?.education ?? [];
  const certificates = data?.certificates ?? [];
  const [open, setOpen] = useState<Certificate | null>(null); // certificate shown big

  // Esc closes the big picture
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (education.length === 0 && certificates.length === 0) return null; // hide the whole section

  return (
    <section id="education" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-28">
      <SectionTitle title="Education & Certificates" subtitle="Where I studied and what I have completed." />

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {/* ---------- education ---------- */}
        {education.length > 0 && (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-indigo-300">
              <GraduationCap size={16} /> Education
            </h3>
            <div className="space-y-4">
              {education.map((e, i) => (
                <motion.div
                  key={e.degree + e.school}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl"
                >
                  <h4 className="font-semibold">{e.degree}</h4>
                  <p className="mt-1 text-sm text-gray-300">{e.school}</p>
                  {e.period && <p className="mt-1 text-xs text-indigo-300">{e.period}</p>}
                  {e.detail && <p className="mt-2 text-sm text-gray-400">{e.detail}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- certificates ---------- */}
        {certificates.length > 0 && (
          <div className={education.length === 0 ? "md:col-span-2" : ""}>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-indigo-300">
              <Award size={16} /> Certificates
            </h3>
            <div className={`grid gap-4 ${education.length === 0 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2"}`}>
              {certificates.map((c, i) => (
                <motion.button
                  key={c.id}
                  type="button"
                  disabled={!c.image}
                  onClick={() => c.image && setOpen(c)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  whileHover={c.image ? { y: -4 } : undefined}
                  className={`overflow-hidden rounded-2xl border border-white/15 bg-white/5 text-left backdrop-blur-xl ${c.image ? "cursor-zoom-in" : "cursor-default"}`}
                >
                  <div className="flex aspect-[4/3] items-center justify-center bg-white/5">
                    {c.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={assetUrl(c.image)} alt={c.title} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <Award size={32} className="text-gray-500" />
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-semibold">{c.title}</h4>
                    {(c.issuer || c.year) && (
                      <p className="mt-1 text-xs text-gray-400">{[c.issuer, c.year].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* big picture (click anywhere or press Esc to close) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <button
              aria-label="Close"
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 hover:bg-white/20"
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-4xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl(open.image)} alt={open.title} className="max-h-[80vh] w-auto rounded-xl object-contain" />
              <p className="mt-3 text-center text-sm text-gray-200">{open.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}