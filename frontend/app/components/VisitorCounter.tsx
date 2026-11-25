"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye } from "lucide-react";
import { API_URL } from "../lib/config";
import CountUp from "./CountUp";

// The counter stays hidden until the site has this many visitors (0 = always show).
const MIN_TO_SHOW = 0;

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // ask the backend for the number once
  useEffect(() => {
    fetch(`${API_URL}/api/stats/public`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setCount(d.visitors))
      .catch(() => {}); // backend asleep or down: just show nothing
  }, []);

  // close the message on outside click or Esc
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (count === null || count < MIN_TO_SHOW) return null;

  return (
    <div ref={boxRef} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-gray-300 transition hover:bg-white/10"
      >
        <Eye size={14} className="text-indigo-300" />
        <span>
          <CountUp key={count} to={count} /> visitors
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 z-40 mb-3 w-72 -translate-x-1/2 rounded-2xl border border-white/15 bg-[#0b1020]/95 p-4 text-left shadow-2xl backdrop-blur-xl"
          >
            <p className="text-sm font-medium text-white">Thank you for exploring RB!</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">
              For any consultation, feel free to reach out through the Contact section.
            </p>
            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-3 inline-block rounded-full bg-indigo-500 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-400"
            >
              Go to Contact
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}