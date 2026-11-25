"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun, Sunrise, Sunset, X } from "lucide-react";
import { assetUrl } from "../lib/config";

// ---------- greeting by the visitor's own clock ----------
function timeGreeting(hour: number) {
  if (hour >= 5 && hour < 12) return { text: "Good morning", Icon: Sunrise };
  if (hour >= 12 && hour < 17) return { text: "Good afternoon", Icon: Sun };
  if (hour >= 17 && hour < 21) return { text: "Good evening", Icon: Sunset };
  return { text: "Good night", Icon: Moon }; // 9 PM to 5 AM
}

// ---------- where did the visitor come from? ----------
// Looks at ?ref=linkedin first (always reliable), then at the page they came from.
function detectSource(): string {
  const ref = new URLSearchParams(window.location.search).get("ref")?.toLowerCase();
  if (ref) return ref;

  let host = "";
  try {
    host = new URL(document.referrer).hostname.toLowerCase();
  } catch {
    return ""; // direct visit, or the app hid the referrer
  }
  if (host === window.location.hostname) return ""; // coming from inside our own site
  if (host.includes("linkedin") || host === "lnkd.in") return "linkedin";
  if (host.includes("github")) return "github";
  if (host.includes("whatsapp") || host === "wa.me") return "whatsapp";
  if (host.includes("google")) return "google";
  if (host.includes("facebook") || host === "fb.me") return "facebook";
  if (host.includes("instagram")) return "instagram";
  if (host.includes("twitter") || host === "t.co" || host === "x.com") return "twitter";
  return "";
}

type Extra = { text: string; action?: { label: string; href: string } };

function sourceMessage(source: string, resumeUrl: string): Extra | null {
  switch (source) {
    case "linkedin":
      return { text: "Thanks for coming from LinkedIn! Here is my CV.", action: { label: "Download CV", href: assetUrl(resumeUrl) } };
    case "github":
      return { text: "Coming from GitHub? Have a look at my projects.", action: { label: "View projects", href: "/#projects" } };
    case "whatsapp":
      return { text: "Thanks for coming from WhatsApp! Message me anytime.", action: { label: "Contact me", href: "/#contact" } };
    case "google":
      return { text: "Thanks for finding me on Google!", action: { label: "View projects", href: "/#projects" } };
    case "facebook":
    case "instagram":
    case "twitter":
      return { text: "Thanks for stopping by!" };
    default:
      return null;
  }
}

export default function SmartGreeting({ resumeUrl = "/Rasool_bux.pdf" }: { resumeUrl?: string }) {
  const [hour, setHour] = useState<number | null>(null); // null until the browser is ready (no server/client mismatch)
  const [extra, setExtra] = useState<Extra | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("greet-closed")) setClosed(true);
    } catch {}

    setExtra(sourceMessage(detectSource(), resumeUrl));
    setHour(new Date().getHours());
    const t = setInterval(() => setHour(new Date().getHours()), 60 * 1000); // message follows the clock
    return () => clearInterval(t);
  }, [resumeUrl]);

  function close() {
    setClosed(true);
    try {
      sessionStorage.setItem("greet-closed", "1");
    } catch {}
  }

  if (hour === null) return null;
  const { text, Icon } = timeGreeting(hour);

  return (
    <AnimatePresence>
      {!closed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 max-w-md rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-md"
        >
          <div className="flex items-start gap-3">
            <Icon size={20} className="mt-0.5 shrink-0 text-amber-300" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                Assalam o Alaikum, <span key={text}>{text}!</span>
              </p>
              {extra && (
                <p className="mt-1 text-xs text-gray-400">
                  {extra.text}{" "}
                  {extra.action && (
                    <a href={extra.action.href} className="font-medium text-indigo-300 hover:underline">
                      {extra.action.label} →
                    </a>
                  )}
                </p>
              )}
            </div>
            <button onClick={close} aria-label="Close greeting" className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white">
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}