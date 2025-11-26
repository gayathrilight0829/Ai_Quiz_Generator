const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateQuiz } = require("../controllers/quiz.controller");

// 👉 GENERATE QUIZ
router.post("/generate", generateQuiz);

// 👉 SAVE QUIZ HISTORY
router.post("/save", async (req, res) => {
  const { token, topic, score, total } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET123");
    const user = await User.findById(decoded.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.history.push({ topic, score, total, date: new Date() });
    await user.save();

    res.json({ message: "History saved" });

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid token" });
  }
});

// 👉 GET USER HISTORY
router.post("/history", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET123");
    const user = await User.findById(decoded.id);

    res.json({ history: user.history });

  } catch {
    res.status(400).json({ message: "Invalid token" });
  }
});

module.exports = router;
