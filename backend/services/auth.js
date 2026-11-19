const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db");

// a valid-looking hash, compared against when the email does not exist,
// so "wrong email" and "wrong password" take the same time (no user guessing)
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

async function login(email, password) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  const ok = await bcrypt.compare(password, admin ? admin.passwordHash : DUMMY_HASH);
  if (!admin || !ok) return null;

  // token payload: only what we need later. Never put the password in a token.
  const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
  return { token, admin: { id: admin.id, email: admin.email } };
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET); // throws if fake or expired
}

module.exports = { login, verifyToken };