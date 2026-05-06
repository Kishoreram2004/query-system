const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: "7d"
  });
}

function formatAuthResponse(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role
  };
}

router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: "This email is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    role: role || "student"
  });

  const token = createToken(user._id.toString());
  res.status(201).json({
    token,
    user: formatAuthResponse(user)
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password || "", user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = createToken(user._id.toString());
  res.json({
    token,
    user: formatAuthResponse(user)
  });
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: formatAuthResponse(req.user) });
});

module.exports = router;
