const express = require("express");
const cors = require("cors");

const app = express(); // ✅ app is defined HERE

app.use(cors());
app.use(express.json());

/* ---------- MARKET API ---------- */
app.get("/api/market/summary", (_req, res) => {
  res.json({
    portfolioValue: 125000,
    todaysPL: 2350,
    holdings: 8,
  });
});

/* ---------- AUTH API (FAKE LOGIN) ---------- */
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "test@example.com" && password === "123456") {
    return res.json({
      user: {
        email,
        name: "Test User",
      },
    });
  }

  return res.status(401).json({
    message: "Invalid credentials",
  });
});

/* ---------- SERVER START ---------- */
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
