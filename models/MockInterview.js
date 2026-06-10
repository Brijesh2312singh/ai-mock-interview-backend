const mongoose = require("mongoose");

const mockInterviewSchema = new mongoose.Schema(
  {
    mysql_id: Number,
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    mysql_user_id: Number,
    role: String,
    experience_level: String,
    interview_type: String,
    status: {
      type: String,
      default: "created"
    },
    completed_at: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("MockInterview", mockInterviewSchema);