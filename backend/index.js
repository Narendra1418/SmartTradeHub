const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ AUTH ROUTES
app.use("/api/auth", authRoutes);

// ✅ PROTECTED API
app.get("/api/market/summary", authMiddleware, (_req, res) => {
  res.json({
    portfolioValue: 125000,
    todaysPL: 2350,
    holdings: 8,
  });
});

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
