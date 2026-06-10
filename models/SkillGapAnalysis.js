const mongoose = require("mongoose");

const skillGapAnalysisSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    target_role: String,
    matched_skills: [String],
    missing_skills: [String],
    suggestions: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkillGapAnalysis", skillGapAnalysisSchema);