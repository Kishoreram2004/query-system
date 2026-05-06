require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const queryRoutes = require("./routes/queryRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDatabase();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000"
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/queries", queryRoutes);

app.use((err, _req, res, _next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Server error"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
