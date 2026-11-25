const express = require("express");
const prisma = require("../db");

const router = express.Router();

// Remember the answer for a minute so a busy site does not hit the database on every page view.
let cache = { at: 0, data: null };
const TTL_MS = 60 * 1000;

// GET /api/stats/public  (no login: the footer shows these numbers)
router.get("/public", async (req, res, next) => {
  try {
    if (!cache.data || Date.now() - cache.at > TTL_MS) {
      const [views, rows] = await Promise.all([
        prisma.visit.count(),
        prisma.$queryRaw`SELECT COUNT(DISTINCT "visitorId")::int AS n FROM "Visit"`,
      ]);
      cache = { at: Date.now(), data: { views, visitors: rows[0]?.n ?? 0 } };
    }
    res.set("Cache-Control", "public, max-age=60");
    res.json(cache.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;