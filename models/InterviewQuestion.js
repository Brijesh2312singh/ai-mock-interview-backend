const mongoose = require("mongoose");

const interviewQuestionSchema = new mongoose.Schema(
  {
    mysql_id: Number,
    interview_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MockInterview"
    },
    mysql_interview_id: Number,
    question: String,
    question_type: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewQuestion", interviewQuestionSchema);