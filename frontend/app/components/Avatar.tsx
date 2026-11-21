"use client";

import { useEffect, useRef, useState } from "react";
import { assetUrl } from "../lib/config";

// Shows the profile photo, or the "RB" initials if the photo is missing.
// The ref check in useEffect catches an image that already failed before React hydrated
// (in that case onError never fires, and a broken-image icon would stay on screen).
export default function Avatar({
  src = "/pic.jpg",
  className = "",
  textClass = "text-6xl",
}: {
  src?: string;
  className?: string;
  textClass?: string;
}) {
  const [ok, setOk] = useState(true);
  const ref = useRef<HTMLImageElement>(null);

  // a new photo (new src) gets a fresh chance to load
  useEffect(() => {
    setOk(true);
  }, [src]);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setOk(false);
  }, [src]);

  if (!ok) {
    return <div className={`flex h-full w-full items-center justify-center font-extrabold text-white/80 ${textClass}`}>RB</div>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} src={assetUrl(src)} alt="RB" onError={() => setOk(false)} className={`h-full w-full object-cover ${className}`} />
  );
}