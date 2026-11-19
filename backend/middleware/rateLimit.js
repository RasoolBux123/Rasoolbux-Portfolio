// Tiny in-memory rate limiter: max `limit` requests per IP in `windowMs`.
// (On a big site you would use the "express-rate-limit" package or Redis.)
function rateLimit({ limit = 5, windowMs = 10 * 60 * 1000 } = {}) {
  const hits = new Map(); // ip -> [timestamps]

  return (req, res, next) => {
    const now = Date.now();
    const recent = (hits.get(req.ip) || []).filter((t) => now - t < windowMs);

    if (recent.length >= limit) {
      return res.status(429).json({ error: "Too many messages. Please try again later." });
    }

    recent.push(now);
    hits.set(req.ip, recent);
    next();
  };
}

module.exports = rateLimit;