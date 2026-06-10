const mongoose = require("mongoose");

const jobRecommendationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    resume_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeUpload"
    },
    target_role: String,
    recommended_jobs: [
      {
        title: String,
        category: String,
        level: String,
        match_percentage: Number,
        skills_required: [String],
        salary_range: String,
        description: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobRecommendation", jobRecommendationSchema);