"use client";

import { useEffect, useRef, useState } from "react";

// Shows /me.jpg, or the "RB" initials if the photo is missing.
// The ref check in useEffect catches an image that already failed before React hydrated.
export default function Avatar({ className = "", textClass = "text-6xl" }: { className?: string; textClass?: string }) {
  const [ok, setOk] = useState(true);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setOk(false);
  }, []);

  if (!ok) {
    return <div className={`flex h-full w-full items-center justify-center font-extrabold text-white/80 ${textClass}`}>RB</div>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} src="/pic.jpg" alt="RB" onError={() => setOk(false)} className={`h-full w-full object-cover ${className}`} />
  );
}