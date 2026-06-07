const express = require("express");
const pool = require("../db/postgres");
const authMiddleware = require("./middleware/auth");

const router = express.Router();

/**
 * GET /api/portfolio
 * Get all portfolios for logged-in user
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      "SELECT * FROM portfolios WHERE user_id = $1",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET PORTFOLIO ERROR:", err);
    res.status(500).json({ message: "Failed to fetch portfolios" });
  }
});

/**
 * POST /api/portfolio
 * Create new portfolio
 */
router.post("/", async (req, res) => {
  try {
    const userId = req.userId;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Portfolio name required" });
    }

    const result = await pool.query(
      "INSERT INTO portfolios (user_id, name) VALUES ($1, $2) RETURNING *",
      [userId, name]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("CREATE PORTFOLIO ERROR:", err);
    res.status(500).json({ message: "Failed to create portfolio" });
  }
});


// 🔥 THIS LINE WAS LIKELY MISSING
module.exports = router;
