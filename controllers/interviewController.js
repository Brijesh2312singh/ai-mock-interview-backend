const db = require("../config/mysqlDb");
const OpenAI = require("openai");

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
const defaultQuestions = [
  "Tell me about yourself.",
  "What are your strongest technical skills?",
  "Explain one project you worked on recently.",
  "What challenges did you face in your last project?",
  "Why should we hire you?"
];

const createInterview = (req, res) => {
  const user_id = req.user.id;
  const { role, experience_level, interview_type } = req.body;

  if (!role || !experience_level || !interview_type) {
    return res.status(400).json({
      success: false,
      message: "role, experience_level and interview_type are required"
    });
  }

  db.query(
    `INSERT INTO mock_interviews 
     (user_id, role, experience_level, interview_type)
     VALUES (?, ?, ?, ?)`,
    [user_id, role, experience_level, interview_type],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      const interviewId = result.insertId;

      const questions = defaultQuestions.map(q => [
        interviewId,
        q,
        interview_type
      ]);

      db.query(
        `INSERT INTO interview_questions 
         (interview_id, question, question_type)
         VALUES ?`,
        [questions],
        (qErr) => {
          if (qErr) {
            return res.status(500).json({
              success: false,
              message: qErr.message
            });
          }

          return res.status(201).json({
            success: true,
            message: "Mock interview created successfully",
            interview: {
              id: interviewId,
              role,
              experience_level,
              interview_type,
              status: "created"
            }
          });
        }
      );
    }
  );
};

const getInterviewHistory = (req, res) => {
  const user_id = req.user.id;

  db.query(
    `SELECT id, role, experience_level, interview_type, status, created_at
     FROM mock_interviews
     WHERE user_id = ?
     ORDER BY id DESC`,
    [user_id],
    (err, interviews) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      return res.json({
        success: true,
        interviews
      });
    }
  );
};

