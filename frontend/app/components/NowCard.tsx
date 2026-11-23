"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function ago(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "updated just now";
  if (mins < 60) return `updated ${mins} min ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `updated ${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `updated ${d} day${d === 1 ? "" : "s"} ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `updated ${mo} month${mo === 1 ? "" : "s"} ago`;
  return "updated over a year ago";
}

export default function NowCard({ now }: { now?: { text: string; updatedAt: string | null } | null }) {
  // computed after mount so server and browser HTML always match (no hydration error)
  const [label, setLabel] = useState("");
  useEffect(() => {
    setLabel(now?.updatedAt ? ago(now.updatedAt) : "");
  }, [now?.updatedAt]);

  if (!now?.text) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-6 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 backdrop-blur-md"
    >
      <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Right now
      </div>
      <p className="mt-2 text-sm leading-relaxed text-gray-200">{now.text}</p>
      {label && <p className="mt-2 text-xs text-gray-500">{label}</p>}
    </motion.div>
  );
}