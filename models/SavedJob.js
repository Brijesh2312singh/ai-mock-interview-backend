const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    job_title: String,
    category: String,
    level: String,
    match_percentage: Number,
    skills_required: [String],
    salary_range: String,
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedJob", savedJobSchema);