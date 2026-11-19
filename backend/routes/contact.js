const express = require("express");
const rateLimit = require("../middleware/rateLimit");
const { validateContact, saveMessage } = require("../services/contact");

const router = express.Router();

// POST /api/contact   body: { name, email, message }
router.post("/", rateLimit({ limit: 5, windowMs: 10 * 60 * 1000 }), async (req, res, next) => {
  const { clean, errors } = validateContact(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: "Please fix the highlighted fields", fields: errors });
  }

  try {
    await saveMessage(clean);
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;