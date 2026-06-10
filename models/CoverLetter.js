const mongoose = require("mongoose");

const coverLetterSchema = new mongoose.Schema(
  {
    mysql_id: {
      type: Number,
      default: null
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    resume_id: {
      type: Number,
      required: true
    },
    job_title: String,
    company: String,
    cover_letter: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoverLetter", coverLetterSchema);