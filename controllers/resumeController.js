const db = require("../config/mysqlDb");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule.default || pdfParseModule;

const mammoth = require("mammoth");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const uploadResume = async (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Resume file is required"
    });
  }

  try {
    let resumeText = "";

    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      resumeText = data.text;
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: req.file.path });
      resumeText = result.value;
    } else {
      resumeText = fs.readFileSync(req.file.path, "utf8");
    }

    db.query(
      `INSERT INTO resume_uploads 
       (user_id, file_name, file_path, resume_text)
       VALUES (?, ?, ?, ?)`,
      [userId, req.file.originalname, req.file.path, resumeText],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message
          });
        }

        return res.status(201).json({
          success: true,
          message: "Resume uploaded successfully",
          resume: {
            id: result.insertId,
            file_name: req.file.originalname
          }
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const buildFallbackAnalysis = (resumeText, jobRole) => {
  const lowerText = (resumeText || "").toLowerCase();
  const lowerRole = (jobRole || "").toLowerCase();

  let requiredSkills = [
    "communication",
    "problem solving",
    "git",
    "rest api",
    "sql"
  ];

  if (lowerRole.includes("ios")) {
    requiredSkills = [
      "swift",
      "uikit",
      "swiftui",
      "alamofire",
      "firebase",
      "core data",
      "rest api",
      "google maps",
      "git",
      "app store",
      "mvvm"
    ];
  } else if (lowerRole.includes("node")) {
    requiredSkills = [
      "node.js",
      "express",
      "mysql",
      "mongodb",
      "jwt",
      "rest api",
      "swagger",
      "authentication",
      "middleware",
      "deployment"
    ];
  } else if (lowerRole.includes("react")) {
    requiredSkills = [
      "react",
      "javascript",
      "typescript",
      "redux",
      "api integration",
      "html",
      "css",
      "git",
      "responsive design"
    ];
  }

  const foundSkills = requiredSkills.filter(skill =>
    lowerText.includes(skill)
  );

  const missingSkills = requiredSkills.filter(skill =>
    !lowerText.includes(skill)
  );

  const atsScore = Math.min(95, 40 + foundSkills.length * 5);

  const suggestions = [
    "Add measurable achievements with numbers.",
    "Mention real project impact and responsibilities.",
    "Add role-specific technical keywords.",
    "Mention architecture patterns and tools used.",
    "Keep resume bullet points action-oriented."
  ];

  return {
    ats_score: atsScore,
    job_match: jobRole,
    missing_skills: missingSkills,
    suggestions
  };
};

const analyzeResume = (req, res) => {
  const userId = req.user.id;
  const { resume_id, job_role } = req.body;

  if (!resume_id || !job_role) {
    return res.status(400).json({
      success: false,
      message: "resume_id and job_role are required"
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

      const saveAnalysis = (analysis, message) => {
        db.query(
          `UPDATE resume_uploads
           SET ats_score = ?,
               job_role = ?,
               missing_skills = ?,
               suggestions = ?
           WHERE id = ? AND user_id = ?`,
          [
            analysis.ats_score || 0,
            job_role,
            JSON.stringify(analysis.missing_skills || []),
            JSON.stringify(analysis.suggestions || []),
            resume_id,
            userId
          ],
          (updateErr) => {
            if (updateErr) {
              return res.status(500).json({
                success: false,
                message: updateErr.message
              });
            }

            return res.status(200).json({
              success: true,
              message,
              analysis
            });
          }
        );
      };

      try {
        const prompt = `
You are an ATS resume analyzer.

Job Role:
${job_role}

Resume:
${rows[0].resume_text}

Return only raw JSON. Do not use markdown. Do not wrap response in code block.

{
  "ats_score": 0,
  "job_match": "",
  "missing_skills": [],
  "suggestions": []
}
`;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt
        });

        let text = response.text || "";

        text = text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const result = JSON.parse(text);

        return saveAnalysis(result, "Resume analyzed successfully");
      } catch (error) {
        console.log("Gemini Resume Analysis Failed:", error.message);

        const fallback = buildFallbackAnalysis(
          rows[0].resume_text,
          job_role
        );

        return saveAnalysis(
          fallback,
          "Resume analyzed successfully using fallback logic"
        );
      }
    }
  );
};

const getResumeHistory = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT 
      id, file_name, job_role, ats_score, 
      missing_skills, suggestions, created_at
     FROM resume_uploads
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

      const resumes = rows.map(item => ({
        ...item,
        missing_skills: item.missing_skills
          ? JSON.parse(item.missing_skills)
          : [],
        suggestions: item.suggestions
          ? JSON.parse(item.suggestions)
          : []
      }));

      return res.json({
        success: true,
        resumes
      });
    }
  );
};
const downloadResumeReportPDF = (req, res) => {
  const userId = req.user.id;
  const resumeId = req.params.id;

  db.query(
    `SELECT id, file_name, job_role, ats_score, missing_skills, suggestions, created_at
     FROM resume_uploads
     WHERE id = ? AND user_id = ?`,
    [resumeId, userId],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Resume report not found"
        });
      }

      const resume = rows[0];

      const missingSkills = resume.missing_skills
        ? JSON.parse(resume.missing_skills)
        : [];

      const suggestions = resume.suggestions
        ? JSON.parse(resume.suggestions)
        : [];

      const doc = new PDFDocument({ margin: 40 });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Resume_ATS_Report_${resumeId}.pdf`
      );

      doc.pipe(res);

      doc.fontSize(22).text("Resume ATS Analysis Report", { align: "center" });
      doc.moveDown();

      doc.fontSize(14).text(`Resume ID: ${resume.id}`);
      doc.text(`File Name: ${resume.file_name}`);
      doc.text(`Job Role: ${resume.job_role || "N/A"}`);
      doc.text(`ATS Score: ${resume.ats_score || 0}/100`);
      doc.text(`Created At: ${resume.created_at}`);
      doc.moveDown();

      doc.fontSize(16).text("Missing Skills");
      doc.moveDown(0.5);

      if (missingSkills.length === 0) {
        doc.fontSize(12).text("No major missing skills found.");
      } else {
        missingSkills.forEach((skill, index) => {
          doc.fontSize(12).text(`${index + 1}. ${skill}`);
        });
      }

      doc.moveDown();

      doc.fontSize(16).text("Suggestions");
      doc.moveDown(0.5);

      if (suggestions.length === 0) {
        doc.fontSize(12).text("No suggestions available.");
      } else {
        suggestions.forEach((item, index) => {
          doc.fontSize(12).text(`${index + 1}. ${item}`);
        });
      }

      doc.end();
    }
  );
};

module.exports = {
  uploadResume,
  analyzeResume,
  getResumeHistory,
  downloadResumeReportPDF
};