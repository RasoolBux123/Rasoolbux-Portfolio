const prisma = require("../db");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns { clean, errors }. errors = { fieldName: "message" }
function validateContact(body = {}) {
  const clean = {
    name: typeof body.name === "string" ? body.name.trim() : "",
    email: typeof body.email === "string" ? body.email.trim() : "",
    message: typeof body.message === "string" ? body.message.trim() : "",
  };

  const errors = {};
  if (clean.name.length < 2 || clean.name.length > 80) errors.name = "Name must be 2 to 80 characters";
  if (!EMAIL_RE.test(clean.email) || clean.email.length > 120) errors.email = "Enter a valid email";
  if (clean.message.length < 10 || clean.message.length > 1000) errors.message = "Message must be 10 to 1000 characters";

  return { clean, errors };
}

function saveMessage(clean) {
  return prisma.message.create({ data: clean });
}

module.exports = { validateContact, saveMessage };