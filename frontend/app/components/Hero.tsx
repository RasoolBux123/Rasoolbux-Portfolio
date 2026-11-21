"use client";

import { motion } from "framer-motion";
import Magnetic from "./Magnetic";
import Avatar from "./Avatar";
import Typewriter from "./Typewriter";
import { assetUrl } from "../lib/config";

// phrases that get typed in the heading (edit freely)
const PHRASES = ["Full-Stack Developer", "Next.js Developer", "Automation (n8n) Builder"];

// chips that orbit the photo; "a" is the starting angle in degrees
const CHIPS = [
  { t: "Full Stack", a: 0 },
  { t: "AI/ML", a: 90 },
  { t: "Backend Dev", a: 180 },
  { t: "DevOps", a: 270 },
];

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Hero({ photoUrl, resumeUrl }: { photoUrl?: string; resumeUrl?: string }) {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-24">
      {/* glowing blobs behind the hero */}
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
            {"Hi, I'm RB".split("").map((ch, n) => (
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
            <span className="block min-h-[2.5em]">
              <Typewriter
                words={PHRASES}
                className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_100%] bg-clip-text text-transparent"
              />
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-5 max-w-md leading-relaxed text-gray-400">
            I build fast, modern web apps with Next.js, Node.js and PostgreSQL.
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
                href={assetUrl(resumeUrl ?? "/Rasool_bux.pdf")}
                download
                className="block rounded-full border border-white/25 px-6 py-3 text-sm font-medium transition hover:bg-white/10"
              >
                Download CV
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* right: my photo (stays still) with tech chips travelling around it */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="relative mx-auto h-64 w-64 sm:h-80 sm:w-80"
        >
          {/* gradient ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 shadow-[0_0_100px_rgba(99,102,241,0.55)]" />
          <div className="absolute inset-1.5 flex items-center justify-center overflow-hidden rounded-full bg-[#0b1020] text-8xl font-bold">
            <Avatar src={photoUrl} textClass="text-8xl" />
          </div>

          {/* --r = how far from the centre the chips travel */}
          <div aria-hidden className="orbit pointer-events-none absolute inset-0 [--r:128px] sm:[--r:180px]">
            {CHIPS.map((c) => (
              <div
                key={c.t}
                className="absolute left-1/2 top-1/2"
                style={{ transformOrigin: "0 0", transform: `rotate(${c.a}deg) translateY(calc(var(--r) * -1))` }}
              >
                <div className="-translate-x-1/2 -translate-y-1/2">
                  <span
                    className="orbit-chip inline-block whitespace-nowrap rounded-xl border border-white/25 bg-white/10 px-3 py-1.5 text-xs backdrop-blur-md"
                    style={{ "--a": `${c.a}deg` } as React.CSSProperties}
                  >
                    {c.t}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}