const getInterviewQuestions = (req, res) => {
  const user_id = req.user.id;
  const interview_id = req.params.id;

  db.query(
    `SELECT id FROM mock_interviews 
     WHERE id = ? AND user_id = ?`,
    [interview_id, user_id],
    (err, interviewRows) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (interviewRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Interview not found"
        });
      }

      db.query(
        `SELECT id, question, question_type, created_at
         FROM interview_questions
         WHERE interview_id = ?
         ORDER BY id ASC`,
        [interview_id],
        (qErr, questions) => {
          if (qErr) {
            return res.status(500).json({
              success: false,
              message: qErr.message
            });
          }

          return res.json({
            success: true,
            interview_id: Number(interview_id),
            questions
          });
        }
      );
    }
  );
};
const generateAIFeedback = async (question, answer) => {

  const prompt = `
You are an expert technical interviewer.

Question:
${question}

Candidate Answer:
${answer}

Return only raw JSON. Do not use markdown. Do not wrap in code block.

{
  "score": 0,
  "feedback": "",
  "strengths": [],
  "improvements": []
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });

  let text = response.text || "";

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(text);
};
const submitAnswer = (req, res) => {
  const user_id = req.user.id;
  const { interview_id, question_id, answer } = req.body;

  if (!interview_id || !question_id || !answer) {
    return res.status(400).json({
      success: false,
      message: "interview_id, question_id and answer are required"
    });
  }

  db.query(
    `SELECT id FROM mock_interviews WHERE id = ? AND user_id = ?`,
    [interview_id, user_id],
    (err, interviewRows) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (interviewRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Interview not found"
        });
      }

      db.query(
        `SELECT id, question FROM interview_questions
         WHERE id = ? AND interview_id = ?`,
        [question_id, interview_id],
        async (qErr, questionRows) => {
          if (qErr) {
            return res.status(500).json({
              success: false,
              message: qErr.message
            });
          }

          if (questionRows.length === 0) {
            return res.status(404).json({
              success: false,
              message: "Question not found"
            });
          }

          try {
            const ai = await generateAIFeedback(
              questionRows[0].question,
              answer
            );

            const score = Number(ai.score || 0);
            const feedback = ai.feedback || "Feedback generated successfully";

            db.query(
              `INSERT INTO interview_answers
               (interview_id, question_id, user_id, answer, score, feedback)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [interview_id, question_id, user_id, answer, score, feedback],
              (insertErr, result) => {
                if (insertErr) {
                  return res.status(500).json({
                    success: false,
                    message: insertErr.message
                  });
                }

                return res.status(201).json({
                  success: true,
                  message: "Answer submitted successfully",
                  answer: {
                    id: result.insertId,
                    interview_id,
                    question_id,
                    score,
                    feedback,
                    strengths: ai.strengths || [],
                    improvements: ai.improvements || []
                  }
                });
              }
            );
          } catch (aiErr) {
            return res.status(500).json({
              success: false,
              message: "AI feedback failed",
              error: aiErr.message
            });
          }
        }
      );
    }
  );
};
const getInterviewResult = (req, res) => {
  const user_id = req.user.id;
  const interview_id = req.params.id;

  db.query(
    `SELECT id, role, experience_level, interview_type, status
     FROM mock_interviews 
     WHERE id = ? AND user_id = ?`,
    [interview_id, user_id],
    (err, interviewRows) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (interviewRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Interview not found"
        });
      }

      db.query(
        `SELECT 
           ia.id,
           ia.question_id,
           iq.question,
           ia.answer,
           ia.score,
           ia.feedback
         FROM interview_answers ia
         JOIN interview_questions iq ON iq.id = ia.question_id
         WHERE ia.interview_id = ? AND ia.user_id = ?
         ORDER BY ia.id ASC`,
        [interview_id, user_id],
        (ansErr, answers) => {
          if (ansErr) {
            return res.status(500).json({
              success: false,
              message: ansErr.message
            });
          }

          const totalScore = answers.reduce((sum, item) => {
            return sum + Number(item.score || 0);
          }, 0);

          const averageScore = answers.length > 0
            ? (totalScore / answers.length).toFixed(1)
            : "0.0";

          return res.json({
            success: true,
            interview: interviewRows[0],
            total_questions_answered: answers.length,
            average_score: averageScore,
            answers
          });
        }
      );
    }
  );
};
const completeInterview = (req, res) => {
  const user_id = req.user.id;
  const interview_id = req.params.id;

  db.query(
    `SELECT id, status 
     FROM mock_interviews 
     WHERE id = ? AND user_id = ?`,
    [interview_id, user_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Interview not found"
        });
      }

      db.query(
        `UPDATE mock_interviews
         SET status = 'completed',
             completed_at = NOW()
         WHERE id = ? AND user_id = ?`,
        [interview_id, user_id],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({
              success: false,
              message: updateErr.message
            });
          }

          return res.status(200).json({
            success: true,
            message: "Interview completed successfully",
            interview: {
              id: Number(interview_id),
              status: "completed"
            }
          });
        }
      );
    }
  );
};

const getInterviewDashboard = (req, res) => {
  const user_id = req.user.id;

  const interviewSql = `
    SELECT
      COUNT(*) AS total_interviews,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_interviews,
      SUM(CASE WHEN status != 'completed' THEN 1 ELSE 0 END) AS pending_interviews
    FROM mock_interviews
    WHERE user_id = ?
  `;

  db.query(interviewSql, [user_id], (err, interviewRows) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    const scoreSql = `
      SELECT 
        IFNULL(AVG(score), 0) AS average_score,
        IFNULL(MAX(score), 0) AS best_score,
        COUNT(*) AS total_answers
      FROM interview_answers
      WHERE user_id = ?
    `;

    db.query(scoreSql, [user_id], (scoreErr, scoreRows) => {
      if (scoreErr) {
        return res.status(500).json({
          success: false,
          message: scoreErr.message
        });
      }

      return res.status(200).json({
        success: true,
        dashboard: {
          total_interviews: interviewRows[0].total_interviews || 0,
          completed_interviews: interviewRows[0].completed_interviews || 0,
          pending_interviews: interviewRows[0].pending_interviews || 0,
          average_score: Number(scoreRows[0].average_score || 0).toFixed(1),
          best_score: Number(scoreRows[0].best_score || 0),
          total_answers: scoreRows[0].total_answers || 0
        }
      });
    });
  });
};
const getInterviewReport = (req, res) => {
  const user_id = req.user.id;
  const interview_id = req.params.id;

  db.query(
    `SELECT id, role, experience_level, interview_type, status, created_at, completed_at
     FROM mock_interviews
     WHERE id = ? AND user_id = ?`,
    [interview_id, user_id],
    (err, interviewRows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      if (interviewRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Interview not found"
        });
      }

      db.query(
        `SELECT
           ia.id,
           ia.question_id,
           iq.question,
           ia.answer,
           ia.score,
           ia.feedback,
           ia.created_at
         FROM interview_answers ia
         JOIN interview_questions iq ON iq.id = ia.question_id
         WHERE ia.interview_id = ? AND ia.user_id = ?
         ORDER BY ia.id ASC`,
        [interview_id, user_id],
        (ansErr, answers) => {
          if (ansErr) {
            return res.status(500).json({
              success: false,
              message: ansErr.message
            });
          }

          const totalScore = answers.reduce((sum, item) => {
            return sum + Number(item.score || 0);
          }, 0);

          const averageScore = answers.length > 0
            ? Number(totalScore / answers.length).toFixed(1)
            : "0.0";

          let overallRemark = "Needs improvement";

          if (averageScore >= 8) {
            overallRemark = "Excellent performance";
          } else if (averageScore >= 6) {
            overallRemark = "Good performance";
          } else if (averageScore >= 4) {
            overallRemark = "Average performance";
          }

          return res.status(200).json({
            success: true,
            report: {
              interview: interviewRows[0],
              total_questions_answered: answers.length,
              total_score: totalScore,
              average_score: averageScore,
              overall_remark: overallRemark,
              answers
            }
          });
        }
      );
    }
  );
};
const PDFDocument = require("pdfkit");

