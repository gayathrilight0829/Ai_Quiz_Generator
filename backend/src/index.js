const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const quizRoutes = require("./routes/quiz.routes");


// ⬆️ IMPORT ROUTES AT THE TOP
const authRoutes = require("./routes/auth.routes");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// connect db
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);


// test route
app.get("/", (req, res) => {
  res.json({ message: "AI Quiz Backend is running 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
