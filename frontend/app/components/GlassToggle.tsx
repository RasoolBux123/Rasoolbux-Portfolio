"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

// Glass mode is ON unless the visitor switched it off. The layout script sets
// data-glass before the page paints, this button just flips it and remembers the choice.
export default function GlassToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(document.documentElement.getAttribute("data-glass") === "on");
  }, []);

  function toggle() {
    const next = !on;
    setOn(next);
    if (next) document.documentElement.setAttribute("data-glass", "on");
    else document.documentElement.removeAttribute("data-glass");
    try {
      localStorage.setItem("glass", next ? "on" : "off");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn glass style off" : "Turn glass style on"}
      title={on ? "Glass style: on" : "Glass style: off"}
      className={`rounded-full border p-2 transition ${
        on ? "border-indigo-300/60 bg-indigo-500/25 text-indigo-200" : "border-white/20 text-gray-400 hover:bg-white/10"
      }`}
    >
      <Sparkles size={16} />
    </button>
  );
}