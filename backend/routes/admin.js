const express = require("express");
const prisma = require("../db");
const requireAuth = require("../middleware/auth");
const { getProjects, validateProject, createProject, updateProject, deleteProject } = require("../services/projects");

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

module.exports = router;