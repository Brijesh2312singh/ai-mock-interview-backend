const mongoose = require("mongoose");

const learningRoadmapSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    target_role: String,
    roadmap: [
      {
        month: Number,
        topics: [String]
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("LearningRoadmap", learningRoadmapSchema);