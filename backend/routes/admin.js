const express = require("express");
const prisma = require("../db");
const requireAuth = require("../middleware/auth");
const { getProjects, validateProject, createProject, updateProject, deleteProject } = require("../services/projects");
const { saveFile, removeFile } = require("../services/files");
const router = express.Router();
const {
  getPortfolio,
  validateProfile,
  saveProfile,
  validateSkills,
  replaceSkills,
  validateExperience,
  replaceExperience,
} = require("../services/portfolio");
// every route in this file needs a valid token
router.use(requireAuth);

// "/projects/5" -> 5, or null if it is not a number
const parseId = (req) => {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// Prisma throws code P2025 when the row to update/delete does not exist
const notFound = (err) => err && err.code === "P2025";

// GET /api/admin/stats
router.get("/stats", async (req, res, next) => {
  try {
    const [projects, messages, unread] = await Promise.all([
      prisma.project.count(),
      prisma.message.count(),
      prisma.message.count({ where: { read: false } }),
    ]);
    res.json({ projects, messages, unread });
  } catch (err) {
    next(err);
  }
});

// ---------- projects ----------
router.get("/projects", async (req, res, next) => {
  try {
    res.json(await getProjects());
  } catch (err) {
    next(err);
  }
});

router.post("/projects", async (req, res, next) => {
  const { clean, errors } = validateProject(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ error: "Please fix the highlighted fields", fields: errors });

  try {
    res.status(201).json(await createProject(clean));
  } catch (err) {
    next(err);
  }
});

router.put("/projects/:id", async (req, res, next) => {
  const id = parseId(req);
  if (!id) return res.status(400).json({ error: "Invalid id" });

  const { clean, errors } = validateProject(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ error: "Please fix the highlighted fields", fields: errors });

  try {
    res.json(await updateProject(id, clean));
  } catch (err) {
    if (notFound(err)) return res.status(404).json({ error: "Project not found" });
    next(err);
  }
});

router.delete("/projects/:id", async (req, res, next) => {
  const id = parseId(req);
  if (!id) return res.status(400).json({ error: "Invalid id" });

  try {
    await deleteProject(id);
    res.json({ ok: true });
  } catch (err) {
    if (notFound(err)) return res.status(404).json({ error: "Project not found" });
    next(err);
  }
});

// ---------- messages ----------
router.get("/messages", async (req, res, next) => {
  try {
    res.json(await prisma.message.findMany({ orderBy: { createdAt: "desc" } }));
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/messages/:id   body: { read: true | false }
router.patch("/messages/:id", async (req, res, next) => {
  const id = parseId(req);
  if (!id) return res.status(400).json({ error: "Invalid id" });
  if (typeof req.body?.read !== "boolean") return res.status(400).json({ error: "read must be true or false" });

  try {
    res.json(await prisma.message.update({ where: { id }, data: { read: req.body.read } }));
  } catch (err) {
    if (notFound(err)) return res.status(404).json({ error: "Message not found" });
    next(err);
  }
});

router.delete("/messages/:id", async (req, res, next) => {
  const id = parseId(req);
  if (!id) return res.status(400).json({ error: "Invalid id" });

  try {
    await prisma.message.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    if (notFound(err)) return res.status(404).json({ error: "Message not found" });
    next(err);
  }
});

// ---------- about, skills, timeline ----------
// GET /api/admin/portfolio -> the current content (same shape as the public /api/profile)
router.get("/portfolio", async (req, res, next) => {
  try {
    res.json(await getPortfolio());
  } catch (err) {
    next(err);
  }
});

router.put("/profile", async (req, res, next) => {
  const { clean, errors } = validateProfile(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ error: "Please fix the highlighted fields", fields: errors });

  try {
    await saveProfile(clean);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.put("/skills", async (req, res, next) => {
  const { clean, error } = validateSkills(req.body);
  if (error) return res.status(400).json({ error });

  try {
    await replaceSkills(clean);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.put("/experience", async (req, res, next) => {
  const { clean, error } = validateExperience(req.body);
  if (error) return res.status(400).json({ error });

  try {
    await replaceExperience(clean);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/analytics?days=30
router.get("/analytics", async (req, res, next) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 90);
    const PKT = 5 * 3600 * 1000; // show days in Pakistan time
    const dayKey = (d) => new Date(new Date(d).getTime() + PKT).toISOString().slice(0, 10);

    const visits = await prisma.visit.findMany({
      where: { createdAt: { gte: new Date(Date.now() - days * 86400000) } },
      orderBy: { createdAt: "desc" },
      take: 50000,
    });

    const top = (pick, n = 6) => {
      const m = new Map();
      for (const v of visits) {
        const k = pick(v) || "Unknown";
        m.set(k, (m.get(k) || 0) + 1);
      }
      return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, count]) => ({ name, count }));
    };

    const byDay = new Map();
    for (const v of visits) {
      const k = dayKey(v.createdAt);
      const e = byDay.get(k) || { views: 0, ids: new Set() };
      e.views++;
      e.ids.add(v.visitorId);
      byDay.set(k, e);
    }
    const series = [];
    for (let i = days - 1; i >= 0; i--) {
      const k = dayKey(Date.now() - i * 86400000);
      const e = byDay.get(k);
      series.push({ date: k, views: e ? e.views : 0, visitors: e ? e.ids.size : 0 });
    }
    const today = series[series.length - 1];

    res.json({
      days,
      totalViews: visits.length,
      uniqueVisitors: new Set(visits.map((v) => v.visitorId)).size,
      todayViews: today.views,
      todayVisitors: today.visitors,
      series,
      pages: top((v) => v.path),
      referrers: top((v) => v.referrer || "Direct"),
      countries: top((v) => v.country),
      devices: top((v) => v.device),
      recent: visits.slice(0, 15).map((v) => ({
        time: v.createdAt,
        path: v.path,
        country: v.country,
        device: v.device,
        referrer: v.referrer,
      })),
    });
  } catch (err) {
    next(err);
  }
});


// ---------- files (CV, photo, project images) ----------
// The browser sends the file itself as the request body (raw bytes), the type goes in Content-Type.
router.put("/files/:key", express.raw({ type: () => true, limit: "5mb" }), async (req, res, next) => {
  try {
    const r = await saveFile(req.params.key, req.body);
    if (r.error) return res.status(r.status).json({ error: r.error });
    res.json({ url: r.url });
  } catch (err) {
    next(err);
  }
});

router.delete("/files/:key", async (req, res, next) => {
  try {
    const r = await removeFile(req.params.key);
    if (r.error) return res.status(r.status).json({ error: r.error });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

module.exports = router;