const express = require("express");
const { getPortfolio } = require("../services/portfolio");

const router = express.Router();

// GET /api/profile  (public) -> everything About, Skills and Contact need
router.get("/", async (req, res, next) => {
  try {
    res.json(await getPortfolio());
  } catch (err) {
    next(err);
  }
});

module.exports = router;