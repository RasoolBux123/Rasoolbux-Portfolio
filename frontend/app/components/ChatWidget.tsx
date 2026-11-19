"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import ChatPanel from "./ChatPanel";

// Floating chat button (bottom-right) that opens the assistant panel.
export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);

  // small "Ask me anything" bubble a few seconds after the page loads
  useEffect(() => {
    const show = setTimeout(() => setHint(true), 4000);
    const hide = setTimeout(() => setHint(false), 12000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  if (pathname?.startsWith("/admin")) return null; // no chat on admin pages

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:right-6">
      {/* The panel stays mounted (so the conversation is kept) and is shown/hidden with
          plain CSS classes. No animation library involved, so it cannot get stuck invisible. */}
      <div
        aria-hidden={!open}
        className={`w-[calc(100vw-2rem)] max-w-[24rem] origin-bottom-right transition-all duration-300 ease-out ${
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible pointer-events-none translate-y-6 scale-95 opacity-0"
        }`}
      >
        <ChatPanel onClose={() => setOpen(false)} />
      </div>

      <AnimatePresence>
        {hint && !open && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={() => {
              setOpen(true);
              setHint(false);
            }}
            className="rounded-2xl rounded-br-sm border border-white/20 bg-[#121933] px-4 py-2 text-sm shadow-xl"
          >
            Ask me anything 👋
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => {
          setOpen((o) => !o);
          setHint(false);
        }}
        aria-label={open ? "Close assistant" : "Open assistant"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-xl shadow-indigo-500/40"
      >
        {!open && <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-indigo-500/40" />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "chat"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X size={24} /> : <MessageCircle size={24} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}