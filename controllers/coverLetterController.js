const db = require("../config/mysqlDb");
const { GoogleGenAI } = require("@google/genai");
const CoverLetter = require("../models/CoverLetter");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const fallbackCoverLetter = (jobTitle, company) => {
  return `Dear Hiring Manager,

I am writing to express my interest in the ${jobTitle} position at ${company}. I have hands-on experience in software development and have worked on real-world projects involving API integration, database handling, authentication, and user-focused application features.

My project experience has helped me build strong problem-solving skills, understand production-level workflows, and deliver clean, reliable solutions. I am confident that my technical background and ability to learn quickly would allow me to contribute effectively to your team.

I would appreciate the opportunity to discuss how my skills and experience align with this role.

Sincerely,
Candidate`;
};

const generateCoverLetter = (req, res) => {
  const userId = req.user.mysql_id || req.user.id;
  const mongoUserId = req.user.id;

  const { resume_id, job_title, company } = req.body;

  if (!resume_id || !job_title || !company) {
    return res.status(400).json({
      success: false,
      message: "resume_id, job_title and company are required"
    });
  }

  db.query(
    `SELECT id, resume_text 
     FROM resume_uploads 
     WHERE id = ? AND user_id = ?`,
    [resume_id, userId],
    async (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Resume not found"
        });
      }

      let coverLetter = "";

      try {
        const prompt = `
Write a professional cover letter.

Job Title: ${job_title}
Company: ${company}

Resume:
${rows[0].resume_text}

Keep it concise, professional, and suitable for job application.
Return only the cover letter text. Do not use markdown.
`;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt
        });

        coverLetter = response.text || "";
      } catch (error) {
        console.log("Gemini cover letter failed:", error.message);
        coverLetter = fallbackCoverLetter(job_title, company);
      }

      db.query(
        `INSERT INTO cover_letters
         (user_id, resume_id, job_title, company, cover_letter)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, resume_id, job_title, company, coverLetter],
        async (insertErr, result) => {
          if (insertErr) {
            return res.status(500).json({
              success: false,
              message: insertErr.message
            });
          }

          try {
            await CoverLetter.create({
              mysql_id: result.insertId,
              user_id: mongoUserId,
              resume_id: Number(resume_id),
              job_title,
              company,
              cover_letter: coverLetter
            });
          } catch (mongoErr) {
            console.log("MongoDB CoverLetter sync failed:", mongoErr.message);
          }

          return res.status(201).json({
            success: true,
            message: "Cover letter generated successfully",
            cover_letter: {
              id: result.insertId,
              resume_id,
              job_title,
              company,
              content: coverLetter
            }
          });
        }
      );
    }
  );
};

const getCoverLetterHistory = (req, res) => {
  const userId = req.user.mysql_id || req.user.id;

  db.query(
    `SELECT id, resume_id, job_title, company, cover_letter, created_at
     FROM cover_letters
     WHERE user_id = ?
     ORDER BY id DESC`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      return res.status(200).json({
        success: true,
        cover_letters: rows
      });
    }
  );
};

module.exports = {
  generateCoverLetter,
  getCoverLetterHistory
};