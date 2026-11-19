const express = require("express");
const { getReply } = require("../services/chatbot");

const router = express.Router();

// POST /api/chat   body: { message: "show me your projects" }
router.post("/", async (req, res, next) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message) return res.status(400).json({ error: "Message is required" });
  if (message.length > 300) return res.status(400).json({ error: "Message is too long (max 300 characters)" });

  try {
    res.json(await getReply(message));
  } catch (err) {
    next(err);
  }
});

module.exports = router;