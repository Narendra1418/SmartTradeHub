const redis = require("../db/redis");

async function authMiddleware(req, res, next) {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no userId" });
    }

    const session = await redis.get(`session:${userId}`);

    if (!session) {
      return res.status(401).json({ message: "Session expired or invalid" });
    }

    req.userId = userId;
    next();
  } catch (err) {
    console.error("AUTH MIDDLEWARE ERROR:", err);
    return res.status(500).json({ message: "Auth middleware failed" });
  }
}

module.exports = authMiddleware;
