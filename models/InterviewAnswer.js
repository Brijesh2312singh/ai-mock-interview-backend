const mongoose = require("mongoose");

const interviewAnswerSchema = new mongoose.Schema(
  {
    mysql_id: Number,
    interview_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MockInterview"
    },
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewQuestion"
    },
    mysql_interview_id: Number,
    mysql_question_id: Number,
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    mysql_user_id: Number,
    answer: String,
    score: Number,
    feedback: String,
    strengths: [String],
    improvements: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewAnswer", interviewAnswerSchema);