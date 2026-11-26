"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Tilt from "./Tilt";
import { assetUrl } from "../lib/config";
import type { Project } from "../lib/types";

export default function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <Link href={`/projects/${p.id}`} className="block h-full">
      <Tilt max={10} className="h-full rounded-2xl">
        <motion.article
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ type: "spring", stiffness: 120, damping: 16, delay: (index % 3) * 0.1 }}
          whileHover={{ y: -8 }}
          className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/5 backdrop-blur transition-shadow hover:shadow-2xl hover:shadow-indigo-500/30"
        >
          {/* shine sweep on hover */}
          <span className="pointer-events-none absolute inset-0 z-10 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

          <div className="overflow-hidden">
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={assetUrl(p.image)} alt={p.title} loading="lazy" className="h-40 w-full object-cover transition duration-700 group-hover:scale-110" />
            ) : (
              <div
                className="h-40 transition duration-700 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }}
              />
            )}
          </div>
          <div className="relative flex-1 bg-[#11172b] p-5">
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <span key={t} className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs text-indigo-200">{t}</span>
              ))}
            </div>
            <p className="mt-4 text-sm font-medium text-indigo-300">View details →</p>
          </div>
        </motion.article>
      </Tilt>
    </Link>
  );
}