"use client";

import { useEffect, useState } from "react";

// Types a word letter by letter, waits, deletes it, then types the next word. Loops forever.
export default function Typewriter({ words, className = "" }: { words: string[]; className?: string }) {
  const [w, setW] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [reduced, setReduced] = useState(false);

  // people who turned off animations in their system just see the first phrase
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const word = words[w];
    const done = text === word;
    const delay = !deleting && done ? 1500 : deleting && text === "" ? 350 : deleting ? 40 : 90;

    const t = setTimeout(() => {
      if (!deleting && done) setDeleting(true); // fully typed: start deleting
      else if (deleting && text === "") {
        setDeleting(false); // fully deleted: next word
        setW((n) => (n + 1) % words.length);
      } else setText(word.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, w, words, reduced]);

  if (reduced) return <span className={className}>{words[0]}</span>;

  return (
    <>
      <span className={className}>{text}</span>
      <span aria-hidden className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] bg-indigo-300" style={{ animation: "blink 1s steps(1) infinite" }} />
    </>
  );
}