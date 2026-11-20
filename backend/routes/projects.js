const express = require("express");
const { getProjects, getProject } = require("../services/projects");

const router = express.Router();

// GET /api/projects  (public, from the database)
router.get("/", async (req, res, next) => {
  try {
    res.json(await getProjects());
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/3  (public, one project for its detail page)
router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(404).json({ error: "Project not found" });

  try {
    const project = await getProject(id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

module.exports = router;