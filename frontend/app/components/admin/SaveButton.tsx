"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export type SaveState = "idle" | "saving" | "saved" | "error";

export default function SaveButton({ state, onClick, label = "Save changes" }: { state: SaveState; onClick: () => void; label?: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={state === "saving"}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
    >
      {state === "saving" ? "Saving..." : state === "saved" ? (<><Check size={16} /> Saved</>) : label}
    </motion.button>
  );
}