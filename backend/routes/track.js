const express = require("express");
const prisma = require("../db");
const rateLimit = require("../middleware/rateLimit");

const router = express.Router();
const BOT_RE = /bot|crawl|spider|preview|facebookexternalhit|whatsapp|slurp|headless|lighthouse|uptime/i;

// POST /api/track   body: { visitorId, path, referrer }
router.post("/", rateLimit({ limit: 60, windowMs: 10 * 60 * 1000 }), async (req, res) => {
  try {
    const ua = String(req.headers["user-agent"] || "");
    if (BOT_RE.test(ua)) return res.json({ ok: true });

    const visitorId = String(req.body?.visitorId || "").slice(0, 64);
    const path = String(req.body?.path || "").slice(0, 200);
    if (!visitorId || !path.startsWith("/")) return res.status(400).json({ ok: false });

    let referrer = "";
    try {
      referrer = new URL(String(req.body?.referrer || "")).hostname.replace(/^www\./, "");
    } catch {}

    const c = String(req.headers["cf-ipcountry"] || "").toUpperCase(); // may be empty on some hosts
    const country = /^[A-Z]{2}$/.test(c) && c !== "XX" ? c : "";
    const device = /ipad|tablet/i.test(ua) ? "tablet" : /mobi|android|iphone/i.test(ua) ? "mobile" : "desktop";

    await prisma.visit.create({ data: { visitorId, path, referrer, country, device } });
    res.json({ ok: true });
  } catch {
    res.json({ ok: false }); // analytics must never break the site
  }
});

module.exports = router;