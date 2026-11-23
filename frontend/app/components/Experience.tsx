"use client";

import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import type { Profile } from "../lib/types";

export default function Experience({ data }: { data: Profile | null }) {
  const list = data?.experience ?? [];
  if (list.length === 0) return null; // nothing to show, hide the whole section

  return (
    <section id="experience" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-28">
      <SectionTitle title="Experience" subtitle="Where I work now and where I have worked." />

      <ol className="relative mt-10 space-y-8 border-l border-white/15 pl-8">
        {list.map((e, i) => (
          <motion.li
            key={e.year + e.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="relative"
          >
            {/* dot on the line: green + glow for the current job */}
            <span
              className={`absolute -left-[39px] top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-[#0b1020] ${
                e.current ? "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" : "bg-gradient-to-r from-indigo-400 to-fuchsia-400"
              }`}
            />

            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">{e.year}</p>
              {e.current && (
                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/15 px-2 py-0.5 text-[11px] text-emerald-300">
                  Current
                </span>
              )}
            </div>

            <h3 className="mt-1 text-lg font-semibold">{e.title}</h3>
            {e.detail && <p className="mt-1 text-sm leading-relaxed text-gray-400">{e.detail}</p>}

            {e.tech && e.tech.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {e.tech.map((t) => (
                  <span key={t} className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-gray-300">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.li>
        ))}
      </ol>
    </section>
  );
}