const express = require("express");
const cors = require("cors");
const db = require("./config/mysqlDb");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");
connectDB();

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const coverLetterRoutes = require("./routes/coverLetterRoutes");
const jobRoutes = require("./routes/jobRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const liveJobRoutes = require("./routes/liveJobRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Mock Interview Backend Running ✅");
});

/* TEMPORARY TEST ROUTE */
app.get("/test-mongo", async (req, res) => {
  try {
    await mongoose.connection.db.collection("test").insertOne({
      name: "Brijesh",
      createdAt: new Date()
    });

    return res.json({
      success: true,
      message: "Test data inserted into MongoDB"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/cover-letter", coverLetterRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/jobs", savedJobRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api/live-jobs", liveJobRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});