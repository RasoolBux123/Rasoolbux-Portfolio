import Reveal from "./Reveal";
import CountUp from "./CountUp";

const STATS = [
  { value: 10, suffix: "+", label: "Projects" },
  { value: 2, suffix: "", label: "Years learning" },
  { value: 15, suffix: "+", label: "Technologies" },
  { value: 100, suffix: "%", label: "Dedication" },
];

export default function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-5">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-center backdrop-blur">
              <p className="text-3xl font-bold">
                <CountUp to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-gray-400">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}