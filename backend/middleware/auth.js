const { verifyToken } = require("../services/auth");

// Put this before any route that only the admin may use.
// Client must send:  Authorization: Bearer <token>
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Login required" });

  try {
    req.admin = verifyToken(token); // available in the route as req.admin
    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please login again." });
  }
}

module.exports = requireAuth;