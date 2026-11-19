"use client";

import { motion } from "framer-motion";

export default function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold"
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-2 h-1 w-16 origin-left rounded bg-gradient-to-r from-indigo-400 to-fuchsia-400"
      />
      {subtitle && <p className="mt-3 text-gray-400">{subtitle}</p>}
    </div>
  );
}