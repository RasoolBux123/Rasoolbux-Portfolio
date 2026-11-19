const express = require("express");
const { getProjects } = require("../services/projects");

const router = express.Router();

// GET /api/projects  (ab database se)
router.get("/", async (req, res, next) => {
  try {
    res.json(await getProjects());
  } catch (err) {
    next(err); // Express 4 async error khud nahi pakadta, isliye next(err)
  }
});

module.exports = router;