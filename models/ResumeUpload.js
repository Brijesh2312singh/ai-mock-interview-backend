const mongoose = require("mongoose");

const resumeUploadSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    file_name: String,
    file_path: String,
    resume_text: String,
    ats_score: {
      type: Number,
      default: 0
    },
    job_role: String,
    missing_skills: [String],
    suggestions: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeUpload", resumeUploadSchema);