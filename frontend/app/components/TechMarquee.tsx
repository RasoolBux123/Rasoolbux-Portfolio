const TECH = ["Next.js", "React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Prisma", "Tailwind", "Framer Motion", "Docker", "Git", "FastAPI"];

export default function TechMarquee() {
  const items = [...TECH, ...TECH]; // doubled so the loop is seamless
  return (
    <section className="relative mt-20 overflow-hidden border-y border-white/10 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0b1020] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0b1020] to-transparent" />
      <div className="flex w-max gap-4" style={{ animation: "marquee 28s linear infinite" }}>
        {items.map((t, i) => (
          <span key={i} className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm text-gray-300">
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}