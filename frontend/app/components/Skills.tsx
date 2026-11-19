"use client";

import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import type { Profile } from "../lib/types";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const chip = { hidden: { opacity: 0, scale: 0.8, y: 10 }, show: { opacity: 1, scale: 1, y: 0 } };

export default function Skills({ data }: { data: Profile | null }) {
  const groups = data?.skills ?? [];

  return (
    <section id="skills" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-28">
      <SectionTitle title="Skills" subtitle="Tools I use to turn ideas into working products." />

      {groups.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">Skills will appear here soon.</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {groups.map((g, gi) => (
            <motion.div
              key={g.group}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl"
            >
              <h3 className="mb-4 text-lg font-semibold">{g.group}</h3>
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-wrap gap-2"
              >
                {g.items.map((item) => (
                  <motion.span
                    key={item}
                    variants={chip}
                    whileHover={{ scale: 1.1 }}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-gray-200"
                  >
                    {item}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}