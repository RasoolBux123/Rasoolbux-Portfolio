"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

// Glass pill switch. The chosen theme is saved in localStorage and applied as
// <html data-theme="light">. (Dark = no attribute.) layout.tsx applies it before first paint.
export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.getAttribute("data-theme") === "light");
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    if (next) document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={!light}
      aria-label="Toggle dark mode"
      className="relative flex h-9 w-[72px] flex-none items-center justify-between rounded-full border border-white/25 bg-white/10 px-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-xl transition hover:bg-white/20"
    >
      <Sun size={14} className="text-amber-300/80" />
      <Moon size={14} className="text-indigo-200/80" />
      <motion.span
        animate={{ x: light ? 0 : 34 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className="absolute left-1 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-white/80 to-white/40 shadow-lg backdrop-blur"
      >
        <motion.span key={light ? "sun" : "moon"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.25 }}>
          {light ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-indigo-600" />}
        </motion.span>
      </motion.span>
    </button>
  );
}