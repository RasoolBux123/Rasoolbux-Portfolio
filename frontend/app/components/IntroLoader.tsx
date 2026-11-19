"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function IntroLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("intro-seen")) return;
      sessionStorage.setItem("intro-seen", "1");
    } catch {}
    setShow(true);
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1020]"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className="text-6xl font-bold"
          >
            RB<span className="text-indigo-400">.dev</span>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute bottom-1/3 h-1 w-40 origin-left rounded bg-gradient-to-r from-indigo-400 to-pink-400"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}