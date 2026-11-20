"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { API_URL } from "../lib/config";
import { getToken } from "../lib/auth";

// Sends one anonymous "page view" to the backend. No IP or personal data is stored.
export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    try {
      if (getToken()) return; // you are logged in as admin: don't count your own visits

      let id = localStorage.getItem("vid");
      if (!id) {
        id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now();
        localStorage.setItem("vid", id);
      }

      // the referrer (where they came from) is sent only on the first page of a visit
      let referrer = "";
      if (!sessionStorage.getItem("ref-sent")) {
        sessionStorage.setItem("ref-sent", "1");
        referrer = document.referrer;
      }

      fetch(`${API_URL}/api/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: id, path: pathname, referrer }),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }, [pathname]);

  return null;
}