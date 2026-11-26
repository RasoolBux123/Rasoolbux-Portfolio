"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import ThemeToggle from "./admin/ThemeToggle";
import GlassToggle from "./GlassToggle";
import { API_URL, assetUrl } from "../lib/config";

const LINKS = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Education", href: "/#education" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [resume, setResume] = useState("/Rasool_bux.pdf");

  // use the CV that was uploaded in the admin panel (falls back to the file in /public)
  useEffect(() => {
    fetch(`${API_URL}/api/profile`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.resumeUrl && setResume(d.resumeUrl))
      .catch(() => {});
  }, []);

  // add a glass background once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null; // no site navbar on admin pages

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-white/10 bg-[#0b1020]/70 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="/#home" className="text-lg font-bold">
          RB<span className="text-indigo-400">.dev</span>
        </a>

        <ul className="hidden gap-8 text-sm text-gray-400 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* desktop: toggles + Resume + Let's talk */}
        <div className="hidden items-center gap-3 md:flex">
          <GlassToggle />
          <ThemeToggle />
          <a
            href={assetUrl(resume)}
            download
            title="Download resume"
            className="flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <Download size={15} /> Resume
          </a>
          <a
            href="/#contact"
            className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
          >
            Let&apos;s talk
          </a>
        </div>

        {/* mobile: toggles + resume icon + menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <GlassToggle />
          <ThemeToggle />
          <a href={assetUrl(resume)} download aria-label="Download resume" className="rounded-lg p-2 text-gray-300 hover:bg-white/10">
            <Download size={20} />
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-gray-300 hover:bg-white/10"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-[#0b1020]/95 px-5 backdrop-blur-xl md:hidden"
          >
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-gray-300 hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}