const downloadInterviewReport = (req, res) => {
  const user_id = req.user.id;
  const interview_id = req.params.id;

  db.query(
    `SELECT id, role, experience_level, interview_type,
            status, created_at, completed_at
     FROM mock_interviews
     WHERE id = ? AND user_id = ?`,
    [interview_id, user_id],
    (err, interviewRows) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      if (interviewRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Interview not found"
        });
      }

      db.query(
        `SELECT
            iq.question,
            ia.answer,
            ia.score,
            ia.feedback
         FROM interview_answers ia
         JOIN interview_questions iq
           ON iq.id = ia.question_id
         WHERE ia.interview_id = ?
           AND ia.user_id = ?
         ORDER BY ia.id ASC`,
        [interview_id, user_id],
        (ansErr, answers) => {

          if (ansErr) {
            return res.status(500).json({
              success: false,
              message: ansErr.message
            });
          }

          const totalScore = answers.reduce(
            (sum, item) => sum + Number(item.score || 0),
            0
          );

          const averageScore =
            answers.length > 0
              ? (totalScore / answers.length).toFixed(1)
              : "0.0";

          let remark = "Needs Improvement";

          if (averageScore >= 8) {
            remark = "Excellent";
          } else if (averageScore >= 6) {
            remark = "Good";
          } else if (averageScore >= 4) {
            remark = "Average";
          }

          const doc = new PDFDocument();

          res.setHeader(
            "Content-Disposition",
            `attachment; filename=Interview_Report_${interview_id}.pdf`
          );

          res.setHeader("Content-Type", "application/pdf");

          doc.pipe(res);

          doc
            .fontSize(22)
            .text("AI Mock Interview Report", {
              align: "center"
            });

          doc.moveDown();

          doc.fontSize(14).text(`Interview ID: ${interview_id}`);
          doc.text(`Role: ${interviewRows[0].role}`);
          doc.text(
            `Experience: ${interviewRows[0].experience_level}`
          );
          doc.text(
            `Interview Type: ${interviewRows[0].interview_type}`
          );
          doc.text(`Status: ${interviewRows[0].status}`);

          doc.moveDown();

          doc.text(
            `Average Score: ${averageScore}/10`
          );

          doc.text(`Overall Remark: ${remark}`);

          doc.moveDown();

          answers.forEach((item, index) => {

            doc
              .fontSize(14)
              .text(`Question ${index + 1}:`);

            doc
              .fontSize(12)
              .text(item.question);

            doc.moveDown(0.5);

            doc.text(`Answer: ${item.answer}`);

            doc.text(`Score: ${item.score}`);

            doc.text(`Feedback: ${item.feedback}`);

            doc.moveDown();
          });

          doc.end();
        }
      );
    }
  );
};
module.exports = {
  createInterview,
  getInterviewHistory,
  getInterviewQuestions,
  submitAnswer,
  getInterviewResult,
  completeInterview,
  getInterviewDashboard,
  getInterviewReport,
  downloadInterviewReport
};