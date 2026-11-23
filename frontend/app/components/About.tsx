"use client";

import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import Reveal from "./Reveal";
import Avatar from "./Avatar";
import type { Profile } from "../lib/types";
import NowCard from "./NowCard";
export default function About({ data }: { data: Profile | null }) {
  const about = data?.profile.about ?? "I build modern full-stack web apps and learn by shipping real projects.";
  
  <NowCard now={data?.now} />
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-28">
      <SectionTitle title="About Me" subtitle="A little about who I am and how I got here." />

      <div className="mt-10 grid items-center gap-10 md:grid-cols-[280px_1fr]">
        <Reveal>
          <div className="relative mx-auto h-64 w-64 md:h-72 md:w-72">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 rounded-3xl opacity-70 blur-md"
              style={{ background: "conic-gradient(from 0deg, #6366f1, #d946ef, #22d3ee, #6366f1)" }}
            />
            
            <div className="absolute inset-0 overflow-hidden rounded-3xl border border-white/20 bg-[#121933]">
              <Avatar src={data?.photoUrl} />
             
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-gray-300">{about}</p>
            {data && (
              <p className="mt-3 text-sm text-gray-400">
                {data.profile.role} · {data.profile.location}
              </p>
            )}
          </Reveal>

          
             
        </div>
      </div>
    </section>
  );
}