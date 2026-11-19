const express = require("express");
const rateLimit = require("../middleware/rateLimit");
const requireAuth = require("../middleware/auth");
const { login } = require("../services/auth");

const router = express.Router();

// POST /api/auth/login   body: { email, password }
router.post("/login", rateLimit({ limit: 10, windowMs: 10 * 60 * 1000 }), async (req, res, next) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  try {
    const result = await login(email, password);
    // same message for wrong email and wrong password, on purpose
    if (!result) return res.status(401).json({ error: "Invalid email or password" });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me   (protected) -> who is logged in?
router.get("/me", requireAuth, (req, res) => {
  res.json({ id: req.admin.id, email: req.admin.email });
});

module.exports = router;