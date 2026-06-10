const db = require("../config/mysqlDb");

const getRequiredSkills = (targetRole) => {
  const role = targetRole.toLowerCase();

  if (role.includes("ios")) {
    return ["swift", "uikit", "swiftui", "mvvm", "core data", "rest api", "firebase", "app store"];
  }

  if (role.includes("node")) {
    return ["node.js", "express", "mysql", "jwt", "rest api", "swagger", "deployment"];
  }

  if (role.includes("react")) {
    return ["react", "javascript", "typescript", "redux", "html", "css", "api integration"];
  }

  return ["git", "sql", "rest api", "problem solving", "communication"];
};

const analyzeSkillGap = (req, res) => {
  const userId = req.user.id;
  const { resume_id, target_role } = req.body;

  if (!resume_id || !target_role) {
    return res.status(400).json({
      success: false,
      message: "resume_id and target_role are required"
    });
  }

  db.query(
    `SELECT resume_text FROM resume_uploads WHERE id = ? AND user_id = ?`,
    [resume_id, userId],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Resume not found"
        });
      }

      const resumeText = rows[0].resume_text.toLowerCase();
      const requiredSkills = getRequiredSkills(target_role);

      const matchedSkills = requiredSkills.filter(skill =>
        resumeText.includes(skill)
      );

      const missingSkills = requiredSkills.filter(skill =>
        !resumeText.includes(skill)
      );

      const suggestions = missingSkills.map(skill =>
        `Add or improve ${skill} skill in your resume/projects.`
      );

      db.query(
        `INSERT INTO skill_gap_analysis
         (user_id, target_role, matched_skills, missing_skills, suggestions)
         VALUES (?, ?, ?, ?, ?)`,
        [
          userId,
          target_role,
          JSON.stringify(matchedSkills),
          JSON.stringify(missingSkills),
          JSON.stringify(suggestions)
        ],
        (insertErr, result) => {
          if (insertErr) {
            return res.status(500).json({
              success: false,
              message: insertErr.message
            });
          }

          return res.status(201).json({
            success: true,
            message: "Skill gap analysis completed",
            analysis: {
              id: result.insertId,
              target_role,
              matched_skills: matchedSkills,
              missing_skills: missingSkills,
              suggestions
            }
          });
        }
      );
    }
  );
};

const getSkillGapHistory = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT * FROM skill_gap_analysis WHERE user_id = ? ORDER BY id DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      const history = rows.map(item => ({
        ...item,
        matched_skills: item.matched_skills ? JSON.parse(item.matched_skills) : [],
        missing_skills: item.missing_skills ? JSON.parse(item.missing_skills) : [],
        suggestions: item.suggestions ? JSON.parse(item.suggestions) : []
      }));

      return res.json({
        success: true,
        history
      });
    }
  );
};

module.exports = {
  analyzeSkillGap,
  getSkillGapHistory
};