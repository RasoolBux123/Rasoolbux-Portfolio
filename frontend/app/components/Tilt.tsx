"use client";

import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from "framer-motion";

// Wrap anything in <Tilt> to make it rotate in 3D towards the mouse, with a moving glare.
// Touch screens are ignored (only a real mouse triggers it).
export default function Tilt({
  children,
  max = 12,
  glare = true,
  className = "",
}: {
  children: React.ReactNode;
  max?: number;
  glare?: boolean;
  className?: string;
}) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  const gx = useTransform(mx, (v) => v * 100);
  const gy = useTransform(my, (v) => v * 100);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.3), transparent 55%)`;
  const glareOpacity = useSpring(0, { stiffness: 200, damping: 25 });

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
    glareOpacity.set(1);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
    glareOpacity.set(0);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative ${className}`}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          style={{ background: glareBg, opacity: glareOpacity }}
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
        />
      )}
    </motion.div>
  );
}