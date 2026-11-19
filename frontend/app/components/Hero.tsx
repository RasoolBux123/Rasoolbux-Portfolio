"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Magnetic from "./Magnetic";
import Avatar from "./Avatar";
const WORDS = ["Developer", "Builder", "Problem Solver"];

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Hero() {
  const [i, setI] = useState(0);
  

  // rotate the highlighted word
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-24">
      {/* glowing blobs that drift slowly */}
      <motion.div
        animate={{ x: [0, -60, 20, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-32 -top-20 h-[560px] w-[560px] rounded-full bg-indigo-500/40 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, 70, -20, 0], y: [0, -50, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-40 top-1/2 h-[460px] w-[460px] rounded-full bg-fuchsia-500/20 blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
        {/* left: text */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-indigo-500/20 px-4 py-1.5 text-xs"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Available for work
          </motion.span>

          <motion.h1 variants={item} className="mt-5 text-5xl font-bold leading-tight sm:text-6xl">
            {"Hi, I'm Rasool Bux".split("").map((ch, n) => (
              <motion.span
                key={n}
                initial={{ opacity: 0, y: 40, rotate: 8 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.3 + n * 0.05, type: "spring", stiffness: 200, damping: 14 }}
                className="inline-block"
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
            <br />
            Full-Stack{" "}
            <span className="relative inline-block align-bottom">
              <AnimatePresence mode="wait">
                <motion.span
                  key={WORDS[i]}
                  initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -30, filter: "blur(6px)" }}
                  transition={{ duration: 0.4 }}
                  className="inline-block bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_100%] bg-clip-text text-transparent"
                  style={{ animation: "shine 3s linear infinite" }}
                >
                  {WORDS[i]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-5 max-w-md leading-relaxed text-gray-400">
            I build fast, modern web apps with Next.js, Node.js , FAstApi, Django , AI/ML and PostgreSQL.
          </motion.p>

          <motion.div variants={item} className="mt-7 flex flex-wrap gap-3">
            <Magnetic>
              <a
                href="#projects"
                className="block rounded-full bg-indigo-500 px-6 py-3 text-sm font-medium transition hover:bg-indigo-400"
              >
                View Projects
              </a>
            </Magnetic>
            <Magnetic>
  <a
    href="/Rasool_bux.pdf"
    download="RasoolBux.pdf"
    className="block rounded-full border border-white/25 px-6 py-3 text-sm font-medium transition hover:bg-white/10"
  >
    Download CV
  </a>
</Magnetic>
          </motion.div>
        </motion.div>

        {/* right: avatar with floating tech chips (Phase 3: chat panel yahan aayega) */}
               {/* right: my photo with floating tech chips */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80"
        >
          {/* gradient ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 shadow-[0_0_100px_rgba(99,102,241,0.55)]" />
          
              <div className="absolute inset-1.5 flex items-center justify-center overflow-hidden rounded-full bg-[#0b1020] text-8xl font-bold">
  <Avatar textClass="text-8xl" />
</div>
          {[
            { t: "Next.js", c: "-left-6 top-10", d: "0s" },
            { t: "Node.js", c: "-right-6 top-20", d: "0.6s" },
            { t: "PostgreSQL", c: "left-0 bottom-8", d: "1.2s" },
          ].map((chip) => (
            <span
              key={chip.t}
              style={{ animation: `float 4s ease-in-out ${chip.d} infinite` }}
              className={`absolute ${chip.c} rounded-xl border border-white/25 bg-white/10 px-3 py-1.5 text-xs backdrop-blur-md`}
            >
              {chip.t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}